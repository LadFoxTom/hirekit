'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, FiUser, FiCreditCard, FiSettings, FiLogOut, 
  FiChevronDown, FiGrid, FiHelpCircle, FiCheck, FiStar,
  FiSave, FiPlus, FiExternalLink, FiFolder, FiBriefcase
} from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { STRIPE_PLANS } from '@/lib/stripe'

export default function SettingsPage() {
  const { user, subscription, logout, isLoading, refreshUser } = useAuth()
  const { t } = useLocale()
  const router = useRouter()
  const [isManagingSubscription, setIsManagingSubscription] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
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
      toast.success('Profile updated successfully')
      await refreshUser()
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription || subscription.plan === 'free') {
      toast.error('No active subscription to manage')
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
      toast.error('Failed to open customer portal')
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
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-gray-400 mb-4">You need to be logged in to access settings.</p>
          <button onClick={() => router.push('/auth/login')} className="px-4 py-2 bg-blue-500 rounded-lg">
            {t('nav.sign_in')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <FiArrowLeft size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
              <button 
                  onClick={() => {
                    console.log('[UserMenu] toggle click (settings)', { wasOpen: isUserMenuOpen });
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
                    className="hidden lg:block absolute left-auto right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-y-auto z-[9999]"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="font-medium text-sm">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiGrid size={16} /> {t('nav.dashboard')}
                      </button>
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiFolder size={16} /> {t('nav.my_cvs')}
                      </button>
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/applications'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiBriefcase size={16} /> {t('nav.job_applications')}
                      </button>
                    </div>
                    
                    <div className="border-t border-white/5 py-2">
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiCreditCard size={16} />
                        <span className="flex-1 text-left">{t('nav.subscription')}</span>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium rounded-full">{subBadge}</span>
                      </button>
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiSettings size={16} /> {t('nav.settings')}
                      </button>
                      <button onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiHelpCircle size={16} /> {t('nav.help_support')}
                      </button>
                    </div>
                    
                    <div className="border-t border-white/5 py-2">
                      <button onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <FiLogOut size={16} /> {t('nav.sign_out')}
                      </button>
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
                    onClick={() => { setIsUserMenuOpen(false); router.push('/applications'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiBriefcase size={14} className="text-gray-400" />
                    <span className="text-sm">{t('nav.job_applications')}</span>
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
      
      <main className="pt-14 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-400 mt-1">Manage your account and subscription</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-[#111111] border border-white/5 rounded-xl p-2 space-y-1">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'profile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FiUser size={18} /> Profile
                </button>
                <button
                  onClick={() => setActiveSection('subscription')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'subscription' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FiCreditCard size={18} /> Subscription
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#111111] border border-white/5 rounded-xl p-4 mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => router.push('/')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
                    <FiPlus size={14} /> Create New CV
                  </button>
                  <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
                    <FiGrid size={14} /> View Dashboard
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
              {activeSection === 'profile' && (
                <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FiUser className="text-blue-400" size={20} />
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                  </div>
                  
                  <form onSubmit={e => { e.preventDefault(); handleProfileSave(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                        <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                        <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <input type="email" name="email" value={profile.email} disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                        <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                        <input type="text" name="jobTitle" value={profile.jobTitle} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                      <input type="text" name="company" value={profile.company} onChange={handleProfileChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                      <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
                        <input type="text" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Website URL</label>
                        <input type="text" name="websiteUrl" value={profile.websiteUrl} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                        <input type="text" name="city" value={profile.city} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                        <input type="text" name="state" value={profile.state} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                        <input type="text" name="country" value={profile.country} onChange={handleProfileChange} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-medium transition-all disabled:opacity-50"
                      >
                        <FiSave size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeSection === 'subscription' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FiCreditCard className="text-blue-400" size={20} />
                        <h2 className="text-xl font-semibold">Current Plan</h2>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscription?.status === 'active' ? 'bg-green-500/10 text-green-400' :
                        subscription?.status === 'past_due' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {subscription?.status || 'inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                        <FiStar className="text-blue-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold capitalize">{subscription?.plan || 'Free'} Plan</h3>
                        {subscription?.currentPeriodEnd && (
                          <p className="text-sm text-gray-400">
                            Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Plan Features</h4>
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
                          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <FiExternalLink size={16} />
                          {isManagingSubscription ? 'Opening...' : 'Manage Subscription'}
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push('/pricing')}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-sm font-medium transition-all"
                        >
                          <FiStar size={16} />
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-[#111111] border border-red-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      <FiLogOut size={16} />
                      Sign Out
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
