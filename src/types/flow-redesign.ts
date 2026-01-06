// @ts-nocheck
// New Flow Designer Architecture Types
// This file defines the redesigned flow system with simplified node types and enhanced UX

export type CoreNodeType = 'interaction' | 'logic' | 'flow' | 'integration';

export interface SmartNode {
  id: string;
  type: string; // ReactFlow expects string, we'll use 'unified'
  variant: string;
  config: NodeConfig;
  visualState: VisualState;
  position: { x: number; y: number };
  size: NodeSize;
  data: {
    nodeType: CoreNodeType; // Store the actual node type here
    variant: string;
    config: NodeConfig;
    visualState: VisualState;
  };
}

export interface NodeConfig {
  // Basic configuration
  title: string;
  description?: string;
  status: 'configured' | 'incomplete' | 'error';
  
  // Variant-specific configuration
  variantConfig: Record<string, any>;
  
  // Connection configuration
  connections: ConnectionConfig;
  
  // Validation rules
  validation: ValidationConfig;
}

export interface VisualState {
  // Visual hierarchy
  importance: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'standard' | 'complex';
  
  // Visual styling
  color: string;
  icon: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  
  // State indicators
  hasErrors: boolean;
  isConfigured: boolean;
  isSelected: boolean;
  isHovered: boolean;
}

export interface NodeSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}

// Node Variants
export interface NodeVariant {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  complexity: 'simple' | 'standard' | 'complex';
  defaultConfig: Record<string, any>;
  validationRules: ValidationRule[];
}

// Interaction Node Variants
export const INTERACTION_VARIANTS: Record<string, NodeVariant> = {
  question: {
    id: 'question',
    name: 'Ask Question',
    description: 'Collect user input through various question types',
    icon: '💬',
    color: '#3b82f6',
    category: 'input',
    complexity: 'standard',
    defaultConfig: {
      questionType: 'text',
      required: false,
      variableName: '',
      options: []
    },
    validationRules: [
      { field: 'title', required: true, message: 'Question title is required' },
      { field: 'variantConfig.question', required: true, message: 'Question text is required' }
    ]
  },
  message: {
    id: 'message',
    name: 'Send Message',
    description: 'Display information or confirmation to user',
    icon: '💭',
    color: '#10b981',
    category: 'output',
    complexity: 'simple',
    defaultConfig: {
      messageType: 'text',
      content: '',
      delay: 0
    },
    validationRules: [
      { field: 'title', required: true, message: 'Message title is required' },
      { field: 'variantConfig.content', required: true, message: 'Message content is required' }
    ]
  },
  collect: {
    id: 'collect',
    name: 'Collect Data',
    description: 'Gather multiple pieces of information',
    icon: '📝',
    color: '#8b5cf6',
    category: 'input',
    complexity: 'complex',
    defaultConfig: {
      fields: [],
      validation: {},
      storage: 'variables'
    },
    validationRules: [
      { field: 'title', required: true, message: 'Collection title is required' },
      { field: 'variantConfig.fields', required: true, minLength: 1, message: 'At least one field is required' }
    ]
  },
  end: {
    id: 'end',
    name: 'End Flow',
    description: 'Terminate the conversation flow',
    icon: '🏁',
    color: '#ef4444',
    category: 'control',
    complexity: 'simple',
    defaultConfig: {
      endType: 'success',
      message: 'Thank you for your time!',
      dataCollection: {}
    },
    validationRules: [
      { field: 'title', required: true, message: 'End node title is required' }
    ]
  }
};

// Logic Node Variants
export const LOGIC_VARIANTS: Record<string, NodeVariant> = {
  condition: {
    id: 'condition',
    name: 'Conditional Logic',
    description: 'Branch flow based on conditions',
    icon: '🌿',
    color: '#8b5cf6',
    category: 'control',
    complexity: 'standard',
    defaultConfig: {
      conditionType: 'simple',
      rules: [],
      outputs: []
    },
    validationRules: [
      { field: 'title', required: true, message: 'Condition title is required' },
      { field: 'variantConfig.rules', required: true, minLength: 1, message: 'At least one rule is required' }
    ]
  },
  action: {
    id: 'action',
    name: 'Perform Action',
    description: 'Execute actions like setting variables or sending notifications',
    icon: '⚡',
    color: '#f59e0b',
    category: 'action',
    complexity: 'standard',
    defaultConfig: {
      actionType: 'set_variable',
      config: {}
    },
    validationRules: [
      { field: 'title', required: true, message: 'Action title is required' },
      { field: 'variantConfig.actionType', required: true, message: 'Action type is required' }
    ]
  },
  api: {
    id: 'api',
    name: 'API Integration',
    description: 'Make external API calls',
    icon: '🌐',
    color: '#06b6d4',
    category: 'integration',
    complexity: 'complex',
    defaultConfig: {
      method: 'GET',
      url: '',
      headers: {},
      body: null,
      timeout: 30000
    },
    validationRules: [
      { field: 'title', required: true, message: 'API call title is required' },
      { field: 'variantConfig.url', required: true, message: 'API URL is required' }
    ]
  }
};

