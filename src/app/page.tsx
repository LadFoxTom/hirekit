'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { URL_SEGMENTS, type Language } from '@/data/professions';
import LanguageDebug from '@/components/LanguageDebug';
import { CVData, CV_TEMPLATES } from '@/types/cv';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, FiPaperclip, FiDownload, FiCopy, FiCheck,
  FiFileText, FiEdit3, FiBriefcase, FiUser, FiSettings,
  FiChevronDown, FiMic, FiMicOff, FiMaximize2, FiMinimize2,
  FiClock, FiStar, FiPlus, FiMenu, FiX, FiLogOut, FiCreditCard,
  FiGrid, FiFolder, FiHelpCircle, FiExternalLink, FiAward, FiLock,
  FiTrash2, FiChevronRight, FiMail, FiImage, FiUpload,
  FiZoomIn, FiZoomOut, FiList, FiCheckCircle, FiClipboard, FiEye
} from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { JobSwiper, JobMatch } from '@/components/JobSwiper';
import TemplateQuickSelector from '@/components/TemplateQuickSelector';
import LetterTemplateQuickSelector from '@/components/LetterTemplateQuickSelector';
import { LETTER_TEMPLATES } from '@/data/letterTemplates';
import { CVTemplate } from '@/components/pdf/CVDocumentPDF';
import { sanitizeCVDataForAPI as sanitizeForAPI } from '@/utils/cvDataSanitizer';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import ATSChecker from '@/components/ATSChecker';
import { hotjarStateChange } from '@/components/Hotjar';

// Dynamically import PDF preview viewer (React-PDF based for guaranteed preview=export consistency)
const PDFPreviewViewer = dynamic(
  () => import('@/components/pdf/PDFPreviewViewer').then(mod => mod.PDFPreviewViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-gray-400">Preparing document preview...</div>
        </div>
      </div>
    )
  }
);

// Message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// Artifact types
type ArtifactType = 'cv' | 'letter' | 'jobs' | null;

// Letter data type
interface LetterData {
  recipientName?: string;
  recipientTitle?: string;
  companyName?: string;
  companyAddress?: string;
  jobTitle?: string;
  opening?: string;
  body?: string | string[];
  closing?: string;
  signature?: string;
  template?: string;
  senderName?: string;
  senderTitle?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  layout?: {
    fontFamily?: string;
    fontSize?: string;
    lineSpacing?: string;
    margins?: string;
    alignment?: 'left' | 'center' | 'justify';
    showDate?: boolean;
    showAddress?: boolean;
    showSubject?: boolean;
    letterStyle?: 'formal' | 'semi-formal' | 'creative';
  };
}

// Suggestion prompts - will be made dynamic based on language
const getSuggestions = (t: (key: string) => string) => [
  { icon: FiFileText, text: t('landing.main.suggestions.create_cv'), prompt: t('landing.main.suggestions.prompt.create_cv') },
  { icon: FiEdit3, text: t('landing.main.suggestions.update_resume'), prompt: t('landing.main.suggestions.prompt.update_resume') },
  // Jobs temporarily disabled
  // { icon: FiBriefcase, text: t('landing.main.suggestions.find_jobs'), prompt: t('landing.main.suggestions.prompt.find_jobs') },
  { icon: FiMail, text: t('landing.main.suggestions.write_letter'), prompt: t('landing.main.suggestions.prompt.write_letter') },
];

// Saved CV type
interface SavedCV {
  id: string;
  title: string;
  updatedAt: string;
}

