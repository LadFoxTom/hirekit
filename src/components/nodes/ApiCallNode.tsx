'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Database, Globe } from 'lucide-react';

const ApiCallNode = ({ data, selected }: NodeProps) => {
  const apiCall = data.apiCall || { 
    method: 'GET', 
    url: '', 
    headers: {}, 
    body: null,
    timeout: 30000 
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-700';
      case 'POST':
        return 'bg-blue-100 text-blue-700';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      case 'PATCH':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return '📥';
      case 'POST':
        return '📤';
      case 'PUT':
        return '🔄';
      case 'DELETE':
        return '🗑️';
      case 'PATCH':
        return '🔧';
      default:
        return '🌐';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] ${
      selected 
        ? 'border-indigo-500 bg-indigo-50' 
        : 'border-gray-300 bg-white'
    }`}>
      {/* Connection handles on all four sides */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-indigo-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-indigo-500"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <Database size={16} className="text-indigo-600" />
        <span className="font-semibold text-gray-800">API Call</span>
        <span className={`text-xs px-2 py-1 rounded-full ${getMethodColor(apiCall.method)}`}>
          {apiCall.method}
        </span>
      </div>

      {/* API Call Content */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getMethodIcon(apiCall.method)}</span>
          <span className="text-sm text-gray-700 font-medium truncate">
            {apiCall.url ? (
              <span title={apiCall.url}>{apiCall.url}</span>
            ) : (
              'Configure API endpoint...'
            )}
          </span>
        </div>

        {/* URL Display */}
        {apiCall.url && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Endpoint:</div>
            <div className="mt-1 font-mono text-xs break-all">{apiCall.url}</div>
          </div>
        )}

        {/* Configuration Preview */}
        {(apiCall.headers || apiCall.body || apiCall.timeout) && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Configuration:</div>
            <div className="mt-1 space-y-1">
              {apiCall.timeout && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Timeout:</span>
                  <span className="font-mono text-xs">{apiCall.timeout}ms</span>
                </div>
              )}
              {apiCall.headers && Object.keys(apiCall.headers).length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Headers:</span>
                  <span className="font-mono text-xs">{Object.keys(apiCall.headers).length}</span>
                </div>
              )}
              {apiCall.body && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Body:</span>
                  <span className="font-mono text-xs">Configured</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Handling */}
        {apiCall.responseMapping && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium">Response Mapping:</div>
            <div className="mt-1">
              {Object.entries(apiCall.responseMapping).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-mono text-xs">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handles */}
      <div className="flex justify-between mt-3">
        <Handle
          type="source"
          position={Position.Bottom}
          id="success"
          className="w-3 h-3 bg-green-500 border-2 border-white"
          style={{ left: '25%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="error"
          className="w-3 h-3 bg-red-500 border-2 border-white"
          style={{ left: '75%' }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 text-xs">
        <span className="text-green-600 font-medium">Success</span>
        <span className="text-red-600 font-medium">Error</span>
      </div>
    </div>
  );
};

export default memo(ApiCallNode);

