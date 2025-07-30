'use client';

import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestCase {
  input: any;
  expected: any;
  description: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  examples: Array<{
    input: any;
    output: any;
    explanation?: string;
  }>;
  testCases: TestCase[];
  starterCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestRunnerProps {
  problem: Problem | null;
  onRunTests: () => void;
  canRun: boolean;
}

export default function TestRunner({ problem, onRunTests, canRun }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResults, setLastResults] = useState<Array<{
    passed: boolean;
    input: any;
    expected: any;
    actual?: any;
    error?: string;
  }> | null>(null);

  const handleRunTests = async () => {
    if (!canRun || isRunning) return;
    
    setIsRunning(true);
    onRunTests();
    
    // Simulate test running time
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  if (!problem) {
    return (
      <div className="text-center text-gray-400 py-12">
        <AlertCircle className="mx-auto mb-4" size={48} />
        <p>Waiting for battle to start...</p>
        <div className="mt-4 animate-pulse text-2xl">⚔️</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Problem Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">{problem.title}</h2>
          <span className={`px-2 py-1 rounded text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty.toUpperCase()}
          </span>
        </div>
        
        <div className="text-gray-300 leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Examples */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Examples:</h3>
        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="font-mono text-sm">
                <div className="text-blue-300">
                  <span className="text-gray-400">Input:</span> {JSON.stringify(example.input)}
                </div>
                <div className="text-green-300 mt-1">
                  <span className="text-gray-400">Output:</span> {JSON.stringify(example.output)}
                </div>
                {example.explanation && (
                  <div className="text-gray-400 mt-2 text-xs">
                    {example.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Tests Button */}
      <div className="mb-4">
        <button
          onClick={handleRunTests}
          disabled={!canRun || isRunning}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
            canRun && !isRunning
              ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transform hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Running Tests...</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Test Results */}
      {lastResults && (
        <div className="flex-1 overflow-auto">
          <h3 className="text-white font-semibold mb-3">Test Results:</h3>
          <div className="space-y-2">
            {lastResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  result.passed
                    ? 'bg-green-900 bg-opacity-30 border-green-400'
                    : 'bg-red-900 bg-opacity-30 border-red-400'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {result.passed ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <XCircle className="text-red-400" size={16} />
                  )}
                  <span className="text-white font-semibold">
                    Test Case {index + 1}
                  </span>
                </div>
                
                <div className="font-mono text-xs space-y-1">
                  <div className="text-blue-300">
                    Input: {JSON.stringify(result.input)}
                  </div>
                  <div className="text-green-300">
                    Expected: {JSON.stringify(result.expected)}
                  </div>
                  {result.actual !== undefined && (
                    <div className={result.passed ? 'text-green-300' : 'text-red-300'}>
                      Actual: {JSON.stringify(result.actual)}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-red-300">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle Tips */}
      <div className="mt-4 p-3 bg-purple-900 bg-opacity-30 rounded-lg">
        <div className="text-purple-300 text-sm">
          <div className="font-semibold mb-1">⚡ Battle Tips:</div>
          <ul className="text-xs space-y-1">
            <li>• Press Ctrl/Cmd + Enter to run tests quickly</li>
            <li>• Focus on correctness first, then optimization</li>
            <li>• Watch your opponent's progress in real-time!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}