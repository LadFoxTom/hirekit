/**
 * Flow to Mapping Integration Component
 * 
 * Provides seamless integration between Flow Designer and Smart Mapping
 * allowing users to configure mapping immediately after creating a flow
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Target,
  CheckCircle,
  Settings,
  Eye,
  Play,
  Save,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FlowToMappingIntegrationProps {
  flowId: string;
  flowName: string;
  flowData: any;
  onComplete?: () => void;
}

export default function FlowToMappingIntegration({
  flowId,
  flowName,
  flowData,
  onComplete
}: FlowToMappingIntegrationProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'save' | 'mapping' | 'preview' | 'live'>('save');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveFlow = async () => {
    setIsProcessing(true);
    try {
      // Save the flow
      const response = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: flowId,
          name: flowName,
          data: flowData,
          isActive: true,
          isDefault: false,
          flowType: 'custom',
          version: '1.0.0',
          createdBy: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success('Flow saved successfully!');
        setCurrentStep('mapping');
      } else {
        throw new Error('Failed to save flow');
      }
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error('Failed to save flow');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfigureMapping = () => {
    // Navigate to smart mapping with the flow pre-selected
    router.push(`/adminx/smart-mapping?flowId=${flowId}&step=mapping`);
  };

  const handlePreviewMapping = () => {
    router.push(`/adminx/smart-mapping?flowId=${flowId}&step=preview`);
  };

  const handleSetLive = () => {
    router.push(`/adminx/smart-mapping?flowId=${flowId}&step=live`);
  };

  const steps = [
    {
      id: 'save',
      title: 'Save Flow',
      description: 'Save your flow design',
      icon: Save,
      action: handleSaveFlow,
      color: 'bg-blue-500'
    },
    {
      id: 'mapping',
      title: 'Configure Mapping',
      description: 'Map flow data to CV fields',
      icon: Target,
      action: handleConfigureMapping,
      color: 'bg-purple-500'
    },
    {
      id: 'preview',
      title: 'Preview Results',
      description: 'See how data will appear in CV',
      icon: Eye,
      action: handlePreviewMapping,
      color: 'bg-green-500'
    },
    {
      id: 'live',
      title: 'Go Live',
      description: 'Activate your flow',
      icon: Play,
      action: handleSetLive,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-4"
            >
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Flow Created Successfully!</h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              Your flow "{flowName}" is ready. Complete these steps to make it live.
            </motion.p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      currentStep === step.id
                        ? step.color
                        : currentStep === 'save' && step.id === 'save'
                        ? step.color
                        : 'bg-gray-200'
                    } text-white transition-all duration-300`}
                  >
                    <step.icon className="w-6 h-6" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep === 'save' && step.id === 'save'
                        ? 'bg-blue-500'
                        : currentStep === 'mapping' && (step.id === 'save' || step.id === 'mapping')
                        ? 'bg-purple-500'
                        : currentStep === 'preview' && (step.id === 'save' || step.id === 'mapping' || step.id === 'preview')
                        ? 'bg-green-500'
                        : currentStep === 'live'
                        ? 'bg-orange-500'
                        : 'bg-gray-200'
                    } transition-all duration-300`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 rounded-lg p-6 mb-6"
          >
            {currentStep === 'save' && (
              <div className="text-center">
                <Save className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Your Flow</h3>
                <p className="text-gray-600 mb-6">
                  Save your flow design to make it available for mapping and deployment.
                </p>
                <button
                  onClick={handleSaveFlow}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? 'Saving...' : 'Save Flow'}
                </button>
              </div>
            )}

            {currentStep === 'mapping' && (
              <div className="text-center">
                <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure Smart Mapping</h3>
                <p className="text-gray-600 mb-6">
                  Use our revolutionary AI-powered system to map your flow data to CV fields with intelligent precision.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">AI Analysis</h4>
                    <p className="text-sm text-gray-600">95%+ mapping accuracy</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Visual Interface</h4>
                    <p className="text-sm text-gray-600">Drag-and-drop simplicity</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Smart Learning</h4>
                    <p className="text-sm text-gray-600">Improves over time</p>
                  </div>
                </div>
                <button
                  onClick={handleConfigureMapping}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Configure Mapping
                </button>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="text-center">
                <Eye className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview Your Results</h3>
                <p className="text-gray-600 mb-6">
                  See exactly how your mapped data will appear in the CV document.
                </p>
                <button
                  onClick={handlePreviewMapping}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Preview CV
                </button>
              </div>
            )}

            {currentStep === 'live' && (
              <div className="text-center">
                <Play className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Go Live!</h3>
                <p className="text-gray-600 mb-6">
                  Activate your flow and make it available to users.
                </p>
                <button
                  onClick={handleSetLive}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Set Live
                </button>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (onComplete) onComplete();
                else router.push('/adminx/flows');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep !== 'save' && (
                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(s => s.id === currentStep);
                    if (currentIndex > 0) {
                      setCurrentStep(steps[currentIndex - 1].id as any);
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep !== 'live' && (
                <button
                  onClick={() => {
                    const currentIndex = steps.findIndex(s => s.id === currentStep);
                    if (currentIndex < steps.length - 1) {
                      setCurrentStep(steps[currentIndex + 1].id as any);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
