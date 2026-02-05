'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { getProfessionsByCategory, URL_SEGMENTS, type Language } from '@/data/professions'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import {
  FiArrowLeft, FiChevronDown, FiChevronRight, FiGrid, FiFolder,
  FiCreditCard, FiSettings, FiHelpCircle, FiLogOut, FiEye,
  FiGlobe, FiBriefcase, FiUser, FiCheckCircle, FiArrowRight,
  FiBook, FiTarget, FiAward, FiMenu, FiX, FiFileText, FiMail,
  FiZap, FiList, FiStar, FiHome
} from 'react-icons/fi'

interface CVAdvisorPageProps {
  type: 'cv' | 'letter'
  language: Language
}

// Country data with CV conventions
const COUNTRIES = {
  nl: {
    name: { nl: 'Nederland', en: 'Netherlands', es: 'Países Bajos', de: 'Niederlande', fr: 'Pays-Bas' },
    flag: '🇳🇱',
    conventions: {
      photo: 'optional',
      length: '1-2 pages',
      format: 'reverse-chronological',
      highlights: ['No photo required', 'Direct communication style', 'Focus on achievements', 'Include languages spoken']
    }
  },
  es: {
    name: { nl: 'Spanje', en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne' },
    flag: '🇪🇸',
    conventions: {
      photo: 'expected',
      length: '1-2 pages',
      format: 'reverse-chronological',
      highlights: ['Photo is common', 'Personal details included', 'Formal tone preferred', 'Education highly valued']
    }
  },
  de: {
    name: { nl: 'Duitsland', en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne' },
    flag: '🇩🇪',
    conventions: {
      photo: 'expected',
      length: '2-3 pages',
      format: 'detailed',
      highlights: ['Professional photo expected', 'Detailed work history', 'Include certifications', 'Formal structure important']
    }
  },
  uk: {
    name: { nl: 'Verenigd Koninkrijk', en: 'United Kingdom', es: 'Reino Unido', de: 'Großbritannien', fr: 'Royaume-Uni' },
    flag: '🇬🇧',
    conventions: {
      photo: 'not-recommended',
      length: '2 pages max',
      format: 'skills-focused',
      highlights: ['No photo (anti-discrimination)', 'Concise bullet points', 'Personal statement important', 'References available on request']
    }
  },
  us: {
    name: { nl: 'Verenigde Staten', en: 'United States', es: 'Estados Unidos', de: 'USA', fr: 'États-Unis' },
    flag: '🇺🇸',
    conventions: {
      photo: 'not-recommended',
      length: '1 page preferred',
      format: 'achievement-focused',
      highlights: ['No photo (anti-discrimination)', 'Quantify achievements', 'Action verbs essential', 'ATS optimization critical']
    }
  },
  fr: {
    name: { nl: 'Frankrijk', en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France' },
    flag: '🇫🇷',
    conventions: {
      photo: 'common',
      length: '1-2 pages',
      format: 'structured',
      highlights: ['Photo often included', 'Formal writing style', 'Diplomas highly valued', 'Include personal interests']
    }
  },
  be: {
    name: { nl: 'België', en: 'Belgium', es: 'Bélgica', de: 'Belgien', fr: 'Belgique' },
    flag: '🇧🇪',
    conventions: {
      photo: 'optional',
      length: '1-2 pages',
      format: 'europass-friendly',
      highlights: ['Multilingual CVs valued', 'Photo optional', 'Language skills critical', 'EU format accepted']
    }
  },
  pl: {
    name: { nl: 'Polen', en: 'Poland', es: 'Polonia', de: 'Polen', fr: 'Pologne' },
    flag: '🇵🇱',
    conventions: {
      photo: 'common',
      length: '1-2 pages',
      format: 'structured',
      highlights: ['Photo commonly included', 'Personal data included', 'Education section important', 'GDPR consent clause needed']
    }
  }
}

// Sector-specific advice
const SECTORS = {
  technology: {
    name: { nl: 'Technologie & IT', en: 'Technology & IT', es: 'Tecnología', de: 'Technologie', fr: 'Technologie' },
    icon: '💻',
    keywords: ['agile', 'scrum', 'cloud', 'API', 'DevOps', 'CI/CD', 'microservices'],
    advice: ['List technical skills prominently', 'Include GitHub/portfolio links', 'Mention specific technologies with versions', 'Quantify impact (users, performance)']
  },
  healthcare: {
    name: { nl: 'Zorg & Gezondheid', en: 'Healthcare', es: 'Salud', de: 'Gesundheitswesen', fr: 'Santé' },
    icon: '🏥',
    keywords: ['patient care', 'clinical', 'compliance', 'EMR', 'HIPAA', 'protocols'],
    advice: ['Highlight certifications and licenses', 'Emphasize patient outcomes', 'Include continuing education', 'Mention specializations clearly']
  },
  finance: {
    name: { nl: 'Financiën & Banking', en: 'Finance & Banking', es: 'Finanzas', de: 'Finanzen', fr: 'Finance' },
    icon: '💰',
    keywords: ['compliance', 'risk management', 'analysis', 'forecasting', 'audit', 'regulatory'],
    advice: ['Quantify financial impact', 'List relevant certifications (CFA, CPA)', 'Emphasize accuracy and attention to detail', 'Mention regulatory knowledge']
  },
  creative: {
    name: { nl: 'Creatief & Design', en: 'Creative & Design', es: 'Creativo', de: 'Kreativ', fr: 'Créatif' },
    icon: '🎨',
    keywords: ['brand', 'UX/UI', 'creative direction', 'visual', 'campaign', 'storytelling'],
    advice: ['Include portfolio link prominently', 'Show range of work styles', 'Mention tools and software', 'Highlight client results']
  },
  sales: {
    name: { nl: 'Sales & Marketing', en: 'Sales & Marketing', es: 'Ventas', de: 'Vertrieb', fr: 'Commercial' },
    icon: '📈',
    keywords: ['revenue', 'pipeline', 'conversion', 'leads', 'CRM', 'targets', 'growth'],
    advice: ['Quantify revenue and targets exceeded', 'Show consistent achievement pattern', 'Mention CRM systems used', 'Include market expansion examples']
  },
  engineering: {
    name: { nl: 'Engineering & Techniek', en: 'Engineering', es: 'Ingeniería', de: 'Ingenieurwesen', fr: 'Ingénierie' },
    icon: '⚙️',
    keywords: ['CAD', 'project management', 'specifications', 'compliance', 'testing', 'optimization'],
    advice: ['List technical certifications', 'Mention specific tools/software', 'Quantify project scale and impact', 'Include safety compliance experience']
  },
  education: {
    name: { nl: 'Onderwijs', en: 'Education', es: 'Educación', de: 'Bildung', fr: 'Éducation' },
    icon: '📚',
    keywords: ['curriculum', 'assessment', 'pedagogy', 'student outcomes', 'inclusive', 'development'],
    advice: ['Highlight teaching certifications', 'Mention student achievement data', 'Include curriculum development', 'Show professional development']
  },
  hospitality: {
    name: { nl: 'Horeca & Toerisme', en: 'Hospitality', es: 'Hostelería', de: 'Gastgewerbe', fr: 'Hôtellerie' },
    icon: '🏨',
    keywords: ['customer service', 'guest satisfaction', 'operations', 'team leadership', 'quality'],
    advice: ['Emphasize customer service metrics', 'Highlight language skills', 'Mention specific systems (POS, booking)', 'Show team leadership experience']
  }
}

// Navigation sections with translations
const NAV_SECTIONS = {
  advisor: {
    id: 'advisor',
    icon: FiZap,
    labels: { en: 'Smart Advisor', nl: 'Slim Advies', es: 'Asesor Inteligente', de: 'Smarter Berater', fr: 'Conseiller Intelligent' }
  },
  country: {
    id: 'country',
    icon: FiGlobe,
    labels: { en: 'Country Guide', nl: 'Landengids', es: 'Guía por País', de: 'Länderführer', fr: 'Guide par Pays' }
  },
  sector: {
    id: 'sector',
    icon: FiBriefcase,
    labels: { en: 'Sector Tips', nl: 'Sectortips', es: 'Consejos por Sector', de: 'Branchentipps', fr: 'Conseils Secteur' }
  },
  checklist: {
    id: 'checklist',
    icon: FiCheckCircle,
    labels: { en: 'Quick Checklist', nl: 'Snelle Checklist', es: 'Lista Rápida', de: 'Schnelle Checkliste', fr: 'Checklist Rapide' }
  },
  start: {
    id: 'start',
    icon: FiArrowRight,
    labels: { en: 'Start Building', nl: 'Start nu', es: 'Empezar', de: 'Jetzt Starten', fr: 'Commencer' }
  }
}

const getNavSections = () => Object.values(NAV_SECTIONS)

// UI translations for the page
const UI_TRANSLATIONS = {
  typeName: {
    cv: { en: 'CV', nl: 'CV', es: 'CV', de: 'Lebenslauf', fr: 'CV' },
    letter: { en: 'Cover Letter', nl: 'Motivatiebrief', es: 'Carta de Presentación', de: 'Anschreiben', fr: 'Lettre de Motivation' }
  },
  letterTab: { en: 'Letter', nl: 'Brief', es: 'Carta', de: 'Brief', fr: 'Lettre' },
  guideLabel: { en: 'Guide', nl: 'Gids', es: 'Guía', de: 'Leitfaden', fr: 'Guide' },
  interactive: { en: 'Interactive', nl: 'Interactief', es: 'Interactivo', de: 'Interaktiv', fr: 'Interactif' },
  hero: {
    cvTitle: { en: 'Build a Perfect CV', nl: 'Maak een Perfect CV', es: 'Crea un CV Perfecto', de: 'Erstelle einen perfekten Lebenslauf', fr: 'Créez un CV Parfait' },
    letterTitle: { en: 'Write a Strong Cover Letter', nl: 'Schrijf een Sterke Brief', es: 'Escribe una Carta Convincente', de: 'Schreibe ein starkes Anschreiben', fr: 'Rédigez une Lettre Percutante' },
    subtitle: { en: 'Get personalized advice based on your country, sector, and profession. Discover what recruiters are looking for.', nl: 'Krijg gepersonaliseerd advies op basis van je land, sector en beroep. Ontdek wat recruiters zoeken.', es: 'Obtén consejos personalizados según tu país, sector y profesión. Descubre lo que buscan los reclutadores.', de: 'Erhalte personalisierte Tipps basierend auf Land, Branche und Beruf.', fr: 'Obtenez des conseils personnalisés selon votre pays, secteur et profession.' }
  },
  advisor: {
    subtitle: { en: 'Select your situation for tailored advice', nl: 'Selecteer je situatie voor advies op maat', es: 'Selecciona tu situación para consejos personalizados', de: 'Wähle deine Situation für maßgeschneiderte Tipps', fr: 'Sélectionnez votre situation pour des conseils adaptés' },
    country: { en: 'Country', nl: 'Land', es: 'País', de: 'Land', fr: 'Pays' },
    selectCountry: { en: 'Select country...', nl: 'Kies land...', es: 'Selecciona país...', de: 'Land wählen...', fr: 'Choisir pays...' },
    selectSector: { en: 'Select sector...', nl: 'Kies sector...', es: 'Selecciona sector...', de: 'Branche wählen...', fr: 'Choisir secteur...' },
    profession: { en: 'Profession', nl: 'Beroep', es: 'Profesión', de: 'Beruf', fr: 'Métier' },
    selectProfession: { en: 'Select profession...', nl: 'Kies beroep...', es: 'Selecciona profesión...', de: 'Beruf wählen...', fr: 'Choisir métier...' },
    yourAdvice: { en: 'Your Personalized Advice', nl: 'Jouw Gepersonaliseerde Advies', es: 'Tu Consejo Personalizado', de: 'Dein personalisierter Rat', fr: 'Vos Conseils Personnalisés' },
    keywords: { en: 'Important keywords for your sector:', nl: 'Belangrijke keywords voor jouw sector:', es: 'Palabras clave importantes para tu sector:', de: 'Wichtige Keywords für deine Branche:', fr: 'Mots-clés importants pour votre secteur:' }
  },
  buttons: {
    startWith: { en: 'Start Building Your', nl: 'Start met je', es: 'Empieza tu', de: 'Starte dein', fr: 'Commencez votre' },
    learnMore: { en: 'Learn More', nl: 'Meer informatie', es: 'Más información', de: 'Mehr erfahren', fr: 'En savoir plus' },
    create: { en: 'Create', nl: 'Maak', es: 'Crear', de: 'Erstellen', fr: 'Créer' },
    startFree: { en: 'Start Free', nl: 'Start Gratis', es: 'Empezar Gratis', de: 'Kostenlos starten', fr: 'Commencer Gratuitement' }
  },
  country: {
    title: { en: 'CV Conventions by Country', nl: 'CV Conventies per Land', es: 'Convenciones de CV por País', de: 'CV-Konventionen nach Land', fr: 'Conventions CV par Pays' },
    subtitle: { en: 'Every country has different expectations', nl: 'Elk land heeft andere verwachtingen', es: 'Cada país tiene diferentes expectativas', de: 'Jedes Land hat andere Erwartungen', fr: 'Chaque pays a des attentes différentes' },
    photo: { en: 'Photo:', nl: 'Foto:', es: 'Foto:', de: 'Foto:', fr: 'Photo:' }
  },
  sector: {
    title: { en: 'Tips by Sector', nl: 'Tips per Sector', es: 'Consejos por Sector', de: 'Tipps nach Branche', fr: 'Conseils par Secteur' },
    subtitle: { en: 'What recruiters look for in your industry', nl: 'Wat recruiters zoeken in jouw branche', es: 'Lo que buscan los reclutadores en tu industria', de: 'Was Recruiter in deiner Branche suchen', fr: 'Ce que recherchent les recruteurs dans votre secteur' }
  },
  checklist: {
    title: { en: 'Quick Checklist', nl: 'Snelle Checklist', es: 'Lista Rápida', de: 'Schnelle Checkliste', fr: 'Checklist Rapide' },
    subtitle: { en: "Make sure you don't miss anything", nl: 'Zorg dat je niets vergeet', es: 'Asegúrate de no olvidar nada', de: 'Stelle sicher, dass du nichts vergisst', fr: 'Assurez-vous de ne rien oublier' },
    essential: { en: 'Essential', nl: 'Essentieel', es: 'Esencial', de: 'Wesentlich', fr: 'Essentiel' },
    proTips: { en: 'Pro Tips', nl: 'Pro Tips', es: 'Consejos Pro', de: 'Profi-Tipps', fr: 'Conseils Pro' },
    items: {
      contact: { en: 'Contact info up-to-date', nl: 'Contactgegevens up-to-date', es: 'Datos de contacto actualizados', de: 'Kontaktdaten aktuell', fr: 'Coordonnées à jour' },
      experience: { en: 'Relevant work experience', nl: 'Relevante werkervaring', es: 'Experiencia laboral relevante', de: 'Relevante Berufserfahrung', fr: 'Expérience professionnelle pertinente' },
      education: { en: 'Education & certifications', nl: 'Opleiding & certificaten', es: 'Educación y certificaciones', de: 'Ausbildung & Zertifikate', fr: 'Formation & certifications' },
      skills: { en: 'Skills section', nl: 'Vaardigheden sectie', es: 'Sección de habilidades', de: 'Fähigkeiten-Bereich', fr: 'Section compétences' },
      spelling: { en: 'No spelling errors', nl: 'Geen spelfouten', es: 'Sin errores ortográficos', de: 'Keine Rechtschreibfehler', fr: 'Pas de fautes d\'orthographe' }
    },
    proItems: {
      quantify: { en: 'Quantify achievements', nl: 'Kwantificeer resultaten', es: 'Cuantifica logros', de: 'Erfolge quantifizieren', fr: 'Quantifier les réalisations' },
      actionVerbs: { en: 'Use action verbs', nl: 'Gebruik actieve werkwoorden', es: 'Usa verbos de acción', de: 'Aktive Verben verwenden', fr: 'Utiliser des verbes d\'action' },
      ats: { en: 'ATS-friendly format', nl: 'ATS-vriendelijke opmaak', es: 'Formato compatible con ATS', de: 'ATS-freundliches Format', fr: 'Format compatible ATS' },
      customize: { en: 'Customize per job', nl: 'Pas aan per vacature', es: 'Personaliza por puesto', de: 'Pro Stelle anpassen', fr: 'Personnaliser par offre' },
      concise: { en: 'Keep it concise', nl: 'Houd het beknopt', es: 'Sé conciso', de: 'Kurz und prägnant', fr: 'Restez concis' }
    }
  },
  cta: {
    ready: { en: 'Ready to create your', nl: 'Klaar om je', es: '¿Listo para crear tu', de: 'Bereit, dein', fr: 'Prêt à créer votre' },
    readySuffix: { en: '?', nl: ' te maken?', es: '?', de: ' zu erstellen?', fr: ' ?' },
    aiHelp: { en: 'Our AI assistant will help you create a professional document step by step.', nl: 'Onze AI-assistent helpt je stap voor stap een professioneel document te maken.', es: 'Nuestro asistente de IA te ayudará a crear un documento profesional paso a paso.', de: 'Unser KI-Assistent hilft dir Schritt für Schritt ein professionelles Dokument zu erstellen.', fr: 'Notre assistant IA vous aidera à créer un document professionnel étape par étape.' },
    noCreditCard: { en: 'No credit card required', nl: 'Geen creditcard nodig', es: 'No se requiere tarjeta de crédito', de: 'Keine Kreditkarte erforderlich', fr: 'Aucune carte de crédit requise' }
  }
}

// Helper to get translation
const getT = (obj: Record<string, string>, lang: string) => obj[lang] || obj.en

function getCategoryName(category: string, language: Language): string {
  const categories: Record<string, Record<string, string>> = {
    healthcare: { en: 'Healthcare', nl: 'Zorg', es: 'Salud', de: 'Gesundheit', fr: 'Santé' },
    technology: { en: 'Technology', nl: 'Technologie', es: 'Tecnología', de: 'Technologie', fr: 'Technologie' },
    education: { en: 'Education', nl: 'Onderwijs', es: 'Educación', de: 'Bildung', fr: 'Éducation' },
    business: { en: 'Business', nl: 'Zakelijk', es: 'Negocios', de: 'Wirtschaft', fr: 'Commerce' },
    creative: { en: 'Creative', nl: 'Creatief', es: 'Creativo', de: 'Kreativ', fr: 'Créatif' },
    engineering: { en: 'Engineering', nl: 'Techniek', es: 'Ingeniería', de: 'Ingenieurwesen', fr: 'Ingénierie' },
    sales: { en: 'Sales', nl: 'Verkoop', es: 'Ventas', de: 'Verkauf', fr: 'Ventes' },
    administration: { en: 'Administration', nl: 'Administratie', es: 'Administración', de: 'Verwaltung', fr: 'Administration' },
    hospitality: { en: 'Hospitality', nl: 'Horeca', es: 'Hostelería', de: 'Gastgewerbe', fr: 'Hôtellerie' },
    legal: { en: 'Legal', nl: 'Juridisch', es: 'Legal', de: 'Recht', fr: 'Juridique' }
  }
  return categories[category]?.[language] || categories[category]?.['en'] || category
}

export default function CVAdvisorPage({ type, language }: CVAdvisorPageProps) {
  const { t, language: currentLanguage, setLanguage, availableLanguages } = useLocale()
  const { user, subscription } = useAuth()
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('advisor')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const segments = URL_SEGMENTS[language]
  const professionsByCategory = getProfessionsByCategory(language)
  const typeName = getT(UI_TRANSLATIONS.typeName[type], currentLanguage)

  const isActiveOrTrialing = subscription?.status === 'active' || subscription?.status === 'trialing'
  const plan = isActiveOrTrialing ? (subscription?.plan || 'free') : 'free'
  const isPro = plan !== 'free'

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Get personalized advice based on selections
  const getPersonalizedAdvice = () => {
    const advice: string[] = []

    if (selectedCountry && COUNTRIES[selectedCountry as keyof typeof COUNTRIES]) {
      const country = COUNTRIES[selectedCountry as keyof typeof COUNTRIES]
      advice.push(...country.conventions.highlights)
    }

    if (selectedSector && SECTORS[selectedSector as keyof typeof SECTORS]) {
      const sector = SECTORS[selectedSector as keyof typeof SECTORS]
      advice.push(...sector.advice)
    }

    return advice
  }

  // Navigate to home with instant action (like home page shortcuts)
  const handleStartBuilding = () => {
    // Set localStorage flags for home page to pick up
    localStorage.setItem('activateSplitscreen', 'true');
    localStorage.setItem('preferredArtifactType', type);
    localStorage.setItem('instantAction', type === 'cv' ? 'instant-cv' : 'instant-letter');
    router.push('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl border-b z-50"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', opacity: 0.98 }}>
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <Link href="/" className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </Link>

            {/* Type tabs */}
            <div className="hidden sm:flex items-center gap-1 ml-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Link
                href={`/${segments.examples}/${segments.cv}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  type === 'cv' ? 'bg-blue-500 text-white' : ''
                }`}
                style={type !== 'cv' ? { color: 'var(--text-secondary)' } : {}}
              >
                <FiFileText size={14} />
                CV
              </Link>
              <Link
                href={`/${segments.examples}/${segments.letter}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  type === 'letter' ? 'bg-blue-500 text-white' : ''
                }`}
                style={type !== 'letter' ? { color: 'var(--text-secondary)' } : {}}
              >
                <FiMail size={14} />
                {getT(UI_TRANSLATIONS.letterTab, currentLanguage)}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                    {user?.name?.[0] || 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl py-2 z-50"
                      style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)' }}
                    >
                      <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-white/5" style={{ color: 'var(--text-primary)' }}>
                        Dashboard
                      </Link>
                      <Link href="/pricing" className="block px-4 py-2 text-sm hover:bg-white/5" style={{ color: 'var(--text-primary)' }}>
                        {isPro ? 'Pro' : 'Upgrade'}
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/5"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('nav.get_started') || 'Get Started'}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-40 pt-14"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-72 h-full overflow-y-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <nav className="p-4 space-y-1">
                {/* Home Button */}
                <button
                  onClick={() => { setIsMobileMenuOpen(false); router.push('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-2"
                  style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <FiHome size={18} />
                  {t('nav.home') || 'Home'}
                </button>
                {getNavSections().map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id ? 'bg-blue-500/10 text-blue-500' : ''
                    }`}
                    style={activeSection !== section.id ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <section.icon size={18} />
                    {section.labels[currentLanguage as keyof typeof section.labels] || section.labels.en}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Menu (Mobile) */}
      <AnimatePresence>
        {isLanguageMenuOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLanguageMenuOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />

            {/* Language Menu - Slide in from right */}
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 z-40 overflow-y-auto lg:hidden"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderLeft: '1px solid var(--border-subtle)',
                width: '200px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 space-y-2">
                {/* Close Button */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t('nav.language') || 'Language'}
                  </span>
                  <button
                    onClick={() => setIsLanguageMenuOpen(false)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Language Options */}
                <div className="space-y-1">
                  {availableLanguages.map((lang) => {
                    const flagMap: Record<string, string> = {
                      'en': '/flags/gb.svg',
                      'nl': '/flags/nl.svg',
                      'fr': '/flags/fr.svg',
                      'es': '/flags/es.svg',
                      'de': '/flags/de.svg',
                    }
                    const flagSrc = flagMap[lang.code] || ''

                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any)
                          setIsLanguageMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? 'var(--bg-hover)' : 'transparent',
                        }}
                      >
                        {flagSrc ? (
                          <img
                            src={flagSrc}
                            alt={`${lang.code.toUpperCase()} flag`}
                            className="rounded object-cover"
                            style={{ width: '20px', height: '20px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '20px' }}>🏳️</span>
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {lang.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="pt-14 lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-14 bottom-0 overflow-y-auto border-r"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>
              {typeName} {getT(UI_TRANSLATIONS.guideLabel, currentLanguage)}
            </h2>
            <nav className="space-y-1">
              {getNavSections().map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id ? 'bg-blue-500/10 text-blue-500' : ''
                  }`}
                  style={activeSection !== section.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  <section.icon size={16} />
                  {section.labels[currentLanguage as keyof typeof section.labels] || section.labels.en}
                  {activeSection === section.id && (
                    <FiChevronRight size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick CTA in sidebar */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              onClick={handleStartBuilding}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <FiZap size={16} />
              {getT(UI_TRANSLATIONS.buttons.create, currentLanguage)} {typeName}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 flex-1 min-h-screen">
          {/* Hero */}
          <section className="px-4 py-12 lg:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500">
                  {typeName} {getT(UI_TRANSLATIONS.guideLabel, currentLanguage)}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                  {getT(UI_TRANSLATIONS.interactive, currentLanguage)}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {type === 'cv'
                  ? getT(UI_TRANSLATIONS.hero.cvTitle, currentLanguage)
                  : getT(UI_TRANSLATIONS.hero.letterTitle, currentLanguage)
                }
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                {getT(UI_TRANSLATIONS.hero.subtitle, currentLanguage)}
              </p>
            </div>
          </section>

          {/* Smart Advisor Section */}
          <section id="advisor" className="px-4 py-12 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <FiZap className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getT(NAV_SECTIONS.advisor.labels, currentLanguage)}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {getT(UI_TRANSLATIONS.advisor.subtitle, currentLanguage)}
                  </p>
                </div>
              </div>

              {/* Selection Cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                {/* Country Selection */}
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FiGlobe size={16} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {getT(UI_TRANSLATIONS.advisor.country, currentLanguage)}
                    </span>
                  </div>
                  <select
                    value={selectedCountry || ''}
                    onChange={(e) => setSelectedCountry(e.target.value || null)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <option value="">{getT(UI_TRANSLATIONS.advisor.selectCountry, currentLanguage)}</option>
                    {Object.entries(COUNTRIES).map(([key, country]) => (
                      <option key={key} value={key}>
                        {country.flag} {country.name[currentLanguage as keyof typeof country.name] || country.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector Selection */}
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FiBriefcase size={16} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Sector
                    </span>
                  </div>
                  <select
                    value={selectedSector || ''}
                    onChange={(e) => setSelectedSector(e.target.value || null)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <option value="">{getT(UI_TRANSLATIONS.advisor.selectSector, currentLanguage)}</option>
                    {Object.entries(SECTORS).map(([key, sector]) => (
                      <option key={key} value={key}>
                        {sector.icon} {sector.name[currentLanguage as keyof typeof sector.name] || sector.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profession Selection */}
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FiUser size={16} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {getT(UI_TRANSLATIONS.advisor.profession, currentLanguage)}
                    </span>
                  </div>
                  <select
                    value={selectedProfession || ''}
                    onChange={(e) => setSelectedProfession(e.target.value || null)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <option value="">{getT(UI_TRANSLATIONS.advisor.selectProfession, currentLanguage)}</option>
                    {Object.entries(professionsByCategory).map(([category, profs]) => (
                      <optgroup key={category} label={getCategoryName(category, currentLanguage as Language)}>
                        {profs.map(({ id, translation }) => (
                          <option key={id} value={id}>{translation.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personalized Advice */}
              <AnimatePresence mode="wait">
                {(selectedCountry || selectedSector) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-6 mb-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <FiStar className="text-blue-500" size={18} />
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {getT(UI_TRANSLATIONS.advisor.yourAdvice, currentLanguage)}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {getPersonalizedAdvice().map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FiCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{advice}</span>
                        </li>
                      ))}
                    </ul>

                    {selectedSector && SECTORS[selectedSector as keyof typeof SECTORS] && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          {getT(UI_TRANSLATIONS.advisor.keywords, currentLanguage)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {SECTORS[selectedSector as keyof typeof SECTORS].keywords.map((keyword, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-md"
                              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA after advisor */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartBuilding}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <FiZap size={18} />
                  {getT(UI_TRANSLATIONS.buttons.startWith, currentLanguage)} {typeName}
                </button>
                <button
                  onClick={() => scrollToSection('country')}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                  style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                >
                  {getT(UI_TRANSLATIONS.buttons.learnMore, currentLanguage)}
                  <FiChevronDown size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Country Guide */}
          <section id="country" className="px-4 py-12 scroll-mt-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <FiGlobe className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getT(UI_TRANSLATIONS.country.title, currentLanguage)}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {getT(UI_TRANSLATIONS.country.subtitle, currentLanguage)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(COUNTRIES).slice(0, 6).map(([key, country]) => (
                  <div
                    key={key}
                    className={`rounded-xl p-4 cursor-pointer transition-all ${
                      selectedCountry === key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                    onClick={() => setSelectedCountry(key)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {country.name[currentLanguage as keyof typeof country.name] || country.name.en}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {getT(UI_TRANSLATIONS.country.photo, currentLanguage)} {country.conventions.photo} • {country.conventions.length}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {country.conventions.highlights.slice(0, 2).map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <FiCheckCircle size={12} className="text-green-500 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sector Tips */}
          <section id="sector" className="px-4 py-12 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <FiBriefcase className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getT(UI_TRANSLATIONS.sector.title, currentLanguage)}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {getT(UI_TRANSLATIONS.sector.subtitle, currentLanguage)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(SECTORS).map(([key, sector]) => (
                  <div
                    key={key}
                    className={`rounded-xl p-4 cursor-pointer transition-all ${
                      selectedSector === key ? 'ring-2 ring-orange-500' : ''
                    }`}
                    style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                    onClick={() => setSelectedSector(key)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{sector.icon}</span>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {sector.name[currentLanguage as keyof typeof sector.name] || sector.name.en}
                      </h3>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {sector.advice[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Checklist */}
          <section id="checklist" className="px-4 py-12 scroll-mt-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getT(UI_TRANSLATIONS.checklist.title, currentLanguage)}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {getT(UI_TRANSLATIONS.checklist.subtitle, currentLanguage)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiList size={16} />
                    {getT(UI_TRANSLATIONS.checklist.essential, currentLanguage)}
                  </h3>
                  <ul className="space-y-2">
                    {[
                      getT(UI_TRANSLATIONS.checklist.items.contact, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.items.experience, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.items.education, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.items.skills, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.items.spelling, currentLanguage)
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="w-4 h-4 rounded border flex items-center justify-center"
                          style={{ borderColor: 'var(--border-medium)' }}>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiAward size={16} />
                    {getT(UI_TRANSLATIONS.checklist.proTips, currentLanguage)}
                  </h3>
                  <ul className="space-y-2">
                    {[
                      getT(UI_TRANSLATIONS.checklist.proItems.quantify, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.proItems.actionVerbs, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.proItems.ats, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.proItems.customize, currentLanguage),
                      getT(UI_TRANSLATIONS.checklist.proItems.concise, currentLanguage)
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <FiStar size={14} className="text-yellow-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section id="start" className="px-4 py-16 scroll-mt-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                {type === 'cv' ? <FiFileText className="text-white" size={28} /> : <FiMail className="text-white" size={28} />}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {getT(UI_TRANSLATIONS.cta.ready, currentLanguage)} {typeName}{getT(UI_TRANSLATIONS.cta.readySuffix, currentLanguage)}
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                {getT(UI_TRANSLATIONS.cta.aiHelp, currentLanguage)}
              </p>
              <button
                onClick={handleStartBuilding}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/25"
              >
                {getT(UI_TRANSLATIONS.buttons.startFree, currentLanguage)}
                <FiArrowRight size={20} />
              </button>
              <p className="mt-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {getT(UI_TRANSLATIONS.cta.noCreditCard, currentLanguage)}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
