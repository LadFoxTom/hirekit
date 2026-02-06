'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { signOut } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import MobileUserMenu from '@/components/MobileUserMenu';
import { 
  FiChevronDown, FiChevronLeft, FiHelpCircle, FiMail, FiMessageCircle,
  FiGrid, FiSettings, FiLogOut, FiCreditCard, FiUser, FiFileText,
  FiShield, FiSmartphone, FiGlobe, FiDownload, FiEdit3, FiZap,
  FiFolder, FiBriefcase, FiX, FiExternalLink, FiClipboard
} from 'react-icons/fi';

// Menu Item Component (matching homepage)
function MenuItem({ 
  icon: Icon, 
  label, 
  onClick, 
  badge,
  external,
  variant = 'default',
  disabled = false,
  isActive = false
}: { 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; 
  onClick: () => void;
  badge?: string;
  external?: boolean;
  variant?: 'default' | 'danger';
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
        ...(isActive ? { 
          borderLeftWidth: '3px',
          borderLeftColor: '#3b82f6',
          backgroundColor: 'var(--bg-hover)',
        } : {}),
        color: disabled 
          ? 'var(--text-disabled)'
          : variant === 'danger'
            ? 'var(--text-primary)'
            : 'var(--text-primary)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* Icon container - fixed width for alignment */}
      <div 
        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
        style={{ 
          color: disabled 
            ? 'var(--text-disabled)'
            : variant === 'danger'
              ? 'var(--text-primary)'
              : 'var(--text-primary)'
        }}
      >
        <Icon 
          size={18} 
          className={disabled ? 'opacity-50' : ''}
        />
      </div>
      
      {/* Label - flex-grow to fill space */}
      <span className="flex-1 text-left ml-2">{label}</span>
      
      {/* Badge - right-aligned, absolute positioned to not affect width */}
      {badge && (
        <span 
          className="ml-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          {badge}
        </span>
      )}
      
      {external && (
        <FiExternalLink 
          size={14} 
          className="ml-2 flex-shrink-0" 
          style={{ color: 'var(--text-tertiary)' }}
        />
      )}
    </button>
  );
}

// FAQ data - will be populated with translations
type FAQItem = {
  icon: React.ComponentType<{ size?: number }>;
  category: string;
  question: string;
  answer: string;
};

const getFaqs = (t: (key: string) => string): FAQItem[] => [
  {
    icon: FiZap,
    category: t('faq.categories.getting_started'),
    question: t('faq.what_is_ladderfox'),
    answer: t('faq.what_is_ladderfox_answer')
  },
  {
    icon: FiCreditCard,
    category: t('faq.categories.pricing'),
    question: t('faq.is_free'),
    answer: t('faq.is_free_answer')
  },
  {
    icon: FiEdit3,
    category: t('faq.categories.getting_started'),
    question: t('faq.how_create_cv'),
    answer: t('faq.how_create_cv_answer')
  },
  {
    icon: FiDownload,
    category: t('faq.categories.features'),
    question: t('faq.can_download_pdf'),
    answer: t('faq.can_download_pdf_answer')
  },
  {
    icon: FiFileText,
    category: t('faq.categories.features'),
    question: t('faq.ats_friendly'),
    answer: t('faq.ats_friendly_answer')
  },
  {
    icon: FiShield,
    category: t('faq.categories.privacy'),
    question: t('faq.data_protection'),
    answer: t('faq.data_protection_answer')
  },
  {
    icon: FiEdit3,
    category: t('faq.categories.features'),
    question: t('faq.can_edit_after_save'),
    answer: t('faq.can_edit_after_save_answer')
  },
  {
    icon: FiMessageCircle,
    category: t('faq.categories.support'),
    question: t('faq.contact_support'),
    answer: t('faq.contact_support_answer')
  },
  {
    icon: FiGlobe,
    category: t('faq.categories.features'),
    question: t('faq.languages_supported'),
    answer: t('faq.languages_supported_answer')
  },
  {
    icon: FiSmartphone,
    category: t('faq.categories.features'),
    question: t('faq.mobile_support'),
    answer: t('faq.mobile_support_answer')
  },
];

export default function FAQPage() {
  const { isAuthenticated, user, subscription } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage, availableLanguages } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free';
  const faqs = getFaqs(t);

  // Close user menu when clicking outside (mouse + touch)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const clickedInsideButton = userMenuRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown (faq)')
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' } }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl border-b z-50" style={{ overflow: 'visible', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', opacity: 0.95 }}>
        <div className="h-full max-w-screen-2xl mx-auto px-2 sm:px-4 flex items-center justify-between gap-2" style={{ overflow: 'visible' }}>
          {/* Left: Back & Logo */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FiChevronLeft size={20} />
            </button>
            <a href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0" style={{ color: 'var(--text-primary)' }}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block whitespace-nowrap">LadderFox</span>
            </a>
          </div>

          {/* Right: Language, Theme & User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                <button 
                    onClick={() => {
                      console.log('[UserMenu] toggle click (faq)', { wasOpen: isUserMenuOpen });
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <FiChevronDown size={14} className={`transition-transform hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                </button>
                
                {/* Desktop: Original dropdown (mobile menu is at root level) */}
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
                  className="px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {t('nav.sign_in')}
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }}
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
              style={{ backgroundColor: 'var(--overlay)' }}
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
                width: '80px',
              }}
            >
              <div className="p-4 space-y-2">
                {/* Close Button */}
                <div className="flex items-center justify-end mb-2">
                  <button
                    onClick={() => setIsLanguageMenuOpen(false)}
                    className="p-2 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Close language menu"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Language Options */}
                <div className="space-y-2">
                  {availableLanguages.map((lang) => {
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
                      'sr': '/flags/rs.svg'
                    };
                    const flagSrc = flagMap[lang.code] || '';
                    
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center p-3 rounded-lg transition-colors"
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
                        {flagSrc ? (
                          <img 
                            src={flagSrc} 
                            alt={`${lang.code.toUpperCase()} flag`}
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
                        ) : (
                          <span style={{ fontSize: '20px' }}>🏳️</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-14">
        {/* Hero */}
        <div className="py-16 px-4 text-center" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiHelpCircle size={32} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>{t('faq.page.hero.title')}</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {t('faq.page.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 p-5 text-left transition-colors focus:outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: openIndex === index ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-tertiary)',
                      color: openIndex === index ? '#60a5fa' : 'var(--text-tertiary)'
                    }}
                  >
                    <faq.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>{faq.category}</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{faq.question}</p>
                  </div>
                  <FiChevronDown 
                    size={20} 
                    className="transition-transform flex-shrink-0"
                    style={{ 
                      color: 'var(--text-tertiary)',
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-[76px]">
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.answer}</p>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid var(--border-medium)' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>Still have questions?</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@ladderfox.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                }}
              >
                <FiMail size={18} />
                Email Support
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <FiMessageCircle size={18} />
                Ask AI Assistant
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <p>© {new Date().getFullYear()} LadderFox. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="transition-colors" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Privacy</a>
              <a href="/terms" className="transition-colors" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Terms</a>
              <a href="/data-compliance" className="transition-colors" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}>Data Compliance</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
