'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LetterChatInterface from '@/components/LetterChatInterface'
import LetterUploadInterface from '@/components/LetterUploadInterface'
import LetterEditor from '@/components/LetterEditor'
import LetterAnalysis from '@/components/LetterAnalysis'
import LetterPreview from '@/components/LetterPreview'
import LetterVersionHistory from '@/components/LetterVersionHistory'
import CVSelectionModal from '@/components/CVSelectionModal'
import CVTextEditorModal from '@/components/CVTextEditorModal'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/landing/Navbar'
import { LETTER_QUESTIONS } from '@/data/letterQuestions'
import { LetterData, LetterVersion } from '@/types/letter'
import { CVData } from '@/types/cv'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LoadSavedDropdown from '@/components/LoadSavedDropdown'
import { 
  FaComment, FaUpload, FaEdit, FaChartBar, FaEye, 
  FaDownload, FaSave, FaPrint, FaExpand, FaCompress,
  FaTimes, FaMagic, FaUndo, FaRedo, FaCog, FaShieldAlt, FaRocket, FaSpinner, FaInfoCircle, FaFileWord, FaUser
} from 'react-icons/fa'
import SEOHead from '@/components/SEOHead'

// Session storage keys
const LETTER_MESSAGES_STORAGE_KEY = 'letter_builder_messages'
const LETTER_QUESTION_INDEX_STORAGE_KEY = 'letter_builder_question_index'
const LETTER_DATA_STORAGE_KEY = 'letter_builder_data'
const UPLOAD_INFO_STORAGE_KEY = 'letter_builder_upload_info'
const HAS_INITIAL_DRAFT_STORAGE_KEY = 'letter_builder_has_initial_draft'

