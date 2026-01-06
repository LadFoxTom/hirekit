'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';

const WaitNode = ({ data, selected }: NodeProps) => {
  const wait = data.wait || { duration: 5000, type: 'fixed' };

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${duration / 1000}s`;
    if (duration < 3600000) return `${duration / 60000}m`;
    return `${duration / 3600000}h`;
  };

  const getWaitTypeIcon = (type?: string) => {
    switch (type) {
      case 'fixed':
        return '⏱️';
      case 'random':
        return '🎲';
      case 'until_time':
        return '🕐';
      case 'until_condition':
        return '🔍';
      default:
        return '⏳';
    }
  };

  const getWaitTypeLabel = (type?: string) => {
    switch (type) {
      case 'fixed':
        return 'Fixed Time';
      case 'random':
        return 'Random Time';
      case 'until_time':
        return 'Until Time';
      case 'until_condition':
        return 'Until Condition';
      default:
        return 'Wait';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] ${
      selected 
        ? 'border-yellow-500 bg-yellow-50' 
        : 'border-gray-300 bg-white'
    }`}>
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-yellow-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-yellow-500"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <Clock size={16} className="text-yellow-600" />
        <span className="font-semibold text-gray-800">Wait</span>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
          {getWaitTypeLabel(wait.type)}
        </span>
      </div>

      {/* Wait Content */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getWaitTypeIcon(wait.type)}</span>
          <span className="text-sm text-gray-700 font-medium">
            {wait.type === 'fixed' && wait.duration && (
              <>Wait {formatDuration(wait.duration)}</>
            )}
            {wait.type === 'random' && wait.minDuration && wait.maxDuration && (
              <>Wait {formatDuration(wait.minDuration)} - {formatDuration(wait.maxDuration)}</>
            )}
            {wait.type === 'until_time' && wait.targetTime && (
              <>Wait until {new Date(wait.targetTime).toLocaleTimeString()}</>
            )}
            {wait.type === 'until_condition' && wait.condition && (
              <>Wait until condition met</>
            )}
            {!wait.duration && !wait.targetTime && !wait.condition && (
              <>Configure wait...</>
            )}
          </span>
        </div>

        {/* Wait Details */}
        {wait.description && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Reason:</div>
            <div className="mt-1">{wait.description}</div>
          </div>
        )}

        {/* Configuration Preview */}
        {wait.config && Object.keys(wait.config).length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Configuration:</div>
            <div className="mt-1">
              {Object.entries(wait.config).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-mono text-xs">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
    </div>
  );
};

export default memo(WaitNode);

