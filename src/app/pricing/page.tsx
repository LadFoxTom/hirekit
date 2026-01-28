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
  FiGrid, FiSettings, FiLogOut, FiHelpCircle, FiFolder, FiBriefcase, FiExternalLink, FiClipboard, FiPlus
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

  // Render menu content (used in desktop dropdown)
  const renderMenuContent = () => (
    <>
      {/* User Info */}
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="font-semibold text-sm leading-tight mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
        <p className="text-[11px] truncate leading-relaxed" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>{user?.email || 'user@example.com'}</p>
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
    </>
  )
  

  const getPriceForInterval = (interval: string) => {
    switch (interval) {
      case 'monthly':
        // For monthly, show trial price (setup fee)
        return STRIPE_PLANS.basic.priceTrial || STRIPE_PLANS.basic.priceMonthly
      case 'quarterly':
        // For quarterly, show trial price (setup fee) - same for all intervals
        return STRIPE_PLANS.basic.priceTrial || (STRIPE_PLANS.basic.priceQuarterly * 3).toFixed(2)
      case 'yearly':
        // For yearly, show trial price (setup fee) - same for all intervals
        return STRIPE_PLANS.basic.priceTrial || STRIPE_PLANS.basic.priceYearly
      default:
        return STRIPE_PLANS.basic.priceTrial || STRIPE_PLANS.basic.priceYearly
    }
  }

  const getMonthlyPrice = (interval: string) => {
    switch (interval) {
      case 'monthly':
        // After trial, monthly price
        return STRIPE_PLANS.basic.priceMonthly.toFixed(2)
      case 'quarterly':
        // priceQuarterly is already per month
        return STRIPE_PLANS.basic.priceQuarterly.toFixed(2)
      case 'yearly':
        // Calculate monthly equivalent for yearly
        return (STRIPE_PLANS.basic.priceYearly / 12).toFixed(2)
      default:
        return STRIPE_PLANS.basic.priceMonthly.toFixed(2)
    }
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
        <meta name="description" content="Choose the perfect plan for your CV building needs. Free plan available with premium features starting at €3.99 for 7-day trial, then €14.99/month." />
      </Head>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' } }} />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl z-50" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)', opacity: 0.95 }}>
          <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
            {/* Left: Back & Logo */}
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

            {/* Right: Language, Theme & Auth */}
            <div className="flex items-center gap-2">
              <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
              <ThemeSwitcher />
              {isAuthenticated ? (
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
                        {renderMenuContent()}
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
                className="fixed inset-0 z-40 lg:hidden"
                style={{ backgroundColor: 'var(--overlay)' }}
              />
              
              {/* User Menu - Slide in from right (like hamburger from left) */}
              <motion.aside
                initial={{ x: 280 }}
                animate={{ x: 0 }}
                exit={{ x: 280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-14 right-0 bottom-0 w-[280px] z-40 overflow-y-auto lg:hidden"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderLeft: '1px solid var(--border-subtle)',
                }}
              >
                <div className="p-4 space-y-4">
                  {/* User Info */}
                  <div className="px-4 py-3 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <p className="font-semibold text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                    <p className="text-xs truncate leading-relaxed" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  {/* Navigation Items */}
                  <div className="space-y-1">
                    <button
                      onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{
                        ...(pathname === '/dashboard' ? { 
                          borderLeftWidth: '3px',
                          borderLeftColor: '#3b82f6',
                          backgroundColor: 'var(--bg-hover)',
                        } : {}),
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== '/dashboard') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== '/dashboard') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      aria-current={pathname === '/dashboard' ? 'page' : undefined}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiGrid size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.dashboard')}</span>
                    </button>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiFolder size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.my_cvs')}</span>
                    </button>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiBriefcase size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.job_applications_coming_soon')}</span>
                    </button>
                  </div>
                  
                  {/* Account Items */}
                  <div className="pt-1.5 mt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{
                        ...(pathname === '/pricing' ? { 
                          borderLeftWidth: '3px',
                          borderLeftColor: '#3b82f6',
                          backgroundColor: 'var(--bg-hover)',
                        } : {}),
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== '/pricing') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== '/pricing') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      aria-current={pathname === '/pricing' ? 'page' : undefined}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiCreditCard size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.subscription')}</span>
                      <span className="ml-auto px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{subBadge}</span>
                    </button>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{
                        ...(pathname === '/settings' ? { 
                          borderLeftWidth: '3px',
                          borderLeftColor: '#3b82f6',
                          backgroundColor: 'var(--bg-hover)',
                        } : {}),
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== '/settings') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== '/settings') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      aria-current={pathname === '/settings' ? 'page' : undefined}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiSettings size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.settings')}</span>
                    </button>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{
                        ...(pathname === '/faq' ? { 
                          borderLeftWidth: '3px',
                          borderLeftColor: '#3b82f6',
                          backgroundColor: 'var(--bg-hover)',
                        } : {}),
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== '/faq') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== '/faq') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      aria-current={pathname === '/faq' ? 'page' : undefined}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiHelpCircle size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.help_support_short')}</span>
                    </button>
                  </div>
                  
                  {/* Theme & Language */}
                  <div className="pt-1.5 mt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Language</span>
                        <LanguageSelector />
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Theme</span>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Items */}
                  <div className="pt-1.5 mt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <FiLogOut size={20} />
                      </div>
                      <span className="flex-1 text-left ml-3">{t('nav.sign_out')}</span>
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
        
        <main className="pt-14 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{t('pricing.title')}</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{t('pricing.subtitle')}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="rounded-xl p-2 space-y-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => setBillingInterval('monthly')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: billingInterval === 'monthly' ? 'var(--bg-hover)' : 'transparent',
                      color: billingInterval === 'monthly' ? 'var(--text-primary)' : 'var(--text-tertiary)'
                    }}
                    onMouseEnter={(e) => {
                      if (billingInterval !== 'monthly') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (billingInterval !== 'monthly') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiCreditCard size={18} /> {t('pricing.billing.monthly')}
                  </button>
                  <button
                    onClick={() => setBillingInterval('quarterly')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: billingInterval === 'quarterly' ? 'var(--bg-hover)' : 'transparent',
                      color: billingInterval === 'quarterly' ? 'var(--text-primary)' : 'var(--text-tertiary)'
                    }}
                    onMouseEnter={(e) => {
                      if (billingInterval !== 'quarterly') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (billingInterval !== 'quarterly') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiCreditCard size={18} /> {t('pricing.billing.quarterly')}
                  </button>
                  <button
                    onClick={() => setBillingInterval('yearly')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: billingInterval === 'yearly' ? 'var(--bg-hover)' : 'transparent',
                      color: billingInterval === 'yearly' ? 'var(--text-primary)' : 'var(--text-tertiary)'
                    }}
                    onMouseEnter={(e) => {
                      if (billingInterval !== 'yearly') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (billingInterval !== 'yearly') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiCreditCard size={18} /> {t('pricing.billing.yearly')}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-tertiary)' }}>{t('settings.quick_actions')}</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push('/')} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <FiPlus size={14} /> {t('settings.create_new_cv')}
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard')} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <FiGrid size={14} /> {t('settings.view_dashboard')}
                    </button>
                    <button 
                      onClick={() => router.push('/settings')} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <FiSettings size={14} /> {t('settings.title')}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
                {/* Billing Toggle - Now inside main content */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center mb-8"
                >
              <div className="rounded-xl p-1 flex" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                {Object.entries(BILLING_INTERVALS).map(([interval, config]) => (
                  <button
                    key={interval}
                    onClick={() => setBillingInterval(interval as any)}
                    className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all"
                    style={{
                      backgroundColor: billingInterval === interval ? 'var(--bg-elevated)' : 'transparent',
                      color: billingInterval === interval ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      boxShadow: billingInterval === interval ? 'var(--shadow-md)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (billingInterval !== interval) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (billingInterval !== interval) {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {interval === 'monthly' ? t('pricing.billing.monthly') : 
                     interval === 'quarterly' ? t('pricing.billing.quarterly') : 
                     t('pricing.billing.yearly')}
                  </button>
                ))}
              </div>
            </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Free Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-8 relative overflow-hidden flex flex-col"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                {/* Current Plan Badge for logged-in users */}
                {isAuthenticated && !isSubscribed && (
                  <div className="absolute top-0 right-0">
                    <div className="text-xs font-medium px-4 py-1.5 rounded-bl-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.9)', color: '#fff' }}>
                      {t('pricing.current_plan')}
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Header section - fixed height */}
                  <div className="mb-6 min-h-[100px]">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>{t('pricing.plan.free')}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>€0</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{t('pricing.per_forever')}</span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('pricing.perfect_starting')}</p>
                  </div>
                  
                  {/* Features list - grows to fill space */}
                  <ul className="space-y-3 flex-grow">
                    {STRIPE_PLANS.free.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheck className="mt-0.5 flex-shrink-0" size={16} style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3">
                      <FiX className="mt-0.5 flex-shrink-0" size={16} style={{ color: 'var(--text-disabled)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.comparison.pdf_export')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FiX className="mt-0.5 flex-shrink-0" size={16} style={{ color: 'var(--text-disabled)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.comparison.cover_letter_generator')}</span>
                    </li>
                  </ul>
                  
                  {/* Button - fixed at bottom */}
                  <div className="mt-8">
                    {isAuthenticated && !isSubscribed ? (
                      <div className="w-full py-3 px-6 rounded-xl font-medium text-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                        {t('pricing.active')}
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 px-6 rounded-xl font-medium transition-colors"
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
                className="rounded-2xl p-8 relative overflow-hidden flex flex-col"
                style={{ 
                  background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                {/* Popular Badge */}
                <div className="absolute top-0 right-0">
                  <div className="text-xs font-medium px-4 py-1.5 rounded-bl-xl" style={{ background: 'linear-gradient(to right, #3b82f6, #a855f7)', color: '#fff' }}>
                    {t('pricing.most_popular')}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Header section - fixed height */}
                  <div className="mb-6 min-h-[100px]">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                      {t('pricing.plan.basic')}
                      <FiStar className="text-yellow-500" size={16} />
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{currencySymbol}{getPriceForInterval(billingInterval)}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {billingInterval === 'monthly' ? ' trial' : billingInterval === 'quarterly' ? ' trial' : ' trial'}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {t('pricing.trial_info')
                          .replace('{trialPrice}', currencySymbol + STRIPE_PLANS.basic.priceTrial)
                          .replace('{monthlyPrice}', currencySymbol + getMonthlyPrice(billingInterval))
                          .replace('{days}', STRIPE_PLANS.basic.trialDays.toString())}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {billingInterval === 'monthly' 
                          ? t('pricing.trial_auto_renew')
                          : billingInterval === 'quarterly'
                          ? `After trial, automatically renews to ${currencySymbol}${getMonthlyPrice(billingInterval)}/month (${currencySymbol}${(parseFloat(getMonthlyPrice(billingInterval)) * 3).toFixed(2)} per quarter)`
                          : `After trial, automatically renews to ${currencySymbol}${getMonthlyPrice(billingInterval)}/month (${currencySymbol}${(parseFloat(getMonthlyPrice(billingInterval)) * 12).toFixed(2)} per year)`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Features list - grows to fill space */}
                  <ul className="space-y-3 flex-grow">
                    {STRIPE_PLANS.basic.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheck className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Button - fixed at bottom */}
                  <div className="mt-8">
                    <button
                      onClick={() => handleSubscribe('basic')}
                      disabled={isLoading || isSubscribed}
                      className="w-full py-3 px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #9333ea)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #a855f7)';
                        }
                      }}
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
                  className="flex flex-wrap justify-center gap-8 mb-8"
                >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiShield className="text-green-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.secure_payment')}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiClock className="text-blue-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.cancel_anytime')}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiZap className="text-yellow-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.instant_access')}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiCreditCard className="text-purple-500" size={18} />
                <span className="text-sm">{t('pricing.trust_indicators.powered_by_stripe')}</span>
              </div>
            </motion.div>

                {/* Feature Comparison */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
              <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-heading)' }}>{t('pricing.comparison.title')}</h2>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th className="text-left p-4 font-medium" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.comparison.feature')}</th>
                      <th className="text-center p-4 font-medium" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.plan.free')}</th>
                      <th className="text-center p-4 font-medium" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.plan.basic')}</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.cv_builder')}</td>
                      <td className="p-4 text-center"><FiCheck className="inline" style={{ color: 'var(--text-tertiary)' }} /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.number_of_cvs')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.unlimited')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.unlimited')}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.templates')}</td>
                      <td className="p-4 text-center" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.comparison.basic_templates')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.all_templates')}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.ai_chat_assistant')}</td>
                      <td className="p-4 text-center" style={{ color: 'var(--text-tertiary)' }}>{t('pricing.comparison.limited')}</td>
                      <td className="p-4 text-center text-blue-400">{t('pricing.comparison.unlimited')}</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.pdf_export')}</td>
                      <td className="p-4 text-center"><FiX className="inline" style={{ color: 'var(--text-disabled)' }} /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.cover_letter_generator')}</td>
                      <td className="p-4 text-center"><FiX className="inline" style={{ color: 'var(--text-disabled)' }} /></td>
                      <td className="p-4 text-center"><FiCheck className="inline text-blue-400" /></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{t('pricing.comparison.job_matching')}</td>
                      <td className="p-4 text-center"><FiX className="inline" style={{ color: 'var(--text-disabled)' }} /></td>
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
                  className="text-center mt-8"
                >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>{t('pricing.cta.title')}</h2>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                {t('pricing.cta.subtitle')}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 rounded-xl font-medium transition-colors"
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
                  {t('pricing.cta.button')}
                </button>
              </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
