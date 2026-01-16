'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
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
  FiZoomIn, FiZoomOut, FiList
} from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { JobSwiper, JobMatch } from '@/components/JobSwiper';
import TemplateQuickSelector from '@/components/TemplateQuickSelector';
import { CVTemplate } from '@/components/pdf/CVDocumentPDF';
import { sanitizeCVDataForAPI as sanitizeForAPI } from '@/utils/cvDataSanitizer';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

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
  body?: string;
  closing?: string;
  signature?: string;
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
  cvData 
}: { 
  data: LetterData; 
  onDataChange: (data: LetterData) => void;
  cvData: CVData;
}) {
  return (
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      {/* Letter Document */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded-lg shadow-2xl p-8 min-h-[600px]">
          {/* Letter Header */}
          <div className="mb-8">
            <div className="text-right text-sm text-gray-600 mb-6">
              <p>{cvData.fullName || 'Your Name'}</p>
              <p>{cvData.contact?.email || 'email@example.com'}</p>
              <p>{cvData.contact?.phone || '(123) 456-7890'}</p>
              <p>{cvData.contact?.location || 'City, Country'}</p>
              <p className="mt-2">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            {data.companyName && (
              <div className="text-sm text-gray-600 mb-6">
                <p>{data.recipientName || 'Hiring Manager'}</p>
                {data.recipientTitle && <p>{data.recipientTitle}</p>}
                <p>{data.companyName}</p>
                {data.companyAddress && <p>{data.companyAddress}</p>}
              </div>
            )}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p className="font-medium">{data.opening || 'Dear Hiring Manager,'}</p>
            
            {data.body ? (
              data.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <div className="text-gray-400 italic py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <FiMail size={32} className="mx-auto mb-2 opacity-50" />
                <p>Your cover letter content will appear here.</p>
                <p className="text-sm mt-2">Ask the AI to write a cover letter, or use the Editor to compose one.</p>
              </div>
            )}
            
            <p className="mt-6">{data.closing || 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.'}</p>
            
            <div className="mt-8">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium">{data.signature || cvData.fullName || 'Your Name'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Edit Bar */}
      <div className="border-t border-white/5 p-3 bg-[#111111]">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <span className="text-xs text-gray-500">
            {data.body ? `${data.body.length} characters` : 'No content yet'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Pro tip: Use the Editor tab to customize your letter</span>
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
  isAuthenticated = false
}: { 
  data: CVData; 
  onSave: (data: CVData) => void;
  letterData?: LetterData;
  onLetterSave?: (data: LetterData) => void;
  activeEditorTab?: 'cv' | 'letter';
  setActiveEditorTab?: (tab: 'cv' | 'letter') => void;
  isAuthenticated?: boolean;
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

  return (
    <div className="p-4 space-y-3">
      {/* Editor Tab Switcher */}
      {letterData && onLetterSave && (
        <div className="flex items-center gap-2 mb-4 p-1 bg-white/5 rounded-lg">
          <button
            onClick={() => setEditorTab('cv')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              editorTab === 'cv' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiFileText size={14} />
            CV Editor
          </button>
          <button
            onClick={() => setEditorTab('letter')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              editorTab === 'letter' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiMail size={14} />
            Letter Editor
          </button>
        </div>
      )}

      {/* Letter Editor */}
      {editorTab === 'letter' && letterData && onLetterSave && (
        <div className="space-y-3">
          {/* Recipient Info */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <FiUser size={14} className="text-blue-400" />
              Recipient Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Recipient Name</label>
                <input
                  type="text"
                  value={letterData.recipientName || ''}
                  onChange={(e) => handleLetterChange('recipientName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Hiring Manager"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  type="text"
                  value={letterData.recipientTitle || ''}
                  onChange={(e) => handleLetterChange('recipientTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="HR Director"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Company Name</label>
                <input
                  type="text"
                  value={letterData.companyName || ''}
                  onChange={(e) => handleLetterChange('companyName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Job Title</label>
                <input
                  type="text"
                  value={letterData.jobTitle || ''}
                  onChange={(e) => handleLetterChange('jobTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <FiMail size={14} className="text-purple-400" />
              Letter Content
            </h3>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Opening / Salutation</label>
              <input
                type="text"
                value={letterData.opening || ''}
                onChange={(e) => handleLetterChange('opening', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="Dear Hiring Manager,"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Body</label>
              <textarea
                value={letterData.body || ''}
                onChange={(e) => handleLetterChange('body', e.target.value)}
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="I am writing to express my interest in the position..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {letterData.body?.length || 0} characters • Use double line breaks for new paragraphs
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Closing</label>
              <textarea
                value={letterData.closing || ''}
                onChange={(e) => handleLetterChange('closing', e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Thank you for considering my application..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Signature</label>
              <input
                type="text"
                value={letterData.signature || ''}
                onChange={(e) => handleLetterChange('signature', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <FiStar size={14} className="text-purple-400" />
              AI Writing Tips
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
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
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiUser size={16} className="text-blue-400" />
            <span className="font-medium">Personal Information</span>
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('personal') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('personal') && (
          <div className="p-4 pt-0 space-y-3 border-t border-white/5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={data.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Job Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={data.contact?.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value, 'contact')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={data.contact?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value, 'contact')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Location</label>
              <input
                type="text"
                value={data.contact?.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value, 'contact')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="New York, NY"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">LinkedIn</label>
                <input
                  type="text"
                  value={data.social?.linkedin || ''}
                  onChange={(e) => handleFieldChange('linkedin', e.target.value, 'social')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Website</label>
                <input
                  type="text"
                  value={data.social?.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value, 'social')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiFileText size={16} className="text-purple-400" />
            <span className="font-medium">Professional Summary</span>
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('summary') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('summary') && (
          <div className="p-4 pt-0 border-t border-white/5">
            <textarea
              value={data.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Brief professional summary..."
            />
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiBriefcase size={16} className="text-green-400" />
            <span className="font-medium">Work Experience</span>
            {data.experience?.length ? (
              <span className="text-xs text-gray-500">({data.experience.length})</span>
            ) : null}
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('experience') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('experience') && (
          <div className="p-4 pt-0 space-y-3 border-t border-white/5">
            {(data.experience || []).map((exp, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Position {index + 1}</span>
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={exp.dates || ''}
                  onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Jan 2020 - Present"
                />
                <textarea
                  value={Array.isArray(exp.content) ? exp.content.join('\n') : exp.content || ''}
                  onChange={(e) => handleExperienceChange(index, 'content', e.target.value.split('\n').filter(Boolean))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  placeholder="• Key achievement 1&#10;• Key achievement 2"
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiPlus size={14} />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiStar size={16} className="text-yellow-400" />
            <span className="font-medium">Education</span>
            {data.education?.length ? (
              <span className="text-xs text-gray-500">({data.education.length})</span>
            ) : null}
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('education') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('education') && (
          <div className="p-4 pt-0 space-y-3 border-t border-white/5">
            {(data.education || []).map((edu, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Education {index + 1}</span>
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Degree (e.g., Bachelor of Science)"
                />
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Institution Name"
                />
                <input
                  type="text"
                  value={edu.field || ''}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Field of Study"
                />
                <input
                  type="text"
                  value={edu.dates || ''}
                  onChange={(e) => handleEducationChange(index, 'dates', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="2016 - 2020"
                />
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiPlus size={14} />
              Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiEdit3 size={16} className="text-cyan-400" />
            <span className="font-medium">Skills</span>
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('skills') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('skills') && (
          <div className="p-4 pt-0 border-t border-white/5">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="JavaScript, TypeScript, React, Node.js, Python..."
            />
            <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('languages')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiFolder size={16} className="text-orange-400" />
            <span className="font-medium">Languages</span>
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('languages') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('languages') && (
          <div className="p-4 pt-0 border-t border-white/5">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="English (Native), Spanish (Fluent), French (Basic)..."
            />
            <p className="text-xs text-gray-500 mt-2">Separate languages with commas</p>
          </div>
        )}
      </div>

      {/* Hobbies Section */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('hobbies')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiClock size={16} className="text-pink-400" />
            <span className="font-medium">Hobbies & Interests</span>
          </div>
          <FiChevronRight size={16} className={`text-gray-400 transition-transform ${expandedSections.includes('hobbies') ? 'rotate-90' : ''}`} />
        </button>
        {expandedSections.includes('hobbies') && (
          <div className="p-4 pt-0 border-t border-white/5">
            <textarea
              value={Array.isArray(data.hobbies) ? data.hobbies.join(', ') : data.hobbies || ''}
              onChange={(e) => handleFieldChange('hobbies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Photography, Hiking, Reading, Chess..."
            />
            <p className="text-xs text-gray-500 mt-2">Separate hobbies with commas</p>
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
  const { t, language } = useLocale();
  
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
  const [activeView, setActiveView] = useState<'chat' | 'editor' | 'photos' | 'templates'>('chat');
  const [photos, setPhotos] = useState<string[]>([]); // Array of photo URLs
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Subscription gating
  const plan = subscription?.status === 'active' ? (subscription?.plan || 'free') : 'free';
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
        } catch (err) {
          console.error('Error loading CV from localStorage:', err);
          // Clear invalid data
          localStorage.removeItem('cvData');
          localStorage.removeItem('saved_cv_id');
          isLoadingFromLocalStorage.current = false;
        }
      }
    }
  }, []); // Only run once on mount

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

  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  
  // Letter State
  const [letterData, setLetterData] = useState<LetterData>({
    opening: 'Dear Hiring Manager,',
    body: '',
    closing: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.',
    signature: cvData.fullName || '',
  });
  
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

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      }
    } catch (err) {
      toast.error(t('toast.cv_load_failed'));
    }
    setIsSidebarOpen(false);
  };

  // Save current CV
  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      toast.error(t('toast.please_sign_in'));
      return;
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
    } catch (err) {
      toast.error(t('toast.cv_save_failed'));
    }
  };

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
    
    // Cover letter keywords
    const letterKeywords = [
      'cover letter', 'motivation letter', 'application letter', 'write cover letter',
      'create cover letter', 'build cover letter', 'craft cover letter', 'cover letter for',
      'letter for job', 'application letter', 'motivational letter'
    ];
    
    // Job search keywords (disabled for now)
    const jobKeywords = [
      'find jobs', 'search jobs', 'job search', 'find me jobs', 'matching jobs',
      'jobs for me', 'job opportunities', 'available jobs', 'job openings',
      'career opportunities', 'job matches', 'recommend jobs'
    ];
    
    // Check for CV keywords (highest priority if CV-related)
    if (cvKeywords.some(keyword => lowerInput.includes(keyword))) {
      return 'cv';
    }
    
    // Check for letter keywords
    if (letterKeywords.some(keyword => lowerInput.includes(keyword))) {
      return 'letter';
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

    // Prompt limit for free users: max 10/day
    const usageKey = `promptUsage_${user?.id || 'guest'}`;
    const today = new Date().toISOString().slice(0, 10);
    let usage = { date: today, count: 0 };
    try {
      const stored = localStorage.getItem(usageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          usage = parsed;
        }
      }
    } catch (err) {
      console.warn('Prompt usage read error', err);
    }
    if (isFree && usage.count >= PROMPT_LIMIT) {
      toast.error('Daglimiet bereikt (10 prompts). Upgrade naar Pro voor onbeperkt chatten.');
      return;
    }
    // increment usage immediately to avoid bypassing
    try {
      const next = { date: today, count: usage.count + 1 };
      localStorage.setItem(usageKey, JSON.stringify(next));
    } catch (err) {
      console.warn('Prompt usage write error', err);
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
    if (!isPro) {
      toast.error('Downloading CV is a Pro feature. Please upgrade to download.');
      router.push('/pricing');
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
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 backdrop-blur-xl border-b z-50" style={{ overflow: 'visible', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', opacity: 0.95 }}>
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between" style={{ overflow: 'visible' }}>
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors lg:hidden"
            >
              <FiMenu size={20} />
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
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
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiList size={16} />
                <span className="hidden xl:inline">Chat overview</span>
                <span className="xl:hidden">Chats</span>
              </motion.button>
            </div>
          )}

          {/* Right: Theme Switcher & User Menu */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef} style={{ overflow: 'visible', zIndex: 100 }}>
                <button 
                  onClick={() => {
                    console.log('[UserMenu] toggle click (home)', { wasOpen: isUserMenuOpen });
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
                      className="hidden lg:block absolute left-auto right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 z-[9999]"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="font-medium text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <MenuItem icon={FiGrid} label={t('nav.dashboard')} onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} />
                        <MenuItem icon={FiFolder} label={t('nav.my_cvs')} onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?tab=cvs'); }} />
                        <MenuItem icon={FiBriefcase} label={t('nav.job_applications_coming_soon')} onClick={() => { setIsUserMenuOpen(false); toast(t('toast.job_applications_coming_soon')); }} />
                      </div>
                      
                      <div className="border-t border-white/5 py-2">
                        <MenuItem icon={FiCreditCard} label={t('nav.subscription')} onClick={() => { setIsUserMenuOpen(false); router.push('/pricing'); }} badge={subBadge} />
                        <MenuItem icon={FiSettings} label={t('nav.settings')} onClick={() => { setIsUserMenuOpen(false); router.push('/settings'); }} />
                        <MenuItem icon={FiHelpCircle} label={t('nav.help_support')} onClick={() => { setIsUserMenuOpen(false); router.push('/faq'); }} />
                      </div>
                      
                      <div className="border-t border-white/5 py-2">
                        <MenuItem 
                          icon={FiLogOut} 
                          label={t('nav.sign_out')} 
                          onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                          variant="danger"
                        />
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
                    onClick={() => { setIsUserMenuOpen(false); toast('Job Applications coming soon 🚧'); }}
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
              className="fixed top-14 left-0 bottom-0 w-[280px] bg-[#111111] border-r border-white/5 z-40 overflow-y-auto"
            >
              <div className="p-4 space-y-4">
                {/* Desktop close button */}
                <div className="hidden lg:flex justify-end">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors mb-6"
                >
                  <FiPlus size={18} />
                  <span>New conversation</span>
                </button>

                {/* Saved CVs */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                    {t('nav.my_cvs')}
                  </h3>
                  <div className="space-y-1">
                    {savedCVs.length > 0 ? (
                      savedCVs.map((cv) => (
                        <button
                          key={cv.id}
                          onClick={() => handleLoadCV(cv.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left ${
                            currentCVId === cv.id ? 'bg-white/5' : ''
                          }`}
                        >
                          <FiFileText size={14} className="text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{cv.title}</p>
                            <p className="text-xs text-gray-500">{cv.updatedAt}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 px-3 py-2">
                        {isAuthenticated ? 'No saved CVs yet' : 'Sign in to see your CVs'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                    {t('landing.main.quick_actions')}
                  </h3>
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <FiGrid size={14} className="text-gray-400" />
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
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
                      setArtifactType('cv');
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left group"
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
                        color: 'var(--text-primary)',
                      }}
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
                        boxSizing: 'border-box'
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
              <div className={`flex flex-col ${isArtifactFullscreen ? 'hidden' : 'w-full lg:w-[45%]'} border-r border-white/5`}>
                {/* View Toggle (Chat/Editor/Photos) */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <button
                    onClick={() => setActiveView('chat')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'chat' 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FiSend size={14} />
                    Chat
                  </button>
                  {isPro && (
                    <button
                      onClick={() => setActiveView('editor')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeView === 'editor' 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <FiAward size={14} className="text-purple-400" />
                      Editor
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveView('photos')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'photos' 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeView === 'templates' 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FiGrid size={14} className="text-teal-400" />
                    Templates
                  </button>
                </div>
                
                {activeView === 'photos' ? (
                  /* ============ PHOTOS VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Photos Header */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2">
                          <FiImage size={16} className="text-blue-400" />
                          Photo Management
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
                          className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium mb-1">Show Photo on CV</h3>
                              <p className="text-xs text-gray-500">Toggle photo visibility on your CV</p>
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
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                          <h3 className="text-sm font-medium mb-3">Add New Photo</h3>
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
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            <FiUpload size={16} />
                            {t('common.upload_photos')}
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center">JPG, PNG up to 4MB each. You can upload multiple photos.</p>
                        </div>

                        {/* Photo Gallery */}
                        {photos.length > 0 && (
                          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                            <h3 className="text-sm font-medium mb-3">{t('common.your_photos')} ({photos.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {photos.map((photo, index) => (
                                <div
                                  key={index}
                                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                    selectedPhotoIndex === index
                                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                                      : 'border-white/10 hover:border-white/20'
                                  }`}
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
                              <p className="text-xs text-gray-500 mt-3 text-center">
                                Photo {selectedPhotoIndex + 1} is currently selected and will appear on your CV
                              </p>
                            )}
                          </div>
                        )}

                        {/* Photo Settings */}
                        {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
                          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-4">
                            <h3 className="text-sm font-medium">Photo Settings</h3>
                            
                            {/* Shape Selector */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block">Shape</label>
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
                                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                                      (cvData.layout?.photoShape || 'circle') === shape
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                    }`}
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
                                <label className="text-xs text-gray-400">Photo Size</label>
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
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Small (40px)</span>
                                <span>Large (120px)</span>
                              </div>
                            </div>

                            {/* Border Controls */}
                            <div className="space-y-3 pt-3 border-t border-white/5">
                              {/* Border Color */}
                              <div>
                                <label className="text-xs text-gray-400 mb-2 block">Border Color</label>
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
                                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-md text-sm font-mono text-gray-300 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Border Width */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="text-xs text-gray-400">Border Width</label>
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
                                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>No Border</span>
                                  <span>Thick (8px)</span>
                                </div>
                              </div>
                            </div>

                            {/* Position Controls */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block">Position</label>
                              <div className="bg-[#0a0a0a] rounded-lg p-3">
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
                                        className={`aspect-square rounded border transition-all ${
                                          isSelected
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-white/10 hover:border-white/30'
                                        }`}
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
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                  <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
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
                                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
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
                                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Preview */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block">Preview</label>
                              <div className="bg-[#0a0a0a] rounded-lg p-4 flex justify-center">
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
                <div className="border-t border-white/5 p-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
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
                          className="flex-1 bg-transparent px-4 py-3 pr-24 resize-none focus:outline-none placeholder-gray-500 text-sm"
                          style={{ minHeight: '48px', maxHeight: '120px' }}
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
                            className={`p-2 flex items-center justify-center rounded-lg transition-colors ${
                              isUploading 
                                ? 'text-blue-400 animate-pulse' 
                                : attachedFile
                                ? 'text-blue-400 hover:bg-white/5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            title="Upload CV/Resume"
                          >
                            <FiPaperclip size={14} />
                          </button>
                          <button
                            onClick={() => handleSubmit()}
                            disabled={(!inputValue.trim() && !attachedFile) || isProcessing || isUploading}
                            className={`p-2 flex items-center justify-center rounded-lg transition-all ${
                              (inputValue.trim() || attachedFile) && !isProcessing && !isUploading
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-white/10 text-gray-500'
                            }`}
                          >
                            <FiSend size={16} />
                          </button>
                        </div>
                      </div>
                      {/* Attached file indicator */}
                      {attachedFile && (
                        <div className="px-3 pb-2">
                          <div className="flex items-center gap-2 px-2.5 py-2 bg-white/5 rounded-lg border border-white/10">
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <FiFileText size={12} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-300 truncate">{attachedFile.name}</p>
                            </div>
                            <button
                              onClick={handleRemoveAttachment}
                              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
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
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2">
                          <FiGrid size={16} className="text-teal-400" />
                          CV Templates
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
                          className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Back to chat"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Templates Content */}
                    <div className="flex-1 overflow-y-auto">
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
                    </div>
                  </div>
                ) : activeView === 'editor' ? (
                  /* ============ EDITOR VIEW ============ */
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Editor Header */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium flex items-center gap-2">
                          <FiAward size={16} className="text-purple-400" />
                          CV Editor
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
                        </h2>
                        <button
                          onClick={() => setActiveView('chat')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Artifact Pane */}
              <div className={`flex flex-col bg-[#111111] ${
                isArtifactFullscreen ? 'w-full' : 'hidden lg:flex lg:w-[55%]'
              }`}>
                {/* Artifact Header */}
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    {/* Tab Switcher */}
                    <button
                      onClick={() => setArtifactType('cv')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        artifactType === 'cv' 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <FiFileText size={14} />
                      <span>CV</span>
                    </button>
                    <button
                      onClick={() => setArtifactType('letter')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        artifactType === 'letter' 
                          ? 'bg-white/10 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <FiMail size={14} />
                      <span>Letter</span>
                    </button>
                    <button
                    onClick={() => {
                      toast(t('toast.jobs_coming_soon'));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors text-gray-500 cursor-not-allowed opacity-60"
                    title={t('toast.jobs_coming_soon')}
                    >
                      <FiBriefcase size={14} />
                    <span>Jobs</span>
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
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Copy"
                        >
                          <FiCopy size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (isFree) {
                              toast.error('Downloading CV is a Pro feature. Please upgrade to download.');
                              router.push('/pricing');
                              return;
                            }
                            handleDownload();
                          }}
                          className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                              router.push('/pricing');
                              return;
                            }
                            navigator.clipboard.writeText(
                              `${letterData.opening}\n\n${letterData.body}\n\n${letterData.closing}\n\n${letterData.signature}`
                            );
                            toast.success('Letter copied to clipboard');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title={isFree ? 'Pro feature: upgrade to copy' : 'Copy Letter'}
                        >
                          <FiCopy size={14} />
                          <span className="hidden sm:inline">Copy</span>
                        </button>
                        <button
                          onClick={() => {
                            if (isFree) {
                              toast.error('Downloading letters is a Pro feature. Please upgrade to download.');
                              router.push('/pricing');
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
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title={isFree ? 'Pro feature: upgrade to download' : 'Download'}
                        >
                          <FiDownload size={16} />
                        </button>
                      </>
                    )}
                    {artifactType === 'jobs' && savedJobs.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {savedJobs.length} saved
                      </span>
                    )}
                    <button
                      onClick={() => setIsArtifactFullscreen(!isArtifactFullscreen)}
                      className="p-2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-[10px] font-bold">
              LF
            </div>
            <span className="text-xs text-gray-500">LadderFox</span>
          </div>
        )}
        
        {/* Message Content */}
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-[#1a1a1a] text-gray-100'
        }`}>
          {message.isStreaming ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-400">{t('chat.thinking')}</span>
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
              <span className="text-gray-400">•</span>
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
  variant = 'default'
}: { 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; 
  onClick: () => void;
  badge?: string;
  external?: boolean;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        variant === 'danger' 
          ? 'text-red-400 hover:bg-red-500/10' 
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium rounded-full">
          {badge}
        </span>
      )}
      {external && <FiExternalLink size={12} className="text-gray-500" />}
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
