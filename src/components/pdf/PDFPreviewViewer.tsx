'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { pdf } from '@react-pdf/renderer'
import { CVDocumentPDF, CVTemplate, TEMPLATE_INFO } from './CVDocumentPDF'
import { CVData } from '@/types/cv'
import {
  FiChevronLeft, FiChevronRight, FiDownload, FiZoomIn, FiZoomOut,
  FiLayout, FiDroplet, FiCheck, FiEye, FiFileText, FiLock
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebouncedCallback } from 'use-debounce'
import dynamic from 'next/dynamic'
import { cropImageForPDF } from '@/utils/imageCropper'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

// Import react-pdf for rendering PDF on mobile (mobile browsers can't render embedded PDFs via iframe)
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker for react-pdf
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

// Detect mobile device
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(navigator.userAgent)
}

// Helper function to create a stable data signature for comparison
const getDataSignature = (data: CVData): string => {
  try {
    // Include actual content, not just lengths, to detect all changes
    return JSON.stringify({
      fullName: data.fullName,
      title: data.title,
      professionalHeadline: data.professionalHeadline,
      template: data.template,
      photoUrl: data.photoUrl,
      summary: data.summary,
      // Include actual experience content, not just length
      experience: data.experience?.map(exp => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        dates: exp.dates,
        content: exp.content,
        achievements: exp.achievements
      })) || [],
      // Include actual education content, not just length
      education: data.education?.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        field: edu.field,
        dates: edu.dates,
        content: edu.content,
        achievements: edu.achievements
      })) || [],
      // Include actual skills content
      skills: data.skills,
      technicalSkills: data.technicalSkills,
      languages: data.languages,
      hobbies: data.hobbies,
      contact: data.contact,
      social: data.social,
      layout: data.layout
    });
  } catch {
    return '';
  }
};

// Template options for the picker - now includes both style and ATS layout templates
const TEMPLATES: { id: CVTemplate; name: string; description: string; color: string; category: 'style' | 'ats-layout'; atsScore: number }[] = [
  // ATS-Optimized Layout Templates (shown first)
  { id: 'classic-chronological', name: 'Classic ATS', description: 'Most ATS-friendly', color: '#1e40af', category: 'ats-layout', atsScore: 100 },
  { id: 'skills-forward', name: 'Skills Forward', description: 'Skills at top', color: '#7c3aed', category: 'ats-layout', atsScore: 95 },
  { id: 'executive-leader', name: 'Executive Leader', description: 'Senior roles', color: '#18181b', category: 'ats-layout', atsScore: 95 },
  { id: 'ats-simple', name: 'ATS Simple', description: 'Plain & parseable', color: '#374151', category: 'ats-layout', atsScore: 100 },
  { id: 'modern-minimalist', name: 'Modern Minimal', description: 'Subtle two-column', color: '#0f766e', category: 'ats-layout', atsScore: 88 },
  { id: 'compact-professional', name: 'Compact Pro', description: 'Dense layout', color: '#0369a1', category: 'ats-layout', atsScore: 92 },
  // Style Templates (sidebar layouts)
  { id: 'modern', name: 'Modern', description: 'Clean & contemporary', color: '#2563eb', category: 'style', atsScore: 85 },
  { id: 'executive', name: 'Executive', description: 'Sophisticated & elegant', color: '#18181b', category: 'style', atsScore: 85 },
  { id: 'creative', name: 'Creative', description: 'Bold & expressive', color: '#7c3aed', category: 'style', atsScore: 80 },
  { id: 'minimal', name: 'Minimal', description: 'Simple & timeless', color: '#374151', category: 'style', atsScore: 90 },
  { id: 'professional', name: 'Professional', description: 'Corporate & polished', color: '#0369a1', category: 'style', atsScore: 88 },
  { id: 'tech', name: 'Tech', description: 'Modern developer style', color: '#059669', category: 'style', atsScore: 85 },
]

// Color palette options
const COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#18181b' },
]

interface PDFPreviewViewerProps {
  data: CVData
  onDataChange?: (data: CVData) => void
  onDownload?: () => void
  className?: string
  showControls?: boolean
  externalZoom?: number
}

