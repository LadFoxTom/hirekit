// @ts-nocheck
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useCallback } from 'react';
import { 
  SmartNode, 
  SmartEdge, 
  SmartFlow, 
  CoreNodeType, 
  NodeId, 
  EdgeId,
  FlowContext,
  SmartSuggestion,
  ValidationResult,
  FlowTemplate,
  FlowPattern
} from '@/types/flow-redesign';

interface EnhancedFlowState {
  // Flow data
  currentFlow: SmartFlow | null;
  nodes: SmartNode[];
  edges: SmartEdge[];
  variables: Record<string, any>;
  
  // UI state
  selectedNodes: NodeId[];
  selectedEdges: EdgeId[];
  clipboard: SmartNode[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  
  // Panel states
  panels: {
    properties: boolean;
    palette: boolean;
    debugger: boolean;
    templates: boolean;
  };
  
  // Mode
  mode: 'edit' | 'test' | 'debug';
  
  // Validation and suggestions
  validationResults: ValidationResult[];
  suggestions: SmartSuggestion[];
  
  // Templates and patterns
  templates: FlowTemplate[];
  patterns: FlowPattern[];
  
  // Performance metrics
  metrics: {
    lastSave: Date | null;
    unsavedChanges: boolean;
    nodeCount: number;
    edgeCount: number;
  };
}

interface EnhancedFlowActions {
  // Flow management
  setCurrentFlow: (flow: SmartFlow) => void;
  createNewFlow: (name: string, description?: string) => void;
  saveFlow: () => Promise<void>;
  loadFlow: (flowId: string) => Promise<void>;
  
  // Node operations
  addNode: (node: SmartNode) => void;
  updateNode: (nodeId: NodeId, updates: Partial<SmartNode>) => void;
  deleteNode: (nodeId: NodeId) => void;
  duplicateNode: (nodeId: NodeId) => void;
  moveNode: (nodeId: NodeId, position: { x: number; y: number }) => void;
  
  // Edge operations
  addEdge: (edge: SmartEdge) => void;
  updateEdge: (edgeId: EdgeId, updates: Partial<SmartEdge>) => void;
  deleteEdge: (edgeId: EdgeId) => void;
  
  // Selection
  selectNode: (nodeId: NodeId) => void;
  selectNodes: (nodeIds: NodeId[]) => void;
  selectEdge: (edgeId: EdgeId) => void;
  clearSelection: () => void;
  
  // Clipboard operations
  copyNodes: (nodeIds: NodeId[]) => void;
  pasteNodes: (position: { x: number; y: number }) => void;
  cutNodes: (nodeIds: NodeId[]) => void;
  
  // Viewport
  setViewport: (viewport: Partial<EnhancedFlowState['viewport']>) => void;
  fitToView: () => void;
  zoomToFit: () => void;
  
  // Panel management
  togglePanel: (panel: keyof EnhancedFlowState['panels']) => void;
  setPanelState: (panel: keyof EnhancedFlowState['panels'], open: boolean) => void;
  
  // Mode switching
  setMode: (mode: EnhancedFlowState['mode']) => void;
  
  // Validation and suggestions
  validateFlow: () => void;
  generateSuggestions: () => void;
  applySuggestion: (suggestionId: string) => void;
  
  // Templates
  loadTemplate: (templateId: string) => void;
  saveAsTemplate: (name: string, description: string) => void;
  
