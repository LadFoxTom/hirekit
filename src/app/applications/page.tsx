'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  FiChevronDown, FiChevronLeft, FiBriefcase, FiPlus, FiExternalLink,
  FiCalendar, FiMapPin, FiDollarSign, FiClock, FiEdit2, FiTrash2,
  FiCheck, FiX, FiFilter, FiSearch, FiMoreVertical, FiGrid, FiSettings,
  FiLogOut, FiCreditCard, FiHelpCircle, FiInbox, FiStar, FiEye, FiFolder, FiClipboard
} from 'react-icons/fi';

// Application status types
type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  url?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  notes?: string;
  source?: string;
}

// Status configuration
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  saved: { label: 'Saved', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: FiStar },
  applied: { label: 'Applied', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: FiCheck },
  interviewing: { label: 'Interviewing', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: FiCalendar },
  offered: { label: 'Offered', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: FiDollarSign },
  rejected: { label: 'Rejected', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: FiX },
  withdrawn: { label: 'Withdrawn', color: 'text-gray-500', bgColor: 'bg-gray-600/20', icon: FiX },
};

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
      
      {/* Label - flex-grow to fill space with overflow handling */}
      <span className="flex-1 text-left ml-2">{label}</span>
      
      {/* Badge - right-aligned, compact */}
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

