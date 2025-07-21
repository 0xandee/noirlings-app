import React from 'react';
import { FileSystem } from '../../utils/fileSystem';
import { hasTests } from '../../utils/testDiscovery';
import { decodeSnippet } from '../../utils/shareSnippet';

interface TestButtonDebugProps {
  project: FileSystem;
  onRunTests?: () => Promise<void>;
}

export const TestButtonDebug: React.FC<TestButtonDebugProps> = ({ project, onRunTests }) => {
  const mainFile = project.getByPath('src/main.nr');
  
  let decodedContent = '';
  let rawContent = '';
  if (mainFile && mainFile.type === 'file') {
    rawContent = mainFile.content as string;
    try {
      decodedContent = decodeSnippet(rawContent);
    } catch {
      decodedContent = rawContent;
    }
  }
  
  const projectHasTests = mainFile && mainFile.type === 'file' && hasTests(decodedContent);
  
  const debugInfo = {
    mainFileExists: !!mainFile,
    mainFileType: mainFile?.type || 'none',
    rawCodeLength: rawContent.length,
    decodedCodeLength: decodedContent.length,
    rawCodePreview: rawContent.substring(0, 100) + '...',
    decodedCodePreview: decodedContent.substring(0, 200) + '...',
    containsTestString: decodedContent.includes('#[test]'),
    hasTestsResult: projectHasTests,
    onRunTestsProvided: !!onRunTests,
    shouldShowButton: projectHasTests && onRunTests,
    isEncoded: rawContent !== decodedContent
  };
  
  return (
    <div className="bg-gray-100 border border-gray-300 p-4 m-4 rounded text-xs font-mono">
      <h3 className="font-bold mb-2">🐛 Run Tests Button Debug Info:</h3>
      <div className="space-y-1">
        <div>Main file exists: <span className={debugInfo.mainFileExists ? 'text-green-600' : 'text-red-600'}>{debugInfo.mainFileExists ? '✅' : '❌'}</span></div>
        <div>Main file type: <span>{debugInfo.mainFileType}</span></div>
        <div>Is encoded: <span className={debugInfo.isEncoded ? 'text-yellow-600' : 'text-gray-600'}>{debugInfo.isEncoded ? '⚠️ YES' : 'No'}</span></div>
        <div>Raw code length: <span>{debugInfo.rawCodeLength}</span></div>
        <div>Decoded code length: <span>{debugInfo.decodedCodeLength}</span></div>
        <div>Contains '#[test]': <span className={debugInfo.containsTestString ? 'text-green-600' : 'text-red-600'}>{debugInfo.containsTestString ? '✅' : '❌'}</span></div>
        <div>hasTests() result: <span className={debugInfo.hasTestsResult ? 'text-green-600' : 'text-red-600'}>{debugInfo.hasTestsResult ? '✅' : '❌'}</span></div>
        <div>onRunTests provided: <span className={debugInfo.onRunTestsProvided ? 'text-green-600' : 'text-red-600'}>{debugInfo.onRunTestsProvided ? '✅' : '❌'}</span></div>
        <div>Should show button: <span className={debugInfo.shouldShowButton ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{debugInfo.shouldShowButton ? '✅ YES' : '❌ NO'}</span></div>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer">Raw code preview (click to expand)</summary>
        <pre className="mt-2 p-2 bg-white border text-xs overflow-auto max-h-32">{debugInfo.rawCodePreview}</pre>
      </details>
      <details className="mt-2">
        <summary className="cursor-pointer">Decoded code preview (click to expand)</summary>
        <pre className="mt-2 p-2 bg-white border text-xs overflow-auto max-h-32">{debugInfo.decodedCodePreview}</pre>
      </details>
    </div>
  );
};