'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { URL_SEGMENTS, type Language } from '@/data/professions'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'
import {
  FiGrid, FiFolder, FiEye, FiBriefcase, FiCreditCard,
  FiSettings, FiHelpCircle, FiLogOut
} from 'react-icons/fi'

interface MobileUserMenuProps {
  isOpen: boolean
  onClose: () => void
  user: {
    name?: string | null
    email?: string | null
  } | null
  subscriptionBadge?: string
  onSignOut?: () => void
}

export default function MobileUserMenu({
  isOpen,
  onClose,
  user,
  subscriptionBadge = 'Free',
  onSignOut
}: MobileUserMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { language, t } = useLocale()
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleNavigation = (path: string) => {
    onClose()
    router.push(path)
  }

  const handleSignOut = () => {
    onClose()
    if (onSignOut) {
      onSignOut()
    } else {
      // Clear localStorage on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cvData')
        localStorage.removeItem('saved_cv_id')
        localStorage.removeItem('cv_builder_messages')
        localStorage.removeItem('cv_builder_question_index')
        localStorage.removeItem('cv_builder_draft')
        localStorage.removeItem('cv_builder_draft_updated_at')
        localStorage.removeItem('letterData')
        localStorage.removeItem('saved_letter_id')
        localStorage.removeItem('ats_assessment_cache')
        localStorage.removeItem('ats_cv_hash')
        localStorage.removeItem('ats_cache_timestamp')
        localStorage.removeItem('savedJobApplications')
        localStorage.removeItem('activateSplitscreen')
        localStorage.removeItem('preferredArtifactType')
        localStorage.removeItem('instantAction')
      }
      signOut({ callbackUrl: '/' })
    }
  }

  const getExamplesPath = (type: 'cv' | 'letter') => {
    const segments = URL_SEGMENTS[language as Language] || URL_SEGMENTS.en
    return `/${segments.examples}/${type === 'cv' ? segments.cv : segments.letter}`
  }

  // Check if current path matches (for active state)
  const isActive = (path: string) => pathname === path

  if (!isOpen) return null

  return (
    <>
      {/* Mobile Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />

      {/* User Menu - Slide in from right */}
      <motion.aside
        ref={menuRef}
        initial={{ x: 280 }}
        animate={{ x: 0 }}
        exit={{ x: 280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-14 right-0 bottom-0 w-[280px] z-40 overflow-y-auto lg:hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="px-4 py-3 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <p className="font-semibold text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs truncate leading-relaxed" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <MenuButton
              icon={FiGrid}
              label={t('nav.dashboard')}
              onClick={() => handleNavigation('/dashboard')}
              isActive={isActive('/dashboard')}
            />
            <MenuButton
              icon={FiFolder}
              label={t('nav.my_cvs')}
              onClick={() => handleNavigation('/dashboard?tab=cvs')}
            />
            <MenuButton
              icon={FiEye}
              label={t('nav.cv_examples')}
              onClick={() => handleNavigation(getExamplesPath('cv'))}
            />
            <MenuButton
              icon={FiEye}
              label={t('nav.letter_examples')}
              onClick={() => handleNavigation(getExamplesPath('letter'))}
            />
            <MenuButton
              icon={FiBriefcase}
              label={t('nav.job_applications_short')}
              onClick={() => { onClose(); toast(t('toast.job_applications_coming_soon')); }}
              disabled
            />
          </div>

          {/* Account Items */}
          <div className="pt-1.5 mt-1.5 space-y-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <MenuButton
              icon={FiCreditCard}
              label={t('nav.subscription')}
              onClick={() => handleNavigation('/pricing')}
              isActive={isActive('/pricing')}
              badge={subscriptionBadge}
            />
            <MenuButton
              icon={FiSettings}
              label={t('nav.settings')}
              onClick={() => handleNavigation('/settings')}
              isActive={isActive('/settings')}
            />
            <MenuButton
              icon={FiHelpCircle}
              label={t('nav.help_support_short')}
              onClick={() => handleNavigation('/faq')}
              isActive={isActive('/faq')}
            />
          </div>

          {/* Theme & Language */}
          <div className="pt-1.5 mt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="px-4 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Language
                </span>
                <LanguageSelector />
              </div>
            </div>
            <div className="px-4 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Theme
                </span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-1.5 mt-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <MenuButton
              icon={FiLogOut}
              label={t('nav.sign_out')}
              onClick={handleSignOut}
            />
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// Menu Button Component
function MenuButton({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  badge
}: {
  icon: React.ComponentType<{ size?: number }>
  label: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  badge?: string
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        ...(isActive ? {
          borderLeftWidth: '3px',
          borderLeftColor: '#3b82f6',
          backgroundColor: 'var(--bg-hover)',
        } : {}),
        color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </div>
      <span className="flex-1 text-left ml-3">{label}</span>
      {badge && (
        <span
          className="ml-auto px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