// Flow Node Variants
export const FLOW_VARIANTS: Record<string, NodeVariant> = {
  start: {
    id: 'start',
    name: 'Start Flow',
    description: 'Entry point of the conversation',
    icon: '▶️',
    color: '#10b981',
    category: 'control',
    complexity: 'simple',
    defaultConfig: {
      welcomeMessage: '',
      initialVariables: {}
    },
    validationRules: []
  },
  wait: {
    id: 'wait',
    name: 'Wait/Delay',
    description: 'Pause flow execution',
    icon: '⏱️',
    color: '#f59e0b',
    category: 'control',
    complexity: 'simple',
    defaultConfig: {
      waitType: 'fixed',
      duration: 5000
    },
    validationRules: [
      { field: 'variantConfig.duration', required: true, min: 0, message: 'Wait duration must be positive' }
    ]
  },
  loop: {
    id: 'loop',
    name: 'Loop/Repeat',
    description: 'Repeat actions or questions',
    icon: '🔄',
    color: '#8b5cf6',
    category: 'control',
    complexity: 'complex',
    defaultConfig: {
      loopType: 'count',
      maxIterations: 10,
      condition: ''
    },
    validationRules: [
      { field: 'variantConfig.maxIterations', required: true, min: 1, message: 'Maximum iterations must be at least 1' }
    ]
  }
};

// Integration Node Variants
export const INTEGRATION_VARIANTS: Record<string, NodeVariant> = {
  webhook: {
    id: 'webhook',
    name: 'Webhook',
    description: 'Send data to external webhooks',
    icon: '🔗',
    color: '#f59e0b',
    category: 'integration',
    complexity: 'standard',
    defaultConfig: {
      url: '',
      method: 'POST',
      headers: {},
      payload: {}
    },
    validationRules: [
      { field: 'title', required: true, message: 'Webhook title is required' },
      { field: 'variantConfig.url', required: true, message: 'Webhook URL is required' }
    ]
  },
  email: {
    id: 'email',
    name: 'Send Email',
    description: 'Send email notifications',
    icon: '📧',
    color: '#06b6d4',
    category: 'notification',
    complexity: 'standard',
    defaultConfig: {
      to: '',
      subject: '',
      body: '',
      template: 'plain'
    },
    validationRules: [
      { field: 'title', required: true, message: 'Email title is required' },
      { field: 'variantConfig.to', required: true, message: 'Recipient email is required' },
      { field: 'variantConfig.subject', required: true, message: 'Email subject is required' }
    ]
  },
  sms: {
    id: 'sms',
    name: 'Send SMS',
    description: 'Send SMS messages',
    icon: '📱',
    color: '#06b6d4',
    category: 'notification',
    complexity: 'standard',
    defaultConfig: {
      to: '',
      message: ''
    },
    validationRules: [
      { field: 'title', required: true, message: 'SMS title is required' },
      { field: 'variantConfig.to', required: true, message: 'Recipient phone number is required' },
      { field: 'variantConfig.message', required: true, message: 'SMS message is required' }
    ]
  }
};

// All variants combined
export const ALL_VARIANTS = {
  interaction: INTERACTION_VARIANTS,
  logic: LOGIC_VARIANTS,
  flow: FLOW_VARIANTS,
  integration: INTEGRATION_VARIANTS
};

// Progressive Disclosure Types
export interface ProgressiveNode {
  summary: {
    title: string;
    subtitle: string;
    status: 'configured' | 'incomplete' | 'error';
  };
  quickActions: QuickAction[];
  detailedConfig: DetailedConfig;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  enabled: boolean;
}

export interface DetailedConfig {
  sections: ConfigSection[];
  validation: ValidationResult[];
  suggestions: ConfigSuggestion[];
}

