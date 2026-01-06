'use client';

import { memo } from 'react';
import { MessageCircle, Play, Square, GitBranch, Zap, Clock, Phone, Database, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  data: any;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Flow entry point',
    icon: <Play size={16} />,
    color: 'green',
    data: { label: 'Start', description: 'Flow begins here' }
  },
  {
    type: 'message',
    label: 'Message',
    description: 'Display a message to user',
    icon: <MessageSquare size={16} />,
    color: 'cyan',
    data: { 
      label: 'Message',
      content: 'Enter your message here...',
      messageType: 'info'
    }
  },
  {
    type: 'question',
    label: 'Question',
    description: 'Ask user a question',
    icon: <MessageCircle size={16} />,
    color: 'blue',
    data: { 
      label: 'Question',
      question: 'Enter your question here...',
      questionType: 'text',
      required: false
    }
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branch based on conditions (True/False or A,B,C,D...)',
    icon: <GitBranch size={16} />,
    color: 'purple',
    data: { 
      label: 'Condition',
      conditionType: 'simple',
      condition: { operator: 'and', rules: [], outputs: [] }
    }
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform an action',
    icon: <Zap size={16} />,
    color: 'orange',
    data: { 
      label: 'Action',
      action: { type: 'set_variable', config: {} }
    }
  },
  {
    type: 'wait',
    label: 'Wait',
    description: 'Pause flow execution',
    icon: <Clock size={16} />,
    color: 'yellow',
    data: { 
      label: 'Wait',
      timeout: 5000
    }
  },
  {
    type: 'transfer',
    label: 'Transfer',
    description: 'Transfer to human agent',
    icon: <Phone size={16} />,
    color: 'pink',
    data: { 
      label: 'Transfer',
      action: 'Transfer to human agent'
    }
  },
  {
    type: 'api-call',
    label: 'API Call',
    description: 'Make external API call',
    icon: <Database size={16} />,
    color: 'indigo',
    data: { 
      label: 'API Call',
      action: { type: 'call_api', config: {} }
    }
  },
  {
    type: 'end',
    label: 'End',
    description: 'End the flow',
    icon: <Square size={16} />,
    color: 'red',
    data: { 
      label: 'End',
      action: 'Flow completed'
    }
  }
];

const NodePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      data: data
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
      pink: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Node Palette</h3>
        <p className="text-sm text-gray-600">Drag nodes to the canvas</p>
      </div>

      <div className="space-y-2">
        {nodeTemplates.map((template, index) => (
          <motion.div
            key={template.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            draggable
            onDragStart={(event) => onDragStart(event as any, template.type, template.data)}
            className={`
              p-3 border rounded-lg cursor-move transition-all duration-200
              ${getColorClasses(template.color)}
              hover:shadow-md hover:scale-105
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white/50`}>
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">
                  {template.label}
                </h4>
                <p className="text-xs opacity-75 truncate">
                  {template.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Tip:</strong> Drag nodes to connect them</p>
          <p>🔧 <strong>Tip:</strong> Click nodes to edit properties</p>
          <p>⌨️ <strong>Tip:</strong> Use keyboard shortcuts</p>
          <p>🎯 <strong>Tip:</strong> Nodes automatically avoid overlap</p>
        </div>
      </div>
    </div>
  );
};

export default memo(NodePalette);
