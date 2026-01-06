'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import FlowEditor from '@/components/flow/FlowEditor';
import { useFlowStore } from '@/stores/flowStore';
import { ChatbotFlow } from '@/types/flow';

interface QuestionFlowDesignerProps {
  questions: any[];
  onFlowUpdate: (flow: any) => void;
  onClose: () => void;
  existingFlow?: string | any; // Support for flow ID or flow object
  viewMode?: boolean; // Add view mode support
}

export default function QuestionFlowDesigner({ questions, onFlowUpdate, onClose, existingFlow, viewMode = false }: QuestionFlowDesignerProps) {
  const { currentFlow, importFlow, loadFlow } = useFlowStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const loadFlowFromTemplate = useCallback(async (flowId: string) => {
    try {
      // First try to load from API (for saved flows)
      try {
        await loadFlow(flowId);
        return;
      } catch (error) {
        console.log('Flow not found in API, trying template files...');
      }

      // If not found in API, try to load from template files
      const templatePath = `/templates/${flowId}.json`;
      const response = await fetch(templatePath);
      
      if (response.ok) {
        const templateFlow = await response.json();
        console.log('Loaded template flow:', templateFlow);
        importFlow(JSON.stringify(templateFlow));
      } else {
        throw new Error(`Template flow not found: ${flowId}`);
      }
    } catch (error) {
      console.error('Failed to load flow:', error);
      toast.error(`Failed to load flow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [loadFlow, importFlow]);

  useEffect(() => {
    // If we have an existing flow, load it
    if (existingFlow && !isInitialized) {
      console.log('Loading existing flow:', existingFlow);
      
      // If existingFlow is a string (flow ID), try to load it
      if (typeof existingFlow === 'string') {
        loadFlowFromTemplate(existingFlow);
      } else if (existingFlow.data) {
        // If it's an object with data property, import it
        importFlow(JSON.stringify(existingFlow.data));
      } else if (existingFlow.nodes && existingFlow.edges) {
        // If it's a flow object with nodes and edges directly, import it
        console.log('Importing flow with nodes and edges:', existingFlow);
        console.log('Nodes count:', existingFlow.nodes.length);
        console.log('Edges count:', existingFlow.edges.length);
        importFlow(JSON.stringify(existingFlow));
      }
      setIsInitialized(true);
      return;
    }
    
    // Convert questions to a flow format (only for new flows)
    if (!isInitialized && questions && questions.length > 0 && !existingFlow) {
      const flowData: ChatbotFlow = {
        id: 'cv-flow-' + Date.now(),
        name: 'CV Builder Flow',
        description: 'Flow for CV builder questions',
        version: '1.0.0',
        nodes: [
          // Start node
          {
            id: 'start',
            type: 'start' as const,
            position: { x: 250, y: 50 },
            data: { label: 'Start', description: 'CV Builder begins here' }
          },
          // Convert questions to nodes
          ...questions.map((question, index) => ({
            id: question.id,
            type: 'question' as const,
            position: { x: 250, y: 150 + (index * 120) },
            data: {
              label: question.textKey,
              question: question.text || question.textKey,
              questionType: (question.options && question.options.length > 0 ? 'multiple-choice' : 'text') as 'multiple-choice' | 'text',
              options: question.options?.map((opt: string, optIndex: number) => ({
                id: `opt-${question.id}-${optIndex}`,
                label: opt,
                value: opt.toLowerCase().replace(/\s+/g, '_')
              })) || [],
              required: question.required || false,
              variableName: question.id
            }
          })),
          // End node
          {
            id: 'end',
            type: 'end' as const,
            position: { x: 250, y: 150 + (questions.length * 120) },
            data: { label: 'End', description: 'CV Builder completed' }
          }
        ],
        edges: [
          // Connect start to first question
          {
            id: 'start-to-first',
            source: 'start',
            target: questions[0]?.id || 'end',
            label: 'Begin'
          },
          // Connect questions in sequence
          ...questions.slice(0, -1).map((question, index) => ({
            id: `${question.id}-to-${questions[index + 1].id}`,
            source: question.id,
            target: questions[index + 1].id,
            label: 'Next'
          })),
          // Connect last question to end
          ...(questions.length > 0 ? [{
            id: `${questions[questions.length - 1].id}-to-end`,
            source: questions[questions.length - 1].id,
            target: 'end',
            label: 'Complete'
          }] : [])
        ],
        variables: [],
        settings: {
          autoSave: true,
          autoSaveInterval: 5000,
          snapToGrid: true,
          gridSize: 20,
          showMinimap: true,
          showControls: true,
          theme: 'light'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      importFlow(JSON.stringify(flowData));
      setIsInitialized(true);
    }
  }, [questions, isInitialized, importFlow, existingFlow, loadFlowFromTemplate]);

  const handleSave = () => {
    if (currentFlow) {
      onFlowUpdate(currentFlow);
      toast.success('Flow configuration saved!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-h-[calc(100vh-1rem)] flex flex-col flow-designer-container">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">Professional Flow Designer</h2>
            <p className="text-sm text-gray-600 mt-1">
              Drag & drop nodes, connect them, and configure conditional logic
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Flow
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Flow Editor */}
        <div className="flex-1 min-h-0 overflow-hidden flow-designer-content">
          <FlowEditor viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
