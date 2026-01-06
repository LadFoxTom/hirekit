'use client';

import { useState, useRef, useEffect } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { Send, X, Play, Pause, RotateCcw, MessageSquare, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  nodeId?: string;
  isTyping?: boolean;
  options?: Array<{ id: string; label: string; value: string }>;
  questionType?: 'text' | 'multiple-choice' | 'yes-no' | 'rating' | 'email' | 'phone';
}

interface ChatTestWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatTestWindow = ({ isOpen, onClose }: ChatTestWindowProps) => {
  const { currentFlow } = useFlowStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startTest = () => {
    if (!currentFlow) return;
    
    setIsRunning(true);
    setMessages([]);
    setFlowState({});
    
    // Find start node
    const startNode = currentFlow.nodes.find(node => node.type === 'start');
    if (startNode) {
      setCurrentNodeId(startNode.id);
      // Find the first node after start (could be message or question)
      const firstNode = findNextNode(startNode.id, flowState);
      if (firstNode) {
        setTimeout(() => {
          processNode(firstNode, flowState);
        }, 500);
      }
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    setCurrentNodeId(null);
  };

  const resetTest = () => {
    setIsRunning(false);
    setMessages([]);
    setFlowState({});
    setCurrentNodeId(null);
  };

  const processNode = (node: any, currentFlowState: Record<string, any> = flowState) => {
    if (!node) return;

    console.log('Processing node:', node.type, node.id, node.data);
    setCurrentNodeId(node.id);

    // Prevent processing the same node multiple times
    if (node.type === 'condition' && currentNodeId === node.id) {
      console.log('Preventing duplicate condition node processing');
      return;
    }

    if (node.type === 'message') {
      const messageText = node.data?.content || node.data?.label || 'Message';
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: messageText,
        timestamp: new Date(),
        nodeId: node.id,
        isTyping: true
      };
      setMessages(prev => [...prev, message]);
      
      // Simulate typing effect
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, isTyping: false }
              : msg
          )
        );
        
        // Auto-advance to next node after message
        const nextNode = findNextNode(node.id, currentFlowState);
        if (nextNode) {
          setTimeout(() => {
            processNode(nextNode, currentFlowState);
          }, 1000);
        }
      }, 1000);
    } else if (node.type === 'question') {
      const questionText = node.data?.question || node.data?.label || 'Question';
      
      // Convert simple string options to object format if needed
      const rawOptions = node.data?.options || [];
      const convertedOptions = rawOptions.map((option: any, index: number) => {
        if (typeof option === 'string') {
          return {
            id: `opt-${index}`,
            label: option,
            value: option.toLowerCase().replace(/[^a-z0-9]/g, '_')
          };
        }
        return option;
      });
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: questionText,
        timestamp: new Date(),
        nodeId: node.id,
        isTyping: true,
        options: convertedOptions,
        questionType: node.data?.questionType || 'text'
      };

      setMessages(prev => [...prev, message]);

      // Simulate typing
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, isTyping: false }
              : msg
          )
        );
      }, 1000);
    } else if (node.type === 'condition') {
      // For condition nodes, evaluate and automatically move to the next node silently
      const condition = node.data?.condition;
      const conditionType = node.data?.conditionType || 'simple';
      console.log('Processing condition node silently');
      console.log('Condition:', condition);
      console.log('Condition type:', conditionType);
      console.log('Current flow state:', currentFlowState);
      
      // Automatically move to the next node immediately (completely silent)
      const nextNode = findNextNode(node.id, currentFlowState);
      console.log('Next node after condition:', nextNode);
      if (nextNode) {
        // Process the next node immediately without any delay or message
        processNode(nextNode, currentFlowState);
      } else {
        console.log('No next node found after condition - flow ended');
        setIsRunning(false);
      }
    } else if (node.type === 'end') {
      const endMessage = node.data?.action || 'Flow completed!';
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: endMessage,
        timestamp: new Date(),
        nodeId: node.id
      };
      setMessages(prev => [...prev, message]);
      setIsRunning(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !isRunning || !currentNodeId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store the user's response
    const currentNode = currentFlow?.nodes.find(node => node.id === currentNodeId);
    console.log('Current node when sending message:', currentNode);
    
    if (currentNode?.data?.variableName) {
      console.log('Storing variable:', currentNode.data.variableName, '=', inputValue);
      setFlowState(prev => {
        const newState = {
          ...prev,
          [currentNode.data.variableName as string]: inputValue
        };
        console.log('New flow state:', newState);
        return newState;
      });
    }

    setInputValue('');

    // Find next node with updated flow state
    setTimeout(() => {
      // Get the updated flow state with the new variable
      const updatedFlowState = {
        ...flowState,
        [currentNode?.data?.variableName as string]: inputValue
      };
      const nextNode = findNextNode(currentNodeId, updatedFlowState);
      console.log('Next node after user input:', nextNode);
      if (nextNode) {
        processNode(nextNode, updatedFlowState);
      } else {
        console.log('No next node found after user input - flow ended');
        setIsRunning(false);
      }
    }, 100); // Reduced from 500ms to 100ms
  };

  // Function to evaluate condition rules
  const evaluateCondition = (condition: any, flowState: Record<string, any>): boolean => {
    if (!condition || !condition.rules || condition.rules.length === 0) {
      return true; // No rules means always true
    }

    const operator = condition.operator || 'and';
    console.log('Evaluating condition with operator:', operator);
    
    const results = condition.rules.map((rule: any) => {
      const fieldValue = flowState[rule.field];
      const ruleValue = rule.value;

      console.log(`  Rule: ${rule.field} ${rule.operator} ${ruleValue}`);
      console.log(`  Field value: "${fieldValue}"`);

      let result = false;
      switch (rule.operator) {
        case 'equals':
          result = String(fieldValue).trim().toLowerCase() === String(ruleValue).trim().toLowerCase();
          break;
        case 'not_equals':
          result = String(fieldValue).trim().toLowerCase() !== String(ruleValue).trim().toLowerCase();
          break;
        case 'contains':
          result = String(fieldValue).includes(String(ruleValue));
          break;
        case 'greater_than':
          result = Number(fieldValue) > Number(ruleValue);
          break;
        case 'less_than':
          result = Number(fieldValue) < Number(ruleValue);
          break;
        case 'starts_with':
          result = String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
          break;
        case 'ends_with':
          result = String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
          break;
        case 'is_empty':
          result = !fieldValue || String(fieldValue).trim() === '';
          break;
        case 'is_not_empty':
          result = fieldValue && String(fieldValue).trim() !== '';
          break;
        case 'in_list':
          // Handle comma-separated values for "in list" operator
          const listValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
          result = listValues.includes(String(fieldValue).trim().toLowerCase());
          break;
        case 'not_in_list':
          // Handle comma-separated values for "not in list" operator
          const notListValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
          result = !notListValues.includes(String(fieldValue).trim().toLowerCase());
          break;
        default:
          result = false;
      }
      
      console.log(`  Rule result: ${result}`);
      return result;
    });

    const finalResult = operator === 'and'
      ? results.every((result: boolean) => result === true)
      : results.some((result: boolean) => result === true);
      
    console.log(`  Final result (${operator}): ${finalResult}`);
    return finalResult;
  };

  const findNextNode = (currentNodeId: string, currentFlowState: Record<string, any> = flowState) => {
    if (!currentFlow) return null;

    const currentNode = currentFlow.nodes.find(node => node.id === currentNodeId);
    if (!currentNode) return null;

    console.log('Finding next node from:', currentNode.type, currentNodeId);
    console.log('Using flow state:', currentFlowState);

    // If it's a condition node, evaluate the condition and choose the appropriate edge
    if (currentNode.type === 'condition') {
      const condition = currentNode.data?.condition;
      const conditionType = currentNode.data?.conditionType || 'simple';
      
      if (conditionType === 'multi-output') {
        // Multi-output condition evaluation
        const outputs = condition?.outputs || [];
        console.log('Evaluating multi-output condition with outputs:', outputs);
        
        // Find the first matching output
        for (const output of outputs) {
          const outputRules = output.rules || [];
          console.log(`Evaluating output ${output.value} (${output.label}) with rules:`, outputRules);
          
          if (outputRules.length === 0) {
            // If no rules, this is a default/catch-all output
            console.log(`Output ${output.value} has no rules, using as default`);
            const edge = currentFlow.edges.find(edge => 
              edge.source === currentNodeId && edge.sourceHandle === output.value
            );
            if (edge) {
              const nextNode = currentFlow.nodes.find(node => node.id === edge.target);
              console.log('Found default edge:', edge, 'Next node:', nextNode);
              return nextNode;
            }
            continue;
          }
          
          // Evaluate all rules for this output (AND logic)
          const outputResult = outputRules.every((rule: any) => {
            const fieldValue = currentFlowState[rule.field];
            const ruleValue = rule.value;
            
            console.log(`  Rule: ${rule.field} ${rule.operator} ${ruleValue}`);
            console.log(`  Field value: "${fieldValue}"`);
            
            let result = false;
            switch (rule.operator) {
              case 'equals':
                result = String(fieldValue).trim().toLowerCase() === String(ruleValue).trim().toLowerCase();
                break;
              case 'not_equals':
                result = String(fieldValue).trim().toLowerCase() !== String(ruleValue).trim().toLowerCase();
                break;
              case 'contains':
                result = String(fieldValue).includes(String(ruleValue));
                break;
              case 'starts_with':
                result = String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
                break;
              case 'ends_with':
                result = String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
                break;
              case 'is_empty':
                result = !fieldValue || String(fieldValue).trim() === '';
                break;
              case 'is_not_empty':
                result = fieldValue && String(fieldValue).trim() !== '';
                break;
              case 'in_list':
                const listValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
                result = listValues.includes(String(fieldValue).trim().toLowerCase());
                break;
              case 'not_in_list':
                const notListValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
                result = !notListValues.includes(String(fieldValue).trim().toLowerCase());
                break;
              case 'greater_than':
                result = Number(fieldValue) > Number(ruleValue);
                break;
              case 'less_than':
                result = Number(fieldValue) < Number(ruleValue);
                break;
              default:
                result = false;
            }
            
            console.log(`  Rule result: ${result}`);
            return result;
          });
          
          if (outputResult) {
            console.log(`Output ${output.value} matched! Looking for edge with sourceHandle: ${output.value}`);
            const edge = currentFlow.edges.find(edge => 
              edge.source === currentNodeId && edge.sourceHandle === output.value
            );
            
            if (edge) {
              const nextNode = currentFlow.nodes.find(node => node.id === edge.target);
              console.log('Found matching edge:', edge, 'Next node:', nextNode);
              
              // Check if the target node is a question with condition triggers
              if (nextNode && nextNode.type === 'question') {
                const conditionTriggers = (nextNode.data as any)?.conditionTriggers;
                if (conditionTriggers && conditionTriggers[currentNodeId]) {
                  const expectedTrigger = conditionTriggers[currentNodeId];
                  if (expectedTrigger !== output.value) {
                    console.log(`Question node expects trigger "${expectedTrigger}" but condition output is "${output.value}", skipping`);
                    continue; // Skip this edge and try the next output
                  }
                }
              }
              
              return nextNode;
            }
          }
        }
        
        console.log('No matching output found, no edge taken');
        return null;
      } else {
        // Simple condition evaluation (True/False)
        const isConditionTrue = evaluateCondition(condition, currentFlowState);
        
        // Find the appropriate edge based on condition result
        const targetHandle = isConditionTrue ? 'true' : 'false';
        console.log('Looking for edge with sourceHandle:', targetHandle);
        
        const edge = currentFlow.edges.find(edge => 
          edge.source === currentNodeId && edge.sourceHandle === targetHandle
        );
        
        console.log('Found edge:', edge);
        
        if (edge) {
          const nextNode = currentFlow.nodes.find(node => node.id === edge.target);
          console.log('Next node:', nextNode);
          
          // Check if the target node is a question with condition triggers
          if (nextNode && nextNode.type === 'question') {
            const conditionTriggers = (nextNode.data as any)?.conditionTriggers;
            if (conditionTriggers && conditionTriggers[currentNodeId]) {
              const expectedTrigger = conditionTriggers[currentNodeId];
              if (expectedTrigger !== targetHandle) {
                console.log(`Question node expects trigger "${expectedTrigger}" but condition output is "${targetHandle}", skipping`);
                // For simple conditions, we only have true/false, so if it doesn't match, return null
                return null;
              }
            }
          }
          
          return nextNode;
        }
      }
    } else {
      // For non-condition nodes, find the first edge (default behavior)
      const edge = currentFlow.edges.find(edge => edge.source === currentNodeId);
      console.log('Found edge for non-condition node:', edge);
      
      if (edge) {
        const nextNode = currentFlow.nodes.find(node => node.id === edge.target);
        console.log('Next node:', nextNode);
        return nextNode;
      }
    }
    
    console.log('No next node found');
    return null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    if (!isRunning || !currentNodeId) return;

    // Add user message showing the selected option
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: optionLabel,
      timestamp: new Date(),
      nodeId: currentNodeId
    };
    setMessages(prev => [...prev, userMessage]);

    // Process the selected option
    const currentNode = currentFlow?.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    const updatedFlowState = {
      ...flowState,
      [currentNode.data.variableName as string]: optionValue
    };

    console.log('Option selected:', { optionValue, optionLabel, updatedFlowState });
    
    // Update flow state and then process next node
    setFlowState(updatedFlowState);
    
    // Use setTimeout to ensure state is updated before finding next node
    setTimeout(() => {
      // Find next node with the updated flow state
      const nextNode = findNextNode(currentNodeId, updatedFlowState);
      console.log('Next node after option click:', nextNode);
      
      if (nextNode) {
        setCurrentNodeId(nextNode.id);
        processNode(nextNode, updatedFlowState);
      } else {
        console.log('No next node found, flow may be complete');
        setIsRunning(false);
      }
    }, 100); // Reduced timeout for better responsiveness
  };

  const getFlowStats = () => {
    if (!currentFlow) return { total: 0, completed: 0 };
    
    const questionNodes = currentFlow.nodes.filter(node => node.type === 'question');
    const answeredQuestions = Object.keys(flowState).length;
    
    return {
      total: questionNodes.length,
      completed: answeredQuestions
    };
  };

  const stats = getFlowStats();

  // Component to render multiple choice options
  const MultipleChoiceOptions = ({ 
    options, 
    onOptionClick, 
    disabled = false,
    answeredValue = null 
  }: { 
    options: Array<{ id: string; label: string; value: string }>, 
    onOptionClick: (value: string, label: string) => void,
    disabled?: boolean,
    answeredValue?: string | null
  }) => (
    <div className="mt-3 space-y-2">
      {options.map((option) => {
        const isAnswered = answeredValue === option.value;
        const isDisabled = disabled || (answeredValue !== null && !isAnswered);
        
        return (
          <button
            key={option.id}
            onClick={() => !isDisabled && onOptionClick(option.value, option.label)}
            disabled={isDisabled}
            className={`w-full text-left px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none ${
              isDisabled 
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' 
                : isAnswered
                ? 'bg-green-50 border-green-300 hover:bg-green-100'
                : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border-2 rounded-full flex-shrink-0 ${
                isAnswered 
                  ? 'bg-green-500 border-green-500' 
                  : isDisabled 
                  ? 'border-gray-300 bg-gray-100' 
                  : 'border-gray-300'
              }`}>
                {isAnswered && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium ${
                isDisabled ? 'text-gray-500' : isAnswered ? 'text-green-800' : 'text-gray-900'
              }`}>
                {option.label}
                {isAnswered && <span className="ml-2 text-xs text-green-600">✓ Selected</span>}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <MessageSquare size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Chat Flow Tester</h3>
                {currentFlow && (
                  <span className="text-sm text-gray-500">- {currentFlow.name}</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <button
                  onClick={startTest}
                  disabled={isRunning || !currentFlow}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                  <span>Start Test</span>
                </button>
                
                <button
                  onClick={stopTest}
                  disabled={!isRunning}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
                
                <button
                  onClick={resetTest}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{stats.completed}/{stats.total}</span>
                </div>
                {isRunning && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600">Running</span>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Click "Start Test" to begin testing your flow.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{message.content}</span>
                          {message.isTyping && (
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          )}
                        </div>
                        
                        {/* Show multiple choice options for bot messages with options */}
                        {message.type === 'bot' && message.options && message.options.length > 0 && !message.isTyping && (() => {
                          // Check if this question has been answered
                          const questionNode = currentFlow?.nodes.find(node => node.id === message.nodeId);
                          const variableName = questionNode?.data?.variableName;
                          const answeredValue = variableName ? flowState[variableName] : null;
                          const isAnswered = answeredValue !== null && answeredValue !== undefined;
                          
                          return (
                            <MultipleChoiceOptions 
                              options={message.options} 
                              onOptionClick={handleOptionClick}
                              disabled={isAnswered}
                              answeredValue={answeredValue}
                            />
                          );
                        })()}
                        
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Only show for text questions or when no options are available */}
            {(() => {
              const lastMessage = messages[messages.length - 1];
              const hasMultipleChoiceOptions = lastMessage?.type === 'bot' && 
                lastMessage?.options && 
                lastMessage.options.length > 0 && 
                !lastMessage.isTyping;
              
              if (!hasMultipleChoiceOptions) {
                return (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isRunning ? "Type your response..." : "Click 'Start Test' to begin"}
                        disabled={!isRunning}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!isRunning || !inputValue.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatTestWindow;
