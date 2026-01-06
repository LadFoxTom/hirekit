'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaForward, FaUndo, FaLightbulb, FaSpinner } from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  isLoading?: boolean
  currentQuestionIsOptional?: boolean
  onSkipQuestion?: () => void
  onAIAnalysis?: () => Promise<void>
  isAIAnalyzing?: boolean
  aiAnalysisResult?: any
  remainingTokens?: number
  userPlan?: string
}

// Quick action suggestions based on current context
const QUICK_ACTIONS = {
  name: ['John Smith', 'Jane Doe', 'Alex Johnson'],
  title: ['Software Engineer', 'Marketing Manager', 'Data Analyst', 'Project Manager', 'Supply Chain Specialist', 'Sales Representative'],
  email: ['john.smith@email.com', 'jane.doe@company.com', 'My email is john.smith@email.com'],
  phone: ['+1 (555) 123-4567', '+44 20 7946 0958', 'My phone is +1 (555) 123-4567'],
  location: ['San Francisco, CA', 'London, UK', 'New York, NY'],
  summary: ['Experienced professional with 5+ years in...', 'Passionate about delivering results...'],
  skills: ['JavaScript, React, Node.js', 'Python, Data Analysis, SQL', 'Project Management, Leadership'],
  experience: ['Senior Developer at Tech Corp', 'Marketing Manager at Startup Inc'],
  education: ['Bachelor\'s in Computer Science', 'MBA from Business School'],
  hobbies: ['Reading, Traveling, Photography', 'Hiking, Cooking, Music']
}

export function ChatInterface({
  onSendMessage,
  messages,
  isLoading = false,
  currentQuestionIsOptional = false,
  onSkipQuestion,
  onAIAnalysis,
  isAIAnalyzing = false,
  aiAnalysisResult,
  remainingTokens,
  userPlan
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { t, language, isClient: localeIsClient } = useLocale()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before scrolling
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
        // Also try scrolling to the messagesEndRef element
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      })
    }
  }, [messages, isLoading])

  // Additional scroll effect specifically for when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }
    
    // Scroll immediately
    scrollToBottom()
    
    // Also scroll after a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100)
    
    return () => clearTimeout(timeoutId)
  }, [messages.length])

  useEffect(() => {
    if (isClient) {
      inputRef.current?.focus()
    }
  }, [isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      await onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleSkip = () => {
    if (onSkipQuestion) {
      onSkipQuestion()
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    inputRef.current?.focus()
  }

  // Get current question context for quick actions
  const getCurrentQuestionContext = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant')
    if (!lastAssistantMessage) return null

    // Try to detect context from translation key first
    const content = lastAssistantMessage.content
    if (content === 'question.fullName') return 'name'
    if (content === 'question.title') return 'title'
    if (content === 'question.email') return 'email'
    if (content === 'question.phone') return 'phone'
    if (content === 'question.location') return 'location'
    if (content === 'question.summary') return 'summary'
    if (content === 'question.skills') return 'skills'
    if (content === 'question.experience_intro') return 'experience'
    if (content === 'question.education_intro') return 'education'
    if (content === 'question.hobbies') return 'hobbies'

    // Fallback to content analysis
    const translatedContent = t(content).toLowerCase()
    if (translatedContent.includes('full name') || translatedContent.includes('name')) return 'name'
    if (translatedContent.includes('job title') || translatedContent.includes('position')) return 'title'
    if (translatedContent.includes('email')) return 'email'
    if (translatedContent.includes('phone')) return 'phone'
    if (translatedContent.includes('location') || translatedContent.includes('where')) return 'location'
    if (translatedContent.includes('summary') || translatedContent.includes('background')) return 'summary'
    if (translatedContent.includes('skills')) return 'skills'
    if (translatedContent.includes('experience') || translatedContent.includes('job')) return 'experience'
    if (translatedContent.includes('education') || translatedContent.includes('degree')) return 'education'
    if (translatedContent.includes('hobbies') || translatedContent.includes('interests')) return 'hobbies'
    
    return null
  }

  const currentContext = getCurrentQuestionContext()
  const quickActions = currentContext ? QUICK_ACTIONS[currentContext as keyof typeof QUICK_ACTIONS] : []

  // Don't render until client-side hydration is complete
  if (!isClient || !localeIsClient) {
    return (
      <div className="flex flex-col h-96">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-bl-none">
              <p className="whitespace-pre-wrap">Loading chat...</p>
            </div>
          </div>
        </div>
        <div className="border-t p-4 bg-white">
          <div className="flex space-x-2">
            <div className="flex-1 border p-2 rounded-md bg-gray-100 h-16"></div>
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 bg-gray-300 rounded-md text-white w-16 h-8"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm sm:text-sm leading-relaxed break-words">
                {message.role === 'assistant' ? t(message.content) : message.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mobile-Optimized Input Area (fixed at bottom) */}
      <div className="border-t border-gray-200 bg-white">
        <div className="px-2 py-3 sm:py-2">
          {/* AI Analysis Button */}
          {onAIAnalysis && messages.length > 2 && (
            <div className="mb-2 flex flex-col items-center space-y-2">
              <button
                onClick={onAIAnalysis}
                disabled={isAIAnalyzing || isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAIAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <FaLightbulb className="mr-2 text-sm" />
                    AI Analysis (1 token)
                  </>
                )}
              </button>
              {remainingTokens !== undefined && (
                <div className="text-xs text-gray-500">
                  {remainingTokens === Infinity ? (
                    <span className="text-green-600">Unlimited tokens (Development)</span>
                  ) : (
                    <span>{remainingTokens} tokens remaining ({userPlan || 'free'} plan)</span>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* AI Analysis Result */}
          {aiAnalysisResult && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-800">
                <strong>AI Analysis:</strong>
                {aiAnalysisResult.recommendations && (
                  <div className="mt-1">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside">
                      {aiAnalysisResult.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
                     <form onSubmit={handleSubmit} className="flex space-x-2">
             <textarea
               ref={inputRef}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={t('chat.placeholder')}
               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm touch-manipulation"
               rows={4}
               style={{ minHeight: '80px', maxHeight: '200px' }}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault()
                   handleSubmit(e)
                 }
               }}
             />
             <button
               type="submit"
               disabled={!input.trim() || isLoading}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
             >
               {isLoading ? (
                 <FaSpinner className="animate-spin" />
               ) : (
                 <FaPaperPlane />
               )}
             </button>
             {onSkipQuestion && (
               <button
                 type="button"
                 onClick={handleSkip}
                 disabled={isLoading}
                 className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                 title="Skip this question"
               >
                 <FaForward />
               </button>
             )}
           </form>
        </div>
      </div>
    </div>
  )
} 