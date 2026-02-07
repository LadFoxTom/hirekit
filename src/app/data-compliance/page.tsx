'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import Head from 'next/head';
import { FiArrowLeft, FiShield, FiLock, FiCpu, FiDatabase, FiUserCheck, FiDownload } from 'react-icons/fi';

export default function DataCompliancePage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get('section');
  const validSections = ['privacy', 'terms', 'ai', 'cookies', 'rights'];
  const initialSection = sectionParam && validSections.includes(sectionParam) ? sectionParam : 'privacy';
  const [activeSection, setActiveSection] = useState(initialSection);

  // Update active section when URL parameter changes
  useEffect(() => {
    if (sectionParam && validSections.includes(sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  const sections = [
    { id: 'privacy', name: t('data_compliance.sections.privacy'), icon: FiShield },
    { id: 'terms', name: t('data_compliance.sections.terms'), icon: FiLock },
    { id: 'ai', name: t('data_compliance.sections.ai'), icon: FiCpu },
    { id: 'cookies', name: t('data_compliance.sections.cookies'), icon: FiDatabase },
    { id: 'rights', name: t('data_compliance.sections.rights'), icon: FiUserCheck },
  ];

  const renderPrivacyPolicy = () => (
    <div className="space-y-8">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FiShield className="text-blue-400 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">{t('data_compliance.privacy.important_note')}</h3>
            <p className="text-gray-300 text-sm">{t('data_compliance.privacy.important_description')}</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.privacy.data_collection.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-3 text-white">{t('data_compliance.privacy.data_collection.personal')}</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• {t('data_compliance.privacy.data_collection.name')}</li>
              <li>• {t('data_compliance.privacy.data_collection.email')}</li>
              <li>• {t('data_compliance.privacy.data_collection.contact')}</li>
              <li>• {t('data_compliance.privacy.data_collection.professional')}</li>
            </ul>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-3 text-white">{t('data_compliance.privacy.data_collection.technical')}</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• {t('data_compliance.privacy.data_collection.ip')}</li>
              <li>• {t('data_compliance.privacy.data_collection.browser')}</li>
              <li>• {t('data_compliance.privacy.data_collection.usage')}</li>
              <li>• {t('data_compliance.privacy.data_collection.session')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.privacy.purposes.title')}</h3>
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-2 text-white">{t('data_compliance.privacy.purposes.service')}</h4>
            <p className="text-sm text-gray-400">{t('data_compliance.privacy.purposes.service_desc')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-2 text-white">{t('data_compliance.privacy.purposes.ai')}</h4>
            <p className="text-sm text-gray-400">{t('data_compliance.privacy.purposes.ai_desc')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-2 text-white">{t('data_compliance.privacy.purposes.analytics')}</h4>
            <p className="text-sm text-gray-400">{t('data_compliance.privacy.purposes.analytics_desc')}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.privacy.retention.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-white mb-2">{t('data_compliance.privacy.retention.documents')}</h4>
              <p className="text-gray-400">30 {t('data_compliance.privacy.retention.days')}</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">{t('data_compliance.privacy.retention.account')}</h4>
              <p className="text-gray-400">{t('data_compliance.privacy.retention.active')}</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">{t('data_compliance.privacy.retention.billing')}</h4>
              <p className="text-gray-400">7 {t('data_compliance.privacy.retention.years')}</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">{t('data_compliance.privacy.retention.logs')}</h4>
              <p className="text-gray-400">6 {t('data_compliance.privacy.retention.months')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-8">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FiLock className="text-red-400 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-semibold mb-2">{t('data_compliance.terms.disclaimer.title')}</h3>
            <p className="text-gray-300 text-sm">{t('data_compliance.terms.disclaimer.description')}</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.terms.service.title')}</h3>
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-2 text-white">{t('data_compliance.terms.service.what')}</h4>
            <p className="text-sm text-gray-400">{t('data_compliance.terms.service.description')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-2 text-white">{t('data_compliance.terms.service.limitations')}</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• {t('data_compliance.terms.service.no_guarantee')}</li>
              <li>• {t('data_compliance.terms.service.no_liability')}</li>
              <li>• {t('data_compliance.terms.service.user_responsibility')}</li>
              <li>• {t('data_compliance.terms.service.service_changes')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.terms.liability.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <h4 className="font-medium text-white mb-2">{t('data_compliance.terms.liability.limitation')}</h4>
          <p className="text-sm text-gray-400 mb-4">{t('data_compliance.terms.liability.description')}</p>
          <div className="text-sm text-gray-500">
            <p><strong className="text-gray-300">{t('data_compliance.terms.liability.exclusions')}:</strong> {t('data_compliance.terms.liability.exclusions_desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-8">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FiCpu className="text-purple-400 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-purple-400 font-semibold mb-2">{t('data_compliance.ai.important.title')}</h3>
            <p className="text-gray-300 text-sm">{t('data_compliance.ai.important.description')}</p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.ai.processing.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-3 text-white">{t('data_compliance.ai.processing.what')}</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• {t('data_compliance.ai.processing.content_analysis')}</li>
              <li>• {t('data_compliance.ai.processing.suggestions')}</li>
              <li>• {t('data_compliance.ai.processing.optimization')}</li>
              <li>• {t('data_compliance.ai.processing.grammar_check')}</li>
            </ul>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium mb-3 text-white">{t('data_compliance.ai.processing.providers')}</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• OpenAI (GPT models)</li>
              <li>• {t('data_compliance.ai.processing.third_party')}</li>
              <li>• {t('data_compliance.ai.processing.encrypted')}</li>
              <li>• {t('data_compliance.ai.processing.temporary')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.ai.disclaimer.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <h4 className="font-medium text-white mb-3">{t('data_compliance.ai.disclaimer.warning')}</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• {t('data_compliance.ai.disclaimer.no_guarantee')}</li>
            <li>• {t('data_compliance.ai.disclaimer.user_review')}</li>
            <li>• {t('data_compliance.ai.disclaimer.no_liability')}</li>
            <li>• {t('data_compliance.ai.disclaimer.professional_advice')}</li>
          </ul>
        </div>
      </section>
    </div>
  );

  const renderCookies = () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.cookies.types.title')}</h3>
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium text-white mb-2">{t('data_compliance.cookies.types.essential')}</h4>
            <p className="text-sm text-gray-400 mb-2">{t('data_compliance.cookies.types.essential_desc')}</p>
            <p className="text-xs text-gray-500">{t('data_compliance.cookies.types.essential_required')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium text-white mb-2">{t('data_compliance.cookies.types.analytics')}</h4>
            <p className="text-sm text-gray-400 mb-2">{t('data_compliance.cookies.types.analytics_desc')}</p>
            <p className="text-xs text-gray-500">{t('data_compliance.cookies.types.analytics_optional')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <h4 className="font-medium text-white mb-2">{t('data_compliance.cookies.types.marketing')}</h4>
            <p className="text-sm text-gray-400 mb-2">{t('data_compliance.cookies.types.marketing_desc')}</p>
            <p className="text-xs text-gray-500">{t('data_compliance.cookies.types.marketing_optional')}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.cookies.management.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <h4 className="font-medium mb-3 text-white">{t('data_compliance.cookies.management.how')}</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• {t('data_compliance.cookies.management.browser_settings')}</li>
            <li>• {t('data_compliance.cookies.management.cookie_banner')}</li>
            <li>• {t('data_compliance.cookies.management.contact')}</li>
            <li>• {t('data_compliance.cookies.management.third_party')}</li>
          </ul>
        </div>
      </section>
    </div>
  );

  const renderRights = () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.rights.your_rights.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FiShield className="text-blue-400 mr-2" />
              <h4 className="font-medium text-white">{t('data_compliance.rights.access.title')}</h4>
            </div>
            <p className="text-sm text-gray-400">{t('data_compliance.rights.access.description')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FiUserCheck className="text-green-400 mr-2" />
              <h4 className="font-medium text-white">{t('data_compliance.rights.correction.title')}</h4>
            </div>
            <p className="text-sm text-gray-400">{t('data_compliance.rights.correction.description')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FiLock className="text-red-400 mr-2" />
              <h4 className="font-medium text-white">{t('data_compliance.rights.deletion.title')}</h4>
            </div>
            <p className="text-sm text-gray-400">{t('data_compliance.rights.deletion.description')}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FiDownload className="text-purple-400 mr-2" />
              <h4 className="font-medium text-white">{t('data_compliance.rights.portability.title')}</h4>
            </div>
            <p className="text-sm text-gray-400">{t('data_compliance.rights.portability.description')}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.rights.exercise.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <h4 className="font-medium text-white mb-3">{t('data_compliance.rights.exercise.how')}</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• {t('data_compliance.rights.exercise.email')}: privacy@ladderfox.com</p>
            <p>• {t('data_compliance.rights.exercise.response_time')}: 30 {t('data_compliance.rights.exercise.days')}</p>
            <p>• {t('data_compliance.rights.exercise.verification')}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-white">{t('data_compliance.rights.complaints.title')}</h3>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
          <h4 className="font-medium mb-4 text-white">{t('data_compliance.rights.complaints.authorities')}</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-white mb-2">{t('data_compliance.rights.complaints.netherlands')}</h5>
              <p className="text-gray-400">Autoriteit Persoonsgegevens</p>
              <p className="text-gray-500 text-xs">autoriteitpersoonsgegevens.nl</p>
            </div>
            <div>
              <h5 className="font-medium text-white mb-2">{t('data_compliance.rights.complaints.eu')}</h5>
              <p className="text-gray-400">European Data Protection Board</p>
              <p className="text-gray-500 text-xs">edpb.europa.eu</p>
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
        <title>{t('data_compliance.meta.title')} | LadderFox</title>
        <meta name="description" content={t('data_compliance.meta.description')} />
        <meta name="keywords" content={t('data_compliance.meta.keywords')} />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
              >
                <FiArrowLeft size={20} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                  LF
                </div>
                <span className="font-semibold text-lg hidden sm:block">LadderFox</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-14 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {t('data_compliance.title')}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {t('data_compliance.subtitle')}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 mb-8 overflow-hidden">
              <div className="border-b border-white/5">
                <nav className="flex overflow-x-auto" aria-label="Tabs">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                          activeSection === section.id
                            ? 'border-blue-500 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <Icon size={18} />
                        {section.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-8">
              {renderContent()}
            </div>

            {/* Footer Notice */}
            <div className="mt-8 text-center">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('data_compliance.footer.last_updated')}
                </h3>
                <p className="text-gray-400 mb-4">
                  {t('data_compliance.footer.last_updated_date')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                  <span>{t('data_compliance.footer.contact')}: privacy@ladderfox.com</span>
                  <span>•</span>
                  <span>{t('data_compliance.footer.version')}: 2.0</span>
                  <span>•</span>
                  <span>{t('data_compliance.footer.compliant')}: GDPR, CCPA, LGPD</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
