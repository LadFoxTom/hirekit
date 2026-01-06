'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '@/translations/en.json'
import nl from '@/translations/nl.json'
import fr from '@/translations/fr.json'
import es from '@/translations/es.json'
import de from '@/translations/de.json'

type Language = 'en' | 'nl' | 'fr' | 'es' | 'de'

interface LocaleContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  availableLanguages: { code: Language; name: string }[]
  isClient: boolean
  translations: Record<string, string>
}

const translations: Record<Language, Record<string, any>> = {
  en,
  nl,
  fr,
  es,
  de
}



const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'nl' as Language, name: 'Nederlands' },
  { code: 'fr' as Language, name: 'Français' },
  { code: 'es' as Language, name: 'Español' },
  { code: 'de' as Language, name: 'Deutsch' }
]

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load language from localStorage or detect browser language
    const savedLanguage = localStorage.getItem('language') as Language
    
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language
      if (availableLanguages.some(lang => lang.code === browserLang)) {
        setLanguageState(browserLang)
        localStorage.setItem('language', browserLang)
      }
    }
    
    // Mark as hydrated after initial setup
    setIsHydrated(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (isClient) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    // During SSR or before hydration, always use English to prevent hydration mismatches
    if (!isHydrated) {
      const englishTranslation = translations.en
      if (englishTranslation && englishTranslation[key]) {
        return englishTranslation[key]
      }
      return key
    }

    // First try to get the translation from the current language
    const currentTranslation = translations[language]
    
    if (currentTranslation && currentTranslation[key]) {
      return currentTranslation[key]
    }

    // Fallback to English
    const englishTranslation = translations.en
    if (englishTranslation && englishTranslation[key]) {
      return englishTranslation[key]
    }

    // If still not found, return the key
    console.warn(`Translation key not found: ${key}`)
    return key
  }

  return (
    <LocaleContext.Provider value={{ language, setLanguage, t, availableLanguages, isClient: isHydrated, translations: translations[language] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
} 