  // Bulk operations
  deleteSelected: () => void;
  duplicateSelected: () => void;
  alignNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeNodes: (direction: 'horizontal' | 'vertical') => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // History management
  history: {
    past: SmartFlow[];
    present: SmartFlow | null;
    future: SmartFlow[];
  };
  pushToHistory: (flow: SmartFlow) => void;
}

type EnhancedFlowStore = EnhancedFlowState & EnhancedFlowActions;

// Generate unique IDs
const generateId = (prefix: string = 'node'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create the enhanced flow store
export const useEnhancedFlowStore = create<EnhancedFlowStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        currentFlow: null,
        nodes: [],
        edges: [],
        variables: {},
        
        selectedNodes: [],
        selectedEdges: [],
        clipboard: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        
        panels: {
          properties: true,
          palette: true,
          debugger: false,
          templates: false,
        },
        
        mode: 'edit',
        
        validationResults: [],
        suggestions: [],
        
        templates: [],
        patterns: [],
        
        metrics: {
          lastSave: null,
          unsavedChanges: false,
          nodeCount: 0,
          edgeCount: 0,
        },
        
        history: {
          past: [],
          present: null,
          future: [],
        },

        // Flow management actions
        setCurrentFlow: (flow: SmartFlow) => {
          set((state) => {
            state.currentFlow = flow;
            state.nodes = flow.nodes;
            state.edges = flow.edges;
            state.variables = flow.variables.reduce((acc, variable) => {
              acc[variable.name] = variable.value;
              return acc;
            }, {} as Record<string, any>);
            state.metrics.nodeCount = flow.nodes.length;
            state.metrics.edgeCount = flow.edges.length;
            state.metrics.unsavedChanges = false;
          });
        },

        createNewFlow: (name: string, description?: string) => {
          const newFlow: SmartFlow = {
            id: generateId('flow'),
            name,
            description: description || '',
            nodes: [],
            edges: [],
            variables: [],
            templates: [],
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
              version: '1.0.0',
              author: 'current-user',
              tags: [],
              complexity: 'simple',
              estimatedTime: 0,
              successRate: 0,
            },
          };
          
          set((state) => {
            state.currentFlow = newFlow;
            state.nodes = [];
            state.edges = [];
            state.variables = {};
            state.selectedNodes = [];
            state.selectedEdges = [];
            state.metrics.nodeCount = 0;
            state.metrics.edgeCount = 0;
            state.metrics.unsavedChanges = false;
            state.validationResults = [];
            state.suggestions = [];
          });
        },

