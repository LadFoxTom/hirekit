'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import Head from 'next/head';
import { FaShieldAlt, FaLock, FaEye, FaTrash, FaDownload, FaGlobe, FaRobot, FaDatabase, FaUserCheck } from 'react-icons/fa';

export default function DataCompliancePage() {
  const { t, language } = useLocale();
  const [activeLanguage, setActiveLanguage] = useState(language);
  const [activeSection, setActiveSection] = useState('privacy');

  // Hardcoded translations for data compliance
  const translations = {
    en: {
      meta: {
        title: 'Data Compliance & Privacy',
        description: 'Learn about LadderFox\'s data protection practices, GDPR compliance, AI processing, and your privacy rights.',
        keywords: 'data compliance, privacy policy, GDPR, AI processing, data protection, privacy rights'
      },
      title: 'Data Compliance & Privacy',
      subtitle: 'Transparent information about how we handle your data, AI processing, and your privacy rights',
      sections: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        ai: 'AI Processing',
        cookies: 'Cookie Policy',
        rights: 'Your Rights'
      },
      privacy: {
        important_note: 'Important Privacy Notice',
        important_description: 'We are committed to protecting your privacy and ensuring compliance with international data protection regulations including GDPR, CCPA, and LGPD.',
        data_collection: {
          title: 'Data We Collect',
          personal: 'Personal Information',
          name: 'Name and contact details',
          email: 'Email address',
          contact: 'Phone number and address',
          professional: 'Professional information and CV content',
          technical: 'Technical Data',
          ip: 'IP address and device information',
          browser: 'Browser type and settings',
          usage: 'Usage patterns and preferences',
          session: 'Session data and cookies'
        },
        purposes: {
          title: 'How We Use Your Data',
          service: 'Service Provision',
          service_desc: 'To provide CV building and optimization services',
          ai: 'AI Processing',
          ai_desc: 'To improve your documents using artificial intelligence',
          analytics: 'Analytics',
          analytics_desc: 'To improve our services and user experience'
        },
        retention: {
          title: 'Data Retention Periods',
          documents: 'CV Documents',
          account: 'Account Data',
          billing: 'Billing Records',
          logs: 'System Logs',
          days: 'days',
          years: 'years',
          months: 'months',
          active: 'While account is active'
        }
      },
      terms: {
        disclaimer: {
          title: 'Important Legal Disclaimer',
          description: 'LadderFox provides AI-assisted CV building tools. We are not responsible for the content, accuracy, or outcomes of your job applications.'
        },
        service: {
          title: 'Service Description',
          what: 'What We Provide',
          description: 'AI-powered CV and cover letter building tools with templates and optimization features.',
          limitations: 'Service Limitations',
          no_guarantee: 'No guarantee of job placement or interview success',
          no_liability: 'No liability for application outcomes',
          user_responsibility: 'User responsible for content accuracy',
          service_changes: 'Service may change without notice'
        },
        liability: {
          title: 'Liability Limitations',
          limitation: 'Limited Liability',
          description: 'Our liability is strictly limited as outlined below. We are not responsible for any indirect, consequential, or punitive damages.',
          max_amount: 'Maximum Liability',
          exclusions: 'Exclusions',
          exclusions_desc: 'Intentional misconduct, gross negligence, or violations of applicable law'
        }
      },
      ai: {
        important: {
          title: 'AI Processing Notice',
          description: 'We use artificial intelligence to optimize your CV and cover letters. This involves processing your content through third-party AI services.'
        },
        processing: {
          title: 'AI Processing Details',
          what: 'What AI Does',
          content_analysis: 'Analyzes your content for improvements',
          suggestions: 'Provides writing suggestions and alternatives',
          optimization: 'Optimizes text for better impact',
          grammar_check: 'Checks grammar and spelling',
          providers: 'AI Service Providers',
          third_party: 'Third-party AI services (OpenAI, etc.)',
          encrypted: 'Data encrypted during transmission',
          temporary: 'Temporary processing only'
        },
        disclaimer: {
          title: 'AI Disclaimer',
          warning: 'Important AI Limitations',
          no_guarantee: 'AI suggestions are not guaranteed to be accurate or appropriate',
          user_review: 'Always review and edit AI-generated content',
          no_liability: 'We are not liable for AI-generated content',
          professional_advice: 'AI is not a substitute for professional career advice'
        }
      },
      cookies: {
        types: {
          title: 'Types of Cookies We Use',
          essential: 'Essential Cookies',
          essential_desc: 'Required for basic website functionality and security',
          essential_required: 'Cannot be disabled',
          analytics: 'Analytics Cookies',
          analytics_desc: 'Help us understand how visitors use our website',
          analytics_optional: 'Can be disabled',
          marketing: 'Marketing Cookies',
          marketing_desc: 'Used for personalized advertising and content',
          marketing_optional: 'Can be disabled'
        },
        management: {
          title: 'Managing Cookies',
          how: 'How to Manage Your Cookies',
          browser_settings: 'Adjust browser settings to block cookies',
          cookie_banner: 'Use our cookie consent banner',
          contact: 'Contact us to opt out of specific cookies',
          third_party: 'Manage third-party cookies through their settings'
        }
      },
      rights: {
        your_rights: {
          title: 'Your Privacy Rights'
        },
        access: {
          title: 'Right to Access',
          description: 'Request a copy of all personal data we hold about you'
        },
        correction: {
          title: 'Right to Correction',
          description: 'Request correction of inaccurate or incomplete data'
        },
        deletion: {
          title: 'Right to Deletion',
          description: 'Request deletion of your personal data (with exceptions)'
        },
        portability: {
          title: 'Right to Portability',
          description: 'Request your data in a portable, machine-readable format'
        },
        exercise: {
          title: 'Exercising Your Rights',
          how: 'How to Exercise Your Rights',
          email: 'Contact us via email',
          response_time: 'Response time',
          verification: 'Identity verification required',
          days: 'days'
        },
        complaints: {
          title: 'Filing Complaints',
          authorities: 'Data Protection Authorities',
          netherlands: 'Netherlands',
          eu: 'European Union'
        }
      },
      footer: {
        last_updated: 'Last Updated',
        last_updated_date: 'December 9, 2024',
        contact: 'Contact',
        version: 'Version',
        compliant: 'Compliant with'
      }
    }
  };

  const currentTranslations = translations[language as keyof typeof translations] || translations.en;

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const sections = [
    { id: 'privacy', name: currentTranslations.sections.privacy, icon: FaShieldAlt },
    { id: 'terms', name: currentTranslations.sections.terms, icon: FaLock },
    { id: 'ai', name: currentTranslations.sections.ai, icon: FaRobot },
    { id: 'cookies', name: currentTranslations.sections.cookies, icon: FaDatabase },
    { id: 'rights', name: currentTranslations.sections.rights, icon: FaUserCheck },
  ];

  const renderPrivacyPolicy = () => (
    <div className="space-y-6">
             <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
         <div className="flex">
           <FaShieldAlt className="text-blue-400 text-xl mr-3 mt-1" />
           <div>
             <h3 className="text-blue-800 font-semibold">{currentTranslations.privacy.important_note}</h3>
             <p className="text-blue-700 mt-1">{currentTranslations.privacy.important_description}</p>
           </div>
         </div>
       </div>

       <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.privacy.data_collection.title}</h3>
        <div className="grid md:grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.privacy.data_collection.personal}</h4>
             <ul className="text-sm space-y-1">
               <li>• {currentTranslations.privacy.data_collection.name}</li>
               <li>• {currentTranslations.privacy.data_collection.email}</li>
               <li>• {currentTranslations.privacy.data_collection.contact}</li>
               <li>• {currentTranslations.privacy.data_collection.professional}</li>
             </ul>
           </div>
           <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.privacy.data_collection.technical}</h4>
             <ul className="text-sm space-y-1">
               <li>• {currentTranslations.privacy.data_collection.ip}</li>
               <li>• {currentTranslations.privacy.data_collection.browser}</li>
               <li>• {currentTranslations.privacy.data_collection.usage}</li>
               <li>• {currentTranslations.privacy.data_collection.session}</li>
             </ul>
           </div>
        </div>
      </section>

             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.privacy.purposes.title}</h3>
         <div className="space-y-3">
           <div className="flex items-start">
             <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
               <FaEye className="text-green-600 text-sm" />
             </div>
             <div>
               <h4 className="font-medium">{currentTranslations.privacy.purposes.service}</h4>
               <p className="text-sm text-gray-600">{currentTranslations.privacy.purposes.service_desc}</p>
             </div>
           </div>
           <div className="flex items-start">
             <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
               <FaRobot className="text-blue-600 text-sm" />
             </div>
             <div>
               <h4 className="font-medium">{currentTranslations.privacy.purposes.ai}</h4>
               <p className="text-sm text-gray-600">{currentTranslations.privacy.purposes.ai_desc}</p>
             </div>
           </div>
           <div className="flex items-start">
             <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
               <FaDatabase className="text-purple-600 text-sm" />
             </div>
             <div>
               <h4 className="font-medium">{currentTranslations.privacy.purposes.analytics}</h4>
               <p className="text-sm text-gray-600">{currentTranslations.privacy.purposes.analytics_desc}</p>
             </div>
           </div>
         </div>
       </section>

       <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.privacy.retention.title}</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                     <div className="grid md:grid-cols-2 gap-4 text-sm">
             <div>
               <h4 className="font-medium text-yellow-800 mb-2">{currentTranslations.privacy.retention.documents}</h4>
               <p className="text-yellow-700">30 {currentTranslations.privacy.retention.days}</p>
             </div>
             <div>
               <h4 className="font-medium text-yellow-800 mb-2">{currentTranslations.privacy.retention.account}</h4>
               <p className="text-yellow-700">{currentTranslations.privacy.retention.active}</p>
             </div>
             <div>
               <h4 className="font-medium text-yellow-800 mb-2">{currentTranslations.privacy.retention.billing}</h4>
               <p className="text-yellow-700">7 {currentTranslations.privacy.retention.years}</p>
             </div>
             <div>
               <h4 className="font-medium text-yellow-800 mb-2">{currentTranslations.privacy.retention.logs}</h4>
               <p className="text-yellow-700">6 {currentTranslations.privacy.retention.months}</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-6">
             <div className="bg-red-50 border-l-4 border-red-400 p-4">
         <div className="flex">
           <FaLock className="text-red-400 text-xl mr-3 mt-1" />
           <div>
             <h3 className="text-red-800 font-semibold">{currentTranslations.terms.disclaimer.title}</h3>
             <p className="text-red-700 mt-1">{currentTranslations.terms.disclaimer.description}</p>
           </div>
         </div>
       </div>

       <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.terms.service.title}</h3>
        <div className="space-y-4">
                     <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.terms.service.what}</h4>
             <p className="text-sm text-gray-600">{currentTranslations.terms.service.description}</p>
           </div>
           <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.terms.service.limitations}</h4>
             <ul className="text-sm text-gray-600 space-y-1">
               <li>• {currentTranslations.terms.service.no_guarantee}</li>
               <li>• {currentTranslations.terms.service.no_liability}</li>
               <li>• {currentTranslations.terms.service.user_responsibility}</li>
               <li>• {currentTranslations.terms.service.service_changes}</li>
             </ul>
           </div>
        </div>
      </section>

             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.terms.liability.title}</h3>
         <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
           <h4 className="font-medium text-orange-800 mb-2">{currentTranslations.terms.liability.limitation}</h4>
           <p className="text-sm text-orange-700 mb-3">{currentTranslations.terms.liability.description}</p>
           <div className="text-xs text-orange-600">
             <p><strong>{currentTranslations.terms.liability.exclusions}:</strong> {currentTranslations.terms.liability.exclusions_desc}</p>
           </div>
         </div>
       </section>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
             <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
         <div className="flex">
           <FaRobot className="text-purple-400 text-xl mr-3 mt-1" />
           <div>
             <h3 className="text-purple-800 font-semibold">{currentTranslations.ai.important.title}</h3>
             <p className="text-purple-700 mt-1">{currentTranslations.ai.important.description}</p>
           </div>
         </div>
       </div>

       <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.ai.processing.title}</h3>
        <div className="grid md:grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.ai.processing.what}</h4>
             <ul className="text-sm space-y-1">
               <li>• {currentTranslations.ai.processing.content_analysis}</li>
               <li>• {currentTranslations.ai.processing.suggestions}</li>
               <li>• {currentTranslations.ai.processing.optimization}</li>
               <li>• {currentTranslations.ai.processing.grammar_check}</li>
             </ul>
           </div>
           <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="font-medium mb-2">{currentTranslations.ai.processing.providers}</h4>
             <ul className="text-sm space-y-1">
               <li>• OpenAI (GPT models)</li>
               <li>• {currentTranslations.ai.processing.third_party}</li>
               <li>• {currentTranslations.ai.processing.encrypted}</li>
               <li>• {currentTranslations.ai.processing.temporary}</li>
             </ul>
           </div>
        </div>
      </section>

             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.ai.disclaimer.title}</h3>
         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
           <h4 className="font-medium text-red-800 mb-2">{currentTranslations.ai.disclaimer.warning}</h4>
           <ul className="text-sm text-red-700 space-y-2">
             <li>• {currentTranslations.ai.disclaimer.no_guarantee}</li>
             <li>• {currentTranslations.ai.disclaimer.user_review}</li>
             <li>• {currentTranslations.ai.disclaimer.no_liability}</li>
             <li>• {currentTranslations.ai.disclaimer.professional_advice}</li>
           </ul>
         </div>
       </section>
    </div>
  );

  const renderCookies = () => (
    <div className="space-y-6">
             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.cookies.types.title}</h3>
         <div className="space-y-4">
           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
             <h4 className="font-medium text-green-800 mb-2">{currentTranslations.cookies.types.essential}</h4>
             <p className="text-sm text-green-700 mb-2">{currentTranslations.cookies.types.essential_desc}</p>
             <p className="text-xs text-green-600">{currentTranslations.cookies.types.essential_required}</p>
           </div>
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
             <h4 className="font-medium text-blue-800 mb-2">{currentTranslations.cookies.types.analytics}</h4>
             <p className="text-sm text-blue-700 mb-2">{currentTranslations.cookies.types.analytics_desc}</p>
             <p className="text-xs text-blue-600">{currentTranslations.cookies.types.analytics_optional}</p>
           </div>
           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
             <h4 className="font-medium text-purple-800 mb-2">{currentTranslations.cookies.types.marketing}</h4>
             <p className="text-sm text-purple-700 mb-2">{currentTranslations.cookies.types.marketing_desc}</p>
             <p className="text-xs text-purple-600">{currentTranslations.cookies.types.marketing_optional}</p>
           </div>
         </div>
       </section>

       <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.cookies.management.title}</h3>
                 <div className="bg-gray-50 p-4 rounded-lg">
           <h4 className="font-medium mb-2">{currentTranslations.cookies.management.how}</h4>
           <ul className="text-sm space-y-2">
             <li>• {currentTranslations.cookies.management.browser_settings}</li>
             <li>• {currentTranslations.cookies.management.cookie_banner}</li>
             <li>• {currentTranslations.cookies.management.contact}</li>
             <li>• {currentTranslations.cookies.management.third_party}</li>
           </ul>
         </div>
      </section>
    </div>
  );

  const renderRights = () => (
    <div className="space-y-6">
             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.rights.your_rights.title}</h3>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="bg-blue-50 p-4 rounded-lg">
             <div className="flex items-center mb-2">
               <FaEye className="text-blue-600 mr-2" />
               <h4 className="font-medium">{currentTranslations.rights.access.title}</h4>
             </div>
             <p className="text-sm text-gray-600">{currentTranslations.rights.access.description}</p>
           </div>
           <div className="bg-green-50 p-4 rounded-lg">
             <div className="flex items-center mb-2">
               <FaUserCheck className="text-green-600 mr-2" />
               <h4 className="font-medium">{currentTranslations.rights.correction.title}</h4>
             </div>
             <p className="text-sm text-gray-600">{currentTranslations.rights.correction.description}</p>
           </div>
           <div className="bg-red-50 p-4 rounded-lg">
             <div className="flex items-center mb-2">
               <FaTrash className="text-red-600 mr-2" />
               <h4 className="font-medium">{currentTranslations.rights.deletion.title}</h4>
             </div>
             <p className="text-sm text-gray-600">{currentTranslations.rights.deletion.description}</p>
           </div>
           <div className="bg-purple-50 p-4 rounded-lg">
             <div className="flex items-center mb-2">
               <FaDownload className="text-purple-600 mr-2" />
               <h4 className="font-medium">{currentTranslations.rights.portability.title}</h4>
             </div>
             <p className="text-sm text-gray-600">{currentTranslations.rights.portability.description}</p>
           </div>
         </div>
       </section>

             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.rights.exercise.title}</h3>
         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
           <h4 className="font-medium text-yellow-800 mb-2">{currentTranslations.rights.exercise.how}</h4>
           <div className="space-y-2 text-sm text-yellow-700">
             <p>• {currentTranslations.rights.exercise.email}: privacy@ladderfox.com</p>
             <p>• {currentTranslations.rights.exercise.response_time}: 30 {currentTranslations.rights.exercise.days}</p>
             <p>• {currentTranslations.rights.exercise.verification}</p>
           </div>
         </div>
       </section>

             <section>
         <h3 className="text-xl font-semibold mb-4">{currentTranslations.rights.complaints.title}</h3>
         <div className="bg-gray-50 p-4 rounded-lg">
           <h4 className="font-medium mb-2">{currentTranslations.rights.complaints.authorities}</h4>
           <div className="grid md:grid-cols-2 gap-4 text-sm">
             <div>
               <h5 className="font-medium">{currentTranslations.rights.complaints.netherlands}</h5>
               <p>Autoriteit Persoonsgegevens</p>
               <p>autoriteitpersoonsgegevens.nl</p>
             </div>
             <div>
               <h5 className="font-medium">{currentTranslations.rights.complaints.eu}</h5>
               <p>European Data Protection Board</p>
               <p>edpb.europa.eu</p>
             </div>
           </div>
         </div>
       </section>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return renderPrivacyPolicy();
      case 'terms':
        return renderTerms();
      case 'ai':
        return renderAI();
      case 'cookies':
        return renderCookies();
      case 'rights':
        return renderRights();
      default:
        return renderPrivacyPolicy();
    }
  };

  return (
    <>
             <Head>
         <title>{currentTranslations.meta.title} | LadderFox</title>
         <meta name="description" content={currentTranslations.meta.description} />
         <meta name="keywords" content={currentTranslations.meta.keywords} />
       </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
                     <div className="text-center mb-8">
             <h1 className="text-4xl font-bold text-gray-900 mb-4">
               {currentTranslations.title}
             </h1>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               {currentTranslations.subtitle}
             </p>
           </div>

          {/* Language Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-2">
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLanguage(lang.code as "en" | "nl" | "fr" | "es" | "de")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLanguage === lang.code
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                        activeSection === section.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="mr-2" />
                      {section.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {renderContent()}
          </div>

          {/* Footer Notice */}
                     <div className="mt-8 text-center">
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold text-blue-800 mb-2">
                 {currentTranslations.footer.last_updated}
               </h3>
               <p className="text-blue-700 mb-4">
                 {currentTranslations.footer.last_updated_date}
               </p>
               <div className="flex justify-center space-x-4 text-sm text-blue-600">
                 <span>{currentTranslations.footer.contact}: privacy@ladderfox.com</span>
                 <span>•</span>
                 <span>{currentTranslations.footer.version}: 2.0</span>
                 <span>•</span>
                 <span>{currentTranslations.footer.compliant}: GDPR, CCPA, LGPD</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </>
  );
} 