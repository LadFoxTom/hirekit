'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageNodeData {
  label: string;
  content?: string;
  messageType?: 'welcome' | 'completion' | 'info' | 'warning' | 'error';
}

const MessageNode = ({ data, selected }: NodeProps<MessageNodeData>) => {
  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case 'welcome':
        return '👋';
      case 'completion':
        return '🎉';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '💬';
    }
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'welcome':
        return 'bg-green-50 border-green-200';
      case 'completion':
        return 'bg-blue-50 border-blue-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px] ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      } ${getMessageTypeColor(data.messageType)}`}
    >
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getMessageTypeIcon(data.messageType)}</span>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            Message
          </span>
        </div>
        <CheckCircle className="w-4 h-4 text-green-500" />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Message Title */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            {data.label || 'Message'}
          </h3>
        </div>

        {/* Message Content */}
        {data.content && (
          <div className="mb-2">
            <p className="text-xs text-gray-600 leading-relaxed">
              {data.content}
            </p>
          </div>
        )}

        {/* Message Type Indicator */}
        {data.messageType && (
          <div className="mt-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {data.messageType}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(MessageNode);
