import React from "react";
import { TestResults } from "../../utils/testDiscovery";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface TestResultBoxProps {
  testResults: TestResults | null;
  error: string | null;
  isRunning: boolean;
}

export function TestResultBox({
  testResults,
  error,
  isRunning,
}: TestResultBoxProps) {
  
  if (isRunning) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Test Results
        </h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Running tests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Test Results
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Test Execution Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <pre className="whitespace-pre-wrap font-mono">{error}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Test Results
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No test results yet. Run tests to see output.
        </div>
      </div>
    );
  }

  const { tests, summary } = testResults;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Test Results
      </h3>
      
      {/* Summary */}
      <div className="mb-6">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${summary.total === summary.passed ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-700 dark:text-gray-300">
              {summary.passed}/{summary.total} tests passed
            </span>
          </div>
          {summary.failed > 0 && (
            <div className="flex items-center">
              <XCircle className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 dark:text-red-400">
                {summary.failed} failed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.name}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              test.status === 'passed'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center">
              {test.status === 'passed' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white font-mono">
                  {test.name}
                </div>
                {test.error && (
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {test.error}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              {test.executionTime && (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{test.executionTime}ms</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No tests found message */}
      {tests.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-sm">No #[test] functions found in the code.</div>
          <div className="text-xs mt-1">Add test functions with #[test] annotation to run tests.</div>
        </div>
      )}
    </div>
  );
}