'use client';

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Edit3,
  MoreVertical
} from 'lucide-react';
import { SmartNode, NodeVariant, ALL_VARIANTS } from '@/types/flow-redesign';

interface UnifiedNodeProps extends NodeProps<SmartNode> {
  onEdit?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
}

const UnifiedNode = memo(({ 
  data, 
  selected, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: UnifiedNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Handle inline editing
  const handleTitleEdit = useCallback((newTitle: string) => {
    // This would update the node title
    console.log('Updating title:', newTitle);
  }, []);

  // Handle quick actions
  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'edit':
        onEdit?.(data.id);
        break;
      case 'duplicate':
        onDuplicate?.(data.id);
        break;
      case 'delete':
        onDelete?.(data.id);
        break;
    }
  }, [data.id, onEdit, onDuplicate, onDelete]);

  // Get variant configuration
  const variant = (ALL_VARIANTS as any)[data.data.nodeType]?.[data.variant] as NodeVariant;
  
  if (!variant) {
    console.error(`Unknown variant: ${data.data.nodeType}.${data.variant}`);
    return null;
  }

  // Determine node size based on complexity
  const getNodeSize = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return { width: 180, height: 60 };
      case 'standard':
        return { width: 220, height: 80 };
      case 'complex':
        return { width: 280, height: 120 };
      default:
        return { width: 220, height: 80 };
    }
  };

  const nodeSize = getNodeSize(variant.complexity);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'configured':
        return { color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-50' };
      case 'incomplete':
        return { color: 'text-yellow-600', icon: Clock, bg: 'bg-yellow-50' };
      case 'error':
        return { color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50' };
      default:
        return { color: 'text-gray-600', icon: Clock, bg: 'bg-gray-50' };
    }
  };

  const statusInfo = getStatusInfo(data.config.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`relative group ${nodeSize.width}px ${nodeSize.height}px`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Node Container */}
      <div
        className={`
          relative w-full h-full rounded-lg border-2 shadow-lg transition-all duration-200
          ${selected 
            ? 'border-blue-500 shadow-blue-200' 
            : 'border-gray-200 hover:border-gray-300'
          }
          ${statusInfo.bg}
          ${data.visualState.hasErrors ? 'border-red-300 bg-red-50' : ''}
        `}
        style={{
          borderLeftColor: variant.color,
          borderLeftWidth: '4px'
        }}
      >
        {/* Input Handle */}
        {data.type !== 'flow' || data.variant !== 'start' ? (
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-gray-400 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        ) : null}

        {/* Node Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Icon */}
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: variant.color }}
            >
              {variant.icon}
            </div>

            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800 truncate text-sm">
                  {data.config.title || variant.name}
                </h3>
                <StatusIcon 
                  size={14} 
                  className={`${statusInfo.color} flex-shrink-0`}
                />
              </div>
              
              {/* Subtitle */}
              <p className="text-xs text-gray-600 truncate">
                {data.config.description || variant.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-1"
              >
                <button
                  onClick={() => handleQuickAction('edit')}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Edit node"
                >
                  <Edit3 size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleQuickAction('duplicate')}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Duplicate node"
                >
                  <MoreVertical size={14} className="text-gray-600" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Node Body - Expandable for complex nodes */}
        {variant.complexity === 'complex' && (
          <div className="px-3 pb-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              <span>{isExpanded ? 'Less' : 'More'}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  {/* Configuration Preview */}
                  <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                    <div className="font-medium mb-1">Configuration:</div>
                    {Object.entries(data.config.variantConfig).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className="font-mono text-xs truncate max-w-20">
                          {String(value).substring(0, 20)}
                          {String(value).length > 20 ? '...' : ''}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleQuickAction('edit')}
                      className="flex-1 px-2 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => handleQuickAction('duplicate')}
                      className="flex-1 px-2 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                    >
                      Duplicate
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Output Handles */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
          {data.type === 'logic' && data.variant === 'condition' ? (
            // Multiple outputs for condition nodes
            <div className="flex space-x-2">
              {data.config.variantConfig.outputs?.map((output: any, index: number) => (
                <div key={output.id} className="flex flex-col items-center">
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={output.value}
                    className="w-3 h-3 border-2 border-white"
                    style={{ 
                      backgroundColor: variant.color,
                      left: `${25 + (index * 25)}%`
                    }}
                  />
                  <span className="text-xs text-gray-600 mt-1">
                    {output.value}
                  </span>
                </div>
              )) || (
                <Handle
                  type="source"
                  position={Position.Bottom}
                  className="w-3 h-3 border-2 border-white"
                  style={{ backgroundColor: variant.color }}
                />
              )}
            </div>
          ) : data.type === 'integration' && data.variant === 'api' ? (
            // Success/Error outputs for API nodes
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="success"
                  className="w-3 h-3 border-2 border-white bg-green-500"
                />
                <span className="text-xs text-green-600 mt-1">Success</span>
              </div>
              <div className="flex flex-col items-center">
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="error"
                  className="w-3 h-3 border-2 border-white bg-red-500"
                />
                <span className="text-xs text-red-600 mt-1">Error</span>
              </div>
            </div>
          ) : data.type !== 'flow' || data.variant !== 'end' ? (
            // Single output for most nodes
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: variant.color }}
            />
          ) : null}
        </div>

        {/* Error Indicator */}
        {data.visualState.hasErrors && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle size={8} className="text-white" />
          </div>
        )}

        {/* Selection Indicator */}
        {selected && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
});

UnifiedNode.displayName = 'UnifiedNode';

export default UnifiedNode;