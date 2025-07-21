/**
 * Test Discovery System for Noir Code
 * Parses #[test] functions and prepares them for execution
 */

export interface NoirTest {
  name: string;
  shouldFail: boolean;
  functionBody: string;
  lineNumber: number;
  fullFunction: string;
}

export interface TestResults {
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'error';
  error?: string;
  executionTime?: number;
}

/**
 * Parses Noir code to extract all test functions
 */
export function parseTestFunctions(noirCode: string): NoirTest[] {
  const tests: NoirTest[] = [];
  const lines = noirCode.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for test annotations
    if (line.startsWith('#[test') && line.endsWith(']')) {
      const shouldFail = line.includes('should_fail');
      
      // Find the function declaration on the next non-empty line
      let functionLine = i + 1;
      while (functionLine < lines.length && lines[functionLine].trim() === '') {
        functionLine++;
      }
      
      if (functionLine < lines.length) {
        const functionDeclaration = lines[functionLine].trim();
        const functionMatch = functionDeclaration.match(/^fn\s+(\w+)\s*\([^)]*\)\s*{?/);
        
        if (functionMatch) {
          const functionName = functionMatch[1];
          
          // Extract the full function body
          const { functionBody, fullFunction } = extractFunctionBody(lines, functionLine);
          
          tests.push({
            name: functionName,
            shouldFail,
            functionBody,
            lineNumber: i + 1,
            fullFunction
          });
        }
      }
    }
  }
  
  return tests;
}

/**
 * Extracts the complete function body including braces
 */
function extractFunctionBody(lines: string[], startLine: number): { functionBody: string, fullFunction: string } {
  let braceCount = 0;
  let functionLines: string[] = [];
  let bodyStarted = false;
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    functionLines.push(line);
    
    // Count braces to find function end
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        bodyStarted = true;
      } else if (char === '}') {
        braceCount--;
        if (bodyStarted && braceCount === 0) {
          // Function complete
          const fullFunction = functionLines.join('\n');
          const functionBody = extractBodyContent(fullFunction);
          return { functionBody, fullFunction };
        }
      }
    }
  }
  
  // If we reach here, function wasn't properly closed
  const fullFunction = functionLines.join('\n');
  const functionBody = extractBodyContent(fullFunction);
  return { functionBody, fullFunction };
}

/**
 * Extracts just the content between the function braces
 */
function extractBodyContent(fullFunction: string): string {
  const match = fullFunction.match(/fn\s+\w+\s*\([^)]*\)\s*{([\s\S]*?)}/);
  return match ? match[1].trim() : '';
}

/**
 * Extracts main function information including parameters and body
 */
function extractMainFunctionLogic(originalCode: string): {
  parameters: string[],
  body: string,
  hasParameters: boolean
} {
  const mainMatch = originalCode.match(/fn\s+main\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/);
  if (!mainMatch) return { parameters: [], body: '', hasParameters: false };
  
  const params = mainMatch[1].split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);
    
  return {
    parameters: params,
    body: mainMatch[2].trim(),
    hasParameters: params.length > 0
  };
}

/**
 * Parses test function body to find function calls
 */
function parseTestFunctionCalls(testBody: string): Array<{
  functionName: string,
  arguments: string[]
}> {
  const callMatches = testBody.matchAll(/(\w+)\s*\(([^)]*)\)/g);
  return Array.from(callMatches).map(match => ({
    functionName: match[1],
    arguments: match[2].split(',').map(arg => arg.trim()).filter(a => a)
  }));
}

/**
 * Creates an inline test program for main functions with parameters
 */
function createInlineTestProgram(
  cleanedCode: string, 
  test: NoirTest, 
  mainLogic: { parameters: string[], body: string }
): string {
  // Parse the test to find main() calls
  const calls = parseTestFunctionCalls(test.functionBody);
  const mainCalls = calls.filter(c => c.functionName === 'main');
  
  if (mainCalls.length === 0) {
    // Test doesn't call main, just convert normally
    return cleanedCode + '\n' + test.fullFunction
      .replace('#[test]', '')
      .replace('#[test(should_fail)]', '')
      .replace(`fn ${test.name}()`, 'fn main()');
  }
  
  // For each main() call, create variable assignments + inline logic
  let testMainBody = '';
  
  // Handle any additional test logic (before main calls)
  const testLines = test.functionBody.split('\n');
  const nonMainLines = testLines.filter(line => !line.trim().match(/main\s*\([^)]*\)/));
  const additionalLogic = nonMainLines.join('\n').trim();
  
  if (additionalLogic) {
    testMainBody += `    ${additionalLogic}\n`;
  }
  
  mainCalls.forEach((call, index) => {
    // Extract parameter names from main function signature
    const paramNames = mainLogic.parameters.map(param => {
      const colonIndex = param.indexOf(':');
      return colonIndex > 0 ? param.substring(0, colonIndex).trim() : param.trim();
    });
    
    // Create variable assignments for main function parameters
    paramNames.forEach((paramName, i) => {
      if (call.arguments[i]) {
        testMainBody += `    let ${paramName}: Field = ${call.arguments[i]};\n`;
      }
    });
    
    // Inline the main function body
    testMainBody += `    ${mainLogic.body}\n`;
    
    if (index < mainCalls.length - 1) {
      testMainBody += '\n'; // Separate multiple calls
    }
  });
  
  const testMainFunction = `
fn main() {
${testMainBody}
}`;
  
  return cleanedCode + '\n' + testMainFunction;
}

