'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FaFolderOpen, FaChevronDown, FaSpinner } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'

interface SavedItem {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  type: 'cv' | 'letter'
}

interface LoadSavedDropdownProps {
  type: 'cv' | 'letter'
  onLoad: (item: SavedItem) => void
  className?: string
}

export default function LoadSavedDropdown({ type, onLoad, className = '' }: LoadSavedDropdownProps) {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSavedItems = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    try {
      const endpoint = type === 'cv' ? '/api/cv' : '/api/letter'
      const response = await fetch(endpoint)
      
      if (response.ok) {
        const data = await response.json()
        const items = data[type === 'cv' ? 'cvs' : 'letters'] || []
        setSavedItems(items.map((item: any) => ({
          id: item.id,
          title: item.title || `${type.toUpperCase()} ${new Date(item.createdAt).toLocaleDateString()}`,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          type
        })))
      } else {
        console.error('Failed to fetch saved items')
      }
    } catch (error) {
      console.error('Error fetching saved items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, type])

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSavedItems()
    }
  }, [isOpen, isAuthenticated, fetchSavedItems])

  const handleLoad = (item: SavedItem) => {
    onLoad(item)
    setIsOpen(false)
    toast.success(`${type.toUpperCase()} loaded successfully!`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
      >
        <FaFolderOpen className="mr-2" />
        Load Saved {type.toUpperCase()}
        <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              Saved {type.toUpperCase()}s
            </h3>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center">
              <FaSpinner className="animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : savedItems.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No saved {type}s found</p>
            </div>
          ) : (
            <div className="py-2">
              {savedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoad(item)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated: {formatDate(item.updatedAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 