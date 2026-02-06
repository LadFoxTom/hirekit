'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { getProfession, URL_SEGMENTS, type Language } from '@/data/professions'
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
import { FaCheckCircle, FaArrowRight, FaFileAlt, FaUser } from 'react-icons/fa'
import { CVPreviewServer } from '@/components/CVPreviewServer'
import { getExampleCV } from '@/data/exampleCVs'

interface ExamplePageProps {
  professionId: string
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

export default function ExamplePage({ professionId, type, language }: ExamplePageProps) {
  const { t, language: currentLanguage } = useLocale()
  const { user, subscription } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const profession = getProfession(professionId, language)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActiveOrTrialing = subscription?.status === 'active' || subscription?.status === 'trialing'
  const plan = isActiveOrTrialing ? (subscription?.plan || 'free') : 'free'
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
  
  if (!profession) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 pt-24">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('examples.not_found.title') || 'Example Not Found'}
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t('examples.not_found.description') || 'The requested example could not be found.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-primary)' }}
          >
            {t('examples.back_to_home') || 'Back to Home'} →
          </Link>
        </div>
      </div>
    )
  }
  
  const segments = URL_SEGMENTS[language]
  const typeName = type === 'cv' 
    ? (t('examples.cv') || 'CV')
    : (t('examples.letter') || 'Motivational Letter')
  
  const ctaUrl = type === 'cv' ? '/' : '/?preferredArtifactType=letter'

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
              <Link href={`/${segments.examples}/${type === 'cv' ? segments.cv : segments.letter}`} className="hover:opacity-80 transition-opacity">
                {typeName}
              </Link>
              <span>/</span>
              <span>{profession.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {profession.name} {typeName} {t('examples.example') || 'Example'}
            </h1>
            <p className="text-xl mb-6 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              {profession.description}
            </p>
            
            {/* Under Construction Banner */}
            <div 
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
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
          {/* Why This Example is Good */}
          <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FaCheckCircle style={{ color: 'var(--accent-success)' }} />
              {t('examples.why_good.title') || 'Why This Example is Effective'}
            </h2>
            <ul className="space-y-4">
              {profession.whyGood.map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5"
                    style={{ backgroundColor: 'var(--accent-success)', color: 'white', opacity: 0.2 }}
                  >
                    {index + 1}
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reason}</p>
                </li>
              ))}
            </ul>
          </section>
          
          {/* Key Skills */}
          <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FaUser style={{ color: 'var(--accent-primary)' }} />
              {t('examples.key_skills.title') || 'Key Skills for This Profession'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profession.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <FaCheckCircle className="flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{skill}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Tips */}
          <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {(t('examples.tips.title') || 'Tips for Creating Your {typeName}').replace('{typeName}', typeName)}
            </h2>
            <div className="space-y-4">
              {profession.tips.map((tip, index) => (
                <div key={index} className="pl-4 py-2" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Visual Preview */}
          {type === 'cv' && (
            <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                {t('examples.preview.title') || 'Example Preview'}
              </h2>
              <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', maxHeight: '800px', overflowY: 'auto' }}>
                <div className="max-w-4xl mx-auto" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                  <CVPreviewServer data={getExampleCV(professionId, language === 'nl' || language === 'en' ? language : 'nl')} isPreview={true} />
                </div>
              </div>
            </section>
          )}
          {type === 'letter' && (
            <section className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                {t('examples.preview.title') || 'Example Preview'}
              </h2>
              <div className="rounded-lg p-12 text-center border-2 border-dashed" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <FaFileAlt className="mx-auto text-6xl mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {t('examples.preview.placeholder') || 'Letter preview will be displayed here'}
                </p>
              </div>
            </section>
          )}
          
          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {(t('examples.cta.title') || 'Ready to Create Your Own {typeName}?').replace('{typeName}', typeName)}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {(t('examples.cta.description') || 'Use our AI-powered builder to create a professional {typeName} tailored to your experience and skills.').replace('{typeName}', typeName)}
            </p>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              {(t('examples.cta.button') || 'Create Your {typeName}').replace('{typeName}', typeName)}
              <FaArrowRight />
            </Link>
          </section>
          
          {/* Related Examples */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {t('examples.related.title') || 'Explore More Examples'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/${segments.examples}/${type === 'cv' ? segments.cv : segments.letter}`}
                className="rounded-lg p-6 hover:shadow-lg transition-all border"
                style={{ 
                  backgroundColor: 'var(--bg-elevated)', 
                  borderColor: 'var(--border-subtle)' 
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {(t('examples.related.all') || 'All {typeName} Examples').replace('{typeName}', typeName)}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('examples.related.browse') || 'Browse all examples for this document type'}
                </p>
              </Link>
              <Link
                href={`/${segments.examples}`}
                className="rounded-lg p-6 hover:shadow-lg transition-all border"
                style={{ 
                  backgroundColor: 'var(--bg-elevated)', 
                  borderColor: 'var(--border-subtle)' 
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t('examples.related.examples') || 'All Examples'}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('examples.related.browse_all') || 'Browse all CV and letter examples'}
                </p>
              </Link>
              <Link
                href="/"
                className="rounded-lg p-6 hover:shadow-lg transition-all border"
                style={{ 
                  backgroundColor: 'var(--bg-elevated)', 
                  borderColor: 'var(--border-subtle)' 
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t('examples.related.builder') || 'CV Builder'}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('examples.related.start_building') || 'Start building your CV now'}
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
