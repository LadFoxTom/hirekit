'use client'

import React, { useState, useRef } from 'react'
import { FiImage, FiX, FiUpload, FiLoader } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { CVData } from '@/types/cv'

interface CVPhotoUploaderProps {
  cvData: CVData
  onPhotoUpdate: (photoUrl: string | undefined) => void
  onPositionChange?: (position: 'left' | 'right' | 'center' | 'none') => void
  isAuthenticated?: boolean
  className?: string
}

export function CVPhotoUploader({
  cvData,
  onPhotoUpdate,
  onPositionChange,
  isAuthenticated = false,
  className = ''
}: CVPhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, etc.)')
      return
    }

    // Validate file size (4MB max)
    const maxSize = 4 * 1024 * 1024 // 4MB
    if (file.size > maxSize) {
      toast.error('Image is too large. Please select a file under 4MB')
      return
    }

    setIsUploading(true)

    try {
      if (isAuthenticated) {
        // Try UploadThing for authenticated users
        try {
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch('/api/uploadthing/profileImage', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const result = await response.json()
            if (result.url) {
              onPhotoUpdate(result.url)
              if (!cvData.layout?.photoPosition || cvData.layout.photoPosition === 'none') {
                onPositionChange?.('left')
              }
              toast.success('Photo uploaded successfully!')
              setIsUploading(false)
              return
            }
          }
        } catch (uploadError) {
          console.warn('UploadThing failed, falling back to data URL:', uploadError)
        }
      }
      
      // Fallback: Convert to data URL (works for all users and PDF compatibility)
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        onPhotoUpdate(dataUrl)
        if (!cvData.layout?.photoPosition || cvData.layout.photoPosition === 'none') {
          onPositionChange?.('left')
        }
        toast.success('Photo added successfully!')
        setIsUploading(false)
      }
      reader.onerror = () => {
        toast.error('Failed to read image file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload photo. Please try again.')
      setIsUploading(false)
    }
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

  const handleRemovePhoto = () => {
    onPhotoUpdate(undefined)
    toast.success('Photo removed')
  }

  const handleClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click()
    }
  }

  const isLoading = isUploading

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Photo Display */}
      {cvData.photoUrl && (
        <div className="relative inline-block group">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
            <img
              src={cvData.photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <button
                onClick={handleRemovePhoto}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all"
                title="Remove photo"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${dragActive 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isLoading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          className="hidden"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center space-y-2 py-2">
            <FiLoader className="text-blue-400 text-xl animate-spin" />
            <p className="text-xs text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1.5">
            {cvData.photoUrl ? (
              <>
                <FiImage className="text-blue-400 text-lg" />
                <p className="text-xs text-gray-300 font-medium">Change Photo</p>
              </>
            ) : (
              <>
                <FiUpload className="text-blue-400 text-lg" />
                <p className="text-xs text-gray-300 font-medium">Add Profile Photo</p>
                <p className="text-[10px] text-gray-500">Click or drag & drop</p>
              </>
            )}
            <p className="text-[10px] text-gray-500">JPG, PNG up to 4MB</p>
          </div>
        )}
      </div>

      {/* Photo Position Controls */}
      {cvData.photoUrl && onPositionChange && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Photo Position
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['left', 'right', 'center', 'none'] as const).map((position) => (
              <button
                key={position}
                onClick={() => onPositionChange(position)}
                className={`
                  px-2 py-1.5 text-[10px] rounded transition-all
                  ${cvData.layout?.photoPosition === position
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
                title={`Position photo ${position}`}
              >
                {position === 'left' && '←'}
                {position === 'right' && '→'}
                {position === 'center' && '○'}
                {position === 'none' && '✕'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            {cvData.layout?.photoPosition === 'none' 
              ? 'Photo hidden' 
              : `Photo will appear ${cvData.layout?.photoPosition} of your name`
            }
          </p>
        </div>
      )}
    </div>
  )
}

