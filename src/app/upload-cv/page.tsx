'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import PDFUploader from '@/components/PDFUploader'
import PDFExtractReview from '@/components/PDFExtractReview'
import Navbar from '@/components/landing/Navbar'
import { CVData } from '@/types/cv'
import useCVData from '@/hooks/useCVData'
import SEOHead from '@/components/SEOHead'

export default function UploadCVPage() {
  const router = useRouter()
  const [extractedData, setExtractedData] = useState<Partial<CVData> | null>(null)
  const { updateCvData } = useCVData()

  const handlePDFDataExtracted = (data: Partial<CVData>) => {
    // Set the extracted data for review
    setExtractedData(data)
  }

  const handleConfirmData = (confirmedData: Partial<CVData>) => {
    // Update the CV data in the global state
    updateCvData(confirmedData)
    
    // Redirect to the builder page
    router.push('/builder')
  }

  const handleCancel = () => {
    // Reset the extracted data
    setExtractedData(null)
  }

  return (
    <>
      <SEOHead
        title="Upload Existing CV - Extract and Improve Your Resume"
        description="Upload your existing CV or resume and let our AI extract all the information. Review, edit, and create a better version with professional templates."
        keywords={[
          'upload CV',
          'upload resume',
          'CV extraction',
          'resume parser',
          'PDF CV upload',
          'CV improvement',
          'resume enhancement',
          'CV data extraction',
          'professional CV upgrade',
          'resume optimization'
        ]}
        ogTitle="Upload Existing CV - Extract and Improve Your Resume"
        ogDescription="Upload your existing CV or resume and let our AI extract all the information. Review, edit, and create a better version."
        canonical="/upload-cv"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "LadderFox CV Upload & Extraction",
          "description": "Upload existing CVs and resumes for AI-powered data extraction and improvement",
          "url": "https://ladder-fox-dev.vercel.app/upload-cv",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Free CV upload and extraction with premium features available"
          },
          "featureList": [
            "PDF CV upload",
            "AI data extraction",
            "Data review and editing",
            "Professional templates",
            "CV improvement suggestions"
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        
        <main className="container mx-auto py-10 px-4 pt-48 sm:pt-44 lg:pt-40">
          <h1 className="text-3xl font-bold text-center mb-2">Upload Your Existing CV</h1>
          <p className="text-center text-gray-600 mb-10">We'll extract the information and help you create a better CV</p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            {extractedData ? (
              <PDFExtractReview 
                extractedData={extractedData}
                onConfirm={handleConfirmData}
                onCancel={handleCancel}
              />
            ) : (
              <PDFUploader onPDFDataExtracted={handlePDFDataExtracted} />
            )}
          </div>
        </main>
      </div>
    </>
  )
} 