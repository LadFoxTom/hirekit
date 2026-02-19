'use client';

import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { WIDGET_TEMPLATES, WidgetTemplateConfig, JOB_LISTING_TEMPLATES, JobListingTemplateConfig } from '@repo/types';
import { EmailTemplatesTab } from './EmailTemplatesTab';
import { TeamTab } from './TeamTab';

interface Settings {
  company: { id: string; name: string; slug: string };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    showCompanyName: boolean;
    logoUrl: string | null;
    tagline: string | null;
  };
  sections: Record<string, { enabled: boolean; min?: number; max?: number }>;
  landingPage: {
    successMessage: string;
    redirectUrl: string | null;
    widgetType: 'form' | 'chat';
  };
  templateType: string;
  jobListingConfig: {
    templateId: string;
    showFilters: boolean;
    showSearch: boolean;
    customTemplateCSS: string | null;
    customTemplateName: string | null;
    customFontUrl: string | null;
    customLayout: string | null;
    customSourceUrl: string | null;
    customDesignTokens?: Record<string, string> | null;
  };
}

type Tab = 'general' | 'job-listings' | 'cv-builder' | 'email-templates' | 'team';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [cvBuilderView, setCvBuilderView] = useState<'sections' | 'styling'>('sections');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLogoPreview(data.branding?.logoUrl || null);
      })
      .catch(() => setError('Failed to load settings'));
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branding: settings.branding,
          sections: settings.sections,
          landingPage: settings.landingPage,
          templateType: settings.templateType,
          jobListingConfig: settings.jobListingConfig,
        }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: 'ph ph-gear' },
    { id: 'job-listings', label: 'Job Listings', icon: 'ph ph-briefcase' },
    { id: 'cv-builder', label: 'CV Builder', icon: 'ph ph-file-text' },
    { id: 'email-templates', label: 'Email Templates', icon: 'ph ph-envelope' },
    { id: 'team', label: 'Team', icon: 'ph ph-users-three' },
  ];

  const sectionDefs = [
    { key: 'personalInfo', label: 'Personal Information', desc: 'Name, email, phone, location, summary', hasMinMax: false },
    { key: 'experience', label: 'Work Experience', desc: 'Job history with achievements', hasMinMax: true },
    { key: 'education', label: 'Education', desc: 'Degrees and institutions', hasMinMax: true },
    { key: 'skills', label: 'Skills', desc: 'Technical and soft skills', hasMinMax: false },
    { key: 'languages', label: 'Languages', desc: 'Language proficiencies and levels', hasMinMax: false },
    { key: 'certifications', label: 'Certifications', desc: 'Professional certifications and licenses', hasMinMax: true },
    { key: 'projects', label: 'Projects', desc: 'Notable projects and portfolio items', hasMinMax: true },
    { key: 'hobbies', label: 'Hobbies & Interests', desc: 'Personal interests and activities', hasMinMax: false },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setLogoPreview(dataUrl);
      setSettings({
        ...settings,
        branding: { ...settings.branding, logoUrl: dataUrl },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Configuration</h2>
            <p className="text-[#64748B] text-[15px] mt-1">
              Configure your widget appearance and behavior
            </p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 bg-[#4F46E5] text-white rounded-full text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-[#DCFCE7] text-[#16A34A] rounded-2xl text-sm font-medium flex items-center gap-2">
            <i className="ph ph-check-circle text-lg" />
            Settings saved successfully.
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-[#FEE2E2] text-[#DC2626] rounded-2xl text-sm font-medium flex items-center gap-2">
            <i className="ph ph-warning text-lg" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAFBFC]'
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Company Profile */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <i className="ph ph-buildings text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Company Profile</h3>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">Company Name</label>
                    <input
                      type="text"
                      value={settings.company.name}
                      disabled
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-[#FAFBFC] text-[#94A3B8]"
                    />
                    <p className="text-xs text-[#94A3B8] mt-1">Contact support to change your company name</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">Company Slug</label>
                    <input
                      type="text"
                      value={settings.company.slug}
                      disabled
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-[#FAFBFC] text-[#94A3B8]"
                    />
                    <p className="text-xs text-[#94A3B8] mt-1">Used in your widget URL: {settings.company.slug}.hirekit.io</p>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Company ID</label>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-2.5 bg-[#FAFBFC] border border-slate-200 rounded-xl text-sm font-mono text-[#64748B]">
                      {settings.company.id}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(settings.company.id)}
                      className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-[#64748B] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                    >
                      <i className="ph ph-copy" />
                    </button>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">Use this ID in your widget embed code and API calls</p>
                </div>
              </div>
            </div>

            {/* Logo & Identity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <i className="ph ph-image text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Logo & Identity</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Company Logo</label>
                  <p className="text-xs text-[#94A3B8] mb-3">PNG, JPG or SVG. Recommended 200x60px.</p>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#4F46E5] transition-colors">
                    {logoPreview ? (
                      <div className="space-y-3">
                        <img src={logoPreview} alt="Logo" className="max-h-16 mx-auto object-contain" />
                        <button
                          onClick={() => {
                            setLogoPreview(null);
                            setSettings({ ...settings, branding: { ...settings.branding, logoUrl: null } });
                          }}
                          className="text-sm text-[#FF6B6B] font-medium hover:underline"
                        >
                          Remove logo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="w-12 h-12 bg-[#E0E7FF] rounded-[20px] flex items-center justify-center mx-auto mb-3">
                          <i className="ph ph-upload-simple text-[#4F46E5] text-xl" />
                        </div>
                        <p className="text-sm font-medium text-[#1E293B]">Click to upload logo</p>
                        <p className="text-xs text-[#94A3B8] mt-1">or drag and drop</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">Show Company Name</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.branding.showCompanyName}
                          onChange={(e) =>
                            setSettings({ ...settings, branding: { ...settings.branding, showCompanyName: e.target.checked } })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-checked:bg-[#4F46E5] rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                      </div>
                      <span className="text-sm text-[#64748B]">Display company name in widget header</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.branding.tagline || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, branding: { ...settings.branding, tagline: e.target.value || null } })
                      }
                      placeholder="e.g. Join our amazing team"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colors & Typography */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <i className="ph ph-palette text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Colors & Typography</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <ColorPicker
                  label="Primary Color"
                  desc="Buttons, progress bar, headings"
                  value={settings.branding.primaryColor}
                  onChange={(v) => setSettings({ ...settings, branding: { ...settings.branding, primaryColor: v } })}
                />
                <ColorPicker
                  label="Secondary Color"
                  desc="Backgrounds, subtle accents"
                  value={settings.branding.secondaryColor}
                  onChange={(v) => setSettings({ ...settings, branding: { ...settings.branding, secondaryColor: v } })}
                />
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-1">Font Family</label>
                  <p className="text-xs text-[#94A3B8] mb-2">Widget text font</p>
                  <select
                    value={settings.branding.fontFamily}
                    onChange={(e) =>
                      setSettings({ ...settings, branding: { ...settings.branding, fontFamily: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                    <option value="system-ui">System Default</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CV Builder Tab */}
        {activeTab === 'cv-builder' && (
          <div className="space-y-6">
            {/* Sub-tab toggle */}
            <div className="flex gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setCvBuilderView('sections')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  cvBuilderView === 'sections'
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAFBFC]'
                }`}
              >
                <i className="ph ph-list-checks" />
                Sections
              </button>
              <button
                onClick={() => setCvBuilderView('styling')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  cvBuilderView === 'styling'
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAFBFC]'
                }`}
              >
                <i className="ph ph-paint-brush" />
                Styling
              </button>
            </div>

            {/* Sections view */}
            {cvBuilderView === 'sections' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ph ph-list-checks text-xl text-[#4F46E5]" />
                  <h3 className="text-lg font-bold text-[#1E293B]">CV Sections</h3>
                </div>
                <p className="text-[15px] text-[#64748B] mb-8">
                  Configure which sections applicants see and how many entries they can add.
                </p>

                <div className="space-y-4">
                  {sectionDefs.map((sec) => {
                    const config = settings.sections[sec.key] || { enabled: true };
                    return (
                      <div
                        key={sec.key}
                        className={`border rounded-2xl p-5 transition-all duration-300 ${
                          config.enabled
                            ? 'border-slate-200 bg-white'
                            : 'border-slate-100 bg-[#FAFBFC]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    sections: {
                                      ...settings.sections,
                                      [sec.key]: { ...config, enabled: e.target.checked },
                                    },
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div
                                onClick={() =>
                                  setSettings({
                                    ...settings,
                                    sections: {
                                      ...settings.sections,
                                      [sec.key]: { ...config, enabled: !config.enabled },
                                    },
                                  })
                                }
                                className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 relative ${
                                  config.enabled ? 'bg-[#4F46E5]' : 'bg-slate-200'
                                }`}
                              >
                                <div
                                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    config.enabled ? 'translate-x-5' : ''
                                  }`}
                                />
                              </div>
                            </div>
                            <div>
                              <span className={`font-semibold text-sm ${config.enabled ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>
                                {sec.label}
                              </span>
                              <p className={`text-xs mt-0.5 ${config.enabled ? 'text-[#64748B]' : 'text-[#CBD5E1]'}`}>
                                {sec.desc}
                              </p>
                            </div>
                          </div>
                        </div>

                        {sec.hasMinMax && config.enabled && (
                          <div className="flex gap-6 mt-4 ml-[60px]">
                            <div>
                              <label className="block text-xs font-medium text-[#64748B] mb-1">Min entries</label>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={config.min ?? 0}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    sections: {
                                      ...settings.sections,
                                      [sec.key]: { ...config, min: parseInt(e.target.value) || 0 },
                                    },
                                  })
                                }
                                className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#64748B] mb-1">Max entries</label>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={config.max ?? 10}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    sections: {
                                      ...settings.sections,
                                      [sec.key]: { ...config, max: parseInt(e.target.value) || 10 },
                                    },
                                  })
                                }
                                className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Styling view */}
            {cvBuilderView === 'styling' && (
              <>
                {/* Widget Type Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ph ph-layout text-xl text-[#4F46E5]" />
                    <h3 className="text-lg font-bold text-[#1E293B]">Widget Type</h3>
                  </div>
                  <p className="text-[15px] text-[#64748B] mb-6">
                    Choose how applicants will build their CV on your career page.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Step-by-Step Form */}
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, landingPage: { ...settings.landingPage, widgetType: 'form' } })
                      }
                      className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
                        (settings.landingPage.widgetType || 'form') === 'form'
                          ? 'border-[#4F46E5] bg-[#4F46E5]/[0.03] shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          (settings.landingPage.widgetType || 'form') === 'form'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          <i className="ph ph-list-numbers text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1E293B] text-sm">Step-by-Step Form</h4>
                          <p className="text-xs text-[#64748B]">5-step guided wizard</p>
                        </div>
                        {(settings.landingPage.widgetType || 'form') === 'form' && (
                          <i className="ph-fill ph-check-circle text-[#4F46E5] text-xl ml-auto" />
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="flex gap-2 mb-3">
                          {['Personal', 'Experience', 'Education', 'Skills', 'Review'].map((s, i) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full ${i < 2 ? 'bg-[#4F46E5]' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <div className="h-7 bg-white border border-slate-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-7 bg-white border border-slate-200 rounded-lg" />
                          <div className="h-7 bg-white border border-slate-200 rounded-lg" />
                        </div>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                        Structured form with clear steps. Best for straightforward data collection. Applicants fill in sections one at a time.
                      </p>
                    </button>

                    {/* AI Chat Builder */}
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, landingPage: { ...settings.landingPage, widgetType: 'chat' } })
                      }
                      className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
                        settings.landingPage.widgetType === 'chat'
                          ? 'border-[#4F46E5] bg-[#4F46E5]/[0.03] shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          settings.landingPage.widgetType === 'chat'
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          <i className="ph ph-chat-centered-dots text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1E293B] text-sm">AI Chat Builder</h4>
                          <p className="text-xs text-[#64748B]">Conversational + live preview</p>
                        </div>
                        {settings.landingPage.widgetType === 'chat' && (
                          <i className="ph-fill ph-check-circle text-[#4F46E5] text-xl ml-auto" />
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex gap-3 h-[52px]">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-[#4F46E5]/20" />
                              <div className="h-5 w-2/3 bg-white border border-slate-200 rounded-lg" />
                            </div>
                            <div className="flex gap-1.5 justify-end">
                              <div className="h-5 w-1/2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-lg" />
                            </div>
                            <div className="h-5 bg-white border border-slate-200 rounded-lg" />
                          </div>
                          <div className="w-px bg-slate-200" />
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                            <div className="text-[8px] text-slate-300 font-medium">CV PREVIEW</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                        AI-guided conversation with live CV preview. More engaging and interactive. Applicants chat to build their CV.
                      </p>
                    </button>
                  </div>
                </div>

                {/* CV Template Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ph ph-file-text text-xl text-[#4F46E5]" />
                    <h3 className="text-lg font-bold text-[#1E293B]">CV Template</h3>
                  </div>
                  <p className="text-[15px] text-[#64748B] mb-6">
                    Choose the CV design applicants will see in the widget preview.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {WIDGET_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, templateType: tmpl.id })}
                        className={`text-left rounded-2xl border-2 p-4 transition-all duration-300 ${
                          settings.templateType === tmpl.id
                            ? 'border-[#4F46E5] bg-[#4F46E5]/[0.03] shadow-md shadow-indigo-500/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="aspect-[3/4] rounded-xl mb-3 overflow-hidden border border-slate-100"
                             style={{ backgroundColor: '#f8fafc' }}>
                          <TemplateMiniPreview template={tmpl} selected={settings.templateType === tmpl.id} />
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[#1E293B] text-sm">{tmpl.name}</h4>
                          {settings.templateType === tmpl.id && (
                            <i className="ph-fill ph-check-circle text-[#4F46E5] text-lg" />
                          )}
                        </div>
                        <p className="text-xs text-[#94A3B8] mb-2 line-clamp-2">{tmpl.description}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: tmpl.atsScore >= 95 ? '#DCFCE7' : tmpl.atsScore >= 85 ? '#DBEAFE' : '#FEF3C7',
                                  color: tmpl.atsScore >= 95 ? '#16A34A' : tmpl.atsScore >= 85 ? '#2563EB' : '#D97706',
                                }}>
                            ATS {tmpl.atsScore}%
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: tmpl.category === 'ats' ? '#DCFCE7' : '#E0E7FF',
                                  color: tmpl.category === 'ats' ? '#16A34A' : '#4F46E5',
                                }}>
                            {tmpl.category === 'ats' ? 'ATS-Optimized' : 'Styled'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* After Submission */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <i className="ph ph-chat-circle-text text-xl text-[#4F46E5]" />
                    <h3 className="text-lg font-bold text-[#1E293B]">After Submission</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-1">Success Message</label>
                      <p className="text-xs text-[#94A3B8] mb-2">Shown after applicant submits their CV</p>
                      <textarea
                        value={settings.landingPage.successMessage}
                        onChange={(e) =>
                          setSettings({ ...settings, landingPage: { ...settings.landingPage, successMessage: e.target.value } })
                        }
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E293B] mb-1">Redirect URL</label>
                      <p className="text-xs text-[#94A3B8] mb-2">Optional: redirect applicant after submission</p>
                      <input
                        type="url"
                        value={settings.landingPage.redirectUrl || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, landingPage: { ...settings.landingPage, redirectUrl: e.target.value || null } })
                        }
                        placeholder="https://yoursite.com/thank-you"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ph ph-eye text-xl text-[#4F46E5]" />
                    <h3 className="text-lg font-bold text-[#1E293B]">Live Preview</h3>
                  </div>
                  <p className="text-[15px] text-[#64748B] mb-6">
                    Preview of your {settings.landingPage.widgetType === 'chat' ? 'AI Chat Builder' : 'Step-by-Step Form'} widget
                  </p>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-[#FAFBFC]" style={{ maxWidth: '640px' }}>
                    {/* Widget header preview */}
                    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200">
                      <div className="flex items-center gap-2.5">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-7 object-contain" />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: settings.branding.primaryColor }}
                          >
                            {settings.company.name[0]}
                          </div>
                        )}
                        {settings.branding.showCompanyName && (
                          <span className="font-bold text-[#0F172A] text-[14px]" style={{ fontFamily: settings.branding.fontFamily }}>
                            {settings.company.name}
                          </span>
                        )}
                        {settings.landingPage.widgetType === 'chat' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                style={{ color: settings.branding.primaryColor, backgroundColor: `${settings.branding.primaryColor}15` }}>
                            AI CV Builder
                          </span>
                        )}
                      </div>
                      <button
                        className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold"
                        style={{ backgroundColor: settings.branding.primaryColor }}
                      >
                        {settings.landingPage.widgetType === 'chat' ? 'Submit CV' : 'Continue'}
                      </button>
                    </div>

                    {settings.landingPage.widgetType === 'chat' ? (
                      /* Chat mode preview */
                      <div className="flex" style={{ height: '320px' }}>
                        {/* Chat panel */}
                        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
                          <div className="flex-1 p-4 space-y-3 overflow-hidden">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                                   style={{ backgroundColor: `${settings.branding.primaryColor}20` }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.branding.primaryColor }} />
                              </div>
                              <div className="bg-slate-100 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                                <p className="text-xs text-[#1E293B]" style={{ fontFamily: settings.branding.fontFamily }}>
                                  Hi! I&apos;ll help you build your CV. What&apos;s your full name?
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]"
                                   style={{ backgroundColor: `${settings.branding.primaryColor}12` }}>
                                <p className="text-xs text-[#1E293B]">John Smith</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                                   style={{ backgroundColor: `${settings.branding.primaryColor}20` }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.branding.primaryColor }} />
                              </div>
                              <div className="bg-slate-100 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                                <p className="text-xs text-[#1E293B]" style={{ fontFamily: settings.branding.fontFamily }}>
                                  Great! What&apos;s your professional title?
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="px-3 pb-3">
                            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white">
                              <div className="flex-1 text-xs text-[#94A3B8]">Type your answer...</div>
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                   style={{ backgroundColor: settings.branding.primaryColor }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* CV Preview panel */}
                        <div className="flex-1 bg-slate-50 p-3 overflow-hidden">
                          <div className="bg-white rounded-lg border border-slate-200 h-full p-3">
                            <div className="text-center mb-2">
                              <div className="h-2 bg-slate-300 rounded w-1/2 mx-auto mb-1" />
                              <div className="h-1.5 rounded w-1/3 mx-auto" style={{ backgroundColor: settings.branding.primaryColor, opacity: 0.5 }} />
                            </div>
                            <div className="space-y-2">
                              <div className="h-px w-full" style={{ backgroundColor: settings.branding.primaryColor, opacity: 0.2 }} />
                              <div className="space-y-0.5">
                                <div className="h-0.5 bg-slate-200 rounded w-full" />
                                <div className="h-0.5 bg-slate-200 rounded w-5/6" />
                                <div className="h-0.5 bg-slate-200 rounded w-4/5" />
                              </div>
                              <div className="h-px w-full" style={{ backgroundColor: settings.branding.primaryColor, opacity: 0.2 }} />
                              <div className="space-y-0.5">
                                <div className="h-1 bg-slate-300 rounded w-2/5 mb-0.5" />
                                <div className="h-0.5 bg-slate-200 rounded w-full" />
                                <div className="h-0.5 bg-slate-200 rounded w-3/4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Form mode preview */
                      <div className="p-5 bg-white" style={{ minHeight: '280px' }}>
                        <div className="flex gap-1.5 mb-5">
                          {['Personal', 'Experience', 'Education', 'Skills', 'Review'].map((step, i) => (
                            <div key={step} className="flex-1">
                              <div
                                className="h-1.5 rounded-full mb-1"
                                style={{ backgroundColor: i < 2 ? settings.branding.primaryColor : '#E2E8F0' }}
                              />
                              <p className="text-[9px] font-medium text-center" style={{ color: i < 2 ? settings.branding.primaryColor : '#94A3B8' }}>
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                        <h4 className="text-sm font-bold text-[#1E293B] mb-3" style={{ fontFamily: settings.branding.fontFamily }}>
                          Personal Information
                        </h4>
                        <div className="space-y-2.5 mb-4">
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B] mb-1">Full Name</div>
                            <div className="h-9 bg-white border border-slate-200 rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <div className="text-[10px] font-medium text-[#64748B] mb-1">Email</div>
                              <div className="h-9 bg-white border border-slate-200 rounded-lg" />
                            </div>
                            <div>
                              <div className="text-[10px] font-medium text-[#64748B] mb-1">Phone</div>
                              <div className="h-9 bg-white border border-slate-200 rounded-lg" />
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-medium text-[#64748B] mb-1">Professional Summary</div>
                            <div className="h-16 bg-white border border-slate-200 rounded-lg" />
                          </div>
                        </div>
                        <button
                          className="px-5 py-2 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: settings.branding.primaryColor }}
                        >
                          Next Step
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Job Listings Tab */}
        {activeTab === 'job-listings' && (
          <JobListingsTab settings={settings} setSettings={setSettings} />
        )}

        {/* Email Templates Tab */}
        {activeTab === 'email-templates' && (
          <EmailTemplatesTab />
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <TeamTab />
        )}

      </div>
    </DashboardLayout>
  );
}

function TemplateMiniPreview({ template, selected }: { template: WidgetTemplateConfig; selected: boolean }) {
  if (template.layoutType === 'sidebar') {
    return (
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <div className="w-[32%] h-full flex flex-col gap-1.5 p-2.5" style={{ backgroundColor: template.sidebarBg }}>
          {/* Name */}
          <div className="h-2.5 rounded-sm w-3/4" style={{ backgroundColor: template.sidebarText, opacity: 0.8 }} />
          <div className="h-1.5 rounded-sm w-1/2" style={{ backgroundColor: template.sidebarText, opacity: 0.35 }} />
          {/* Contact section */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="h-1 rounded-sm w-2/3" style={{ backgroundColor: template.sidebarText, opacity: 0.5 }} />
            <div className="h-0.5 rounded-full w-full" style={{ backgroundColor: template.sidebarText, opacity: 0.2 }} />
            <div className="h-0.5 rounded-full w-4/5" style={{ backgroundColor: template.sidebarText, opacity: 0.2 }} />
            <div className="h-0.5 rounded-full w-3/4" style={{ backgroundColor: template.sidebarText, opacity: 0.2 }} />
          </div>
          {/* Skills section */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="h-1 rounded-sm w-1/2" style={{ backgroundColor: template.sidebarText, opacity: 0.5 }} />
            <div className="flex flex-wrap gap-0.5">
              <div className="h-2 w-2/5 rounded-sm" style={{ backgroundColor: template.sidebarText, opacity: 0.12 }} />
              <div className="h-2 w-1/3 rounded-sm" style={{ backgroundColor: template.sidebarText, opacity: 0.12 }} />
              <div className="h-2 w-1/4 rounded-sm" style={{ backgroundColor: template.sidebarText, opacity: 0.12 }} />
              <div className="h-2 w-2/5 rounded-sm" style={{ backgroundColor: template.sidebarText, opacity: 0.12 }} />
            </div>
          </div>
          {/* Languages section */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="h-1 rounded-sm w-2/3" style={{ backgroundColor: template.sidebarText, opacity: 0.5 }} />
            <div className="h-0.5 rounded-full w-full" style={{ backgroundColor: template.sidebarText, opacity: 0.15 }} />
            <div className="h-0.5 rounded-full w-3/4" style={{ backgroundColor: template.sidebarText, opacity: 0.15 }} />
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-1.5 p-2.5">
          {/* Summary section */}
          <div className="h-1.5 rounded-full w-1/3" style={{ backgroundColor: template.primaryColor, opacity: 0.7 }} />
          <div className="flex flex-col gap-0.5">
            <div className="h-0.5 rounded-full w-full bg-slate-200" />
            <div className="h-0.5 rounded-full w-5/6 bg-slate-200" />
            <div className="h-0.5 rounded-full w-4/5 bg-slate-200" />
          </div>
          {/* Experience section */}
          <div className="mt-1.5 h-1.5 rounded-full w-1/3" style={{ backgroundColor: template.primaryColor, opacity: 0.7 }} />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 rounded-sm w-2/3 bg-slate-300" />
            <div className="h-0.5 rounded-full w-1/2 bg-slate-200" />
            <div className="h-0.5 rounded-full w-full bg-slate-200" />
            <div className="h-0.5 rounded-full w-5/6 bg-slate-200" />
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="h-1 rounded-sm w-1/2 bg-slate-300" />
            <div className="h-0.5 rounded-full w-2/5 bg-slate-200" />
            <div className="h-0.5 rounded-full w-full bg-slate-200" />
            <div className="h-0.5 rounded-full w-4/5 bg-slate-200" />
          </div>
          {/* Education section */}
          <div className="mt-1.5 h-1.5 rounded-full w-1/3" style={{ backgroundColor: template.primaryColor, opacity: 0.7 }} />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 rounded-sm w-3/5 bg-slate-300" />
            <div className="h-0.5 rounded-full w-2/3 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }
  // Single-column layout
  return (
    <div className="w-full h-full flex flex-col items-center gap-1 p-3">
      {/* Header */}
      <div className="h-2.5 rounded-sm w-1/2" style={{ backgroundColor: template.textColor, opacity: 0.7 }} />
      <div className="h-1.5 rounded-sm w-1/3" style={{ backgroundColor: template.primaryColor, opacity: 0.5 }} />
      <div className="flex gap-2 mt-0.5">
        <div className="h-0.5 w-5 rounded-full bg-slate-300" />
        <div className="h-0.5 w-5 rounded-full bg-slate-300" />
        <div className="h-0.5 w-5 rounded-full bg-slate-300" />
      </div>
      {/* Summary */}
      <div className="w-full mt-1.5 h-px" style={{ backgroundColor: template.primaryColor, opacity: 0.3 }} />
      <div className="w-full flex flex-col gap-0.5">
        <div className="h-0.5 rounded-full w-full bg-slate-200" />
        <div className="h-0.5 rounded-full w-5/6 bg-slate-200" />
        <div className="h-0.5 rounded-full w-4/5 bg-slate-200" />
      </div>
      {/* Experience */}
      <div className="w-full mt-1.5 h-px" style={{ backgroundColor: template.primaryColor, opacity: 0.3 }} />
      <div className="w-full flex flex-col gap-0.5">
        <div className="h-1 rounded-sm w-1/2 bg-slate-300" />
        <div className="h-0.5 rounded-full w-1/3 bg-slate-200" />
        <div className="h-0.5 rounded-full w-full bg-slate-200" />
        <div className="h-0.5 rounded-full w-5/6 bg-slate-200" />
      </div>
      <div className="w-full flex flex-col gap-0.5 mt-1">
        <div className="h-1 rounded-sm w-2/5 bg-slate-300" />
        <div className="h-0.5 rounded-full w-1/3 bg-slate-200" />
        <div className="h-0.5 rounded-full w-full bg-slate-200" />
        <div className="h-0.5 rounded-full w-4/5 bg-slate-200" />
      </div>
      {/* Education */}
      <div className="w-full mt-1.5 h-px" style={{ backgroundColor: template.primaryColor, opacity: 0.3 }} />
      <div className="w-full flex flex-col gap-0.5">
        <div className="h-1 rounded-sm w-2/5 bg-slate-300" />
        <div className="h-0.5 rounded-full w-2/3 bg-slate-200" />
      </div>
      {/* Skills */}
      <div className="w-full mt-1.5 h-px" style={{ backgroundColor: template.primaryColor, opacity: 0.3 }} />
      <div className="w-full flex flex-wrap gap-0.5">
        <div className="h-1.5 w-1/4 rounded-sm bg-slate-200" />
        <div className="h-1.5 w-1/3 rounded-sm bg-slate-200" />
        <div className="h-1.5 w-1/5 rounded-sm bg-slate-200" />
        <div className="h-1.5 w-1/4 rounded-sm bg-slate-200" />
      </div>
    </div>
  );
}

function JobListingMiniPreview({ template, selected }: { template: JobListingTemplateConfig; selected: boolean }) {
  const isCards = template.layout === 'cards';
  const isTable = template.layout === 'table';
  const r = template.borderRadius === '0px' ? '0px' : template.borderRadius === '20px' ? '6px' : template.borderRadius === '16px' ? '5px' : '3px';

  if (isTable) {
    return (
      <div className="w-full h-full flex flex-col p-2.5 gap-1" style={{ backgroundColor: template.bgColor }}>
        {/* Table header */}
        <div className="flex gap-1 px-1.5 py-1" style={{ backgroundColor: template.accentColor, borderRadius: r }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-sm" style={{ backgroundColor: template.textColor, opacity: 0.8 }} />
          ))}
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-1 px-1.5 py-1" style={{ backgroundColor: template.surfaceColor, border: `1px solid ${template.borderColor}`, borderRadius: r }}>
            <div className="flex-1 h-1 rounded-sm" style={{ backgroundColor: template.textColor, opacity: 0.5 }} />
            <div className="w-1/4 h-1 rounded-sm" style={{ backgroundColor: template.textSecondary, opacity: 0.4 }} />
            <div className="w-1/5 h-1 rounded-sm" style={{ backgroundColor: template.textMuted, opacity: 0.4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (isCards) {
    return (
      <div className="w-full h-full p-2.5" style={{ backgroundColor: template.bgColor }}>
        <div className="grid grid-cols-2 gap-1.5 h-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1 p-2" style={{
              backgroundColor: template.surfaceColor,
              border: template.cardStyle === 'bordered' ? `1px solid ${template.borderColor}` : 'none',
              borderLeft: template.cardStyle === 'accent-left' ? `3px solid ${template.accentColor}` : undefined,
              borderRadius: r,
              boxShadow: template.cardStyle === 'shadow' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
              <div className="h-1.5 rounded-sm w-4/5" style={{ backgroundColor: template.textColor, opacity: 0.7 }} />
              <div className="h-1 rounded-sm w-3/5" style={{ backgroundColor: template.textSecondary, opacity: 0.4 }} />
              <div className="flex gap-0.5 mt-auto">
                <div className="h-2 w-6 rounded-full" style={{ backgroundColor: template.badgeBg }} />
                <div className="h-2 w-5 rounded-full" style={{ backgroundColor: template.badgeBg }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List / compact layout
  return (
    <div className="w-full h-full flex flex-col gap-1.5 p-2.5" style={{ backgroundColor: template.bgColor }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2 p-2" style={{
          backgroundColor: template.surfaceColor,
          border: template.cardStyle === 'bordered' ? `1px solid ${template.borderColor}` : 'none',
          borderLeft: template.cardStyle === 'accent-left' ? `3px solid ${template.accentColor}` : undefined,
          borderBottom: template.cardStyle === 'flat' ? `1px solid ${template.borderColor}` : undefined,
          borderRadius: template.cardStyle === 'flat' ? '0px' : r,
        }}>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1.5 rounded-sm w-3/4" style={{ backgroundColor: template.textColor, opacity: 0.7 }} />
            <div className="flex gap-0.5">
              <div className="h-1.5 w-5 rounded-full" style={{ backgroundColor: template.badgeBg }} />
              <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: template.badgeBg }} />
            </div>
          </div>
          <div className="h-3 w-8 rounded-full" style={{ backgroundColor: template.accentColor, opacity: 0.2 }} />
        </div>
      ))}
    </div>
  );
}

function JobListingsTab({ settings, setSettings }: { settings: Settings; setSettings: (s: Settings) => void }) {
  const config = settings.jobListingConfig;
  const selectedTemplate = JOB_LISTING_TEMPLATES.find(t => t.id === config.templateId) || JOB_LISTING_TEMPLATES[0];

  const [aiUrl, setAiUrl] = useState('');
  const [aiLayout, setAiLayout] = useState<'cards' | 'list'>('cards');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingStep, setAiLoadingStep] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState<{
    name: string;
    css: string;
    fontUrl: string | null;
    layout: string;
    designTokens: Record<string, string>;
  } | null>(null);

  // Initialize from saved config
  useEffect(() => {
    if (config.customSourceUrl) {
      setAiUrl(config.customSourceUrl);
    }
    if (config.customLayout) {
      setAiLayout(config.customLayout === 'list' ? 'list' : 'cards');
    }
  }, [config.customSourceUrl, config.customLayout]);

  const updateConfig = (partial: Partial<Settings['jobListingConfig']>) => {
    setSettings({
      ...settings,
      jobListingConfig: { ...config, ...partial },
    });
  };

  const generateTemplate = async () => {
    if (!aiUrl) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);
    setAiLoadingStep('Analyzing website...');

    try {
      const res = await fetch('/api/ai/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: aiUrl, layout: aiLayout }),
      });

      setAiLoadingStep('Generating template...');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate template');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      setAiError(err.message || 'Something went wrong');
    } finally {
      setAiLoading(false);
      setAiLoadingStep('');
    }
  };

  const applyCustomTemplate = () => {
    if (!aiResult) return;
    updateConfig({
      templateId: 'custom',
      customTemplateCSS: aiResult.css,
      customTemplateName: aiResult.name,
      customFontUrl: aiResult.fontUrl,
      customLayout: aiLayout,
      customSourceUrl: aiUrl,
      customDesignTokens: aiResult.designTokens,
    });
  };

  const deleteCustomTemplate = () => {
    updateConfig({
      templateId: JOB_LISTING_TEMPLATES[0]?.id || 'simple',
      customTemplateCSS: null,
      customTemplateName: null,
      customFontUrl: null,
      customLayout: null,
      customSourceUrl: null,
      customDesignTokens: null,
    });
    setAiResult(null);
    setAiUrl('');
  };

  // Extract color swatches from design tokens
  const getSwatches = (tokens: Record<string, string>) => {
    const colorKeys = ['bgColor', 'surfaceColor', 'textColor', 'accentColor', 'borderColor', 'badgeBg'];
    return colorKeys
      .filter(k => tokens[k] && tokens[k].startsWith('#'))
      .map(k => ({ key: k, color: tokens[k] }));
  };

  return (
    <div className="space-y-6">
      {/* AI Template Generator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph ph-magic-wand text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">AI Template Generator</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#E0E7FF] text-[#4F46E5]">NEW</span>
        </div>
        <p className="text-[15px] text-[#64748B] mb-6">
          Enter your website URL and our AI will analyze your site's design to generate a matching job listing template.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Website URL</label>
              <input
                type="url"
                value={aiUrl}
                onChange={(e) => setAiUrl(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                disabled={aiLoading}
              />
            </div>
            <div className="w-36">
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Layout</label>
              <select
                value={aiLayout}
                onChange={(e) => setAiLayout(e.target.value as 'cards' | 'list')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                disabled={aiLoading}
              >
                <option value="cards">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateTemplate}
              disabled={aiLoading || !aiUrl}
              className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {aiLoadingStep}
                </>
              ) : aiResult ? (
                <>
                  <i className="ph ph-arrow-clockwise" />
                  Regenerate
                </>
              ) : (
                <>
                  <i className="ph ph-magic-wand" />
                  Retrieve Styling
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-3 bg-[#FEE2E2] text-[#DC2626] rounded-xl text-sm flex items-center gap-2">
              <i className="ph ph-warning" />
              {aiError}
            </div>
          )}

          {aiResult && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-[#FAFBFC]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">{aiResult.name}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Layout: {aiLayout === 'list' ? 'List' : 'Grid'}
                    {aiResult.fontUrl && ` \u2022 Custom font included`}
                  </p>
                </div>
                <button
                  onClick={applyCustomTemplate}
                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <i className="ph ph-check" />
                  Use This Template
                </button>
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-[#64748B]">Colors:</span>
                <div className="flex gap-1.5">
                  {getSwatches(aiResult.designTokens).map(({ key, color }) => (
                    <div
                      key={key}
                      className="w-7 h-7 rounded-lg border border-slate-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Font info */}
              {aiResult.designTokens.googleFontsName && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#64748B]">Font:</span>
                  <span className="text-xs text-[#1E293B] font-medium">{aiResult.designTokens.googleFontsName}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph ph-layout text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Job Listing Template</h3>
        </div>
        <p className="text-[15px] text-[#64748B] mb-6">
          Choose a visual style for your job listing widget. Each template has a unique look and layout.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Custom template card — show when user has one saved */}
          {config.customTemplateCSS && (
            <div className="relative">
              <button
                type="button"
                onClick={() => updateConfig({ templateId: 'custom' })}
                className={`w-full text-left rounded-2xl border-2 p-3 transition-all duration-300 ${
                  config.templateId === 'custom'
                    ? 'border-[#4F46E5] bg-[#4F46E5]/[0.03] shadow-md shadow-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Custom mini preview with color swatches */}
                <div className="aspect-[4/3] rounded-xl mb-2.5 overflow-hidden border border-slate-100 bg-gradient-to-br from-[#4F46E5]/5 to-[#4F46E5]/15 flex items-center justify-center">
                  <div className="text-center">
                    <i className="ph ph-magic-wand text-2xl text-[#4F46E5] mb-1 block" />
                    <span className="text-[10px] font-semibold text-[#4F46E5]">AI Generated</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-[#1E293B] text-sm truncate">{config.customTemplateName || 'Custom'}</h4>
                  {config.templateId === 'custom' && (
                    <i className="ph-fill ph-check-circle text-[#4F46E5] text-lg" />
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mb-2 line-clamp-2">AI-generated from {config.customSourceUrl ? new URL(config.customSourceUrl).hostname : 'your website'}</p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E0E7FF] text-[#4F46E5]">
                    Custom
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                    {config.customLayout === 'list' ? 'List' : 'Grid'}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); deleteCustomTemplate(); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#94A3B8] hover:text-[#DC2626] hover:border-[#DC2626] transition-all shadow-sm"
                title="Delete custom template"
              >
                <i className="ph ph-trash text-sm" />
              </button>
            </div>
          )}

          {JOB_LISTING_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => updateConfig({ templateId: tmpl.id })}
              className={`text-left rounded-2xl border-2 p-3 transition-all duration-300 ${
                config.templateId === tmpl.id
                  ? 'border-[#4F46E5] bg-[#4F46E5]/[0.03] shadow-md shadow-indigo-500/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {/* Mini layout preview */}
              <div className="aspect-[4/3] rounded-xl mb-2.5 overflow-hidden border border-slate-100">
                <JobListingMiniPreview template={tmpl} selected={config.templateId === tmpl.id} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-[#1E293B] text-sm">{tmpl.name}</h4>
                {config.templateId === tmpl.id && (
                  <i className="ph-fill ph-check-circle text-[#4F46E5] text-lg" />
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mb-2 line-clamp-2">{tmpl.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: tmpl.category === 'minimal' ? '#DCFCE7' : tmpl.category === 'editorial' ? '#DBEAFE' : '#FEF3C7',
                        color: tmpl.category === 'minimal' ? '#16A34A' : tmpl.category === 'editorial' ? '#2563EB' : '#D97706',
                      }}>
                  {tmpl.category === 'minimal' ? 'Minimal' : tmpl.category === 'editorial' ? 'Editorial' : 'Bold'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                  {tmpl.layout === 'cards' ? 'Grid' : tmpl.layout === 'table' ? 'Table' : tmpl.layout === 'compact' ? 'Compact' : 'List'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features toggles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph ph-toggle-right text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Widget Features</h3>
        </div>
        <p className="text-[15px] text-[#64748B] mb-8">
          Toggle which features are visible in the job listing widget.
        </p>

        <div className="space-y-4">
          <div className="border rounded-2xl p-5 border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => updateConfig({ showSearch: !config.showSearch })}
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 relative ${
                    config.showSearch ? 'bg-[#4F46E5]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    config.showSearch ? 'translate-x-5' : ''
                  }`} />
                </div>
                <div>
                  <span className="font-semibold text-sm text-[#1E293B]">Search Bar</span>
                  <p className="text-xs mt-0.5 text-[#64748B]">
                    Allow candidates to search jobs by title, description, or keywords
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-5 border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => updateConfig({ showFilters: !config.showFilters })}
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 relative ${
                    config.showFilters ? 'bg-[#4F46E5]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    config.showFilters ? 'translate-x-5' : ''
                  }`} />
                </div>
                <div>
                  <span className="font-semibold text-sm text-[#1E293B]">Filter Dropdowns</span>
                  <p className="text-xs mt-0.5 text-[#64748B]">
                    Department, location, and job type filter dropdowns. Auto-hidden when 3 or fewer jobs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[#E0E7FF] rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <i className="ph ph-lightbulb text-[#4F46E5] text-xl mt-0.5" />
          <div>
            <h4 className="font-bold text-[#1E293B] text-sm">How the job listing widget works</h4>
            <p className="text-sm text-[#64748B] mt-1">
              The widget displays all your active jobs from the Jobs page. Each template controls the look and feel — colors, fonts, layout, and card style. When candidates click &quot;Apply&quot;, it loads the CV builder inline so they can browse and apply without leaving your site. Go to <strong>Embed Code</strong> to get the snippet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1E293B] mb-1">{label}</label>
      <p className="text-xs text-[#94A3B8] mb-2">{desc}</p>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
        />
      </div>
    </div>
  );
}
