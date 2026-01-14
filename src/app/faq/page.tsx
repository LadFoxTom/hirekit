'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, FiChevronLeft, FiHelpCircle, FiMail, FiMessageCircle,
  FiGrid, FiSettings, FiLogOut, FiCreditCard, FiUser, FiFileText,
  FiShield, FiSmartphone, FiGlobe, FiDownload, FiEdit3, FiZap,
  FiFolder, FiBriefcase
} from 'react-icons/fi';

// FAQ data
const faqs = [
  {
    icon: FiZap,
    category: 'Getting Started',
    question: 'What is LadderFox?',
    answer: 'LadderFox is a modern, AI-powered career platform that helps you create professional CVs, find matching jobs, and manage your job applications. Simply chat with our AI assistant to build your CV, get personalized career advice, and discover opportunities that match your skills.'
  },
  {
    icon: FiCreditCard,
    category: 'Pricing',
    question: 'Is LadderFox free to use?',
    answer: 'LadderFox offers a free plan with access to basic features including CV creation, templates, and PDF downloads. Premium features like advanced AI analysis, unlimited job matching, and priority support are available with a paid subscription.'
  },
  {
    icon: FiEdit3,
    category: 'Getting Started',
    question: 'How do I create a CV?',
    answer: 'Creating a CV is easy! Just start a conversation with our AI assistant on the homepage. You can either upload an existing CV/resume, or describe your experience and skills naturally. The AI will extract and structure your information, and you can see your CV update in real-time.'
  },
  {
    icon: FiDownload,
    category: 'Features',
    question: 'Can I download my CV as a PDF?',
    answer: 'Yes! You can preview and download your CV as a high-quality PDF at any time. The PDF looks exactly like the preview, with professional formatting and styling. You can also choose from multiple templates before downloading.'
  },
  {
    icon: FiFileText,
    category: 'Features',
    question: 'Are LadderFox templates ATS-friendly?',
    answer: 'Absolutely! All our templates are designed to be ATS (Applicant Tracking System) friendly, ensuring your CV passes automated screenings used by most companies. We use clean formatting, standard section headers, and proper structure.'
  },
  {
    icon: FiShield,
    category: 'Privacy',
    question: 'How is my data protected?',
    answer: 'Your privacy is our top priority. All data is encrypted in transit and at rest. We never share your personal information with third parties. You can delete your account and all associated data at any time from your settings.'
  },
  {
    icon: FiEdit3,
    category: 'Features',
    question: 'Can I edit my CV after saving?',
    answer: 'Of course! You can edit, update, and download your CV as many times as you like. Just open your saved CV from the dashboard or sidebar, make changes through the chat, and save again. All your versions are preserved.'
  },
  {
    icon: FiMessageCircle,
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'You can reach our support team via email at info@ladderfox.com. We typically respond within 24 hours. For common questions, check this FAQ page or use the AI assistant which can help with most queries.'
  },
  {
    icon: FiGlobe,
    category: 'Features',
    question: 'What languages are supported?',
    answer: 'LadderFox supports multiple languages including English, Dutch, German, French, and Spanish. The AI can process CVs in any language and help you create content in your preferred language.'
  },
  {
    icon: FiSmartphone,
    category: 'Features',
    question: 'Can I use LadderFox on mobile devices?',
    answer: 'Yes! LadderFox is fully responsive and works great on smartphones and tablets. You can create, edit, and download your CV from any device with a web browser.'
  },
];

export default function FAQPage() {
  const { isAuthenticated, user, subscription } = useAuth();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const subBadge = subscription?.status === 'active' && subscription?.plan !== 'free' ? 'Pro' : 'Free';

  // Close user menu when clicking outside (mouse + touch)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="h-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Left: Back & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </a>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-2">
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
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 sm:w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-[100]"
                      style={{ 
                        position: 'absolute',
                        zIndex: 100,
                        maxWidth: 'calc(100vw - 2rem)',
                        minWidth: '200px'
                      }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="font-medium text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiGrid size={16} /> Dashboard
                        </button>
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiFolder size={16} /> My CVs
                        </button>
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/applications'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiBriefcase size={16} /> Job Applications
                        </button>
                      </div>
                      
                      <div className="border-t border-white/5 py-2">
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiCreditCard size={16} />
                          <span className="flex-1 text-left">Subscription</span>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium rounded-full">{subBadge}</span>
                        </button>
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiSettings size={16} /> Settings
                        </button>
                        <button onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FiHelpCircle size={16} /> Help & Support
                        </button>
                      </div>
                      
                      <div className="border-t border-white/5 py-2">
                        <button onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <FiLogOut size={16} /> Sign out
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
                  Sign in
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        {/* Hero */}
        <div className="py-16 px-4 text-center border-b border-white/5">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiHelpCircle size={32} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-gray-400 text-lg">
              Find answers to common questions about LadderFox. Can't find what you're looking for? Contact our support team.
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
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors"
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
