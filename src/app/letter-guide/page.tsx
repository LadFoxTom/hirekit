'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import SEOHead from '@/components/SEOHead'
import { 
  FaCheck, 
  FaStar, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaArrowRight, 
  FaInfinity,
  FaGraduationCap,
  FaBriefcase,
  FaChartBar,
  FaLightbulb,
  FaHandshake,
  FaTools,
  FaHeart,
  FaPencilAlt,
  FaEye,
  FaCrosshairs,
  FaBookOpen,
  FaSearch,
  FaUserTie,
  FaBuilding,
  FaComments,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaThumbsUp,
  FaGlobe,
  FaBalanceScale,
  FaUniversity,
  FaHospital,
  FaLaptopCode,
  FaShoppingCart,
  FaBullhorn
} from 'react-icons/fa'

export default function LetterGuidePage() {
  const { t } = useLocale()

  const sectors = [
    {
      name: t('letter_guide.sectors.healthcare.name'),
      icon: FaHeart,
      emphasis: t('letter_guide.sectors.healthcare.emphasis'),
      tips: t('letter_guide.sectors.healthcare.tips'),
      details: t('letter_guide.sectors.healthcare.details')
    },
    {
      name: t('letter_guide.sectors.technology.name'),
      icon: FaLaptopCode,
      emphasis: t('letter_guide.sectors.technology.emphasis'),
      tips: t('letter_guide.sectors.technology.tips'),
      details: t('letter_guide.sectors.technology.details')
    },
    {
      name: t('letter_guide.sectors.commercial.name'),
      icon: FaShoppingCart,
      emphasis: t('letter_guide.sectors.commercial.emphasis'),
      tips: t('letter_guide.sectors.commercial.tips'),
      details: t('letter_guide.sectors.commercial.details')
    },
    {
      name: t('letter_guide.sectors.government.name'),
      icon: FaUniversity,
      emphasis: t('letter_guide.sectors.government.emphasis'),
      tips: t('letter_guide.sectors.government.tips'),
      details: t('letter_guide.sectors.government.details')
    },
    {
      name: t('letter_guide.sectors.legal.name'),
      icon: FaBalanceScale,
      emphasis: t('letter_guide.sectors.legal.emphasis'),
      tips: t('letter_guide.sectors.legal.tips'),
      details: t('letter_guide.sectors.legal.details')
    }
  ]

  const generalTips = [
    {
      title: t('letter_guide.general_tips.analyze.title'),
      description: t('letter_guide.general_tips.analyze.description'),
      icon: FaSearch
    },
    {
      title: t('letter_guide.general_tips.personalize.title'),
      description: t('letter_guide.general_tips.personalize.description'),
      icon: FaUserTie
    },
    {
      title: t('letter_guide.general_tips.support.title'),
      description: t('letter_guide.general_tips.support.description'),
      icon: FaChartBar
    },
    {
      title: t('letter_guide.general_tips.personal.title'),
      description: t('letter_guide.general_tips.personal.description'),
      icon: FaHeart
    },
    {
      title: t('letter_guide.general_tips.concise.title'),
      description: t('letter_guide.general_tips.concise.description'),
      icon: FaPencilAlt
    },
    {
      title: t('letter_guide.general_tips.reference.title'),
      description: t('letter_guide.general_tips.reference.description'),
      icon: FaBuilding
    },
    {
      title: t('letter_guide.general_tips.proofread.title'),
      description: t('letter_guide.general_tips.proofread.description'),
      icon: FaEye
    }
  ]

  const analysisSteps = [
    {
      step: 1,
      title: t('letter_guide.analysis.step1.title'),
      description: t('letter_guide.analysis.step1.description')
    },
    {
      step: 2,
      title: t('letter_guide.analysis.step2.title'),
      description: t('letter_guide.analysis.step2.description')
    },
    {
      step: 3,
      title: t('letter_guide.analysis.step3.title'),
      description: t('letter_guide.analysis.step3.description')
    },
    {
      step: 4,
      title: t('letter_guide.analysis.step4.title'),
      description: t('letter_guide.analysis.step4.description')
    }
  ]

  const commonMistakes = [
    {
      title: t('letter_guide.mistakes.general.title'),
      description: t('letter_guide.mistakes.general.description')
    },
    {
      title: t('letter_guide.mistakes.cv_repetition.title'),
      description: t('letter_guide.mistakes.cv_repetition.description')
    },
    {
      title: t('letter_guide.mistakes.cliches.title'),
      description: t('letter_guide.mistakes.cliches.description')
    },
    {
      title: t('letter_guide.mistakes.overstating.title'),
      description: t('letter_guide.mistakes.overstating.description')
    }
  ]

  const practicalSteps = [
    {
      step: 1,
      title: t('letter_guide.practical.step1.title'),
      description: t('letter_guide.practical.step1.description')
    },
    {
      step: 2,
      title: t('letter_guide.practical.step2.title'),
      description: t('letter_guide.practical.step2.description')
    },
    {
      step: 3,
      title: t('letter_guide.practical.step3.title'),
      description: t('letter_guide.practical.step3.description')
    },
    {
      step: 4,
      title: t('letter_guide.practical.step4.title'),
      description: t('letter_guide.practical.step4.description')
    },
    {
      step: 5,
      title: t('letter_guide.practical.step5.title'),
      description: t('letter_guide.practical.step5.description')
    }
  ]

  return (
    <>
      <SEOHead
        title="Cover Letter Writing Guide - How to Write Professional Cover Letters"
        description="Learn how to write compelling cover letters with our comprehensive guide. Get tips for different industries, letter structure, and professional writing techniques."
        keywords={[
          'cover letter writing guide',
          'motivation letter guide',
          'cover letter tips',
          'professional cover letter',
          'cover letter writing tips',
          'cover letter examples',
          'cover letter format',
          'cover letter structure',
          'cover letter writing for different industries',
          'job application letter guide'
        ]}
        ogTitle="Cover Letter Writing Guide - How to Write Professional Cover Letters"
        ogDescription="Learn how to write compelling cover letters with our comprehensive guide. Get tips for different industries and letter structure."
        canonical="/letter-guide"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Write a Professional Cover Letter",
          "description": "Comprehensive guide on writing professional cover letters for different industries",
          "url": "https://ladder-fox-dev.vercel.app/letter-guide",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Analyze the job description",
              "text": "Carefully read and understand the job requirements and company culture"
            },
            {
              "@type": "HowToStep",
              "name": "Personalize your letter",
              "text": "Tailor your cover letter to the specific job and company"
            },
            {
              "@type": "HowToStep",
              "name": "Support with evidence",
              "text": "Provide specific examples that demonstrate your qualifications"
            }
          ],
          "supply": [
            {
              "@type": "HowToSupply",
              "name": "Professional cover letter template"
            }
          ],
          "tool": [
            {
              "@type": "HowToTool",
              "name": "LadderFox Letter Builder"
            }
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-20 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('letter_guide.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('letter_guide.subtitle')}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* General Tips Section */}
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FaLightbulb className="text-blue-600 mr-3" />
                    {t('letter_guide.general_tips.title')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generalTips.map((tip, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <tip.icon className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Sector-Specific Tips */}
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FaBriefcase className="text-purple-600 mr-3" />
                    {t('letter_guide.sectors.title')}
                  </h2>
                  
                  <div className="space-y-6">
                    {sectors.map((sector, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <sector.icon className="text-2xl text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{sector.name}</h3>
                            <div className="bg-blue-50 rounded-lg p-4 mb-3">
                              <p className="text-sm font-medium text-blue-800 mb-1">{t('letter_guide.sectors.emphasis_label')}</p>
                              <p className="text-sm text-blue-700">{sector.emphasis}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 mb-3">
                              <p className="text-sm font-medium text-green-800 mb-1">{t('letter_guide.sectors.tips_label')}</p>
                              <p className="text-sm text-green-700">{sector.tips}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-purple-800 mb-1">{t('letter_guide.sectors.details_label')}</p>
                              <p className="text-sm text-purple-700">{sector.details}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Job Description Analysis */}
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FaSearch className="text-green-600 mr-3" />
                    {t('letter_guide.analysis.title')}
                  </h2>
                  
                  <div className="space-y-6">
                    {analysisSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Common Mistakes */}
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FaExclamationTriangle className="text-red-600 mr-3" />
                    {t('letter_guide.mistakes.title')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {commonMistakes.map((mistake, index) => (
                      <div key={index} className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                        <h3 className="font-semibold text-red-800 mb-2">{mistake.title}</h3>
                        <p className="text-red-700 text-sm">{mistake.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Practical Steps */}
              <section>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FaClipboardCheck className="text-indigo-600 mr-3" />
                    {t('letter_guide.practical.title')}
                  </h2>
                  
                  <div className="space-y-6">
                    {practicalSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Tips Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaThumbsUp className="text-green-600 mr-2" />
                  {t('letter_guide.quick_tips.title')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('letter_guide.quick_tips.page_limit')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('letter_guide.quick_tips.active_language')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('letter_guide.quick_tips.examples')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('letter_guide.quick_tips.enthusiasm')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('letter_guide.quick_tips.proofread')}</span>
                  </li>
                </ul>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">{t('letter_guide.cta.title')}</h3>
                <p className="text-blue-100 mb-6">
                  {t('letter_guide.cta.subtitle')}
                </p>
                <Link
                  href="/letter"
                  className="inline-flex items-center justify-center w-full bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <FaPencilAlt className="mr-2" />
                  {t('letter_guide.cta.button')}
                </Link>
              </div>

              {/* Resources Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaBookOpen className="text-blue-600 mr-2" />
                  {t('letter_guide.resources.title')}
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/cv-guide"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{t('letter_guide.resources.cv_guide.title')}</div>
                    <div className="text-sm text-gray-600">{t('letter_guide.resources.cv_guide.description')}</div>
                  </Link>

                  <Link
                    href="/faq"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{t('letter_guide.resources.faq.title')}</div>
                    <div className="text-sm text-gray-600">{t('letter_guide.resources.faq.description')}</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
} 