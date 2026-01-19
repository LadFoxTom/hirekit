'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, FiEdit2, FiDownload, FiTrash2, FiEye, FiCopy, FiStar, 
  FiTrendingUp, FiClock, FiAward, FiBell, FiMail, FiMessageSquare,
  FiArrowLeft, FiFileText, FiChevronDown, FiGrid, FiList, FiSearch,
  FiSettings, FiLogOut, FiFolder, FiBriefcase, FiCreditCard, FiHelpCircle,
  FiExternalLink, FiMoreVertical
} from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { CVData } from '@/types/cv'
import { LetterData } from '@/types/letter'
import { Toaster, toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/ConfirmationModal'

interface SavedCV {
  id: string
  title: string
  content: CVData
  template: string
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  isFavorite?: boolean
  chatHistory?: {
    messages: Array<{ role: 'user' | 'assistant', content: string }>
    questionIndex: number
    accountDataPreference?: 'yes' | 'no' | null
  }
}

interface SavedLetter {
  id: string
  title: string
  content: LetterData
  template: string
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  isFavorite?: boolean
}

interface DashboardStats {
  totalCVs: number
  totalLetters: number
  totalViews: number
  totalDownloads: number
  averageScore: number
  recentActivity: Array<{
    type: 'created' | 'updated' | 'downloaded' | 'viewed'
    title: string
    itemType: 'cv' | 'letter'
    timestamp: string
  }>
}

// Menu Item Component (matching main page)
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
        w-full flex items-center min-h-[44px] px-4 py-3
        text-sm font-medium transition-all duration-150
        relative
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${isActive 
          ? 'bg-white/5 border-l-3 border-blue-500' 
          : ''
        }
        ${variant === 'danger' 
          ? disabled
            ? 'text-gray-400'
            : 'text-gray-300 hover:bg-white/8 hover:text-white'
          : disabled
            ? 'text-gray-400'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }
      `}
      style={isActive ? { borderLeftWidth: '3px' } : undefined}
    >
      {/* Icon container - fixed width for alignment */}
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className={disabled ? 'opacity-50' : ''} />
      </div>
      
      {/* Label - flex-grow to fill space */}
      <span className="flex-1 text-left ml-3">{label}</span>
      
      {/* Badge - right-aligned */}
      {badge && (
        <span className="ml-auto px-2.5 py-1 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-full flex-shrink-0">
          {badge}
        </span>
      )}
      
      {external && <FiExternalLink size={14} className="ml-2 text-gray-500 flex-shrink-0" />}
    </button>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, user, subscription } = useAuth()
  const router = useRouter()
  const { t } = useLocale()
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([])
  const [savedLetters, setSavedLetters] = useState<SavedLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalCVs: 0,
    totalLetters: 0,
    totalViews: 0,
    totalDownloads: 0,
    averageScore: 0,
    recentActivity: []
  })
  const [activeTab, setActiveTab] = useState<'all' | 'cvs' | 'letters' | 'favorites'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'cv' | 'letter' } | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free'

  // Close user menu when clicking outside (works for both mouse and touch)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const clickedInsideButton = userMenuRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown (dashboard)')
        setIsUserMenuOpen(false)
      }
    }
    // Listen to both mouse and touch events for better mobile support
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const fetchSavedItems = useCallback(async () => {
    try {
      const cvResponse = await fetch('/api/cv')
      let cvs: SavedCV[] = []
      if (cvResponse.ok) {
        const cvData = await cvResponse.json()
        cvs = cvData.cvs || []
        setSavedCVs(cvs)
      }

      const letterResponse = await fetch('/api/letter')
      let letters: SavedLetter[] = []
      if (letterResponse.ok) {
        const letterData = await letterResponse.json()
        letters = letterData.letters || []
        setSavedLetters(letters)
      }
      
      const totalViews = cvs.reduce((sum: number, cv: SavedCV) => sum + (cv.viewCount || 0), 0) +
                        letters.reduce((sum: number, letter: SavedLetter) => sum + (letter.viewCount || 0), 0)
      const totalDownloads = cvs.reduce((sum: number, cv: SavedCV) => sum + (cv.downloadCount || 0), 0) +
                            letters.reduce((sum: number, letter: SavedLetter) => sum + (letter.downloadCount || 0), 0)
      
      const allActivity = [
        ...cvs.map((cv: SavedCV) => ({
          type: 'updated' as const,
          title: cv.title,
          itemType: 'cv' as const,
          timestamp: cv.updatedAt
        })),
        ...letters.map((letter: SavedLetter) => ({
          type: 'updated' as const,
          title: letter.title,
          itemType: 'letter' as const,
          timestamp: letter.updatedAt
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
      
      // Calculate average score only if there are CVs
      const averageScore = cvs.length > 0 ? 85 : 0
      
      setStats({
        totalCVs: cvs.length,
        totalLetters: letters.length,
        totalViews,
        totalDownloads,
        averageScore,
        recentActivity: allActivity
      })
    } catch (error) {
      console.error('Error fetching saved items:', error)
      toast.error(t('dashboard.failed_to_load'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?next=/dashboard')
      return
    }
    fetchSavedItems()
  }, [isAuthenticated, router, fetchSavedItems])

  const handleCreateNewCV = () => {
    // Activate splitscreen view with CV and Letter both visible
    localStorage.setItem('activateSplitscreen', 'true')
    localStorage.setItem('preferredArtifactType', 'cv')
    router.push('/')
  }
  
  const handleCreateNewLetter = () => {
    // Activate splitscreen view with CV and Letter both visible
    localStorage.setItem('activateSplitscreen', 'true')
    localStorage.setItem('preferredArtifactType', 'letter')
    router.push('/')
  }

  const handleEditCV = (cv: SavedCV) => {
    const cvDataWithFlag = {
      ...cv.content,
      _loadedFromDatabase: true,
      _savedCVId: cv.id
    }
    localStorage.setItem('cvData', JSON.stringify(cvDataWithFlag))
    localStorage.setItem('saved_cv_id', cv.id)
    if (cv.chatHistory) {
      localStorage.setItem('cv_builder_messages', JSON.stringify(cv.chatHistory.messages))
      localStorage.setItem('cv_builder_question_index', cv.chatHistory.questionIndex.toString())
    }
    router.push('/')
  }

  const handleEditLetter = (letter: SavedLetter) => {
    localStorage.setItem('letterData', JSON.stringify(letter.content))
    localStorage.setItem('preferredArtifactType', 'letter')
    router.push('/')
  }

  const handleDeleteItem = (id: string, type: 'cv' | 'letter') => {
    setItemToDelete({ id, type })
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return
    try {
      const endpoint = itemToDelete.type === 'cv' ? `/api/cv/${itemToDelete.id}` : `/api/letter/${itemToDelete.id}`
      const response = await fetch(endpoint, { method: 'DELETE' })
      if (response.ok) {
        if (itemToDelete.type === 'cv') {
          setSavedCVs(prev => prev.filter(cv => cv.id !== itemToDelete.id))
        } else {
          setSavedLetters(prev => prev.filter(letter => letter.id !== itemToDelete.id))
        }
        toast.success(itemToDelete.type === 'cv' ? t('dashboard.cv_deleted') : t('dashboard.letter_deleted'))
        fetchSavedItems()
      }
    } catch (error) {
      toast.error(t('dashboard.failed_to_delete').replace('{type}', itemToDelete.type))
    } finally {
      setItemToDelete(null)
      setShowDeleteConfirmation(false)
    }
  }

  const handleDownloadCV = async (cv: SavedCV) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: cv.content, fileName: cv.title, priority: 'high' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 403 && errorData.requiresUpgrade) {
          toast.error(errorData.error || 'PDF download is a premium feature. Please upgrade.')
          router.push('/pricing')
          return
        }
        throw new Error(errorData.error || 'Failed to generate PDF')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.title}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download CV')
    }
  }

  const handleDownloadLetter = async (letter: SavedLetter) => {
    try {
      const response = await fetch('/api/letter-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterData: letter.content, format: 'pdf' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 403 && errorData.requiresUpgrade) {
          toast.error(errorData.error || 'PDF download is a premium feature. Please upgrade.')
          router.push('/pricing')
          return
        }
        throw new Error(errorData.error || 'Failed to generate PDF')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${letter.title}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download letter')
    }
  }

  const handleDuplicate = async (item: SavedCV | SavedLetter, type: 'cv' | 'letter') => {
    try {
      const endpoint = type === 'cv' ? '/api/cv' : '/api/letter'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${item.title} (Copy)`,
          content: item.content,
          template: item.template
        }),
      })
      if (response.ok) {
        toast.success(type === 'cv' ? t('dashboard.cv_duplicated') : t('dashboard.letter_duplicated'))
        fetchSavedItems()
      }
    } catch (error) {
      toast.error(t('dashboard.failed_to_duplicate'))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getFilteredItems = () => {
    let items = [
      ...savedCVs.map(cv => ({ ...cv, type: 'cv' as const })),
      ...savedLetters.map(letter => ({ ...letter, type: 'letter' as const }))
    ]

    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (activeTab) {
      case 'cvs': return items.filter(i => i.type === 'cv')
      case 'letters': return items.filter(i => i.type === 'letter')
      case 'favorites': return items.filter(i => i.isFavorite)
      default: return items
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
            >
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
                  console.log('[UserMenu] toggle click (dashboard)', { wasOpen: isUserMenuOpen });
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
                    className="hidden lg:block absolute left-auto right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-[9999]"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="font-semibold text-base text-white leading-tight mb-1">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate leading-relaxed" style={{ opacity: 0.7 }}>{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="py-1.5">
                      <MenuItem 
                        icon={FiGrid} 
                        label={t('nav.dashboard')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/dashboard')
                        }}
                        isActive={router.pathname === '/dashboard'}
                      />
                      <MenuItem 
                        icon={FiFolder} 
                        label={t('nav.my_cvs')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/dashboard?tab=cvs')
                        }} 
                      />
                      <MenuItem 
                        icon={FiBriefcase} 
                        label={t('nav.job_applications')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          toast(t('toast.job_applications_coming_soon'))
                        }}
                        disabled={true}
                      />
                    </div>
                    
                    {/* Account Items */}
                    <div className="border-t border-white/10 py-1.5">
                      <MenuItem 
                        icon={FiCreditCard} 
                        label={t('nav.subscription')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/pricing')
                        }} 
                        badge={subBadge}
                        isActive={router.pathname === '/pricing'}
                      />
                      <MenuItem 
                        icon={FiSettings} 
                        label={t('nav.settings')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/settings')
                        }}
                        isActive={router.pathname === '/settings'}
                      />
                      <MenuItem 
                        icon={FiHelpCircle} 
                        label={t('nav.help_support')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/faq')
                        }}
                        isActive={router.pathname === '/faq'}
                      />
                    </div>
                    
                    {/* Action Items */}
                    <div className="border-t border-white/10 py-1.5">
                      <MenuItem 
                        icon={FiLogOut} 
                        label={t('nav.sign_out')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
                <p className="text-gray-400 mt-1">
                  {t('dashboard.welcome_back').replace('{name}', user?.name?.split(' ')[0] || 'there')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateNewLetter}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                >
                  <FiMail size={16} />
                  {t('dashboard.new_letter')}
                </button>
                <button
                  onClick={handleCreateNewCV}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <FiPlus size={16} />
                  {t('dashboard.new_cv')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: t('dashboard.total_cvs'), value: stats.totalCVs || 0, icon: FiFileText, color: 'blue' },
              { label: t('dashboard.total_letters'), value: stats.totalLetters || 0, icon: FiMail, color: 'green' },
              { label: t('dashboard.downloads'), value: stats.totalDownloads || 0, icon: FiDownload, color: 'purple' },
              { label: t('dashboard.avg_score'), value: `${stats.averageScore || 0}%`, icon: FiAward, color: 'yellow' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#111111] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 flex items-center justify-center rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon size={20} className={`text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{typeof stat.value === 'number' && isNaN(stat.value) ? 0 : stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                      {[
                        { id: 'all', label: t('dashboard.all') },
                        { id: 'cvs', label: t('dashboard.cvs') },
                        { id: 'letters', label: t('dashboard.letters') },
                        { id: 'favorites', label: t('dashboard.favorites') },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                              ? 'bg-white text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search & View */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                          type="text"
                          placeholder={t('dashboard.search')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 w-48"
                        />
                      </div>
                      <div className="flex bg-white/5 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 flex items-center justify-center rounded-md ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                        >
                          <FiList size={16} />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 flex items-center justify-center rounded-md ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                        >
                          <FiGrid size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : getFilteredItems().length === 0 ? (
                    <div className="text-center py-16">
                      <FiFileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t('dashboard.no_documents')}</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery ? t('dashboard.try_different_search') : t('dashboard.create_first_document')}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={handleCreateNewCV}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium"
                        >
                          <FiPlus size={16} /> {t('dashboard.create_cv')}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                      {getFilteredItems().map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group ${
                            viewMode === 'grid' ? '' : 'flex items-center justify-between'
                          }`}
                        >
                          <div className={viewMode === 'grid' ? 'mb-4' : 'flex-1'}>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{item.title}</h3>
                              {item.type === 'letter' && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Letter</span>
                              )}
                              {item.isFavorite && <FiStar className="text-yellow-400" size={14} />}
                            </div>
                            <p className="text-sm text-gray-500">
                              {item.template} • {formatDate(item.updatedAt)}
                            </p>
                          </div>
                          
                          <div className={`flex items-center gap-1 ${viewMode === 'grid' ? 'justify-end' : ''}`}>
                            <button
                              onClick={() => item.type === 'cv' ? handleEditCV(item as SavedCV) : handleEditLetter(item as SavedLetter)}
                              className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const isFree = !subscription || subscription.plan === 'free' || subscription.status !== 'active';
                                if (isFree) {
                                  toast.error('PDF download is a premium feature. Please upgrade to download.')
                                  router.push('/pricing')
                                  return
                                }
                                item.type === 'cv' ? handleDownloadCV(item as SavedCV) : handleDownloadLetter(item as SavedLetter)
                              }}
                              className={`p-2 flex items-center justify-center rounded-lg transition-colors ${
                                (!subscription || subscription.plan === 'free' || subscription.status !== 'active')
                                  ? 'text-gray-600 cursor-not-allowed opacity-50'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                              title={(!subscription || subscription.plan === 'free' || subscription.status !== 'active') ? 'Upgrade to download' : 'Download'}
                              disabled={!subscription || subscription.plan === 'free' || subscription.status !== 'active'}
                            >
                              <FiDownload size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(item, item.type)}
                              className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <FiCopy size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.type)}
                              className="p-2 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <FiBell className="text-blue-400" size={16} />
                  <h3 className="font-medium">{t('dashboard.recent_activity')}</h3>
                </div>
                <div className="p-4">
                  {stats.recentActivity.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.no_recent_activity')}</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`p-1.5 flex items-center justify-center rounded-lg ${
                            activity.type === 'created' ? 'bg-green-500/10 text-green-400' :
                            activity.type === 'updated' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {activity.type === 'created' ? <FiPlus size={14} /> : <FiEdit2 size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{activity.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="font-medium text-white">{t('dashboard.quick_actions')}</h3>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    onClick={handleCreateNewCV}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-colors text-left"
                  >
                    <FiPlus className="text-blue-400 flex-shrink-0" size={18} />
                    <span className="text-sm font-medium text-white">{t('dashboard.create_new_cv')}</span>
                  </button>
                  <button
                    onClick={handleCreateNewLetter}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors text-left"
                  >
                    <FiMail className="text-gray-400 flex-shrink-0" size={18} />
                    <span className="text-sm text-gray-300">{t('dashboard.create_cover_letter')}</span>
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors text-left"
                  >
                    <FiCreditCard className="text-gray-400 flex-shrink-0" size={18} />
                    <span className="text-sm text-gray-300">{t('dashboard.upgrade_plan')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false)
          setItemToDelete(null)
        }}
        onConfirm={confirmDeleteItem}
        title={t('dashboard.delete_confirmation_title').replace('{type}', itemToDelete?.type === 'cv' ? 'CV' : 'Letter')}
        message={t('dashboard.delete_confirmation_message').replace('{type}', itemToDelete?.type || '')}
        confirmText={t('dashboard.delete_button')}
        cancelText={t('dashboard.cancel')}
        type="danger"
      />
    </div>
  )
}
