'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Zap, Settings } from 'lucide-react';

const ActionNode = ({ data, selected }: NodeProps) => {
  const action = data.action || { type: 'set_variable', config: {} };

  const getActionTypeIcon = (type?: string) => {
    switch (type) {
      case 'set_variable':
        return '📝';
      case 'call_api':
        return '🌐';
      case 'send_webhook':
        return '🔗';
      case 'wait':
        return '⏱️';
      case 'send_email':
        return '📧';
      case 'send_sms':
        return '📱';
      default:
        return '⚡';
    }
  };

  const getActionTypeLabel = (type?: string) => {
    switch (type) {
      case 'set_variable':
        return 'Set Variable';
      case 'call_api':
        return 'API Call';
      case 'send_webhook':
        return 'Webhook';
      case 'wait':
        return 'Wait';
      case 'send_email':
        return 'Send Email';
      case 'send_sms':
        return 'Send SMS';
      default:
        return 'Action';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] ${
      selected 
        ? 'border-orange-500 bg-orange-50' 
        : 'border-gray-300 bg-white'
    }`}>
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-orange-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-orange-500"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <Zap size={16} className="text-orange-600" />
        <span className="font-semibold text-gray-800">Action</span>
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
          {getActionTypeLabel(action.type)}
        </span>
      </div>

      {/* Action Content */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getActionTypeIcon(action.type)}</span>
          <span className="text-sm text-gray-700 font-medium">
            {action.type === 'set_variable' && action.config?.variableName && (
              <>Set {action.config.variableName}</>
            )}
            {action.type === 'call_api' && action.config?.url && (
              <>Call {action.config.url}</>
            )}
            {action.type === 'send_webhook' && action.config?.url && (
              <>Webhook to {action.config.url}</>
            )}
            {action.type === 'wait' && action.config?.duration && (
              <>Wait {action.config.duration}ms</>
            )}
            {action.type === 'send_email' && action.config?.to && (
              <>Email to {action.config.to}</>
            )}
            {action.type === 'send_sms' && action.config?.to && (
              <>SMS to {action.config.to}</>
            )}
            {!action.config && (
              <>Configure action...</>
            )}
          </span>
        </div>

        {/* Action Details */}
        {action.config && Object.keys(action.config).length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Configuration:</div>
            <div className="mt-1">
              {Object.entries(action.config).map(([key, value]) => (
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
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  );
};

export default memo(ActionNode);

