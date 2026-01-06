'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { CVPreview } from '@/components/CVPreview';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@/components/landing/Navbar';
import { CV_QUESTIONS, Question } from '@/types/questions';
import { loadQuestionConfiguration, QuestionConfig } from '@/lib/question-config';
import { tokenManager } from '@/lib/token-manager';
import { TemplateSelector } from '@/components/TemplateSelector';
import TemplateQuickSelector from '@/components/TemplateQuickSelector';
import LayoutControls from '@/components/LayoutControls';
import { CVData } from '@/types/cv';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { openCVPreview } from '@/lib/cv-data-utils';
import CVEditor from '@/components/CVEditor';
import { useFlowExecution } from '@/hooks/useFlowExecution';
import PhotoUploader from '@/components/PhotoUploader';
import useCVData from '@/hooks/useCVData';
import CVPreviewWithPagination from '@/components/CVPreviewWithPagination';
import PaginatedCVPreview from '@/components/PaginatedCVPreview';
import SectionManager from '@/components/SectionManager';
import SEOHead from '@/components/SEOHead';
import { useSmartCVMapping } from '@/hooks/useSmartCVMapping';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';
import { useSectionMeasurement } from '@/hooks/useSectionMeasurement';
import AIContentSuggestions from '@/components/AIContentSuggestions';
import ATSCompatibilityScore from '@/components/ATSCompatibilityScore';
import JobDescriptionParser from '@/components/JobDescriptionParser';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import PDFExport from '@/components/PDFExport';
import CVAnalysis from '@/components/CVAnalysis';
import UploadInfoPanel from '@/components/UploadInfoPanel';
import ConfirmationModal from '@/components/ConfirmationModal';
import ProgressIndicator from '@/components/ProgressIndicator';
import EnhancedAISuggestions from '@/components/EnhancedAISuggestions';
import { 
  FaComments, FaUpload, FaEdit, FaChartBar, FaEye, 
  FaDownload, FaUndo, FaRedo, FaCog, FaMagic, 
  FaSave, FaPrint, FaExpand, FaCompress, FaTimes,
  FaChevronLeft, FaChevronRight, FaPlus, FaTrash,
  FaFileAlt, FaSearch, FaLightbulb, FaBullseye, FaUser,
  FaPalette, FaThLarge
} from 'react-icons/fa';
import { AIAnalysisResults } from '@/components/AIAnalysisResults';
import EnhancedCVChatInterface from '@/components/EnhancedCVChatInterface';
import CVOptimizationSuggestions from '@/components/CVOptimizationSuggestions';
import { isBasicPhaseComplete, getBasicQuestions, getAdvancedQuestions } from '@/types/questions';
import LoadSavedDropdown from '@/components/LoadSavedDropdown';

interface Experience {
  title: string;
  content: string[];
}

interface Education {
  title: string;
  content: string[];
}

// Session storage keys
const CV_MESSAGES_STORAGE_KEY = 'cv_builder_messages';
const CV_QUESTION_INDEX_STORAGE_KEY = 'cv_builder_question_index';
const CV_ACCOUNT_DATA_PREFERENCE_KEY = 'cv_account_data_preference';
const JOB_PARSER_STORAGE_KEY = 'cv_builder_job_parser_results';

