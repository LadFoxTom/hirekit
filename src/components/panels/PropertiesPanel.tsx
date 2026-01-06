'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { X, Save, Trash2, Copy, Settings, Plus, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalContext } from '@/components/providers/ModalProvider';
import { toast } from 'react-hot-toast';

interface PropertiesPanelProps {
  viewMode?: boolean;
}

const PropertiesPanel = ({ viewMode = false }: PropertiesPanelProps) => {
  const flowStore = useFlowStore();
  const modalContext = useModalContext();
  const showPrompt = modalContext?.showPrompt;
  const { 
    selectedNode, 
    selectedEdge, 
    propertiesPanelOpen, 
    togglePropertiesPanel, 
    updateNode, 
    deleteNode
  } = flowStore;
  const [panelWidth, setPanelWidth] = useState(320); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);

  // Removed excessive debug logging to prevent console overflow

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 280;
      const maxWidth = 600;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (!propertiesPanelOpen) return null;

  const renderNodeProperties = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'question':
        return <QuestionProperties node={selectedNode} />;
      case 'condition':
        return <ConditionProperties node={selectedNode} />;
      case 'action':
        return <ActionProperties node={selectedNode} />;
      case 'wait':
        return <WaitProperties node={selectedNode} />;
      case 'api-call':
        return <ApiCallProperties node={selectedNode} />;
      default:
        return <DefaultProperties node={selectedNode} />;
    }
  };

  const renderEdgeProperties = () => {
    if (!selectedEdge) return null;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edge Label
          </label>
          <input
            type="text"
            value={selectedEdge.label || ''}
            onChange={(e) => useFlowStore.getState().updateEdge(selectedEdge.id, { label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter edge label..."
          />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: panelWidth }}
        animate={{ x: 0 }}
        exit={{ x: panelWidth }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white border-l border-gray-200 shadow-lg h-full flex flex-col"
        style={{ width: `${panelWidth}px` }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 w-1 h-full bg-transparent hover:bg-blue-300 cursor-col-resize z-10"
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Settings size={16} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedNode ? `${selectedNode.type} Properties` : 
               selectedEdge ? 'Edge Properties' : 'Properties'}
            </h3>
            {viewMode && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                View Only
              </span>
            )}
          </div>
          <button
            onClick={togglePropertiesPanel}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {selectedNode && (
            <>
              {/* Save Info */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700">
                  <strong>💡 Tip:</strong> Changes are saved automatically to the flow. 
                  Click "Save Flow" to persist to database.
                </div>
              </div>
              
              {/* Node Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Node ID</span>
                  <span className="text-xs font-mono text-gray-500">{selectedNode.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Type</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {selectedNode.type}
                  </span>
                </div>
              </div>

              {/* Properties Form */}
              {renderNodeProperties()}

              {/* Actions */}
              {!viewMode && (
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      try {
                        console.log('Save Flow button clicked');
                        const currentFlow = useFlowStore.getState().currentFlow;
                        console.log('Current flow before save:', currentFlow);
                        
                        if (!currentFlow) {
                          toast.error('No flow to save. Please create a new flow first.');
                          return;
                        }
                      
                      await useFlowStore.getState().saveFlow();
                      toast.success('Flow saved successfully!');
                    } catch (error) {
                      console.error('Save error:', error);
                      toast.error(`Failed to save flow: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Flow
                </button>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              )}
            </>
          )}

          {selectedEdge && renderEdgeProperties()}

          {!selectedNode && !selectedEdge && (
            <div className="text-center py-8 text-gray-500">
              <Settings size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Select a node or edge to edit its properties</p>
            </div>
          )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Question Properties Component
const QuestionProperties = ({ node }: { node: any }) => {
  const flowStore = useFlowStore();
  const updateNode = useFlowStore(state => state.updateNode);
  const [isSaving, setIsSaving] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  
  // Removed excessive debug logging to prevent console overflow

  // Get incoming condition connections
  const getIncomingConditions = () => {
    try {
      if (!flowStore?.currentFlow || !flowStore.currentFlow.edges || !Array.isArray(flowStore.currentFlow.edges)) {
        return [];
      }
      
      const incomingEdges = flowStore.currentFlow.edges.filter(edge => edge.target === node.id);
      const conditionConnections = [];
      
      for (const edge of incomingEdges) {
        const sourceNode = flowStore.currentFlow.nodes.find(n => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'condition') {
          conditionConnections.push({
            conditionId: sourceNode.id,
            conditionLabel: sourceNode.data?.label || `Condition ${sourceNode.id}`,
            sourceHandle: edge.sourceHandle,
            conditionType: sourceNode.data?.conditionType || 'simple'
          });
        }
      }
      
      return conditionConnections;
    } catch (error) {
      console.error('Error getting incoming conditions:', error);
      return [];
    }
  };

  // Get available condition outputs for a specific condition
  const getConditionOutputs = (conditionId: string) => {
    try {
      if (!flowStore?.currentFlow || !flowStore.currentFlow.nodes) {
        return [];
      }
      
      const conditionNode = flowStore.currentFlow.nodes.find(n => n.id === conditionId);
      if (!conditionNode || conditionNode.type !== 'condition') {
        return [];
      }
      
      const conditionType = conditionNode.data?.conditionType || 'simple';
      
      if (conditionType === 'simple') {
        return [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ];
      } else {
        // Multi-output condition
        const outputs = conditionNode.data?.condition?.outputs || [];
        return outputs.map((output: any) => ({
          value: output.value,
          label: output.label || output.value
        }));
      }
    } catch (error) {
      console.error('Error getting condition outputs:', error);
      return [];
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log('Updating question text:', newValue);
    console.log('Current node data before update:', node.data);
    
    updateNode(node.id, { 
      data: { ...node.data, question: newValue, label: newValue }
    });
    
    // Show saving indicator
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleQuestionTypeChange = (questionType: string) => {
    let updatedData = { ...node.data, questionType };
    
    // Auto-generate options for yes-no questions
    if (questionType === 'yes-no') {
      updatedData.options = [
        { id: 'yes', label: 'Yes', value: 'yes' },
        { id: 'no', label: 'No', value: 'no' }
      ];
    } else if (questionType === 'rating') {
      updatedData.options = [
        { id: '1', label: '1 - Poor', value: '1' },
        { id: '2', label: '2 - Fair', value: '2' },
        { id: '3', label: '3 - Good', value: '3' },
        { id: '4', label: '4 - Very Good', value: '4' },
        { id: '5', label: '5 - Excellent', value: '5' }
      ];
    } else if (questionType === 'text' || questionType === 'email' || questionType === 'phone') {
      // Clear options for non-multiple choice types
      updatedData.options = [];
    } else if (questionType === 'select' || questionType === 'multiple-choice') {
      // Preserve existing options for select and multiple-choice types
      if (!updatedData.options || updatedData.options.length === 0) {
        updatedData.options = [];
      }
    }
    
    updateNode(node.id, { data: updatedData });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const addOption = () => {
    if (!newOptionLabel.trim()) return;
    
    const optionValue = newOptionValue.trim() || newOptionLabel.toLowerCase().replace(/\s+/g, '_');
    const newOption = {
      id: `opt-${Date.now()}`,
      label: newOptionLabel.trim(),
      value: optionValue
    };
    
    const updatedOptions = [...currentOptions, newOption];
    
    updateNode(node.id, { 
      data: { ...node.data, options: updatedOptions }
    });
    
    setNewOptionLabel('');
    setNewOptionValue('');
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const updateOption = (optionId: string, field: 'label' | 'value', newValue: string) => {
    const updatedOptions = currentOptions.map((option: any) => 
      option.id === optionId ? { ...option, [field]: newValue } : option
    );
    
    updateNode(node.id, { 
      data: { ...node.data, options: updatedOptions }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = currentOptions.filter((option: any) => option.id !== optionId);
    
    updateNode(node.id, { 
      data: { ...node.data, options: updatedOptions }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = currentOptions.findIndex((option: any) => option.id === optionId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentOptions.length) return;
    
    const updatedOptions = [...currentOptions];
    [updatedOptions[currentIndex], updatedOptions[newIndex]] = [updatedOptions[newIndex], updatedOptions[currentIndex]];
    
    updateNode(node.id, { 
      data: { ...node.data, options: updatedOptions }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Convert simple string options to object format if needed
  const rawOptions = node.data?.options || [];
  const currentOptions = rawOptions.map((option: any, index: number) => {
    if (typeof option === 'string') {
      return {
        id: `opt-${index}`,
        label: option,
        value: option.toLowerCase().replace(/[^a-z0-9]/g, '_')
      };
    }
    return option;
  });
  
  const isMultipleChoice = node.data?.questionType === 'multiple-choice';
  const isSelect = node.data?.questionType === 'select';
  const showOptions = isMultipleChoice || isSelect;

  return (
    <div className="space-y-3">
      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <textarea
          value={node.data?.question || node.data?.label || ''}
          onChange={handleQuestionChange}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question..."
        />
        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
          <span>Current value: "{node.data?.question || node.data?.label || 'empty'}"</span>
          {isSaving && (
            <span className="text-green-600 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
              Saving...
            </span>
          )}
        </div>
      </div>

      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Type
        </label>
        <select
          value={node.data?.questionType || 'text'}
          onChange={(e) => handleQuestionTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="text">Text Input</option>
          <option value="select">Select (Dropdown)</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="yes-no">Yes/No</option>
          <option value="rating">Rating (1-5)</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        <div className="text-xs text-gray-500 mt-1">
          {node.data?.questionType === 'select' && 'Single selection dropdown'}
          {node.data?.questionType === 'multiple-choice' && 'Add custom options below'}
          {node.data?.questionType === 'yes-no' && 'Auto-generates Yes/No options'}
          {node.data?.questionType === 'rating' && 'Auto-generates 1-5 rating options'}
          {node.data?.questionType === 'text' && 'Free text input'}
          {node.data?.questionType === 'email' && 'Email validation'}
          {node.data?.questionType === 'phone' && 'Phone validation'}
        </div>
      </div>

      {/* Options */}
      {showOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isSelect ? 'Select Options' : 'Multiple Choice Options'}
          </label>
          
          {/* Add New Option */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 mb-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Add New Option</div>
            <div className="space-y-2">
              <input
                type="text"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
                placeholder="Option label (e.g., 'Student/New Graduate')"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder="Option value (e.g., 'student') - auto-generated if empty"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addOption}
                disabled={!newOptionLabel.trim()}
                className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={12} className="inline mr-1" />
                Add Option
              </button>
            </div>
          </div>

          {/* Existing Options */}
          {currentOptions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700">Current Options</div>
              {currentOptions.map((option: any, index: number) => (
                <div key={option.id} className="flex items-center space-x-1 p-1 bg-white border border-gray-200 rounded text-xs">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(option.id, 'label', e.target.value)}
                      className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Option label"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => updateOption(option.id, 'value', e.target.value)}
                      className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Option value"
                    />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <button
                      onClick={() => moveOption(option.id, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveOption(option.id, 'down')}
                      disabled={index === currentOptions.length - 1}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeOption(option.id)}
                      className="p-0.5 text-red-400 hover:text-red-600"
                      title="Remove option"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Variable Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Variable Name
        </label>
        <input
          type="text"
          value={node.data?.variableName || ''}
          onChange={(e) => updateNode(node.id, { 
            data: { ...node.data, variableName: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., career_stage, user_name"
        />
        <div className="text-xs text-gray-500 mt-1">
          This variable will store the user's response
        </div>
      </div>

      {/* Connection Configuration */}
      {(() => {
        const incomingConditions = getIncomingConditions();
        return incomingConditions.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-800 mb-2">Connection Configuration</div>
            <div className="text-xs text-blue-700 mb-3">
              This question is connected to {incomingConditions.length} condition node{incomingConditions.length !== 1 ? 's' : ''}. 
              Configure which condition output should trigger this question.
            </div>
            
            <div className="space-y-3">
              {incomingConditions.map((connection, index) => {
                const availableOutputs = getConditionOutputs(connection.conditionId);
                const currentTrigger = node.data?.conditionTriggers?.[connection.conditionId] || connection.sourceHandle;
                
                return (
                  <div key={connection.conditionId} className="bg-white p-2 rounded border border-blue-300">
                    <div className="text-xs font-medium text-blue-800 mb-1">
                      {connection.conditionLabel} ({connection.conditionType})
                    </div>
                    <div className="text-xs text-blue-600 mb-2">
                      Connected via: {connection.sourceHandle}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Trigger this question when:
                      </label>
                      <select
                        value={currentTrigger}
                        onChange={(e) => {
                          const newTriggers = { ...(node.data?.conditionTriggers || {}), [connection.conditionId]: e.target.value };
                          updateNode(node.id, { 
                            data: { ...node.data, conditionTriggers: newTriggers }
                          });
                          setIsSaving(true);
                          setTimeout(() => setIsSaving(false), 1000);
                        }}
                        className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {availableOutputs.map((output) => (
                          <option key={output.value} value={output.value}>
                            {output.label} ({output.value})
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-blue-600 mt-1">
                        This question will be triggered when the condition evaluates to "{currentTrigger}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Required Field */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={node.data?.required || false}
          onChange={(e) => updateNode(node.id, { 
            data: { ...node.data, required: e.target.checked }
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="ml-2 text-sm text-gray-700">
          Required field
        </label>
      </div>
    </div>
  );
};

// Condition Properties Component
const ConditionProperties = ({ node }: { node: any }) => {
  const updateNode = useFlowStore(state => state.updateNode);
  const flowStore = useFlowStore(state => state);
  const modalContext = useModalContext();
  const showPrompt = modalContext?.showPrompt;
  const [isSaving, setIsSaving] = useState(false);
  const [conditionType, setConditionType] = useState<'simple' | 'multi-output'>(
    node.data?.conditionType || 'simple'
  );

  // Initialize condition data if it doesn't exist
  const condition = node.data.condition || { operator: 'and', rules: [], outputs: [] };
  const rules = condition.rules || [];
  const outputs = condition.outputs || [];

  // Get available variables from question nodes
  const getAvailableVariables = () => {
    try {
      if (!flowStore?.currentFlow || !flowStore.currentFlow.nodes || !Array.isArray(flowStore.currentFlow.nodes)) {
        return [];
      }
      const questionNodes = flowStore.currentFlow.nodes.filter(n => n && n.type === 'question' && n.data?.variableName);
      return questionNodes.map(n => ({
        value: n.data.variableName,
        label: `${n.data.variableName} (${n.data.question?.substring(0, 30)}...)`,
        questionType: n.data.questionType,
        options: n.data.options || []
      }));
    } catch (error) {
      console.error('Error getting available variables:', error);
      return [];
    }
  };

  // Get available target nodes for connections
  const getAvailableTargetNodes = () => {
    try {
      if (!flowStore?.currentFlow || !flowStore.currentFlow.nodes || !Array.isArray(flowStore.currentFlow.nodes)) {
        return [];
      }
      return flowStore.currentFlow.nodes
        .filter(n => n.id !== node.id && (n.type === 'question' || n.type === 'end' || n.type === 'action'))
        .map(n => ({
          id: n.id,
          label: `${n.data?.label || n.type} (${n.type})`,
          type: n.type
        }));
    } catch (error) {
      console.error('Error getting available target nodes:', error);
      return [];
    }
  };

  // Get current connections for an output
  const getOutputConnections = (outputValue: string) => {
    try {
      if (!flowStore?.currentFlow || !flowStore.currentFlow.edges || !node) return [];
      return flowStore.currentFlow.edges.filter(edge => 
        edge.source === node.id && edge.sourceHandle === outputValue
      );
    } catch (error) {
      console.error('Error getting output connections:', error);
      return [];
    }
  };

  // Update connection for an output
  const updateOutputConnection = (outputValue: string, targetNodeId: string) => {
    try {
      if (!flowStore?.currentFlow || !node || !flowStore?.deleteEdge || !flowStore?.addEdge) return;

      // Remove existing connections for this output
      const existingEdges = flowStore.currentFlow.edges.filter(edge => 
        edge.source === node.id && edge.sourceHandle === outputValue
      );

      // Delete existing edges
      existingEdges.forEach(edge => {
        flowStore.deleteEdge(edge.id);
      });

      // Add new connection if target is selected
      if (targetNodeId && targetNodeId !== '') {
        const newEdge = {
          source: node.id,
          target: targetNodeId,
          sourceHandle: outputValue,
          targetHandle: undefined
        };
        flowStore.addEdge(newEdge);
      }
    } catch (error) {
      console.error('Error updating output connection:', error);
    }
  };

  const handleConditionTypeChange = (newType: 'simple' | 'multi-output') => {
    setConditionType(newType);
    
    // Preserve existing outputs when switching types
    let newCondition;
    if (newType === 'simple') {
      // Convert multi-output to simple: keep the first output's rules as the main rules
      const firstOutput = outputs[0];
      newCondition = {
        operator: condition.operator || 'and',
        rules: firstOutput?.rules || [],
        outputs: []
      };
    } else {
      // Convert simple to multi-output: preserve existing outputs or create default ones
      if (outputs.length > 0) {
        newCondition = {
          operator: condition.operator || 'and',
          rules: [],
          outputs: outputs
        };
      } else {
        newCondition = {
          operator: condition.operator || 'and',
          rules: [],
          outputs: [
            { id: 'output-a', label: 'Option A', value: 'A', rules: [] },
            { id: 'output-b', label: 'Option B', value: 'B', rules: [] }
          ]
        };
      }
    }
    
    updateNode(node.id, { 
      data: { 
        ...node.data, 
        conditionType: newType,
        condition: newCondition
      }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const addOutput = () => {
    const newOutput = {
      id: `output-${Date.now()}`,
      label: `Option ${String.fromCharCode(65 + outputs.length)}`,
      value: String.fromCharCode(65 + outputs.length),
      rules: []
    };
    
    const updatedCondition = {
      ...condition,
      outputs: [...outputs, newOutput]
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const updateOutput = (outputId: string, updates: any) => {
    const updatedOutputs = outputs.map((output: any) => 
      output.id === outputId ? { ...output, ...updates } : output
    );

    const updatedCondition = {
      ...condition,
      outputs: updatedOutputs
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const deleteOutput = (outputId: string) => {
    const updatedOutputs = outputs.filter((output: any) => output.id !== outputId);

    const updatedCondition = {
      ...condition,
      outputs: updatedOutputs
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const addRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    
    const updatedCondition = {
      ...condition,
      rules: [...rules, newRule]
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const updateRule = (ruleId: string, updates: any) => {
    const updatedRules = rules.map((rule: any) => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );

    const updatedCondition = {
      ...condition,
      rules: updatedRules
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const deleteRule = (ruleId: string) => {
    const updatedRules = rules.filter((rule: any) => rule.id !== ruleId);

    const updatedCondition = {
      ...condition,
      rules: updatedRules
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const addOutputRule = (outputId: string) => {
    const newRule = {
      id: `rule-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    
    const updatedOutputs = outputs.map((output: any) => 
      output.id === outputId 
        ? { ...output, rules: [...output.rules, newRule] }
        : output
    );

    const updatedCondition = {
      ...condition,
      outputs: updatedOutputs
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const updateOutputRule = (outputId: string, ruleId: string, updates: any) => {
    const updatedOutputs = outputs.map((output: any) => 
      output.id === outputId 
        ? {
            ...output,
            rules: output.rules.map((rule: any) => 
              rule.id === ruleId ? { ...rule, ...updates } : rule
            )
          }
        : output
    );

    const updatedCondition = {
      ...condition,
      outputs: updatedOutputs
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const deleteOutputRule = (outputId: string, ruleId: string) => {
    const updatedOutputs = outputs.map((output: any) => 
      output.id === outputId 
        ? { ...output, rules: output.rules.filter((rule: any) => rule.id !== ruleId) }
        : output
    );

    const updatedCondition = {
      ...condition,
      outputs: updatedOutputs
    };

    updateNode(node.id, { 
      data: { 
        ...node.data, 
        condition: updatedCondition
      }
    });

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const getOperatorDescription = (operator: string) => {
    const descriptions = {
      'equals': 'Field value equals the specified value',
      'not_equals': 'Field value does not equal the specified value',
      'contains': 'Field value contains the specified text',
      'not_contains': 'Field value does not contain the specified text',
      'starts_with': 'Field value starts with the specified text',
      'ends_with': 'Field value ends with the specified text',
      'greater_than': 'Field value is greater than the specified number',
      'less_than': 'Field value is less than the specified number',
      'is_empty': 'Field value is empty or null',
      'is_not_empty': 'Field value has a value',
      'in_list': 'Field value is in the comma-separated list',
      'not_in_list': 'Field value is not in the comma-separated list'
    };
    return (descriptions as any)[operator] || 'Unknown operator';
  };

  const getValuePlaceholder = (operator: string, selectedVariable: any) => {
    if (operator === 'is_empty' || operator === 'is_not_empty') {
      return 'No value needed';
    }
    
    if (selectedVariable?.questionType === 'multiple-choice' && selectedVariable?.options) {
      const optionValues = selectedVariable.options.map((opt: any) => opt.value).join(', ');
      return `e.g., ${optionValues} (for in_list/not_in_list)`;
    }
    
    if (operator === 'in_list' || operator === 'not_in_list') {
      return 'Comma-separated values: value1, value2, value3';
    }
    
    if (operator === 'greater_than' || operator === 'less_than') {
      return 'Enter a number';
    }
    
    return 'Enter the value to compare against';
  };

  return (
    <div className="space-y-3">
      {/* Condition Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition Type
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleConditionTypeChange('simple')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              conditionType === 'simple'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Simple (True/False)
          </button>
          <button
            onClick={() => handleConditionTypeChange('multi-output')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              conditionType === 'multi-output'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Multi-Output (A, B, C, D...)
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {conditionType === 'simple' 
            ? 'Simple condition with True/False outputs'
            : 'Advanced condition with multiple output paths (A, B, C, D, etc.)'
          }
        </div>
      </div>

      {conditionType === 'simple' ? (
        <>
          {/* Simple Condition Operator */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition Operator
        </label>
        <select
          value={condition.operator || 'and'}
          onChange={(e) => {
            updateNode(node.id, { 
              data: { 
                ...node.data, 
                condition: { 
                  ...condition, 
                  operator: e.target.value 
                }
              }
            });
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1000);
          }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="and">AND (All conditions must be true)</option>
          <option value="or">OR (Any condition can be true)</option>
        </select>
        <div className="text-xs text-gray-500 mt-1">
          {condition.operator === 'and' 
            ? 'All rules must be true for the condition to pass'
            : 'Any rule can be true for the condition to pass'
          }
        </div>
      </div>
        </>
      ) : (
        <>
          {/* Multi-Output Configuration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Output Paths
              </label>
              <button
                onClick={addOutput}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Add Output
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Each output path can have its own conditions. The first matching path will be used.
            </div>
          </div>
        </>
      )}

      {/* Simple Condition Rules */}
      {conditionType === 'simple' && (
      <div>
          <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Condition Rules
          </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {rules ? rules.length : 0} rule{(rules ? rules.length : 0) !== 1 ? 's' : ''} configured
          </span>
        </div>

        {/* Available Variables Info */}
        {(() => {
          const vars = getAvailableVariables();
          return vars && vars.length > 0 && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <div className="font-medium text-blue-800 mb-1">Available Variables:</div>
              <div className="text-blue-700">
                {vars.map((variable, index) => (
                  <span key={variable.value}>
                    <span className="font-medium">{variable.value}</span>
                    {index < vars.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Rules List */}
        <div className="space-y-2">
          {rules && rules.map((rule: any, index: number) => {
            const selectedVariable = getAvailableVariables()?.find(v => v.value === rule.field);
            return (
              <div key={rule.id} className="border border-gray-200 rounded p-2 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Rule {index + 1}</span>
                <button
                  onClick={() => deleteRule(rule.id)}
                    className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                  title="Delete rule"
                >
                  <Trash2 size={12} />
                </button>
              </div>

                <div className="space-y-2">
                  {/* Field Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variable to Check
                  </label>
                    {(() => {
                      const vars = getAvailableVariables();
                      return vars && vars.length > 0 ? (
                        <select
                          value={rule.field || ''}
                          onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select a variable...</option>
                          {vars.map((variable) => (
                            <option key={variable.value} value={variable.value}>
                              {variable.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={rule.field || ''}
                          onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g., career_stage, user_age"
                        />
                      );
                    })()}
                    {selectedVariable && (
                      <div className="text-xs text-gray-500 mt-1">
                        Type: {selectedVariable.questionType} • Options: {selectedVariable.options?.length || 0}
                      </div>
                    )}
                </div>

                  {/* Operator Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Condition Type
                  </label>
                  <select
                    value={rule.operator || 'equals'}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="contains">Contains</option>
                      <option value="not_contains">Not Contains</option>
                      <option value="starts_with">Starts With</option>
                      <option value="ends_with">Ends With</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="is_empty">Is Empty</option>
                      <option value="is_not_empty">Is Not Empty</option>
                      <option value="in_list">In List</option>
                      <option value="not_in_list">Not In List</option>
                  </select>
                    <div className="text-xs text-gray-500 mt-1">
                      {getOperatorDescription(rule.operator)}
                    </div>
                </div>

                  {/* Value Input */}
                  {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value to Compare
                  </label>
                  <input
                    type="text"
                    value={rule.value || ''}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={getValuePlaceholder(rule.operator, selectedVariable)}
                      />
                      {selectedVariable?.questionType === 'multiple-choice' && selectedVariable?.options && (
                        <div className="mt-1">
                          <div className="text-xs text-gray-500 mb-1">Available option values:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedVariable.options.map((option: any) => (
                              <button
                                key={option.value}
                                onClick={() => updateRule(rule.id, { value: option.value })}
                                className="px-1 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                title={`Click to use: ${option.value}`}
                              >
                                {option.value}
                              </button>
                            ))}
                </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Rule Preview */}
                <div className="mt-2 p-1 bg-gray-50 rounded border">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">Preview:</span>{' '}
                <span className="font-medium">{rule.field || 'field'}</span>
                    <span className="mx-1 text-gray-500">{rule.operator || 'equals'}</span>
                <span className="font-medium">"{rule.value || 'value'}"</span>
              </div>
            </div>
              </div>
            );
          })}
          
          {/* Show message when no rules exist */}
          {(!rules || rules.length === 0) && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <div className="text-gray-400 mb-1">No rules defined</div>
              <div className="text-xs">Click "Add Rule" to create a condition</div>
            </div>
          )}
        </div>

        {/* Connection Management for Simple Condition */}
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm font-medium text-green-800 mb-2">Output Connections</div>
          <div className="space-y-2">
            {/* True Connection */}
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">
                True Output → Connect to
              </label>
                    <select
                      value={(() => {
                        try {
                          const connections = getOutputConnections('true');
                          return connections.length > 0 ? connections[0].target : '';
                        } catch (error) {
                          console.error('Error getting true connections:', error);
                          return '';
                        }
                      })()}
                      onChange={(e) => updateOutputConnection('true', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                <option value="">Select target node...</option>
                {getAvailableTargetNodes().map((targetNode) => (
                  <option key={targetNode.id} value={targetNode.id}>
                    {targetNode.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* False Connection */}
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">
                False Output → Connect to
              </label>
              <select
                value={(() => {
                  try {
                    const connections = getOutputConnections('false');
                    return connections.length > 0 ? connections[0].target : '';
                  } catch (error) {
                    console.error('Error getting false connections:', error);
                    return '';
                  }
                })()}
                onChange={(e) => updateOutputConnection('false', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select target node...</option>
                {getAvailableTargetNodes().map((targetNode) => (
                  <option key={targetNode.id} value={targetNode.id}>
                    {targetNode.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Rule Button */}
        <button
          onClick={addRule}
          className="mt-3 w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={14} />
          <span>Add New Rule</span>
        </button>

        {/* Saving Indicator */}
        {isSaving && (
          <div className="text-xs text-green-600 flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
            Saving...
          </div>
        )}
      </div>
      )}

      {/* Multi-Output Configuration */}
      {conditionType === 'multi-output' && (
        <div className="space-y-3">
          {outputs.map((output: any, outputIndex: number) => (
            <div key={output.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {output.value}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{output.label}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={async () => {
                      const newLabel = await showPrompt?.('Enter new label:', output.label, 'Edit Output Label', 'Output label');
                      if (newLabel) {
                        updateOutput(output.id, { label: newLabel });
                      }
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                    title="Edit label"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => deleteOutput(output.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete output"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Output Rules */}
              <div className="space-y-2">
                {output.rules && output.rules.map((rule: any, ruleIndex: number) => {
                  const selectedVariable = getAvailableVariables()?.find(v => v.value === rule.field);
                  return (
                    <div key={rule.id} className="border border-gray-100 rounded p-2 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Rule {ruleIndex + 1}</span>
                        <button
                          onClick={() => deleteOutputRule(output.id, rule.id)}
                          className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                          title="Delete rule"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {/* Field Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Variable
                          </label>
                          {(() => {
                            const vars = getAvailableVariables();
                            return vars && vars.length > 0 ? (
                              <select
                                value={rule.field || ''}
                                onChange={(e) => updateOutputRule(output.id, rule.id, { field: e.target.value })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select variable...</option>
                                {vars.map((variable) => (
                                  <option key={variable.value} value={variable.value}>
                                    {variable.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={rule.field || ''}
                                onChange={(e) => updateOutputRule(output.id, rule.id, { field: e.target.value })}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Variable name"
                              />
                            );
                          })()}
                        </div>

                        {/* Operator Selection */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Operator
                          </label>
                          <select
                            value={rule.operator || 'equals'}
                            onChange={(e) => updateOutputRule(output.id, rule.id, { operator: e.target.value })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="equals">Equals</option>
                            <option value="not_equals">Not Equals</option>
                            <option value="contains">Contains</option>
                            <option value="starts_with">Starts With</option>
                            <option value="ends_with">Ends With</option>
                            <option value="greater_than">Greater Than</option>
                            <option value="less_than">Less Than</option>
                            <option value="is_empty">Is Empty</option>
                            <option value="is_not_empty">Is Not Empty</option>
                            <option value="in_list">In List</option>
                            <option value="not_in_list">Not In List</option>
                          </select>
                        </div>

                        {/* Value Input */}
                        {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Value
                            </label>
                            <input
                              type="text"
                              value={rule.value || ''}
                              onChange={(e) => updateOutputRule(output.id, rule.id, { value: e.target.value })}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder={getValuePlaceholder(rule.operator, selectedVariable)}
                            />
                            {selectedVariable?.questionType === 'multiple-choice' && selectedVariable?.options && (
                              <div className="mt-1">
                                <div className="text-xs text-gray-500 mb-1">Available values:</div>
                                <div className="flex flex-wrap gap-1">
                                  {selectedVariable.options.map((option: any) => (
                                    <button
                                      key={option.value}
                                      onClick={() => updateOutputRule(output.id, rule.id, { value: option.value })}
                                      className="px-1 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                    >
                                      {option.value}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Show message when no rules exist */}
                {(!output.rules || output.rules.length === 0) && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <div className="text-gray-400 mb-1">No rules defined</div>
                    <div className="text-xs">Click "Add Rule" to create a condition</div>
                  </div>
                )}

                {/* Connection Management */}
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-xs font-medium text-blue-800 mb-2">Connection</div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      Connect to Node
                    </label>
                    <select
                      value={(() => {
                        try {
                          const connections = getOutputConnections(output.value);
                          return connections.length > 0 ? connections[0].target : '';
                        } catch (error) {
                          console.error('Error getting output connections:', error);
                          return '';
                        }
                      })()}
                      onChange={(e) => updateOutputConnection(output.value, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select target node...</option>
                      {getAvailableTargetNodes().map((targetNode) => (
                        <option key={targetNode.id} value={targetNode.id}>
                          {targetNode.label}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-blue-600 mt-1">
                      {(() => {
                        try {
                          const connections = getOutputConnections(output.value);
                          return connections.length > 0 
                            ? `Connected to: ${connections[0].target}`
                            : 'No connection';
                        } catch (error) {
                          console.error('Error getting connection status:', error);
                          return 'No connection';
                        }
                      })()}
                    </div>
                  </div>
                </div>

                {/* Add Rule Button for Output */}
                <button
                  onClick={() => addOutputRule(output.id)}
                  className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus size={10} />
                  <span>Add Rule</span>
                </button>
              </div>
            </div>
          ))}

          {(!outputs || outputs.length === 0) && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No output paths configured. Click "Add Output" to create your first path.
            </div>
          )}
        </div>
      )}

      {/* Condition Preview */}
      {conditionType === 'simple' && rules && rules.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-800 mb-1">Condition Preview:</div>
          <div className="text-xs text-blue-700">
            {rules.map((rule: any, index: number) => (
              <div key={rule.id}>
                {index > 0 && <span className="text-blue-600 font-medium mx-1">{condition.operator.toUpperCase()}</span>}
                <span className="font-medium">{rule.field || 'field'}</span>
                <span className="mx-1">{rule.operator || 'equals'}</span>
                <span className="font-medium">"{rule.value || 'value'}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Output Preview */}
      {conditionType === 'multi-output' && outputs && outputs.length > 0 && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-xs font-medium text-green-800 mb-2">Multi-Output Preview:</div>
          <div className="space-y-2">
            {outputs.map((output: any, index: number) => (
              <div key={output.id} className="bg-white p-2 rounded border">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {output.value}
                  </div>
                  <span className="text-xs font-medium text-green-800">{output.label}</span>
                </div>
                {output.rules && output.rules.length > 0 ? (
                  <div className="text-xs text-green-700">
                    {output.rules.map((rule: any, ruleIndex: number) => (
                      <div key={rule.id}>
                        {ruleIndex > 0 && <span className="text-green-600 font-medium mx-1">AND</span>}
                        <span className="font-medium">{rule.field || 'field'}</span>
                        <span className="mx-1">{rule.operator || 'equals'}</span>
                        <span className="font-medium">"{rule.value || 'value'}"</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">No rules configured</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="text-xs text-green-600 flex items-center justify-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
          Saving...
        </div>
      )}
    </div>
  );
};

// Action Properties Component
const ActionProperties = ({ node }: { node: any }) => {
  const updateNode = useFlowStore(state => state.updateNode);
  const [isSaving, setIsSaving] = useState(false);

  const action = node.data.action || { type: 'set_variable', config: {} };

  const updateAction = (updates: any) => {
    const updatedAction = { ...action, ...updates };
    updateNode(node.id, { 
      data: { 
        ...node.data, 
        action: updatedAction
      }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const renderActionConfig = () => {
    switch (action.type) {
      case 'set_variable':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Variable Name
              </label>
              <input
                type="text"
                value={action.config?.variableName || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, variableName: e.target.value }
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., user_name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value
              </label>
              <input
                type="text"
                value={action.config?.value || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, value: e.target.value }
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>
        );

      case 'send_email':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                To Email
              </label>
              <input
                type="email"
                value={action.config?.to || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, to: e.target.value }
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={action.config?.subject || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, subject: e.target.value }
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Message
              </label>
              <textarea
                value={action.config?.message || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, message: e.target.value }
                })}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email message content"
              />
            </div>
          </div>
        );

      case 'send_sms':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={action.config?.to || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, to: e.target.value }
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Message
              </label>
              <textarea
                value={action.config?.message || ''}
                onChange={(e) => updateAction({ 
                  config: { ...action.config, message: e.target.value }
                })}
                rows={3}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="SMS message content"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Configuration (JSON)
            </label>
            <textarea
              value={JSON.stringify(action.config || {}, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  updateAction({ config });
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              rows={4}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              placeholder="Enter JSON configuration..."
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action Type
        </label>
        <select
          value={action.type || 'set_variable'}
          onChange={(e) => updateAction({ type: e.target.value, config: {} })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="set_variable">Set Variable</option>
          <option value="send_email">Send Email</option>
          <option value="send_sms">Send SMS</option>
          <option value="call_api">Call API</option>
          <option value="send_webhook">Send Webhook</option>
          <option value="wait">Wait</option>
        </select>
      </div>

      {renderActionConfig()}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="text-xs text-green-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
          Saving...
        </div>
      )}
    </div>
  );
};

// Wait Properties Component
const WaitProperties = ({ node }: { node: any }) => {
  const updateNode = useFlowStore(state => state.updateNode);
  const [isSaving, setIsSaving] = useState(false);

  const wait = node.data.wait || { duration: 5000, type: 'fixed' };

  const updateWait = (updates: any) => {
    const updatedWait = { ...wait, ...updates };
    updateNode(node.id, { 
      data: { 
        ...node.data, 
        wait: updatedWait
      }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const renderWaitConfig = () => {
    switch (wait.type) {
      case 'fixed':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Duration (milliseconds)
              </label>
              <input
                type="number"
                value={wait.duration || 5000}
                onChange={(e) => updateWait({ duration: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="5000"
                min="0"
              />
            </div>
            <div className="text-xs text-gray-500">
              {wait.duration ? `${wait.duration}ms = ${wait.duration / 1000}s` : 'Enter duration'}
            </div>
          </div>
        );

      case 'random':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Duration (ms)
              </label>
              <input
                type="number"
                value={wait.minDuration || 1000}
                onChange={(e) => updateWait({ minDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="1000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Duration (ms)
              </label>
              <input
                type="number"
                value={wait.maxDuration || 10000}
                onChange={(e) => updateWait({ maxDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="10000"
                min="0"
              />
            </div>
          </div>
        );

      case 'until_time':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Target Time
              </label>
              <input
                type="datetime-local"
                value={wait.targetTime || ''}
                onChange={(e) => updateWait({ targetTime: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Configuration (JSON)
            </label>
            <textarea
              value={JSON.stringify(wait.config || {}, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  updateWait({ config });
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              rows={4}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              placeholder="Enter JSON configuration..."
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Wait Type
        </label>
        <select
          value={wait.type || 'fixed'}
          onChange={(e) => updateWait({ type: e.target.value, config: {} })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="fixed">Fixed Duration</option>
          <option value="random">Random Duration</option>
          <option value="until_time">Until Specific Time</option>
          <option value="until_condition">Until Condition</option>
        </select>
      </div>

      {renderWaitConfig()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={wait.description || ''}
          onChange={(e) => updateWait({ description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Why is this wait needed?"
        />
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="text-xs text-green-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
          Saving...
        </div>
      )}
    </div>
  );
};

// API Call Properties Component
const ApiCallProperties = ({ node }: { node: any }) => {
  const updateNode = useFlowStore(state => state.updateNode);
  const [isSaving, setIsSaving] = useState(false);

  const apiCall = node.data.apiCall || { 
    method: 'GET', 
    url: '', 
    headers: {}, 
    body: null,
    timeout: 30000 
  };

  const updateApiCall = (updates: any) => {
    const updatedApiCall = { ...apiCall, ...updates };
    updateNode(node.id, { 
      data: { 
        ...node.data, 
        apiCall: updatedApiCall
      }
    });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          HTTP Method
        </label>
        <select
          value={apiCall.method || 'GET'}
          onChange={(e) => updateApiCall({ method: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="url"
          value={apiCall.url || ''}
          onChange={(e) => updateApiCall({ url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Timeout (milliseconds)
        </label>
        <input
          type="number"
          value={apiCall.timeout || 30000}
          onChange={(e) => updateApiCall({ timeout: parseInt(e.target.value) || 30000 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="30000"
          min="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headers (JSON)
        </label>
        <textarea
          value={JSON.stringify(apiCall.headers || {}, null, 2)}
          onChange={(e) => {
            try {
              const headers = JSON.parse(e.target.value);
              updateApiCall({ headers });
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder='{"Content-Type": "application/json"}'
        />
      </div>

      {(apiCall.method === 'POST' || apiCall.method === 'PUT' || apiCall.method === 'PATCH') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Request Body (JSON)
          </label>
          <textarea
            value={JSON.stringify(apiCall.body || {}, null, 2)}
            onChange={(e) => {
              try {
                const body = JSON.parse(e.target.value);
                updateApiCall({ body });
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Response Mapping (JSON)
        </label>
        <textarea
          value={JSON.stringify(apiCall.responseMapping || {}, null, 2)}
          onChange={(e) => {
            try {
              const responseMapping = JSON.parse(e.target.value);
              updateApiCall({ responseMapping });
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder='{"variable_name": "response.field"}'
        />
        <div className="text-xs text-gray-500 mt-1">
          Map response fields to flow variables
        </div>
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="text-xs text-green-600 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
          Saving...
        </div>
      )}
    </div>
  );
};

// Default Properties Component
const DefaultProperties = ({ node }: { node: any }) => {
  const updateNode = useFlowStore(state => state.updateNode);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={node.data.label || ''}
          onChange={(e) => updateNode(node.id, { 
            data: { ...node.data, label: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter label..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={node.data.description || ''}
          onChange={(e) => updateNode(node.id, { 
            data: { ...node.data, description: e.target.value }
          })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description..."
        />
      </div>
    </div>
  );
};

export default memo(PropertiesPanel);
