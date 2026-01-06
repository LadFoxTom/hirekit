'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
  NodeDragHandler,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useFlowStore } from '@/stores/flowStore';
import NodePalette from '@/components/panels/NodePalette';
import PropertiesPanel from '@/components/panels/PropertiesPanel';
import ChatTestWindow from '@/components/chat/ChatTestWindow';
import QuestionNode from '@/components/nodes/QuestionNode';
import StartNode from '@/components/nodes/StartNode';
import EndNode from '@/components/nodes/EndNode';
import ConditionNode from '@/components/nodes/ConditionNode';
import ActionNode from '@/components/nodes/ActionNode';
import WaitNode from '@/components/nodes/WaitNode';
import ApiCallNode from '@/components/nodes/ApiCallNode';
import MessageNode from '@/components/nodes/MessageNode';

import { 
  Save, 
  Play, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Eye,
  EyeOff,
  PanelLeft,
  PanelRight,
  MessageSquare,
  Plus
} from 'lucide-react';
import { useModalContext } from '@/components/providers/ModalProvider';
import { useFlowSelector } from '@/hooks/useFlowSelector';
import FlowSelectorModal from '@/components/ui/FlowSelectorModal';
import { toast } from 'react-hot-toast';

const nodeTypes = {
  question: QuestionNode,
  start: StartNode,
  end: EndNode,
  message: MessageNode, // Message node for intro/completion
  wait: WaitNode, // Use proper WaitNode
  condition: ConditionNode, // Use proper ConditionNode
  action: ActionNode, // Use proper ActionNode
  'api-call': ApiCallNode, // Use proper ApiCallNode
};

// Utility function to find a non-overlapping position for a new node
const findNonOverlappingPosition = (
  desiredPosition: { x: number; y: number },
  existingNodes: Node[],
  nodeSize: { width: number; height: number } = { width: 200, height: 100 },
  gridSize: number = 20
): { x: number; y: number } => {
  // Snap to grid
  const snappedX = Math.round(desiredPosition.x / gridSize) * gridSize;
  const snappedY = Math.round(desiredPosition.y / gridSize) * gridSize;
  
  let position = { x: snappedX, y: snappedY };
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loops
  
  // Check if position overlaps with existing nodes
  const hasOverlap = (pos: { x: number; y: number }) => {
    return existingNodes.some(node => {
      const nodeWidth = (node.width as number) || nodeSize.width;
      const nodeHeight = (node.height as number) || nodeSize.height;
      
      // Check if rectangles overlap
      return !(
        pos.x + nodeSize.width < node.position.x ||
        pos.x > node.position.x + nodeWidth ||
        pos.y + nodeSize.height < node.position.y ||
        pos.y > node.position.y + nodeHeight
      );
    });
  };
  
  // If no overlap, return the snapped position
  if (!hasOverlap(position)) {
    return position;
  }
  
  // Try to find a non-overlapping position by spiraling outward
  const directions = [
    { x: 1, y: 0 },   // right
    { x: 0, y: 1 },   // down
    { x: -1, y: 0 },  // left
    { x: 0, y: -1 }   // up
  ];
  
  let directionIndex = 0;
  let stepSize = 1;
  let stepsInCurrentDirection = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Move in current direction
    position.x += directions[directionIndex].x * gridSize;
    position.y += directions[directionIndex].y * gridSize;
    
    stepsInCurrentDirection++;
    
    // Change direction when we've taken enough steps in current direction
    if (stepsInCurrentDirection >= stepSize) {
      directionIndex = (directionIndex + 1) % 4;
      stepsInCurrentDirection = 0;
      
      // Increase step size every 2 direction changes (creates a spiral)
      if (directionIndex % 2 === 0) {
        stepSize++;
      }
    }
    
    // Check if this position is free
    if (!hasOverlap(position)) {
      return position;
    }
  }
  
  // If we can't find a position after max attempts, return the original position
  // This should rarely happen, but prevents infinite loops
  console.warn('Could not find non-overlapping position after', maxAttempts, 'attempts');
  return { x: snappedX, y: snappedY };
};

interface FlowEditorProps {
  viewMode?: boolean;
}