        saveFlow: async () => {
          const { currentFlow } = get();
          if (!currentFlow) return;

          try {
            // Convert variables back to array format
            const variables = Object.entries(get().variables).map(([name, value]) => ({
              name,
              type: typeof value as any,
              value,
              scope: 'flow' as const,
            }));

            const flowToSave = {
              ...currentFlow,
              nodes: get().nodes,
              edges: get().edges,
              variables,
              metadata: {
                ...currentFlow.metadata,
                updatedAt: new Date(),
              },
            };

            // Save to API
            const response = await fetch('/api/flows', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: currentFlow.id,
                name: currentFlow.name,
                description: currentFlow.description,
                data: flowToSave,
              }),
            });

            if (response.ok) {
              set((state) => {
                state.metrics.lastSave = new Date();
                state.metrics.unsavedChanges = false;
              });
            }
          } catch (error) {
            console.error('Failed to save flow:', error);
          }
        },

        loadFlow: async (flowId: string) => {
          try {
            const response = await fetch(`/api/flows/${flowId}`);
            if (response.ok) {
              const flowData = await response.json();
              get().setCurrentFlow(flowData.data);
            }
          } catch (error) {
            console.error('Failed to load flow:', error);
          }
        },

        // Node operations
        addNode: (node: SmartNode) => {
          set((state) => {
            state.nodes.push(node);
            state.metrics.nodeCount = state.nodes.length;
            state.metrics.unsavedChanges = true;
          });
          get().pushToHistory(get().currentFlow!);
        },

        updateNode: (nodeId: NodeId, updates: Partial<SmartNode>) => {
          set((state) => {
            const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
            if (nodeIndex !== -1) {
              Object.assign(state.nodes[nodeIndex], updates);
              state.metrics.unsavedChanges = true;
            }
          });
          get().pushToHistory(get().currentFlow!);
        },

        deleteNode: (nodeId: NodeId) => {
          set((state) => {
            state.nodes = state.nodes.filter(n => n.id !== nodeId);
            state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
            state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
            state.metrics.nodeCount = state.nodes.length;
            state.metrics.edgeCount = state.edges.length;
            state.metrics.unsavedChanges = true;
          });
          get().pushToHistory(get().currentFlow!);
        },

        duplicateNode: (nodeId: NodeId) => {
          const node = get().nodes.find(n => n.id === nodeId);
          if (!node) return;

          const duplicatedNode: SmartNode = {
            ...node,
            id: generateId('node'),
            position: {
              x: node.position.x + 50,
              y: node.position.y + 50,
            },
            config: {
              ...node.config,
              title: `${node.config.title} (Copy)`,
            },
            visualState: {
              ...node.visualState,
              isSelected: false,
            },
          };

          get().addNode(duplicatedNode);
        },

        moveNode: (nodeId: NodeId, position: { x: number; y: number }) => {
          set((state) => {
            const node = state.nodes.find(n => n.id === nodeId);
            if (node) {
              node.position = position;
              state.metrics.unsavedChanges = true;
            }
          });
        },

        // Edge operations
        addEdge: (edge: SmartEdge) => {
          set((state) => {
            state.edges.push(edge);
            state.metrics.edgeCount = state.edges.length;
            state.metrics.unsavedChanges = true;
          });
          get().pushToHistory(get().currentFlow!);
        },

        updateEdge: (edgeId: EdgeId, updates: Partial<SmartEdge>) => {
          set((state) => {
            const edgeIndex = state.edges.findIndex(e => e.id === edgeId);
            if (edgeIndex !== -1) {
              Object.assign(state.edges[edgeIndex], updates);
              state.metrics.unsavedChanges = true;
            }
          });
          get().pushToHistory(get().currentFlow!);
        },

        deleteEdge: (edgeId: EdgeId) => {
          set((state) => {
            state.edges = state.edges.filter(e => e.id !== edgeId);
            state.selectedEdges = state.selectedEdges.filter(id => id !== edgeId);
            state.metrics.edgeCount = state.edges.length;
            state.metrics.unsavedChanges = true;
          });
          get().pushToHistory(get().currentFlow!);
        },

        // Selection
        selectNode: (nodeId: NodeId) => {
          set((state) => {
            state.selectedNodes = [nodeId];
            state.selectedEdges = [];
            // Update visual state
            state.nodes.forEach(node => {
              node.visualState.isSelected = node.id === nodeId;
            });
          });
        },

        selectNodes: (nodeIds: NodeId[]) => {
          set((state) => {
            state.selectedNodes = nodeIds;
            state.selectedEdges = [];
            // Update visual state
            state.nodes.forEach(node => {
              node.visualState.isSelected = nodeIds.includes(node.id);
            });
          });
        },

        selectEdge: (edgeId: EdgeId) => {
          set((state) => {
            state.selectedEdges = [edgeId];
            state.selectedNodes = [];
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedNodes = [];
            state.selectedEdges = [];
            // Update visual state
            state.nodes.forEach(node => {
              node.visualState.isSelected = false;
            });
          });
        },

        // Clipboard operations
        copyNodes: (nodeIds: NodeId[]) => {
          const nodes = get().nodes.filter(n => nodeIds.includes(n.id));
          set((state) => {
            state.clipboard = nodes;
          });
        },

        pasteNodes: (position: { x: number; y: number }) => {
          const { clipboard } = get();
          if (clipboard.length === 0) return;

          const offset = { x: 50, y: 50 };
          clipboard.forEach((node, index) => {
            const pastedNode: SmartNode = {
              ...node,
              id: generateId('node'),
              position: {
                x: position.x + (index * offset.x),
                y: position.y + (index * offset.y),
              },
              config: {
                ...node.config,
                title: `${node.config.title} (Copy)`,
              },
              visualState: {
                ...node.visualState,
                isSelected: false,
              },
            };
            get().addNode(pastedNode);
          });
        },

        cutNodes: (nodeIds: NodeId[]) => {
          get().copyNodes(nodeIds);
          nodeIds.forEach(nodeId => get().deleteNode(nodeId));
        },

        // Viewport
        setViewport: (viewport: Partial<EnhancedFlowState['viewport']>) => {
          set((state) => {
            Object.assign(state.viewport, viewport);
          });
        },

        fitToView: () => {
          const { nodes } = get();
          if (nodes.length === 0) return;

          const bounds = nodes.reduce(
            (acc, node) => ({
              minX: Math.min(acc.minX, node.position.x),
              minY: Math.min(acc.minY, node.position.y),
              maxX: Math.max(acc.maxX, node.position.x + node.size.width),
              maxY: Math.max(acc.maxY, node.position.y + node.size.height),
            }),
            { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
          );

          const centerX = (bounds.minX + bounds.maxX) / 2;
          const centerY = (bounds.minY + bounds.maxY) / 2;

          set((state) => {
            state.viewport.x = -centerX;
            state.viewport.y = -centerY;
            state.viewport.zoom = 0.8;
          });
        },

        zoomToFit: () => {
          get().fitToView();
        },

        // Panel management
        togglePanel: (panel: keyof EnhancedFlowState['panels']) => {
          set((state) => {
            state.panels[panel] = !state.panels[panel];
          });
        },

        setPanelState: (panel: keyof EnhancedFlowState['panels'], open: boolean) => {
          set((state) => {
            state.panels[panel] = open;
          });
        },

        // Mode switching
        setMode: (mode: EnhancedFlowState['mode']) => {
          set((state) => {
            state.mode = mode;
            if (mode === 'debug') {
              state.panels.debugger = true;
            }
          });
        },

        // Validation and suggestions
        validateFlow: () => {
          const { nodes, edges } = get();
          const results: ValidationResult[] = [];

          // Check for start node
          const hasStartNode = nodes.some(n => n.type === 'flow' && n.variant === 'start');
          if (!hasStartNode) {
            results.push({
              field: 'flow',
              valid: false,
              message: 'Flow must have a start node',
              severity: 'error',
            });
          }

          // Check for end node
          const hasEndNode = nodes.some(n => n.type === 'interaction' && n.variant === 'end');
          if (!hasEndNode) {
            results.push({
              field: 'flow',
              valid: false,
              message: 'Flow should have an end node',
              severity: 'warning',
            });
          }

          // Check for orphaned nodes
          const connectedNodes = new Set<string>();
          edges.forEach(edge => {
            connectedNodes.add(edge.source);
            connectedNodes.add(edge.target);
          });

          nodes.forEach(node => {
            if (node.type !== 'flow' || node.variant !== 'start') {
              if (!connectedNodes.has(node.id)) {
                results.push({
                  field: node.id,
                  valid: false,
                  message: `Node "${node.config.title}" is not connected`,
                  severity: 'warning',
                });
              }
            }
          });

          set((state) => {
            state.validationResults = results;
          });
        },

        generateSuggestions: () => {
          const { nodes, edges } = get();
          const suggestions: SmartSuggestion[] = [];

          // Suggest adding end node if missing
          const hasEndNode = nodes.some(n => n.type === 'interaction' && n.variant === 'end');
          if (!hasEndNode) {
            suggestions.push({
              id: 'add-end-node',
              type: 'next-node',
              title: 'Add End Node',
              description: 'Complete your flow with an end node',
              confidence: 0.8,
              action: () => {
                // This would trigger adding an end node
                console.log('Adding end node');
              },
              category: 'interaction',
            });
          }

          set((state) => {
            state.suggestions = suggestions;
          });
        },

        applySuggestion: (suggestionId: string) => {
          const suggestion = get().suggestions.find(s => s.id === suggestionId);
          if (suggestion) {
            suggestion.action();
          }
        },

        // Templates
        loadTemplate: (templateId: string) => {
          const template = get().templates.find(t => t.id === templateId);
          if (template) {
            const flow: SmartFlow = {
              id: generateId('flow'),
              name: template.name,
              description: template.description,
              nodes: template.nodes.map(node => ({
                ...node,
                id: generateId('node'),
                position: node.position,
              })),
              edges: template.edges.map(edge => ({
                ...edge,
                id: generateId('edge'),
                source: generateId('node'), // This would need proper mapping
                target: generateId('node'),
              })),
              variables: [],
              templates: [],
              metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: '1.0.0',
                author: 'current-user',
                tags: template.tags,
                complexity: 'simple',
                estimatedTime: 0,
                successRate: 0,
              },
            };
            get().setCurrentFlow(flow);
          }
        },

        saveAsTemplate: (name: string, description: string) => {
          const { currentFlow, nodes, edges } = get();
          if (!currentFlow) return;

          const template: FlowTemplate = {
            id: generateId('template'),
            name,
            description,
            category: 'custom',
            nodes: nodes.map(node => ({
              type: node.type,
              variant: node.variant,
              config: node.config,
              position: node.position,
            })),
            edges: edges.map(edge => ({
              source: edge.source,
              target: edge.target,
              sourceHandle: edge.sourceHandle,
              targetHandle: edge.targetHandle,
            })),
            suggestedCustomizations: [],
            popularity: 0,
            tags: [],
          };

          set((state) => {
            state.templates.push(template);
          });
        },

        // Bulk operations
        deleteSelected: () => {
          const { selectedNodes, selectedEdges } = get();
          selectedNodes.forEach(nodeId => get().deleteNode(nodeId));
          selectedEdges.forEach(edgeId => get().deleteEdge(edgeId));
        },

        duplicateSelected: () => {
          const { selectedNodes } = get();
          selectedNodes.forEach(nodeId => get().duplicateNode(nodeId));
        },

        alignNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
          const { selectedNodes, nodes } = get();
          if (selectedNodes.length < 2) return;

          const selectedNodeObjects = nodes.filter(n => selectedNodes.includes(n.id));
          const bounds = selectedNodeObjects.reduce(
            (acc, node) => ({
              minX: Math.min(acc.minX, node.position.x),
              minY: Math.min(acc.minY, node.position.y),
              maxX: Math.max(acc.maxX, node.position.x + node.size.width),
              maxY: Math.max(acc.maxY, node.position.y + node.size.height),
            }),
            { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
          );

          selectedNodeObjects.forEach(node => {
            let newPosition = { ...node.position };

            switch (alignment) {
              case 'left':
                newPosition.x = bounds.minX;
                break;
              case 'center':
                newPosition.x = bounds.minX + (bounds.maxX - bounds.minX) / 2 - node.size.width / 2;
                break;
              case 'right':
                newPosition.x = bounds.maxX - node.size.width;
                break;
              case 'top':
                newPosition.y = bounds.minY;
                break;
              case 'middle':
                newPosition.y = bounds.minY + (bounds.maxY - bounds.minY) / 2 - node.size.height / 2;
                break;
              case 'bottom':
                newPosition.y = bounds.maxY - node.size.height;
                break;
            }

            get().moveNode(node.id, newPosition);
          });
        },

        distributeNodes: (direction: 'horizontal' | 'vertical') => {
          const { selectedNodes, nodes } = get();
          if (selectedNodes.length < 3) return;

          const selectedNodeObjects = nodes
            .filter(n => selectedNodes.includes(n.id))
            .sort((a, b) => {
              if (direction === 'horizontal') {
                return a.position.x - b.position.x;
              } else {
                return a.position.y - b.position.y;
              }
            });

          const totalSpace = direction === 'horizontal' 
            ? selectedNodeObjects[selectedNodeObjects.length - 1].position.x - selectedNodeObjects[0].position.x
            : selectedNodeObjects[selectedNodeObjects.length - 1].position.y - selectedNodeObjects[0].position.y;

          const spacing = totalSpace / (selectedNodeObjects.length - 1);

          selectedNodeObjects.forEach((node, index) => {
            if (index === 0 || index === selectedNodeObjects.length - 1) return;

            const newPosition = { ...node.position };
            if (direction === 'horizontal') {
              newPosition.x = selectedNodeObjects[0].position.x + (spacing * index);
            } else {
              newPosition.y = selectedNodeObjects[0].position.y + (spacing * index);
            }

            get().moveNode(node.id, newPosition);
          });
        },

        // Undo/Redo
        undo: () => {
          const { history } = get();
          if (history.past.length === 0) return;

          const previous = history.past[history.past.length - 1];
          const newPast = history.past.slice(0, history.past.length - 1);

          set((state) => {
            state.history.past = newPast;
            state.history.future = [history.present!, ...history.future];
            state.history.present = previous;
          });

          if (previous) {
            get().setCurrentFlow(previous);
          }
        },

        redo: () => {
          const { history } = get();
          if (history.future.length === 0) return;

          const next = history.future[0];
          const newFuture = history.future.slice(1);

          set((state) => {
            state.history.past = [...history.past, history.present!];
            state.history.future = newFuture;
            state.history.present = next;
          });

          if (next) {
            get().setCurrentFlow(next);
          }
        },

        canUndo: () => {
          return get().history.past.length > 0;
        },

        canRedo: () => {
          return get().history.future.length > 0;
        },

        // History management
        pushToHistory: (flow: SmartFlow) => {
          set((state) => {
            if (state.history.present) {
              state.history.past.push(state.history.present);
            }
            state.history.present = flow;
            state.history.future = [];
            
            // Limit history size
            if (state.history.past.length > 50) {
              state.history.past = state.history.past.slice(-50);
            }
          });
        },
      }))
    ),
    {
      name: 'enhanced-flow-store',
    }
  )
);

