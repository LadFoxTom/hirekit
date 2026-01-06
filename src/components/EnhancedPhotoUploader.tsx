'use client'

import React, { useState } from 'react'
import { FaImage, FaSpinner, FaTrash } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/context/LocaleContext'
import { CVData } from '@/types/cv'

interface EnhancedPhotoUploaderProps {
  onPhotoUpload: (photoUrl: string) => void
  updateCvData: (data: Partial<CVData>, source: string) => void
  cvData: CVData
  isAuthenticated?: boolean
}

const EnhancedPhotoUploader: React.FC<EnhancedPhotoUploaderProps> = ({ 
  onPhotoUpload, 
  updateCvData,
  cvData,
  isAuthenticated = false
}) => {
  const { t } = useLocale()
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Check file size (limit to 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image file is too large. Please select a file under 4MB')
      return
    }

    setIsUploading(true)

    try {
      if (isAuthenticated) {
        // Use UploadThing for authenticated users
        await uploadToCloud(file)
      } else {
        // Convert file to data URL for PDF compatibility
        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          handlePhotoSuccess(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const uploadToCloud = async (file: File) => {
    // This would integrate with UploadThing
    // For now, we'll simulate the upload
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/uploadthing/profileImage', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    handlePhotoSuccess(result.url)
  }

  const handlePhotoSuccess = (photoUrl: string) => {
    // Call the onPhotoUpload callback with the URL
    onPhotoUpload(photoUrl)
    
    // If there's no photo position set, automatically set it to left
    if (!cvData.layout?.photoPosition || cvData.layout.photoPosition === 'none') {
      updateCvData({ 
        layout: { 
          ...cvData.layout, 
          photoPosition: 'left' 
        } 
      }, 'update photo position')
    }

    toast.success('Profile picture uploaded successfully!')
  }

  const handleRemovePhoto = () => {
    updateCvData({ photoUrl: undefined }, 'remove photo')
    toast.success('Profile picture removed')
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      {/* Current Photo Display */}
      {cvData.photoUrl && (
        <div className="relative inline-block">
          <img
            src={cvData.photoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={handleRemovePhoto}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Remove photo"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isUploading ? handleClick : undefined}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <FaSpinner className="text-blue-500 text-2xl animate-spin" />
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <FaImage className="text-blue-500 text-2xl" />
            <p className="text-gray-700 font-medium">
              {cvData.photoUrl ? 'Change Photo' : 'Add Profile Photo'}
            </p>
            <p className="text-gray-500 text-sm">
              Click to select or drag and drop
            </p>
            <p className="text-gray-400 text-xs">
              JPG, PNG up to 4MB
            </p>
          </div>
        )}
      </div>

      {/* Photo Position Controls */}
      {cvData.photoUrl && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Photo Position
          </label>
          <div className="flex space-x-2">
            {(['left', 'right', 'center', 'none'] as const).map((position) => (
              <button
                key={position}
                onClick={() => updateCvData({ 
                  layout: { 
                    ...cvData.layout, 
                    photoPosition: position 
                  } 
                }, 'update photo position')}
                className={`px-3 py-1 text-xs rounded ${
                  cvData.layout?.photoPosition === position
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {position.charAt(0).toUpperCase() + position.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedPhotoUploader 