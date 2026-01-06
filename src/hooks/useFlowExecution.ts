// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { FlowExecutor, FlowExecutionResult } from '@/lib/flow-executor';
import { ChatbotFlow } from '@/types/flow';

export interface UseFlowExecutionOptions {
  targetUrl: string;
  flowType?: string;
  fallbackQuestions?: any[];
}

export interface UseFlowExecutionReturn {
  // Flow state
  isFlowLoaded: boolean;
  isFlowLoading: boolean;
  flowError: string | null;
  currentQuestion: any | null;
  isComplete: boolean;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  flowState: Record<string, any>;
  
  // Actions
  sendMessage: (message: string) => void;
  resetFlow: () => void;
  initializeFlow: () => void;
  
  // Fallback
  useFallback: boolean;
  fallbackQuestions: any[];
}

export function useFlowExecution({
  targetUrl,
  flowType,
  fallbackQuestions = []
}: UseFlowExecutionOptions): UseFlowExecutionReturn {
  const [isFlowLoaded, setIsFlowLoaded] = useState(false);
  const [isFlowLoading, setIsFlowLoading] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [flowState, setFlowState] = useState<Record<string, any>>({});
  const [useFallback, setUseFallback] = useState(false);
  const [flowExecutor, setFlowExecutor] = useState<FlowExecutor | null>(null);

  // Load flow from API
  const loadFlow = useCallback(async () => {
    setIsFlowLoading(true);
    setFlowError(null);

    try {
      // Try to load flow by target URL first
      let response = await fetch(`/api/flows/by-target?targetUrl=${encodeURIComponent(targetUrl)}`);
      
      // If not found and flowType is provided, try by flowType
      if (!response.ok && flowType) {
        response = await fetch(`/api/flows/by-target?targetUrl=${encodeURIComponent(targetUrl)}&flowType=${flowType}`);
      }

      if (response.ok) {
        const flowData = await response.json();
        const flow: ChatbotFlow = {
          id: flowData.id,
          name: flowData.name,
          description: flowData.description,
          version: flowData.version || '1.0.0',
          nodes: flowData.data.nodes || [],
          edges: flowData.data.edges || []
        };

        const executor = new FlowExecutor(flow);
        setFlowExecutor(executor);
        setIsFlowLoaded(true);
        setUseFallback(false);
        
        // Initialize the flow
        const result = executor.initialize();
        setCurrentQuestion(result.nextQuestion || null);
        setIsComplete(result.isComplete);
        setMessages(result.messages);
        setFlowState(result.flowState);
      } else {
        throw new Error(`No flow found for ${targetUrl}`);
      }
    } catch (error) {
      console.error('Failed to load flow:', error);
      setFlowError(error instanceof Error ? error.message : 'Failed to load flow');
      setUseFallback(true);
      setIsFlowLoaded(false);
    } finally {
      setIsFlowLoading(false);
    }
  }, [targetUrl, flowType]);

  // Initialize flow execution
  const initializeFlow = useCallback(() => {
    if (flowExecutor) {
      const result = flowExecutor.initialize();
      setCurrentQuestion(result.nextQuestion || null);
      setIsComplete(result.isComplete);
      setMessages(result.messages);
      setFlowState(result.flowState);
    }
  }, [flowExecutor]);

  // Send message and process response
  const sendMessage = useCallback((message: string) => {
    if (!flowExecutor || isComplete) {
      return;
    }

    const result = flowExecutor.processUserResponse(message);
    setCurrentQuestion(result.nextQuestion || null);
    setIsComplete(result.isComplete);
    setMessages(result.messages);
    setFlowState(result.flowState);
  }, [flowExecutor, isComplete]);

  // Reset flow execution
  const resetFlow = useCallback(() => {
    if (flowExecutor) {
      flowExecutor.reset();
      initializeFlow();
    }
  }, [flowExecutor, initializeFlow]);

  // Load flow on mount
  useEffect(() => {
    loadFlow();
  }, [loadFlow]);

  return {
    // Flow state
    isFlowLoaded,
    isFlowLoading,
    flowError,
    currentQuestion,
    isComplete,
    messages,
    flowState,
    
    // Actions
    sendMessage,
    resetFlow,
    initializeFlow,
    
    // Fallback
    useFallback,
    fallbackQuestions
  };
}
