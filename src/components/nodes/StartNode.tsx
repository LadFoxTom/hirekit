'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface StartNodeData {
  label: string;
  description?: string;
}

const StartNode = ({ data, selected }: NodeProps<StartNodeData>) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`relative group ${selected ? 'ring-2 ring-green-500' : ''}`}
    >
      {/* Connection handles on all four sides */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-green-400 border-2 border-white hover:bg-green-500 transition-colors"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-green-400 border-2 border-white hover:bg-green-500 transition-colors"
        style={{ bottom: -6 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-green-400 border-2 border-white hover:bg-green-500 transition-colors"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-green-400 border-2 border-white hover:bg-green-500 transition-colors"
        style={{ right: -6 }}
      />
      
      <div className={`
        min-w-[180px] max-w-[250px] bg-white border-2 rounded-full shadow-lg
        ${selected ? 'border-green-500' : 'border-green-200 hover:border-green-300'}
        transition-all duration-200
      `}>
        {/* Content */}
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Play size={16} className="text-green-600" />
            </div>
            <Settings size={14} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {data.label || 'Start'}
          </h3>
          
          {data.description && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Pulse Animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-400 border-2 border-white"
      />
    </motion.div>
  );
};

export default memo(StartNode);
