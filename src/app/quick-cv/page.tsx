'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaPrint, FaEye, FaTrash, FaCompress, FaExpand, FaTimes, FaEdit, FaPalette, FaComments, FaUser } from 'react-icons/fa'
import { SIMPLIFIED_CV_QUESTIONS } from '@/types/questions-simplified'
import { StandardizedResponseHandler } from '@/lib/response-handler'
import { CVData } from '@/types/cv'
import ProgressIndicator from '@/components/ProgressIndicator'
import { ChatInterface } from '@/components/ChatInterface'
import { CVPreview } from '@/components/CVPreview'
import CVEditor from '@/components/CVEditor'
import PDFExport from '@/components/PDFExport'
import CVPreviewWithPagination from '@/components/CVPreviewWithPagination'
import ConfirmationModal from '@/components/ConfirmationModal'
import Navbar from '@/components/landing/Navbar'
import PhotoUploader from '@/components/PhotoUploader'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { openCVPreview } from '@/lib/cv-data-utils'
import SEOHead from '@/components/SEOHead'
import LoadSavedDropdown from '@/components/LoadSavedDropdown'
import { useFlowExecution } from '@/hooks/useFlowExecution'
import { useSmartCVMapping } from '@/hooks/useSmartCVMapping'
import { BASIC_CV_FLOW } from '@/data/basicCVFlow'

type TabType = 'chat' | 'editor' | 'customize'

