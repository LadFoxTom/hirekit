'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

const ConditionNode = ({ data, selected }: NodeProps) => {
  const condition = data.condition || { operator: 'and', rules: [], outputs: [] };
  const rules = condition.rules || [];
  const outputs = condition.outputs || [];
  const conditionType = data.conditionType || 'simple';

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] ${
      selected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 bg-white'
    }`}>
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
      <div className="flex items-center space-x-2 mb-3">
        <CheckSquare size={16} className="text-blue-600" />
        <span className="font-semibold text-gray-800">Condition</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {conditionType === 'multi-output' ? 'MULTI' : (condition.operator?.toUpperCase() || 'AND')}
        </span>
      </div>

      {/* Condition Rules */}
      <div className="space-y-2">
        {conditionType === 'multi-output' ? (
          outputs.length === 0 ? (
            <div className="text-sm text-gray-500 italic">
              No outputs configured
            </div>
          ) : (
            <div className="space-y-1">
              {outputs.map((output: any, index: number) => (
                <div key={output.id} className="text-xs bg-gray-100 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {output.value}
                      </div>
                      <span className="font-medium">{output.label}</span>
                    </div>
                    <span className="text-gray-500">({output.rules?.length || 0} rules)</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          rules.length === 0 ? (
            <div className="text-sm text-gray-500 italic">
              No rules configured
            </div>
          ) : (
            rules.map((rule: any, index: number) => (
              <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                <div className="font-medium">{rule.field}</div>
                <div className="text-gray-600">{rule.operator} {rule.value}</div>
              </div>
            ))
          )
        )}
      </div>

      {/* Output Handles */}
      {conditionType === 'multi-output' ? (
        <div className="mt-3">
          {outputs.length === 0 ? (
            <div className="text-xs text-gray-500 text-center">No outputs</div>
          ) : (
            <div className="flex flex-wrap gap-1 justify-center">
              {outputs.map((output: any, index: number) => (
                <div key={output.id} className="flex flex-col items-center">
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={output.value}
                    className="w-3 h-3 bg-blue-500 border-2 border-white"
                  />
                  <span className="text-xs text-blue-600 font-medium mt-1">
                    {output.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between mt-3">
            <Handle
              type="source"
              position={Position.Bottom}
              id="true"
              className="w-3 h-3 bg-green-500 border-2 border-white"
              style={{ left: '25%' }}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              id="false"
              className="w-3 h-3 bg-red-500 border-2 border-white"
              style={{ left: '75%' }}
            />
          </div>
          {/* Labels */}
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-green-600 font-medium">True</span>
            <span className="text-red-600 font-medium">False</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ConditionNode);
