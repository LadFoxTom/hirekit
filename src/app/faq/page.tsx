'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  FiChevronDown, FiChevronLeft, FiHelpCircle, FiMail, FiMessageCircle,
  FiGrid, FiSettings, FiLogOut, FiCreditCard, FiUser, FiFileText,
  FiShield, FiSmartphone, FiGlobe, FiDownload, FiEdit3, FiZap,
  FiFolder, FiBriefcase, FiX
} from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Left: Back & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </a>
          </div>

          {/* Right: Language, Theme & User Menu */}
          <div className="flex items-center gap-2">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                <button 
                    onClick={() => {
                      console.log('[UserMenu] toggle click (faq)', { wasOpen: isUserMenuOpen });
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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
                      className="hidden lg:block absolute left-auto right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-[9999]"
                      style={{ width: '320px', minWidth: '320px', maxWidth: '320px' }}
                    >
                      {/* User Info */}
                      <div className="px-3 py-2.5 border-b border-white/10">
                        <p className="font-semibold text-sm text-white leading-tight mb-0.5 truncate">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-gray-400 truncate leading-relaxed" style={{ opacity: 0.7 }}>{user?.email}</p>
                      </div>
                      
                      {/* Navigation Items */}
                      <div className="py-1.5">
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} 
                          className={`w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 ${pathname === '/dashboard' ? 'bg-white/5 border-l-3 border-blue-500' : ''}`}
                          style={pathname === '/dashboard' ? { borderLeftWidth: '3px' } : undefined}
                          aria-current={pathname === '/dashboard' ? 'page' : undefined}
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiGrid size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.dashboard')}</span>
                        </button>
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }} 
                          className="w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150"
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiFolder size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.my_cvs')}</span>
                        </button>
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }} 
                          disabled
                          aria-disabled="true"
                          className="w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiBriefcase size={18} className="opacity-50" />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.job_applications_short')}</span>
                        </button>
                      </div>
                      
                      {/* Account Items */}
                      <div className="border-t border-white/10 py-1.5">
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }} 
                          className={`w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 ${pathname === '/pricing' ? 'bg-white/5 border-l-3 border-blue-500' : ''}`}
                          style={pathname === '/pricing' ? { borderLeftWidth: '3px' } : undefined}
                          aria-current={pathname === '/pricing' ? 'page' : undefined}
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiCreditCard size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.subscription')}</span>
                          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-[10px] font-medium rounded-full flex-shrink-0">{subBadge}</span>
                        </button>
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }} 
                          className={`w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 ${pathname === '/settings' ? 'bg-white/5 border-l-3 border-blue-500' : ''}`}
                          style={pathname === '/settings' ? { borderLeftWidth: '3px' } : undefined}
                          aria-current={pathname === '/settings' ? 'page' : undefined}
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiSettings size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.settings')}</span>
                        </button>
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }} 
                          className={`w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 ${pathname === '/faq' ? 'bg-white/5 border-l-3 border-blue-500' : ''}`}
                          style={pathname === '/faq' ? { borderLeftWidth: '3px' } : undefined}
                          aria-current={pathname === '/faq' ? 'page' : undefined}
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiHelpCircle size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.help_support_short')}</span>
                        </button>
                      </div>
                      
                      {/* Action Items */}
                      <div className="border-t border-white/10 py-1.5">
                        <button 
                          onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }} 
                          className="w-full flex items-center min-h-[44px] px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150"
                        >
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <FiLogOut size={18} />
                          </div>
                          <span className="flex-1 text-left ml-2">{t('nav.sign_out')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.sign_in')}
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {t('nav.get_started')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Menu (Mobile) - Same structure as hamburger menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* User Menu - Slide in from right (like hamburger from left) */}
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-[280px] bg-[#1a1a1a] border-l border-white/5 z-40 overflow-y-auto lg:hidden"
            >
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/5 mb-4">
                  <p className="font-medium text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiGrid size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.dashboard')}</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiFolder size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.my_cvs')}</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiBriefcase size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.job_applications_coming_soon')}</span>
                  </button>
                </div>
                
                <div className="border-t border-white/5 pt-2 mt-2 space-y-1">
                  <button
                    onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FiCreditCard size={14} className="text-gray-400" />
                      <span className="text-sm">{t('nav.subscription')}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium rounded-full">{subBadge}</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiSettings size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.settings')}</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiHelpCircle size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.help_support')}</span>
                  </button>
                </div>
                
                {/* Theme & Language */}
                <div className="border-t border-white/5 pt-2 mt-2">
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Language</span>
                      <LanguageSelector />
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Theme</span>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-2 mt-2">
                  <button
                    onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <FiLogOut size={14} />
                    <span className="text-sm">{t('nav.sign_out')}</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Language Menu - Slide in from right */}
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-[80px] z-40 overflow-y-auto lg:hidden"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-subtle)',
              }}
            >
              <div className="p-2 space-y-2">
                {/* Close button */}
                <div className="flex justify-end mb-2">
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
                    <FiX size={16} />
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
                      'de': '/flags/de.svg'
                    };
                    const flagSrc = flagMap[lang.code] || '';
                    
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center p-2 transition-colors rounded-lg"
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
        <div className="py-16 px-4 text-center border-b border-white/5">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiHelpCircle size={32} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('faq.page.hero.title')}</h1>
            <p className="text-gray-400 text-lg">
              {t('faq.page.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    openIndex === index 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    <faq.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{faq.category}</p>
                    <p className="font-medium text-white">{faq.question}</p>
                  </div>
                  <FiChevronDown 
                    size={20} 
                    className={`text-gray-400 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} 
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
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-3xl mx-auto px-4 pb-20">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@ladderfox.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FiMail size={18} />
                Email Support
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                <FiMessageCircle size={18} />
                Ask AI Assistant
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} LadderFox. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/data-compliance" className="hover:text-white transition-colors">Data Compliance</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
