export interface ChatbotFlow {
  id: string;
  name: string;
  description?: string;
  version: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  variables: Variable[];
  settings: FlowSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  style?: NodeStyle;
}

export type NodeType = 
  | 'start'
  | 'question'
  | 'condition'
  | 'action'
  | 'end'
  | 'webhook'
  | 'wait'
  | 'transfer'
  | 'collect-input'
  | 'api-call';

export interface NodeData {
  label: string;
  description?: string;
  text?: string;
  question?: string;
  questionType?: 'text' | 'multiple-choice' | 'yes-no' | 'rating' | 'email' | 'phone';
  type?: string;
  options?: Option[];
  validation?: ValidationRule[];
  required?: boolean;
  variableName?: string;
  timeout?: number;
  retryAttempts?: number;
  condition?: Condition;
  action?: Action;
  conditionType?: 'simple' | 'multi-output';
}

export interface Option {
  id: string;
  label: string;
  value: string;
  nextNodeId?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message?: string;
}

export interface Condition {
  operator: 'and' | 'or';
  rules: ConditionRule[];
  outputs?: ConditionOutput[];
}

export interface ConditionRule {
  id?: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty' | 'in_list' | 'not_in_list';
  value: any;
}

export interface ConditionOutput {
  id: string;
  label: string;
  value: string;
  description?: string;
  color?: string;
  rules: ConditionRule[];
}

export interface Action {
  type: 'set_variable' | 'call_api' | 'send_webhook' | 'wait';
  config: any;
}

export interface NodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  condition?: Condition;
  label?: string;
  style?: EdgeStyle;
}

export interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: any;
  scope: 'global' | 'local';
  description?: string;
}

export interface FlowSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  snapToGrid: boolean;
  gridSize: number;
  showMinimap: boolean;
  showControls: boolean;
  theme: 'light' | 'dark';
}

export interface ValidationError {
  type: string;
  nodeId?: string;
  edgeId?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FlowStore {
  // Flow data
  flows: ChatbotFlow[];
  currentFlow: ChatbotFlow | null;
  
  // Editor state
  selectedNode: FlowNode | null;
  selectedEdge: FlowEdge | null;
  
  // UI state
  sidebarOpen: boolean;
  testMode: boolean;
  propertiesPanelOpen: boolean;
  chatTestOpen: boolean;
  
  // Actions
  addNode: (node: Omit<FlowNode, 'id'>) => void;
  updateNode: (id: string, updates: Partial<FlowNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Omit<FlowEdge, 'id'>) => void;
  updateEdge: (id: string, updates: Partial<FlowEdge>) => void;
  deleteEdge: (id: string) => void;
  
  // Flow operations
  saveFlow: () => Promise<void>;
  loadFlow: (id: string) => Promise<void>;
  loadFlows: () => Promise<void>;
  createNewFlow: (name: string, description?: string) => ChatbotFlow;
  exportFlow: () => string;
  importFlow: (data: string) => void;
  updateCurrentFlowNodesAndEdges: (nodes: FlowNode[], edges: FlowEdge[]) => void;
  
  // UI actions
  setSelectedNode: (node: FlowNode | null) => void;
  setSelectedEdge: (edge: FlowEdge | null) => void;
  toggleSidebar: () => void;
  toggleTestMode: () => void;
  togglePropertiesPanel: () => void;
  toggleChatTest: () => void;
}
