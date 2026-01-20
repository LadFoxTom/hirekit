'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { Toaster, toast } from 'react-hot-toast'
import { STRIPE_PLANS, BILLING_INTERVALS } from '@/lib/stripe'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiCheck, FiX, FiArrowLeft, FiShield, FiClock, FiZap, 
  FiFileText, FiDownload, FiStar, FiCreditCard, FiChevronDown,
  FiGrid, FiSettings, FiLogOut, FiHelpCircle, FiFolder, FiBriefcase
} from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import Head from 'next/head'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user, subscription } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t, language, setLanguage, availableLanguages } = useLocale()

  // Close user menu when clicking outside (mouse + touch)
  useEffect(() => {
    if (!isUserMenuOpen) return
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const clickedInsideButton = userMenuRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown')
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Get user's currency (default to EUR)
  const getUserCurrency = () => {
    return 'EUR'
  }

  const currency = getUserCurrency()
  const currencySymbol = currency === 'EUR' ? '€' : '$'
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free'
  
  // Render menu content (used in desktop dropdown)
  const renderMenuContent = () => (
    <>
      {/* User Info */}
      <div className="px-3 py-2.5 border-b border-white/10">
        <p className="font-semibold text-sm text-white leading-tight mb-0.5 truncate">{user?.name || 'User'}</p>
        <p className="text-[11px] text-gray-400 truncate leading-relaxed" style={{ opacity: 0.7 }}>{user?.email || 'user@example.com'}</p>
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
    </>
  )
  

  const getPriceForInterval = (interval: string) => {
    switch (interval) {
      case 'monthly':
        return STRIPE_PLANS.basic.priceMonthly
      case 'quarterly':
        return STRIPE_PLANS.basic.priceQuarterly
      case 'yearly':
        return STRIPE_PLANS.basic.priceYearly
      default:
        return STRIPE_PLANS.basic.priceYearly
    }
  }

  const getMonthlyPrice = (interval: string) => {
    const price = getPriceForInterval(interval)
    const months = BILLING_INTERVALS[interval as keyof typeof BILLING_INTERVALS].months
    return (price / months).toFixed(2)
  }

  const handleSubscribe = async (plan: string, interval?: string) => {
    setSelectedPlan(plan)
    
    if (!isAuthenticated) {
      toast.error(t('pricing.please_login'))
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          interval: interval || billingInterval,
          currency,
          successUrl: `${window.location.origin}/?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error(t('pricing.failed_subscription'))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to check if user is subscribed
  const isSubscribed = subscription && ['basic', 'pro'].includes(subscription.plan) && subscription.status === 'active'

  return (
    <>
      <Head>
        <title>Pricing - LadderFox CV Builder</title>
        <meta name="description" content="Choose the perfect plan for your CV building needs. Free plan available with premium features starting at €49.99/year." />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
            {/* Left: Back & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
              >
                <FiArrowLeft size={20} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                  LF
                </div>
                <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
              </Link>
            </div>

            {/* Right: Language, Theme & Auth */}
            <div className="flex items-center gap-2">
              <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
              <ThemeSwitcher />
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                        {renderMenuContent()}
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
        
        <main className="pt-14 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                {t('pricing.badge')}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">
                {t('pricing.subtitle')}
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-12"
            >
              <div className="bg-[#1a1a1a] rounded-xl p-1 border border-white/10 flex">
                {Object.entries(BILLING_INTERVALS).map(([interval, config]) => (
                  <button
                    key={interval}
                    onClick={() => setBillingInterval(interval as any)}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      billingInterval === interval
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {interval === 'monthly' ? t('pricing.billing.monthly') : 
                     interval === 'quarterly' ? t('pricing.billing.quarterly') : 
                     t('pricing.billing.yearly')}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
              {/* Free Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] rounded-2xl border border-white/10 p-8 relative overflow-hidden flex flex-col"
              >
                {/* Current Plan Badge for logged-in users */}
                {isAuthenticated && !isSubscribed && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-emerald-500/90 text-white text-xs font-medium px-4 py-1.5 rounded-bl-xl">
                      {t('pricing.current_plan')}
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Header section - fixed height */}
                  <div className="mb-6 min-h-[100px]">
                    <h3 className="text-xl font-semibold text-white mb-2">{t('pricing.plan.free')}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">€0</span>
                      <span className="text-gray-500">{t('pricing.per_forever')}</span>
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">{t('pricing.perfect_starting')}</p>
                  </div>
                  
                  {/* Features list - grows to fill space */}
                  <ul className="space-y-3 flex-grow">
                    {STRIPE_PLANS.free.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheck className="text-gray-500 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3">
                      <FiX className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-gray-500 text-sm">{t('pricing.comparison.pdf_export')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FiX className="text-gray-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-gray-500 text-sm">{t('pricing.comparison.cover_letter_generator')}</span>
                    </li>
                  </ul>
                  
                  {/* Button - fixed at bottom */}
                  <div className="mt-8">
                    {isAuthenticated && !isSubscribed ? (
                      <div className="w-full bg-emerald-500/20 text-emerald-400 py-3 px-6 rounded-xl font-medium text-center border border-emerald-500/30">
                        {t('pricing.active')}
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-xl font-medium transition-colors border border-white/10"
                      >
                        {t('pricing.get_started_free')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Basic Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-b from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 p-8 relative overflow-hidden flex flex-col"
              >
                {/* Popular Badge */}
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-4 py-1.5 rounded-bl-xl">
                    {t('pricing.most_popular')}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Header section - fixed height */}
                  <div className="mb-6 min-h-[100px]">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                      {t('pricing.plan.basic')}
                      <FiStar className="text-yellow-500" size={16} />
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{currencySymbol}{getPriceForInterval(billingInterval)}</span>
                      <span className="text-gray-400">
                        /{billingInterval === 'monthly' ? 'mo' : billingInterval === 'quarterly' ? 'qtr' : 'yr'}
                      </span>
                    </div>
                    {billingInterval !== 'monthly' && (
                      <p className="text-gray-400 mt-1 text-sm">
                        {currencySymbol}{getMonthlyPrice(billingInterval)}/month
                      </p>
                    )}
                  </div>
                  
                  {/* Features list - grows to fill space */}
                  <ul className="space-y-3 flex-grow">
                    {STRIPE_PLANS.basic.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheck className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-200 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Button - fixed at bottom */}
                  <div className="mt-8">
                    <button
                      onClick={() => handleSubscribe('basic')}
                      disabled={isLoading || isSubscribed}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t('pricing.processing')}
                        </span>
                      ) : isSubscribed ? (
                        t('pricing.current_plan_badge')
                      ) : (
                        t('pricing.start_trial')
                      )}
                    </button>
                  </div>
                </div>

                {/* Background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mb-16"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <FiShield className="text-green-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.secure_payment')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiClock className="text-blue-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.cancel_anytime')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiZap className="text-yellow-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.instant_access')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiCreditCard className="text-purple-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.powered_by_stripe')}</span>
              </div>
            </motion.div>

            {/* Feature Comparison */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.comparison.title')}</h2>
              <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 font-medium">{t('pricing.comparison.feature')}</th>
                      <th className="text-center p-4 text-gray-400 font-medium">{t('pricing.plan.free')}</th>
                      <th className="text-center p-4 text-gray-400 font-medium">{t('pricing.plan.basic')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.cv_builder')}</td>
                      <td className="p-4 text-center"><FiCheck className="inline text-gray-500" /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.number_of_cvs')}</td>
                      <td className="p-4 text-center text-gray-500">1</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.unlimited')}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.templates')}</td>
                      <td className="p-4 text-center text-gray-500">{t('pricing.comparison.basic_templates')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.all_templates')}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.ai_chat_assistant')}</td>
                      <td className="p-4 text-center text-gray-500">{t('pricing.comparison.limited')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.unlimited')}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.pdf_export')}</td>
                      <td className="p-4 text-center"><FiX className="inline text-gray-600" /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.cover_letter_generator')}</td>
                      <td className="p-4 text-center"><FiX className="inline text-gray-600" /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-300">{t('pricing.comparison.job_matching')}</td>
                      <td className="p-4 text-center"><FiX className="inline text-gray-600" /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-16"
            >
              <h2 className="text-2xl font-bold mb-4">{t('pricing.cta.title')}</h2>
              <p className="text-gray-400 mb-8">
                {t('pricing.cta.subtitle')}
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                {t('pricing.cta.button')}
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}
