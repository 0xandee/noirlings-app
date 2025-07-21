/**
 * Test Runner for Noir Tests
 * Orchestrates test execution using the existing compilation pipeline
 */

import { Noir } from '@noir-lang/noir_js';
import { FileSystem } from './fileSystem';
import { compileCode } from './generateProof';
import { parseTestFunctions, createTestProgram, TestResults, TestResult, NoirTest } from './testDiscovery';
import { decodeSnippet } from './shareSnippet';

/**
 * Executes all tests found in the provided file system
 */
export async function executeTests(fileSystem: FileSystem): Promise<TestResults> {
  const mainFile = fileSystem.getByPath('src/main.nr');
  if (!mainFile || mainFile.type !== 'file') {
    throw new Error('Could not find main.nr file');
  }

  // Decode the content if it's encoded
  let noirCode = mainFile.content as string;
  try {
    noirCode = decodeSnippet(noirCode);
  } catch {
    // If decoding fails, use content as-is (might already be plain text)
    // noirCode remains unchanged
  }
  
  const tests = parseTestFunctions(noirCode);
  
  if (tests.length === 0) {
    return {
      tests: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };
  }

  const testResults: TestResult[] = [];
  
  // Execute each test individually
  for (const test of tests) {
    const startTime = Date.now();
    const result = await executeIndividualTest(fileSystem, test, noirCode);
    result.executionTime = Date.now() - startTime;
    testResults.push(result);
  }

  // Calculate summary
  const summary = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed' || r.status === 'error').length
  };

  return {
    tests: testResults,
    summary
  };
}

/**
 * Executes a single test function
 */
async function executeIndividualTest(
  originalFileSystem: FileSystem, 
  test: NoirTest, 
  originalCode: string
): Promise<TestResult> {
  try {
    // Create a modified program where the test becomes the main function
    const testProgram = createTestProgram(originalCode, test);
    
    // Create a new file system with the test program
    const testFileSystem = createTestFileSystem(originalFileSystem, testProgram);
    
    // Compile the test program
    const compiled = await compileCode(testFileSystem);
    
    // Execute the test
    const noir = new Noir(compiled);
    await noir.execute({}); // Tests typically have no inputs
    
    // If we reach here without throwing, the test passed
    // For should_fail tests, this means the test actually failed
    if (test.shouldFail) {
      return {
        name: test.name,
        status: 'failed',
        error: 'Test was expected to fail but passed'
      };
    }
    
    return {
      name: test.name,
      status: 'passed'
    };
    
  } catch (error) {
    // If should_fail test throws an error, it actually passed
    if (test.shouldFail) {
      return {
        name: test.name,
        status: 'passed'
      };
    }
    
    // Regular test that failed
    return {
      name: test.name,
      status: 'error',
      error: formatTestError(error)
    };
  }
}

/**
 * Creates a new file system with the test program as main.nr
 */
function createTestFileSystem(originalFileSystem: FileSystem, testProgram: string): FileSystem {
  // Create new FileSystem with modified main.nr
  const newFileSystem = new FileSystem({
    name: 'root',
    type: 'folder',
    items: [
      {
        name: 'Nargo.toml',
        type: 'file',
        content: originalFileSystem.getByPath('Nargo.toml')?.content || getDefaultCargoToml()
      },
      {
        name: 'src',
        type: 'folder',
        items: [
          {
            name: 'main.nr',
            type: 'file',
            content: testProgram
          }
        ]
      }
    ]
  });
  
  return newFileSystem;
}

/**
 * Formats error messages for better readability
 */
function formatTestError(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    // Extract meaningful error messages from Noir execution errors
    let message = error.message;
    
    // Handle common assertion failures
    if (message.includes('assertion failed')) {
      return 'Assertion failed';
    }
    
    if (message.includes('constraint was not satisfied')) {
      return 'Constraint not satisfied (assertion failed)';
    }
    
    // Handle index out of bounds
    if (message.includes('index out of bounds')) {
      return 'Index out of bounds';
    }
    
    // Handle type errors
    if (message.includes('type error')) {
      return 'Type error in test';
    }
    
    // Return cleaned up message
    return message.split('\n')[0]; // Take first line only
  }
  
  return 'Unknown test error';
}

/**
 * Default Nargo.toml content for test execution
 */
function getDefaultCargoToml(): string {
  return `[package]
name = "test"
type = "bin"
authors = [""]
compiler_version = ">=0.36.0"

[dependencies]`;
}

/**
 * Validates that the file system contains the necessary files for testing
 */
export function validateFileSystemForTesting(fileSystem: FileSystem): string[] {
  const errors: string[] = [];
  
  // Check for main.nr
  const mainFile = fileSystem.getByPath('src/main.nr');
  if (!mainFile) {
    errors.push('Missing src/main.nr file');
  }
  
  // Check for Nargo.toml
  const cargoFile = fileSystem.getByPath('Nargo.toml');
  if (!cargoFile) {
    errors.push('Missing Nargo.toml file');
  }
  
  return errors;
}