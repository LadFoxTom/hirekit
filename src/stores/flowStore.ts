// @ts-nocheck
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FlowStore, ChatbotFlow, FlowNode, FlowEdge } from '@/types/flow';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFlowStore = create<FlowStore>()(
  immer((set, get) => ({
    // Initial state
    flows: [],
    currentFlow: null,
    selectedNode: null,
    selectedEdge: null,
    sidebarOpen: true,
    testMode: false,
    propertiesPanelOpen: true,
    chatTestOpen: false,

    // Node actions
    addNode: (nodeData) => {
      const id = generateId();
      const node: FlowNode = { ...nodeData, id };
      
      set((state) => {
        if (state.currentFlow) {
          state.currentFlow.nodes.push(node);
          state.currentFlow.updatedAt = new Date();
        }
      });
    },

    updateNode: (id, updates) => {
      set((state) => {
        if (state.currentFlow) {
          const nodeIndex = state.currentFlow.nodes.findIndex(n => n.id === id);
          if (nodeIndex !== -1) {
            // Handle nested data property updates properly
            const currentNode = state.currentFlow.nodes[nodeIndex];
            const updatedNode = {
              ...currentNode,
              ...updates,
              // If updates contains data, merge it with existing data
              data: updates.data ? { ...currentNode.data, ...updates.data } : currentNode.data
            };
            
            state.currentFlow.nodes[nodeIndex] = updatedNode;
            state.currentFlow.updatedAt = new Date();
            
            // Also update the selectedNode if it's the same node
            if (state.selectedNode?.id === id) {
              state.selectedNode = updatedNode;
            }
            
            // Node updated successfully
          }
        }
      });
    },

    deleteNode: (id) => {
      set((state) => {
        if (state.currentFlow) {
          state.currentFlow.nodes = state.currentFlow.nodes.filter(n => n.id !== id);
          state.currentFlow.edges = state.currentFlow.edges.filter(
            e => e.source !== id && e.target !== id
          );
          state.currentFlow.updatedAt = new Date();
          
          if (state.selectedNode?.id === id) {
            state.selectedNode = null;
          }
        }
      });
    },

    // Edge actions
    addEdge: (edgeData) => {
      const id = generateId();
      const edge: FlowEdge = { ...edgeData, id };
      
      set((state) => {
        if (state.currentFlow) {
          state.currentFlow.edges.push(edge);
          state.currentFlow.updatedAt = new Date();
        }
      });
    },

    updateEdge: (id, updates) => {
      set((state) => {
        if (state.currentFlow) {
          const edgeIndex = state.currentFlow.edges.findIndex(e => e.id === id);
          if (edgeIndex !== -1) {
            state.currentFlow.edges[edgeIndex] = {
              ...state.currentFlow.edges[edgeIndex],
              ...updates
            };
            state.currentFlow.updatedAt = new Date();
          }
        }
      });
    },

    deleteEdge: (id) => {
      set((state) => {
        if (state.currentFlow) {
          state.currentFlow.edges = state.currentFlow.edges.filter(e => e.id !== id);
          state.currentFlow.updatedAt = new Date();
          
          if (state.selectedEdge?.id === id) {
            state.selectedEdge = null;
          }
        }
      });
    },

    // Flow operations
    saveFlow: async () => {
      const { currentFlow } = get();
      if (!currentFlow) {
        console.error('No current flow to save');
        throw new Error('No current flow to save');
      }

      try {
        console.log('Saving flow:', {
          id: currentFlow.id,
          name: currentFlow.name,
          nodes: currentFlow.nodes.length,
          edges: currentFlow.edges.length,
          description: currentFlow.description
        });
        
        // Check if flow has a valid ID
        if (!currentFlow.id || currentFlow.id === '') {
          console.error('Flow has no ID, cannot save');
          throw new Error('Flow has no ID. Please create a new flow first.');
        }
        
        // Always use PUT for now, let the API handle the logic
        const method = 'PUT';
        
        console.log(`Using ${method} method for flow save. Flow ID: "${currentFlow.id}"`);
        
        const requestBody = {
          id: currentFlow.id,
          name: currentFlow.name,
          description: currentFlow.description || '',
          data: currentFlow
        };
        
        console.log('Sending request to API:', {
          method,
          url: '/api/flows',
          body: requestBody
        });
        
        const response = await fetch('/api/flows', {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Failed to save flow: ${response.statusText} - ${errorData.details || errorData.error}`);
        }

        const savedFlow = await response.json();
        console.log('Flow saved successfully:', savedFlow);
        
        // Update the current flow with the saved data
        set((state) => {
          if (state.currentFlow) {
            state.currentFlow.id = savedFlow.id;
            state.currentFlow.updatedAt = new Date();
          }
        });
        
        return savedFlow;
      } catch (error) {
        console.error('Failed to save flow:', error);
        throw error;
      }
    },

    loadFlow: async (id: string) => {
      try {
        console.log('Loading flow:', id);
        
        const response = await fetch(`/api/flows?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load flow: ${response.statusText}`);
        }

        const flow = await response.json();
        console.log('Flow loaded successfully:', flow);
        
        // The flow.data contains the complete ChatbotFlow object
        const chatbotFlow: ChatbotFlow = {
          ...flow.data,
          id: flow.id,
          createdAt: new Date(flow.createdAt),
          updatedAt: new Date(flow.updatedAt)
        };
        
        set((state) => { 
          state.currentFlow = chatbotFlow;
        });
        
        return chatbotFlow;
      } catch (error) {
        console.error('Failed to load flow:', error);
        throw error;
      }
    },

    loadFlows: async () => {
      try {
        const response = await fetch('/api/flows');
        
        if (!response.ok) {
          throw new Error(`Failed to load flows: ${response.statusText}`);
        }

        const flows = await response.json();
        console.log('Flows loaded successfully:', flows);
        
        // Convert database flows to ChatbotFlow format
        const chatbotFlows: ChatbotFlow[] = flows.map((flow: any) => ({
          ...flow.data,
          id: flow.id,
          createdAt: new Date(flow.createdAt),
          updatedAt: new Date(flow.updatedAt)
        }));
        
        set((state) => { 
          state.flows = chatbotFlows;
        });
        
        return chatbotFlows;
      } catch (error) {
        console.error('Failed to load flows:', error);
        throw error;
      }
    },

    createNewFlow: (name: string, description?: string) => {
      const newFlow: ChatbotFlow = {
        id: `cv-flow-${Date.now()}`,
        name: name,
        description: description || '',
        version: '1.0.0',
        nodes: [],
        edges: [],
        variables: [],
        settings: {
          autoSave: true,
          autoSaveInterval: 30000,
          snapToGrid: true,
          gridSize: 20,
          showMinimap: true,
          showControls: true,
          theme: 'light'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set((state) => {
        state.currentFlow = newFlow;
      });
      
      console.log('New flow created with ID:', newFlow.id);
      return newFlow;
    },

    exportFlow: () => {
      const { currentFlow } = get();
      if (!currentFlow) return '';
      return JSON.stringify(currentFlow, null, 2);
    },

    importFlow: (data: string) => {
      try {
        const flow: ChatbotFlow = JSON.parse(data);
        console.log('Importing flow:', flow);
        console.log('Flow nodes:', flow.nodes?.length || 0);
        console.log('Flow edges:', flow.edges?.length || 0);
        set((state) => { 
          state.currentFlow = flow;
          console.log('Flow set in store:', state.currentFlow);
        });
      } catch (error) {
        console.error('Failed to import flow:', error);
        throw error;
      }
    },

    updateCurrentFlowNodesAndEdges: (nodes: FlowNode[], edges: FlowEdge[]) => {
      set((state) => {
        if (state.currentFlow) {
          state.currentFlow.nodes = nodes;
          state.currentFlow.edges = edges;
          state.currentFlow.updatedAt = new Date();
        } else {
          console.warn('No current flow to update');
        }
      });
    },

    // UI actions
    setSelectedNode: (node) => {
      set((state) => {
        state.selectedNode = node;
        // Only clear selectedEdge if we're actually selecting a node
        if (node) {
          state.selectedEdge = null;
        }
      });
    },

    setSelectedEdge: (edge) => {
      set((state) => {
        state.selectedEdge = edge;
        // Only clear selectedNode if we're actually selecting an edge
        if (edge) {
          state.selectedNode = null;
        }
      });
    },

    toggleSidebar: () => {
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      });
    },

    toggleTestMode: () => {
      set((state) => {
        state.testMode = !state.testMode;
      });
    },

    togglePropertiesPanel: () => {
      set((state) => {
        state.propertiesPanelOpen = !state.propertiesPanelOpen;
      });
    },

    toggleChatTest: () => {
      set((state) => {
        state.chatTestOpen = !state.chatTestOpen;
      });
    },
  }))
);
