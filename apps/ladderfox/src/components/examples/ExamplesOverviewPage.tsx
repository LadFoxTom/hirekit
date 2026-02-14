'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { getProfessionsByCategory, URL_SEGMENTS, type Language } from '@/data/professions'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import {
  FiArrowLeft, FiChevronDown, FiGrid, FiFolder, FiBriefcase,
  FiClipboard, FiCreditCard, FiSettings, FiHelpCircle, FiLogOut, FiEye,
  FiTool
} from 'react-icons/fi'
import MobileUserMenu from '@/components/MobileUserMenu'
import { FaArrowRight, FaBriefcase, FaUser } from 'react-icons/fa'

interface ExamplesOverviewPageProps {
  type: 'cv' | 'letter'
  language: Language
}

// Menu Item Component
function MenuItem({ 
  icon: Icon, 
  label, 
  onClick, 
  badge,
  disabled = false,
  isActive = false
}: { 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; 
  onClick: () => void;
  badge?: string;
  disabled?: boolean;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      className={`
        w-full flex items-center min-h-[44px] px-3 py-2.5
        text-sm font-medium transition-all duration-150
        relative
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
      `}
      style={{
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div className="flex-shrink-0 mr-3" style={{ color: 'var(--text-tertiary)' }}>
        <Icon size={18} />
      </div>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span 
          className="px-2 py-0.5 rounded text-[10px] font-semibold ml-2"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            color: 'var(--text-tertiary)' 
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function getCategoryName(category: string, language: Language): string {
  const categories: Record<string, Record<Language, string>> = {
    healthcare: { en: 'Healthcare', nl: 'Zorg & Gezondheid', fr: 'Santé', es: 'Salud', de: 'Gesundheitswesen', it: 'Sanità', pl: 'Opieka Zdrowotna', ro: 'Sănătate', hu: 'Egészségügy', el: 'Υγεία', cs: 'Zdravotnictví', pt: 'Saúde', sv: 'Hälsovård', bg: 'Здравеопазване', da: 'Sundhedspleje', fi: 'Terveydenhuolto', sk: 'Zdravotníctvo', no: 'Helsevesen', hr: 'Zdravstvo', sr: 'Здравство' },
    technology: { en: 'Technology', nl: 'Technologie', fr: 'Technologie', es: 'Tecnología', de: 'Technologie', it: 'Tecnologia', pl: 'Technologia', ro: 'Tehnologie', hu: 'Technológia', el: 'Τεχνολογία', cs: 'Technologie', pt: 'Tecnologia', sv: 'Teknik', bg: 'Технологии', da: 'Teknologi', fi: 'Teknologia', sk: 'Technológia', no: 'Teknologi', hr: 'Tehnologija', sr: 'Технологија' },
    education: { en: 'Education', nl: 'Onderwijs', fr: 'Éducation', es: 'Educación', de: 'Bildung', it: 'Educazione', pl: 'Edukacja', ro: 'Educație', hu: 'Oktatás', el: 'Εκπαίδευση', cs: 'Vzdělávání', pt: 'Educação', sv: 'Utbildning', bg: 'Образование', da: 'Uddannelse', fi: 'Koulutus', sk: 'Vzdelávanie', no: 'Utdanning', hr: 'Obrazovanje', sr: 'Образовање' },
    business: { en: 'Business', nl: 'Zakelijk', fr: 'Commerce', es: 'Negocios', de: 'Wirtschaft', it: 'Business', pl: 'Biznes', ro: 'Afaceri', hu: 'Üzlet', el: 'Επιχειρήσεις', cs: 'Podnikání', pt: 'Negócios', sv: 'Företag', bg: 'Бизнес', da: 'Forretning', fi: 'Liiketoiminta', sk: 'Podnikanie', no: 'Forretning', hr: 'Poslovanje', sr: 'Пословање' },
    creative: { en: 'Creative', nl: 'Creatief', fr: 'Créatif', es: 'Creativo', de: 'Kreativ', it: 'Creativo', pl: 'Kreatywny', ro: 'Creativ', hu: 'Kreatív', el: 'Δημιουργικό', cs: 'Kreativní', pt: 'Criativo', sv: 'Kreativ', bg: 'Креативен', da: 'Kreativ', fi: 'Luova', sk: 'Kreatívny', no: 'Kreativ', hr: 'Kreativno', sr: 'Креативан' },
    engineering: { en: 'Engineering', nl: 'Techniek', fr: 'Ingénierie', es: 'Ingeniería', de: 'Ingenieurwesen', it: 'Ingegneria', pl: 'Inżynieria', ro: 'Inginerie', hu: 'Mérnöki', el: 'Μηχανική', cs: 'Inženýrství', pt: 'Engenharia', sv: 'Teknik', bg: 'Инженерство', da: 'Ingeniørvidenskab', fi: 'Tekniikka', sk: 'Inžinierstvo', no: 'Ingeniørfag', hr: 'Inženjerstvo', sr: 'Инжењерство' },
    sales: { en: 'Sales', nl: 'Verkoop', fr: 'Ventes', es: 'Ventas', de: 'Verkauf', it: 'Vendite', pl: 'Sprzedaż', ro: 'Vânzări', hu: 'Értékesítés', el: 'Πωλήσεις', cs: 'Prodej', pt: 'Vendas', sv: 'Försäljning', bg: 'Продажби', da: 'Salg', fi: 'Myynti', sk: 'Predaj', no: 'Salg', hr: 'Prodaja', sr: 'Продаја' },
    administration: { en: 'Administration', nl: 'Administratie', fr: 'Administration', es: 'Administración', de: 'Verwaltung', it: 'Amministrazione', pl: 'Administracja', ro: 'Administrație', hu: 'Adminisztráció', el: 'Διοίκηση', cs: 'Administrace', pt: 'Administração', sv: 'Administration', bg: 'Администрация', da: 'Administration', fi: 'Hallinto', sk: 'Administrácia', no: 'Administrasjon', hr: 'Administracija', sr: 'Администрација' },
    hospitality: { en: 'Hospitality', nl: 'Horeca', fr: 'Hôtellerie', es: 'Hostelería', de: 'Gastgewerbe', it: 'Ospitalità', pl: 'Gastronomia', ro: 'Ospitalitate', hu: 'Vendéglátás', el: 'Φιλοξενία', cs: 'Pohostinství', pt: 'Hospitalidade', sv: 'Hotell & Restaurang', bg: 'Гостоприемство', da: 'Hotel & Restaurant', fi: 'Hotelli-ja ravintola', sk: 'Pohostinnosť', no: 'Hotell & Restaurant', hr: 'Ugostiteljstvo', sr: 'Угоститељство' },
    legal: { en: 'Legal', nl: 'Juridisch', fr: 'Juridique', es: 'Legal', de: 'Recht', it: 'Legale', pl: 'Prawo', ro: 'Legal', hu: 'Jogi', el: 'Νομικό', cs: 'Právní', pt: 'Jurídico', sv: 'Juridik', bg: 'Правен', da: 'Juridisk', fi: 'Oikeudellinen', sk: 'Právne', no: 'Juridisk', hr: 'Pravno', sr: 'Правно' }
  };
  return categories[category]?.[language] || category;
}

export default function ExamplesOverviewPage({ type, language }: ExamplesOverviewPageProps) {
  const { t, language: currentLanguage } = useLocale()
  const { user, subscription } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const segments = URL_SEGMENTS[language]
  const professionsByCategory = getProfessionsByCategory(language)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const typeName = type === 'cv' 
    ? (t('examples.cv') || 'CV')
    : (t('examples.letter') || 'Motivational Letter')
  
  const typeSegment = type === 'cv' ? segments.cv : segments.letter

  const isActiveSubscription = subscription?.status === 'active'
  const plan = isActiveSubscription ? (subscription?.plan || 'free') : 'free'
  const isPro = plan !== 'free'
  const subBadge = isPro ? 'Pro' : 'Free'

  // Close dropdown when clicking outside
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl border-b z-50" style={{ overflow: 'visible', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', opacity: 0.95 }}>
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between" style={{ overflow: 'visible' }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FiArrowLeft size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            {user ? (
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <FiChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                </button>
                
                {/* Desktop: Original dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="hidden lg:block absolute left-auto right-0 top-full mt-2 rounded-xl z-[9999]"
                      style={{ 
                        width: '320px', 
                        minWidth: '320px', 
                        maxWidth: '320px',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                        boxShadow: 'var(--shadow-lg)'
                      }}
                    >
                      {/* User Info */}
                      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="font-semibold text-sm leading-tight mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                        <p className="text-[11px] truncate leading-relaxed" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>{user?.email}</p>
                      </div>
                      
                      {/* Navigation Items */}
                      <div className="py-1.5">
                        <MenuItem 
                          icon={FiGrid} 
                          label={t('nav.dashboard')} 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
                          isActive={pathname === '/dashboard'}
                        />
                        <MenuItem 
                          icon={FiFolder} 
                          label={t('nav.my_cvs')} 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }}
                        />
                        <MenuItem 
                          icon={FiEye} 
                          label={t('nav.cv_examples')} 
                          onClick={() => { 
                            setIsUserMenuOpen(false); 
                            const segs = URL_SEGMENTS[currentLanguage as Language] || URL_SEGMENTS.en;
                            router.push(`/${segs.examples}/${segs.cv}`); 
                          }}
                        />
                        <MenuItem 
                          icon={FiEye} 
                          label={t('nav.letter_examples')} 
                          onClick={() => { 
                            setIsUserMenuOpen(false); 
                            const segs = URL_SEGMENTS[currentLanguage as Language] || URL_SEGMENTS.en;
                            router.push(`/${segs.examples}/${segs.letter}`); 
                          }}
                        />
                        <MenuItem 
                          icon={FiBriefcase} 
                          label={t('nav.job_applications_short')} 
                          onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }}
                          disabled={true}
                        />
                        <MenuItem 
                          icon={FiClipboard} 
                          label={t('nav.tests_short')} 
                          onClick={() => { setIsUserMenuOpen(false); toast(t('toast.tests_coming_soon')); }}
                          disabled={true}
                        />
                      </div>
                      
                      {/* Account Items */}
                      <div className="py-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <MenuItem 
                          icon={FiCreditCard} 
                          label={t('nav.subscription')} 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }} 
                          badge={subBadge}
                          isActive={pathname === '/pricing'}
                        />
                        <MenuItem 
                          icon={FiSettings} 
                          label={t('nav.settings')} 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }}
                          isActive={pathname === '/settings'}
                        />
                        <MenuItem 
                          icon={FiHelpCircle} 
                          label={t('nav.help_support_short')} 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }}
                          isActive={pathname === '/faq'}
                        />
                      </div>
                      
                      {/* Action Items */}
                      <div className="py-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <MenuItem 
                          icon={FiLogOut} 
                          label={t('nav.sign_out')} 
                          onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-4 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('nav.sign_in')}
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('nav.get_started')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Menu (Mobile) - Shared component matching main page */}
      <AnimatePresence>
        <MobileUserMenu
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          user={user}
          subscriptionBadge={subBadge}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="pt-14">
        {/* Hero Section */}
        <div className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-tertiary)' }}>
              <Link href={`/${segments.examples}`} className="hover:opacity-80 transition-opacity">
                {t('examples.breadcrumb.examples') || 'Examples'}
              </Link>
              <span>/</span>
              <span>{typeName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {typeName} {t('examples.examples') || 'Examples'}
            </h1>
            <p className="text-xl max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              {type === 'cv' 
                ? (t('examples.cv_overview.description') || 'Browse professional CV examples by profession. Learn what makes a great CV and get inspired to create your own.')
                : (t('examples.letter_overview.description') || 'Browse professional motivational letter examples by profession. Learn what makes a great letter and get inspired to create your own.')}
            </p>
            
            {/* Under Construction Banner */}
            <div 
              className="mt-6 inline-flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
                }}
              >
                <FiTool className="text-white" size={16} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span 
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    color: '#b45309'
                  }}
                >
                  {t('examples.under_construction.badge') || 'Under Construction'}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('examples.under_construction.message') || "We're actively working on expanding this section with more detailed examples. Check back soon for updates!"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Introduction Section */}
          <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {(t('examples.overview.about_title') || `About ${typeName}s`).replace('{typeName}', typeName)}
            </h2>
            <div className="prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
              {type === 'cv' ? (
                <>
                  <p className="mb-4">
                    {t('examples.cv_overview.intro_1') || 'A well-crafted CV (Curriculum Vitae) is essential for standing out in today\'s competitive job market. It serves as your first impression to potential employers and should effectively communicate your skills, experience, and value proposition.'}
                  </p>
                  <p className="mb-4">
                    {t('examples.cv_overview.intro_2') || 'Key elements of a strong CV include:'}
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>{t('examples.cv_overview.key_1') || 'Clear, professional formatting that is easy to scan'}</li>
                    <li>{t('examples.cv_overview.key_2') || 'Relevant work experience with quantifiable achievements'}</li>
                    <li>{t('examples.cv_overview.key_3') || 'Skills that match the job requirements'}</li>
                    <li>{t('examples.cv_overview.key_4') || 'ATS-friendly keywords for applicant tracking systems'}</li>
                    <li>{t('examples.cv_overview.key_5') || 'Concise, impactful descriptions that highlight your value'}</li>
                  </ul>
                  <p>
                    {t('examples.cv_overview.intro_3') || 'Each profession has unique requirements and expectations. Browse the examples below to see how professionals in your field present their qualifications effectively.'}
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    {t('examples.letter_overview.intro_1') || 'A compelling motivational letter (cover letter) complements your CV by providing context for your application and demonstrating your genuine interest in the position. It\'s your opportunity to tell your story and connect with the hiring manager.'}
                  </p>
                  <p className="mb-4">
                    {t('examples.letter_overview.intro_2') || 'Key elements of an effective motivational letter include:'}
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>{t('examples.letter_overview.key_1') || 'Personalized greeting and opening that captures attention'}</li>
                    <li>{t('examples.letter_overview.key_2') || 'Clear connection between your skills and the job requirements'}</li>
                    <li>{t('examples.letter_overview.key_3') || 'Specific examples of achievements and experiences'}</li>
                    <li>{t('examples.letter_overview.key_4') || 'Demonstration of knowledge about the company and role'}</li>
                    <li>{t('examples.letter_overview.key_5') || 'Professional closing with a call to action'}</li>
                  </ul>
                  <p>
                    {t('examples.letter_overview.intro_3') || 'Different professions require different approaches. Explore the examples below to understand how to tailor your letter for your specific field.'}
                  </p>
                </>
              )}
            </div>
          </section>
          
          {/* Professions by Category */}
          {Object.entries(professionsByCategory).map(([category, professions]) => (
            <section key={category} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <FaBriefcase style={{ color: 'var(--accent-primary)' }} />
                {getCategoryName(category, language)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professions.map(({ id, translation }) => (
                  <Link
                    key={id}
                    href={`/${segments.examples}/${typeSegment}/${translation.slug}`}
                    className="rounded-lg p-6 hover:shadow-lg transition-all border group"
                    style={{ 
                      backgroundColor: 'var(--bg-elevated)', 
                      borderColor: 'var(--border-subtle)' 
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                          {translation.name}
                        </h3>
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {translation.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center font-medium text-sm group-hover:gap-2 transition-all" style={{ color: 'var(--accent-primary)' }}>
                      {t('examples.view_example') || 'View Example'}
                      <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          
          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center mt-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t('examples.cta.ready_title') || 'Ready to Create Your Own?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('examples.cta.ready_description') || 'Use our AI-powered builder to create a professional document tailored to your experience and skills.'}
            </p>
            <Link
              href={type === 'cv' ? '/' : '/?preferredArtifactType=letter'}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              {t('examples.cta.create_button') || `Create Your ${typeName}`}
              <FaArrowRight />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