export interface ConfigSection {
  id: string;
  title: string;
  description?: string;
  expanded: boolean;
  required: boolean;
  fields: ConfigField[];
}

export interface ConfigField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'json';
  label: string;
  description?: string;
  required: boolean;
  value: any;
  options?: Array<{ label: string; value: any }>;
  validation?: ValidationRule;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message: string;
}

export interface ValidationResult {
  field: string;
  valid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ConfigSuggestion {
  id: string;
  type: 'optimization' | 'best-practice' | 'template';
  title: string;
  description: string;
  action: () => void;
  priority: 'low' | 'medium' | 'high';
}

// Smart Suggestions
export interface SmartSuggestion {
  id: string;
  type: 'next-node' | 'connection' | 'optimization' | 'template';
  title: string;
  description: string;
  confidence: number; // 0-1
  action: () => void;
  category: string;
}

export interface FlowContext {
  currentNode: SmartNode | null;
  flow: SmartFlow;
  variables: Record<string, any>;
  history: NodeId[];
  patterns: FlowPattern[];
}

export interface SmartFlow {
  id: string;
  name: string;
  description: string;
  nodes: SmartNode[];
  edges: SmartEdge[];
  variables: FlowVariable[];
  templates: FlowTemplate[];
  metadata: FlowMetadata;
}

export interface SmartEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type: 'default' | 'conditional' | 'error' | 'success';
  label?: string;
  style?: EdgeStyle;
}

export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  animated?: boolean;
}

export interface FlowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description?: string;
  scope: 'flow' | 'node' | 'session';
}

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'lead-generation' | 'support' | 'survey' | 'onboarding' | 'custom';
  nodes: TemplateNode[];
  edges: TemplateEdge[];
  suggestedCustomizations: Customization[];
  popularity: number;
  tags: string[];
}

export interface TemplateNode {
  type: CoreNodeType;
  variant: string;
  config: NodeConfig;
  position: { x: number; y: number };
}

export interface TemplateEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Customization {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'variable' | 'connection' | 'validation';
  currentValue: any;
  suggestedValue: any;
  impact: 'low' | 'medium' | 'high';
}

export interface FlowPattern {
  id: string;
  name: string;
  description: string;
  nodes: NodeId[];
  frequency: number;
  success: number;
}

export interface FlowMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  author: string;
  tags: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: number; // in minutes
  successRate: number;
}

// Visual Design System
export interface DesignSystem {
  colors: ColorSystem;
  typography: TypographySystem;
  spacing: SpacingSystem;
  shadows: ShadowSystem;
  animations: AnimationSystem;
}

export interface ColorSystem {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface TypographySystem {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingSystem {
  px: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface ShadowSystem {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface AnimationSystem {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

// Connection System
export interface ConnectionConfig {
  inputs: ConnectionHandle[];
  outputs: ConnectionHandle[];
  validation: ConnectionValidation;
}

export interface ConnectionHandle {
  id: string;
  type: 'input' | 'output';
  position: 'top' | 'bottom' | 'left' | 'right';
  label?: string;
  color: string;
  compatibleTypes: string[];
  maxConnections?: number;
}

export interface ConnectionValidation {
  required: boolean;
  maxConnections: number;
  compatibleTypes: string[];
  customValidator?: (source: SmartNode, target: SmartNode) => ValidationResult;
}

// Testing & Debugging
export interface FlowDebugger {
  stepMode: boolean;
  currentStep: DebugStep;
  variableInspector: VariableInspector;
  executionPath: NodeId[];
  metrics: PerformanceMetrics;
}

export interface DebugStep {
  nodeId: NodeId;
  action: 'enter' | 'execute' | 'exit';
  timestamp: Date;
  variables: Record<string, any>;
  messages: string[];
}

export interface VariableInspector {
  current: Record<string, any>;
  history: VariableHistory[];
  watches: VariableWatch[];
}

export interface VariableHistory {
  timestamp: Date;
  nodeId: NodeId;
  changes: Record<string, { old: any; new: any }>;
}

export interface VariableWatch {
  id: string;
  expression: string;
  value: any;
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  nodeExecutionTimes: Record<NodeId, number>;
  totalExecutionTime: number;
  apiCallLatencies: number[];
  memoryUsage: number;
  errorCount: number;
}

// Utility Types
export type NodeId = string;
export type EdgeId = string;
export type VariantId = string;
export type ConfigId = string;
