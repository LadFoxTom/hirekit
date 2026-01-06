'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Square, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface EndNodeData {
  label: string;
  description?: string;
  action?: string;
}

const EndNode = ({ data, selected }: NodeProps<EndNodeData>) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative group ${selected ? 'ring-2 ring-red-500' : ''}`}
    >
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-red-400 border-2 border-white hover:bg-red-500"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-red-400 border-2 border-white hover:bg-red-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-red-400 border-2 border-white hover:bg-red-500"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-red-400 border-2 border-white hover:bg-red-500"
      />

      <div className={`
        min-w-[180px] max-w-[250px] bg-white border-2 rounded-lg shadow-lg
        ${selected ? 'border-red-500' : 'border-red-200 hover:border-red-300'}
        transition-all duration-200
      `}>
        {/* Content */}
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Square size={16} className="text-red-600" />
            </div>
            <Settings size={14} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {data.label || 'End'}
          </h3>
          
          {data.description && (
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              {data.description}
            </p>
          )}

          {data.action && (
            <div className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
              {data.action}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(EndNode);