const FlowEditor = ({ viewMode = false }: FlowEditorProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { showPrompt, showConfirm } = useModalContext();
  const { isOpen: isFlowSelectorOpen, openFlowSelector, closeFlowSelector, handleSelectFlow } = useFlowSelector();
  
  const {
    currentFlow,
    selectedNode,
    selectedEdge,
    sidebarOpen,
    propertiesPanelOpen,
    chatTestOpen,
    setSelectedNode,
    setSelectedEdge,
    toggleSidebar,
    togglePropertiesPanel,
    toggleChatTest,
    addNode,
    updateNode,
    deleteNode,
    addEdge: addFlowEdge,
    updateEdge,
    deleteEdge,
    saveFlow,
    createNewFlow,
    loadFlow,
    exportFlow,
    importFlow,
    updateCurrentFlowNodesAndEdges,
  } = useFlowStore();

  // Initialize flow from store and keep in sync
  const isInitialized = useRef(false);
  useEffect(() => {
    if (currentFlow) {
      if (!isInitialized.current) {
        // Initial load
        setNodes(currentFlow.nodes || []);
        setEdges(currentFlow.edges || []);
        isInitialized.current = true;
        console.log('Flow initialized with nodes:', currentFlow.nodes?.length || 0, 'edges:', currentFlow.edges?.length || 0);
      } else {
        // Keep React Flow in sync with store updates
        setNodes(currentFlow.nodes || []);
        setEdges(currentFlow.edges || []);
        // Flow synced with store
      }
    } else {
      // Clear nodes and edges when no flow is selected
      setNodes([]);
      setEdges([]);
      isInitialized.current = false;
    }
  }, [currentFlow, setNodes, setEdges]);

  // Debounced update of store when nodes/edges change (only for position/size changes)
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const lastNodesRef = useRef(nodes);
  const lastEdgesRef = useRef(edges);
  
  useEffect(() => {
    if (currentFlow && isInitialized.current) {
      // Only update store if nodes/edges actually changed
      const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(lastNodesRef.current);
      const edgesChanged = JSON.stringify(edges) !== JSON.stringify(lastEdgesRef.current);
      
      if (nodesChanged || edgesChanged) {
        // Clear previous timeout
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        
        // Debounce the update to avoid excessive store updates
        debounceTimeout.current = setTimeout(() => {
          updateCurrentFlowNodesAndEdges(nodes as any, edges as any);
          lastNodesRef.current = nodes;
          lastEdgesRef.current = edges;
        }, 100);
      }
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [nodes, edges, currentFlow, updateCurrentFlowNodesAndEdges]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      addFlowEdge(params as any);
    },
    [edges, setEdges, addFlowEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const { type, data: nodeData } = JSON.parse(data);
      const desiredPosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Find a non-overlapping position for the new node
      const nonOverlappingPosition = findNonOverlappingPosition(
        desiredPosition,
        nodes,
        { width: 200, height: 100 }, // Default node size
        20 // Grid size
      );

      // Show a subtle notification if the node was repositioned due to overlap
      const distance = Math.sqrt(
        Math.pow(nonOverlappingPosition.x - desiredPosition.x, 2) + 
        Math.pow(nonOverlappingPosition.y - desiredPosition.y, 2)
      );
      if (distance > 50) { // Only show if moved significantly
        toast.success('Node positioned to avoid overlap', {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#10B981',
            color: 'white',
          },
        });
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position: nonOverlappingPosition,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
      addNode({
        type: newNode.type as any,
        position: newNode.position,
        data: newNode.data,
      });
    },
    [reactFlowInstance, setNodes, addNode, nodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    console.log('Setting selected node in store...');
    setSelectedNode(node as any);
    setSelectedEdge(null);
    // Open properties panel when node is selected
    if (!propertiesPanelOpen) {
      togglePropertiesPanel();
    }
    console.log('Node selection complete');
  }, [setSelectedNode, setSelectedEdge, propertiesPanelOpen, togglePropertiesPanel]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
    setSelectedEdge(edge as any);
    setSelectedNode(null);
    // Open properties panel when edge is selected
    if (!propertiesPanelOpen) {
      togglePropertiesPanel();
    }
  }, [setSelectedEdge, setSelectedNode, propertiesPanelOpen, togglePropertiesPanel]);

  const onPaneClick = useCallback(() => {
    console.log('Pane clicked - clearing selection');
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  // Handle React Flow's internal selection changes
  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => {
    console.log('Selection change:', { nodes, edges });
    if (nodes.length > 0) {
      console.log('Setting selected node from selection change:', nodes[0]);
      setSelectedNode(nodes[0] as any);
      setSelectedEdge(null);
    } else if (edges.length > 0) {
      console.log('Setting selected edge from selection change:', edges[0]);
      setSelectedEdge(edges[0] as any);
      setSelectedNode(null);
    } else {
      console.log('Clearing selection from selection change');
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, [setSelectedNode, setSelectedEdge]);

  const handleSave = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    try {
      // Ensure any pending position updates are applied before saving
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        updateCurrentFlowNodesAndEdges(nodes as any, edges as any);
      }
      
      await saveFlow();
      toast.success('Flow saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save flow');
    }
  };

  const handleExport = () => {
    const flowData = exportFlow();
    const blob = new Blob([flowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Flow exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importFlow(data);
        toast.success('Flow imported successfully!');
      } catch (error) {
        toast.error('Failed to import flow');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
      toast.success('Node deleted');
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id);
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
      toast.success('Edge deleted');
    }
  };

  return (
    <div className="h-full flex flow-designer-content">
      {/* Left Sidebar - Node Palette */}
      {sidebarOpen && !viewMode && <NodePalette />}

      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* View Mode Indicator */}
              {viewMode && (
                <div className="flex items-center space-x-2 mr-4">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
                    <Eye size={14} />
                    <span>View Mode</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                </div>
              )}
              
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Toggle Node Palette"
                disabled={viewMode}
              >
                <PanelLeft size={16} />
              </button>
              
              <div className="h-4 w-px bg-gray-300" />
              
              <button
                type="button"
                onClick={async () => {
                  const name = await showPrompt('Enter flow name:', '', 'Create New Flow', 'Flow name');
                  if (name) {
                    console.log('Creating new flow:', name);
                    const newFlow = createNewFlow(name);
                    console.log('New flow created:', newFlow);
                    setNodes([]);
                    setEdges([]);
                    isInitialized.current = false; // Reset initialization flag
                    toast.success(`New flow "${name}" created!`);
                  }
                }}
                disabled={viewMode}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  viewMode 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Plus size={16} />
                <span>New Flow</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  openFlowSelector(async (flowId) => {
                    try {
                      console.log('Loading flow:', flowId);
                      await loadFlow(flowId);
                      toast.success(`Flow loaded successfully!`);
                    } catch (error) {
                      console.error('Failed to load flow:', error);
                      toast.error('Failed to load flow');
                    }
                  });
                }}
                disabled={viewMode}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  viewMode 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Eye size={16} />
                <span>Load Flow</span>
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                disabled={viewMode}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  viewMode 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              
              <label className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                viewMode 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
              }`}>
                <Upload size={16} />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  disabled={viewMode}
                />
              </label>
            </div>

            <div className="flex items-center space-x-2">
              {(selectedNode || selectedEdge) && !viewMode && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              )}
              
              <button
                onClick={toggleChatTest}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Test Chat Flow"
              >
                <MessageSquare size={16} />
              </button>
              
              <button
                onClick={togglePropertiesPanel}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Toggle Properties Panel"
              >
                <PanelRight size={16} />
              </button>
              
              <div className="h-4 w-px bg-gray-300" />
              
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.zoomOut();
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Zoom Out"
                >
                  <span className="text-sm font-bold">-</span>
                </button>
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.fitView();
                    }
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  title="Fit to View"
                >
                  Fit
                </button>
                <button
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.zoomIn();
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Zoom In"
                >
                  <span className="text-sm font-bold">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 min-h-0 react-flow-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            snapToGrid={true}
            snapGrid={[20, 20]}
            nodesDraggable={!viewMode}
            nodesConnectable={!viewMode}
            elementsSelectable={!viewMode}
          >
            <Background />
            <Controls />
            <MiniMap />
            
            {/* Flow Info Panel */}
            <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-lg border">
              <div className="text-sm text-gray-600">
                <div>Nodes: {nodes.length}</div>
                <div>Edges: {edges.length}</div>
                {currentFlow && (
                  <div>Flow: {currentFlow.name}</div>
                )}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <PropertiesPanel viewMode={viewMode} />

      {/* Chat Test Window */}
      <ChatTestWindow 
        isOpen={chatTestOpen} 
        onClose={toggleChatTest}
      />
      
      <FlowSelectorModal
        isOpen={isFlowSelectorOpen}
        onClose={closeFlowSelector}
        onSelectFlow={handleSelectFlow}
        title="Select Flow to Load"
      />
    </div>
  );
};

// Wrap with ReactFlowProvider for proper context
const FlowEditorWithProvider = ({ viewMode = false }: { viewMode?: boolean }) => (
  <ReactFlowProvider>
    <FlowEditor viewMode={viewMode} />
  </ReactFlowProvider>
);

export default FlowEditorWithProvider;
