'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, FiUser, FiCreditCard, FiSettings, FiLogOut, 
  FiChevronDown, FiGrid, FiHelpCircle, FiCheck, FiStar,
  FiSave, FiPlus, FiExternalLink, FiFolder, FiBriefcase, FiX, FiClipboard
} from 'react-icons/fi'

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
import { signOut } from 'next-auth/react'
import { STRIPE_PLANS } from '@/lib/stripe'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function SettingsPage() {
  const { user, subscription, logout, isLoading, refreshUser } = useAuth()
  const { t, language, setLanguage, availableLanguages } = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isManagingSubscription, setIsManagingSubscription] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<'profile' | 'subscription'>('profile')
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free'

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    avatarUrl: '',
    jobTitle: '',
    company: '',
    linkedinUrl: '',
    websiteUrl: '',
    bio: '',
    language: '',
    dateOfBirth: '',
    gender: '',
  })
  const [saving, setSaving] = useState(false)

  // Close user menu when clicking outside (mouse + touch)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const clickedInsideButton = userMenuRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown (settings)')
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

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await fetch('/api/user')
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setProfile({
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              name: data.user.name || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              address: data.user.address || '',
              city: data.user.city || '',
              state: data.user.state || '',
              postalCode: data.user.postalCode || '',
              country: data.user.country || '',
              avatarUrl: data.user.avatarUrl || '',
              jobTitle: data.user.jobTitle || '',
              company: data.user.company || '',
              linkedinUrl: data.user.linkedinUrl || '',
              websiteUrl: data.user.websiteUrl || '',
              bio: data.user.bio || '',
              language: data.user.language || '',
              dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.substring(0, 10) : '',
              gender: data.user.gender || '',
            })
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    }
    if (user) loadUserProfile()
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      toast.success(t('settings.profile_updated'))
      await refreshUser()
    } catch (err) {
      toast.error(t('settings.profile_update_failed'))
    } finally {
      setSaving(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription || subscription.plan === 'free') {
      toast.error(t('settings.no_subscription'))
      return
    }
    setIsManagingSubscription(true)
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.origin + '/settings' }),
      })
      if (!response.ok) throw new Error('Failed to open customer portal')
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error(t('settings.portal_failed'))
    } finally {
      setIsManagingSubscription(false)
    }
  }

  const getPlanFeatures = (plan: string) => {
    return STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]?.features || []
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('settings.please_log_in')}</h1>
          <p className="text-gray-400 mb-4">{t('settings.login_required')}</p>
          <button onClick={() => router.push('/auth/login')} className="px-4 py-2 bg-blue-500 rounded-lg">
            {t('nav.sign_in')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' } }} />
      
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
            <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
              <button 
                  onClick={() => {
                    console.log('[UserMenu] toggle click (settings)', { wasOpen: isUserMenuOpen });
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
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
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{t('settings.title')}</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{t('settings.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="rounded-xl p-2 space-y-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setActiveSection('profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeSection === 'profile' ? 'var(--bg-hover)' : 'transparent',
                    color: activeSection === 'profile' ? 'var(--text-primary)' : 'var(--text-tertiary)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== 'profile') {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== 'profile') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }
                  }}
                >
                  <FiUser size={18} /> {t('settings.profile')}
                </button>
                <button
                  onClick={() => setActiveSection('subscription')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeSection === 'subscription' ? 'var(--bg-hover)' : 'transparent',
                    color: activeSection === 'subscription' ? 'var(--text-primary)' : 'var(--text-tertiary)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== 'subscription') {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== 'subscription') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }
                  }}
                >
                  <FiCreditCard size={18} /> {t('settings.subscription')}
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
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
              {activeSection === 'profile' && (
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <FiUser className="text-blue-400" size={20} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-heading)' }}>{t('settings.profile_information')}</h2>
                  </div>
                  
                  <form onSubmit={e => { e.preventDefault(); handleProfileSave(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.first_name')}</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          value={profile.firstName} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.last_name')}</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          value={profile.lastName} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.email')}</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={profile.email} 
                        disabled
                        className="w-full rounded-xl py-3 px-4 cursor-not-allowed"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-disabled)'
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.phone')}</label>
                        <input 
                          type="text" 
                          name="phone" 
                          value={profile.phone} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.job_title')}</label>
                        <input 
                          type="text" 
                          name="jobTitle" 
                          value={profile.jobTitle} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.company')}</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={profile.company} 
                        onChange={handleProfileChange} 
                        className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.bio')}</label>
                      <textarea 
                        name="bio" 
                        value={profile.bio} 
                        onChange={handleProfileChange} 
                        rows={3}
                        className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors resize-none"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.linkedin_url')}</label>
                        <input 
                          type="text" 
                          name="linkedinUrl" 
                          value={profile.linkedinUrl} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.website_url')}</label>
                        <input 
                          type="text" 
                          name="websiteUrl" 
                          value={profile.websiteUrl} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.city')}</label>
                        <input 
                          type="text" 
                          name="city" 
                          value={profile.city} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.state')}</label>
                        <input 
                          type="text" 
                          name="state" 
                          value={profile.state} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('settings.country')}</label>
                        <input 
                          type="text" 
                          name="country" 
                          value={profile.country} 
                          onChange={handleProfileChange} 
                          className="w-full rounded-xl py-3 px-4 focus:outline-none transition-colors"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-medium transition-all disabled:opacity-50"
                      >
                        <FiSave size={16} />
                        {saving ? t('settings.saving') : t('settings.save_changes')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeSection === 'subscription' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FiCreditCard className="text-blue-400" size={20} />
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-heading)' }}>{t('settings.current_plan')}</h2>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: subscription?.status === 'active' ? 'rgba(34, 197, 94, 0.1)' :
                            subscription?.status === 'past_due' ? 'rgba(234, 179, 8, 0.1)' :
                            'var(--bg-tertiary)',
                          color: subscription?.status === 'active' ? '#4ade80' :
                            subscription?.status === 'past_due' ? '#fbbf24' :
                            'var(--text-tertiary)'
                        }}
                      >
                        {subscription?.status || 'inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                        <FiStar className="text-blue-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold capitalize" style={{ color: 'var(--text-heading)' }}>{subscription?.plan || 'Free'} Plan</h3>
                        {subscription?.currentPeriodEnd && (
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {t('settings.renews_on')} {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">{t('settings.plan_features')}</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getPlanFeatures(subscription?.plan || 'free').map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                            <FiCheck className="text-green-400 flex-shrink-0" size={14} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      {subscription && subscription.plan !== 'free' ? (
                        <button
                          onClick={handleManageSubscription}
                          disabled={isManagingSubscription}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                              e.currentTarget.style.borderColor = 'var(--border-medium)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            }
                          }}
                        >
                          <FiExternalLink size={16} />
                          {isManagingSubscription ? t('settings.opening') : t('settings.manage_subscription')}
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push('/pricing')}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-sm font-medium transition-all"
                        >
                          <FiStar size={16} />
                          {t('settings.upgrade_to_pro')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-[#111111] border border-red-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">{t('settings.danger_zone')}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {t('settings.delete_account_warning')}
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      <FiLogOut size={16} />
                      {t('settings.sign_out')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