export default function ApplicationsPage() {
  const { isAuthenticated, user, subscription, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage, availableLanguages } = useLocale();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free';

  // Close user menu when clicking outside (works for both mouse and touch)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const clickedInsideButton = userMenuRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown (applications)')
        setIsUserMenuOpen(false);
      }
    }
    // Listen to both mouse and touch events for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API
      const res = await fetch('/api/job-applications');
      if (res.ok) {
        const data = await res.json();
        // Transform API data to our format
        const apps = (data.applications || []).map((app: any) => ({
          id: app.id,
          title: app.title || app.jobTitle || 'Untitled Position',
          company: app.company || app.companyName || 'Unknown Company',
          location: app.location,
          salary: app.salary,
          url: app.url || app.jobUrl,
          status: mapStatus(app.status),
          appliedDate: app.appliedDate,
          notes: app.notes,
          source: app.source,
        }));
        setApplications(apps);
      } else {
        // Load from localStorage as fallback
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []); // router is stable, fetchApplications doesn't use it

  // Fetch applications on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, fetchApplications]);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('savedJobApplications');
      if (saved) {
        setApplications(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  };

  const saveToLocalStorage = (apps: JobApplication[]) => {
    localStorage.setItem('savedJobApplications', JSON.stringify(apps));
  };

  const mapStatus = (status: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
      'saved': 'saved',
      'applied': 'applied',
      'viewed': 'applied',
      'interview_scheduled': 'interviewing',
      'interview_completed': 'interviewing',
      'interviewing': 'interviewing',
      'offer': 'offered',
      'offered': 'offered',
      'rejected': 'rejected',
      'withdrawn': 'withdrawn',
      'ghosted': 'rejected',
    };
    return statusMap[status] || 'saved';
  };

  // Update application status
  const updateStatus = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const res = await fetch('/api/job-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setApplications(prev => 
          prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
        );
        toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      // Update locally if API fails
      const updated = applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      );
      setApplications(updated);
      saveToLocalStorage(updated);
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
    }
    setEditingId(null);
  };

  // Delete application
  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch('/api/job-applications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast.success('Application deleted');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      // Delete locally if API fails
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      saveToLocalStorage(updated);
      toast.success('Application deleted');
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = !searchQuery || 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group by status for stats
  const stats = {
    total: applications.length,
    saved: applications.filter(a => a.status === 'saved').length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offered: applications.filter(a => a.status === 'offered').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors">
              <FiChevronLeft size={20} />
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </a>
          </div>

          {/* Language, Theme & User Menu */}
          <div className="flex items-center gap-2">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
              <button 
                onClick={() => {
                  console.log('[UserMenu] toggle click (applications)', { wasOpen: isUserMenuOpen });
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
                      <p className="text-[11px] truncate leading-relaxed" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>{user?.email || 'user@example.com'}</p>
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
                        isActive={pathname === '/dashboard'}
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
                        label={t('nav.job_applications_short')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/applications')
                        }}
                        isActive={pathname === '/applications'}
                      />
                      <MenuItem 
                        icon={FiClipboard} 
                        label={t('nav.tests_short')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          toast(t('toast.tests_coming_soon'))
                        }}
                        disabled={true}
                      />
                    </div>
                    
                    {/* Account Items */}
                    <div className="py-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <MenuItem 
                        icon={FiCreditCard} 
                        label={t('nav.subscription')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/pricing')
                        }} 
                        badge={subBadge}
                        isActive={pathname === '/pricing'}
                      />
                      <MenuItem 
                        icon={FiSettings} 
                        label={t('nav.settings')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/settings')
                        }}
                        isActive={pathname === '/settings'}
                      />
                      <MenuItem 
                        icon={FiHelpCircle} 
                        label={t('nav.help_support_short')} 
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          router.push('/faq')
                        }}
                        isActive={pathname === '/faq'}
                      />
                    </div>
                    
                    {/* Action Items */}
                    <div className="py-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
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
                    onClick={() => { setIsUserMenuOpen(false); router.push('/applications'); }}
                    className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 rounded-lg"
                    style={{
                      ...(pathname === '/applications' ? { 
                        borderLeftWidth: '3px',
                        borderLeftColor: '#3b82f6',
                        backgroundColor: 'var(--bg-hover)',
                      } : {}),
                      color: 'var(--text-primary)',
                    }}
                    onMouseEnter={(e) => {
                      if (pathname !== '/applications') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pathname !== '/applications') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    aria-current={pathname === '/applications' ? 'page' : undefined}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FiBriefcase size={20} />
                    </div>
                    <span className="flex-1 text-left ml-3">{t('nav.job_applications')}</span>
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

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {/* Page Header */}
        <div className="border-b border-white/5">
          <div className="max-w-screen-xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <FiBriefcase className="text-blue-400" />
                  Job Applications
                </h1>
                <p className="text-gray-400 mt-1">Track and manage your job search progress</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <FiPlus size={18} />
                Find New Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
              { label: 'Saved', value: stats.saved, color: 'text-gray-400', bg: 'bg-gray-500/10' },
              { label: 'Applied', value: stats.applied, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Interviewing', value: stats.interviewing, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Offered', value: stats.offered, color: 'text-green-400', bg: 'bg-green-500/10' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-white/5`}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-screen-xl mx-auto px-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'saved', 'applied', 'interviewing', 'offered', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === status
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                  {status !== 'all' && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({applications.filter(a => a.status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="max-w-screen-xl mx-auto px-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiInbox size={32} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all' 
                  ? `No applications with status "${STATUS_CONFIG[filter as ApplicationStatus].label}"`
                  : 'Start tracking your job applications'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <FiSearch size={18} />
                Find Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-blue-400">
                        {app.company[0]?.toUpperCase()}
                      </span>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-white truncate">{app.title}</h3>
                          <p className="text-sm text-gray-400">{app.company}</p>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="relative">
                          <button
                            onClick={() => setEditingId(editingId === app.id ? null : app.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${STATUS_CONFIG[app.status].bgColor} ${STATUS_CONFIG[app.status].color}`}
                          >
                            {React.createElement(STATUS_CONFIG[app.status].icon, { size: 12 })}
                            {STATUS_CONFIG[app.status].label}
                            <FiChevronDown size={12} />
                          </button>
                          
                          {/* Status Dropdown */}
                          <AnimatePresence>
                            {editingId === app.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 top-full mt-1 w-40 bg-[#252525] border border-white/10 rounded-lg shadow-xl overflow-hidden z-10"
                              >
                                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                                  <button
                                    key={status}
                                    onClick={() => updateStatus(app.id, status as ApplicationStatus)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                                      app.status === status ? 'bg-white/5' : ''
                                    }`}
                                  >
                                    {React.createElement(config.icon, { size: 12, className: config.color })}
                                    <span className={config.color}>{config.label}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <FiMapPin size={12} />
                            {app.location}
                          </span>
                        )}
                        {app.salary && (
                          <span className="flex items-center gap-1">
                            <FiDollarSign size={12} />
                            {app.salary}
                          </span>
                        )}
                        {app.appliedDate && (
                          <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        )}
                        {app.source && (
                          <span className="text-blue-400">{app.source}</span>
                        )}
                      </div>

                      {/* Notes */}
                      {app.notes && (
                        <p className="mt-2 text-sm text-gray-400 line-clamp-1">{app.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {app.url && (
                        <button
                          onClick={() => window.open(app.url, '_blank')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="View Job Listing"
                        >
                          <FiExternalLink size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-2 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Quick Tips */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8 pb-4 px-4 pointer-events-none">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Click status to update
            </span>
            <span className="flex items-center gap-1.5">
              <FiExternalLink size={12} />
              Open original listing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}









