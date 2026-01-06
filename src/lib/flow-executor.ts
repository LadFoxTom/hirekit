// @ts-nocheck
import { ChatbotFlow, FlowNode, FlowEdge } from '@/types/flow';

export interface FlowExecutionState {
  currentNodeId: string | null;
  flowState: Record<string, any>;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isComplete: boolean;
}

export interface FlowExecutionResult {
  nextQuestion?: {
    id: string;
    text: string;
    type: 'text' | 'multiple-choice';
    options?: Array<{ id: string; label: string; value: string }>;
    required: boolean;
  };
  isComplete: boolean;
  flowState: Record<string, any>;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class FlowExecutor {
  private flow: ChatbotFlow;
  private state: FlowExecutionState;

  constructor(flow: ChatbotFlow) {
    this.flow = flow;
    this.state = {
      currentNodeId: null,
      flowState: {},
      messages: [],
      isComplete: false
    };
  }

  /**
   * Initialize the flow execution by finding the start node
   */
  public initialize(): FlowExecutionResult {
    const startNode = this.flow.nodes.find(node => node.type === 'start');
    if (!startNode) {
      throw new Error('No start node found in flow');
    }

    this.state.currentNodeId = startNode.id;
    
    // Find the next node (could be message, question, etc.)
    const nextNode = this.findNextNode(startNode.id, this.state.flowState);
    if (nextNode) {
      console.log('🚀 FlowExecutor: Initializing with next node:', nextNode.id, nextNode.type);
      return this.processNode(nextNode);
    }

    return {
      isComplete: true,
      flowState: this.state.flowState,
      messages: this.state.messages
    };
  }

  /**
   * Process a user response and move to the next node
   */
  public processUserResponse(userInput: string): FlowExecutionResult {
    if (!this.state.currentNodeId || this.state.isComplete) {
      return {
        isComplete: true,
        flowState: this.state.flowState,
        messages: this.state.messages
      };
    }

    const currentNode = this.flow.nodes.find(node => node.id === this.state.currentNodeId);
    if (!currentNode) {
      throw new Error(`Current node ${this.state.currentNodeId} not found`);
    }

    // Handle skip responses
    const isSkipResponse = userInput.toLowerCase().trim() === 'skip' || 
                          userInput.toLowerCase().trim() === 'skip this' ||
                          userInput.toLowerCase().trim() === 'skip question';

    if (isSkipResponse) {
      console.log('⏭️ FlowExecutor: User skipped question:', currentNode.id);
      
      // Add user message
      this.state.messages.push({
        role: 'user',
        content: 'Skip'
      });

      // Add acknowledgment message
      const skipMessage = currentNode.data?.required 
        ? 'I understand you want to skip this question. Let me move to the next one.'
        : 'No problem! Let\'s move to the next question.';
      
      this.state.messages.push({
        role: 'assistant',
        content: skipMessage
      });

      // For optional questions, don't store the skip response
      // For required questions, store a placeholder
      if (currentNode.data?.variableName) {
        if (currentNode.data.required) {
          this.state.flowState[currentNode.data.variableName] = '[Skipped]';
        }
        // For optional questions, we don't store anything
      }
    } else {
      // Store the user's response normally
      if (currentNode.data?.variableName) {
        this.state.flowState[currentNode.data.variableName] = userInput;
      }

      // Add user message
      this.state.messages.push({
        role: 'user',
        content: userInput
      });
    }

    // Find next node
    const nextNode = this.findNextNode(this.state.currentNodeId, this.state.flowState);
    if (nextNode) {
      return this.processNode(nextNode);
    } else {
      this.state.isComplete = true;
      return {
        isComplete: true,
        flowState: this.state.flowState,
        messages: this.state.messages
      };
    }
  }

  /**
   * Process a node and return the result
   */
  private processNode(node: FlowNode): FlowExecutionResult {
    this.state.currentNodeId = node.id;

    switch (node.type) {
      case 'question':
        return this.processQuestionNode(node);
      case 'message':
        return this.processMessageNode(node);
      case 'condition':
        return this.processConditionNode(node);
      case 'action':
        return this.processActionNode(node);
      case 'end':
        this.state.isComplete = true;
        return {
          isComplete: true,
          flowState: this.state.flowState,
          messages: this.state.messages
        };
      default:
        // For other node types, just move to the next node
        const nextNode = this.findNextNode(node.id, this.state.flowState);
        if (nextNode) {
          return this.processNode(nextNode);
        } else {
          this.state.isComplete = true;
          return {
            isComplete: true,
            flowState: this.state.flowState,
            messages: this.state.messages
          };
        }
    }
  }

  /**
   * Process a question node
   */
  private processQuestionNode(node: FlowNode): FlowExecutionResult {
    const questionData = node.data;
    
    // Add assistant message
    const questionContent = questionData.label || questionData.question || 'Please provide your answer.';
    console.log('❓ FlowExecutor: Processing question node:', node.id, 'Question:', questionContent);
    
    this.state.messages.push({
      role: 'assistant',
      content: questionContent
    });

    return {
      nextQuestion: {
        id: node.id,
        text: questionContent,
        type: questionData.questionType || 'text',
        options: questionData.options || [],
        required: questionData.required || false
      },
      isComplete: false,
      flowState: this.state.flowState,
      messages: this.state.messages
    };
  }

  /**
   * Process a message node
   */
  private processMessageNode(node: FlowNode): FlowExecutionResult {
    const messageData = node.data;
    
    // Add assistant message
    const messageContent = messageData.content || messageData.label || 'Message';
    console.log('💬 FlowExecutor: Processing message node:', node.id, 'Content:', messageContent);
    
    this.state.messages.push({
      role: 'assistant',
      content: messageContent
    });

    // Move to the next node
    const nextNode = this.findNextNode(node.id, this.state.flowState);
    if (nextNode) {
      console.log('➡️ FlowExecutor: Moving from message to next node:', nextNode.id, nextNode.type);
      return this.processNode(nextNode);
    } else {
      this.state.isComplete = true;
      return {
        isComplete: true,
        flowState: this.state.flowState,
        messages: this.state.messages
      };
    }
  }

  /**
   * Process a condition node
   */
  private processConditionNode(node: FlowNode): FlowExecutionResult {
    const conditionData = node.data;
    
    // Evaluate conditions and find the appropriate next node
    const nextNode = this.evaluateCondition(node, this.state.flowState);
    if (nextNode) {
      return this.processNode(nextNode);
    } else {
      this.state.isComplete = true;
      return {
        isComplete: true,
        flowState: this.state.flowState,
        messages: this.state.messages
      };
    }
  }

  /**
   * Process an action node
   */
  private processActionNode(node: FlowNode): FlowExecutionResult {
    const actionData = node.data;
    
    // Execute the action (for now, just log it)
    console.log('Executing action:', actionData.action);
    
    // Move to the next node
    const nextNode = this.findNextNode(node.id, this.state.flowState);
    if (nextNode) {
      return this.processNode(nextNode);
    } else {
      this.state.isComplete = true;
      return {
        isComplete: true,
        flowState: this.state.flowState,
        messages: this.state.messages
      };
    }
  }

  /**
   * Find the next node based on edges and conditions
   */
  private findNextNode(currentNodeId: string, flowState: Record<string, any>): FlowNode | null {
    const outgoingEdges = this.flow.edges.filter(edge => edge.source === currentNodeId);
    
    if (outgoingEdges.length === 0) {
      return null;
    }

    // If there's only one edge, follow it
    if (outgoingEdges.length === 1) {
      const edge = outgoingEdges[0];
      return this.flow.nodes.find(node => node.id === edge.target) || null;
    }

    // If there are multiple edges, evaluate conditions
    for (const edge of outgoingEdges) {
      if (this.evaluateEdgeCondition(edge, flowState)) {
        return this.flow.nodes.find(node => node.id === edge.target) || null;
      }
    }

    // If no conditions match, take the first edge
    const firstEdge = outgoingEdges[0];
    return this.flow.nodes.find(node => node.id === firstEdge.target) || null;
  }

  /**
   * Find the next question node from a given node
   */
  private findNextQuestionNode(currentNodeId: string): FlowNode | null {
    const nextNode = this.findNextNode(currentNodeId, this.state.flowState);
    if (!nextNode) {
      return null;
    }

    if (nextNode.type === 'question') {
      return nextNode;
    }

    // Recursively find the next question node
    return this.findNextQuestionNode(nextNode.id);
  }

  /**
   * Evaluate a condition node
   */
  private evaluateCondition(node: FlowNode, flowState: Record<string, any>): FlowNode | null {
    const conditionData = node.data;
    
    if (conditionData.conditionType === 'simple') {
      // Simple condition evaluation
      const rules = conditionData.rules || [];
      for (const rule of rules) {
        if (this.evaluateRule(rule, flowState)) {
          // Find the edge that matches this condition
          const edge = this.flow.edges.find(e => 
            e.source === node.id && 
            e.data?.condition === rule.condition
          );
          if (edge) {
            return this.flow.nodes.find(n => n.id === edge.target) || null;
          }
        }
      }
    } else if (conditionData.conditionType === 'multi-output') {
      // Multi-output condition evaluation
      const outputs = conditionData.outputs || [];
      for (const output of outputs) {
        const rules = output.rules || [];
        let allRulesMatch = true;
        
        for (const rule of rules) {
          if (!this.evaluateRule(rule, flowState)) {
            allRulesMatch = false;
            break;
          }
        }
        
        if (allRulesMatch) {
          // Find the edge that matches this output
          const edge = this.flow.edges.find(e => 
            e.source === node.id && 
            e.data?.output === output.name
          );
          if (edge) {
            return this.flow.nodes.find(n => n.id === edge.target) || null;
          }
        }
      }
    }

    return null;
  }

  /**
   * Evaluate an edge condition
   */
  private evaluateEdgeCondition(edge: FlowEdge, flowState: Record<string, any>): boolean {
    if (!edge.data?.condition) {
      return true; // No condition means always true
    }

    return this.evaluateRule(edge.data.condition, flowState);
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(rule: any, flowState: Record<string, any>): boolean {
    const { variable, operator, value } = rule;
    const variableValue = flowState[variable];

    switch (operator) {
      case 'equals':
        return variableValue === value;
      case 'not_equals':
        return variableValue !== value;
      case 'contains':
        return variableValue && variableValue.toString().toLowerCase().includes(value.toLowerCase());
      case 'not_contains':
        return !variableValue || !variableValue.toString().toLowerCase().includes(value.toLowerCase());
      case 'greater_than':
        return Number(variableValue) > Number(value);
      case 'less_than':
        return Number(variableValue) < Number(value);
      default:
        return false;
    }
  }

  /**
   * Get current execution state
   */
  public getState(): FlowExecutionState {
    return { ...this.state };
  }

  /**
   * Reset the flow execution
   */
  public reset(): void {
    this.state = {
      currentNodeId: null,
      flowState: {},
      messages: [],
      isComplete: false
    };
  }
}