// PDF Preview Viewer with template/color pickers
export const PDFPreviewViewer: React.FC<PDFPreviewViewerProps> = ({
  data,
  onDataChange,
  onDownload,
  className = '',
  showControls = true,
  externalZoom,
}) => {
  const router = useRouter()
  const { hasFeature, loading: subscriptionLoading } = useSubscription()
  const canDownloadPDF = hasFeature('pdf_export')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [internalZoom, setInternalZoom] = useState(0.75)
  const zoom = externalZoom !== undefined ? externalZoom : internalZoom
  const setZoom = setInternalZoom
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [processedPhotoUrl, setProcessedPhotoUrl] = useState<string | null>(null)
  
  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])
  
  const currentTemplate = (data.template as CVTemplate) || 'modern'
  const currentColor = data.layout?.accentColor || '#2563eb'

  // Create stable data signature to prevent unnecessary re-renders
  const dataSignature = useMemo(() => getDataSignature(data), [data])
  const previousSignatureRef = useRef<string>('')

  // Process photo with cropping for PDF compatibility
  useEffect(() => {
    const processPhoto = async () => {
      if (data.photoUrl && data.layout?.photoPosition !== 'none') {
        try {
          // Determine size based on position and custom size
          const isCenter = data.layout?.photoPosition === 'center'
          const defaultSize = isCenter ? 80 : 60
          const size = data.layout?.photoSize ?? defaultSize
          
          // Get positioning values (default to center if not set)
          const posX = data.layout?.photoPositionX ?? 50
          const posY = data.layout?.photoPositionY ?? 50
          const shape = data.layout?.photoShape ?? 'circle'
          const borderWidth = data.layout?.photoBorderWidth ?? 0
          const borderColor = data.layout?.photoBorderColor ?? '#3b82f6'
          
          console.log('[Photo Processing] Cropping photo:', {
            displaySize: size,
            canvasSize: size * 3, // 3x for high quality
            posX,
            posY,
            shape,
            borderWidth,
            borderColor,
            position: data.layout?.photoPosition
          })
          
          // NEW: Function returns object { dataUrl, width, height }
          const result = await cropImageForPDF(
            data.photoUrl,
            size,
            size,
            posX,
            posY,
            shape,
            borderWidth,
            borderColor
          )
          
          // Extract dataUrl from result
          setProcessedPhotoUrl(result.dataUrl)
          
          console.log('[Photo Processing] Success:', {
            originalSize: size,
            canvasSize: size * 3,
            resultDisplaySize: result.width,
          })
        } catch (error) {
          console.error('[Photo Processing] Failed to process photo:', error)
          // Fallback to original photo
          setProcessedPhotoUrl(data.photoUrl)
        }
      } else {
        setProcessedPhotoUrl(null)
      }
    }

    processPhoto()
  }, [
    data.photoUrl, 
    data.layout?.photoPosition, 
    data.layout?.photoPositionX, 
    data.layout?.photoPositionY, 
    data.layout?.photoShape,
    data.layout?.photoSize,
    data.layout?.photoBorderWidth,
    data.layout?.photoBorderColor
  ])

  // Debounced PDF generation to avoid excessive re-renders
  // Reduced debounce to 300ms for faster updates after chat interactions
  const generatePDF = useDebouncedCallback(async () => {
    if (!data || !data.fullName) {
      setPdfUrl(null)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Pass processed photo URL to PDF component
      const blob = await pdf(<CVDocumentPDF data={data} processedPhotoUrl={processedPhotoUrl} />).toBlob()
      const url = URL.createObjectURL(blob)
      
      // Clean up previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
      
      setPdfUrl(url)
      
      // For now, we'll estimate pages based on content
      // In a real implementation, you'd parse the PDF to get exact page count
      const estimatedPages = estimatePageCount(data)
      setTotalPages(estimatedPages)
      setCurrentPage(1)
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('Failed to generate PDF preview')
    } finally {
      setIsGenerating(false)
    }
  }, 300)

  // Regenerate PDF only when data signature actually changes OR when processed photo changes
  useEffect(() => {
    // Skip if data signature hasn't changed
    if (previousSignatureRef.current === dataSignature) {
      return
    }
    
    // Update the ref
    previousSignatureRef.current = dataSignature
    
    // Generate PDF only if data actually changed
    generatePDF()
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [dataSignature, processedPhotoUrl, generatePDF, pdfUrl])

  // Estimate page count based on content
  const estimatePageCount = (cvData: CVData): number => {
    let contentLength = 0
    
    if (cvData.summary) contentLength += cvData.summary.length
    if (cvData.experience) {
      cvData.experience.forEach(exp => {
        contentLength += 200 // Base for each experience
        if (exp.achievements) contentLength += exp.achievements.join(' ').length
        if (exp.content) contentLength += exp.content.join(' ').length
      })
    }
    if (cvData.education) contentLength += cvData.education.length * 150
    if (cvData.projects && Array.isArray(cvData.projects)) contentLength += cvData.projects.length * 150
    
    // Rough estimate: ~3000 characters per page
    return Math.max(1, Math.ceil(contentLength / 3000))
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2, prev + 0.25))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.25))
  }

  const handleDownload = useCallback(async () => {
    if (!data) return
    
    // Check subscription before allowing download
    if (!canDownloadPDF) {
      toast.error('PDF download is a premium feature. Please upgrade to download your CV.')
      router.push('/pricing')
      return
    }
    
    setIsDownloading(true)
    
    try {
      // Use the processed photo URL for download
      const blob = await pdf(<CVDocumentPDF data={data} processedPhotoUrl={processedPhotoUrl} />).toBlob()
      const url = URL.createObjectURL(blob)
      const fileName = `${data.fullName?.replace(/\s+/g, '_') || 'CV'}_Resume.pdf`
      
      // For mobile, try to open in new tab first (better UX)
      if (isMobile) {
        // Create a download link that works on mobile
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        
        // Try to trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Keep URL alive for a moment on mobile to allow download to start
        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 5000)
      } else {
        // Desktop download
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      
      if (onDownload) onDownload()
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setIsDownloading(false)
    }
  }, [data, onDownload, isMobile, canDownloadPDF, router, processedPhotoUrl])

  // Handle template change
  const handleTemplateChange = (templateId: CVTemplate) => {
    if (onDataChange) {
      const template = TEMPLATES.find(t => t.id === templateId)
      onDataChange({
        ...data,
        template: templateId,
        layout: {
          ...data.layout,
          accentColor: template?.color || currentColor,
        },
      })
    }
    setShowTemplatePicker(false)
  }

  // Handle color change
  const handleColorChange = (color: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        layout: {
          ...data.layout,
          accentColor: color,
        },
      })
    }
    setShowColorPicker(false)
  }

  // Empty state
  if (!data || !data.fullName) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-100 dark:bg-[#1a1a1a] rounded-xl ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start typing to build your CV
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Your document will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-gray-100 dark:bg-[#0d0d0d] rounded-xl overflow-hidden ${className}`} style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Controls */}
      {showControls && (
        <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/5">
          {/* Main toolbar */}
          <div className="flex items-center justify-between px-4 py-2">
            {/* Template & Color Pickers */}
            <div className="flex items-center gap-2">
              {/* Template picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowTemplatePicker(!showTemplatePicker); setShowColorPicker(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                >
                  <FiLayout size={14} className="text-gray-700 dark:text-gray-300" />
                  <span className="hidden sm:inline capitalize">{currentTemplate}</span>
                </button>
                
                {/* Template dropdown */}
                <AnimatePresence>
                  {showTemplatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2 border-b border-gray-100 dark:border-white/5">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Templates</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {/* ATS-Optimized Section */}
                        <div className="p-2 pb-0">
                          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">ATS-Optimized Layouts</span>
                          </div>
                          {TEMPLATES.filter(t => t.category === 'ats-layout').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateChange(template.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                currentTemplate === template.id 
                                  ? 'bg-blue-50 dark:bg-blue-500/10' 
                                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
                              }`}
                            >
                              <div 
                                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: template.color }}
                              />
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{template.description}</div>
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                template.atsScore >= 95 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {template.atsScore}%
                              </span>
                              {currentTemplate === template.id && (
                                <FiCheck size={14} className="text-blue-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                        
                        {/* Style Templates Section */}
                        <div className="p-2 pt-1">
                          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1 mt-1 border-t border-gray-100 dark:border-white/5">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Styled Layouts</span>
                          </div>
                          {TEMPLATES.filter(t => t.category === 'style').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateChange(template.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                currentTemplate === template.id 
                                  ? 'bg-blue-50 dark:bg-blue-500/10' 
                                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
                              }`}
                            >
                              <div 
                                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: template.color }}
                              />
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{template.description}</div>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                {template.atsScore}%
                              </span>
                              {currentTemplate === template.id && (
                                <FiCheck size={14} className="text-blue-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Color picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowColorPicker(!showColorPicker); setShowTemplatePicker(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20"
                    style={{ backgroundColor: currentColor }}
                  />
                  <FiDroplet size={14} className="hidden sm:block text-gray-700 dark:text-gray-300" />
                </button>
                
                {/* Color dropdown */}
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2 border-b border-gray-100 dark:border-white/5">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Accent Color</span>
                      </div>
                      <div className="p-3 grid grid-cols-5 gap-2">
                        {COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleColorChange(color.value)}
                            className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                              currentColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#1a1a1a]' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Zoom controls - hidden on mobile */}
            <div className={`items-center gap-1 ${isMobile ? 'hidden' : 'flex'}`}>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
              >
                <FiZoomOut size={16} />
              </button>
              <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[50px] text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
              >
                <FiZoomIn size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Page navigation - hidden on mobile */}
              {totalPages > 1 && !isMobile && (
                <div className="flex items-center gap-1 mr-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[40px] text-center font-medium">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              )}
              
              <button
                onClick={handleDownload}
                disabled={isDownloading || subscriptionLoading || !canDownloadPDF}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-70 ${
                  canDownloadPDF 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                    : 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                }`}
                title={!canDownloadPDF ? 'Upgrade to download PDF' : 'Download PDF'}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Preparing...</span>
                  </>
                ) : !canDownloadPDF ? (
                  <>
                    <FiLock size={14} />
                    <span className="hidden sm:inline">Upgrade to Download</span>
                  </>
                ) : (
                  <>
                    <FiDownload size={14} />
                    <span className="hidden sm:inline">Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Area */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          {isGenerating && !isMobile ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating preview...</p>
            </motion.div>
          ) : error && !isMobile ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => generatePDF()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </motion.div>
          ) : isMobile && pdfUrl ? (
            /* Mobile: Render PDF using react-pdf (same design as desktop) */
            <motion.div
              key="mobile-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full pb-20"
            >
              {/* PDF Preview using react-pdf - renders actual PDF pages as canvas */}
              <div className="relative bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: '100%', width: 'fit-content' }}>
                <Document
                  file={pdfUrl}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                  error={
                    <div className="p-8 text-center text-gray-500">
                      <p>Could not load preview</p>
                    </div>
                  }
                  onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
                >
                  <Page
                    pageNumber={1}
                    width={Math.min(window.innerWidth - 32, 400)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>

                {/* Upgrade overlay for free users */}
                {!canDownloadPDF && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20 rounded-b-lg">
                    <div className="text-center text-white">
                      <FiLock size={24} className="mx-auto mb-2" />
                      <p className="font-medium mb-1">Preview Only</p>
                      <p className="text-sm text-white/80">Upgrade to download your CV</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile download/upgrade section */}
              <div className="mt-4 px-4 pb-4" style={{ maxWidth: '100%', width: '100%' }}>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || subscriptionLoading}
                  className={`w-full flex items-center justify-center gap-2 py-4 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-70 ${
                    canDownloadPDF
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Preparing PDF...</span>
                    </>
                  ) : !canDownloadPDF ? (
                    <>
                      <FiLock size={20} />
                      <span>Upgrade to Download PDF</span>
                    </>
                  ) : (
                    <>
                      <FiDownload size={20} />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {canDownloadPDF
                    ? 'Your CV will be downloaded as a professional PDF'
                    : 'Upgrade to a premium plan to download your CV as PDF'
                  }
                </p>
              </div>
            </motion.div>
          ) : isMobile && isGenerating ? (
            /* Mobile loading state */
            <motion.div
              key="mobile-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating preview...</p>
            </motion.div>
          ) : pdfUrl ? (
            /* Desktop: Show PDF iframe */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
              }}
            >
              {/* A4 Page Container */}
              <div 
                className="bg-white shadow-2xl rounded-sm overflow-hidden"
                style={{
                  width: '595px', // A4 width in points
                  minHeight: '842px', // A4 height in points
                  maxWidth: '100%',
                }}
              >
                {/* Embed PDF using iframe */}
                <iframe
                  src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0"
                  style={{ minHeight: '842px' }}
                  title="CV Preview"
                />
              </div>
              
              {/* Page shadow effect */}
              <div className="absolute inset-0 pointer-events-none rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)]" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Quick stats footer */}
      {data && (
        <div className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>
            {data.experience?.length || 0} experiences • {data.education?.length || 0} education • {totalPages} page{totalPages > 1 ? 's' : ''}
          </span>
          <span className="text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Ready to download
          </span>
        </div>
      )}
    </div>
  )
}

export default PDFPreviewViewer

