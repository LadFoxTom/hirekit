'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle, Settings, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionNodeData {
  label: string;
  question?: string;
  questionType?: 'text' | 'multiple-choice' | 'yes-no' | 'rating' | 'email' | 'phone';
  options?: Array<{ id: string; label: string; value: string }>;
  required?: boolean;
  variableName?: string;
}

const QuestionNode = ({ data, selected }: NodeProps<QuestionNodeData>) => {
  const getQuestionTypeIcon = (type?: string) => {
    switch (type) {
      case 'multiple-choice':
        return '📋';
      case 'yes-no':
        return '✅❌';
      case 'rating':
        return '⭐';
      case 'email':
        return '📧';
      case 'phone':
        return '📞';
      default:
        return '💬';
    }
  };

  const getQuestionTypeLabel = (type?: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'yes-no':
        return 'Yes/No';
      case 'rating':
        return 'Rating';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      default:
        return 'Text';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative group ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ right: -6 }}
      />
      
      <div className={`
        min-w-[200px] max-w-[300px] bg-white border-2 rounded-lg shadow-lg
        ${selected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}
        transition-all duration-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <MessageCircle size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Question</span>
          </div>
          <div className="flex items-center space-x-1">
            {data.required && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                Required
              </span>
            )}
            <Settings size={14} className="text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Question Type */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getQuestionTypeIcon(data.questionType)}</span>
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {getQuestionTypeLabel(data.questionType)}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-3">
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {data.question || data.label || 'Enter your question here...'}
            </p>
          </div>

          {/* Options Preview */}
          {data.options && data.options.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Options:</p>
              <div className="space-y-1">
                {data.options.slice(0, 3).map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600 truncate">
                      {option.label}
                    </span>
                  </div>
                ))}
                {data.options.length > 3 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-400">
                      +{data.options.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Variable Name */}
          {data.variableName && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Variable:</span>
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-1 rounded">
                  {data.variableName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle size={16} className="text-green-500" />
          </motion.div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </motion.div>
  );
};

export default memo(QuestionNode);