// Selectors for common use cases
export const useSelectedNodes = () => useEnhancedFlowStore(state => 
  state.nodes.filter(n => state.selectedNodes.includes(n.id))
);

export const useSelectedEdges = () => useEnhancedFlowStore(state => 
  state.edges.filter(e => state.selectedEdges.includes(e.id))
);

export const useFlowContext = (): FlowContext | null => {
  const currentFlow = useEnhancedFlowStore(state => state.currentFlow);
  const selectedNodes = useEnhancedFlowStore(state => state.selectedNodes);
  const nodes = useEnhancedFlowStore(state => state.nodes);
  const variables = useEnhancedFlowStore(state => state.variables);
  const patterns = useEnhancedFlowStore(state => state.patterns);
  
  if (!currentFlow) {
    return null;
  }
  
  return {
    currentNode: selectedNodes.length === 1 ? nodes.find(n => n.id === selectedNodes[0]) || null : null,
    flow: currentFlow,
    variables: variables,
    history: selectedNodes,
    patterns: patterns,
  };
};

export const useValidationResults = () => useEnhancedFlowStore(state => state.validationResults);
export const useSuggestions = () => useEnhancedFlowStore(state => state.suggestions);
export const useFlowMetrics = () => useEnhancedFlowStore(state => state.metrics);
