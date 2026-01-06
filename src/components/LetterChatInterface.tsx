'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaSpinner, FaForward, FaUndo, FaMagic, FaCheck, FaLightbulb } from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'
import { LETTER_QUESTIONS } from '@/data/letterQuestions'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface LetterChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  onSkipQuestion: () => void
  onGenerateLetter: () => void
  onEditLetter: () => void
  currentQuestionIndex: number
  hasInitialDraft?: boolean
}

const LetterChatInterface: React.FC<LetterChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSkipQuestion,
  onGenerateLetter,
  onEditLetter,
  currentQuestionIndex,
  hasInitialDraft = false
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useLocale()

  const currentQuestion = LETTER_QUESTIONS[currentQuestionIndex]

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Reset input when question changes
    setInputValue('')
    setSelectedOptions([])
  }, [currentQuestionIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    let messageToSend = ''
    
    if (currentQuestion?.type === 'multiselect') {
      messageToSend = selectedOptions.join(', ')
    } else {
      messageToSend = inputValue.trim()
    }

    if (messageToSend) {
      onSendMessage(messageToSend)
      setInputValue('')
      setSelectedOptions([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleOptionSelect = (option: string) => {
    if (currentQuestion?.type === 'multiselect') {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(o => o !== option)
          : [...prev, option]
      )
    } else {
      setInputValue(option)
    }
  }

  // Editing suggestions for when we have an initial draft
  const editingSuggestions = [
    "Make it more confident",
    "Add specific achievements",
    "Change tone to enthusiastic",
    "Shorten opening paragraph",
    "Add company research",
    "Highlight relevant skills",
    "Make it more concise",
    "Add a call to action",
    "Improve the closing",
    "Make it more personal"
  ]

  const renderInputField = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'textarea':
        return (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentQuestion.placeholder || t('letter_builder.type_message')}
            disabled={isLoading}
            rows={4}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
          />
        )

      case 'select':
        return (
          <div className="flex-1">
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">{t('letter_builder.select_option')}</option>
              {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>
                  {currentQuestion.optionsLabels?.[option] || option}
                </option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        return (
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isLoading}
                  className={`flex items-center justify-between p-2 text-left border rounded-lg transition-colors ${
                    selectedOptions.includes(option)
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  <span className="text-sm">
                    {currentQuestion.optionsLabels?.[option] || option}
                  </span>
                  {selectedOptions.includes(option) && (
                    <FaCheck className="text-blue-600 text-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasInitialDraft ? "Type your editing request..." : (currentQuestion.placeholder || t('letter_builder.type_message'))}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        )
    }
  }

  const canSubmit = () => {
    if (isLoading) return false
    
    if (currentQuestion?.type === 'multiselect') {
      return selectedOptions.length > 0
    }
    
    return inputValue.trim().length > 0
  }

  const quickActions = [
    {
      label: t('letter_builder.generate_letter'),
      action: onGenerateLetter,
      icon: FaMagic,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: t('letter_builder.edit_letter'),
      action: onEditLetter,
      icon: FaUndo,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: t('letter_builder.skip_question'),
      action: onSkipQuestion,
      icon: FaForward,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ]

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">{t('letter_builder.title')}</h3>
            <p className="text-xs sm:text-sm">
              {hasInitialDraft ? 'Your initial draft is ready! Use the chat to refine and improve it.' : t('letter_builder.welcome')}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-3 sm:px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm">{t('letter_builder.ai_thinking')}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Editing Suggestions */}
      {hasInitialDraft && messages.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex items-center mb-2">
            <FaLightbulb className="text-yellow-500 mr-2 text-sm" />
            <span className="text-xs font-medium text-gray-700">Quick Editing Suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {editingSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                disabled={isLoading}
                className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {messages.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={isLoading}
                  className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white rounded-lg transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <IconComponent className="mr-1 sm:mr-1.5 text-xs" />
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          {renderInputField()}
          <button
            type="submit"
            disabled={!canSubmit()}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-xs sm:text-sm" />
            ) : (
              <FaPaperPlane className="text-xs sm:text-sm" />
            )}
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 <strong>{t('letter_builder.pro_tips.title')}</strong></p>
          <ul className="mt-1 space-y-0.5 sm:space-y-1">
            <li>• {t('letter_builder.pro_tips.achievements')}</li>
            <li>• {t('letter_builder.pro_tips.research')}</li>
            <li>• {t('letter_builder.pro_tips.enthusiasm')}</li>
            <li>• {t('letter_builder.pro_tips.tone')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LetterChatInterface 