export default function LetterBuilderPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [lastUserInput, setLastUserInput] = useState<string | null>(null)
  const [processingComplete, setProcessingComplete] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'editor' | 'analysis'>('upload')
  const [isClient, setIsClient] = useState(false)
  
  // Letter data state
  const [letterData, setLetterData] = useState<LetterData>({
    template: 'professional',
    layout: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: '1in',
      alignment: 'left',
      showDate: true,
      showAddress: true,
      showSubject: true,
      letterStyle: 'formal'
    },
    tone: 'professional',
    focus: 'experience',
    length: 'standard',
    currentVersion: 1,
    versions: []
  })

  const [letterZoom, setLetterZoom] = useState(1)
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5]

  const { t, isClient: localeIsClient } = useLocale()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [uploadInfo, setUploadInfo] = useState<{jobFile?: File, companyFile?: File, pastedText?: string}>({})
  const [showDataPermission, setShowDataPermission] = useState(false)
  const [dataPermissionGranted, setDataPermissionGranted] = useState(false)
  const [hasInitialDraft, setHasInitialDraft] = useState(false)
  
  // CV Selection and Editing
  const [showCVSelection, setShowCVSelection] = useState(false)
  const [showCVTextEditor, setShowCVTextEditor] = useState(false)
  const [selectedCVData, setSelectedCVData] = useState<CVData | null>(null)
  const [selectedCVText, setSelectedCVText] = useState<string>('')
  const [hasSelectedCV, setHasSelectedCV] = useState(false)

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved state from session storage (only on client)
  useEffect(() => {
    if (!isClient) return

    const savedMessages = sessionStorage.getItem(LETTER_MESSAGES_STORAGE_KEY)
    const savedQuestionIndex = sessionStorage.getItem(LETTER_QUESTION_INDEX_STORAGE_KEY)
    const savedLetterData = sessionStorage.getItem(LETTER_DATA_STORAGE_KEY)
    const savedUploadInfo = sessionStorage.getItem(UPLOAD_INFO_STORAGE_KEY)
    const savedHasInitialDraft = sessionStorage.getItem(HAS_INITIAL_DRAFT_STORAGE_KEY)
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Initialize with welcome message
      setMessages([{ role: 'assistant', content: t('letter_builder.welcome') }])
    }
    
    if (savedQuestionIndex) {
      setCurrentQuestionIndex(parseInt(savedQuestionIndex))
    }

    if (savedLetterData) {
      setLetterData(JSON.parse(savedLetterData))
    }

    if (savedUploadInfo) {
      setUploadInfo(JSON.parse(savedUploadInfo))
    }

    if (savedHasInitialDraft) {
      setHasInitialDraft(JSON.parse(savedHasInitialDraft))
    }
  }, [isClient, t])

  // Save state to session storage (only on client)
  useEffect(() => {
    if (!isClient) return

    sessionStorage.setItem(LETTER_MESSAGES_STORAGE_KEY, JSON.stringify(messages))
    sessionStorage.setItem(LETTER_QUESTION_INDEX_STORAGE_KEY, currentQuestionIndex.toString())
    sessionStorage.setItem(LETTER_DATA_STORAGE_KEY, JSON.stringify(letterData))
    sessionStorage.setItem(UPLOAD_INFO_STORAGE_KEY, JSON.stringify(uploadInfo))
    sessionStorage.setItem(HAS_INITIAL_DRAFT_STORAGE_KEY, JSON.stringify(hasInitialDraft))
  }, [messages, currentQuestionIndex, letterData, uploadInfo, hasInitialDraft, isClient])

  // Check if we have uploaded content
  const hasUploadedContent = uploadInfo.jobFile || uploadInfo.companyFile || (uploadInfo.pastedText && uploadInfo.pastedText.trim().length > 0)

  const updateLetterData = useCallback((updates: Partial<LetterData>, reason?: string) => {
    setLetterData(prev => ({ ...prev, ...updates }))
    if (reason) {
      // Letter data updated
    }
  }, [])

  // Version tracking functions
  const addVersion = useCallback((versionData: {
    subject?: string
    opening?: string
    body?: string[]
    closing?: string
    editRequest?: string
    explanation?: string
    isInitialDraft?: boolean
  }) => {
    setLetterData(prev => {
      const newVersion = prev.currentVersion! + 1
      const version: LetterVersion = {
        version: newVersion,
        timestamp: new Date(),
        ...versionData
      }
      
      return {
        ...prev,
        currentVersion: newVersion,
        versions: [...(prev.versions || []), version]
      }
    })
  }, [])

  const revertToVersion = useCallback((versionNumber: number) => {
    setLetterData(prev => {
      const targetVersion = prev.versions?.find(v => v.version === versionNumber)
      if (!targetVersion) return prev

      return {
        ...prev,
        subject: targetVersion.subject,
        opening: targetVersion.opening,
        body: targetVersion.body,
        closing: targetVersion.closing,
        currentVersion: versionNumber
      }
    })
    toast.success(`Reverted to version ${versionNumber}`)
  }, [])

  // New function to generate initial draft from uploaded content
  const handleGenerateInitialDraft = async () => {
    if (!hasUploadedContent) {
      toast.error('Please upload job description or company information first')
      return
    }

    try {
      setIsLoading(true)
      
      // Call AI to generate initial letter content from uploaded information
      const response = await fetch('/api/letter-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterData,
          uploadInfo,
          cvText: selectedCVText, // Include CV text if available
          cvData: selectedCVData, // Include CV data if available
          isInitialDraft: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate initial draft')
      }

      const result = await response.json()
      
             // Update letter data with generated content
       updateLetterData({
         opening: result.opening,
         body: result.body,
         closing: result.closing,
         subject: result.subject
       }, 'Initial AI generation')

       // Add version tracking
       addVersion({
         subject: result.subject,
         opening: result.opening,
         body: result.body,
         closing: result.closing,
         isInitialDraft: true,
         explanation: 'Initial draft generated from uploaded information'
       })

      // Add success message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'ve generated an initial draft based on your uploaded information. You can now use the chat to refine and improve it!' 
      }])

      setHasInitialDraft(true)
      setActiveTab('chat')
      toast.success('Initial draft generated! Use the chat to refine it.')
    } catch (error) {
      console.error('Error generating initial draft:', error)
      toast.error('Failed to generate initial draft')
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced chat message handling for editing-focused interactions
  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true)
      setLastUserInput(message)

      // Add user message to chat
      setMessages(prev => [...prev, { role: 'user', content: message }])

      // If we have an initial draft, treat this as an editing request
      if (hasInitialDraft) {
        await handleEditingRequest(message)
      } else {
        // Fall back to original question flow
        const currentQuestion = LETTER_QUESTIONS[currentQuestionIndex]
        if (!currentQuestion) {
          console.error('No question found for index:', currentQuestionIndex)
          return
        }
        await processCurrentQuestion(currentQuestion, message)
      }

    } catch (error) {
      console.error('Error processing message:', error)
      toast.error(t('letter_builder.messages.processing_error'))
    } finally {
      setIsLoading(false)
    }
  }

  // New function to handle editing requests
  const handleEditingRequest = async (message: string) => {
    try {
      // Call AI to process editing request
      const response = await fetch('/api/letter-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterData,
          uploadInfo,
          cvText: selectedCVText, // Include CV text if available
          cvData: selectedCVData, // Include CV data if available
          editRequest: message
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process editing request')
      }

      const result = await response.json()
      
             // Update letter data with edited content
       updateLetterData({
         opening: result.opening,
         body: result.body,
         closing: result.closing,
         subject: result.subject
       }, 'AI editing')

       // Add version tracking
       addVersion({
         subject: result.subject,
         opening: result.opening,
         body: result.body,
         closing: result.closing,
         editRequest: message,
         explanation: result.explanation
       })

      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.explanation || 'I\'ve updated your letter based on your request. How does it look?' 
      }])

    } catch (error) {
      console.error('Error processing editing request:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m sorry, I couldn\'t process that editing request. Could you try rephrasing it?' 
      }])
    }
  }

  const processCurrentQuestion = async (question: any, message: string) => {
    try {
      // Extract and update letter data based on the question
      extractAndUpdateLetterData(question.id, message)

      // Add assistant response
      let assistantResponse = ''
      
      switch (question.id) {
        case 'welcome':
          assistantResponse = t('letter_builder.new_flow.welcome')
          break
        case 'job_description':
          assistantResponse = t('letter_builder.new_flow.job_description')
          break
        case 'analyze_job':
          assistantResponse = t('letter_builder.new_flow.analyze_job')
          break
        case 'optimization_areas':
          assistantResponse = t('letter_builder.new_flow.optimization_areas')
          break
        case 'personal_info':
          assistantResponse = t('letter_builder.new_flow.personal_info')
          break
        case 'sender_name':
          assistantResponse = t('letter_builder.new_flow.sender_name')
          break
        case 'sender_title':
          assistantResponse = t('letter_builder.new_flow.sender_title')
          break
        case 'sender_email':
          assistantResponse = t('letter_builder.new_flow.sender_email')
          break
        case 'sender_phone':
          assistantResponse = t('letter_builder.new_flow.sender_phone')
          break
        case 'tone_preference':
          assistantResponse = t('letter_builder.new_flow.tone_preference')
          break
        case 'letter_length':
          assistantResponse = t('letter_builder.new_flow.letter_length')
          break
        case 'generate_letter':
          assistantResponse = t('letter_builder.new_flow.generate_letter')
          break
        default:
          assistantResponse = t('letter_builder.questions.default')
      }

      // Add assistant response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }])

      // Move to next question
      if (currentQuestionIndex < LETTER_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setProcessingComplete(true)
      }

    } catch (error) {
      console.error('Error processing question:', error)
      toast.error(t('letter_builder.messages.response_error'))
    }
  }

    const extractAndUpdateLetterData = (questionId: string, message: string) => {
    switch (questionId) {
      case 'job_description':
        updateLetterData({ jobDescription: message }, 'job description')
        break
      case 'analyze_job':
        // This will be handled by the AI analysis
        break
      case 'optimization_areas':
        // This will be used to guide the AI generation
        updateLetterData({ focus: message.toLowerCase() as any }, 'optimization areas')
        break
      case 'sender_name':
        updateLetterData({ senderName: message }, 'sender name')
        break
      case 'sender_title':
        updateLetterData({ senderTitle: message }, 'sender title')
        break
      case 'sender_email':
        updateLetterData({ senderEmail: message }, 'sender email')
        break
      case 'sender_phone':
        updateLetterData({ senderPhone: message }, 'sender phone')
        break
      case 'tone_preference':
        updateLetterData({ tone: message.toLowerCase() as any }, 'tone preference')
        break
      case 'letter_length':
        updateLetterData({ length: message.toLowerCase() as any }, 'letter length')
        break
    }
  }

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < LETTER_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      const nextQuestion = LETTER_QUESTIONS[currentQuestionIndex + 1]
      setMessages(prev => [...prev, { role: 'assistant', content: t(nextQuestion.textKey) }])
    }
  }

  const handleGenerateLetter = async () => {
    try {
      setIsLoading(true)
      
      // Prepare request body with CV data if available
      const requestBody: any = {
        letterData,
        uploadInfo
      }

      // Add CV data if selected
      if (hasSelectedCV && selectedCVText) {
        requestBody.cvText = selectedCVText
        requestBody.cvData = selectedCVData
      }
      
      // Call AI to generate letter content
      const response = await fetch('/api/letter-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Failed to generate letter')
      }

      const result = await response.json()
      
      // Update letter data with generated content
      updateLetterData({
        opening: result.opening,
        body: result.body,
        closing: result.closing,
        subject: result.subject
      }, 'AI generation')

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('letter_builder.messages.generation_success')
      }])

      toast.success(t('letter_builder.messages.letter_generated'))
    } catch (error) {
      console.error('Error generating letter:', error)
      toast.error(t('letter_builder.messages.generation_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditLetter = () => {
    setActiveTab('editor')
  }

  const handleSaveLetter = async () => {
    if (!isAuthenticated) {
      toast.error(t('letter_builder.messages.login_required'))
      router.push('/auth/login?next=/letter')
      return
    }

    try {
      const response = await fetch('/api/letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: letterData.companyName || letterData.recipientName || 'My Letter',
          content: letterData,
          template: letterData.template || 'professional',
          cvText: selectedCVText // Include CV text if available
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save letter')
      }

      toast.success(t('letter_builder.messages.letter_saved'))
    } catch (error) {
      console.error('Error saving letter:', error)
      toast.error(t('letter_builder.messages.save_error'))
    }
  }

  const handlePrintLetter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to download your letter');
      router.push('/auth/login?next=/letter');
      return;
    }
    setShowPdfPreview(true);
  };

  const handleLoadLetter = async (item: { id: string; title: string; type: string }) => {
    try {
      const response = await fetch(`/api/letter/${item.id}`);
      if (response.ok) {
        const data = await response.json();
        const letter = data.letter;
        
        // Load letter data
        setLetterData(letter.content);
        
        // Load chat history if available
        if (letter.chatHistory) {
          setMessages(letter.chatHistory.messages || []);
          setCurrentQuestionIndex(letter.chatHistory.questionIndex || 0);
        }
        
        toast.success('Letter loaded successfully!');
      } else {
        throw new Error('Failed to load letter');
      }
    } catch (error) {
      console.error('Error loading letter:', error);
      toast.error('Failed to load letter. Please try again.');
    }
  };

  const handleDataPermission = () => {
    setDataPermissionGranted(true)
    setShowDataPermission(false)
    toast.success(t('letter_builder.messages.permission_granted'))
  }

  // CV Selection and Editing Functions
  const handleCVSelect = (cvData: CVData, cvText: string) => {
    setSelectedCVData(cvData)
    setSelectedCVText(cvText)
    setLetterData(prev => ({
      ...prev,
      cvText: cvText
    }))
    setHasSelectedCV(true)
    setShowCVTextEditor(true)
  }

  const handleCVEdit = (cvData: CVData) => {
    setSelectedCVData(cvData)
    // Convert CV data to text for editing
    fetch('/api/cv-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cvData: cvData
      }),
    })
    .then(response => response.json())
    .then(data => {
      setSelectedCVText(data.cvText)
      setShowCVTextEditor(true)
    })
    .catch(error => {
      console.error('Error converting CV to text:', error)
      toast.error('Failed to load CV for editing')
    })
  }

  const handleCVTextSave = (editedText: string) => {
    setSelectedCVText(editedText)
    setLetterData(prev => ({
      ...prev,
      cvText: editedText
    }))
    setShowCVTextEditor(false)
    toast.success('CV text updated and ready for letter generation')
  }

  const handleStartLetterGeneration = () => {
    if (!hasSelectedCV) {
      setShowCVSelection(true)
      return
    }
    
    // Proceed with letter generation using selected CV
    setActiveTab('chat')
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `Great! I'll use your CV information to generate a personalized motivational letter. Let's start by gathering some details about the position you're applying for.` 
    }])
  }

  // Download functions
  const handleDownloadPDF = async () => {
    if (!isAuthenticated) {
      toast.error(t('letter_builder.messages.download_required'))
      router.push('/auth/login?next=/letter')
      return
    }

    try {
      setIsLoading(true)
      
      // Call API to generate PDF
      const response = await fetch('/api/letter-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterData,
          format: 'pdf'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `motivation-letter-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download PDF')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadWord = async () => {
    if (!isAuthenticated) {
      toast.error(t('letter_builder.messages.download_required'))
      router.push('/auth/login?next=/letter')
      return
    }

    try {
      setIsLoading(true)
      
      // Call API to generate Word document
      const response = await fetch('/api/letter-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterData,
          format: 'docx'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate Word document')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `motivation-letter-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Word document downloaded successfully!')
    } catch (error) {
      console.error('Error downloading Word document:', error)
      toast.error('Failed to download Word document')
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until client-side hydration is complete
  if (!isClient || !localeIsClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-10 px-4 pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-200 rounded-full animate-pulse mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('letter_builder.loading')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Motivation Letter Builder - Create Professional Cover Letters"
        description="Build compelling motivation letters and cover letters with our AI-powered letter builder. Professional templates, guided writing, and instant PDF export. Perfect for job applications."
        keywords={[
          'motivation letter builder',
          'cover letter creator',
          'AI letter writer',
          'professional cover letter',
          'job application letter',
          'motivation letter templates',
          'cover letter generator',
          'letter writing assistant',
          'PDF letter export',
          'job application writing'
        ]}
        ogTitle="Motivation Letter Builder - Create Professional Cover Letters"
        ogDescription="Build compelling motivation letters and cover letters with our AI-powered letter builder. Professional templates, guided writing, and instant PDF export."
        canonical="/letter"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "LadderFox Motivation Letter Builder",
          "description": "AI-powered motivation letter and cover letter builder with professional templates",
          "url": "https://ladder-fox-dev.vercel.app/letter",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Free motivation letter builder with premium features available"
          },
          "featureList": [
            "Guided letter writing",
            "Professional templates",
            "Real-time preview",
            "PDF export",
            "AI writing assistance",
            "Cover letter analysis"
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center justify-between sm:justify-start">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Motivation Letter Builder</h1>
                <div className="flex items-center space-x-2 sm:hidden">
                  <LoadSavedDropdown
                    type="letter"
                    onLoad={handleLoadLetter}
                    className="mr-2"
                  />
                  <button
                    onClick={handleSaveLetter}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSave className="mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handlePrintLetter}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaPrint className="mr-1" />
                    PDF
                  </button>
                </div>
              </div>
              
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {letterData.template || 'professional'} {t('letter_builder.template_badge')}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {t('letter_builder.ai_powered')}
                  </span>
                </div>
                
                <button
                  onClick={() => setShowDataPermission(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaShieldAlt className="mr-2" />
                  {t('letter_builder.data_permission')}
                </button>

                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
                  <button
                    onClick={() => setLetterZoom(Math.max(0.5, letterZoom - 0.25))}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    disabled={letterZoom <= 0.5}
                  >
                    <FaCompress className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                    {Math.round(letterZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setLetterZoom(Math.min(2, letterZoom + 0.25))}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    disabled={letterZoom >= 2}
                  >
                    <FaExpand className="w-4 h-4" />
                  </button>
                </div>
                
                <LoadSavedDropdown
                  type="letter"
                  onLoad={handleLoadLetter}
                />
                
                <button
                  onClick={handleSaveLetter}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <FaSave className="mr-2" />
                  {t('letter_builder.save_letter')}
                </button>
                <button
                  onClick={handlePrintLetter}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <FaPrint className="mr-2" />
                  {t('letter_builder.download_pdf')}
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
                  {[
                    { id: 'upload', label: t('letter_builder.tabs.upload'), icon: FaUpload },
                    { id: 'chat', label: t('letter_builder.tabs.chat'), icon: FaComment },
                    { id: 'editor', label: t('letter_builder.tabs.editor'), icon: FaEdit },
                    { id: 'analysis', label: t('letter_builder.tabs.analysis'), icon: FaChartBar }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center px-1 py-2 text-xs font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="mr-1 text-xs" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'chat' && (
                    <LetterChatInterface
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                      onSkipQuestion={handleSkipQuestion}
                      onGenerateLetter={handleGenerateLetter}
                      onEditLetter={handleEditLetter}
                      currentQuestionIndex={currentQuestionIndex}
                      hasInitialDraft={hasInitialDraft}
                    />
                  )}
                  
                                     {activeTab === 'upload' && (
                     <div className="space-y-4">
                       {/* CV Selection Section */}
                       <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                         <div className="flex items-start">
                           <FaUser className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                           <div className="flex-1">
                             <h4 className="font-medium text-green-800 mb-2">{t('letter_builder.cv_section.title')}</h4>
                             <p className="text-sm text-green-700 mb-3">
                               {t('letter_builder.cv_section.description')}
                             </p>
                             {hasSelectedCV ? (
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-2">
                                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                     {t('letter_builder.cv_section.cv_selected')}
                                   </span>
                                   <span className="text-sm text-green-700">
                                     {selectedCVData?.fullName || selectedCVData?.title || 'Your CV'}
                                   </span>
                                 </div>
                                 <button
                                   onClick={() => setShowCVTextEditor(true)}
                                   className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                 >
                                   <FaEdit className="mr-1" />
                                   {t('letter_builder.cv_section.edit_cv_text')}
                                 </button>
                               </div>
                             ) : (
                               <button
                                 onClick={() => setShowCVSelection(true)}
                                 className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                               >
                                 <FaUser className="mr-2" />
                                 {t('letter_builder.cv_section.select_cv')}
                               </button>
                             )}
                           </div>
                         </div>
                       </div>

                       {/* Upload Tips */}
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                         <div className="flex items-start">
                           <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                           <div className="text-sm text-blue-800">
                             <p className="font-medium mb-1">💡 Upload Tips:</p>
                             <ul className="space-y-1 text-xs">
                               <li>• Upload the job description to help AI understand requirements</li>
                               <li>• Add company information for better personalization</li>
                               <li>• Include specific achievements or skills you want to highlight</li>
                               <li>• Mention any special requirements or preferences</li>
                             </ul>
                           </div>
                         </div>
                       </div>

                       <LetterUploadInterface
                         uploadInfo={uploadInfo}
                         onUploadInfoChange={setUploadInfo}
                       />
                       
                       {/* Generate Initial Draft Button */}
                       {(hasUploadedContent || hasSelectedCV) && (
                         <div className="border-t border-gray-200 pt-4">
                           <div className="text-center">
                             <p className="text-sm text-gray-600 mb-3">
                               Ready to generate your initial draft?
                             </p>
                             <button
                               onClick={handleGenerateInitialDraft}
                               disabled={isLoading}
                               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               {isLoading ? (
                                 <>
                                   <FaSpinner className="animate-spin mr-2" />
                                   Generating Draft...
                                 </>
                               ) : (
                                 <>
                                   <FaRocket className="mr-2" />
                                   Generate Initial Draft
                                 </>
                               )}
                             </button>
                             <p className="text-xs text-gray-500 mt-2">
                               AI will create a personalized letter based on your uploaded information
                               {hasSelectedCV && ' and CV data'}
                             </p>
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                  
                  {activeTab === 'editor' && (
                    <LetterEditor
                      letterData={letterData}
                      onLetterDataChange={updateLetterData}
                    />
                  )}
                  
                                     {activeTab === 'analysis' && (
                     <div className="space-y-6">
                       <LetterAnalysis
                         letterData={letterData}
                         onAnalysisComplete={(analysis) => {
                           // Analysis complete
                         }}
                       />
                       
                       <div className="border-t border-gray-200 pt-6">
                         <LetterVersionHistory
                           versions={letterData.versions || []}
                           currentVersion={letterData.currentVersion || 1}
                           onVersionSelect={(version) => {
                             // Preview version (could be implemented later)
                           }}
                           onRevertToVersion={revertToVersion}
                         />
                       </div>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Right Panel - Letter Preview */}
            <div className="xl:block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Letter Preview</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPdfPreview(true)}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
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
                      transform: `scale(${letterZoom})`, 
                      transformOrigin: 'top center',
                      maxWidth: '100%'
                    }}
                  >
                                      <LetterPreview data={letterData} />
                </div>
              </div>
              
              {/* Mobile Zoom Controls */}
              <div className="mt-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <button
                  onClick={() => setLetterZoom(Math.max(0.5, letterZoom - 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors touch-manipulation"
                  disabled={letterZoom <= 0.5}
                >
                  <FaCompress className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                  {Math.round(letterZoom * 100)}%
                </span>
                <button
                  onClick={() => setLetterZoom(Math.min(2, letterZoom + 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors touch-manipulation"
                  disabled={letterZoom >= 2}
                >
                  <FaExpand className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* PDF Preview Modal */}
        {showPdfPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-8">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[calc(100vh-2rem)] overflow-hidden">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Letter Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaDownload className="mr-2" />
                    {isLoading ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFileWord className="mr-2" />
                    {isLoading ? 'Generating...' : 'Download Word'}
                  </button>
                  <button
                    onClick={() => setShowPdfPreview(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
                <div className="p-4 sm:p-6">
                  <LetterPreview data={letterData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Permission Modal */}
        {showDataPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-blue-600 text-xl sm:text-2xl mr-3" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{t('letter_builder.modals.data_permission.title')}</h3>
              </div>
              
              <div className="space-y-4 text-gray-700 text-sm sm:text-base">
                <p>
                  {t('letter_builder.modals.data_permission.description')}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{t('letter_builder.modals.data_permission.bullet1')}</li>
                  <li>{t('letter_builder.modals.data_permission.bullet2')}</li>
                  <li>{t('letter_builder.modals.data_permission.bullet3')}</li>
                  <li>{t('letter_builder.modals.data_permission.bullet4')}</li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('letter_builder.modals.data_permission.privacy')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={handleDataPermission}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('letter_builder.modals.data_permission.grant')}
                </button>
                <button
                  onClick={() => setShowDataPermission(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('letter_builder.modals.data_permission.not_now')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CV Selection Modal */}
        <CVSelectionModal
          isOpen={showCVSelection}
          onClose={() => setShowCVSelection(false)}
          onCVSelect={handleCVSelect}
          onEditCV={handleCVEdit}
        />

        {/* CV Text Editor Modal */}
        {selectedCVData && (
          <CVTextEditorModal
            isOpen={showCVTextEditor}
            onClose={() => setShowCVTextEditor(false)}
            cvData={selectedCVData}
            cvText={selectedCVText}
            onSave={handleCVTextSave}
          />
        )}
      </div>
    </>
  )
} 