export default function QuickCVPage() {
  const { t } = useLocale()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('chat')
  
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
    targetUrl: '/quick-cv',
    flowType: 'basic',
    fallbackQuestions: SIMPLIFIED_CV_QUESTIONS
  });

  // Local flow executor as fallback
  const [localFlowExecutor, setLocalFlowExecutor] = useState<any>(null);
  const [localFlowState, setLocalFlowState] = useState<Record<string, any>>({});
  const [localMessages, setLocalMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [localCurrentQuestion, setLocalCurrentQuestion] = useState<any>(null);

  // Initialize local flow executor if database flow fails
  useEffect(() => {
    if (useFallback && !localFlowExecutor) {
      console.log('Initializing local flow executor as fallback');
      try {
        const { FlowExecutor } = require('@/lib/flow-executor');
        const executor = new FlowExecutor(BASIC_CV_FLOW);
        setLocalFlowExecutor(executor);
        
        const result = executor.initialize();
        setLocalCurrentQuestion(result.nextQuestion || null);
        setLocalMessages(result.messages);
        setLocalFlowState(result.flowState);
        console.log('Local flow executor initialized:', result);
      } catch (error) {
        console.error('Failed to initialize local flow executor:', error);
      }
    }
  }, [useFallback, localFlowExecutor]);

  // Use local flow state if database flow is not available
  const effectiveFlowState = isFlowLoaded ? flowState : localFlowState;
  const effectiveMessages = isFlowLoaded ? flowMessages : localMessages;
  const effectiveCurrentQuestion = isFlowLoaded ? currentQuestion : localCurrentQuestion;

  // Fallback to original state management if flow is not available
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1) // Start with fullName, not intro
  const [isLoading, setIsLoading] = useState(false)
  const [savedCVId, setSavedCVId] = useState<string | null>(null)
  const [cvData, setCvData] = useState<CVData>({
    fullName: '',
    contact: {
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: '',
    projects: '',
    hobbies: [],
    photoUrl: '',
    template: 'modern',
    social: {
      linkedin: '',
      github: '',
      website: '',
      twitter: '',
      instagram: ''
    },
    layout: {
      photoPosition: 'left',
      showIcons: true,
      accentColor: '#3B82F6',
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'languages'],
      hiddenSections: []
    }
  })

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
    flowId: 'basic_cv_flow',
    flowNodes: BASIC_CV_FLOW.nodes,
    flowEdges: BASIC_CV_FLOW.edges,
    cvData,
    onCVUpdate: (update) => {
      setCvData(prev => ({ ...prev, ...update }));
      toast.success('CV updated with Smart Mapping!');
    }
  });

  // Enhanced message processing with smart mapping
  const processMessageWithSmartMapping = async (message: string, currentQuestion: any) => {
    try {
      // First, try smart mapping if available
      if (mapper && isMappingInitialized) {
        const flowNode = {
          id: currentQuestion.id,
          type: 'question' as const,
          position: { x: 0, y: 0 },
          data: currentQuestion
        };
        
        const mappingResult = await processUserInput(
          message,
          messages,
          flowNode,
          {}
        );
        
        if (mappingResult.success && Object.keys(mappingResult.cvUpdate).length > 0) {
          // Convert MappingResult to ResponseResult format
          return {
            success: true,
            message: 'CV updated with Smart Mapping!',
            shouldMoveToNext: true,
            cvDataUpdate: mappingResult.cvUpdate
          };
        }
      }
      
      // Fallback to standard processing
      return StandardizedResponseHandler.processResponse(currentQuestion, message, cvData);
    } catch (error) {
      console.error('Error in smart mapping processing:', error);
      // Fallback to standard processing
      return StandardizedResponseHandler.processResponse(currentQuestion, message, cvData);
    }
  };
  
  const processedItemsRef = useRef<Set<string>>(new Set());

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (isAuthenticated && savedCVId) {
      // Auto-save to database
      const saveChatHistory = async () => {
        try {
          await fetch(`/api/cv`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: savedCVId,
              title: cvData.fullName ? `${cvData.fullName}'s CV` : 'My CV',
              content: cvData,
              template: cvData.template || 'modern',
              chatHistory: {
                messages: messages,
                questionIndex: currentQuestionIndex,
                accountDataPreference: null
              }
            }),
          });
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      };
      saveChatHistory();
    }
    
    // Always save to localStorage
    localStorage.setItem('cvData', JSON.stringify(cvData));
    localStorage.setItem('cv_builder_messages', JSON.stringify(messages));
    localStorage.setItem('cv_builder_question_index', currentQuestionIndex.toString());
  }, [cvData, messages, currentQuestionIndex, isAuthenticated, savedCVId]);

  // Auto-save when cvData, messages, or currentQuestionIndex changes
  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 1000); // Debounce for 1 second
    return () => clearTimeout(timeoutId);
  }, [autoSave]);

  // Process flow state through smart mapping when it changes
  useEffect(() => {
    if (effectiveFlowState && Object.keys(effectiveFlowState).length > 0) {
      console.log('🔄 Processing flow state:', effectiveFlowState);
      console.log('🔧 Smart mapping status:', { 
        processUserInput: !!processUserInput, 
        isMappingInitialized, 
        mapper: !!mapper 
      });
      
      // Always run direct mapping as backup to ensure data gets mapped
      console.log('🎯 Running direct mapping as backup');
      directMapFlowStateToCV(effectiveFlowState);
      
      // Also try smart mapping if available
      if (processUserInput && isMappingInitialized) {
        console.log('🧠 Smart mapping available, processing new items');
      
      // Process each piece of data from the flow state
      Object.entries(effectiveFlowState).forEach(async ([key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          // Create a unique identifier for this item
          const itemId = `${key}:${value}`;
          
          // Skip if already processed
          if (processedItemsRef.current.has(itemId)) {
            console.log(`⏭️ Skipping already processed item: ${key}`);
            return;
          }
          
          console.log(`Processing ${key}: ${value}`);
          
          // Find the corresponding node in the flow by variableName first, then by id
          const node = BASIC_CV_FLOW.nodes.find(n => n.data?.variableName === key) || 
                      BASIC_CV_FLOW.nodes.find(n => n.id === key);
          if (node) {
            // Mark as processed
            processedItemsRef.current.add(itemId);
            
            // Use the smart mapping to process this data
            try {
              console.log(`🎯 Processing ${key} with smart mapping:`, { value, node: node.id, variableName: node.data?.variableName });
              const result = await processUserInput(value, [], node, effectiveFlowState);
              console.log(`📊 Smart mapping result for ${key}:`, result);
                if (result.success && result.cvUpdate && Object.keys(result.cvUpdate).length > 0) {
                console.log('✅ CV Update from smart mapping:', result.cvUpdate);
                setCvData(prev => ({ ...prev, ...result.cvUpdate }));
                toast.success(`CV updated with ${key} information!`);
              } else {
                  console.log(`❌ Smart mapping returned empty update for ${key}:`, result);
              }
            } catch (error) {
              console.error(`❌ Error processing flow state for ${key}:`, error);
              // Remove from processed set on error so it can be retried
              processedItemsRef.current.delete(itemId);
            }
          } else {
            console.log(`❌ No node found for key: ${key}`);
          }
        }
      });
      } else {
        console.log('⚠️ Smart mapping not available, using direct mapping only');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveFlowState, processUserInput, isMappingInitialized]);
  
  // Direct mapping function as fallback
  const directMapFlowStateToCV = (flowState: Record<string, any>) => {
    console.log('🎯 Direct mapping flow state to CV:', flowState);
    console.log('🔍 Current CV data before mapping:', cvData);
    const updates: Partial<CVData> = {};
    
    // Personal Information
    if (flowState.fullName || flowState.full_name) {
      updates.fullName = flowState.fullName || flowState.full_name;
      console.log('📝 Direct mapping fullName:', updates.fullName);
    }
    
    if (flowState.preferredName || flowState.preferred_name) {
      updates.preferredName = flowState.preferredName || flowState.preferred_name;
      console.log('📝 Direct mapping preferredName:', updates.preferredName);
    }
    
    // Contact Information
    const contactUpdates: any = {};
    if (flowState.email) {
      contactUpdates.email = flowState.email;
      console.log('📝 Direct mapping email:', flowState.email);
    }
    
    if (flowState.phone) {
      contactUpdates.phone = flowState.phone;
      console.log('📝 Direct mapping phone:', flowState.phone);
    }
    
    if (flowState.location) {
      contactUpdates.location = flowState.location;
      console.log('📝 Direct mapping location:', flowState.location);
    }
    
    if (Object.keys(contactUpdates).length > 0) {
      updates.contact = { ...cvData.contact, ...contactUpdates };
      console.log('🔗 Contact updates:', updates.contact);
    }
    
    // Social Links
    const socialUpdates: any = {};
    if (flowState.linkedin) {
      socialUpdates.linkedin = flowState.linkedin;
      console.log('📝 Direct mapping linkedin:', flowState.linkedin);
    }
    
    if (flowState.website) {
      socialUpdates.website = flowState.website;
      console.log('📝 Direct mapping website:', flowState.website);
    }
    
    if (Object.keys(socialUpdates).length > 0) {
      updates.social = { ...cvData.social, ...socialUpdates };
      console.log('🔗 Social updates:', updates.social);
    }
    
    // Professional Information
    if (flowState.currentTitle || flowState.current_title) {
      updates.title = flowState.currentTitle || flowState.current_title;
      console.log('📝 Direct mapping title:', updates.title);
    }
    
    if (flowState.professionalSummary || flowState.professional_summary) {
      updates.summary = flowState.professionalSummary || flowState.professional_summary;
      console.log('📝 Direct mapping summary:', updates.summary);
    }
    
    // Work Experience - Create experience entry
    const experienceEntry: any = {};
    let hasExperience = false;
    
    if (flowState.currentTitle || flowState.current_title) {
      experienceEntry.title = flowState.currentTitle || flowState.current_title;
      hasExperience = true;
    }
    
    if (flowState.currentCompany || flowState.current_company) {
      experienceEntry.company = flowState.currentCompany || flowState.current_company;
      hasExperience = true;
      console.log('📝 Direct mapping currentCompany:', flowState.currentCompany || flowState.current_company);
    }
    
    if (flowState.currentRoleStartDate || flowState.current_role_start_date) {
      const startDate = flowState.currentRoleStartDate || flowState.current_role_start_date;
      experienceEntry.dates = `${startDate} - Present`;
      hasExperience = true;
      console.log('📝 Direct mapping currentRoleStartDate:', startDate);
    }
    
    if (flowState.currentRoleDescription || flowState.current_role_description) {
      const description = flowState.currentRoleDescription || flowState.current_role_description;
      experienceEntry.content = [description];
      hasExperience = true;
      console.log('📝 Direct mapping currentRoleDescription:', description);
    }
    
    if (flowState.currentAchievements || flowState.current_achievements) {
      const achievements = flowState.currentAchievements || flowState.current_achievements;
      if (Array.isArray(achievements)) {
        experienceEntry.achievements = achievements;
      } else {
        experienceEntry.achievements = [achievements];
      }
      hasExperience = true;
      console.log('📝 Direct mapping currentAchievements:', achievements);
    }
    
    if (hasExperience) {
      updates.experience = [experienceEntry];
      console.log('📝 Direct mapping experience entry:', experienceEntry);
    }
    
    // Skills - Combine technical and soft skills
    const skillsArray: string[] = [];
    
    if (flowState.technicalSkills || flowState.technical_skills) {
      const techSkills = flowState.technicalSkills || flowState.technical_skills;
      if (Array.isArray(techSkills)) {
        skillsArray.push(...techSkills);
      } else {
        skillsArray.push(techSkills);
      }
      console.log('📝 Direct mapping technicalSkills:', techSkills);
    }
    
    if (flowState.softSkills || flowState.soft_skills) {
      const softSkills = flowState.softSkills || flowState.soft_skills;
      if (Array.isArray(softSkills)) {
        skillsArray.push(...softSkills);
      } else {
        skillsArray.push(softSkills);
      }
      console.log('📝 Direct mapping softSkills:', softSkills);
    }
    
    if (flowState.topStrengths || flowState.top_strengths) {
      const strengths = flowState.topStrengths || flowState.top_strengths;
      if (Array.isArray(strengths)) {
        skillsArray.push(...strengths);
      } else {
        skillsArray.push(strengths);
      }
      console.log('📝 Direct mapping topStrengths:', strengths);
    }
    
    if (skillsArray.length > 0) {
      updates.skills = skillsArray;
      console.log('📝 Direct mapping skills array:', skillsArray);
    }
    
    // Languages
    if (flowState.languages) {
      if (Array.isArray(flowState.languages)) {
        updates.languages = flowState.languages.filter(lang => lang && lang.trim());
      } else if (typeof flowState.languages === 'string') {
        // Split by common separators if it's a string
        const languages = flowState.languages.split(/[,;|]/).map(lang => lang.trim()).filter(lang => lang);
        updates.languages = languages;
      } else {
        updates.languages = [String(flowState.languages)];
      }
      console.log('📝 Direct mapping languages:', updates.languages);
    }
    
    // Education - Create education entry
    const educationEntry: any = {};
    let hasEducation = false;
    
    if (flowState.educationLevel || flowState.education_level) {
      educationEntry.degree = flowState.educationLevel || flowState.education_level;
      hasEducation = true;
    }
    
    if (flowState.degreeField || flowState.degree_field) {
      educationEntry.field = flowState.degreeField || flowState.degree_field;
      hasEducation = true;
    }
    
    if (flowState.university) {
      educationEntry.institution = flowState.university;
      hasEducation = true;
    }
    
    if (flowState.graduationYear || flowState.graduation_year) {
      const gradYear = flowState.graduationYear || flowState.graduation_year;
      educationEntry.dates = gradYear;
      hasEducation = true;
    }
    
    if (hasEducation) {
      updates.education = [educationEntry];
      console.log('📝 Direct mapping education entry:', educationEntry);
    }
    
    // Additional Information
    if (flowState.certifications) {
      if (typeof flowState.certifications === 'string') {
        updates.certifications = flowState.certifications;
      } else if (Array.isArray(flowState.certifications)) {
        updates.certifications = flowState.certifications.join(', ');
      }
      console.log('📝 Direct mapping certifications:', updates.certifications);
    }
    
    if (flowState.projects) {
      if (typeof flowState.projects === 'string') {
        updates.projects = flowState.projects;
      } else if (Array.isArray(flowState.projects)) {
        updates.projects = flowState.projects.join(', ');
      }
      console.log('📝 Direct mapping projects:', updates.projects);
    }
    
    if (flowState.interests) {
      if (Array.isArray(flowState.interests)) {
        updates.hobbies = flowState.interests;
      } else {
        updates.hobbies = [flowState.interests];
      }
      console.log('📝 Direct mapping interests as hobbies:', updates.hobbies);
      }
      
      // Apply updates if any
      if (Object.keys(updates).length > 0) {
      console.log('✅ Applying direct CV updates:', updates);
      if (updates.languages) {
        console.log('🔍 Languages being set:', updates.languages, 'Type:', typeof updates.languages, 'Is Array:', Array.isArray(updates.languages));
      }
      setCvData(prev => {
        const newData = { ...prev, ...updates };
        if (newData.languages) {
          console.log('🔍 Languages in new CV data:', newData.languages, 'Type:', typeof newData.languages, 'Is Array:', Array.isArray(newData.languages));
        }
        return newData;
      });
        toast.success('CV data populated from flow responses!');
      } else {
      console.log('⚠️ No direct updates to apply');
    }
  };
  
  // Clear processed items when flow state changes significantly
  useEffect(() => {
    // Only clear if the flow state has actually changed (not just re-rendered)
    const currentKeys = Object.keys(effectiveFlowState || {});
    const lastKeys = (processedItemsRef.current as any).lastKeys || [];
    
    if (JSON.stringify(currentKeys.sort()) !== JSON.stringify(lastKeys.sort())) {
      console.log('🔄 Flow state keys changed, clearing processed items');
      processedItemsRef.current.clear();
      (processedItemsRef.current as any).lastKeys = currentKeys;
    }
  }, [effectiveFlowState]);


  // Debug: Log flow execution status
  useEffect(() => {
    console.log('🔍 Flow execution status:', {
      isFlowLoaded,
      isFlowLoading,
      flowError,
      useFallback,
      flowState: Object.keys(flowState || {}),
      localFlowState: Object.keys(localFlowState || {}),
      effectiveFlowState: Object.keys(effectiveFlowState || {}),
      isMappingInitialized,
      hasProcessUserInput: !!processUserInput,
      hasLocalFlowExecutor: !!localFlowExecutor,
      cvDataStatus: {
        fullName: cvData.fullName || 'EMPTY',
        email: cvData.contact?.email || 'EMPTY',
        phone: cvData.contact?.phone || 'EMPTY',
        location: cvData.contact?.location || 'EMPTY',
        summary: cvData.summary || 'EMPTY'
      }
    });
  }, [isFlowLoaded, isFlowLoading, flowError, useFallback, flowState, localFlowState, effectiveFlowState, isMappingInitialized, processUserInput, localFlowExecutor, cvData]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCvData = localStorage.getItem('cvData');
    const savedMessages = localStorage.getItem('cv_builder_messages');
    const savedQuestionIndex = localStorage.getItem('cv_builder_question_index');
    
    if (savedCvData) {
      try {
        const parsedData = JSON.parse(savedCvData);
        // Check if it's sample data and skip loading if so
        if (parsedData.fullName && ['John Doe', 'Alex Morgan', 'Sam Wilson'].includes(parsedData.fullName)) {
          console.log('Skipping sample data load');
        } else {
          setCvData(parsedData);
        }
      } catch (error) {
        console.error('Error parsing saved CV data:', error);
      }
    }
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
    
    if (savedQuestionIndex) {
      try {
        setCurrentQuestionIndex(parseInt(savedQuestionIndex));
      } catch (error) {
        console.error('Error parsing saved question index:', error);
      }
    }
  }, []);

  const [showClearConfirmation, setShowClearConfirmation] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [cvZoom, setCvZoom] = useState(1)
  const [experienceStep, setExperienceStep] = useState<'intro' | 'title' | 'company' | 'dates' | 'achievements' | 'more'>('intro')
  const [currentExperience, setCurrentExperience] = useState<{
    title: string
    company: string
    dates: string
    achievements: string[]
  }>({
    title: '',
    company: '',
    dates: '',
    achievements: []
  })

  // State management to prevent race conditions
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Process pending messages when not already processing
  useEffect(() => {
    if (pendingMessage && !isProcessing) {
      const message = pendingMessage;
      setPendingMessage(null);
      handleSendMessage(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMessage, isProcessing]);

  // Education collection state
  const [educationStep, setEducationStep] = useState<'intro' | 'level' | 'degree' | 'institution' | 'dates' | 'field' | 'achievements' | 'more' | 'has_education' | 'highest_level'>('intro')
  const [currentEducation, setCurrentEducation] = useState<{
    degree: string
    institution: string
    dates: string
    field: string
    achievements: string[]
  }>({
    degree: '',
    institution: '',
    dates: '',
    field: '',
    achievements: []
  })
  const [educationAnswered, setEducationAnswered] = useState(false)
  const [languagesCollected, setLanguagesCollected] = useState(false)
  const [currentLanguages, setCurrentLanguages] = useState<string[]>([])

  // Date validation function
  const validateDate = (dateInput: string): { isValid: boolean; error?: string } => {
    const trimmed = dateInput.trim()
    
    // Check for "Present" format
    if (trimmed.toLowerCase().includes('present')) {
      const yearMatch = trimmed.match(/(\d{4})\s*-\s*present/i)
      if (yearMatch) {
        const year = parseInt(yearMatch[1])
        const currentYear = new Date().getFullYear()
        if (year > currentYear) {
          return { isValid: false, error: 'Start year cannot be in the future.' }
        }
        return { isValid: true }
      }
    }
    
    // Check for year range format (YYYY - YYYY)
    const rangeMatch = trimmed.match(/(\d{4})\s*-\s*(\d{4})/)
    if (rangeMatch) {
      const startYear = parseInt(rangeMatch[1])
      const endYear = parseInt(rangeMatch[2])
      const currentYear = new Date().getFullYear()
      
      if (startYear > currentYear) {
        return { isValid: false, error: 'Start year cannot be in the future.' }
      }
      if (endYear > currentYear) {
        return { isValid: false, error: 'End year cannot be in the future.' }
      }
      if (startYear > endYear) {
        return { isValid: false, error: 'Start year must be before end year.' }
      }
      return { isValid: true }
    }
    
    // Check for single year format (YYYY)
    const singleYearMatch = trimmed.match(/^\d{4}$/)
    if (singleYearMatch) {
      const year = parseInt(trimmed)
      const currentYear = new Date().getFullYear()
      if (year > currentYear) {
        return { isValid: false, error: 'Year cannot be in the future.' }
      }
      return { isValid: true }
    }
    
    return { isValid: false, error: 'Please use format: YYYY - YYYY, YYYY - Present, or YYYY' }
  }

  const responseHandler = new StandardizedResponseHandler()

  // Mapping for question messages to avoid translation key issues
  const getQuestionMessage = useCallback((questionId: string): string => {
    const messageMap: { [key: string]: string } = {
      'intro': 'Welcome to the Basic CV Builder! I\'ll help you create a professional CV in just a few minutes. Let\'s start with your basic information.',
      'fullName': 'What\'s your full name?',
      'email': 'What\'s your email address?',
      'phone': 'What\'s your phone number? (Optional)',
      'location': 'Where are you located? (City, Country)',
      'summary': 'Write a brief professional summary about your background and skills',
      'experience_intro': t('quick_cv.work_experience_question'),
      'experience_title': 'Great! What was your job title?',
      'experience_company': 'What company did you work for?',
      'experience_dates': 'When did you work there? (e.g., "2020 - 2023" or "2021 - Present")',
      'experience_achievements': 'What were your key achievements? Type each achievement followed by Enter. When you\'re finished, type "done".',
      'experience_more': 'Experience added! Do you want to add another job? (Yes/No)',
      'education_intro': t('quick_cv.study_diploma_question'),
      'education_level': 'What\'s your highest level of education? (e.g., High School, Bachelor\'s, Master\'s, PhD)',
      'education_degree': 'What degree did you earn? (e.g., Bachelor of Science, Master of Arts)',
      'education_institution': 'What institution did you attend? (e.g., University of Amsterdam)',
      'education_dates': 'When did you graduate? (e.g., "2018 - 2022" or "2020")',
      'education_field': 'What was your field of study?',
      'education_achievements': 'What were your key achievements? Type each achievement followed by Enter. When you\'re finished, type "done".',
      'education_more': 'Education added! Do you want to add another degree? (Yes/No)',
      'skills_intro': 'What are your key skills? (e.g., JavaScript, Project Management, Leadership, Communication)',
      'languages_intro': t('question.languages_intro_simple'),
      'languages_proficiency': t('question.languages_proficiency_simple'),
      'completion': 'Congratulations! Your professional CV is complete. You can now preview, download, and share your CV.'
    }
    return messageMap[questionId] || 'Please continue with the next question.'
  }, [t])

  // Note: Removed cleanupDuplicateMessages to prevent infinite loop
  // Duplicate message cleanup is now handled inline where messages are set

  // Initialize the conversation
  useEffect(() => {
    if (messages.length === 0 && SIMPLIFIED_CV_QUESTIONS.length > 0) {
      const welcomeMessage = getQuestionMessage('intro')
      const firstActualQuestion = SIMPLIFIED_CV_QUESTIONS[1] // Skip intro, start with fullName
      const firstQuestionMessage = getQuestionMessage(firstActualQuestion.id)
      setMessages([
        { role: 'assistant', content: welcomeMessage },
        { role: 'assistant', content: firstQuestionMessage }
      ])
      setCurrentQuestionIndex(1) // Start with fullName, not intro
    }
  }, [messages.length, getQuestionMessage])

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    // Use flow system if available
    if (isFlowLoaded && !useFallback) {
      sendFlowMessage(message);
      return;
    }

    // Use local flow executor if available
    if (localFlowExecutor && useFallback) {
      console.log('Using local flow executor for message:', message);
      const result = localFlowExecutor.processUserResponse(message);
      setLocalCurrentQuestion(result.nextQuestion || null);
      setLocalMessages(result.messages);
      setLocalFlowState(result.flowState);
      console.log('Local flow result:', result);
      return;
    }

    // Fallback to original logic
    if (isProcessing) {
      // Queue the message if already processing
      setPendingMessage(message);
      return;
    }

    setIsProcessing(true);

    const currentQuestion = SIMPLIFIED_CV_QUESTIONS[currentQuestionIndex]
    if (!currentQuestion) return

    // Debug logging removed for production

    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }])

      // Handle experience collection flow
      if (currentQuestion.id === 'experience_intro' && experienceStep === 'intro') {
        const messageLower = message.toLowerCase().trim()
        if (messageLower.startsWith('y') || messageLower === 'yes') {
          // Explicitly initialize to title step
          setExperienceStep('title')
          setMessages(prev => [...prev, { role: 'assistant', content: 'Great! What was your job title?' }])
        } else if (messageLower.startsWith('n') || messageLower === 'no') {
          // Skip to education
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: t('quick_cv.no_problem_education') }])
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please answer with Yes or No. ' + t('quick_cv.work_experience_question') }])
        }
        setIsProcessing(false)
        return
      }

      // Handle experience collection steps
      if (experienceStep === 'title') {
        setCurrentExperience(prev => ({ ...prev, title: message.trim() }))
        // Don't save to CV data yet - wait until complete
        setExperienceStep('company')
        setMessages(prev => [...prev, { role: 'assistant', content: 'What company did you work for?' }])
        setIsProcessing(false)
        return
      }

      if (experienceStep === 'company') {
        setCurrentExperience(prev => ({ ...prev, company: message.trim() }))
        // Don't save to CV data yet - wait until complete
        setExperienceStep('dates')
        setMessages(prev => [...prev, { role: 'assistant', content: 'When did you work there? (e.g., "2020 - 2023" or "2021 - Present")' }])
        setIsProcessing(false)
        return
      }

      if (experienceStep === 'dates') {
        // Validate date format
        const dateValidation = validateDate(message)
        if (!dateValidation.isValid) {
          setMessages(prev => [...prev, { role: 'assistant', content: dateValidation.error! }])
          setIsProcessing(false)
          return
        }
        
        setCurrentExperience(prev => ({ ...prev, dates: message.trim() }))
        setExperienceStep('achievements')
        setMessages(prev => [...prev, { role: 'assistant', content: 'What were your key achievements? Type each achievement followed by Enter. When you\'re finished, type "done".' }])
        setIsProcessing(false)
        return
      }

      if (experienceStep === 'achievements') {
        if (message.toLowerCase().includes('done')) {
          // Save the experience and ask if they want to add more
          const newExperience = {
            title: currentExperience.title,
            company: currentExperience.company,
            type: 'Full-time' as const,
            location: '',
            current: false,
            dates: currentExperience.dates,
            achievements: currentExperience.achievements
          }
          setCvData(prev => ({
            ...prev,
            experience: [...(prev.experience || []), newExperience]
          }))
          setExperienceStep('more')
          setMessages(prev => [...prev, { role: 'assistant', content: 'Experience added! Do you want to add another job? (Yes/No)' }])
          setIsProcessing(false)
          return
        } else {
          // Add achievement to the list
          setCurrentExperience(prev => ({
            ...prev,
            achievements: [...prev.achievements, message.trim()]
          }))
          setMessages(prev => [...prev, { role: 'assistant', content: 'Achievement added! What else did you accomplish? (Or type "done" when finished)' }])
          setIsProcessing(false)
          return
        }
      }

      if (experienceStep === 'more') {
        const messageLower = message.toLowerCase().trim()
        if (messageLower.startsWith('y') || messageLower === 'yes') {
          // Reset for another experience
          setCurrentExperience({
            title: '',
            company: '',
            dates: '',
            achievements: [] as string[]
          })
          setExperienceStep('title')
          setMessages(prev => [...prev, { role: 'assistant', content: 'Great! What was your job title?' }])
        } else if (messageLower.startsWith('n') || messageLower === 'no') {
          // Move to education
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          setExperienceStep('intro')
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: 'Great! Now let\'s add your education.' }])
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please answer with Yes or No. Do you want to add another job?' }])
        }
        setIsProcessing(false)
        return
      }

      // Handle education collection flow
      if (currentQuestion.id === 'education_intro' && educationStep === 'intro') {
        const messageLower = message.toLowerCase().trim()
        if (messageLower.startsWith('y') || messageLower === 'yes') {
          setEducationStep('level')
          setMessages(prev => [...prev, { role: 'assistant', content: 'What\'s your highest level of education? (e.g., High School, Bachelor\'s, Master\'s, PhD)' }])
        } else if (messageLower.startsWith('n') || messageLower === 'no') {
          // Skip to skills
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: 'No problem! Let\'s focus on your skills.' }])
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please answer with Yes or No. ' + t('quick_cv.study_diploma_question') }])
        }
        setIsProcessing(false)
        return
      }

      // Handle education collection steps
      if (educationStep === 'level') {
        setCurrentEducation(prev => ({ ...prev, degree: message.trim() }))
        setEducationStep('institution')
        setMessages(prev => [...prev, { role: 'assistant', content: 'What institution did you attend? (e.g., University of Amsterdam)' }])
        setIsProcessing(false)
        return
      }

      if (educationStep === 'institution') {
        setCurrentEducation(prev => ({ ...prev, institution: message.trim() }))
        setEducationStep('dates')
        setMessages(prev => [...prev, { role: 'assistant', content: 'When did you graduate? (e.g., "2018 - 2022" or "2020")' }])
        setIsProcessing(false)
        return
      }

      if (educationStep === 'dates') {
        // Validate date format
        const dateValidation = validateDate(message)
        if (!dateValidation.isValid) {
          setMessages(prev => [...prev, { role: 'assistant', content: dateValidation.error! }])
          setIsProcessing(false)
          return
        }
        
        setCurrentEducation(prev => ({ ...prev, dates: message.trim() }))
        setEducationStep('field')
        setMessages(prev => [...prev, { role: 'assistant', content: 'What was your field of study?' }])
        setIsProcessing(false)
        return
      }

      if (educationStep === 'field') {
        setCurrentEducation(prev => ({ ...prev, field: message.trim() }))
        setEducationStep('achievements')
        setMessages(prev => [...prev, { role: 'assistant', content: 'What were your key achievements? Type each achievement followed by Enter. When you\'re finished, type "done".' }])
        setIsProcessing(false)
        return
      }

      if (educationStep === 'achievements') {
        if (message.toLowerCase().includes('done')) {
          // Save the education and ask if they want to add more
          const newEducation = {
            title: `${currentEducation.degree} from ${currentEducation.institution}`,
            content: [
              `Institution: ${currentEducation.institution}`,
              `Degree: ${currentEducation.degree}`,
              `Field: ${currentEducation.field}`,
              `Graduation: ${currentEducation.dates}`,
              ...(currentEducation.achievements.length > 0 ? ['', 'Achievements:', ...currentEducation.achievements] : [])
            ]
          }
          setCvData(prev => ({
            ...prev,
            education: [...(prev.education || []), newEducation]
          }))
          setEducationStep('more')
          setMessages(prev => [...prev, { role: 'assistant', content: 'Education added! Do you want to add another degree? (Yes/No)' }])
          setIsProcessing(false)
          return
        } else {
          // Add achievement to the list
          setCurrentEducation(prev => ({
            ...prev,
            achievements: [...prev.achievements, message.trim()]
          }))
          setMessages(prev => [...prev, { role: 'assistant', content: 'Achievement added! What else did you accomplish? (Or type "done" when finished)' }])
          setIsProcessing(false)
          return
        }
      }

      if (educationStep === 'more') {
        const messageLower = message.toLowerCase().trim()
        if (messageLower.startsWith('y') || messageLower === 'yes') {
          // Reset for another education
          setCurrentEducation({
            degree: '',
            institution: '',
            dates: '',
            field: '',
            achievements: [] as string[]
          })
          setEducationStep('level')
          setMessages(prev => [...prev, { role: 'assistant', content: 'What\'s your highest level of education? (e.g., High School, Bachelor\'s, Master\'s, PhD)' }])
        } else if (messageLower.startsWith('n') || messageLower === 'no') {
          // Move to skills
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          setEducationStep('intro')
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: 'Great! Now let\'s add your skills.' }])
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please answer with Yes or No. Do you want to add another degree?' }])
        }
        setIsProcessing(false)
        return
      }

      // Handle languages collection
      if (currentQuestion.id === 'languages_intro' && !languagesCollected) {
        const messageLower = message.toLowerCase().trim()
        if (messageLower.startsWith('y') || messageLower === 'yes') {
          setLanguagesCollected(true)
          setMessages(prev => [...prev, { role: 'assistant', content: t('question.languages_proficiency_simple') }])
        } else if (messageLower.startsWith('n') || messageLower === 'no') {
          // Skip to completion
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please answer with Yes or No. ' + t('question.languages_intro_simple') }])
        }
        setIsProcessing(false)
        return
      }

      if (languagesCollected && currentLanguages.length === 0) {
        // Parse languages from user input
        const languages = message.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0)
        setCurrentLanguages(languages)
        
        // Add languages to CV data
        setCvData(prev => ({
          ...prev,
          languages: languages
        }))
        
        // Move to completion
        const nextQuestionIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextQuestionIndex)
        const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
        const nextMessage = getQuestionMessage(nextQuestion.id)
        setMessages(prev => [...prev, { role: 'assistant', content: 'Languages added! ' + nextMessage }])
        setIsProcessing(false)
        return
      }

      // Handle regular questions using enhanced processing with smart mapping
      const response = await processMessageWithSmartMapping(message, currentQuestion)
      
      if (response.success) {
        // Update CV data
        if (response.cvDataUpdate) {
          setCvData(prev => ({ ...prev, ...response.cvDataUpdate }))
        }
        
        // Add assistant response
        const responseMessage = response.message.startsWith('quick_cv.') ? t(response.message) : response.message
        setMessages(prev => [...prev, { role: 'assistant', content: responseMessage }])
        
        // Move to next question
        if (response.shouldMoveToNext && currentQuestionIndex < SIMPLIFIED_CV_QUESTIONS.length - 1) {
          const nextQuestionIndex = currentQuestionIndex + 1
          setCurrentQuestionIndex(nextQuestionIndex)
          const nextQuestion = SIMPLIFIED_CV_QUESTIONS[nextQuestionIndex]
          const nextMessage = getQuestionMessage(nextQuestion.id)
          setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
        }
      } else {
        // Show error message
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }])
      }

    } catch (error) {
      console.error('Error processing message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred. Please try again.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSkipQuestion = () => {
    // If we're using the flow system, handle skip through flow execution
    if (isFlowLoaded && sendFlowMessage) {
      console.log('🔄 Skipping question in flow system');
      sendFlowMessage('Skip');
      return;
    }
    
    // If we're using local flow executor, handle skip through local flow
    if (localFlowExecutor && localCurrentQuestion) {
      console.log('🔄 Skipping question in local flow system');
      const result = localFlowExecutor.processUserResponse('Skip');
      setLocalCurrentQuestion(result.nextQuestion || null);
      setLocalMessages(result.messages);
      setLocalFlowState(result.flowState);
      return;
    }

    // Fallback to simplified questions system
    const currentQuestion = SIMPLIFIED_CV_QUESTIONS[currentQuestionIndex]
    if (!currentQuestion) return

    // Add skip message to conversation
    setMessages(prev => [...prev, { role: 'user', content: 'Skip' }])
    
    // Add acknowledgment message
    const skipMessage = currentQuestion.required 
      ? 'I understand you want to skip this question. Let me move to the next one.'
      : 'No problem! Let\'s move to the next question.'
    setMessages(prev => [...prev, { role: 'assistant', content: skipMessage }])

    // Move to next question using the standardized handler
    const nextQuestion = StandardizedResponseHandler.getNextQuestion(
      currentQuestionIndex,
      SIMPLIFIED_CV_QUESTIONS,
      cvData
    )

    if (nextQuestion) {
      const nextQuestionIndex = SIMPLIFIED_CV_QUESTIONS.findIndex(q => q.id === nextQuestion.id)
      setCurrentQuestionIndex(nextQuestionIndex)
      const nextMessage = getQuestionMessage(nextQuestion.id)
      setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }])
    } else {
      // CV is complete
      setMessages(prev => [...prev, { role: 'assistant', content: 'Your CV is complete! You can download it below.' }])
    }
  }

  const handleClearCV = () => {
    setShowClearConfirmation(true)
  }

  const confirmClearCV = () => {
    setCvData({
      fullName: '',
      contact: {
        email: '',
        phone: '',
        location: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      certifications: '',
      projects: '',
      hobbies: [],
      photoUrl: '',
      template: 'modern',
      social: {
        linkedin: '',
        github: '',
        website: '',
        twitter: '',
        instagram: ''
      },
      layout: {
        photoPosition: 'left',
        showIcons: true,
        accentColor: '#3B82F6',
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'languages'],
        hiddenSections: []
      }
    })
    
    // Clear flow-related state
    if (resetFlow) {
      resetFlow()
    }
    
    // Clear local flow state
    setLocalFlowState({})
    setLocalMessages([])
    setLocalCurrentQuestion(null)
    
    // Clear processed items
    processedItemsRef.current.clear()
    
    setMessages([])
    setCurrentQuestionIndex(1)
    setSavedCVId(null)
    setExperienceStep('intro')
    setEducationStep('intro')
    setEducationAnswered(false)
    setLanguagesCollected(false)
    setCurrentLanguages([])
    setCurrentExperience({
      title: '',
      company: '',
      dates: '',
      achievements: []
    })
    setCurrentEducation({
      degree: '',
      institution: '',
      dates: '',
      field: '',
      achievements: []
    })
    
    // Clear localStorage
    localStorage.removeItem('cvData')
    localStorage.removeItem('cv_builder_messages')
    localStorage.removeItem('cv_builder_question_index')
    
    setShowClearConfirmation(false)
    
    // Force restart the chat by adding the first question
    setTimeout(() => {
      setMessages([{ 
        role: 'assistant', 
        content: t('question.fullName') 
      }]);
      setCurrentQuestionIndex(1);
    }, 100);
    
    toast.success('CV data and chat cleared successfully!')
  }

  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your CV');
      router.push('/auth/login?next=/quick-cv');
      return;
    }

    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cvData.fullName ? `${cvData.fullName}'s CV` : 'My CV',
          content: cvData,
          template: cvData.template || 'modern',
          chatHistory: {
            messages: messages,
            questionIndex: currentQuestionIndex,
            accountDataPreference: null // Basic CV Builder doesn't use account data prefill
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSavedCVId(result.cv.id);
        toast.success('CV saved successfully!');
      } else {
        throw new Error('Failed to save CV');
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV. Please try again.');
    }
  };

  const handlePrintCV = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to download your CV');
      router.push('/auth/login?next=/quick-cv');
      return;
    }
    // Navigate to full-page preview for printing
    openCVPreview(cvData)
  };

  const handleLoadCV = async (item: { id: string; title: string; type: string }) => {
    try {
      const response = await fetch(`/api/cv/${item.id}`);
      if (response.ok) {
        const data = await response.json();
        const cv = data.cv;
        
        // Load CV data
        setCvData(cv.content);
        
        // Load chat history if available
        if (cv.chatHistory) {
          setMessages(cv.chatHistory.messages || []);
          setCurrentQuestionIndex(cv.chatHistory.questionIndex || 1);
        }
        
        // Set the saved CV ID
        setSavedCVId(cv.id);
        
        toast.success('CV loaded successfully!');
      } else {
        throw new Error('Failed to load CV');
      }
    } catch (error) {
      console.error('Error loading CV:', error);
      toast.error('Failed to load CV. Please try again.');
    }
  };

  const loadSampleData = (type: 'full' | 'minimal') => {
    const sampleData: CVData = {
      fullName: 'John Doe',
      contact: {
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY'
      },
      summary: 'Experienced software developer with 5+ years in web development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and mentoring junior developers.',
      experience: [
        {
          title: 'Senior Software Developer',
          company: 'TechCorp Inc.',
          type: 'Full-time',
          location: 'New York, NY',
          current: true,
          dates: '2021 - Present',
          achievements: [
            'Led development of 3 major web applications using React and Node.js',
            'Mentored 5 junior developers and improved team productivity by 30%',
            'Implemented CI/CD pipeline reducing deployment time by 60%'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          field: 'Computer Science',
          dates: '2016 - 2020',
          achievements: ['Dean\'s List', 'Computer Science Honor Society']
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Git', 'Agile Methodologies'],
      certifications: 'AWS Certified Developer, Google Cloud Professional',
      projects: 'E-commerce Platform - Full-stack solution with React and Node.js',
      hobbies: ['Hiking', 'Photography', 'Open Source Contributing'],
      photoUrl: '',
      template: 'modern',
      layout: {
        photoPosition: 'left',
        showIcons: true,
        accentColor: '#3B82F6',
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills'],
        hiddenSections: []
      }
    }

    setCvData(sampleData)
    toast.success('Sample CV data loaded!')
  }

  // Load comprehensive sample data with all Basic CV Builder fields
  const loadComprehensiveSampleData = () => {
    const comprehensiveSampleData: CVData = {
      // Personal Information
      fullName: 'Alexandra Rodriguez',
      preferredName: 'Alex',
      title: 'Senior Product Manager',
      
      // Contact Information
      contact: {
        email: 'alex.rodriguez@techcorp.com',
        phone: '+1 (555) 987-6543',
        location: 'Austin, Texas'
      },
      
      // Social Links
      social: {
        linkedin: 'https://linkedin.com/in/alexandra-rodriguez',
        github: 'https://github.com/alexrodriguez',
        website: 'https://alexrodriguez.dev',
        twitter: 'https://twitter.com/alexrodriguez',
        instagram: ''
      },
      
      // Professional Information
      summary: 'Dynamic product manager with 8+ years of experience driving digital transformation and leading cross-functional teams. Expert in agile methodologies, user research, and data-driven decision making. Passionate about creating products that solve real-world problems and deliver exceptional user experiences.',
      
      // Additional Basic CV Builder Fields (for testing all flow variables)
      experienceYears: '8+ years',
      topStrengths: 'Strategic Thinking, Cross-functional Leadership, Data-driven Decision Making',
      currentCompany: 'TechCorp Solutions',
      currentRoleStartDate: '01/2021',
      currentRoleDescription: 'Lead product strategy for enterprise SaaS platform serving 50,000+ users. Collaborate with engineering, design, and marketing teams to deliver features. Conduct user research and analyze data to inform product decisions.',
      currentAchievements: 'Increased user engagement by 35% through strategic feature releases. Reduced customer churn by 20% by implementing user feedback loops. Launched 3 major product features that generated $2M+ in revenue.',
      previousExperience: 'Product Manager at InnovateTech (2019-2021). Managed product roadmap for mobile application with 100K+ downloads. Worked closely with UX designers to improve user experience. Analyzed market trends and competitive landscape.\n\nAssociate Product Manager at StartupXYZ (2017-2019). Supported product development for early-stage startup. Conducted user interviews and usability testing. Created product requirements and user stories.',
      technicalSkills: 'Product Strategy, Agile Methodologies, User Research, Data Analysis, A/B Testing, Figma, SQL, Python, Tableau, Jira, Confluence',
      softSkills: 'Leadership, Cross-functional Collaboration, Stakeholder Management, Market Research, Competitive Analysis, Roadmap Planning',
      educationLevel: 'Master of Business Administration',
      degreeField: 'Technology Management',
      university: 'Stanford Graduate School of Business',
      graduationYear: '2017',
      gpa: '3.8/4.0',
      interests: 'Rock Climbing, Photography, Cooking, Travel, Volunteering, Reading',
      
      // Work Experience
      experience: [
        {
          title: 'Senior Product Manager',
          company: 'TechCorp Solutions',
          dates: '2021 - Present',
          content: [
            'Lead product strategy for enterprise SaaS platform serving 50,000+ users',
            'Collaborate with engineering, design, and marketing teams to deliver features',
            'Conduct user research and analyze data to inform product decisions'
          ],
          achievements: [
            'Increased user engagement by 35% through strategic feature releases',
            'Reduced customer churn by 20% by implementing user feedback loops',
            'Launched 3 major product features that generated $2M+ in revenue'
          ]
        },
        {
          title: 'Product Manager',
          company: 'InnovateTech',
          dates: '2019 - 2021',
          content: [
            'Managed product roadmap for mobile application with 100K+ downloads',
            'Worked closely with UX designers to improve user experience',
            'Analyzed market trends and competitive landscape'
          ],
          achievements: [
            'Led successful app redesign that increased user retention by 40%',
            'Implemented A/B testing framework resulting in 15% conversion improvement',
            'Established product metrics and KPIs for team alignment'
          ]
        },
        {
          title: 'Associate Product Manager',
          company: 'StartupXYZ',
          dates: '2017 - 2019',
          content: [
            'Supported product development for early-stage startup',
            'Conducted user interviews and usability testing',
            'Created product requirements and user stories'
          ],
          achievements: [
            'Helped launch MVP that secured $1M in seed funding',
            'Built user research program from scratch',
            'Collaborated with 5-person engineering team'
          ]
        }
      ],
      
      // Education
      education: [
        {
          degree: 'Master of Business Administration',
          institution: 'Stanford Graduate School of Business',
          dates: '2015 - 2017',
          field: 'Technology Management',
          achievements: [
            'Graduated Magna Cum Laude',
            'President of Technology Club',
            'Case Study Competition Winner'
          ]
        },
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Texas at Austin',
          dates: '2011 - 2015',
          field: 'Computer Science',
          achievements: [
            'Dean\'s List for 6 consecutive semesters',
            'Research Assistant in Human-Computer Interaction Lab',
            'Tutored 20+ students in programming courses'
          ]
        }
      ],
      
      // Skills
      skills: [
        'Product Strategy', 'Agile Methodologies', 'User Research', 'Data Analysis',
        'A/B Testing', 'Figma', 'SQL', 'Python', 'Tableau', 'Jira', 'Confluence',
        'Leadership', 'Cross-functional Collaboration', 'Stakeholder Management',
        'Market Research', 'Competitive Analysis', 'Roadmap Planning'
      ],
      
      // Languages
      languages: ['English (Native)', 'Spanish (Fluent)', 'French (Conversational)'],
      
      // Certifications
      certifications: [
        {
          title: 'Certified Scrum Product Owner (CSPO)',
          institution: 'Scrum Alliance',
          year: '2022',
          content: ['Agile project management methodologies', 'Product backlog management', 'Stakeholder collaboration']
        },
        {
          title: 'Google Analytics Certified',
          institution: 'Google',
          year: '2021',
          content: ['Web analytics and reporting', 'Data analysis and insights', 'Conversion optimization']
        },
        {
          title: 'AWS Cloud Practitioner',
          institution: 'Amazon Web Services',
          year: '2023',
          content: ['Cloud computing fundamentals', 'AWS services overview', 'Security and compliance']
        }
      ],
      
      // Projects
      projects: [
        {
          title: 'AI-Powered Recommendation Engine',
          organization: 'TechCorp Solutions',
          startDate: 'Jan 2023',
          endDate: 'Jun 2023',
          content: [
            'Led development of machine learning recommendation system',
            'Increased user engagement by 45% through personalized content',
            'Managed cross-functional team of 8 engineers and designers',
            'Delivered MVP in 6 months using Python, TensorFlow, and React'
          ]
        },
        {
          title: 'E-commerce Platform Redesign',
          organization: 'InnovateTech',
          startDate: 'Sep 2022',
          endDate: 'Dec 2022',
          content: [
            'Redesigned user interface for mobile-first experience',
            'Implemented new payment processing system',
            'Improved page load times by 60%',
            'Increased conversion rates by 25%'
          ]
        }
      ],
      
      // Hobbies/Interests
      hobbies: ['Rock Climbing', 'Photography', 'Cooking', 'Travel', 'Volunteering', 'Reading'],
      
      // Additional fields
      photoUrl: '',
      template: 'modern',
      layout: {
        photoPosition: 'left',
        showIcons: true,
        accentColor: '#3B82F6',
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'hobbies'],
        hiddenSections: []
      }
    }

    setCvData(comprehensiveSampleData)
    toast.success('Comprehensive sample data loaded! All Basic CV Builder fields populated.')
  }

  // Calculate progress based on actual flow questions answered
  const calculateProgress = (): number => {
    // If we're using the flow system, calculate based on flow state
    if (effectiveFlowState && Object.keys(effectiveFlowState).length > 0) {
      // Get all question nodes from the flow
      const questionNodes = BASIC_CV_FLOW.nodes.filter(node => node.type === 'question');
      const totalQuestions = questionNodes.length;
      
      // Count answered questions based on flow state (excluding skipped questions)
      let answeredQuestions = 0;
      questionNodes.forEach(node => {
        const variableName = node.data?.variableName;
        if (variableName && effectiveFlowState[variableName] && 
            effectiveFlowState[variableName].toString().trim().length > 0 &&
            effectiveFlowState[variableName] !== '[Skipped]') {
          answeredQuestions++;
        }
      });
      
      const progress = Math.round((answeredQuestions / totalQuestions) * 100);
      console.log(`📊 Flow Progress: ${answeredQuestions}/${totalQuestions} questions answered (${progress}%)`);
      return progress;
    }
    
    // Fallback to section-based calculation for non-flow mode
    const totalSections = 6 // Basic info, summary, experience, education, skills, languages
    let completedSections = 0
    
    // Basic info (name, email, location - phone is optional)
    if (cvData.fullName && cvData.contact?.email && cvData.contact?.location) {
      completedSections++
    }
    
    // Summary
    if (cvData.summary && cvData.summary.trim().length > 0) {
      completedSections++
    }
    
    // Experience (either answered or explicitly skipped)
    if (experienceStep !== 'intro' || (cvData.experience && cvData.experience.length > 0)) {
      completedSections++
    }
    
    // Education (either answered or explicitly skipped)
    if (educationAnswered || (cvData.education && cvData.education.length > 0)) {
      completedSections++
    }
    
    // Skills (either answered or explicitly skipped)
    if (cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
      completedSections++
    }
    
    // Languages (optional section - count as completed if answered or if we've moved past it)
    if (languagesCollected || (cvData.languages && Array.isArray(cvData.languages) && cvData.languages.length > 0)) {
      completedSections++
    }
    
    return Math.round((completedSections / totalSections) * 100)
  }


  // Customize Component
  const CustomizeComponent = () => {
    const templates = [
      { id: 'modern', name: 'Modern', description: 'Clean and professional' },
      { id: 'classic', name: 'Classic', description: 'Traditional and formal' },
      { id: 'creative', name: 'Creative', description: 'Unique and artistic' },
      { id: 'minimal', name: 'Minimal', description: 'Simple and clean' }
    ]

    const accentColors = [
      { name: 'Blue', value: '#3B82F6' },
      { name: 'Green', value: '#10B981' },
      { name: 'Purple', value: '#8B5CF6' },
      { name: 'Red', value: '#EF4444' },
      { name: 'Orange', value: '#F59E0B' },
      { name: 'Gray', value: '#6B7280' }
    ]

    const photoPositions = [
      { id: 'none', name: 'No Photo' },
      { id: 'left', name: 'Left' },
      { id: 'right', name: 'Right' },
      { id: 'center', name: 'Center' }
    ]

    return (
      <div className="space-y-6">
        {/* Template Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setCvData(prev => ({ ...prev, template: template.id }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  cvData.template === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent Color</h3>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setCvData(prev => ({ 
                  ...prev, 
                  layout: { ...prev.layout, accentColor: color.value }
                }))}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  cvData.layout?.accentColor === color.value
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Photo Position */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Position</h3>
          <div className="grid grid-cols-2 gap-4">
            {photoPositions.map((position) => (
              <button
                key={position.id}
                onClick={() => setCvData(prev => ({ 
                  ...prev, 
                  layout: { ...prev.layout, photoPosition: position.id as any }
                }))}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  cvData.layout?.photoPosition === position.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-900">{position.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Show Icons Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={cvData.layout?.showIcons || false}
                onChange={(e) => setCvData(prev => ({ 
                  ...prev, 
                  layout: { ...prev.layout, showIcons: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Show section icons</span>
            </label>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Photo</h3>
          <PhotoUploader
            onPhotoUpload={(url) => setCvData(prev => ({ ...prev, photoUrl: url }))}
            updateCvData={(data, source) => setCvData(prev => ({ ...prev, ...data }))}
            cvData={cvData}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Basic CV Builder - Create Professional CVs in Minutes"
        description="Build your professional CV quickly with our AI-powered Basic CV Builder. Guided questions, real-time preview, and instant PDF export. Perfect for job applications."
        keywords={[
          'basic CV builder',
          'fast CV creator',
          'AI CV builder',
          'professional CV maker',
          'CV generator',
          'resume builder quick',
          'guided CV creation',
          'CV templates',
          'PDF CV export',
          'job application CV'
        ]}
        ogTitle="Basic CV Builder - Create Professional CVs in Minutes"
        ogDescription="Build your professional CV quickly with our AI-powered Basic CV Builder. Guided questions, real-time preview, and instant PDF export."
        canonical="/quick-cv"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "LadderFox Basic CV Builder",
          "description": "AI-powered basic CV builder with guided questions and real-time preview",
          "url": "https://ladder-fox-dev.vercel.app/quick-cv",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Free basic CV builder with premium features available"
          },
          "featureList": [
            "Guided CV creation",
            "Real-time preview",
            "PDF export",
            "AI assistance",
            "Professional templates"
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center justify-between sm:justify-start">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Basic CV Builder</h1>
                <div className="flex items-center space-x-2 sm:hidden">
                  <LoadSavedDropdown
                    type="cv"
                    onLoad={handleLoadCV}
                    className="mr-2"
                  />
                  <button
                    onClick={handleSaveCV}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSave className="mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handlePrintCV}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaPrint className="mr-1" />
                    PDF
                  </button>
                </div>
              </div>
            
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {cvData.template || 'modern'} template
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Quick Mode
                  </span>
                </div>
                
                <LoadSavedDropdown
                  type="cv"
                  onLoad={handleLoadCV}
                />
                
                <button
                  onClick={handleSaveCV}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FaSave className="mr-2" />
                  Save CV
                </button>
                <button
                  onClick={handlePrintCV}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <FaPrint className="mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaComments className="mr-2" />
                    <span className="hidden sm:inline">AI Chat</span>
                    <span className="sm:hidden">Chat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'editor'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaEdit className="mr-2" />
                    <span className="hidden sm:inline">Editor</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('customize')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'customize'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaPalette className="mr-2" />
                    <span className="hidden sm:inline">Customize</span>
                    <span className="sm:hidden">Style</span>
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="p-4 sm:p-6 h-[calc(100vh-300px)] overflow-y-auto">
                  {activeTab === 'chat' && (
                    <div className="flex flex-col h-full">
                      <div className="flex-shrink-0 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Quick CV Builder</span>
                            {isFlowLoaded && !useFallback && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Flow Active
                              </span>
                            )}
                            {useFallback && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Fallback Mode
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{calculateProgress()}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${calculateProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ChatInterface
                          messages={isFlowLoaded && !useFallback ? flowMessages : messages}
                          onSendMessage={handleSendMessage}
                          isLoading={isLoading || isFlowLoading}
                          onSkipQuestion={handleSkipQuestion}
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'editor' && (
                    <CVEditor 
                      data={cvData} 
                      onSave={setCvData} 
                      onPrint={() => {}} 
                      isAuthenticated={isAuthenticated} 
                    />
                  )}
                  
                  {activeTab === 'customize' && (
                    <CustomizeComponent />
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - CV Preview */}
            <div className="xl:block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">CV Preview</h3>
                  <div className="flex items-center space-x-3">
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
                      onClick={loadComprehensiveSampleData}
                      title="Fill with comprehensive sample data for testing"
                      className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 touch-manipulation"
                    >
                      <FaUser className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                      <span className="hidden sm:inline">Fill Sample Data</span>
                      <span className="sm:hidden">Sample</span>
                    </button>
                    <button
                      onClick={() => openCVPreview(cvData)}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
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
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
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
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <CVPreviewWithPagination data={cvData} />
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
  )
} 