// Letter Preview Component
function LetterPreview({ 
  data, 
  onDataChange, 
  cvData,
  t
}: { 
  data: LetterData; 
  onDataChange: (data: LetterData) => void;
  cvData: CVData;
  t: (key: string) => string;
}) {
  // Get the selected template or default to professional
  const template = LETTER_TEMPLATES.find((t) => t.id === (data.template || 'professional')) || LETTER_TEMPLATES[0];
  const styles = template.styles;
  
  // Use layout overrides if provided, otherwise use template styles
  const fontFamily = data.layout?.fontFamily || styles.fontFamily;
  const fontSize = data.layout?.fontSize || styles.fontSize;
  const lineHeight = data.layout?.lineSpacing || styles.lineSpacing;
  const textAlign = (data.layout?.alignment || styles.alignment) as 'left' | 'center' | 'justify';
  
  return (
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      {/* Letter Document */}
      <div className="flex-1 overflow-auto p-6">
        <div 
          className="max-w-2xl mx-auto bg-white text-gray-900 rounded-lg shadow-2xl p-8 min-h-[600px]"
          style={{
            fontFamily,
            fontSize,
            lineHeight,
            textAlign,
          }}
        >
          {/* Letter Header */}
          <div className="mb-8">
            <div className="text-right text-sm text-gray-600 mb-6">
              <p>{cvData.fullName || 'Your Name'}</p>
              <p>{cvData.contact?.email || 'email@example.com'}</p>
              <p>{cvData.contact?.phone || '(123) 456-7890'}</p>
              <p>{cvData.contact?.location || 'City, Country'}</p>
              <p className="mt-2">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            {/* Recipient Information */}
            {(data.companyName || data.recipientName) && (
              <div className="text-sm text-gray-600 mb-6">
                <p>{data.recipientName || 'Hiring Manager'}</p>
                {data.recipientTitle && <p>{data.recipientTitle}</p>}
                {data.companyName && <p>{data.companyName}</p>}
                {data.companyAddress && <p>{data.companyAddress}</p>}
              </div>
            )}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p className="font-medium">{data.opening || 'Dear Hiring Manager,'}</p>
            
            {data.body ? (
              typeof data.body === 'string' ? (
                data.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                data.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              )
            ) : (
              <div className="text-gray-400 italic py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <FiMail size={32} className="mx-auto mb-2 opacity-50" />
                <p>Your cover letter content will appear here.</p>
                <p className="text-sm mt-2">Ask the AI to write a cover letter, or use the Editor to compose one.</p>
              </div>
            )}
            
            <p className="mt-6">{data.closing || 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.'}</p>
            
            <div className="mt-8">
              <p>{t('letter.signature.sincerely')}</p>
              <p className="mt-4 font-medium">{data.signature || cvData.fullName || 'Your Name'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Edit Bar */}
      <div className="border-t border-white/5 p-3 bg-[#111111]">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <span className="text-xs text-gray-500">
            {data.body ? (typeof data.body === 'string' ? data.body.length : data.body.join('').length) : 0} characters
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Template: {template.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Editor Component (Pro Feature)
function InlineEditor({ 
  data, 
  onSave, 
  letterData,
  onLetterSave,
  activeEditorTab,
  setActiveEditorTab,
  isAuthenticated = false,
  t
}: { 
  data: CVData; 
  onSave: (data: CVData) => void;
  letterData?: LetterData;
  onLetterSave?: (data: LetterData) => void;
  activeEditorTab?: 'cv' | 'letter';
  setActiveEditorTab?: (tab: 'cv' | 'letter') => void;
  isAuthenticated?: boolean;
  t: (key: string) => string;
}) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'summary']);
  
  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFieldChange = (field: string, value: any, nested?: string) => {
    const updated = { ...data };
    if (nested) {
      // Ensure nested object exists before updating
      if (!(updated as any)[nested]) {
        (updated as any)[nested] = {};
      }
      (updated as any)[nested] = { ...(updated as any)[nested], [field]: value };
    } else {
      (updated as any)[field] = value;
    }
    onSave(updated);
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const experiences = [...(data.experience || [])];
    experiences[index] = { ...experiences[index], [field]: value };
    onSave({ ...data, experience: experiences });
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    const education = [...(data.education || [])];
    education[index] = { ...education[index], [field]: value };
    onSave({ ...data, education: education });
  };

  const addExperience = () => {
    const experiences = [...(data.experience || [])];
    experiences.push({ title: '', company: '', dates: '', content: [] });
    onSave({ ...data, experience: experiences });
  };

  const addEducation = () => {
    const education = [...(data.education || [])];
    education.push({ degree: '', institution: '', field: '', dates: '', content: [] });
    onSave({ ...data, education: education });
  };

  const removeExperience = (index: number) => {
    const experiences = [...(data.experience || [])];
    experiences.splice(index, 1);
    onSave({ ...data, experience: experiences });
  };

  const removeEducation = (index: number) => {
    const education = [...(data.education || [])];
    education.splice(index, 1);
    onSave({ ...data, education: education });
  };

  // Letter field handlers
  const handleLetterChange = (field: keyof LetterData, value: string) => {
    if (letterData && onLetterSave) {
      onLetterSave({ ...letterData, [field]: value });
    }
  };

  const [editorTab, setEditorTab] = useState<'cv' | 'letter'>(activeEditorTab || 'cv');

  // Sync editorTab with activeEditorTab prop when it changes
  useEffect(() => {
    if (activeEditorTab) {
      setEditorTab(activeEditorTab);
    }
  }, [activeEditorTab]);

  return (
    <div className="p-4 space-y-3">
      {/* Editor Tab Switcher */}
      {letterData && onLetterSave && (
        <div className="flex items-center gap-2 mb-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={() => setEditorTab('cv')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={editorTab === 'cv' 
              ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }
              : { color: 'var(--text-tertiary)' }
            }
            onMouseEnter={(e) => editorTab !== 'cv' && (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => editorTab !== 'cv' && (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <FiFileText size={14} />
            CV Editor
          </button>
          <button
            onClick={() => setEditorTab('letter')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={editorTab === 'letter' 
              ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }
              : { color: 'var(--text-tertiary)' }
            }
            onMouseEnter={(e) => editorTab !== 'letter' && (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => editorTab !== 'letter' && (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            <FiMail size={14} />
            {t('editor.letter_editor')}
          </button>
        </div>
      )}

      {/* Letter Editor */}
      {editorTab === 'letter' && letterData && onLetterSave && (
        <div className="space-y-3">
          {/* Sender Info (Your Information) */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3" style={{ color: 'var(--text-heading)' }}>
              <FiUser size={14} className="text-green-400" />
              {t('letter.sections.sender')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  value={letterData.senderName || data.fullName || ''}
                  onChange={(e) => handleLetterChange('senderName', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder={data.fullName || 'Your full name'}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Job Title</label>
                <input
                  type="text"
                  value={letterData.senderTitle || data.professionalHeadline || ''}
                  onChange={(e) => handleLetterChange('senderTitle', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder={data.professionalHeadline || 'Your job title'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  value={letterData.senderEmail || data.contact?.email || ''}
                  onChange={(e) => handleLetterChange('senderEmail', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder={data.contact?.email || 'your.email@example.com'}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                <input
                  type="tel"
                  value={letterData.senderPhone || data.contact?.phone || ''}
                  onChange={(e) => handleLetterChange('senderPhone', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder={data.contact?.phone || '+1 (555) 123-4567'}
                />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Address (Optional)</label>
              <textarea
                value={letterData.senderAddress || ''}
                onChange={(e) => handleLetterChange('senderAddress', e.target.value)}
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder={data.contact?.location || 'Your address'}
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3" style={{ color: 'var(--text-heading)' }}>
              <FiUser size={14} className="text-blue-400" />
              {t('letter.sections.recipient')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Recipient Name</label>
                <input
                  type="text"
                  value={letterData.recipientName || ''}
                  onChange={(e) => handleLetterChange('recipientName', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Hiring Manager"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Recipient Title</label>
                <input
                  type="text"
                  value={letterData.recipientTitle || ''}
                  onChange={(e) => handleLetterChange('recipientTitle', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="HR Director"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Company Name</label>
                <input
                  type="text"
                  value={letterData.companyName || ''}
                  onChange={(e) => handleLetterChange('companyName', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Position Applied For</label>
                <input
                  type="text"
                  value={letterData.jobTitle || ''}
                  onChange={(e) => handleLetterChange('jobTitle', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Company Address (Optional)</label>
              <textarea
                value={letterData.companyAddress || ''}
                onChange={(e) => handleLetterChange('companyAddress', e.target.value)}
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="Company address"
              />
            </div>
          </div>

          {/* Letter Content */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3" style={{ color: 'var(--text-heading)' }}>
              <FiMail size={14} className="text-purple-400" />
              Letter Content
            </h3>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Opening / Salutation</label>
              <input
                type="text"
                value={letterData.opening || ''}
                onChange={(e) => handleLetterChange('opening', e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="Dear Hiring Manager,"
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Body</label>
              <textarea
                value={letterData.body || ''}
                onChange={(e) => handleLetterChange('body', e.target.value)}
                rows={10}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="I am writing to express my interest in the position..."
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {letterData.body?.length || 0} characters • Use double line breaks for new paragraphs
              </p>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Closing</label>
              <textarea
                value={letterData.closing || ''}
                onChange={(e) => handleLetterChange('closing', e.target.value)}
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="Thank you for considering my application..."
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Signature</label>
              <input
                type="text"
                value={letterData.signature || ''}
                onChange={(e) => handleLetterChange('signature', e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4" style={{ border: '1px solid var(--border-medium)' }}>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2" style={{ color: 'var(--text-heading)' }}>
              <FiStar size={14} className="text-purple-400" />
              AI Writing Tips
            </h4>
            <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>• Keep your letter concise (300-400 words ideal)</li>
              <li>• Mention the specific job title and company name</li>
              <li>• Highlight 2-3 relevant achievements from your CV</li>
              <li>• Show enthusiasm and cultural fit</li>
            </ul>
          </div>
        </div>
      )}

      {/* CV Editor (shown when editorTab is 'cv' or no letter data) */}
      {(editorTab === 'cv' || !letterData) && (
        <>
      {/* Personal Info Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiUser size={16} className="text-blue-400" />
            <span className="font-medium">Personal Information</span>
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('personal') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('personal') && (
          <div className="p-4 pt-0 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  value={data.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Job Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  value={data.contact?.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value, 'contact')}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                <input
                  type="tel"
                  value={data.contact?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value, 'contact')}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Location</label>
              <input
                type="text"
                value={data.contact?.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value, 'contact')}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                placeholder="New York, NY"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>LinkedIn</label>
                <input
                  type="text"
                  value={data.social?.linkedin || ''}
                  onChange={(e) => handleFieldChange('linkedin', e.target.value, 'social')}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Website</label>
                <input
                  type="text"
                  value={data.social?.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value, 'social')}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiFileText size={16} className="text-purple-400" />
            <span className="font-medium">Professional Summary</span>
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('summary') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('summary') && (
          <div className="p-4 pt-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <textarea
              value={data.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="Brief professional summary..."
            />
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiBriefcase size={16} className="text-green-400" />
            <span className="font-medium">Work Experience</span>
            {data.experience?.length ? (
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({data.experience.length})</span>
            ) : null}
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('experience') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('experience') && (
          <div className="p-4 pt-0 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {(data.experience || []).map((exp, index) => (
              <div key={index} className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Position {index + 1}</span>
                  <button
                    onClick={() => removeExperience(index)}
                    className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={exp.dates || ''}
                  onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Jan 2020 - Present"
                />
                <textarea
                  value={Array.isArray(exp.content) ? exp.content.join('\n') : exp.content || ''}
                  onChange={(e) => handleExperienceChange(index, 'content', e.target.value.split('\n').filter(Boolean))}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="• Key achievement 1&#10;• Key achievement 2"
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-sm transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', borderColor: 'var(--border-medium)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
            >
              <FiPlus size={14} />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiStar size={16} className="text-yellow-400" />
            <span className="font-medium">Education</span>
            {data.education?.length ? (
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({data.education.length})</span>
            ) : null}
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('education') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('education') && (
          <div className="p-4 pt-0 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {(data.education || []).map((edu, index) => (
              <div key={index} className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Education {index + 1}</span>
                  <button
                    onClick={() => removeEducation(index)}
                    className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Degree (e.g., Bachelor of Science)"
                />
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Institution Name"
                />
                <input
                  type="text"
                  value={edu.field || ''}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="Field of Study"
                />
                <input
                  type="text"
                  value={edu.dates || ''}
                  onChange={(e) => handleEducationChange(index, 'dates', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                  placeholder="2016 - 2020"
                />
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg text-sm transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', borderColor: 'var(--border-medium)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
            >
              <FiPlus size={14} />
              Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiEdit3 size={16} className="text-cyan-400" />
            <span className="font-medium">Skills</span>
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('skills') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('skills') && (
          <div className="p-4 pt-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <textarea
              value={
                Array.isArray(data.skills) 
                  ? data.skills.join(', ') 
                  : data.skills && typeof data.skills === 'object'
                  ? [
                      ...(data.skills.technical || []),
                      ...(data.skills.soft || []),
                      ...(data.skills.tools || []),
                      ...(data.skills.industry || [])
                    ].join(', ')
                  : ''
              }
              onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="JavaScript, TypeScript, React, Node.js, Python..."
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Separate skills with commas</p>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('languages')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiFolder size={16} className="text-orange-400" />
            <span className="font-medium">Languages</span>
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('languages') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('languages') && (
          <div className="p-4 pt-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <textarea
              value={
                Array.isArray(data.languages) 
                  ? data.languages.map(l => {
                      if (typeof l === 'string') {
                        return l;
                      }
                      // Handle object case (even though type says string[], AI might return objects)
                      const langObj = l as { language?: string; proficiency?: string };
                      return langObj.language 
                        ? `${langObj.language}${langObj.proficiency ? ` (${langObj.proficiency})` : ''}`
                        : String(l);
                    }).join(', ')
                  : ''
              }
              onChange={(e) => handleFieldChange('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="English (Native), Spanish (Fluent), French (Basic)..."
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Separate languages with commas</p>
          </div>
        )}
      </div>

      {/* Hobbies Section */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <button
          onClick={() => toggleSection('hobbies')}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <FiClock size={16} className="text-pink-400" />
            <span className="font-medium">Hobbies & Interests</span>
          </div>
          <FiChevronRight size={16} className={`transition-transform ${expandedSections.includes('hobbies') ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
        </button>
        {expandedSections.includes('hobbies') && (
          <div className="p-4 pt-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <textarea
              value={Array.isArray(data.hobbies) ? data.hobbies.join(', ') : data.hobbies || ''}
              onChange={(e) => handleFieldChange('hobbies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="Photography, Hiking, Reading, Chess..."
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Separate hobbies with commas</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, user, subscription } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage, availableLanguages } = useLocale();
  
  // Debug logging
  useEffect(() => {
    console.log('[HomePage] Current language:', language);
    console.log('[HomePage] Test translation:', t('landing.main.title'));
  }, [language, t]);
  
  // Get dynamic suggestions based on language
  const SUGGESTIONS = getSuggestions(t);
  
  // UI State
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isArtifactFullscreen, setIsArtifactFullscreen] = useState(false);
  const [artifactType, setArtifactType] = useState<ArtifactType>(null);
  const [cvZoom, setCvZoom] = useState(0.75);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Load preferred artifact type and activate splitscreen from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferred = localStorage.getItem('preferredArtifactType');
      const activateSplitscreen = localStorage.getItem('activateSplitscreen');
      
      if (activateSplitscreen === 'true') {
        // Activate splitscreen view (chat overview)
        setIsConversationActive(true);
        setIsSidebarOpen(true);
        setActiveView('chat');
        localStorage.removeItem('activateSplitscreen'); // Clear after use
      }
      
      if (preferred === 'letter') {
        setArtifactType('letter');
        localStorage.removeItem('preferredArtifactType'); // Clear after use
      } else if (preferred === 'cv') {
        setArtifactType('cv');
        localStorage.removeItem('preferredArtifactType'); // Clear after use
      }
    }
  }, []);
  const [activeView, setActiveView] = useState<'chat' | 'editor' | 'photos' | 'templates' | 'ats-checker'>('chat');
  const [templateTab, setTemplateTab] = useState<'cv' | 'letter'>('cv');
  const [photos, setPhotos] = useState<string[]>([]); // Array of photo URLs
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Subscription gating
  // Treat 'trialing' as active (trial users have full access)
  const isActiveOrTrialing = subscription?.status === 'active' || subscription?.status === 'trialing';
  const plan = isActiveOrTrialing ? (subscription?.plan || 'free') : 'free';
  const isPro = plan !== 'free';
  const isFree = !isPro;
  const subBadge = isPro ? 'Pro' : 'Free';
  const jobsDisabled = true;
  const PROMPT_LIMIT = 10;
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Question count state
  const [questionCount, setQuestionCount] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(2); // Default for guests
  const [questionRemaining, setQuestionRemaining] = useState(2);
  
  // CV State
  const [cvData, setCvData] = useState<CVData>({
    template: 'modern',
    layout: { accentColor: '#3b82f6', showIcons: true }
  });

  // Debounced toast notifications to avoid spam while typing
  const debouncedCVToast = useDebouncedCallback(() => {
    toast.success(t('toast.cv_updated'));
  }, 1500); // Show toast 1.5 seconds after user stops typing
  
  const debouncedLetterToast = useDebouncedCallback(() => {
    toast.success(t('toast.letter_updated'));
  }, 1500);
  
  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const isManualSelectionRef = useRef(false);
  const isLoadingFromLocalStorage = useRef(false);

  // Load CV from localStorage (when redirected from dashboard) - MUST run before photo initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCvData = localStorage.getItem('cvData');
      const savedCvId = localStorage.getItem('saved_cv_id');
      
      if (savedCvData && savedCvId) {
        isLoadingFromLocalStorage.current = true;
        try {
          const content = JSON.parse(savedCvData);
          
          // Remove the flag properties before setting CV data
          const { _loadedFromDatabase, _savedCVId, ...cvData } = content;
          
          // Restore CV data
          setCvData(prev => ({ ...prev, ...cvData }));
          
          // Restore photos array if it exists
          if (cvData.photos && Array.isArray(cvData.photos) && cvData.photos.length > 0) {
            setPhotos(cvData.photos);
            
            // Restore selected photo index based on photoUrl
            if (cvData.photoUrl) {
              const photoIndex = cvData.photos.findIndex((photo: string) => photo === cvData.photoUrl);
              if (photoIndex !== -1) {
                setSelectedPhotoIndex(photoIndex);
              } else {
                // If photoUrl doesn't match any photo, select first one and update photoUrl
                setSelectedPhotoIndex(0);
                setCvData(prev => ({ ...prev, photoUrl: cvData.photos[0] }));
              }
            } else if (cvData.photos.length > 0) {
              // No photoUrl but we have photos - select first one
              setSelectedPhotoIndex(0);
              setCvData(prev => ({ ...prev, photoUrl: cvData.photos[0] }));
            }
          } else if (cvData.photoUrl) {
            // Old CV format - only has photoUrl, add it to photos array
            setPhotos([cvData.photoUrl]);
            setSelectedPhotoIndex(0);
          } else {
            // No photos at all
            setPhotos([]);
            setSelectedPhotoIndex(null);
          }
          
          // Restore chat history if it exists
          const savedMessages = localStorage.getItem('cv_builder_messages');
          const savedQuestionIndex = localStorage.getItem('cv_builder_question_index');
          
          if (savedMessages) {
            try {
              const messages = JSON.parse(savedMessages);
              if (Array.isArray(messages) && messages.length > 0) {
                setMessages(messages.map((msg: any) => ({
                  ...msg,
                  timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                })));
              }
            } catch (e) {
              console.error('Error parsing saved messages:', e);
            }
          }
          
          setCurrentCVId(savedCvId);
          setIsConversationActive(true);
          setArtifactType('cv');
          
          // Clear localStorage flags after loading
          localStorage.removeItem('cvData');
          localStorage.removeItem('saved_cv_id');
          localStorage.removeItem('cv_builder_messages');
          localStorage.removeItem('cv_builder_question_index');
          
          toast.success(t('toast.cv_loaded'));
          isLoadingFromLocalStorage.current = false;
          setTimeout(() => {
            markAsSaved();
          }, 0);
        } catch (err) {
          console.error('Error loading CV from localStorage:', err);
          // Clear invalid data
          localStorage.removeItem('cvData');
          localStorage.removeItem('saved_cv_id');
          isLoadingFromLocalStorage.current = false;
        }
      } else {
        const draftData = localStorage.getItem('cv_builder_draft');
        if (draftData) {
          isLoadingFromLocalStorage.current = true;
          try {
            const draft = JSON.parse(draftData);
            const draftCv = draft?.cvData || {};
            const draftLetter = draft?.letterData || {};
            const draftPhotos = Array.isArray(draft?.photos) ? draft.photos : [];
            const draftSelectedIndex = typeof draft?.selectedPhotoIndex === 'number' ? draft.selectedPhotoIndex : null;
            
            setCvData(prev => ({ ...prev, ...draftCv }));
            setLetterData(prev => ({ ...prev, ...draftLetter }));
            
            if (draftPhotos.length > 0) {
              setPhotos(draftPhotos);
              if (draftCv.photoUrl) {
                const photoIndex = draftPhotos.findIndex((photo: string) => photo === draftCv.photoUrl);
                if (photoIndex !== -1) {
                  setSelectedPhotoIndex(photoIndex);
                } else {
                  setSelectedPhotoIndex(0);
                  setCvData(prev => ({ ...prev, photoUrl: draftPhotos[0] }));
                }
              } else {
                setSelectedPhotoIndex(draftSelectedIndex ?? 0);
                if (!draftCv.photoUrl && draftPhotos[0]) {
                  setCvData(prev => ({ ...prev, photoUrl: draftPhotos[0] }));
                }
              }
            } else if (draftCv.photoUrl) {
              setPhotos([draftCv.photoUrl]);
              setSelectedPhotoIndex(0);
            } else {
              setPhotos([]);
              setSelectedPhotoIndex(draftSelectedIndex);
            }
            
            setIsConversationActive(true);
            setArtifactType('cv');
            toast.success(t('toast.cv_loaded'));
            // Set baseline after draft is loaded so we can detect actual changes
            setTimeout(() => {
              const snapshot = JSON.stringify({
                cvData: draftCv,
                letterData: draftLetter,
                photos: draftPhotos,
                selectedPhotoIndex: draftSelectedIndex,
              });
              initialSnapshotRef.current = snapshot;
              lastSavedSnapshotRef.current = snapshot;
              isDraftLoadedRef.current = false;
              setHasUnsavedChanges(false);
            }, 0);
          } catch (err) {
            console.error('Error loading CV draft from localStorage:', err);
            localStorage.removeItem('cv_builder_draft');
            localStorage.removeItem('cv_builder_draft_updated_at');
          } finally {
            isLoadingFromLocalStorage.current = false;
          }
        }
      }
    }
  }, [t]); // Include t for consistency

  // Load Letter from localStorage (when redirected from dashboard) - similar to CV loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLetterData = localStorage.getItem('letterData');
      const savedLetterId = localStorage.getItem('saved_letter_id');
      
      if (savedLetterData && savedLetterId) {
        try {
          const content = JSON.parse(savedLetterData);
          
          // Restore letter data
          setLetterData(content);
          
          setCurrentLetterId(savedLetterId);
          setIsConversationActive(true);
          setArtifactType('letter');
          
          // Clear localStorage flags after loading
          localStorage.removeItem('letterData');
          localStorage.removeItem('saved_letter_id');
          
          toast.success(t('toast.letter_loaded') || 'Letter loaded successfully');
        } catch (err) {
          console.error('Error loading letter from localStorage:', err);
          // Clear invalid data
          localStorage.removeItem('letterData');
          localStorage.removeItem('saved_letter_id');
        }
      }
    }
  }, [t]);

  // Track Hotjar state changes for SPA navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isConversationActive) {
        hotjarStateChange('/chat-interface');
      } else {
        hotjarStateChange('/');
      }
    }
  }, [isConversationActive]);

  // Initialize photos array from existing photoUrl (only if not loading from localStorage)
  useEffect(() => {
    if (!isLoadingFromLocalStorage.current && cvData.photoUrl && photos.length === 0 && selectedPhotoIndex === null) {
      setPhotos([cvData.photoUrl]);
      setSelectedPhotoIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync selectedPhotoIndex with cvData.photoUrl when cvData changes (but not when user manually selects)
  useEffect(() => {
    // Skip sync if this was a manual selection (handled by onClick handlers)
    if (isManualSelectionRef.current) {
      isManualSelectionRef.current = false;
      return;
    }

    if (cvData.photoUrl && photos.length > 0) {
      // Find the index of the current photoUrl in the photos array
      const photoIndex = photos.findIndex(photo => photo === cvData.photoUrl);
      if (photoIndex !== -1 && photoIndex !== selectedPhotoIndex) {
        // Update selectedPhotoIndex to match cvData.photoUrl
        setSelectedPhotoIndex(photoIndex);
      } else if (photoIndex === -1 && cvData.photoUrl) {
        // Photo URL exists but not in photos array - add it
        setPhotos(prev => {
          const newPhotos = [...prev, cvData.photoUrl!];
          setSelectedPhotoIndex(newPhotos.length - 1);
          return newPhotos;
        });
      }
    } else if (!cvData.photoUrl && selectedPhotoIndex !== null) {
      // Photo URL was removed, clear selection
      setSelectedPhotoIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData.photoUrl]);

  // Auto-set photoPosition to 'left' if photo exists but position is 'none' or undefined
  useEffect(() => {
    if (cvData.photoUrl && (!cvData.layout?.photoPosition || cvData.layout?.photoPosition === 'none')) {
      setCvData(prev => ({
        ...prev,
        layout: {
          ...prev.layout,
          photoPosition: 'left'
        }
      }));
    }
  }, [cvData.photoUrl, cvData.layout?.photoPosition]);

  // Load question count on mount and when auth state changes
  useEffect(() => {
    const loadQuestionCount = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await fetch('/api/user/question-count');
          if (response.ok) {
            const data = await response.json();
            setQuestionCount(data.count ?? 0);
            setQuestionLimit(data.limit ?? (isPro ? Infinity : 5));
            // Handle Infinity and null values safely
            const remaining = data.remaining ?? (isPro ? Infinity : 5);
            setQuestionRemaining(remaining === Infinity ? Infinity : (remaining ?? 5));
          } else {
            // Fallback if API fails
            setQuestionCount(0);
            setQuestionLimit(isPro ? Infinity : 5);
            setQuestionRemaining(isPro ? Infinity : 5);
          }
        } catch (error) {
          console.error('Failed to load question count:', error);
          // Fallback on error
          setQuestionCount(0);
          setQuestionLimit(isPro ? Infinity : 5);
          setQuestionRemaining(isPro ? Infinity : 5);
        }
      } else {
        // For guests, check localStorage
        const guestKey = 'guest_question_count';
        try {
          const stored = localStorage.getItem(guestKey);
          const count = stored ? parseInt(stored, 10) : 0;
          setQuestionCount(count);
          setQuestionLimit(2);
          setQuestionRemaining(Math.max(0, 2 - count));
        } catch (error) {
          console.error('Failed to load guest question count:', error);
          // Fallback on error
          setQuestionCount(0);
          setQuestionLimit(2);
          setQuestionRemaining(2);
        }
      }
    };
    
    loadQuestionCount();
  }, [isAuthenticated, user?.id, isPro]);

  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  
  // Letter State
  const [savedLetters, setSavedLetters] = useState<SavedCV[]>([]);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [letterData, setLetterData] = useState<LetterData>({
    opening: 'Dear Hiring Manager,',
    body: '',
    closing: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.',
    signature: cvData.fullName || '',
    template: 'professional',
  });

  // Unsaved changes + leave guard
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [isSavingBeforeLeave, setIsSavingBeforeLeave] = useState(false);
  const pendingLeaveAction = useRef<(() => void) | null>(null);
  const initialSnapshotRef = useRef<string | null>(null);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const isDraftLoadedRef = useRef(false);
  
  // Job State
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  
  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    content: string;
  } | null>(null);

  // Update send button icon color when inputValue or theme changes
  useEffect(() => {
    if (sendButtonRef.current) {
      const hasText = inputValue.trim() || attachedFile;
      const isDay = document.documentElement.getAttribute('data-theme') === 'day';
      const iconSpan = sendButtonRef.current.querySelector('span');
      if (iconSpan) {
        iconSpan.style.color = hasText && !isProcessing && !isUploading
          ? (isDay ? '#ffffff' : '#000000')
          : 'var(--text-disabled)';
      }
    }
  }, [inputValue, attachedFile, isProcessing, isUploading]);

  const getDraftSnapshot = useCallback(() => {
    return JSON.stringify({
      cvData,
      letterData,
      photos,
      selectedPhotoIndex,
    });
  }, [cvData, letterData, photos, selectedPhotoIndex]);

  const persistDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    const draft = {
      cvData,
      letterData,
      photos,
      selectedPhotoIndex,
    };
    localStorage.setItem('cv_builder_draft', JSON.stringify(draft));
    localStorage.setItem('cv_builder_draft_updated_at', new Date().toISOString());
  }, [cvData, letterData, photos, selectedPhotoIndex]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cv_builder_draft');
    localStorage.removeItem('cv_builder_draft_updated_at');
  }, []);

  const markAsSaved = useCallback(() => {
    lastSavedSnapshotRef.current = getDraftSnapshot();
    setHasUnsavedChanges(false);
    isDraftLoadedRef.current = false;
  }, [getDraftSnapshot]);

  const requestNavigation = useCallback((action: () => void, shouldPrompt: boolean = true) => {
    if (hasUnsavedChanges && shouldPrompt) {
      pendingLeaveAction.current = action;
      setShowLeavePrompt(true);
      return;
    }
    action();
  }, [hasUnsavedChanges]);

  const guardedRouterPush = useCallback((href: string) => {
    // Only show prompt if navigating to a different route
    // Same route navigation (e.g., tab switches) should not trigger the prompt
    const currentPath = pathname || '/';
    const targetPath = href.split('?')[0]; // Remove query params for comparison
    const isSameRoute = currentPath === targetPath || (currentPath === '/' && targetPath === '/');
    
    requestNavigation(() => router.push(href), !isSameRoute);
  }, [requestNavigation, router, pathname]);

  const guardedSignOut = useCallback(() => {
    requestNavigation(() => signOut({ callbackUrl: '/' }));
  }, [requestNavigation]);


  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track unsaved changes
  useEffect(() => {
    if (isLoadingFromLocalStorage.current) return;
    
    // Check if CV has meaningful data (not just template/layout defaults)
    const hasMeaningfulData = cvData.fullName || 
      (cvData.experience && cvData.experience.length > 0) ||
      (cvData.education && cvData.education.length > 0) ||
      letterData.body ||
      photos.length > 0;
    
    // If no meaningful data and conversation is not active, no unsaved changes
    if (!hasMeaningfulData && !isConversationActive) {
      setHasUnsavedChanges(false);
      initialSnapshotRef.current = null;
      lastSavedSnapshotRef.current = null;
      return;
    }
    
    const snapshot = getDraftSnapshot();
    if (initialSnapshotRef.current === null) {
      initialSnapshotRef.current = snapshot;
      setHasUnsavedChanges(false);
      return;
    }
    const baseline = lastSavedSnapshotRef.current ?? initialSnapshotRef.current;
    const isDirty = baseline ? snapshot !== baseline : false;
    // Only set hasUnsavedChanges based on actual changes, not on draft load status
    setHasUnsavedChanges(isDirty);
  }, [getDraftSnapshot, cvData, letterData, photos, isConversationActive]);

  // Warn on page unload if there are unsaved changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      persistDraft();
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, persistDraft]);

  // Close user menu when clicking outside (works for both mouse and touch)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedInsideButton = userMenuRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);
      
      if (!clickedInsideButton && !clickedInsideDropdown) {
        console.log('[UserMenu] Click outside, closing dropdown (home)');
        setIsUserMenuOpen(false);
      }
    };
    // Listen to both mouse and touch events for better mobile support
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Hide scrollbar when textarea content doesn't overflow, and on mobile when input is empty
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    // Detect mobile device
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(navigator.userAgent);

    const checkScrollbar = () => {
      // On mobile: hide scrollbar when input is empty, show when user has typed
      if (isMobile) {
        if (!inputValue.trim()) {
          // Hide scrollbar when empty on mobile
          textarea.style.overflowY = 'hidden';
          textarea.style.scrollbarWidth = 'none';
          textarea.style.setProperty('-ms-overflow-style', 'none');
          // Also hide webkit scrollbar
          textarea.style.setProperty('--webkit-scrollbar', 'none');
        } else {
          // Show scrollbar when user has typed (if content overflows)
          const needsScrollbar = textarea.scrollHeight > textarea.clientHeight;
          if (needsScrollbar) {
            textarea.style.overflowY = 'auto';
            textarea.style.scrollbarWidth = 'thin';
            textarea.style.setProperty('-ms-overflow-style', 'scrollbar');
          } else {
            textarea.style.overflowY = 'hidden';
            textarea.style.scrollbarWidth = 'none';
            textarea.style.setProperty('-ms-overflow-style', 'none');
          }
        }
      } else {
        // Desktop: show scrollbar only when content overflows
        const needsScrollbar = textarea.scrollHeight > textarea.clientHeight;
        if (needsScrollbar) {
          textarea.style.overflowY = 'auto';
          textarea.style.scrollbarWidth = 'thin';
        } else {
          textarea.style.overflowY = 'hidden';
          textarea.style.scrollbarWidth = 'none';
        }
      }
    };

    // Check immediately and on input/resize
    checkScrollbar();
    const handleInput = () => {
      setTimeout(checkScrollbar, 0); // Check after DOM update
    };
    
    textarea.addEventListener('input', handleInput);
    window.addEventListener('resize', checkScrollbar);

    return () => {
      textarea.removeEventListener('input', handleInput);
      window.removeEventListener('resize', checkScrollbar);
    };
  }, [inputValue]);

  // Fetch saved CVs
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/cv')
        .then(res => res.json())
        .then(data => {
          if (data.cvs) {
            setSavedCVs(data.cvs.slice(0, 5).map((cv: any) => ({
              id: cv.id,
              title: cv.title || 'Untitled CV',
              updatedAt: formatRelativeTime(new Date(cv.updatedAt)),
            })));
          }
        })
        .catch(err => console.error('Failed to fetch CVs:', err));
    }
  }, [isAuthenticated]);

  // Fetch saved Letters
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/letter')
        .then(res => res.json())
        .then(data => {
          if (data.letters) {
            setSavedLetters(data.letters.slice(0, 5).map((letter: any) => ({
              id: letter.id,
              title: letter.title || 'Untitled Letter',
              updatedAt: formatRelativeTime(new Date(letter.updatedAt)),
            })));
          }
        })
        .catch(err => console.error('Failed to fetch letters:', err));
    }
  }, [isAuthenticated]);

  // Load a saved CV
  const handleLoadCV = async (cvId: string) => {
    try {
      const res = await fetch(`/api/cv/${cvId}`);
      const data = await res.json();
      if (data.cv?.content) {
        const content = typeof data.cv.content === 'string' 
          ? JSON.parse(data.cv.content) 
          : data.cv.content;
        
        // Restore CV data
        setCvData(prev => ({ ...prev, ...content }));
        
        // Restore photos array if it exists
        if (content.photos && Array.isArray(content.photos) && content.photos.length > 0) {
          setPhotos(content.photos);
          
          // Restore selected photo index based on photoUrl
          if (content.photoUrl) {
            const photoIndex = content.photos.findIndex((photo: string) => photo === content.photoUrl);
            if (photoIndex !== -1) {
              setSelectedPhotoIndex(photoIndex);
            } else {
              // If photoUrl doesn't match any photo, select first one and update photoUrl
              setSelectedPhotoIndex(0);
              setCvData(prev => ({ ...prev, photoUrl: content.photos[0] }));
            }
          } else if (content.photos.length > 0) {
            // No photoUrl but we have photos - select first one
            setSelectedPhotoIndex(0);
            setCvData(prev => ({ ...prev, photoUrl: content.photos[0] }));
          }
        } else if (content.photoUrl) {
          // Old CV format - only has photoUrl, add it to photos array
          setPhotos([content.photoUrl]);
          setSelectedPhotoIndex(0);
        } else {
          // No photos at all
          setPhotos([]);
          setSelectedPhotoIndex(null);
        }
        
        setCurrentCVId(cvId);
        setIsConversationActive(true);
        setArtifactType('cv');
        toast.success('CV loaded!');
        clearDraft();
        setTimeout(() => {
          markAsSaved();
        }, 0);
      }
    } catch (err) {
      toast.error(t('toast.cv_load_failed'));
    }
    setIsSidebarOpen(false);
  };

  // Load a saved Letter
  const handleLoadLetter = async (letterId: string) => {
    try {
      const res = await fetch(`/api/letter/${letterId}`);
      const data = await res.json();
      if (data.letter?.content) {
        const content = typeof data.letter.content === 'string' 
          ? JSON.parse(data.letter.content) 
          : data.letter.content;
        
        // Restore letter data
        setLetterData(content);
        setCurrentLetterId(letterId);
        setArtifactType('letter');
        toast.success(t('letter_builder.messages.letter_saved') || 'Letter loaded');
      }
    } catch (err) {
      toast.error(t('letter_builder.messages.save_error') || 'Failed to load letter');
    }
    setIsSidebarOpen(false);
  };

  // Save current CV
  const handleSaveCV = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error(t('toast.please_sign_in'));
      return false;
    }
    
    try {
      const endpoint = currentCVId ? `/api/cv/${currentCVId}` : '/api/cv';
      const method = currentCVId ? 'PUT' : 'POST';
      
      // Include photos array in the saved CV data
      const cvDataToSave = {
        ...cvData,
        photos: photos.length > 0 ? photos : undefined, // Only save if there are photos
      };
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cvData.fullName ? `${cvData.fullName}'s CV` : 'My CV',
          content: cvDataToSave,
        }),
      });
      
      const data = await res.json();
      if (data.cv?.id) {
        setCurrentCVId(data.cv.id);
        toast.success(t('toast.cv_saved'));
        markAsSaved();
        clearDraft();
        // Refresh saved CVs list
        const cvsRes = await fetch('/api/cv');
        const cvsData = await cvsRes.json();
        if (cvsData.cvs) {
          setSavedCVs(cvsData.cvs.slice(0, 5).map((cv: any) => ({
            id: cv.id,
            title: cv.title || 'Untitled CV',
            updatedAt: formatRelativeTime(new Date(cv.updatedAt)),
          })));
        }
      }
      return true;
    } catch (err) {
      toast.error(t('toast.cv_save_failed'));
      return false;
    }
  };

  // Save current Letter
  const handleSaveLetter = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error(t('toast.please_sign_in'));
      return false;
    }
    
    try {
      const endpoint = currentLetterId ? `/api/letter/${currentLetterId}` : '/api/letter';
      const method = currentLetterId ? 'PUT' : 'POST';
      
      const requestBody = currentLetterId 
        ? letterData // For PUT, just send the content
        : { // For POST, send title and content
            title: letterData.recipientName && letterData.companyName 
              ? `Letter to ${letterData.recipientName} at ${letterData.companyName}` 
              : letterData.companyName 
              ? `Letter to ${letterData.companyName}`
              : 'My Letter',
            content: letterData,
          };
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json();
      if (data.letter?.id) {
        setCurrentLetterId(data.letter.id);
        toast.success(t('letter_builder.messages.letter_saved') || 'Letter saved!');
        markAsSaved();
        clearDraft();
        // Refresh saved letters list
        const lettersRes = await fetch('/api/letter');
        const lettersData = await lettersRes.json();
        if (lettersData.letters) {
          setSavedLetters(lettersData.letters.slice(0, 5).map((letter: any) => ({
            id: letter.id,
            title: letter.title || 'Untitled Letter',
            updatedAt: formatRelativeTime(new Date(letter.updatedAt)),
          })));
        }
      }
      return true;
    } catch (err) {
      toast.error(t('letter_builder.messages.save_error') || 'Failed to save letter');
      return false;
    }
  };

  const handleLeaveWithoutSaving = useCallback(() => {
    setShowLeavePrompt(false);
    clearDraft();
    pendingLeaveAction.current?.();
    pendingLeaveAction.current = null;
  }, [clearDraft]);

  const handleLeaveCancel = useCallback(() => {
    setShowLeavePrompt(false);
    pendingLeaveAction.current = null;
  }, []);

  const handleLeaveSave = useCallback(async () => {
    setIsSavingBeforeLeave(true);
    persistDraft();
    let savedOk = true;
    if (isAuthenticated) {
      // Save CV if there are CV changes
      if (cvData.fullName || (cvData.experience && cvData.experience.length > 0) || (cvData.education && cvData.education.length > 0)) {
        savedOk = await handleSaveCV();
      }
      // Save Letter if there are letter changes
      if (savedOk && letterData.body) {
        savedOk = await handleSaveLetter();
      }
    }
    setIsSavingBeforeLeave(false);
    if (!savedOk) return;
    setShowLeavePrompt(false);
    pendingLeaveAction.current?.();
    pendingLeaveAction.current = null;
  }, [handleSaveCV, handleSaveLetter, isAuthenticated, persistDraft, cvData, letterData]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  // Handle suggestion click
  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  // Detect artifact type from user input
  const detectArtifactType = (input: string): ArtifactType => {
    const lowerInput = input.toLowerCase();
    
    // CV/Resume keywords
    const cvKeywords = [
      'cv', 'resume', 'curriculum vitae', 'create cv', 'build cv', 'make cv', 'craft cv',
      'create resume', 'build resume', 'make resume', 'craft resume', 'write cv', 'write resume',
      'update cv', 'update resume', 'edit cv', 'edit resume', 'improve cv', 'improve resume',
      'my cv', 'my resume', 'professional cv', 'professional resume', 'cv builder', 'resume builder',
      'cv template', 'resume template', 'cv format', 'resume format', 'cv design', 'resume design',
      'work experience', 'education', 'skills', 'summary', 'personal information', 'contact details'
    ];
    
    // Cover letter keywords (English + Dutch + German + French + Spanish)
    const letterKeywords = [
      // English
      'cover letter', 'motivation letter', 'application letter', 'write cover letter',
      'create cover letter', 'build cover letter', 'craft cover letter', 'cover letter for',
      'letter for job', 'application letter', 'motivational letter',
      // Dutch
      'motivatiebrief', 'sollicitatiebrief', 'maak een motivatiebrief', 
      'schrijf een motivatiebrief', 'maak motivatiebrief', 'schrijf motivatiebrief',
      'creëer motivatiebrief', 'genereer motivatiebrief', 'opstellen motivatiebrief',
      'brief schrijven', 'brief voor', 'brief maken', 'op basis van',
      // German
      'anschreiben', 'bewerbungsschreiben', 'motivationsschreiben', 'bewerbungsanschreiben',
      'schreibe ein anschreiben', 'erstelle ein anschreiben', 'verfasse ein anschreiben',
      'anschreiben schreiben', 'anschreiben erstellen', 'anschreiben verfassen',
      'anschreiben für', 'bewerbung schreiben', 'bewerbungsbrief',
      // French
      'lettre de motivation', 'lettre de candidature', 'lettre motivation',
      'écrire une lettre', 'rédiger une lettre', 'créer une lettre',
      'faire une lettre', 'lettre motivation', 'lettre candidature',
      'rédiger lettre', 'écrire lettre', 'créer lettre',
      // Spanish
      'carta de motivación', 'carta de presentación', 'carta motivación',
      'escribir una carta', 'redactar una carta', 'crear una carta',
      'hacer una carta', 'carta motivacional', 'carta presentación',
      'redactar carta', 'escribir carta', 'crear carta'
    ];
    
    // Job search keywords (disabled for now)
    const jobKeywords = [
      'find jobs', 'search jobs', 'job search', 'find me jobs', 'matching jobs',
      'jobs for me', 'job opportunities', 'available jobs', 'job openings',
      'career opportunities', 'job matches', 'recommend jobs'
    ];
    
    // Check for letter keywords FIRST (higher priority when explicitly mentioned)
    if (letterKeywords.some(keyword => lowerInput.includes(keyword))) {
      return 'letter';
    }
    
    // Check for CV keywords (second priority)
    if (cvKeywords.some(keyword => lowerInput.includes(keyword))) {
      return 'cv';
    }
    
    // Check for job keywords
    if (jobKeywords.some(keyword => lowerInput.includes(keyword))) {
      return jobsDisabled ? 'cv' : 'jobs';
    }
    
    // If file is attached and it's likely a CV/resume, default to CV
    if (attachedFile && (attachedFile.name.toLowerCase().includes('cv') || 
                         attachedFile.name.toLowerCase().includes('resume') ||
                         attachedFile.name.toLowerCase().includes('curriculum'))) {
      return 'cv';
    }
    
    return null; // Let API determine if no clear match
  };

  // Sanitize CV data for API calls - remove large base64 photo data
  // Sanitize CV data for API (removes large data like photos)
  // Note: Personal info sanitization happens on server-side before sending to LLM
  const sanitizeCVDataForAPI = (data: CVData): CVData => {
    return sanitizeForAPI(data) || data;
  };

  // Submit message
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputValue.trim() && !attachedFile) || isProcessing) return;

    // Check question limit before sending
    if ((questionRemaining ?? 0) <= 0 && !isPro) {
      if (!isAuthenticated) {
        toast.error(t('toast.question_limit_guest_reached'));
        // Optionally redirect to login
        setTimeout(() => {
          guardedRouterPush('/auth/login');
        }, 2000);
      } else {
        toast.error(t('toast.question_limit_free_reached'));
        guardedRouterPush('/pricing');
      }
      return;
    }

    // Increment question count
    if (isAuthenticated && user?.id) {
      try {
        const response = await fetch('/api/user/question-count', {
          method: 'POST'
        });
        if (response.ok) {
          const data = await response.json();
          setQuestionCount(data.count);
          setQuestionRemaining(data.remaining);
          if (data.limitReached) {
            toast.error(t('toast.question_limit_free_reached'));
            guardedRouterPush('/pricing');
            return;
          }
        }
      } catch (error) {
        console.error('Failed to increment question count:', error);
      }
    } else {
      // For guests, track in localStorage
      const guestKey = 'guest_question_count';
      try {
        const currentCount = parseInt(localStorage.getItem(guestKey) || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem(guestKey, newCount.toString());
        setQuestionCount(newCount);
        setQuestionRemaining(Math.max(0, 2 - newCount));
      } catch (error) {
        console.error('Failed to update guest question count:', error);
      }
    }

    // Build the message content - include attached file if present
    const userText = inputValue.trim() || 'Please analyze this document and extract the CV/resume information.';
    let messageContent = userText;
    let displayContent = inputValue.trim();
    
    if (attachedFile) {
      // Append the file content to the message for the AI, but show only the user's text in UI
      messageContent = `${userText}\n\n[ATTACHED DOCUMENT: ${attachedFile.name}]\n${attachedFile.content}`;
      displayContent = inputValue.trim() 
        ? `${inputValue.trim()}\n\n📎 ${attachedFile.name}` 
        : `📎 ${attachedFile.name}`;
    }

    // Detect artifact type from user input
    const detectedType = detectArtifactType(userText);
    if (detectedType) {
      setArtifactType(detectedType);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFile(null); // Clear attachment after sending
    setIsConversationActive(true);
    setIsProcessing(true);

    // Add streaming placeholder
    const streamingId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: streamingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }]);

    // Sanitize CV data before sending to API (remove large base64 photo data)
    const sanitizedCvData = sanitizeCVDataForAPI(cvData);

    try {
      // Prepare request body
      let requestBody;
      try {
        requestBody = JSON.stringify({
          message: messageContent, // Use the full message including attachment
          cvData: sanitizedCvData,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          language: language, // Pass user's language preference
        });
        console.log('[Chat] Request body size:', requestBody.length, 'bytes');
      } catch (stringifyError) {
        console.error('[Chat] Failed to stringify request body:', stringifyError);
        throw new Error('Failed to prepare request data');
      }

      // Try streaming endpoint first
      const response = await fetch('/api/cv-chat-agent/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      console.log('[Chat] Response status:', response.status, response.statusText);

      // Check if response is an error
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Chat] API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 500) // First 500 chars
        });
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      // Check if it's a JSON response (job search returns JSON, not stream)
      if (contentType?.includes('application/json')) {
        const result = await response.json();
        
        // Handle different artifact types
        if (result.artifactType === 'jobs' && result.jobs) {
          if (!jobsDisabled) {
            setJobs(result.jobs);
            setArtifactType('jobs');
          } else {
            toast(t('toast.jobs_coming_soon'));
            setArtifactType('cv');
          }
        } else if (result.artifactType === 'letter' && result.letterUpdates) {
          setLetterData(prev => ({ ...prev, ...result.letterUpdates }));
          setArtifactType('letter');
        } else {
          // CV updates
          if (result.cvUpdates && Object.keys(result.cvUpdates).length > 0) {
            setCvData(prev => deepMerge(prev, result.cvUpdates));
          }
          setArtifactType('cv');
        }

        setMessages(prev => prev.map(m => 
          m.id === streamingId 
            ? { ...m, content: result.response || 'Response received', isStreaming: false }
            : m
        ));
        setIsProcessing(false);
        return;
      }

      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.type === 'token') {
                      fullContent += data.content;
                      setMessages(prev => prev.map(m => 
                        m.id === streamingId 
                          ? { ...m, content: fullContent, isStreaming: true }
                          : m
                      ));
                    } else if (data.type === 'cv_update') {
                      setCvData(prev => deepMerge(prev, data.updates));
                      // Automatically switch to CV tab when CV updates are received
                      setArtifactType('cv');
                    } else if (data.type === 'done') {
                      // Ensure CV tab is selected if CV data exists
                      if (cvData && (cvData.fullName || cvData.experience?.length || cvData.education?.length)) {
                        setArtifactType('cv');
                      }
                      setMessages(prev => prev.map(m => 
                        m.id === streamingId 
                          ? { ...m, content: fullContent || data.response, isStreaming: false }
                          : m
                      ));
                    } else if (data.type === 'error') {
                      const errorMsg = data.message || data.details || 'Sorry, something went wrong. Please try again.';
                      console.error('[Chat] Stream error received:', data);
                      setMessages(prev => prev.map(m => 
                        m.id === streamingId 
                          ? { ...m, content: errorMsg, isStreaming: false }
                          : m
                      ));
                      setIsProcessing(false);
                    }
                  } catch (e) {
                    // Skip invalid JSON chunks
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        }
      } else {
        // Fallback to non-streaming response
        const result = await response.json();
        
        // Handle different artifact types
        if (result.artifactType === 'jobs' && result.jobs) {
          if (!jobsDisabled) {
            setJobs(result.jobs);
            setArtifactType('jobs');
          } else {
            toast(t('toast.jobs_coming_soon'));
            setArtifactType('cv');
          }
        } else if (result.artifactType === 'letter' && result.letterUpdates) {
          setLetterData(prev => ({ ...prev, ...result.letterUpdates }));
          setArtifactType('letter');
        } else {
          // CV updates
          if (result.cvUpdates && Object.keys(result.cvUpdates).length > 0) {
            setCvData(prev => deepMerge(prev, result.cvUpdates));
          }
          setArtifactType('cv');
        }

        setMessages(prev => prev.map(m => 
          m.id === streamingId 
            ? { ...m, content: result.response || result.error || 'No response', isStreaming: false }
            : m
        ));
      }
    } catch (error) {
      console.error('[Chat] Error in handleSubmit:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      // Fallback to non-streaming API
      try {
        const fallbackRes = await fetch('/api/cv-chat-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageContent, // Use the full message including attachment
            cvData: sanitizedCvData,
            conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
            language: language, // Pass user's language preference
          }),
        });
        
        // Check if response is OK and has JSON content
        if (!fallbackRes.ok) {
          const contentType = fallbackRes.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorResult = await fallbackRes.json();
            throw new Error(errorResult.error || errorResult.response || `Server error: ${fallbackRes.status}`);
          } else {
            // Handle non-JSON error responses (like 504 timeouts)
            const errorText = await fallbackRes.text();
            throw new Error(errorText || `Server error: ${fallbackRes.status}`);
          }
        }
        
        const contentType = fallbackRes.headers.get('content-type');
        let result;
        if (contentType?.includes('application/json')) {
          result = await fallbackRes.json();
        } else {
          // Handle non-JSON responses gracefully
          const textResult = await fallbackRes.text();
          throw new Error(`Unexpected response format: ${textResult.substring(0, 100)}`);
        }
        
        // Handle different artifact types
        if (result.artifactType === 'jobs' && result.jobs) {
          if (!jobsDisabled) {
            setJobs(result.jobs);
            setArtifactType('jobs');
          } else {
            toast(t('toast.jobs_coming_soon'));
            setArtifactType('cv');
          }
        } else if (result.artifactType === 'letter' && result.letterUpdates) {
          setLetterData(prev => ({ ...prev, ...result.letterUpdates }));
          setArtifactType('letter');
        } else {
          if (result.cvUpdates && Object.keys(result.cvUpdates).length > 0) {
            setCvData(prev => deepMerge(prev, result.cvUpdates));
          }
          setArtifactType('cv');
        }

        setMessages(prev => prev.map(m => 
          m.id === streamingId 
            ? { ...m, content: result.response || 'Response received', isStreaming: false }
            : m
        ));
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        const errorMessage = fallbackError instanceof Error 
          ? fallbackError.message 
          : 'An unexpected error occurred';
        
        // Check if it's a timeout error
        const isTimeout = errorMessage.includes('504') || errorMessage.includes('timeout') || errorMessage.includes('Gateway Timeout');
        
        const errorContent = isTimeout 
          ? "The request took too long to process. This might be because the input is very large. Please try:\n\n1. Breaking your input into smaller parts\n2. Using the file upload feature instead\n3. Trying again in a moment"
          : `I encountered an error: ${errorMessage}. Please try again.`;
        
        setMessages(prev => prev.map(m => 
          m.id === streamingId 
            ? { ...m, content: errorContent, isStreaming: false }
            : m
        ));
        
        if (isTimeout) {
          toast.error('Request timed out. Try breaking your input into smaller parts.');
        } else {
          toast.error(t('toast.request_failed'));
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Copy CV content
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(cvData, null, 2));
    toast.success(t('toast.cv_data_copied'));
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setCvZoom(prev => Math.min(2, prev + 0.25));
  };

  const handleZoomOut = () => {
    setCvZoom(prev => Math.max(0.5, prev - 0.25));
  };

  // Download PDF
  const handleDownload = async () => {
    // Block download for free accounts (not just non-pro)
    if (!isAuthenticated || isFree) {
      toast.error(t('toast.download_free_account'));
      guardedRouterPush('/pricing');
      return;
    }
    try {
      // CRITICAL: Crop photo before PDF generation (matching preview)
      let processedPhotoUrl = cvData.photoUrl
      
      if (cvData.photoUrl && cvData.layout?.photoPosition !== 'none') {
        const isCenter = cvData.layout?.photoPosition === 'center'
        const defaultSize = isCenter ? 80 : 60
        const size = cvData.layout?.photoSize ?? defaultSize
        
        try {
          const { cropImageForPDF } = await import('@/utils/imageCropper')
          
          // NEW: Function returns object { dataUrl, width, height }
          const result = await cropImageForPDF(
            cvData.photoUrl,
            size,
            size,
            cvData.layout?.photoPositionX ?? 50,
            cvData.layout?.photoPositionY ?? 50,
            cvData.layout?.photoShape ?? 'circle',
            cvData.layout?.photoBorderWidth ?? 0,
            cvData.layout?.photoBorderColor ?? '#3b82f6'
          )
          
          // Extract dataUrl from result
          processedPhotoUrl = result.dataUrl
          
          console.log('[PDF Download] Photo processed successfully:', {
            displaySize: size,
            canvasSize: size * 3, // 3x for high quality
            resultDisplaySize: result.width,
          })
        } catch (photoError) {
          console.error('[PDF Download] Photo processing failed:', photoError)
          // Fallback to original photo
        }
      }
      
      // Export PDF with processed photo
      const { exportToPDF } = await import('@/lib/pdf/pdf-export');
      const result = await exportToPDF(cvData, processedPhotoUrl);
      if (result.success) {
        toast.success('PDF downloaded successfully!');
      } else {
        toast.error(result.error || t('toast.pdf_download_failed'));
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.error(t('toast.pdf_download_failed'));
    }
  };

  // Job handlers
  const handleSaveJob = async (job: JobMatch) => {
    setSavedJobs(prev => Array.from(new Set([...prev, job.id])));
    
    // Save to localStorage for the applications page
    try {
      const existingApps = JSON.parse(localStorage.getItem('savedJobApplications') || '[]');
      const newApp = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        url: job.url,
        status: 'saved',
        appliedDate: new Date().toISOString(),
        source: job.source || 'LadderFox',
        notes: job.matchReason,
      };
      
      // Avoid duplicates
      if (!existingApps.find((app: any) => app.id === job.id)) {
        localStorage.setItem('savedJobApplications', JSON.stringify([...existingApps, newApp]));
      }
      
      // Also try to save to API
      try {
        await fetch('/api/job-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            url: job.url,
            status: 'saved',
            source: job.source,
          }),
        });
      } catch (e) {
        // API save failed, but localStorage save succeeded
        console.log('API save failed, using localStorage');
      }
      
      toast.success(t('toast.job_saved').replace('{jobTitle}', job.title).replace('{company}', job.company));
    } catch (e) {
      toast.error(t('toast.job_save_failed'));
    }
  };

  const handleSkipJob = (job: JobMatch) => {
    // Just move to next job, no action needed
    console.log('Skipped job:', job.title);
  };

  const handleOpenJob = (job: JobMatch) => {
    window.open(job.url, '_blank');
  };

  const handleApplyJob = async (job: JobMatch) => {
    // Update status to applied
    try {
      const existingApps = JSON.parse(localStorage.getItem('savedJobApplications') || '[]');
      const updatedApps = existingApps.map((app: any) => 
        app.id === job.id ? { ...app, status: 'applied', appliedDate: new Date().toISOString() } : app
      );
      
      // If not already saved, add it
      if (!existingApps.find((app: any) => app.id === job.id)) {
        updatedApps.push({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          url: job.url,
          status: 'applied',
          appliedDate: new Date().toISOString(),
          source: job.source || 'LadderFox',
        });
      }
      
      localStorage.setItem('savedJobApplications', JSON.stringify(updatedApps));
      setSavedJobs(prev => Array.from(new Set([...prev, job.id])));
    } catch (e) {
      console.error('Failed to track application:', e);
    }
    
    toast.success('Opening application...');
    window.open(job.url, '_blank');
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('toast.file_too_large'));
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/json',
    ];
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx', '.md', '.json'];
    
    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExt = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidType && !hasValidExt) {
      toast.error('Please upload a PDF, Word, or text file.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process file');
      }

      // Store the extracted content
      setAttachedFile({
        name: file.name,
        content: result.extractedText,
      });
      
      toast.success(`${file.name} attached! Send a message to process it.`);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove attached file
  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    toast.success(t('toast.attachment_removed'));
  };

  // Trigger file input click
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen text-white" style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' } }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl border-b z-50" style={{ overflow: 'visible', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', opacity: 0.95 }}>
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between" style={{ overflow: 'visible' }}>
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 flex items-center justify-center rounded-lg transition-colors lg:hidden"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FiMenu size={20} />
            </button>
            <a
              href="/"
              className="flex items-center gap-2"
              style={{ color: 'inherit' }}
              onClick={(e) => {
                e.preventDefault();
                guardedRouterPush('/');
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'inherit'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                LF
              </div>
              <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
            </a>
          </div>

          {/* Center: New Chat Button (when in conversation) */}
          {isConversationActive && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setIsConversationActive(false);
                setMessages([]);
                setCvData({ template: 'modern', layout: { accentColor: '#3b82f6', showIcons: true } });
                setCurrentCVId(null);
                setActiveView('chat');
                // Reset unsaved changes tracking when starting new chat
                initialSnapshotRef.current = null;
                lastSavedSnapshotRef.current = null;
                isDraftLoadedRef.current = false;
                setHasUnsavedChanges(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
            >
              <FiPlus size={16} />
              <span className="hidden sm:inline">New Chat</span>
            </motion.button>
          )}

          {/* Desktop Chat Overview shortcut */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // Show full chat overview (split view) like after first message
                  setActiveView('chat');
                  setIsConversationActive(true);
                  setIsSidebarOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
              >
                <FiList size={16} />
                <span className="hidden xl:inline">Chat overview</span>
                <span className="xl:hidden">Chats</span>
              </motion.button>
            </div>
          )}

          {/* Right: Language Selector, Theme Switcher & User Menu */}
          <div className="flex items-center gap-2">
            <LanguageSelector onMobileMenuOpen={() => setIsLanguageMenuOpen(true)} />
            <ThemeSwitcher />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                <button 
                  onClick={() => {
                    console.log('[UserMenu] toggle click (home)', { wasOpen: isUserMenuOpen });
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
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
                  <FiChevronDown 
                    size={14} 
                    className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-tertiary)' }}
                  />
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
                        boxShadow: 'var(--shadow-lg)',
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
                          onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/dashboard'); }}
                          isActive={pathname === '/dashboard'}
                        />
                        <MenuItem 
                          icon={FiFolder} 
                          label={t('nav.my_cvs')} 
                          onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/dashboard?tab=cvs'); }}
                        />
                        <MenuItem 
                          icon={FiEye} 
                          label={t('nav.cv_examples')} 
                          onClick={() => { 
                            setIsUserMenuOpen(false); 
                            const segments = URL_SEGMENTS[language as Language] || URL_SEGMENTS.en;
                            guardedRouterPush(`/${segments.examples}/${segments.cv}`); 
                          }}
                        />
                        <MenuItem 
                          icon={FiEye} 
                          label={t('nav.letter_examples')} 
                          onClick={() => { 
                            setIsUserMenuOpen(false); 
                            const segments = URL_SEGMENTS[language as Language] || URL_SEGMENTS.en;
                            guardedRouterPush(`/${segments.examples}/${segments.letter}`); 
                          }}
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
                          onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/pricing'); }} 
                          badge={subBadge}
                          isActive={pathname === '/pricing'}
                        />
                        <MenuItem 
                          icon={FiSettings} 
                          label={t('nav.settings')} 
                          onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/settings'); }}
                          isActive={pathname === '/settings'}
                        />
                        <MenuItem 
                          icon={FiHelpCircle} 
                          label={t('nav.help_support_short')} 
                          onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/faq'); }}
                          isActive={pathname === '/faq'}
                        />
                      </div>
                      
                      {/* Action Items */}
                      <div className="py-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <MenuItem 
                          icon={FiLogOut} 
                          label={t('nav.sign_out')} 
                          onClick={() => { setIsUserMenuOpen(false); guardedSignOut(); }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                  <button
                    onClick={() => guardedRouterPush('/auth/login')}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {t('nav.sign_in')}
                  </button>
                  <button
                    onClick={() => guardedRouterPush('/auth/signup')}
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
                    onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/dashboard'); }}
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
                    onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/dashboard?tab=cvs'); }}
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
                    onClick={() => { 
                      setIsUserMenuOpen(false); 
                      const segments = URL_SEGMENTS[language as Language] || URL_SEGMENTS.en;
                      guardedRouterPush(`/${segments.examples}/${segments.cv}`); 
                    }}
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
                      <FiEye size={20} />
                    </div>
                    <span className="flex-1 text-left ml-3">{t('nav.cv_examples')}</span>
                  </button>
                  <button
                    onClick={() => { 
                      setIsUserMenuOpen(false); 
                      const segments = URL_SEGMENTS[language as Language] || URL_SEGMENTS.en;
                      guardedRouterPush(`/${segments.examples}/${segments.letter}`); 
                    }}
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
                      <FiEye size={20} />
                    </div>
                    <span className="flex-1 text-left ml-3">{t('nav.letter_examples')}</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }}
                    disabled
                    aria-disabled="true"
                    className="w-full flex items-center min-h-[44px] px-4 py-3 text-sm font-medium opacity-50 cursor-not-allowed rounded-lg"
                    style={{ color: 'var(--text-disabled)' }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <FiBriefcase size={20} className="opacity-50" />
                    </div>
                    <span className="flex-1 text-left ml-3">{t('nav.job_applications_short')}</span>
                  </button>
                </div>
                
                {/* Account Items */}
                <div className="pt-1.5 mt-1.5 space-y-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/pricing'); }}
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
                    onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/settings'); }}
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
                    onClick={() => { setIsUserMenuOpen(false); guardedRouterPush('/faq'); }}
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
                    onClick={() => { setIsUserMenuOpen(false); guardedSignOut(); }}
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

      {/* Unsaved Changes Prompt */}
      <AnimatePresence>
        {showLeavePrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'var(--overlay)' }}
              onClick={handleLeaveCancel}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div
                className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)' }}
              >
                {/* Header with Icon */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                      <svg className="w-6 h-6" style={{ color: '#fbbf24' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        {t('cv_editor.unsaved_changes').replace('⚠️ ', '')}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {t('cv_editor.leave_prompt')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 flex flex-nowrap items-stretch gap-3 justify-end" style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={handleLeaveCancel}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 flex items-center justify-center"
                    style={{ 
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-medium)',
                      minHeight: '40px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span className="whitespace-nowrap">{t('cv_editor.leave_cancel')}</span>
                  </button>
                  <button
                    onClick={handleLeaveWithoutSaving}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 flex items-center justify-center"
                    style={{ 
                      color: '#ef4444',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-medium)',
                      minHeight: '40px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span className="whitespace-nowrap">{t('cv_editor.leave_without_saving')}</span>
                  </button>
                  <button
                    onClick={handleLeaveSave}
                    disabled={isSavingBeforeLeave}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-ladderfox-blue)',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                      minHeight: '40px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSavingBeforeLeave) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSavingBeforeLeave) {
                        e.currentTarget.style.backgroundColor = 'var(--color-ladderfox-blue)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
                      }
                    }}
                  >
                    <span className="whitespace-nowrap">{isSavingBeforeLeave ? t('pricing.processing') : t('cv_editor.save_continue')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Language Menu (Mobile) - Sideways menu */}
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
                    // Flag Icon Component (inline for this menu)
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

      {/* Sidebar (Mobile & Desktop) */}
      <AnimatePresence>
        {(isSidebarOpen || (isConversationActive && typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 left-0 bottom-0 w-[280px] z-40 overflow-y-auto"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              <div className="p-4 space-y-4">
                {/* Desktop close button */}
                <div className="hidden lg:flex justify-end">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
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
                    aria-label="Close sidebar"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* New Chat Button */}
                <button
                  onClick={() => {
                    setIsConversationActive(false);
                    setMessages([]);
                    setCvData({ template: 'modern', layout: { accentColor: '#3b82f6', showIcons: true } });
                    setCurrentCVId(null);
                    setIsSidebarOpen(false);
                    setActiveView('chat');
                    // Reset unsaved changes tracking when starting new chat
                    initialSnapshotRef.current = null;
                    lastSavedSnapshotRef.current = null;
                    isDraftLoadedRef.current = false;
                    setHasUnsavedChanges(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-6"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                >
                  <FiPlus size={18} />
                  <span>New conversation</span>
                </button>

                {/* Saved CVs */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3 px-2" style={{ color: 'var(--text-tertiary)' }}>
                    {t('nav.my_cvs')}
                  </h3>
                  <div 
                    className="space-y-1 overflow-y-auto"
                    style={{ 
                      maxHeight: 'calc(100vh - 400px)',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--border-subtle) transparent',
                    }}
                  >
                    {savedCVs.length > 0 ? (
                      savedCVs.map((cv) => (
                        <button
                          key={cv.id}
                          onClick={() => handleLoadCV(cv.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                          style={{
                            backgroundColor: currentCVId === cv.id ? 'var(--bg-hover)' : 'transparent',
                            color: 'var(--text-primary)',
                          }}
                          onMouseEnter={(e) => {
                            if (currentCVId !== cv.id) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentCVId !== cv.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <FiFileText size={14} className="text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{cv.title}</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{cv.updatedAt}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                        {isAuthenticated ? 'No saved CVs yet' : 'Sign in to see your CVs'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Saved Letters */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3 px-2" style={{ color: 'var(--text-tertiary)' }}>
                    {t('nav.my_letters') || 'My Letters'}
                  </h3>
                  <div 
                    className="space-y-1 overflow-y-auto"
                    style={{ 
                      maxHeight: 'calc(100vh - 400px)',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--border-subtle) transparent',
                    }}
                  >
                    {savedLetters.length > 0 ? (
                      savedLetters.map((letter) => (
                        <button
                          key={letter.id}
                          onClick={() => handleLoadLetter(letter.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                          style={{
                            backgroundColor: currentLetterId === letter.id ? 'var(--bg-hover)' : 'transparent',
                            color: 'var(--text-primary)',
                          }}
                          onMouseEnter={(e) => {
                            if (currentLetterId !== letter.id) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentLetterId !== letter.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <FiMail size={14} className="text-green-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{letter.title}</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{letter.updatedAt}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                        {isAuthenticated ? 'No saved letters yet' : 'Sign in to see your letters'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3 px-2" style={{ color: 'var(--text-tertiary)' }}>
                    {t('landing.main.quick_actions')}
                  </h3>
                  <button 
                    onClick={() => guardedRouterPush('/dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FiGrid size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm">Dashboard</span>
                  </button>
                  {/* Photo Management */}
                  <button 
                    onClick={() => {
                      setActiveView('photos');
                      setIsConversationActive(true);
                      setArtifactType('cv');
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FiImage size={14} className="text-blue-400" />
                    <span className="text-sm">{t('common.photos')}</span>
                    {photos.length > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {photos.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setActiveView('editor');
                      setIsConversationActive(true);
                      // Keep current artifactType instead of forcing 'cv'
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left group"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <FiAward size={14} className="text-purple-400" />
                      <span className="text-sm">Editor</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-14 min-h-screen transition-all duration-300 ${
        isConversationActive ? 'lg:pl-[280px]' : ''
      }`} style={{ maxWidth: '100vw', overflowX: 'hidden', width: '100%' }}>
        <AnimatePresence mode="wait">
          {!isConversationActive ? (
            /* ============ INITIAL STATE ============ */
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-12"
            >
              {/* Hero */}
              <div className="text-center mb-12 max-w-2xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl font-bold mb-4"
                  style={{
                    background: 'var(--text-heading)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('landing.main.title')}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg"
                  style={{ color: 'var(--text-subtitle)' }}
                >
                  {t('landing.main.subtitle')}
                </motion.p>
              </div>

              {/* Prompt Input */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl"
              >
                <div 
                  className="rounded-2xl border shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-medium)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {/* Textarea row with buttons */}
                  <div className="relative flex items-center">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isUploading 
                          ? t('landing.main.prompt.placeholder.uploading')
                          : attachedFile 
                          ? t('landing.main.prompt.placeholder.with_file')
                          : t('landing.main.prompt.placeholder')
                      }
                      rows={1}
                      className="flex-1 bg-transparent px-4 sm:px-6 pr-20 sm:pr-24 text-base sm:text-lg resize-none focus:outline-none [&::-webkit-scrollbar]:hidden"
                      style={{ 
                        height: '64px',
                        minHeight: '64px', 
                        maxHeight: '200px',
                        paddingTop: '20px',
                        paddingBottom: '24px',
                        lineHeight: '20px',
                        overflowY: 'hidden',
                        scrollbarWidth: 'none',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                        color: 'var(--text-primary)',
                      } as React.CSSProperties}
                      disabled={isUploading}
                    />
                    
                    {/* Input Actions - positioned in the textarea row */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button 
                        onClick={handleAttachmentClick}
                        disabled={isUploading}
                        className={`p-2.5 flex items-center justify-center rounded-lg transition-colors ${
                          isUploading ? 'animate-pulse' : ''
                        }`}
                        style={{
                          color: isUploading ? '#60a5fa' : (attachedFile ? '#60a5fa' : 'var(--text-tertiary)'),
                        }}
                        onMouseEnter={(e) => {
                          if (!isUploading && !attachedFile) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isUploading && !attachedFile) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                          }
                        }}
                        title="Upload CV/Resume (PDF, DOC, TXT)"
                      >
                        <FiPaperclip size={18} />
                      </button>
                      <button
                        onClick={() => handleSubmit()}
                        disabled={!inputValue.trim() && !attachedFile}
                        className="p-2.5 flex items-center justify-center rounded-lg transition-all"
                        style={{
                          backgroundColor: (inputValue.trim() || attachedFile) 
                            ? (document.documentElement.getAttribute('data-theme') === 'day' ? '#2563eb' : '#ffffff')
                            : 'var(--bg-hover)',
                          color: (inputValue.trim() || attachedFile)
                            ? '#ffffff'
                            : 'var(--text-disabled)',
                        }}
                        onMouseEnter={(e) => {
                          if (inputValue.trim() || attachedFile) {
                            e.currentTarget.style.backgroundColor = document.documentElement.getAttribute('data-theme') === 'day' ? '#1d4ed8' : '#f3f4f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (inputValue.trim() || attachedFile) {
                            e.currentTarget.style.backgroundColor = document.documentElement.getAttribute('data-theme') === 'day' ? '#2563eb' : '#ffffff';
                          }
                        }}
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Attached file indicator - separate section below */}
                  {attachedFile && (
                    <div className="px-4 pb-3 pt-0">
                      <div 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-medium)',
                        }}
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <FiFileText size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{attachedFile.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('landing.main.file.ready')}</p>
                        </div>
                        <button
                          onClick={handleRemoveAttachment}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{
                            color: 'var(--text-tertiary)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title={t('landing.main.file.remove')}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion.prompt)}
                      className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-all"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <suggestion.icon size={14} />
                      {suggestion.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ============ CONVERSATION STATE (Split View) ============ */
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-56px)] flex"
            >
              {/* Left Pane: Chat or Editor */}
              <div className={`flex flex-col ${isArtifactFullscreen ? 'hidden' : 'w-full lg:w-[45%]'}`} style={{ borderRight: '1px solid var(--border-subtle)' }}>
                {/* View Toggle (Chat/Editor/Photos) */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => setActiveView('chat')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeView === 'chat' ? 'var(--bg-hover)' : 'transparent',
                      color: activeView === 'chat' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeView !== 'chat') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeView !== 'chat') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiSend size={14} />
                    Chat
                  </button>
                  {isPro && (
                    <button
                      onClick={() => setActiveView('editor')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: activeView === 'editor' ? 'var(--bg-hover)' : 'transparent',
                        color: activeView === 'editor' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      }}
                      onMouseEnter={(e) => {
                        if (activeView !== 'editor') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeView !== 'editor') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                        }
                      }}
                    >
                      <FiAward size={14} className="text-purple-400" />
                      Editor
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveView('photos')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeView === 'photos' ? 'var(--bg-hover)' : 'transparent',
                      color: activeView === 'photos' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeView !== 'photos') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeView !== 'photos') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiImage size={14} className="text-blue-400" />
                    {t('common.photos')}
                    {photos.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {photos.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveView('templates')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeView === 'templates' ? 'var(--bg-hover)' : 'transparent',
                      color: activeView === 'templates' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeView !== 'templates') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeView !== 'templates') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiGrid size={14} className="text-teal-400" />
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveView('ats-checker')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor: activeView === 'ats-checker' ? 'var(--bg-hover)' : 'transparent',
                      color: activeView === 'ats-checker' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeView !== 'ats-checker') {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeView !== 'ats-checker') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                      }
                    }}
                  >
                    <FiCheckCircle size={14} className="text-indigo-400" />
                    ATS Check
                  </button>
                </div>
                
                {activeView === 'photos' ? (
                  /* ============ PHOTOS VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Photos Header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <FiImage size={16} className="text-blue-400" />
                          Photo Management
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
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
                          title="Back to chat"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Photos Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="max-w-2xl mx-auto space-y-4">
                        {/* Photo Toggle */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Show Photo on CV</h3>
                              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Toggle photo visibility on your CV</p>
                            </div>
                            <button
                              onClick={() => {
                                const currentPosition = cvData.layout?.photoPosition || 'none';
                                const newPosition = currentPosition === 'none' ? 'left' : 'none';
                                setCvData({
                                  ...cvData,
                                  layout: {
                                    ...cvData.layout,
                                    photoPosition: newPosition
                                  }
                                });
                                toast.success(newPosition === 'none' ? t('toast.photo_hidden') : t('toast.photo_shown'));
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                cvData.layout?.photoPosition !== 'none'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  cvData.layout?.photoPosition !== 'none' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Upload New Photo */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Add New Photo</h3>
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.multiple = true;
                              input.onchange = async (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                if (files.length === 0) return;
                                
                                const validFiles = files.filter(file => {
                                  if (!file.type.startsWith('image/')) {
                                    toast.error(`${file.name} is not an image file`);
                                    return false;
                                  }
                                  if (file.size > 4 * 1024 * 1024) {
                                    toast.error(`${file.name} is too large (max 4MB)`);
                                    return false;
                                  }
                                  return true;
                                });
                                
                                if (validFiles.length === 0) return;
                                
                                try {
                                  const newPhotos: string[] = [];
                                  let loadedCount = 0;
                                  
                                  validFiles.forEach((file) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      newPhotos.push(dataUrl);
                                      loadedCount++;
                                      
                                      if (loadedCount === validFiles.length) {
                                        const updatedPhotos = [...photos, ...newPhotos];
                                        setPhotos(updatedPhotos);
                                        
                                        // Auto-select first new photo if none selected
                                        if (selectedPhotoIndex === null && updatedPhotos.length > 0) {
                                          setSelectedPhotoIndex(updatedPhotos.length - newPhotos.length);
                                        }
                                        
                                        toast.success(`${validFiles.length} photo(s) added successfully!`);
                                        
                                        // Update CV data with first photo if none selected
                                        if (selectedPhotoIndex === null && updatedPhotos.length > 0) {
                                          setCvData({
                                            ...cvData,
                                            photoUrl: updatedPhotos[0],
                                            layout: {
                                              ...cvData.layout,
                                              photoPosition: cvData.layout?.photoPosition || 'left'
                                            }
                                          });
                                        }
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                } catch (error) {
                                  toast.error('Failed to add photos');
                                }
                              };
                              input.click();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors"
                            style={{
                              backgroundColor: 'var(--bg-tertiary)',
                              border: '1px dashed var(--border-medium)',
                              color: 'var(--text-secondary)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <FiUpload size={16} />
                            {t('common.upload_photos')}
                          </button>
                          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>JPG, PNG up to 4MB each. You can upload multiple photos.</p>
                        </div>

                        {/* Photo Gallery */}
                        {photos.length > 0 && (
                          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>{t('common.your_photos')} ({photos.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {photos.map((photo, index) => (
                                <div
                                  key={index}
                                  className="relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
                                  style={{
                                    borderColor: selectedPhotoIndex === index ? '#3b82f6' : 'var(--border-medium)',
                                    boxShadow: selectedPhotoIndex === index ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (selectedPhotoIndex !== index) {
                                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (selectedPhotoIndex !== index) {
                                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                                    }
                                  }}
                                  onClick={() => {
                                    isManualSelectionRef.current = true;
                                    setSelectedPhotoIndex(index);
                                    setCvData({
                                      ...cvData,
                                      photoUrl: photo,
                                      layout: {
                                        ...cvData.layout,
                                        photoPosition: cvData.layout?.photoPosition || 'left'
                                      }
                                    });
                                    toast.success(t('toast.photo_selected'));
                                  }}
                                >
                                  <img
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full aspect-square object-cover"
                                  />
                                  {selectedPhotoIndex === index && (
                                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                      <div className="bg-blue-500 rounded-full p-1.5">
                                        <FiCheck size={16} className="text-white" />
                                      </div>
                                    </div>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newPhotos = photos.filter((_, i) => i !== index);
                                      setPhotos(newPhotos);
                                      
                                      if (selectedPhotoIndex === index) {
                                        if (newPhotos.length > 0) {
                                          const newIndex = Math.min(index, newPhotos.length - 1);
                                          setSelectedPhotoIndex(newIndex);
                                          setCvData({
                                            ...cvData,
                                            photoUrl: newPhotos[newIndex],
                                          });
                                        } else {
                                          setSelectedPhotoIndex(null);
                                          setCvData({
                                            ...cvData,
                                            photoUrl: undefined,
                                            layout: {
                                              ...cvData.layout,
                                              photoPosition: 'none'
                                            }
                                          });
                                        }
                                      } else if (selectedPhotoIndex !== null && selectedPhotoIndex > index) {
                                        setSelectedPhotoIndex(selectedPhotoIndex - 1);
                                      }
                                      
                                      toast.success('Photo removed');
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove photo"
                                  >
                                    <FiX size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            {selectedPhotoIndex !== null && (
                              <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-tertiary)' }}>
                                Photo {selectedPhotoIndex + 1} is currently selected and will appear on your CV
                              </p>
                            )}
                          </div>
                        )}

                        {/* Photo Settings */}
                        {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
                          <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Photo Settings</h3>
                            
                            {/* Shape Selector */}
                            <div>
                              <label className="text-xs mb-2 block" style={{ color: 'var(--text-tertiary)' }}>Shape</label>
                              <div className="flex gap-2">
                                {(['circle', 'square', 'rounded'] as const).map((shape) => (
                                  <button
                                    key={shape}
                                    onClick={() => {
                                      setCvData({
                                        ...cvData,
                                        layout: {
                                          ...cvData.layout,
                                          photoShape: shape
                                        }
                                      });
                                    }}
                                    className="flex-1 px-3 py-2 rounded-lg border transition-colors"
                                    style={{
                                      borderColor: (cvData.layout?.photoShape || 'circle') === shape ? '#3b82f6' : 'var(--border-medium)',
                                      backgroundColor: (cvData.layout?.photoShape || 'circle') === shape ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                      color: (cvData.layout?.photoShape || 'circle') === shape ? '#60a5fa' : 'var(--text-tertiary)',
                                    }}
                                    onMouseEnter={(e) => {
                                      if ((cvData.layout?.photoShape || 'circle') !== shape) {
                                        e.currentTarget.style.borderColor = 'var(--border-strong)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if ((cvData.layout?.photoShape || 'circle') !== shape) {
                                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                                        e.currentTarget.style.color = 'var(--text-tertiary)';
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      {shape === 'circle' && (
                                        <div className={`w-6 h-6 rounded-full border-2 ${
                                          (cvData.layout?.photoShape || 'circle') === shape ? 'border-blue-400' : 'border-gray-500'
                                        }`} />
                                      )}
                                      {shape === 'square' && (
                                        <div className={`w-6 h-6 border-2 ${
                                          (cvData.layout?.photoShape || 'circle') === shape ? 'border-blue-400' : 'border-gray-500'
                                        }`} />
                                      )}
                                      {shape === 'rounded' && (
                                        <div className={`w-6 h-6 rounded-md border-2 ${
                                          (cvData.layout?.photoShape || 'circle') === shape ? 'border-blue-400' : 'border-gray-500'
                                        }`} />
                                      )}
                                      <span className="text-xs capitalize">{shape}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Photo Size Control */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Photo Size</label>
                                <span className="text-xs text-blue-400 font-medium">{cvData.layout?.photoSize ?? 60}px</span>
                              </div>
                              <input
                                type="range"
                                min="40"
                                max="120"
                                step="5"
                                value={cvData.layout?.photoSize ?? 60}
                                onChange={(e) => {
                                  setCvData({
                                    ...cvData,
                                    layout: {
                                      ...cvData.layout,
                                      photoSize: parseInt(e.target.value)
                                    }
                                  });
                                }}
                                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                              />
                              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                <span>Small (40px)</span>
                                <span>Large (120px)</span>
                              </div>
                            </div>

                            {/* Border Controls */}
                            <div className="space-y-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                              {/* Border Color */}
                              <div>
                                <label className="text-xs mb-2 block" style={{ color: 'var(--text-tertiary)' }}>Border Color</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="color"
                                    value={cvData.layout?.photoBorderColor ?? '#3b82f6'}
                                    onChange={(e) => {
                                      setCvData({
                                        ...cvData,
                                        layout: {
                                          ...cvData.layout,
                                          photoBorderColor: e.target.value
                                        }
                                      });
                                    }}
                                    className="w-12 h-12 rounded cursor-pointer border-2 border-white/10"
                                  />
                                  <input
                                    type="text"
                                    value={cvData.layout?.photoBorderColor ?? '#3b82f6'}
                                    onChange={(e) => {
                                      setCvData({
                                        ...cvData,
                                        layout: {
                                          ...cvData.layout,
                                          photoBorderColor: e.target.value
                                        }
                                      });
                                    }}
                                    placeholder="#3b82f6"
                                    className="flex-1 px-3 py-2 rounded-md text-sm font-mono focus:outline-none"
                                    style={{
                                      backgroundColor: 'var(--bg-tertiary)',
                                      border: '1px solid var(--border-medium)',
                                      color: 'var(--text-primary)',
                                    }}
                                    onFocus={(e) => {
                                      e.currentTarget.style.borderColor = '#3b82f6';
                                    }}
                                    onBlur={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Border Width */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Border Width</label>
                                  <span className="text-xs text-blue-400 font-medium">{cvData.layout?.photoBorderWidth ?? 0}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="8"
                                  step="1"
                                  value={cvData.layout?.photoBorderWidth ?? 0}
                                  onChange={(e) => {
                                    setCvData({
                                      ...cvData,
                                      layout: {
                                        ...cvData.layout,
                                        photoBorderWidth: parseInt(e.target.value)
                                      }
                                    });
                                  }}
                                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                />
                                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                  <span>No Border</span>
                                  <span>Thick (8px)</span>
                                </div>
                              </div>
                            </div>

                            {/* Position Controls */}
                            <div>
                              <label className="text-xs mb-2 block" style={{ color: 'var(--text-tertiary)' }}>Position</label>
                              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                {/* 9-point grid for positioning */}
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                  {[
                                    { x: 0, y: 0, label: 'Top Left' },
                                    { x: 50, y: 0, label: 'Top Center' },
                                    { x: 100, y: 0, label: 'Top Right' },
                                    { x: 0, y: 50, label: 'Center Left' },
                                    { x: 50, y: 50, label: 'Center' },
                                    { x: 100, y: 50, label: 'Center Right' },
                                    { x: 0, y: 100, label: 'Bottom Left' },
                                    { x: 50, y: 100, label: 'Bottom Center' },
                                    { x: 100, y: 100, label: 'Bottom Right' },
                                  ].map((pos) => {
                                    const currentX = cvData.layout?.photoPositionX ?? 50;
                                    const currentY = cvData.layout?.photoPositionY ?? 50;
                                    const isSelected = currentX === pos.x && currentY === pos.y;
                                    
                                    return (
                                      <button
                                        key={`${pos.x}-${pos.y}`}
                                        onClick={() => {
                                          setCvData({
                                            ...cvData,
                                            layout: {
                                              ...cvData.layout,
                                              photoPositionX: pos.x,
                                              photoPositionY: pos.y
                                            }
                                          });
                                        }}
                                        className="aspect-square rounded border transition-all"
                                        style={{
                                          borderColor: isSelected ? '#3b82f6' : 'var(--border-medium)',
                                          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.borderColor = 'var(--border-strong)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.borderColor = 'var(--border-medium)';
                                          }
                                        }}
                                        title={pos.label}
                                      >
                                        {isSelected && (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                {/* Fine-tune sliders */}
                                <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                  <div>
                                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                      <span>Horizontal</span>
                                      <span>{cvData.layout?.photoPositionX ?? 50}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={cvData.layout?.photoPositionX ?? 50}
                                      onChange={(e) => {
                                        setCvData({
                                          ...cvData,
                                          layout: {
                                            ...cvData.layout,
                                            photoPositionX: parseInt(e.target.value)
                                          }
                                        });
                                      }}
                                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                    />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                      <span>Vertical</span>
                                      <span>{cvData.layout?.photoPositionY ?? 50}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={cvData.layout?.photoPositionY ?? 50}
                                      onChange={(e) => {
                                        setCvData({
                                          ...cvData,
                                          layout: {
                                            ...cvData.layout,
                                            photoPositionY: parseInt(e.target.value)
                                          }
                                        });
                                      }}
                                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Preview */}
                            <div>
                              <label className="text-xs mb-2 block" style={{ color: 'var(--text-tertiary)' }}>Preview</label>
                              <div className="rounded-lg p-4 flex justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div
                                  className={`${
                                    // Match CV photo size classes exactly - same as sidebar photo
                                    cvData.layout?.photoPosition === 'center' ? 'w-32 h-32' : 'w-24 h-24'
                                  } overflow-hidden border-2 shadow-md ${
                                    (cvData.layout?.photoShape || 'circle') === 'circle'
                                      ? 'rounded-full'
                                      : (cvData.layout?.photoShape || 'circle') === 'rounded'
                                      ? 'rounded-lg'
                                      : 'rounded-none'
                                  }`}
                                  style={{
                                    borderColor: (() => {
                                      // Match CV border color - use template's primaryColor or accentColor
                                      const template = CV_TEMPLATES.find(t => t.id === cvData.template) || CV_TEMPLATES[0];
                                      return cvData.layout?.accentColor || template.styles.primaryColor || '#3b82f6';
                                    })(),
                                    // Force square aspect ratio
                                    aspectRatio: '1 / 1',
                                    boxSizing: 'border-box'
                                  }}
                                >
                                  <img
                                    src={cvData.photoUrl || ''}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: `${cvData.layout?.photoPositionX ?? 50}% ${cvData.layout?.photoPositionY ?? 50}%`,
                                      display: 'block',
                                      flexShrink: 0
                                    }}
                                    loading="lazy"
                                    onError={(e) => {
                                      // Hide image on error to prevent broken image icon
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : activeView === 'chat' ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      <div className="max-w-2xl mx-auto space-y-6">
                        {messages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    </div>

                {/* Input Area */}
                <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="max-w-2xl mx-auto">
                    {/* Question Limit Indicator */}
                    {!isPro && (
                      <div className="mb-2 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between" style={{ 
                        backgroundColor: (questionRemaining ?? 0) <= 1 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                        border: `1px solid ${(questionRemaining ?? 0) <= 1 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`
                      }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {(() => {
                            const remaining = questionRemaining ?? 0;
                            const baseText = isAuthenticated 
                              ? t('chat.questions_remaining_free')
                              : t('chat.questions_remaining_guest');
                            const remainingStr = remaining === Infinity ? '∞' : remaining.toString();
                            const withCount = baseText.replace('{count}', remainingStr);
                            // Handle pluralization for Dutch
                            if (language === 'nl') {
                              return withCount.replace('vragen', remaining === 1 ? 'vraag' : 'vragen');
                            }
                            // Handle pluralization for English
                            if (language === 'en') {
                              return withCount.replace('questions', remaining === 1 ? 'question' : 'questions');
                            }
                            return withCount;
                          })()}
                        </span>
                        {(questionRemaining ?? 0) <= 1 && (
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                guardedRouterPush('/auth/login');
                              } else {
                                guardedRouterPush('/pricing');
                              }
                            }}
                            className="ml-2 px-2 py-0.5 rounded text-xs font-medium transition-colors"
                            style={{ 
                              backgroundColor: 'var(--color-ladderfox-blue)',
                              color: '#ffffff'
                            }}
                          >
                            {!isAuthenticated ? t('nav.sign_in') : t('nav.upgrade')}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)' }}>
                      {/* Textarea row with buttons */}
                      <div className="relative flex items-center">
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={handleTextareaChange}
                          onKeyDown={handleKeyDown}
                          placeholder={
                            isUploading 
                              ? "Processing file..." 
                              : attachedFile 
                              ? "Describe what you'd like to do..." 
                              : t('chat.continue_conversation')
                          }
                          rows={1}
                          className="flex-1 bg-transparent px-4 py-3 pr-24 resize-none focus:outline-none text-sm"
                          style={{ 
                            minHeight: '48px', 
                            maxHeight: '120px',
                            color: 'var(--text-primary)',
                          }}
                          disabled={isProcessing || isUploading}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.md,.json"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={handleAttachmentClick}
                            disabled={isUploading || isProcessing}
                            className="p-2 flex items-center justify-center rounded-lg transition-colors"
                            style={{
                              color: isUploading 
                                ? '#60a5fa' 
                                : attachedFile
                                ? '#60a5fa'
                                : 'var(--text-tertiary)',
                            }}
                            onMouseEnter={(e) => {
                              if (!isUploading && !isProcessing) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                e.currentTarget.style.color = attachedFile ? '#60a5fa' : 'var(--text-primary)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isUploading && !isProcessing) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = attachedFile ? '#60a5fa' : 'var(--text-tertiary)';
                              }
                            }}
                            title="Upload CV/Resume"
                          >
                            <FiPaperclip size={14} />
                          </button>
                          <button
                            ref={sendButtonRef}
                            onClick={() => handleSubmit()}
                            disabled={(!inputValue.trim() && !attachedFile) || isProcessing || isUploading}
                            className="p-2 flex items-center justify-center rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                              backgroundColor: (inputValue.trim() || attachedFile) && !isProcessing && !isUploading
                                ? (document.documentElement.getAttribute('data-theme') === 'day' ? '#2563eb' : '#ffffff')
                                : 'var(--bg-hover)',
                            }}
                            onMouseEnter={(e) => {
                              if ((inputValue.trim() || attachedFile) && !isProcessing && !isUploading) {
                                const isDay = document.documentElement.getAttribute('data-theme') === 'day';
                                e.currentTarget.style.backgroundColor = isDay ? '#1d4ed8' : '#f3f4f6';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) {
                                  icon.style.color = isDay ? '#ffffff' : '#000000';
                                  icon.style.fill = 'none';
                                }
                              }
                            }}
                            onMouseLeave={(e) => {
                              if ((inputValue.trim() || attachedFile) && !isProcessing && !isUploading) {
                                const isDay = document.documentElement.getAttribute('data-theme') === 'day';
                                e.currentTarget.style.backgroundColor = isDay ? '#2563eb' : '#ffffff';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) {
                                  icon.style.color = isDay ? '#ffffff' : '#000000';
                                  icon.style.fill = 'none';
                                }
                              }
                            }}
                            onFocus={(e) => {
                              if ((inputValue.trim() || attachedFile) && !isProcessing && !isUploading) {
                                const isDay = document.documentElement.getAttribute('data-theme') === 'day';
                                e.currentTarget.style.backgroundColor = isDay ? '#2563eb' : '#ffffff';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) {
                                  icon.style.color = isDay ? '#ffffff' : '#000000';
                                  icon.style.fill = 'none';
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if ((inputValue.trim() || attachedFile) && !isProcessing && !isUploading) {
                                const isDay = document.documentElement.getAttribute('data-theme') === 'day';
                                e.currentTarget.style.backgroundColor = isDay ? '#2563eb' : '#ffffff';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) {
                                  icon.style.color = isDay ? '#ffffff' : '#000000';
                                  icon.style.fill = 'none';
                                }
                              }
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: (inputValue.trim() || attachedFile) && !isProcessing && !isUploading
                                  ? (document.documentElement.getAttribute('data-theme') === 'day' ? '#ffffff' : '#000000')
                                  : 'var(--text-disabled)',
                              }}
                            >
                              <FiSend 
                                size={16} 
                                style={{ 
                                  color: 'inherit',
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  strokeWidth: 2,
                                }} 
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                      {/* Attached file indicator */}
                      {attachedFile && (
                        <div className="px-3 pb-2">
                          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)' }}>
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <FiFileText size={12} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{attachedFile.name}</p>
                            </div>
                            <button
                              onClick={handleRemoveAttachment}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--text-tertiary)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--text-primary)';
                                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-tertiary)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                  </>
                ) : activeView === 'templates' ? (
                  /* ============ TEMPLATES VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Templates Header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <FiGrid size={16} className="text-teal-400" />
                          Templates
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
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
                          title="Back to chat"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Template Tab Switcher */}
                    <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <button
                          onClick={() => setTemplateTab('cv')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
                          style={templateTab === 'cv' 
                            ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }
                            : { color: 'var(--text-tertiary)' }
                          }
                          onMouseEnter={(e) => templateTab !== 'cv' && (e.currentTarget.style.color = 'var(--text-primary)')}
                          onMouseLeave={(e) => templateTab !== 'cv' && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                        >
                          <FiFileText size={14} />
                          CV Templates
                        </button>
                        <button
                          onClick={() => setTemplateTab('letter')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
                          style={templateTab === 'letter' 
                            ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }
                            : { color: 'var(--text-tertiary)' }
                          }
                          onMouseEnter={(e) => templateTab !== 'letter' && (e.currentTarget.style.color = 'var(--text-primary)')}
                          onMouseLeave={(e) => templateTab !== 'letter' && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                        >
                          <FiMail size={14} />
                          Letter Templates
                        </button>
                      </div>
                    </div>
                    
                    {/* Templates Content */}
                    <div className="flex-1 overflow-y-auto">
                      {templateTab === 'cv' ? (
                        <TemplateQuickSelector
                          currentTemplate={(cvData.template as CVTemplate) || 'modern'}
                          onTemplateChange={(template) => {
                            setCvData({
                              ...cvData,
                              template,
                            });
                            toast.success(`Template changed to ${template.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`);
                          }}
                          className="p-4"
                        />
                      ) : (
                        <LetterTemplateQuickSelector
                          currentTemplate={letterData.template || 'professional'}
                          onTemplateChange={(template) => {
                            setLetterData({
                              ...letterData,
                              template,
                            });
                            toast.success(`Letter template changed to ${template.charAt(0).toUpperCase() + template.slice(1)}`);
                          }}
                          className="p-4"
                        />
                      )}
                    </div>
                  </div>
                ) : activeView === 'editor' ? (
                  /* ============ EDITOR VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Editor Header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <FiAward size={16} className="text-purple-400" />
                          Editor
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Back to chat"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto">
                      <InlineEditor 
                        data={cvData} 
                        onSave={(updated) => {
                          setCvData(updated);
                          debouncedCVToast();
                        }}
                        isAuthenticated={isAuthenticated}
                        letterData={letterData}
                        onLetterSave={(updated) => {
                          setLetterData(updated);
                          debouncedLetterToast();
                        }}
                        activeEditorTab={artifactType === 'letter' && letterData ? 'letter' : 'cv'}
                        t={t}
                      />
                    </div>
                  </div>
                ) : activeView === 'ats-checker' ? (
                  /* ============ ATS CHECKER VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* ATS Checker Header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <FiCheckCircle size={16} className="text-indigo-400" />
                          ATS / CV Checker
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Back to chat"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* ATS Checker Content */}
                    <div className="flex-1 overflow-y-auto">
                      <ATSChecker cvData={cvData} />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Artifact Pane */}
              <div className={`flex flex-col ${
                isArtifactFullscreen ? 'w-full' : 'hidden lg:flex lg:w-[55%]'
              }`}
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                {/* Artifact Header */}
                <div className="h-12 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    {/* Tab Switcher */}
                    <button
                      onClick={() => setArtifactType('cv')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: artifactType === 'cv' ? 'var(--bg-hover)' : 'transparent',
                        color: artifactType === 'cv' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      }}
                      onMouseEnter={(e) => {
                        if (artifactType !== 'cv') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (artifactType !== 'cv') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                        }
                      }}
                    >
                      <FiFileText size={14} />
                      <span>{t('artifact_tabs.cv')}</span>
                    </button>
                    <button
                      onClick={() => setArtifactType('letter')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: artifactType === 'letter' ? 'var(--bg-hover)' : 'transparent',
                        color: artifactType === 'letter' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      }}
                      onMouseEnter={(e) => {
                        if (artifactType !== 'letter') {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (artifactType !== 'letter') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                        }
                      }}
                    >
                      <FiMail size={14} />
                      <span>{t('artifact_tabs.letter')}</span>
                    </button>
                    <button
                    onClick={() => {
                      toast(t('toast.jobs_coming_soon'));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-not-allowed opacity-60"
                    style={{ color: 'var(--text-disabled)' }}
                    title={t('toast.jobs_coming_soon')}
                    >
                      <FiBriefcase size={14} />
                    <span>{t('artifact_tabs.jobs')}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {artifactType === 'cv' && (
                      <>
                        {/* Zoom Controls */}
                        <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-white/10 pr-2">
                          <button
                            onClick={handleZoomOut}
                            disabled={cvZoom <= 0.5}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Zoom out"
                          >
                            <FiZoomOut size={14} />
                          </button>
                          <span className="text-xs text-gray-400 min-w-[40px] text-center font-medium">
                            {Math.round(cvZoom * 100)}%
                          </span>
                          <button
                            onClick={handleZoomIn}
                            disabled={cvZoom >= 2}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Zoom in"
                          >
                            <FiZoomIn size={14} />
                          </button>
                        </div>
                        {/* Photo Toggle */}
                        <button
                          onClick={() => {
                            const currentPosition = cvData.layout?.photoPosition || 'none';
                            const newPosition = currentPosition === 'none' ? 'left' : 'none';
                            setCvData({
                              ...cvData,
                              layout: {
                                ...cvData.layout,
                                photoPosition: newPosition
                              }
                            });
                            toast.success(newPosition === 'none' ? 'Photo hidden' : 'Photo shown');
                          }}
                          className={`p-2 flex items-center justify-center rounded-lg transition-colors ${
                            cvData.layout?.photoPosition !== 'none'
                              ? 'text-blue-400 hover:bg-blue-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                          title={cvData.layout?.photoPosition !== 'none' ? 'Hide photo' : 'Show photo'}
                        >
                          <FiImage size={16} />
                        </button>
                        <button
                          onClick={handleSaveCV}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Save CV"
                        >
                          <FiCheck size={14} />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                        <button
                          onClick={handleCopy}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Copy"
                        >
                          <FiCopy size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (isFree) {
                              toast.error(t('toast.download_free_account'));
                              guardedRouterPush('/pricing');
                              return;
                            }
                            handleDownload();
                          }}
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
                          title={isFree ? 'Pro feature: upgrade to download' : 'Download PDF'}
                        >
                          <FiDownload size={16} />
                        </button>
                      </>
                    )}
                    {artifactType === 'letter' && (
                      <>
                        <button
                          onClick={() => {
                            if (isFree) {
                              toast.error(t('toast.copy_letter_pro_feature'));
                              guardedRouterPush('/pricing');
                              return;
                            }
                            navigator.clipboard.writeText(
                              `${letterData.opening}\n\n${letterData.body}\n\n${letterData.closing}\n\n${letterData.signature}`
                            );
                            toast.success('Letter copied to clipboard');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title={isFree ? 'Pro feature: upgrade to copy' : 'Copy Letter'}
                        >
                          <FiCopy size={14} />
                          <span className="hidden sm:inline">Copy</span>
                        </button>
                        <button
                          onClick={handleSaveLetter}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Save Letter"
                        >
                          <FiCheck size={14} />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                        <button
                          onClick={() => {
                            if (isFree) {
                              toast.error(t('toast.download_free_account'));
                              guardedRouterPush('/pricing');
                              return;
                            }
                            const content = `${letterData.opening}\n\n${letterData.body}\n\n${letterData.closing}\n\n${letterData.signature}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'cover_letter.txt';
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success('Letter downloaded');
                          }}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title={isFree ? 'Pro feature: upgrade to download' : 'Download'}
                        >
                          <FiDownload size={16} />
                        </button>
                      </>
                    )}
                    {artifactType === 'jobs' && savedJobs.length > 0 && (
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {savedJobs.length} saved
                      </span>
                    )}
                    <button
                      onClick={() => setIsArtifactFullscreen(!isArtifactFullscreen)}
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
                      title={isArtifactFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {isArtifactFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* Artifact Content */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {artifactType === 'cv' && (
                      <motion.div
                        key="cv"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full"
                      >
                        <PDFPreviewViewer 
                          data={cvData}
                          onDataChange={setCvData}
                          onDownload={() => toast.success('PDF downloaded!')}
                          showControls={false}
                          externalZoom={cvZoom}
                          className="h-full"
                        />
                      </motion.div>
                    )}
                    {artifactType === 'letter' && (
                      <motion.div
                        key="letter"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`h-full ${isFree ? 'select-none' : ''}`}
                      >
                        <LetterPreview 
                          data={letterData}
                          onDataChange={setLetterData}
                          cvData={cvData}
                          t={t}
                        />
                      </motion.div>
                    )}
                    {artifactType === 'jobs' && (
                      <motion.div
                        key="jobs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex items-center justify-center text-center px-6"
                      >
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-sm font-medium">
                            <FiBriefcase size={14} /> {t('toast.jobs_coming_soon')}
                          </div>
                          <p className="text-gray-400 text-sm max-w-md">
                            We’re still polishing the job matching experience. It will be available soon.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile: Show Artifact Toggle */}
              <button
                onClick={() => setIsArtifactFullscreen(!isArtifactFullscreen)}
                className="lg:hidden fixed bottom-20 right-4 z-30 p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30"
              >
                {artifactType === 'jobs' ? <FiBriefcase size={20} /> : artifactType === 'letter' ? <FiMail size={20} /> : <FiFileText size={20} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Language Debug Component (only in development) */}
      <LanguageDebug />
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: Message }) {
  const { t } = useLocale();
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : ''}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white">
              LF
            </div>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>LadderFox</span>
          </div>
        )}
        
        {/* Message Content */}
        <div 
          className="px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isUser 
              ? '#2563eb' 
              : 'var(--bg-elevated)',
            color: isUser 
              ? '#ffffff' 
              : 'var(--text-primary)',
          }}
        >
          {message.isStreaming ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ 
                    animationDelay: '0ms',
                    backgroundColor: 'var(--text-tertiary)',
                  }} 
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ 
                    animationDelay: '150ms',
                    backgroundColor: 'var(--text-tertiary)',
                  }} 
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ 
                    animationDelay: '300ms',
                    backgroundColor: 'var(--text-tertiary)',
                  }} 
                />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('chat.thinking')}</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              <FormattedMessage content={message.content} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Format message with basic markdown
function FormattedMessage({ content }: { content: string }) {
  // Simple markdown parsing
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return <h3 key={idx} className="font-semibold text-base mt-2">{line.slice(3)}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={idx} className="font-bold text-lg mt-2">{line.slice(2)}</h2>;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={idx} className="flex gap-2 ml-2">
              <span style={{ color: 'var(--text-tertiary)' }}>•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-semibold">{line.slice(2, -2)}</p>;
        }
        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }
        // Handle inline bold
        const boldRegex = /\*\*(.+?)\*\*/g;
        const withBold = line.replace(boldRegex, '<strong>$1</strong>');
        return <p key={idx} dangerouslySetInnerHTML={{ __html: withBold }} />;
      })}
    </div>
  );
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Menu Item Component
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

// Deep merge utility
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' && 
        source[key] !== null && 
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = deepMerge(result[key], source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  return result;
}