/**
 * Creates a call-based test program for main functions without parameters (legacy approach)
 */
function createCallBasedTestProgram(cleanedCode: string, test: NoirTest): string {
  // Use the original approach for parameter-less main functions
  const testAsMainFunction = test.fullFunction
    .replace('#[test]', '')
    .replace('#[test(should_fail)]', '')
    .replace(/\bmain\s*\(/g, 'original_main(')
    .replace(`fn ${test.name}()`, 'fn main()');

  return cleanedCode + '\n' + testAsMainFunction;
}

/**
 * Creates a modified Noir program where a test function becomes the main function
 * This allows us to execute tests using the existing noir_js execution pipeline
 */
export function createTestProgram(originalCode: string, test: NoirTest): string {
  const mainLogic = extractMainFunctionLogic(originalCode);
  
  console.log('=== New Test Program Strategy ===');
  console.log('Test name:', test.name);
  console.log('Main has parameters:', mainLogic.hasParameters);
  console.log('Main parameters:', mainLogic.parameters);
  console.log('Main body:', mainLogic.body);
  
  let result;
  if (mainLogic.hasParameters) {
    // Strategy A: Inline approach for parametric main functions
    // Remove both test functions AND the original main function
    console.log('Using INLINE strategy for parametric main');
    const cleanedCode = removeTestFunctions(removeMainFunction(originalCode));
    result = createInlineTestProgram(cleanedCode, test, mainLogic);
  } else {
    // Strategy B: Current approach for parameter-less main functions
    console.log('Using CALL-BASED strategy for parameter-less main');
    const cleanedCode = removeTestFunctions(originalCode);
    const renamedCode = renameMainFunction(cleanedCode);
    result = createCallBasedTestProgram(renamedCode, test);
  }
  
  console.log('Final generated program:');
  console.log(result);
  console.log('=== End New Strategy ===');
  
  return result;
}

/**
 * Removes the main function from the code completely
 */
function removeMainFunction(code: string): string {
  const lines = code.split('\n');
  const cleanedLines: string[] = [];
  let skipFunction = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a main function declaration
    if (trimmed.match(/^fn\s+main\s*\(/)) {
      skipFunction = true;
      // Count opening brace if it's on the same line
      if (line.includes('{')) braceCount = 1;
      else braceCount = 0; // Will be counted on next line
      continue;
    }
    
    // If we're skipping the main function, track braces
    if (skipFunction) {
      for (const char of line) {
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
      }
      
      // If braces are balanced, we've finished skipping the main function
      if (braceCount === 0 && trimmed.endsWith('}')) {
        skipFunction = false;
      }
      continue;
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
}

/**
 * Renames the main function to original_main so tests can call it
 */
function renameMainFunction(code: string): string {
  // Simple regex replacement to rename main function
  return code.replace(/fn\s+main\s*\(/g, 'fn original_main(');
}

/**
 * Removes all test functions and annotations from the code
 * Keeps the original main function and other regular functions
 */
function removeTestFunctions(code: string): string {
  const lines = code.split('\n');
  const cleanedLines: string[] = [];
  let skipFunction = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a test annotation
    if (trimmed.startsWith('#[test') && trimmed.endsWith(']')) {
      skipFunction = true;
      continue;
    }
    
    // If we're skipping a test function, track braces
    if (skipFunction) {
      for (const char of line) {
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
      }
      
      // Check if we're at a function declaration
      if (trimmed.match(/^fn\s+\w+\s*\([^)]*\)\s*{?/)) {
        // Count opening brace if it's on the same line
        if (line.includes('{')) braceCount = 1;
        else braceCount = 0; // Will be counted on next line
      }
      
      // If braces are balanced, we've finished skipping this function
      if (braceCount === 0 && trimmed.endsWith('}')) {
        skipFunction = false;
      }
      continue;
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n');
}

/**
 * Checks if the given code contains test functions
 */
export function hasTests(noirCode: string): boolean {
  // Check for #[test] annotations anywhere in the code
  return /#\[test(\(should_fail\))?\]/.test(noirCode);
}

/**
 * Extracts just the main function from Noir code
 */
export function extractMainFunction(noirCode: string): string | null {
  const lines = noirCode.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^fn\s+main\s*\(/)) {
      const { fullFunction } = extractFunctionBody(lines, i);
      return fullFunction;
    }
  }
  
  return null;
}