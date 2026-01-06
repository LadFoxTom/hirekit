'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaPrint, FaEye, FaTrash, FaCompress, FaExpand } from 'react-icons/fa';
import Navbar from '@/components/landing/Navbar';
import { SIMPLIFIED_CV_QUESTIONS, SimplifiedQuestion, STANDARD_RESPONSES } from '@/types/questions-simplified';
import { StandardizedResponseHandler, ResponseResult } from '@/lib/response-handler';
import { useCVData } from '@/hooks/useCVData';
import { ChatInterface } from '@/components/ChatInterface';
import { CVPreview } from '@/components/CVPreview';
import ProgressIndicator from '@/components/ProgressIndicator';
import PDFExport from '@/components/PDFExport';
import { useModalContext } from '@/components/providers/ModalProvider';
import { openCVPreview } from '@/lib/cv-data-utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadSavedDropdown from '@/components/LoadSavedDropdown';

export default function SimplifiedBuilderPage() {
  const { showConfirm } = useModalContext();
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthenticated = !!session?.user;
  
  // State management
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cvZoom, setCvZoom] = useState(1);
  const [savedCVId, setSavedCVId] = useState<string | null>(null);
  
  // Use our custom CV data hook
  const { 
    cvData, 
    updateCvData, 
    canUndo, 
    handleUndo, 
    resetCvData,
    loadSampleData
  } = useCVData();

  // Initialize the conversation
  useEffect(() => {
    if (messages.length === 0 && SIMPLIFIED_CV_QUESTIONS.length > 0) {
      const firstQuestion = SIMPLIFIED_CV_QUESTIONS[0];
      const questionText = firstQuestion.textKey === 'intro.welcome' 
        ? 'Welcome to the Basic CV Builder! I\'ll help you create a professional CV step by step.'
        : firstQuestion.textKey;
      setMessages([{ role: 'assistant', content: questionText }]);
    }
  }, [messages.length]);

  // Auto-save functionality (includes sample data so it persists)
  useEffect(() => {
    const autoSave = () => {
      if (cvData && Object.keys(cvData).length > 0) {
        localStorage.setItem('cvData', JSON.stringify(cvData));
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [cvData]);

  // Load saved CV ID from localStorage (when editing from dashboard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCVIdFromStorage = localStorage.getItem('saved_cv_id');
      if (savedCVIdFromStorage) {
        console.log('[Builder] Loaded saved CV ID:', savedCVIdFromStorage);
        setSavedCVId(savedCVIdFromStorage);
        localStorage.removeItem('saved_cv_id'); // Clear after use
      }
    }
  }, []);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      // Get current question
      const currentQuestion = SIMPLIFIED_CV_QUESTIONS[currentQuestionIndex];
      if (!currentQuestion) {
        toast.error('No question found');
        return;
      }

      // Process the response using standardized handler
      const result: ResponseResult = StandardizedResponseHandler.processResponse(
        currentQuestion,
        message,
        cvData
      );

      // Handle validation errors
      if (!result.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
        setIsLoading(false);
        return;
      }

      // Update CV data if there are updates
      if (result.cvDataUpdate) {
        updateCvData(result.cvDataUpdate, `Updated ${currentQuestion.id}`);
      }

      // Add acknowledgment message
      setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);

      // Move to next question if needed
      if (result.shouldMoveToNext) {
        const nextQuestion = StandardizedResponseHandler.getNextQuestion(
          currentQuestionIndex,
          SIMPLIFIED_CV_QUESTIONS,
          cvData
        );

        if (nextQuestion) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          const nextQuestionText = nextQuestion.textKey;
          setMessages(prev => [...prev, { role: 'assistant', content: nextQuestionText }]);
        } else {
          // CV is complete
          setMessages(prev => [...prev, { role: 'assistant', content: 'Your CV is complete! You can download it below.' }]);
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('An error occurred while processing your response.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skipping questions
  const handleSkipQuestion = () => {
    const currentQuestion = SIMPLIFIED_CV_QUESTIONS[currentQuestionIndex];
    
    if (currentQuestion && !currentQuestion.required) {
      setMessages(prev => [...prev, { role: 'user', content: 'Skip' }]);
      setMessages(prev => [...prev, { role: 'assistant', content: STANDARD_RESPONSES.SKIP_OPTIONAL }]);
      
      const nextQuestion = StandardizedResponseHandler.getNextQuestion(
        currentQuestionIndex,
        SIMPLIFIED_CV_QUESTIONS,
        cvData
      );

      if (nextQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        const nextQuestionText = nextQuestion.textKey;
        setMessages(prev => [...prev, { role: 'assistant', content: nextQuestionText }]);
      }
    }
  };

  // Handle clearing CV
  const handleClearCV = async () => {
    const confirmed = await showConfirm('Are you sure you want to clear all CV data? This cannot be undone.', 'Clear CV Data');
    if (confirmed) {
      resetCvData();
      setMessages([]);
      setCurrentQuestionIndex(0);
      toast.success('CV data cleared successfully');
    }
  };

  // Handle saving CV to database
  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your CV');
      router.push('/auth/login?next=/builder-simplified');
      return;
    }

    // Validate that we have CV data to save
    if (!cvData || Object.keys(cvData).length === 0) {
      toast.error('No CV data to save. Please fill in some information first.');
      return;
    }

    console.log('[Save CV] Saving CV data:', { 
      hasData: !!cvData, 
      keys: Object.keys(cvData),
      fullName: cvData.fullName,
      savedCVId 
    });

    try {
      let response;
      
      // If we have a savedCVId, update existing CV; otherwise create new
      if (savedCVId) {
        // UPDATE existing CV
        console.log('[Save CV] Updating existing CV:', savedCVId);
        response = await fetch(`/api/cv/${savedCVId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cvData.fullName ? `${cvData.fullName}'s CV` : 'My CV',
            content: cvData,
            template: cvData.template || 'modern',
          }),
        });
      } else {
        // CREATE new CV
        console.log('[Save CV] Creating new CV');
        response = await fetch('/api/cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cvData.fullName ? `${cvData.fullName}'s CV` : 'My CV',
            content: cvData,
            template: cvData.template || 'modern',
          }),
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('[Save CV] Save successful:', result);
        // Only update savedCVId if it's a new CV
        if (!savedCVId && result.cv?.id) {
          setSavedCVId(result.cv.id);
        }
        toast.success(savedCVId ? 'CV updated successfully!' : 'CV saved successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Save CV] Save failed:', errorData);
        throw new Error(errorData.error || 'Failed to save CV');
      }
    } catch (error) {
      console.error('[Save CV] Error saving CV:', error);
      toast.error('Failed to save CV. Please try again.');
    }
  };

  // Handle printing CV
  const handlePrintCV = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to full-page preview for printing
    openCVPreview(cvData)
  };

  // Handle loading a saved CV
  const handleLoadCV = async (item: { id: string; title: string; type: string }) => {
    try {
      console.log('[LoadCV] Fetching CV:', item.id);
      const response = await fetch(`/api/cv/${item.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const cv = data.cv;
        
        // Parse content if it's a string
        const content = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
        
        console.log('[LoadCV] Received CV data:', {
          id: cv.id,
          title: cv.title,
          hasContent: !!content,
          contentKeys: content ? Object.keys(content) : [],
          fullName: content?.fullName
        });
        
        // Validate content
        if (!content || Object.keys(content).length === 0) {
          console.error('[LoadCV] CV content is empty!');
          toast.error('This CV appears to be empty. Please try a different one.');
          return;
        }
        
        // Clear existing localStorage data first to prevent conflicts
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cv_builder_data');
          localStorage.removeItem('cvData');
          console.log('[LoadCV] Cleared localStorage before loading');
        }
        
        // Load CV data
        updateCvData(content, 'load saved CV');
        
        // Also save to localStorage to persist the loaded data
        if (typeof window !== 'undefined') {
          localStorage.setItem('cv_builder_data', JSON.stringify(content));
          localStorage.setItem('cvData', JSON.stringify(content));
          console.log('[LoadCV] Saved loaded CV to localStorage');
        }
        
        // Set the saved CV ID so subsequent saves update this CV
        setSavedCVId(cv.id);
        
        console.log('[LoadCV] CV loaded successfully:', content?.fullName);
        toast.success('CV loaded successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[LoadCV] API error:', errorData);
        throw new Error(errorData.error || 'Failed to load CV');
      }
    } catch (error) {
      console.error('[LoadCV] Error:', error);
      toast.error('Failed to load CV. Please try again.');
    }
  };

  // Calculate progress
  const answeredQuestions = Math.max(0, currentQuestionIndex - 1);
  const totalQuestions = SIMPLIFIED_CV_QUESTIONS.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Check if current question is optional
  const currentQuestion = SIMPLIFIED_CV_QUESTIONS[currentQuestionIndex];
  const isCurrentQuestionOptional = currentQuestion ? !currentQuestion.required : false;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Basic CV Builder</h1>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Simplified Flow
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <FaSave className="mr-1 text-green-500" />
                <span className="hidden sm:inline">Auto-saved</span>
                <span className="sm:hidden">Saved</span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <LoadSavedDropdown
                  type="cv"
                  onLoad={handleLoadCV}
                />
                <button
                  onClick={handleSaveCV}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FaSave className="mr-2" />
                  <span className="hidden sm:inline">{savedCVId ? 'Update CV' : 'Save CV'}</span>
                  <span className="sm:hidden">{savedCVId ? 'Update' : 'Save'}</span>
                </button>
                <button
                  onClick={handlePrintCV}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <FaPrint className="mr-2" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat Interface */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Basic CV Builder</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      loadSampleData('full');
                      toast.success('Sample CV data loaded!');
                    }}
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                  >
                    <FaEye className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Load Sample</span>
                    <span className="sm:hidden">Sample</span>
                  </button>
                  <button
                    onClick={handleClearCV}
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <FaTrash className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Clear CV</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              </div>
              
              <ProgressIndicator 
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                currentSection={currentQuestion?.section || 'introduction'}
              />
              
              <div className="mt-4 sm:mt-6">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onSkipQuestion={isCurrentQuestionOptional ? handleSkipQuestion : undefined}
                />
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">CV Preview</h3>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => openCVPreview(cvData)}
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <FaEye className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Full Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center bg-gray-50 rounded-xl p-2 sm:p-4 overflow-auto">
                <div 
                  className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white min-w-0 max-w-full"
                  style={{ 
                    transform: `scale(${cvZoom})`, 
                    transformOrigin: 'top center',
                    maxWidth: '100%'
                  }}
                >
                  <CVPreview data={cvData} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <button
                  onClick={() => setCvZoom(Math.max(0.5, cvZoom - 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  disabled={cvZoom <= 0.5}
                >
                  <FaCompress className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                  {Math.round(cvZoom * 100)}%
                </span>
                <button
                  onClick={() => setCvZoom(Math.min(2, cvZoom + 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  disabled={cvZoom >= 2}
                >
                  <FaExpand className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
} 