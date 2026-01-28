'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { motion, AnimatePresence } from 'framer-motion'

// Flag Icon Component
const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-5 h-5" }) => {
  const flagMap: Record<string, string> = {
    'en': '/flags/gb.svg',
    'nl': '/flags/nl.svg',
    'fr': '/flags/fr.svg',
    'es': '/flags/es.svg',
    'de': '/flags/de.svg',
    'it': '/flags/it.svg',
    'pl': '/flags/pl.svg',
    'ro': '/flags/ro.svg',
    'hu': '/flags/hu.svg',
    'el': '/flags/gr.svg',
    'cs': '/flags/cz.svg',
    'pt': '/flags/pt.svg',
    'sv': '/flags/se.svg',
    'bg': '/flags/bg.svg',
    'da': '/flags/dk.svg',
    'fi': '/flags/fi.svg',
    'sk': '/flags/sk.svg',
    'no': '/flags/no.svg',
    'hr': '/flags/hr.svg',
    'sr': '/flags/rs.svg',
  }

  const flagSrc = flagMap[code]
  
  if (!flagSrc) {
    return <span className={className}>🏳️</span>
  }

  return (
    <img 
      src={flagSrc} 
      alt={`${code.toUpperCase()} flag`}
      className="rounded object-cover"
      style={{ 
        width: '20px',
        height: '20px',
        minWidth: '20px',
        minHeight: '20px',
        maxWidth: '20px',
        maxHeight: '20px',
        display: 'block',
        flexShrink: 0
      }}
    />
  )
}

interface LanguageSelectorProps {
  onMobileMenuOpen?: () => void
}

export function LanguageSelector({ onMobileMenuOpen }: LanguageSelectorProps = {}) {
  const { language, setLanguage, availableLanguages, isClient } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
    setIsOpen(false)
    if (onMobileMenuOpen) {
      onMobileMenuOpen()
    }
  }

  const handleClick = () => {
    // On mobile, open sideways menu via callback
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onMobileMenuOpen) {
      onMobileMenuOpen()
    } else {
      // On desktop, toggle dropdown
      setIsOpen(!isOpen)
    }
  }

  const currentLanguage = availableLanguages.find(lang => lang.code === language)

  if (!isClient) {
    return (
      <button
        className="p-2 flex items-center justify-center rounded-lg transition-colors min-w-[44px] min-h-[44px] touch-manipulation"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <div style={{ 
          width: '20px', 
          height: '20px', 
          minWidth: '20px',
          minHeight: '20px',
          maxWidth: '20px',
          maxHeight: '20px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <FlagIcon code="en" />
        </div>
      </button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="p-2 flex items-center justify-center rounded-lg transition-colors min-w-[44px] min-h-[44px] touch-manipulation"
        style={{
          backgroundColor: isHovered ? 'var(--bg-hover)' : 'transparent',
        }}
        title={currentLanguage?.name || 'Language'}
        aria-label="Select language"
      >
        <div style={{ 
          width: '20px', 
          height: '20px', 
          minWidth: '20px',
          minHeight: '20px',
          maxWidth: '20px',
          maxHeight: '20px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <FlagIcon code={language} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 rounded-xl z-[9999] hidden lg:block"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)',
              width: '220px',
              minWidth: '220px',
              maxHeight: '320px',
              overflowY: 'auto',
            }}
          >
            <div className="py-1.5 px-1.5">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full flex items-center gap-3 px-3 py-2 transition-colors rounded-lg"
                  style={{
                    backgroundColor: language === lang.code ? 'var(--bg-hover)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (language !== lang.code) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== lang.code) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  title={lang.name}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    minWidth: '20px',
                    minHeight: '20px',
                    maxWidth: '20px',
                    maxHeight: '20px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <FlagIcon code={lang.code} />
                  </div>
                  <span
                    className="text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