export default function BuilderPage() {
  // Flow execution hook
  const {
    isFlowLoaded,
    isFlowLoading,
    flowError,
    currentQuestion,
    isComplete,
    messages: flowMessages,
    flowState,
    sendMessage: sendFlowMessage,
    resetFlow,
    useFallback,
    fallbackQuestions
  } = useFlowExecution({
    targetUrl: '/builder',
    flowType: 'advanced',
    fallbackQuestions: CV_QUESTIONS
  });

  // Fallback to original state management if flow is not available
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [showQuickCVBanner, setShowQuickCVBanner] = useState(true);
  const [accountDataPreference, setAccountDataPreference] = useState<'yes' | 'no' | null>(null);
  const [savedCVId, setSavedCVId] = useState<string | null>(null);
  
  // Section measurement hook
  const { measurements, measureAllSections } = useSectionMeasurement();
  
  // Track which question we're on
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionConfigs, setQuestionConfigs] = useState<QuestionConfig[]>([]);
  const [lastUserInput, setLastUserInput] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'editor' | 'templates' | 'analysis' | 'customization' | 'job-parser'>('chat');
  const [previewMode, setPreviewMode] = useState<'continuous' | 'paginated'>('continuous');
  
  // For handling experience and education sequences
  const [experienceCount, setExperienceCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);
  const [currentExperienceTitle, setCurrentExperienceTitle] = useState('');
  const [currentEducationTitle, setCurrentEducationTitle] = useState('');
  
  // Current experience being built (multi-step process)
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    type: '',
    location: '',
    current: false,
    dates: '',
    achievements: []
  });
  const [experienceStep, setExperienceStep] = useState<'title' | 'company' | 'type' | 'location' | 'current' | 'dates' | 'achievements'>('title');

  // Current education being built (multi-step process)
  const [currentEducation, setCurrentEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    dates: '',
    achievements: []
  });
  const [educationStep, setEducationStep] = useState<'institution' | 'degree' | 'field' | 'dates' | 'achievements'>('institution');
  const [addingMoreEducation, setAddingMoreEducation] = useState(false);
  const [addingMoreExperience, setAddingMoreExperience] = useState(false);
  
  // AI Analysis State
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  
  // Track if user has no relevant experience for their target role
  const [hasNoRelevantExperience, setHasNoRelevantExperience] = useState(false);
  
  // Job Parser State
  const [jobDescription, setJobDescription] = useState('');
  const [isJobAnalyzing, setIsJobAnalyzing] = useState(false);
  const [parsedJob, setParsedJob] = useState<any>(null);
  const [jobMatchScore, setJobMatchScore] = useState(0);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  // Use our custom CV data hook
  const { 
    cvData, 
    updateCvData, 
    canUndo, 
    handleUndo, 
    resetCvData,
    loadSampleData
  } = useCVData();

  // Smart CV Mapping integration
  const {
    mapper,
    isInitialized: isMappingInitialized,
    processUserInput,
    generateMappingSuggestions,
    lastMappingResult,
    isLoading: isMappingLoading,
    error: mappingError
  } = useSmartCVMapping({
    flowId: 'advanced_cv_flow',
    flowNodes: ADVANCED_CV_FLOW.nodes,
    flowEdges: ADVANCED_CV_FLOW.edges,
    cvData,
    onCVUpdate: (update) => {
      updateCvData(update);
      toast.success('CV updated with Smart Mapping!');
    }
  });

  const { t } = useLocale();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<{cvFile?: any, jobFile?: any, pastedText?: string}>({});
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const [cvZoom, setCvZoom] = useState(1);
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];

  // Auto-save functionality
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  // Auto-save effect (includes sample data so it persists across refreshes)
  useEffect(() => {
    const autoSave = () => {
      if (cvData && Object.keys(cvData).length > 0) {
        setIsSaving(true);
        try {
          localStorage.setItem('cv_auto_save', JSON.stringify({
            data: cvData,
            timestamp: new Date().toISOString(),
            template: templateId
          }));
          setLastSaved(new Date());
          // Auto-save completed
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    const interval = setInterval(autoSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [cvData, templateId]);

  // Load auto-saved data on mount (including sample data for persistence)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cv_auto_save');
        if (saved) {
          const parsed = JSON.parse(saved);
          const savedDate = new Date(parsed.timestamp);
          const hoursSinceSave = (new Date().getTime() - savedDate.getTime()) / (1000 * 60 * 60);
          
          // Restore if saved within last 24 hours (including sample data)
          if (hoursSinceSave < 24 && parsed.data) {
            updateCvData(parsed.data, 'auto-save restore');
            if (parsed.template) {
              setTemplateId(parsed.template);
            }
            setLastSaved(savedDate);
            console.log('[Builder] Restored auto-saved data:', { 
              fullName: parsed.data?.fullName,
              hasTemplate: !!parsed.template 
            });
          }
        }
        
        // Load job parser results from session storage
        const savedJobParser = sessionStorage.getItem(JOB_PARSER_STORAGE_KEY);
        if (savedJobParser) {
          const parsed = JSON.parse(savedJobParser);
          setJobDescription(parsed.jobDescription || '');
          setParsedJob(parsed.parsedJob || null);
          setJobMatchScore(parsed.jobMatchScore || 0);
          setMatchedSkills(parsed.matchedSkills || []);
          setMissingSkills(parsed.missingSkills || []);
        }
      } catch (error) {
        console.error('Failed to restore auto-saved data:', error);
      }
    }
  }, []);

  // Load question configurations from database
  useEffect(() => {
    const loadQuestionConfigs = async () => {
      try {
        const configs = await loadQuestionConfiguration('advanced');
        setQuestionConfigs(configs);
      } catch (error) {
        console.error('Failed to load question configurations:', error);
        // Fallback to default questions
        setQuestionConfigs(CV_QUESTIONS.map((q, index) => ({
          id: q.id,
          section: q.section,
          textKey: q.textKey,
          enabled: true,
          order: index,
          optional: q.optional,
          phase: q.phase,
          text: q.textKey, // Use textKey as fallback text
        })));
      }
    };
    
    loadQuestionConfigs();
  }, []);

  // Get template from URL parameter and restore session data
  useEffect(() => {
    // Restore data from localStorage if available
    if (typeof window !== 'undefined') {
      // Get template from URL or localStorage
      const params = new URLSearchParams(window.location.search);
      const urlTemplate = params.get('template');
      
      try {
        // If we have a template in URL, override the saved one
        if (urlTemplate) {
          setTemplateId(urlTemplate);
          updateCvData({ template: urlTemplate }, 'url template');
        } else if (cvData.template) {
          setTemplateId(cvData.template);
        }
        
        // Restore messages if available
        const savedMessages = localStorage.getItem(CV_MESSAGES_STORAGE_KEY);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        
        // Restore question index if available
        const savedQuestionIndex = localStorage.getItem(CV_QUESTION_INDEX_STORAGE_KEY);
        if (savedQuestionIndex) {
          setCurrentQuestionIndex(parseInt(savedQuestionIndex, 10));
          
          // If we restored to the completion question, mark process as complete
          if (parseInt(savedQuestionIndex, 10) === CV_QUESTIONS.findIndex(q => q.id === 'completion')) {
            setProcessingComplete(true);
          }
        }
        
        // Check if we have a saved CV ID in localStorage (from dashboard)
        const savedCVIdFromStorage = localStorage.getItem('saved_cv_id');
        if (savedCVIdFromStorage) {
          setSavedCVId(savedCVIdFromStorage);
          localStorage.removeItem('saved_cv_id'); // Clear after use
        }
        
        // Show template toast if selected
        if (urlTemplate) {
          toast.success(`${urlTemplate.charAt(0).toUpperCase() + urlTemplate.slice(1)} template selected!`);
        }
      } catch (error) {
        console.error('Error restoring data from localStorage:', error);
        // If restoration fails, start fresh with URL template if available
        if (urlTemplate) {
          setTemplateId(urlTemplate);
          updateCvData({ template: urlTemplate }, 'url template fallback');
          toast.success(`${urlTemplate.charAt(0).toUpperCase() + urlTemplate.slice(1)} template selected!`);
        }
      }
    }
  }, [cvData.template]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(CV_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);
  
  // Save current question index to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && currentQuestionIndex > 0) {
      localStorage.setItem(CV_QUESTION_INDEX_STORAGE_KEY, currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex]);
  
  // Save job parser results to session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && (parsedJob || jobDescription)) {
      const jobParserData = {
        jobDescription,
        parsedJob,
        jobMatchScore,
        matchedSkills,
        missingSkills
      };
      sessionStorage.setItem(JOB_PARSER_STORAGE_KEY, JSON.stringify(jobParserData));
    }
  }, [jobDescription, parsedJob, jobMatchScore, matchedSkills, missingSkills]);

  // Auto-save chat history to database when messages change (if authenticated and CV is saved)
  useEffect(() => {
    if (isAuthenticated && savedCVId && messages.length > 0) {
      const saveChatHistory = async () => {
        try {
          await fetch('/api/cv', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: savedCVId,
              chatHistory: {
                messages: messages,
                questionIndex: currentQuestionIndex,
                accountDataPreference: accountDataPreference
              }
            }),
          });
        } catch (error) {
          console.error('Error auto-saving chat history:', error);
        }
      };
      
      // Debounce the save to avoid too many requests
      const timeoutId = setTimeout(saveChatHistory, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, currentQuestionIndex, accountDataPreference, isAuthenticated, savedCVId]);

  // Initialize the conversation
  useEffect(() => {
    if (messages.length === 0 && CV_QUESTIONS.length > 0) {
      // Check if user has a stored preference for account data
      const storedPreference = localStorage.getItem(CV_ACCOUNT_DATA_PREFERENCE_KEY);
      
      if (isAuthenticated && user && !storedPreference) {
        // First time or no preference stored - ask the question
        setMessages([{ 
          role: 'assistant', 
          content: t('intro.account_data_question') 
        }]);
      } else if (isAuthenticated && user && storedPreference === 'yes') {
        // User previously chose to load account data - load it automatically
        const updatedData = { ...cvData };
        
        // Map user account data to CV fields
        if (user.firstName && user.lastName) {
          updatedData.fullName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          updatedData.fullName = user.firstName;
        } else if (user.lastName) {
          updatedData.fullName = user.lastName;
        } else if (user.name) {
          updatedData.fullName = user.name;
        }
        if (user.email) {
          if (!updatedData.contact) updatedData.contact = {};
          updatedData.contact.email = user.email;
        }
        if (user.phone) {
          if (!updatedData.contact) updatedData.contact = {};
          updatedData.contact.phone = user.phone;
        }
        if (user.address || user.city || user.state || user.country) {
          if (!updatedData.contact) updatedData.contact = {};
          const locationParts = [user.address, user.city, user.state, user.country].filter(Boolean);
          updatedData.contact.location = locationParts.join(', ');
        }
        if (user.jobTitle) updatedData.title = user.jobTitle;
        if (user.company) {
          // Add current company as experience if job title exists
          if (user.jobTitle && (!updatedData.experience || updatedData.experience.length === 0)) {
            updatedData.experience = [{
              title: user.jobTitle,
              company: user.company,
              type: 'Full-time',
              current: true,
              dates: 'Present',
              achievements: []
            }];
          }
        }
        if (user.linkedinUrl) {
          if (!updatedData.social) updatedData.social = {};
          updatedData.social.linkedin = user.linkedinUrl;
        }
        if (user.websiteUrl) {
          if (!updatedData.social) updatedData.social = {};
          updatedData.social.website = user.websiteUrl;
        }
        
        updateCvData(updatedData, 'load account data');
        
        // Start with welcome message and then the first actual question
        setMessages([
          { role: 'assistant', content: t('intro.welcome_with_quick_cv') },
          { role: 'assistant', content: (questionConfigs[1]?.text || t('question.fullName')) }
        ]);
        setCurrentQuestionIndex(1); // Start with fullName question (index 1)
        
      } else {
        // User chose not to load account data or is not authenticated - start fresh
        setMessages([
          { role: 'assistant', content: t('intro.welcome_with_quick_cv') },
          { role: 'assistant', content: (questionConfigs[1]?.text || t('question.fullName')) }
        ]);
        setCurrentQuestionIndex(1); // Start with fullName question (index 1)
      }
    }
  }, [isAuthenticated, user, t, cvData, updateCvData]);

  // When currentQuestionIndex changes, add the new question to messages
  useEffect(() => {
    // Completely disable automatic question addition to prevent wrong questions from appearing
    // Questions will be added manually in processCurrentQuestion when needed
    return;
  }, [currentQuestionIndex, t, messages.length]);

  // Add event listener for photo removal
  useEffect(() => {
    const handleRemovePhoto = () => {
      // Create a new CV data object without the photo
      const newData = { ...cvData };
      delete newData.photoUrl;
      
      // Update the CV data without the photo
      updateCvData(newData, 'remove photo');
    };
    
    window.addEventListener('removePhoto', handleRemovePhoto);
    
    return () => {
      window.removeEventListener('removePhoto', handleRemovePhoto);
    };
  }, [cvData]);

  // New state for optimization mode
  const [hasOptimizationMode, setHasOptimizationMode] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'basic' | 'advanced' | 'optimization'>('basic');

  // Check if basic phase is complete and switch to optimization mode
  useEffect(() => {
    if (isBasicPhaseComplete(cvData) && !hasOptimizationMode) {
      setHasOptimizationMode(true);
      setCurrentPhase('optimization');
      
      // Add completion message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('completion.basic_success')
      }]);
      
      toast.success('🎉 Your CV is complete! You can now optimize it further.');
    }
  }, [cvData, hasOptimizationMode, t]);

  // State management to prevent race conditions
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Refs to store functions to avoid circular dependencies
  const handleCompletionCommandsRef = useRef<((message: string) => Promise<void>) | null>(null);
  const handleOptimizationRequestRef = useRef<((message: string) => Promise<void>) | null>(null);
  const moveToNextQuestionRef = useRef<((message?: string) => void) | null>(null);
  const processCurrentQuestionRef = useRef<((question: Question, message: string) => Promise<void>) | null>(null);
  const handleSkipQuestionRef = useRef<(() => void) | null>(null);
  const handlePreviousQuestionRef = useRef<(() => void) | null>(null);
  const handleClearCVRef = useRef<(() => void) | null>(null);

  const handleSendMessage = useCallback(async (message: string) => {
    // Use flow system if available
    if (isFlowLoaded && !useFallback) {
      sendFlowMessage(message);
      return;
    }

    // Fallback to original logic
    if (isProcessing) {
      // Queue the message if already processing
      setPendingMessage(message);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Handle special commands
      if (message.toLowerCase().startsWith('/')) {
        // Use ref to avoid dependency issues
        if (handleCompletionCommandsRef.current) {
          await handleCompletionCommandsRef.current(message);
        }
        return;
      }

      // Handle account data question for authenticated users
      if (isAuthenticated && user && messages.length === 1 && 
          messages[0].content === t('intro.account_data_question')) {
        
        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('y')) {
          // Store user preference
          localStorage.setItem(CV_ACCOUNT_DATA_PREFERENCE_KEY, 'yes');
          setAccountDataPreference('yes');
          
          // Load account data into CV
          const updatedData = { ...cvData };
          
          // Map user account data to CV fields
          if (user.firstName && user.lastName) {
            updatedData.fullName = `${user.firstName} ${user.lastName}`;
          } else if (user.firstName) {
            updatedData.fullName = user.firstName;
          } else if (user.lastName) {
            updatedData.fullName = user.lastName;
          } else if (user.name) {
            updatedData.fullName = user.name;
          }
          if (user.email) {
            if (!updatedData.contact) updatedData.contact = {};
            updatedData.contact.email = user.email;
          }
          if (user.phone) {
            if (!updatedData.contact) updatedData.contact = {};
            updatedData.contact.phone = user.phone;
          }
          if (user.address || user.city || user.state || user.country) {
            if (!updatedData.contact) updatedData.contact = {};
            const locationParts = [user.address, user.city, user.state, user.country].filter(Boolean);
            updatedData.contact.location = locationParts.join(', ');
          }
          if (user.jobTitle) updatedData.title = user.jobTitle;
          if (user.company) {
            // Add current company as experience if job title exists
            if (user.jobTitle && (!updatedData.experience || updatedData.experience.length === 0)) {
              updatedData.experience = [{
                title: user.jobTitle,
                company: user.company,
                type: 'Full-time',
                current: true,
                dates: 'Present',
                achievements: []
              }];
            }
          }
          if (user.linkedinUrl) {
            if (!updatedData.social) updatedData.social = {};
            updatedData.social.linkedin = user.linkedinUrl;
          }
          if (user.websiteUrl) {
            if (!updatedData.social) updatedData.social = {};
            updatedData.social.website = user.websiteUrl;
          }
          
          updateCvData(updatedData, 'load account data');
          
          // Add response message and first actual question
          setMessages(prev => [
            ...prev, 
            { role: 'assistant', content: t('intro.account_data_loaded') },
            { role: 'assistant', content: t('question.fullName') }
          ]);
          
          // Move to first actual question
          setCurrentQuestionIndex(1);
          
        } else if (message.toLowerCase().includes('no') || message.toLowerCase().includes('n')) {
          // Store user preference
          localStorage.setItem(CV_ACCOUNT_DATA_PREFERENCE_KEY, 'no');
          setAccountDataPreference('no');
          
          // Add response message and first actual question
          setMessages(prev => [
            ...prev, 
            { role: 'assistant', content: t('intro.starting_fresh') },
            { role: 'assistant', content: t('question.fullName') }
          ]);
          
          // Move to first actual question
          setCurrentQuestionIndex(1);
        }
        
        return;
      }

      // If in optimization mode, handle optimization requests
      if (hasOptimizationMode) {
        if (handleOptimizationRequestRef.current) {
          await handleOptimizationRequestRef.current(message);
        }
        return;
      }

      // Handle "done" command for experience flow
      if (message.toLowerCase().trim() === 'done') {
        if (experienceStep !== 'title' && currentExperience.title) {
          // Complete the current experience entry if we have partial data
          const updatedData = { ...cvData };
          if (!updatedData.experience) updatedData.experience = [];
          
          const experienceEntry = {
            title: `${currentExperience.title} at ${currentExperience.company || 'Unknown Company'}`,
            content: [
              `Employment Type: ${currentExperience.type || 'Not specified'}`,
              `Location: ${currentExperience.location || 'Not specified'}`,
              `Period: ${currentExperience.dates || 'Not specified'}`,
              `Current Position: ${currentExperience.current ? 'Yes' : 'No'}`,
              '',
              'Key Achievements:',
              ...(currentExperience.achievements.length > 0 ? currentExperience.achievements : ['No achievements specified'])
            ]
          };
          
          if (Array.isArray(updatedData.experience)) {
            if (Array.isArray(updatedData.experience)) {
              if (Array.isArray(updatedData.experience)) {
        if (Array.isArray(updatedData.experience)) {
          updatedData.experience.push(experienceEntry);
        }
      }
            }
          }
          updateCvData(updatedData, 'add incomplete experience entry');
          
          // Reset experience state
          setCurrentExperience({
            title: '',
            company: '',
            type: '',
            location: '',
            current: false,
            dates: '',
            achievements: []
          });
          setExperienceStep('title');
        }
        
        // Move to next section
        if (moveToNextQuestionRef.current) {
          moveToNextQuestionRef.current();
        }
        return;
      }

      // Handle Yes/No responses for adding more entries
      if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('y')) {
        // Check if we're in experience flow and asking for more experiences
        if (experienceStep === 'title' && currentExperience.title === '') {
          // Starting a new experience entry - let the normal flow handle this
          // Don't add messages directly, let processCurrentQuestion handle it
        }
        
        // Check if we're in education flow and asking for more education
        if (educationStep === 'institution' && currentEducation.institution === '') {
          // Starting a new education entry - let the normal flow handle this
          // Don't add messages directly, let processCurrentQuestion handle it
        }
      }

      // Handle No responses for adding more entries
      if (message.toLowerCase().includes('no') || message.toLowerCase().includes('n')) {
        // Check if we're in experience flow and asking for more experiences
        if (experienceStep === 'title' && currentExperience.title === '') {
          // Save any partial experience data before moving on
          if (currentExperience.title || currentExperience.company) {
            const updatedData = { ...cvData };
            if (!updatedData.experience) updatedData.experience = [];
            
            const experienceEntry = {
              title: `${currentExperience.title || 'Unknown Position'} at ${currentExperience.company || 'Unknown Company'}`,
              content: [
                `Employment Type: ${currentExperience.type || 'Not specified'}`,
                `Location: ${currentExperience.location || 'Not specified'}`,
                `Period: ${currentExperience.dates || 'Not specified'}`,
                `Current Position: ${currentExperience.current ? 'Yes' : 'No'}`,
                '',
                'Key Achievements:',
                ...(currentExperience.achievements.length > 0 ? currentExperience.achievements : ['No achievements specified'])
              ]
            };
            
            if (Array.isArray(updatedData.experience)) {
            if (Array.isArray(updatedData.experience)) {
              if (Array.isArray(updatedData.experience)) {
        if (Array.isArray(updatedData.experience)) {
          updatedData.experience.push(experienceEntry);
        }
      }
            }
          }
            updateCvData(updatedData, 'add partial experience entry');
          }
          
          // Reset and move to education
          setCurrentExperience({
            title: '',
            company: '',
            type: '',
            location: '',
            current: false,
            dates: '',
            achievements: []
          });
          setExperienceStep('title');
          
          // Let the normal flow handle the transition
        }
        
        // Check if we're in education flow and asking for more education
        if (educationStep === 'institution' && currentEducation.institution === '') {
          // Save any partial education data before moving on
          if (currentEducation.institution || currentEducation.degree) {
            const updatedData = { ...cvData };
            if (!updatedData.education) updatedData.education = [];
            
            const educationEntry = {
              title: `${currentEducation.degree || 'Unknown Degree'} from ${currentEducation.institution || 'Unknown Institution'}`,
              content: [
                `Institution: ${currentEducation.institution || 'Not specified'}`,
                `Degree: ${currentEducation.degree || 'Not specified'}`,
                `Field: ${currentEducation.field || 'Not specified'}`,
                `Graduation: ${currentEducation.dates || 'Not specified'}`,
                ...(currentEducation.achievements.length > 0 ? ['', 'Achievements:', ...currentEducation.achievements] : [])
              ]
            };
            
            if (Array.isArray(updatedData.education)) {
              if (Array.isArray(updatedData.education)) {
        updatedData.education.push(educationEntry);
      }
            }
            updateCvData(updatedData, 'add partial education entry');
          }
          
          // Reset and move to skills
          setCurrentEducation({
            institution: '',
            degree: '',
            field: '',
            dates: '',
            achievements: []
          });
          setEducationStep('institution');
          
          // Let the normal flow handle the transition
        }
      }

      // Check if we're in a special state that should bypass normal question processing
      if (addingMoreExperience || addingMoreEducation) {
        // These are handled in processCurrentQuestion, so we continue with normal flow
      } else {
        // Only process normal questions if we're not in a special state
        setLastUserInput(message);

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: message }]);

        // Get current question
        const currentQuestion = questionConfigs[currentQuestionIndex] || CV_QUESTIONS[currentQuestionIndex];
        if (!currentQuestion) {
          console.error('No question found for index:', currentQuestionIndex);
          return;
        }

        // Debug: Log what question is being processed
        console.log('Processing question ID:', currentQuestion.id, 'Index:', currentQuestionIndex);
        console.log('Question text:', t(currentQuestion.textKey));

        // Process the question
        if (processCurrentQuestionRef.current) {
          await processCurrentQuestionRef.current(currentQuestion, message);
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('An error occurred while processing your message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isFlowLoaded, useFallback, sendFlowMessage, isProcessing, isAuthenticated, user, messages, t, cvData, updateCvData, hasOptimizationMode, experienceStep, currentExperience, educationStep, currentEducation, setMessages, setCurrentQuestionIndex, setAccountDataPreference, setPendingMessage, setIsProcessing]);

  // Process pending messages when not already processing
  useEffect(() => {
    if (pendingMessage && !isProcessing) {
      const message = pendingMessage;
      setPendingMessage(null);
      handleSendMessage(message);
    }
  }, [pendingMessage, isProcessing, handleSendMessage]); // handleSendMessage is already included

  // Define handleCompletionCommands using refs to avoid circular dependencies
  const handleCompletionCommands = useCallback(async (message: string) => {
    const command = message.toLowerCase().trim();
    
    switch (command) {
      case '/skip':
        if (handleSkipQuestionRef.current) {
          handleSkipQuestionRef.current();
        }
        break;
      case '/previous':
        if (handlePreviousQuestionRef.current) {
          handlePreviousQuestionRef.current();
        }
        break;
      case '/clear':
        if (handleClearCVRef.current) {
          handleClearCVRef.current();
        }
        break;
      case '/template':
        // This will be handled by the template selector
        break;
      case '/undo':
        if (canUndo) {
          handleUndo();
          toast.success('Undone last change');
        } else {
          toast.error('Nothing to undo');
        }
        break;
      case '/sample':
        loadSampleData();
        toast.success('Loaded sample data');
        break;
      default:
        toast.error('Unknown command. Available commands: /skip, /previous, /clear, /undo, /dev, /sample');
    }
  }, [canUndo, handleUndo, loadSampleData]);

  // Update the ref so handleSendMessage can access it
  handleCompletionCommandsRef.current = handleCompletionCommands;

  const handleSkipQuestion = () => {
    // If we're in the middle of collecting experience data, save partial data and move to next step
    if (experienceStep !== 'title' && currentExperience.title) {
      const updatedData = { ...cvData };
      if (!updatedData.experience) updatedData.experience = [];
      
      const experienceEntry = {
        title: `${currentExperience.title} at ${currentExperience.company || 'Unknown Company'}`,
        content: [
          `Employment Type: ${currentExperience.type || 'Not specified'}`,
          `Location: ${currentExperience.location || 'Not specified'}`,
          `Period: ${currentExperience.dates || 'Not specified'}`,
          `Current Position: ${currentExperience.current ? 'Yes' : 'No'}`,
          '',
          'Key Achievements:',
          ...(currentExperience.achievements.length > 0 ? currentExperience.achievements : ['No achievements specified'])
        ]
      };
      
      if (Array.isArray(updatedData.experience)) {
        if (Array.isArray(updatedData.experience)) {
          updatedData.experience.push(experienceEntry);
        }
      }
      updateCvData(updatedData, 'add partial experience entry (skipped)');
      
      // Reset experience state
      setCurrentExperience({
        title: '',
        company: '',
        type: '',
        location: '',
        current: false,
        dates: '',
        achievements: []
      });
      setExperienceStep('title');
      
      // Ask if they want to add another experience
      setMessages(prev => [...prev, { role: 'assistant', content: 'Would you like to add another work experience? (Yes/No)' }]);
      setAddingMoreExperience(true);
      return;
    }
    
    // If we're in the middle of collecting education data, save partial data and move to next step
    if (educationStep !== 'institution' && currentEducation.institution) {
      const updatedData = { ...cvData };
      if (!updatedData.education) updatedData.education = [];
      
      const educationEntry = {
        title: `${currentEducation.degree || 'Unknown Degree'} from ${currentEducation.institution}`,
        content: [
          `Institution: ${currentEducation.institution}`,
          `Degree: ${currentEducation.degree || 'Not specified'}`,
          `Field: ${currentEducation.field || 'Not specified'}`,
          `Graduation: ${currentEducation.dates || 'Not specified'}`,
          ...(currentEducation.achievements.length > 0 ? ['', 'Achievements:', ...currentEducation.achievements] : [])
        ]
      };
      
      if (Array.isArray(updatedData.education)) {
        updatedData.education.push(educationEntry);
      }
      updateCvData(updatedData, 'add partial education entry (skipped)');
      
      // Reset education state
      setCurrentEducation({
        institution: '',
        degree: '',
        field: '',
        dates: '',
        achievements: []
      });
      setEducationStep('institution');
      
      // Ask if they want to add another education entry
      setMessages(prev => [...prev, { role: 'assistant', content: 'Would you like to add another education entry? (Yes/No)' }]);
      setAddingMoreEducation(true);
      return;
    }
    
    // If we're in the adding more experience/education flow, skip to next section
    if (addingMoreExperience) {
      setAddingMoreExperience(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Now let\'s add your education. What\'s your highest level of education?' }]);
      moveToNextQuestion();
      return;
    }
    
    if (addingMoreEducation) {
      setAddingMoreEducation(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Perfect! Now let\'s add your skills. What technical skills do you have? (e.g., JavaScript, Python, Project Management)' }]);
      moveToNextQuestion();
      return;
    }
    
    // Default behavior: move to next question
    if (currentQuestionIndex < CV_QUESTIONS.length - 1) {
      moveToNextQuestion();
    }
  };
  
  // Update ref after function is defined
  handleSkipQuestionRef.current = handleSkipQuestion;

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Update ref after function is defined
  handlePreviousQuestionRef.current = handlePreviousQuestion;

  const handleClearCV = () => {
    setShowClearConfirmation(true);
  };
  
  // Update ref after function is defined
  handleClearCVRef.current = handleClearCV;

  const confirmClearCV = () => {
    resetCvData();
    
    // Clear the account data preference so the user gets asked again
    localStorage.removeItem(CV_ACCOUNT_DATA_PREFERENCE_KEY);
    setAccountDataPreference(null);
    
    // Clear all chat-related state
    setMessages([]);
    setCurrentQuestionIndex(0);
    setProcessingComplete(false);
    setExperienceCount(0);
    setEducationCount(0);
    setCurrentExperienceTitle('');
    setCurrentEducationTitle('');
    setCurrentExperience({
      title: '',
      company: '',
      type: '',
      location: '',
      current: false,
      dates: '',
      achievements: []
    });
    setExperienceStep('title');
    setCurrentEducation({
      institution: '',
      degree: '',
      field: '',
      dates: '',
      achievements: []
    });
    setEducationStep('institution');
    setAddingMoreEducation(false);
    setAddingMoreExperience(false);
    setHasNoRelevantExperience(false);
    setShowClearConfirmation(false);
    
    // Force restart the chat by triggering the initialization logic
    setTimeout(() => {
      // Check if user has a stored preference for account data
      const storedPreference = localStorage.getItem(CV_ACCOUNT_DATA_PREFERENCE_KEY);
      
      if (isAuthenticated && user && !storedPreference) {
        // First time or no preference stored - ask the question
        setMessages([{ 
          role: 'assistant', 
          content: t('intro.account_data_question') 
        }]);
      } else if (isAuthenticated && user && storedPreference === 'yes') {
        // User previously chose to load account data - load it automatically
        const updatedData = { ...cvData };
        
        // Map user account data to CV fields
        if (user.firstName && user.lastName) {
          updatedData.fullName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          updatedData.fullName = user.firstName;
        }
        if (user.email) {
          updatedData.contact = { ...updatedData.contact, email: user.email };
        }
        
        updateCvData(updatedData, 'load account data');
        
        // Add response message and first actual question
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: t('intro.account_data_loaded') },
          { role: 'assistant', content: t('question.fullName') }
        ]);
        
        // Move to first actual question
        setCurrentQuestionIndex(1);
      } else {
        // Not authenticated or user chose to start fresh
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: t('intro.starting_fresh') },
          { role: 'assistant', content: t('question.fullName') }
        ]);
        
        // Move to first actual question
        setCurrentQuestionIndex(1);
      }
    }, 100);
    
    toast.success('CV data cleared and chat restarted!');
  };

  const handleSwitchTemplate = (templateName: string) => {
    const templateId = templateName.toLowerCase();
    setTemplateId(templateId);
    updateCvData({ template: templateId }, `switch to ${templateName} template`);
    toast.success(`${templateName} template applied!`);
  };

  const moveToNextQuestion = (message?: string) => {
    if (currentQuestionIndex < CV_QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Add the next question to messages
          const nextQuestion = questionConfigs[nextIndex] || CV_QUESTIONS[nextIndex];
    if (nextQuestion) {
      const nextQuestionText = (nextQuestion as any).text || t(nextQuestion.textKey);
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: nextQuestionText
          }
        ]);
      }
      
      // If we're moving to the completion question, mark as complete
      if (nextIndex === CV_QUESTIONS.findIndex(q => q.id === 'completion')) {
        setProcessingComplete(true);
      }
    } else {
      // We've completed all questions
      setProcessingComplete(true);
    }
  };
  
  // Update ref after function is defined
  moveToNextQuestionRef.current = moveToNextQuestion;

  const processCurrentQuestion = async (question: Question, message: string) => {
    try {
      // Debug: Log the current question being processed
      console.log('Processing question:', question.id, 'Message:', message);
      console.log('Current question index:', currentQuestionIndex);
      console.log('Current experience step:', experienceStep);
      console.log('Current experience:', currentExperience);
      
      // Verify that we're processing the correct question
      const expectedQuestion = questionConfigs[currentQuestionIndex] || CV_QUESTIONS[currentQuestionIndex];
      if (expectedQuestion && expectedQuestion.id !== question.id) {
        console.error('Question mismatch! Expected:', expectedQuestion.id, 'Got:', question.id);
        // Process the correct question instead
        await processCurrentQuestion(expectedQuestion, message);
        return;
      }
      
      // Extract and update CV data based on the question
      extractAndUpdateCVData(question.id, message);

      // Add assistant response
      let assistantResponse = '';
      let shouldAddNextQuestion = false;
      
      // Handle specific question responses with proper transitions
      if (question.id === 'career_stage') {
        // Acknowledge the career stage and explain next step
        const careerStage = message.toLowerCase();
        if (careerStage.includes('student') || careerStage.includes('looking for work') || careerStage.includes('recent graduate')) {
          assistantResponse = `Great! Since you're ${message.toLowerCase()}, let's focus on building a strong foundation. What industry or sector are you targeting? This will help me customize the questions to your field.`;
        } else if (careerStage.includes('experienced') || careerStage.includes('career changer')) {
          assistantResponse = `Perfect! With your experience, let's create a compelling CV. What industry or sector are you targeting? This will help me tailor the questions to your expertise.`;
        } else {
          assistantResponse = `Thanks! Now let's identify your target industry. What industry or sector are you targeting? This helps customize the CV to your field.`;
        }
        shouldAddNextQuestion = true;
      } else if (question.id === 'industry_sector') {
        // Acknowledge industry and move to region
        assistantResponse = `Excellent! Targeting ${message} is a great choice. Which country/region are you creating this CV for? This affects format and requirements.`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'target_region') {
        // Acknowledge region and move to personal info
        assistantResponse = `Perfect! Now let's gather your basic information. What's your full name?`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'fullName') {
        // Acknowledge name and move to professional headline
        assistantResponse = `Great! Now let's add your professional title or current role. What's your professional headline?`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'professional_headline') {
        // Acknowledge headline and move to email
        assistantResponse = `Perfect! What's your email address?`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'email') {
        // Acknowledge email and move to phone
        assistantResponse = `Email saved! What's your phone number? (optional)`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'phone') {
        // Acknowledge phone and move to location
        assistantResponse = `Phone number saved! Where are you located? (City, State/Country)`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'location') {
        // Acknowledge location and move to summary
        assistantResponse = `Location saved! Now, let's write a compelling professional summary. Tell me about your background, key skills, and what makes you unique in your field.`;
        shouldAddNextQuestion = true;
      } else if (question.id === 'summary') {
        // After summary, ask about experience in a way that accommodates no experience
        assistantResponse = `Excellent summary! Now let's talk about your experience. 

Do you have any relevant work experience for your target role? 

Please respond with:
- Your job title (e.g., "Software Engineer", "Marketing Manager") if you have experience
- "No experience" or "I don't have relevant experience" if you don't have experience in this field
- "Student" or "Recent graduate" if you're still in school or just graduated

What's your situation?`;
        // Don't add next question automatically - let the experience flow handle it
      } else if (question.id === 'experience_intro') {
        // First step of experience collection - user just provided job title
        // Check if the user is indicating they don't have experience in this role
        const messageLower = message.toLowerCase();
        if (messageLower.includes('didn\'t work') || 
            messageLower.includes('don\'t have') || 
            messageLower.includes('no experience') || 
            messageLower.includes('never worked') ||
            messageLower.includes('not worked') ||
            messageLower.includes('as if now') ||
            messageLower.includes('currently not') ||
            messageLower.includes('i don\'t have relevant experience') ||
            messageLower.includes('no relevant experience') ||
            messageLower.includes('didnt work') ||
            messageLower.includes('havent worked') ||
            messageLower.includes('haven\'t worked')) {
          
          // User doesn't have experience in this role
          setHasNoRelevantExperience(true);
          assistantResponse = `I understand you don't have experience as ${currentExperience.title || 'this role'} yet. That's perfectly fine! 

To help me guide you better, please choose one of these options:
1. "I have no work experience at all" - if you're a student or recent graduate
2. "I have experience in a different field" - if you have work experience but not in this role
3. "I want to focus on education and skills" - to skip work experience and go to education

Which option best describes your situation?`;
          setExperienceStep('title');
          setCurrentExperience({
            title: '',
            company: '',
            type: '',
            location: '',
            current: false,
            dates: '',
            achievements: []
          });
        } else {
          // User has experience in this role
          setCurrentExperience(prev => ({ ...prev, title: message }));
          assistantResponse = `Great! What company did you work for as ${message}?`;
          setExperienceStep('company');
        }
      } else if (experienceStep === 'company') {
        setCurrentExperience(prev => ({ ...prev, company: message }));
        assistantResponse = `What type of employment was this? (Full-time, Part-time, Contract, Internship, Freelance)`;
        setExperienceStep('type');
      } else if (experienceStep === 'type') {
        setCurrentExperience(prev => ({ ...prev, type: message }));
        assistantResponse = `Where was this position located? (City, Remote, Hybrid) (optional - you can type "Remote" or leave blank)`;
        setExperienceStep('location');
      } else if (experienceStep === 'location') {
        setCurrentExperience(prev => ({ ...prev, location: message }));
        assistantResponse = `Is this your current position? (Yes/No)`;
        setExperienceStep('current');
      } else if (experienceStep === 'current') {
        const isCurrent = message.toLowerCase().includes('yes');
        setCurrentExperience(prev => ({ ...prev, current: isCurrent }));
        assistantResponse = `When did you start and end this position? (e.g., "January 2020 - Present" or "Jan 2020 - Dec 2022")`;
        setExperienceStep('dates');
      } else if (experienceStep === 'dates') {
        setCurrentExperience(prev => ({ ...prev, dates: message }));
        assistantResponse = `Describe 3-5 key achievements in this role. Use numbers and impact where possible (e.g., 'Increased sales by 25%', 'Led team of 10 developers')`;
        setExperienceStep('achievements');
      } else if (experienceStep === 'achievements') {
        // Complete the experience entry
        const achievements = message.split('\n').filter(line => line.trim() !== '');
        
        // Create a comprehensive experience entry with all collected data
        const experienceEntry = {
          title: `${currentExperience.title} at ${currentExperience.company}`,
          content: [
            `Employment Type: ${currentExperience.type}`,
            `Location: ${currentExperience.location || 'Not specified'}`,
            `Period: ${currentExperience.dates}`,
            `Current Position: ${currentExperience.current ? 'Yes' : 'No'}`,
            '',
            'Key Achievements:',
            ...achievements
          ]
        };
        
        // Update CV data with the new experience entry
        const updatedData = { ...cvData };
        if (!updatedData.experience) updatedData.experience = [];
        if (Array.isArray(updatedData.experience)) {
        if (Array.isArray(updatedData.experience)) {
          updatedData.experience.push(experienceEntry);
        }
      }
        updateCvData(updatedData, 'add complete experience entry');
        
        // Reset for next experience
        setCurrentExperience({
          title: '',
          company: '',
          type: '',
          location: '',
          current: false,
          dates: '',
          achievements: []
        });
        setExperienceStep('title');
        
        assistantResponse = `Perfect! I've added your experience as ${currentExperience.title} at ${currentExperience.company}. Would you like to add another work experience? (Yes/No)`;
        setAddingMoreExperience(true);
      } else if (hasNoRelevantExperience && experienceStep === 'title') {
        // Handle the no-experience scenarios
        const messageLower = message.toLowerCase();
        if (messageLower.includes('no work experience at all') || 
            messageLower.includes('student') || 
            messageLower.includes('recent graduate') ||
            messageLower.includes('no experience at all')) {
          assistantResponse = `Perfect! As a student/recent graduate, let's focus on your education and transferable skills. What's your highest level of education?`;
          setHasNoRelevantExperience(false);
          shouldAddNextQuestion = true;
        } else if (messageLower.includes('different field') || 
                   messageLower.includes('other field') ||
                   messageLower.includes('experience in different')) {
          assistantResponse = `Great! Let's add your experience from your previous field. What was your most recent job title in your previous field?`;
          setHasNoRelevantExperience(false);
          setExperienceStep('title');
        } else if (messageLower.includes('focus on education') || 
                   messageLower.includes('education and skills') ||
                   messageLower.includes('skip work experience')) {
          assistantResponse = `Excellent choice! Let's focus on your education and skills. What's your highest level of education?`;
          setHasNoRelevantExperience(false);
          shouldAddNextQuestion = true;
        } else {
          assistantResponse = `I didn't quite understand. Please choose one of these options:
1. "I have no work experience at all" - if you're a student or recent graduate
2. "I have experience in a different field" - if you have work experience but not in this role
3. "I want to focus on education and skills" - to skip work experience and go to education

Which option best describes your situation?`;
        }
      } else if (question.id === 'experience_start') {
        // Start the experience flow
        setCurrentExperience(prev => ({ ...prev, title: message }));
        assistantResponse = `Great! What company did you work for as ${message}?`;
        setExperienceStep('company');
      } else if (question.id === 'experience_details') {
        // This is now handled in the multi-step process above
        assistantResponse = `Let's continue with the experience details. What's your job title?`;
        setExperienceStep('title');
      } else if (question.id === 'education_intro') {
        // Handle education with better guidance
        const messageLower = message.toLowerCase();
        if (messageLower.includes('no education') || 
            messageLower.includes('didn\'t finish') || 
            messageLower.includes('dropped out') ||
            messageLower.includes('no degree') ||
            messageLower.includes('self-taught')) {
          assistantResponse = `I understand you don't have formal education. That's perfectly fine! Many successful professionals are self-taught. Let's focus on your skills and experience instead. What technical skills do you have? (e.g., programming languages, software, tools)`;
          shouldAddNextQuestion = true;
        } else {
          // User has education
          assistantResponse = `Great! You have a ${message}. Now let's add your skills. What technical skills do you have? (e.g., JavaScript, Python, Project Management)`;
          shouldAddNextQuestion = true;
        }
      } else if (question.id === 'skills_intro') {
        // Provide clear guidance for skills
        assistantResponse = `Great! Now let's organize your skills into categories for better presentation. 

Please include:
- Technical skills (programming languages, software, tools)
- Soft skills (communication, leadership, problem-solving)
- Industry-specific knowledge
- Certifications or training

What technical skills do you have? (e.g., JavaScript, Python, Project Management, Adobe Creative Suite)`;
        shouldAddNextQuestion = true;
      } else if (addingMoreExperience) {
        // Handle Yes/No response for adding more work experience
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('y')) {
          assistantResponse = `Great! What's your job title?`;
          setAddingMoreExperience(false);
          setExperienceStep('title');
          setCurrentExperience({
            title: '',
            company: '',
            type: '',
            location: '',
            current: false,
            dates: '',
            achievements: []
          });
        } else if (message.toLowerCase().includes('no') || message.toLowerCase().includes('n')) {
          assistantResponse = `Now let's add your education. What's your highest level of education?`;
          setAddingMoreExperience(false);
          shouldAddNextQuestion = true;
        } else {
          assistantResponse = `Please answer with Yes or No. Would you like to add another work experience?`;
        }
      } else if (addingMoreEducation) {
        // Handle Yes/No response for adding more education
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('y')) {
          assistantResponse = `Great! What's your institution name?`;
          setAddingMoreEducation(false);
          setEducationStep('institution');
          setCurrentEducation({
            institution: '',
            degree: '',
            field: '',
            dates: '',
            achievements: []
          });
        } else if (message.toLowerCase().includes('no') || message.toLowerCase().includes('n')) {
          assistantResponse = `Perfect! Now let's add your skills. What technical skills do you have? (e.g., JavaScript, Python, Project Management)`;
          setAddingMoreEducation(false);
          shouldAddNextQuestion = true;
        } else {
          assistantResponse = `Please answer with Yes or No. Would you like to add another education entry?`;
        }
      } else {
        // Default case - acknowledge and move to next question
        assistantResponse = `Great! Let's continue with the next question.`;
        shouldAddNextQuestion = true;
      }

      // Add the assistant response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

      // Move to next question if needed
      if (shouldAddNextQuestion) {
        moveToNextQuestion();
      }

    } catch (error) {
      console.error('Error processing question:', error);
      toast.error('An error occurred while processing your response. Please try again.');
    }
  };
  
  // Update ref after function is defined
  processCurrentQuestionRef.current = processCurrentQuestion;

  const extractAndUpdateCVData = (questionId: string, message: string) => {
    const updatedData = { ...cvData };

    switch (questionId) {
      // Personal Information
      case 'fullName':
        updatedData.fullName = message;
        break;
      case 'pronouns':
        updatedData.pronouns = message;
        break;
      case 'professional_headline':
        updatedData.professionalHeadline = message;
        break;
      case 'career_objective':
        updatedData.careerObjective = message;
        break;
      case 'email':
        updatedData.contact = { ...updatedData.contact, email: message };
        break;
      case 'phone':
        updatedData.contact = { ...updatedData.contact, phone: message };
        break;
      case 'location':
        updatedData.contact = { ...updatedData.contact, location: message };
        break;
      
      // Career Information
      case 'career_stage':
        updatedData.careerStage = message as 'student' | 'recent_graduate' | 'career_changer' | 'experienced';
        break;
      case 'industry_sector':
        updatedData.industrySector = message;
        break;
      case 'target_region':
        updatedData.targetRegion = message;
        break;
      
      // Legal & Availability
      case 'work_authorization':
        updatedData.workAuthorization = message;
        break;
      case 'availability':
        updatedData.availability = message;
        break;
      
      // Social Media
      case 'linkedin':
        updatedData.social = { ...updatedData.social, linkedin: message };
        break;
      case 'github':
        updatedData.social = { ...updatedData.social, github: message };
        break;
      case 'website':
        updatedData.social = { ...updatedData.social, website: message };
        break;
      
      // Professional Summary
      case 'summary':
        updatedData.summary = typeof message === 'string' ? message : Array.isArray(message) ? (message as string[]).join('\n') : '';
        break;
      
      // Work Experience (Multi-step collection)
      case 'experience_start':
        // This is handled in processCurrentQuestion with currentExperience state
        // The actual data saving happens when the experience is complete
        break;
      
      // Education (Enhanced)
      case 'education_institution':
        setCurrentEducationTitle(message);
        break;
      case 'education_degree':
        setCurrentEducationTitle(message);
        break;
      case 'education_field':
        setCurrentEducationTitle(message);
        break;
      case 'education_dates':
        setCurrentEducationTitle(message);
        break;
      case 'education_achievements':
        if (!updatedData.education) updatedData.education = [];
        if (Array.isArray(updatedData.education)) {
          updatedData.education.push({
            institution: currentEducationTitle || 'Institution',
            degree: 'Degree',
            field: 'Field of Study',
            dates: '',
            content: message.split('\n').filter(line => line.trim() !== '')
          });
        }
        break;
      case 'education_intro':
        // Store the highest level of education
        updatedData.highestEducation = message;
        break;
      
      // Skills (Enhanced)
      case 'skills':
        // Handle both string array and categorized skills
        if (typeof message === 'string') {
          updatedData.skills = message.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
        } else if (typeof message === 'object') {
          updatedData.skills = message as any;
        }
        break;
      
      // Languages
      case 'languages':
        updatedData.languages = message.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
        break;
      
      // Certifications
      case 'certifications':
        if (!updatedData.certifications) updatedData.certifications = [];
        if (Array.isArray(updatedData.certifications)) {
          updatedData.certifications.push({
            title: 'Certification',
            content: [message]
          });
        }
        break;
      
      // Projects
      case 'projects':
        if (!updatedData.projects) updatedData.projects = [];
        if (Array.isArray(updatedData.projects)) {
          updatedData.projects.push({
            title: 'Project',
            content: [message]
          });
        }
        break;
      
      // Additional Sections
      case 'volunteer_work':
        updatedData.volunteerWork = [{
          title: 'Volunteer Work',
          content: [message]
        }];
        break;
      case 'awards_recognition':
        updatedData.awardsRecognition = [{
          title: 'Awards & Recognition',
          content: [message]
        }];
        break;
      case 'professional_memberships':
        updatedData.professionalMemberships = [message];
        break;
      case 'publications_research':
        updatedData.publicationsResearch = [{
          title: 'Publications & Research',
          content: [message]
        }];
        break;
      case 'references':
        updatedData.references = message;
        break;
      
      // Hobbies & Interests
      case 'hobbies':
        updatedData.hobbies = message.split(',').map(hobby => hobby.trim()).filter(hobby => hobby !== '');
        break;
      
      // Template & Preferences
      case 'template_preference':
        updatedData.template = message.toLowerCase();
        break;
      
      // Legacy support for old question IDs
      case 'title':
        updatedData.professionalHeadline = message;
        break;
      case 'experience':
        if (!updatedData.experience) updatedData.experience = [];
        if (Array.isArray(updatedData.experience)) {
          updatedData.experience.push({
            title: 'Work Experience',
            content: message.split('\n').filter(line => line.trim() !== '')
          });
        }
        break;
      case 'education':
        if (!updatedData.education) updatedData.education = [];
        if (Array.isArray(updatedData.education)) {
          updatedData.education.push({
            institution: 'Institution',
            degree: 'Degree',
            field: 'Field of Study',
            dates: '',
            content: message.split('\n').filter(line => line.trim() !== '')
          });
        }
        break;
    }

    updateCvData(updatedData, `update ${questionId}`);
  };

  const handleTemplateChange = (newTemplateId: string) => {
    setTemplateId(newTemplateId);
    updateCvData({ template: newTemplateId }, `switch to ${newTemplateId} template`);
    toast.success(`${newTemplateId.charAt(0).toUpperCase() + newTemplateId.slice(1)} template applied!`);
  };

  const handleLayoutChange = (layout: CVData['layout']) => {
    updateCvData({ layout }, 'layout change');
  };

  const handleSectionOrderChange = (newOrder: string[]) => {
    const newLayout = { ...cvData.layout, sectionOrder: newOrder };
    updateCvData({ layout: newLayout }, 'section reorder');
  };

  const handleSectionVisibilityChange = (sectionId: string, visible: boolean) => {
    const currentHidden = cvData.layout?.hiddenSections || [];
    const newHidden = visible 
      ? currentHidden.filter(id => id !== sectionId)
      : [...currentHidden, sectionId];
    
    const newLayout = { ...cvData.layout, hiddenSections: newHidden };
    updateCvData({ layout: newLayout }, 'section visibility');
  };

  const handleSectionDelete = (sectionId: string) => {
    // Remove section from order and mark as hidden
    const currentOrder = cvData.layout?.sectionOrder || [];
    const newOrder = currentOrder.filter(id => id !== sectionId);
    const currentHidden = cvData.layout?.hiddenSections || [];
    const newHidden = [...currentHidden, sectionId];
    
    const newLayout = { 
      ...cvData.layout, 
      sectionOrder: newOrder,
      hiddenSections: newHidden
    };
    updateCvData({ layout: newLayout }, 'section delete');
  };

  const handleSectionReorder = (newOrder: any[]) => {
    // Convert SectionMeasurement[] to string[] for section order
    const sectionIds = newOrder.map(section => section.id);
    const newLayout = { ...cvData.layout, sectionOrder: sectionIds };
    updateCvData({ layout: newLayout }, 'section reorder');
  };

  const handleSuggestionApply = (sectionId: string, content: string[]) => {
    switch (sectionId) {
      case 'summary':
        updateCvData({ summary: content.join('\n') }, 'AI suggestion - summary');
        break;
      case 'experience':
        // Add as new experience entry
        const newExperience = {
          title: 'New Position',
          content: content
        };
        updateCvData({ 
          experience: [...(cvData.experience || []), newExperience] 
        }, 'AI suggestion - experience');
        break;
      case 'skills':
        // Handle both legacy string array and new structured format
        const skillsData = Array.isArray(cvData.skills) 
          ? content 
          : { technical: content };
        updateCvData({ skills: skillsData }, 'AI suggestion - skills');
        break;
      case 'education':
        // Add as new education entry
        const newEducation = {
          title: 'New Education',
          content: content
        };
        updateCvData({ 
          education: [...(cvData.education || []), newEducation] 
        }, 'AI suggestion - education');
        break;
    }
    toast.success('AI suggestion applied successfully!');
  };


  const handleKeywordsExtracted = (keywords: string[]) => {
    // Suggest adding keywords to skills if not present
    const currentSkills = cvData.skills || [];
    const allSkills = Array.isArray(currentSkills) 
      ? currentSkills 
      : [
          ...(currentSkills.technical || []),
          ...(currentSkills.soft || []),
          ...(currentSkills.tools || []),
          ...(currentSkills.industry || [])
        ];
    
    const missingKeywords = keywords.filter(keyword => 
      !allSkills.some((skill: string) => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (missingKeywords.length > 0) {
      toast.success(`Found ${missingKeywords.length} new keywords to add to your skills!`);
    }
  };

  const handleSkillsMatched = (matched: string[], missing: string[]) => {
    if (missing.length > 0) {
      toast.success(`Consider adding these skills: ${missing.slice(0, 3).join(', ')}`);
    }
  };

  // Job Parser Functions
  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description);
  };

  const handleJobAnalysis = async () => {
    if (!jobDescription.trim()) return;

    setIsJobAnalyzing(true);
    
    try {
      const response = await fetch('/api/job-parser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription })
      });

      if (response.ok) {
        const data = await response.json();
        setParsedJob(data.parsedJob);
        setJobMatchScore(data.matchScore);
        setMatchedSkills(data.matchedSkills || []);
        setMissingSkills(data.missingSkills || []);
        
        // Call existing handlers
        handleKeywordsExtracted(data.parsedJob.keywords);
        handleSkillsMatched(data.matchedSkills, data.missingSkills);
      }
    } catch (error) {
      console.error('Error analyzing job description:', error);
    } finally {
      setIsJobAnalyzing(false);
    }
  };

  const handleJobFileUpload = (text: string) => {
    setJobDescription(text);
  };

  const handleJobPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handlePhotoUpload = (photoUrl: string) => {
    updateCvData({ photoUrl }, 'photo upload');
  };

  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your CV');
      router.push('/auth/login?next=/builder');
      return;
    }

    // Validate that we have CV data to save
    if (!cvData || Object.keys(cvData).length === 0) {
      toast.error('No CV data to save. Please fill in some information first.');
      console.error('[Save CV] No data to save - cvData is empty');
      return;
    }

    console.log('[Save CV] Starting save...', {
      hasData: !!cvData,
      keys: Object.keys(cvData),
      fullName: cvData.fullName,
      savedCVId,
      experienceCount: cvData.experience?.length,
      skillsCount: Array.isArray(cvData.skills) 
        ? cvData.skills.length 
        : cvData.skills && typeof cvData.skills === 'object'
        ? (cvData.skills.technical?.length || 0) + 
          (cvData.skills.soft?.length || 0) + 
          (cvData.skills.tools?.length || 0) + 
          (cvData.skills.industry?.length || 0)
        : 0
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
            chatHistory: {
              messages: messages,
              questionIndex: currentQuestionIndex,
              accountDataPreference: accountDataPreference
            }
          }),
        });
      }

      const result = await response.json();
      console.log('[Save CV] API response:', { ok: response.ok, result });

      if (response.ok) {
        // Only update savedCVId if it's a new CV
        if (!savedCVId && result.cv?.id) {
          setSavedCVId(result.cv.id);
          console.log('[Save CV] New CV ID set:', result.cv.id);
        }
        toast.success(savedCVId ? 'CV updated successfully!' : 'CV saved successfully!');
      } else {
        console.error('[Save CV] API error:', result);
        throw new Error(result.error || 'Failed to save CV');
      }
    } catch (error) {
      console.error('[Save CV] Error:', error);
      toast.error('Failed to save CV. Please try again.');
    }
  };

  const handlePrintCV = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to download your CV');
      router.push('/auth/login?next=/builder');
      return;
    }
    // Navigate to full-page preview for printing
    openCVPreview(cvData)
  };

  const handleLoadCV = async (item: { id: string; title: string; type: string }) => {
    try {
      console.log('[LoadCV] Fetching CV:', item.id);
      const response = await fetch(`/api/cv/${item.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const cv = data.cv;
        
        console.log('[LoadCV] Received CV data:', {
          id: cv.id,
          title: cv.title,
          hasContent: !!cv.content,
          contentKeys: cv.content ? Object.keys(cv.content) : [],
          fullName: cv.content?.fullName
        });
        
        // Validate content
        if (!cv.content || Object.keys(cv.content).length === 0) {
          console.error('[LoadCV] CV content is empty!');
          toast.error('This CV appears to be empty. Please try a different one.');
          return;
        }
        
        // Clear existing localStorage data first to prevent conflicts
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cv_builder_data');
          localStorage.removeItem('cv_auto_save');
          console.log('[LoadCV] Cleared localStorage before loading');
        }
        
        // Load CV data
        updateCvData(cv.content, 'load saved CV');
        
        // Also save to localStorage to persist the loaded data
        if (typeof window !== 'undefined') {
          localStorage.setItem('cv_builder_data', JSON.stringify(cv.content));
          localStorage.setItem('cv_auto_save', JSON.stringify({
            data: cv.content,
            timestamp: new Date().toISOString(),
            template: cv.template
          }));
          console.log('[LoadCV] Saved loaded CV to localStorage');
        }
        
        // Load chat history if available
        if (cv.chatHistory) {
          setMessages(cv.chatHistory.messages || []);
          setCurrentQuestionIndex(cv.chatHistory.questionIndex || 0);
          setAccountDataPreference(cv.chatHistory.accountDataPreference || null);
        }
        
        // Set the saved CV ID for future saves to update this CV
        setSavedCVId(cv.id);
        
        console.log('[LoadCV] CV loaded successfully:', cv.content?.fullName);
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

  const handleUploadSuccess = (data: any) => {
    setUploadInfo(data);
    setActiveTab('analysis');
    toast.success('CV uploaded successfully!');
  };

  const handleAIAnalysis = async () => {
    try {
      setIsAIAnalyzing(true);
      setShowAIAnalysis(true);
      
      // Prepare the analysis input
      const analysisInput = {
        conversation: messages,
        cvData,
        currentQuestionIndex,
        experienceStep,
        educationStep,
        hasNoRelevantExperience
      };

      // Call the new AI analysis endpoint
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisInput)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          toast.error(`Insufficient tokens. You have ${errorData.remainingTokens} tokens remaining.`);
        } else {
          toast.error('Failed to analyze conversation');
        }
        return;
      }

      const result = await response.json();
      setAiAnalysisResult(result.analysis);
      
      toast.success(`AI analysis complete! Used 1 token. ${result.remainingTokens} tokens remaining.`);
      
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Failed to analyze conversation');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  // Note: Removed cleanupDuplicateMessages to prevent infinite loop
  // Duplicate message cleanup is now handled inline where messages are set

  // Load banner visibility preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bannerHidden = localStorage.getItem('quick_cv_banner_hidden');
      if (bannerHidden === 'true') {
        setShowQuickCVBanner(false);
      }
    }
  }, []);

  // Trigger section measurements when CV data changes
  useEffect(() => {
    if (cvData && Object.keys(cvData).length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        measureAllSections(cvData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cvData, measureAllSections]);

  // Function to close the banner
  const handleCloseQuickCVBanner = () => {
    setShowQuickCVBanner(false);
    localStorage.setItem('quick_cv_banner_hidden', 'true');
  };

  // Structured data for CV builder
  const builderStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
              "name": "LadderFox Advanced CV Builder",
          "description": "AI-powered advanced CV builder with professional templates and real-time editing",
    "url": "https://ladder-fox-dev.vercel.app/builder",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
                  "description": "Free advanced CV builder with premium features available"
    },
    "featureList": [
      "AI-powered CV writing assistance",
      "Professional CV templates",
      "Real-time CV preview",
      "PDF export functionality",
      "ATS optimization",
      "Cover letter builder"
    ],
    "author": {
      "@type": "Organization",
      "name": "LadderFox",
      "url": "https://ladder-fox-dev.vercel.app"
    }
  };

  // Handle optimization requests
  const handleOptimizationRequest = async (message: string) => {
    setIsLoading(true);
    
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      // Call AI optimization endpoint
      const response = await fetch('/api/cv-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          optimizationRequest: message,
          conversation: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize CV');
      }

      const result = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.suggestion 
      }]);

      // Apply optimizations if provided
      if (result.optimizations) {
        updateCvData(result.optimizations, 'AI optimization');
        toast.success('CV optimized successfully!');
      }

    } catch (error) {
      console.error('Error optimizing CV:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while optimizing your CV. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update ref after function is defined
  handleOptimizationRequestRef.current = handleOptimizationRequest;

  // Enhanced handlers for optimization mode
  const handleGenerateOptimized = async () => {
    await handleOptimizationRequest('Generate a fully optimized version of my CV with improved content, better formatting, and enhanced impact.');
  };

  const handleEditCV = () => {
    setActiveTab('editor');
  };

  const handlePreviewCV = () => {
    // Navigate to full-page preview
    openCVPreview(cvData)
  };

  const handleDownloadCV = () => {
    handlePrintCV({ preventDefault: () => {} } as any);
  };

  return (
    <>
      <SEOHead
        title="Advanced CV Builder - Create Professional CVs with AI | LadderFox"
        description="Build professional CVs with AI assistance. Choose from 20+ templates, get real-time suggestions, and export to PDF. Free to use with premium features available."
        keywords={[
          "CV builder",
          "resume builder", 
          "AI CV creator",
          "professional CV templates",
          "CV maker",
          "resume templates",
          "PDF CV export",
          "ATS optimization"
        ]}
                  ogTitle="Advanced CV Builder - Create Professional CVs with AI | LadderFox"
        ogDescription="Build professional CVs with AI assistance. Choose from 20+ templates, get real-time suggestions, and export to PDF."
        ogImage="/og-builder.png"
        canonical="/builder"
        structuredData={builderStructuredData}
      />
      <div className="min-h-screen bg-gray-50 pt-16">
        <Navbar />
        <Toaster position="top-right" />
      
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Basic CV Banner */}
          {showQuickCVBanner && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Try our Basic CV Builder!</h3>
                    <p className="text-sm text-blue-700">Create a professional CV in just 7 questions instead of 37.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href="/quick-cv"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Try Basic CV
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <button
                    onClick={handleCloseQuickCVBanner}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 touch-manipulation"
                    title="Close banner"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Title and Template Info */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced CV Builder</h1>
              <div className="flex items-center space-x-3">
                {isFlowLoaded && !useFallback && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Flow Active
                  </span>
                )}
                {useFallback && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Fallback Mode
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {cvData.template || 'modern'} template
                </span>
              </div>
            </div>
            
            {/* Mobile-Optimized Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Auto-save status - Mobile optimized */}
              <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    <span>Saving...</span>
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center">
                    <FaSave className="mr-1 text-green-500" />
                    <span className="hidden sm:inline">Saved {lastSaved.toLocaleTimeString()}</span>
                    <span className="sm:hidden">Saved</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaSave className="mr-1 text-gray-400" />
                    <span className="hidden sm:inline">Not saved</span>
                    <span className="sm:hidden">Not saved</span>
                  </div>
                )}
              </div>
              
              {/* Mobile-Optimized Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <LoadSavedDropdown
                  type="cv"
                  onLoad={handleLoadCV}
                />
                <button
                  onClick={handleSaveCV}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm touch-manipulation"
                >
                  <FaSave className="mr-2" />
                  <span className="hidden sm:inline">Save CV</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button
                  onClick={handlePrintCV}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm touch-manipulation"
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

      {/* Mobile-Optimized Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Builder Sidebar - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Mobile-Optimized Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Mobile Tab Navigation - Horizontal Scroll */}
              <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'chat', label: 'AI Chat', icon: FaComments, mobileLabel: 'Chat' },
                  { id: 'upload', label: 'Upload CV', icon: FaUpload, mobileLabel: 'Upload' },
                  { id: 'editor', label: 'Editor', icon: FaEdit, mobileLabel: 'Edit' },
                  { id: 'templates', label: 'Templates', icon: FaThLarge, mobileLabel: 'Templates' },
                  { id: 'analysis', label: 'Analysis', icon: FaChartBar, mobileLabel: 'Analysis' },
                  { id: 'customization', label: 'Customize', icon: FaCog, mobileLabel: 'Style' },
                  { id: 'job-parser', label: 'Job Parser', icon: FaSearch, mobileLabel: 'Jobs' }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-shrink-0 flex items-center justify-center px-4 py-4 text-sm font-medium transition-colors min-w-[80px] sm:min-w-0 sm:flex-1 ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="mr-1 text-lg sm:text-base" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-xs">{tab.mobileLabel}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile-Optimized Tab Content */}
              <div className="p-4 sm:p-6 h-[calc(100vh-300px)] overflow-y-auto">
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    {hasOptimizationMode ? (
                      <CVOptimizationSuggestions
                        cvData={cvData}
                        onSuggestionClick={(suggestion) => handleSendMessage(suggestion)}
                        onGenerateOptimized={handleGenerateOptimized}
                        onAnalyzeCV={handleAIAnalysis}
                        onEditCV={handleEditCV}
                        onPreviewCV={handlePreviewCV}
                        onDownloadCV={handleDownloadCV}
                        isLoading={isLoading}
                      />
                    ) : (
                      <EnhancedCVChatInterface
                        messages={isFlowLoaded && !useFallback ? flowMessages : messages}
                        onSendMessage={handleSendMessage}
                        onSkipQuestion={handleSkipQuestion}
                        onAIAnalysis={handleAIAnalysis}
                        onGenerateOptimized={handleGenerateOptimized}
                        onEditCV={handleEditCV}
                        onPreviewCV={handlePreviewCV}
                        onDownloadCV={handleDownloadCV}
                        isLoading={isLoading}
                        isAIAnalyzing={isAIAnalyzing}
                        cvData={cvData}
                        currentQuestionIndex={currentQuestionIndex}
                        hasOptimizationMode={hasOptimizationMode}
                        aiAnalysisResult={aiAnalysisResult}
                        remainingTokens={tokenManager.getRemainingTokens()}
                        userPlan={tokenManager.getUserUsage().plan}
                      />
                    )}
                  </div>
                )}
                
                {activeTab === 'upload' && (
                  <UploadInfoPanel
                    uploadInfo={uploadInfo}
                    setUploadInfo={setUploadInfo}
                    onCvExtracted={(data) => {
                      if (data && typeof data === 'object') {
                        updateCvData(data, 'pdf upload');
                        toast.success('CV fields updated from your PDF!');
                      } else {
                        toast.error('Could not extract data from PDF.');
                      }
                    }}
                  />
                )}
                
                {activeTab === 'editor' && (
                  <div className="space-y-4 sm:space-y-6">
                    <CVEditor
                      data={cvData}
                      onSave={updateCvData}
                      onPrint={handlePrintCV}
                      isAuthenticated={isAuthenticated}
                    />
                    
                    <AIContentSuggestions
                      cvData={cvData}
                      onSuggestionApply={handleSuggestionApply}
                    />
                    
                  </div>
                )}

                {activeTab === 'templates' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Current: <span className="font-medium capitalize">{cvData.template || 'modern'}</span>
                      </span>
                    </div>
                    <TemplateQuickSelector
                      currentTemplate={cvData.template || 'modern'}
                      onTemplateChange={handleTemplateChange}
                    />
                  </div>
                )}
                
        {activeTab === 'analysis' && (
          <div className="space-y-4 sm:space-y-6">

                    <ATSCompatibilityScore cvData={cvData} />
                    <CVAnalysis cvData={cvData} />
                    <EnhancedAISuggestions
                      cvData={cvData}
                      currentSection={questionConfigs[currentQuestionIndex]?.section || CV_QUESTIONS[currentQuestionIndex]?.section || 'introduction'}
                      onSuggestionApply={handleSuggestionApply}
                    />
                  </div>
                )}

                {activeTab === 'customization' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Template</label>
                      <TemplateSelector
                        currentTemplate={cvData.template || 'modern'}
                        onTemplateChange={handleTemplateChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Layout</label>
                      <LayoutControls
                        data={cvData}
                        onLayoutChange={handleLayoutChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Photo</label>
                      <PhotoUploader
                        onPhotoUpload={handlePhotoUpload}
                        updateCvData={updateCvData}
                        cvData={cvData}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'job-parser' && (
                  <JobDescriptionParser
                    onKeywordsExtracted={handleKeywordsExtracted}
                    onSkillsMatched={handleSkillsMatched}
                    jobDescription={jobDescription}
                    onJobDescriptionChange={handleJobDescriptionChange}
                    onAnalyze={handleJobAnalysis}
                    onFileUpload={handleJobFileUpload}
                    onPaste={handleJobPaste}
                    isAnalyzing={isJobAnalyzing}
                    parsedJob={parsedJob}
                    matchScore={jobMatchScore}
                    matchedSkills={matchedSkills}
                    missingSkills={missingSkills}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - CV Preview - Mobile Optimized */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">CV Preview</h3>
                
                {/* Mobile-Optimized Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      loadSampleData('full');
                      toast.success('Sample CV data loaded! You can now see an example of a complete CV.');
                    }}
                    title="Fill with comprehensive sample data for testing"
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 touch-manipulation"
                  >
                    <FaUser className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Fill Sample Data</span>
                    <span className="sm:hidden">Sample</span>
                  </button>
                  <button
                    onClick={handleClearCV}
                    title="Clear all CV data"
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200 touch-manipulation"
                  >
                    <FaTrash className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Clear CV</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                  <button
                    onClick={() => openCVPreview(cvData)}
                    className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 touch-manipulation"
                  >
                    <FaEye className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Full Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </button>
                </div>
              </div>
              
              {/* Preview Mode Toggle */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Preview Mode:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewMode('continuous')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        previewMode === 'continuous'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Continuous
                    </button>
                    <button
                      onClick={() => setPreviewMode('paginated')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        previewMode === 'paginated'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Paginated
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized CV Preview Container */}
              <div className="flex justify-center bg-gray-50 rounded-xl p-2 sm:p-4 overflow-auto">
                {cvData && cvData.fullName ? (
                  previewMode === 'continuous' ? (
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
                  ) : (
                    <div className="w-full h-full">
                      <PaginatedCVPreview 
                        data={cvData}
                        onDataChange={updateCvData}
                        showControls={true}
                        className="h-full"
                      />
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2">No CV Data</div>
                      <div className="text-sm">Start by answering questions in the chat to build your CV</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Zoom Controls */}
              <div className="mt-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <button
                  onClick={() => setCvZoom(Math.max(0.5, cvZoom - 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors touch-manipulation"
                  disabled={cvZoom <= 0.5}
                >
                  <FaCompress className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                  {Math.round(cvZoom * 100)}%
                </span>
                <button
                  onClick={() => setCvZoom(Math.min(2, cvZoom + 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors touch-manipulation"
                  disabled={cvZoom >= 2}
                >
                  <FaExpand className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized PDF Preview Modal */}
      {showPdfPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setShowPdfPreview(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              <div className="flex items-center space-x-2">
                <PDFExport cvData={cvData} />
                <button
                  onClick={() => setShowPdfPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 touch-manipulation"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2 sm:p-4">
              <CVPreviewWithPagination data={cvData} />
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Results Modal */}
      {showAIAnalysis && aiAnalysisResult && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setShowAIAnalysis(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
              <button
                onClick={() => setShowAIAnalysis(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 touch-manipulation"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <AIAnalysisResults 
                analysis={aiAnalysisResult}
                onApplyImprovement={(sectionId, content) => {
                  // Handle applying CV improvements
                  console.log('Applying improvement for section:', sectionId, content);
                  // TODO: Implement CV improvement application
                  toast.success('CV improvement applied!');
                }}
                onClose={() => setShowAIAnalysis(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Optimized Clear CV Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={confirmClearCV}
        title="Clear CV Data"
        message="Are you sure you want to clear all CV data? This action cannot be undone and will reset your progress. You will also need to restart the chat to begin a new CV creation process."
        confirmText="Clear CV & Restart Chat"
        cancelText="Cancel"
        type="danger"
      />
    </div>
    </>
  );
} 