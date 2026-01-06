'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { FaChevronDown, FaCheck } from 'react-icons/fa'

// Flag Icon Component
const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-5 h-4" }) => {
  const flagMap: Record<string, string> = {
    'en': '/flags/gb.svg',
    'nl': '/flags/nl.svg',
    'fr': '/flags/fr.svg',
    'es': '/flags/es.svg',
    'de': '/flags/de.svg'
  }

  const flagSrc = flagMap[code]
  
  if (!flagSrc) {
    return <span className={className}>🏳️</span>
  }

  return (
    <img 
      src={flagSrc} 
      alt={`${code.toUpperCase()} flag`}
      className={`${className} rounded-sm shadow-sm`}
    />
  )
}

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages, isClient } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = availableLanguages.find(lang => lang.code === language)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
    setIsOpen(false)
  }

  // Don't render until client-side hydration is complete
  if (!isClient || !isMounted) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
        <FlagIcon code="en" className="w-5 h-4" />
        <span className="hidden md:inline">English</span>
        <FaChevronDown className="text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <FlagIcon code={language} className="w-5 h-4" />
        <span className="hidden md:inline">{currentLanguage?.name}</span>
        <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FlagIcon code={lang.code} className="w-5 h-4" />
                  <span>{lang.name}</span>
                </div>
                {language === lang.code && (
                  <FaCheck className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher 