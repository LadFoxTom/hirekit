/**
 * Demo Fallback Component
 * 
 * Shows how the Smart CV Mapping Engine works even without OpenAI API key
 * using intelligent rule-based fallback analysis.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  ArrowRight,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DemoFallbackProps {
  onProcessInput: (input: string) => void;
  isProcessing: boolean;
}

export default function DemoFallback({ onProcessInput, isProcessing }: DemoFallbackProps) {
  const [demoInput, setDemoInput] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleProcessInput = async () => {
    if (!demoInput.trim()) return;

    try {
      const result = await onProcessInput(demoInput);
      setResults(prev => [result, ...prev.slice(0, 4)]);
      setDemoInput('');
    } catch (error) {
      console.error('Demo processing failed:', error);
    }
  };

  const demoExamples = [
    "John Doe, Senior Software Engineer at Google",
    "jane.smith@email.com",
    "+1-555-123-4567",
    "React, Node.js, Python, Machine Learning",
    "5 years of experience in web development",
    "Bachelor's degree in Computer Science from MIT"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Smart CV Mapping Demo</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Experience intelligent field mapping with rule-based fallback analysis
        </motion.p>
      </div>

      {/* Demo Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Try It Out</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter some information about yourself:
            </label>
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Try: 'I am John Doe, a Senior Software Engineer at Google with 5 years of experience in React and Node.js'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <button
            onClick={handleProcessInput}
            disabled={!demoInput.trim() || isProcessing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Process with Smart Mapping
              </>
            )}
          </button>
        </div>

        {/* Example Inputs */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {demoExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setDemoInput(example)}
                className="text-left p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Results</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium text-gray-900">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">CV Update:</span>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(result.cvUpdate, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {result.warnings && result.warnings.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-orange-700">Warnings:</span>
                      <div className="mt-1 space-y-1">
                        {result.warnings.map((warning: string, i: number) => (
                          <div key={i} className="text-sm text-orange-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.suggestions && result.suggestions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">Suggestions:</span>
                      <div className="mt-1 space-y-1">
                        {result.suggestions.map((suggestion: string, i: number) => (
                          <div key={i} className="text-sm text-blue-600 flex items-center">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Smart Mapping Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">1. Intelligent Analysis</h4>
            <p className="text-sm text-gray-600">
              Analyzes input patterns, variable names, and content to determine the best CV field mapping.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">2. Smart Mapping</h4>
            <p className="text-sm text-gray-600">
              Maps responses to appropriate CV fields with high confidence using rule-based intelligence.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">3. Real-time Update</h4>
            <p className="text-sm text-gray-600">
              Updates your CV in real-time with validation and quality checks.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Fallback Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start">
          <Lightbulb className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Fallback Mode Active</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This demo is running in fallback mode using intelligent rule-based analysis. 
              For full AI-powered features, configure your OpenAI API key in the environment variables.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
