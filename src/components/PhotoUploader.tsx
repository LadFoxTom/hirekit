'use client'

import React, { useRef } from 'react'
import { FaImage } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/context/LocaleContext'
import { CVData } from '@/types/cv'

interface PhotoUploaderProps {
  onPhotoUpload: (photoUrl: string) => void
  updateCvData: (data: Partial<CVData>, source: string) => void
  cvData: CVData
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  onPhotoUpload, 
  updateCvData,
  cvData
}) => {
  const { t } = useLocale()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file is too large. Please select a file under 5MB')
      return
    }

    // Convert file to data URL for PDF compatibility
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      
      // Call the onPhotoUpload callback with the data URL
      onPhotoUpload(dataUrl)
      
      // If there's no photo position set, automatically set it to left
      if (!cvData.layout?.photoPosition || cvData.layout.photoPosition === 'none') {
        // Update only the layout property without touching other data
        updateCvData({ 
          layout: { 
            ...cvData.layout, 
            photoPosition: 'left' 
          } 
        }, 'update photo position')
      }

      // Show success message
      toast.success('Profile picture uploaded successfully!')
    }
    
    reader.readAsDataURL(file)
  }
  
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile photo"
      />
      <button
        onClick={handleClick}
        className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 border rounded text-sm font-medium text-gray-600"
      >
        <FaImage className="mr-2" />
        {t('builder.controls.addPhoto')}
      </button>
    </>
  )
}

export default PhotoUploader 