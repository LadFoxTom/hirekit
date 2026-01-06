import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaForward, FaMagic, FaChartBar, FaEdit, FaEye, FaDownload } from 'react-icons/fa';
import { useLocale } from '@/context/LocaleContext';
import { CV_QUESTIONS, isBasicPhaseComplete } from '@/types/questions';

interface EnhancedCVChatInterfaceProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSendMessage: (message: string) => void;
  onSkipQuestion: () => void;
  onAIAnalysis: () => void;
  onGenerateOptimized: () => void;
  onEditCV: () => void;
  onPreviewCV: () => void;
  onDownloadCV: () => void;
  isLoading: boolean;
  isAIAnalyzing: boolean;
  cvData: any;
  currentQuestionIndex: number;
  hasOptimizationMode: boolean;
  aiAnalysisResult?: any;
  remainingTokens?: number;
  userPlan?: string;
}

const EnhancedCVChatInterface: React.FC<EnhancedCVChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onSkipQuestion,
  onAIAnalysis,
  onGenerateOptimized,
  onEditCV,
  onPreviewCV,
  onDownloadCV,
  isLoading,
  isAIAnalyzing,
  cvData,
  currentQuestionIndex,
  hasOptimizationMode,
  aiAnalysisResult,
  remainingTokens,
  userPlan
}) => {
  const { t } = useLocale();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Check if user has already interacted by looking at existing messages
  // Only set hasUserInteracted to true if there are user messages (not just assistant messages)
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length > 0) {
      setHasUserInteracted(true);
    }
  }, [messages]);

  // Scroll to bottom when messages change, but only after user has sent their first message
  useEffect(() => {
    if (hasUserInteracted && messages.length > 0 && messagesContainerRef.current) {
      // Scroll within the messages container instead of the entire page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, hasUserInteracted]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Wrapper function to mark user interaction and send message
  const handleSendMessage = (message: string) => {
    setHasUserInteracted(true);
    onSendMessage(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    handleSendMessage(inputValue.trim());
    setInputValue('');
  };



  // CV optimization suggestions for when we're in optimization mode
  const optimizationSuggestions = [
    "Make summary more impactful",
    "Add quantifiable achievements",
    "Improve skills organization",
    "Enhance experience descriptions",
    "Optimize for ATS",
    "Add relevant keywords",
    "Improve formatting",
    "Make it more concise",
    "Add industry-specific terms",
    "Highlight leadership experience",
    "Improve action verbs",
    "Add certifications",
    "Include relevant projects",
    "Optimize for target role"
  ];

  // Quick actions for CV optimization
  const quickActions = [
    {
      label: "Generate Optimized CV",
      action: onGenerateOptimized,
      icon: FaMagic,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "AI-powered CV optimization"
    },
    {
      label: "Analyze CV",
      action: onAIAnalysis,
      icon: FaChartBar,
      color: "bg-green-600 hover:bg-green-700",
      description: "Get detailed feedback"
    },
    {
      label: "Edit CV",
      action: onEditCV,
      icon: FaEdit,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Manual editing mode"
    },
    {
      label: "Preview CV",
      action: onPreviewCV,
      icon: FaEye,
      color: "bg-orange-600 hover:bg-orange-700",
      description: "Full preview mode"
    },
    {
      label: "Download PDF",
      action: onDownloadCV,
      icon: FaDownload,
      color: "bg-red-600 hover:bg-red-700",
      description: "Export as PDF"
    }
  ];

  // Calculate progress
  const calculateProgress = () => {
    if (hasOptimizationMode) return 100;
    
    const basicQuestions = CV_QUESTIONS.filter(q => q.phase === 'basic');
    const requiredBasicQuestions = basicQuestions.filter(q => !q.optional);
    const answeredQuestions = requiredBasicQuestions.filter(question => {
      switch (question.id) {
        case 'fullName':
          return cvData.fullName && cvData.fullName.trim().length > 0;
        case 'email':
          return cvData.contact?.email && cvData.contact.email.trim().length > 0;
        case 'location':
          return cvData.contact?.location && cvData.contact.location.trim().length > 0;
        case 'summary':
          return cvData.summary && cvData.summary.trim().length > 0;
        case 'experience_intro':
          return cvData.experience && cvData.experience.length > 0;
        case 'education_intro':
          return cvData.education && cvData.education.length > 0;
        case 'skills_intro':
          return cvData.skills && (
            Array.isArray(cvData.skills) ? cvData.skills.length > 0 : 
            Object.values(cvData.skills).some((skillArray: any) => skillArray.length > 0)
          );
        case 'experience_company':
        case 'experience_title':
        case 'experience_type':
        case 'experience_current':
        case 'experience_dates':
        case 'experience_achievements':
          // These are part of the experience section, check if experience exists and has content
          return cvData.experience && cvData.experience.length > 0 && 
                 cvData.experience.some((exp: any) => 
                   exp.company && exp.company.trim().length > 0 &&
                   exp.title && exp.title.trim().length > 0 &&
                   exp.dates && exp.dates.trim().length > 0
                 );
        case 'education_institution':
        case 'education_degree':
        case 'education_field':
        case 'education_dates':
          // These are part of the education section, check if education exists and has content
          return cvData.education && cvData.education.length > 0 &&
                 cvData.education.some((edu: any) =>
                   edu.institution && edu.institution.trim().length > 0 &&
                   edu.degree && edu.degree.trim().length > 0 &&
                   edu.dates && edu.dates.trim().length > 0
                 );
        case 'technical_skills':
        case 'soft_skills':
          // These are part of the skills section, check if skills exist and have content
          return cvData.skills && (
            Array.isArray(cvData.skills) ? cvData.skills.length > 0 : 
            (cvData.skills.technical && cvData.skills.technical.length > 0) ||
            (cvData.skills.soft && cvData.skills.soft.length > 0)
          );
        case 'basic_completion':
          // This is the completion question, only true if all other required questions are answered
          return false; // Will be calculated separately
        default:
          return false; // Default to false for any unhandled questions
      }
    });
    
    // Don't count the completion question in the total for progress calculation
    const progressQuestions = requiredBasicQuestions.filter(q => q.id !== 'basic_completion');
    const answeredProgressQuestions = answeredQuestions.filter(q => q.id !== 'basic_completion');
    
    return Math.round((answeredProgressQuestions.length / progressQuestions.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {hasOptimizationMode ? 'CV Complete - Optimization Mode' : `CV Progress: ${progress}%`}
          </span>
          {remainingTokens !== undefined && (
            <span className="text-xs text-gray-500">
              {remainingTokens} tokens remaining ({userPlan || 'free'} plan)
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

             {/* Messages Area - Flexible height with internal scroll */}
       <div 
         ref={messagesContainerRef}
         className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
       >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">
              {hasOptimizationMode ? 'CV Optimization Mode' : 'Advanced CV Builder'}
            </h3>
            <p className="text-sm">
              {hasOptimizationMode 
                ? 'Your CV is complete! Use the suggestions below to optimize and improve it further.'
                : 'Let\'s build your professional CV step by step. I\'ll guide you through each section.'
              }
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin text-sm" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Optimization Mode UI */}
      {hasOptimizationMode && (
        <>
          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={isLoading || isAIAnalyzing}
                    className={`${action.color} text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1`}
                    title={action.description}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Optimization Suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {optimizationSuggestions.slice(0, 8).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading || isAIAnalyzing}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

                    {/* Input Area */}
       <div className="flex-shrink-0 p-3 border-t border-gray-200">
         <form onSubmit={handleSubmit} className="flex space-x-2">
           <textarea
             ref={inputRef}
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             placeholder={
               hasOptimizationMode 
                 ? "Ask me to improve your CV or type a specific request..."
                 : "Type your answer here..."
             }
             disabled={isLoading || isAIAnalyzing}
             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm touch-manipulation"
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
             disabled={!inputValue.trim() || isLoading || isAIAnalyzing}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
           >
             {isLoading ? (
               <FaSpinner className="animate-spin" />
             ) : (
               <FaPaperPlane />
             )}
           </button>
           {!hasOptimizationMode && (
             <button
               type="button"
               onClick={onSkipQuestion}
               disabled={isLoading || isAIAnalyzing}
               className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
               title="Skip this question"
             >
               <FaForward />
             </button>
           )}
         </form>
       </div>
    </div>
  );
};

export default EnhancedCVChatInterface; 