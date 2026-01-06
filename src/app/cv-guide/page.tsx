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
  FaBookOpen
} from 'react-icons/fa'

export default function CVGuidePage() {
  const { t } = useLocale()

  const sectors = [
    {
      name: t('cv_guide.sectors.sales.name'),
      icon: FaCrosshairs,
      emphasis: t('cv_guide.sectors.sales.emphasis'),
      tips: t('cv_guide.sectors.sales.tips')
    },
    {
      name: t('cv_guide.sectors.it.name'),
      icon: FaTools,
      emphasis: t('cv_guide.sectors.it.emphasis'),
      tips: t('cv_guide.sectors.it.tips')
    },
    {
      name: t('cv_guide.sectors.healthcare.name'),
      icon: FaHeart,
      emphasis: t('cv_guide.sectors.healthcare.emphasis'),
      tips: t('cv_guide.sectors.healthcare.tips')
    },
    {
      name: t('cv_guide.sectors.education.name'),
      icon: FaGraduationCap,
      emphasis: t('cv_guide.sectors.education.emphasis'),
      tips: t('cv_guide.sectors.education.tips')
    },
    {
      name: t('cv_guide.sectors.research.name'),
      icon: FaBookOpen,
      emphasis: t('cv_guide.sectors.research.emphasis'),
      tips: t('cv_guide.sectors.research.tips')
    },
    {
      name: t('cv_guide.sectors.admin.name'),
      icon: FaBriefcase,
      emphasis: t('cv_guide.sectors.admin.emphasis'),
      tips: t('cv_guide.sectors.admin.tips')
    },
    {
      name: t('cv_guide.sectors.creative.name'),
      icon: FaPencilAlt,
      emphasis: t('cv_guide.sectors.creative.emphasis'),
      tips: t('cv_guide.sectors.creative.tips')
    },
    {
      name: t('cv_guide.sectors.construction.name'),
      icon: FaTools,
      emphasis: t('cv_guide.sectors.construction.emphasis'),
      tips: t('cv_guide.sectors.construction.tips')
    },
    {
      name: t('cv_guide.sectors.hospitality.name'),
      icon: FaHandshake,
      emphasis: t('cv_guide.sectors.hospitality.emphasis'),
      tips: t('cv_guide.sectors.hospitality.tips')
    },
    {
      name: t('cv_guide.sectors.nonprofit.name'),
      icon: FaHeart,
      emphasis: t('cv_guide.sectors.nonprofit.emphasis'),
      tips: t('cv_guide.sectors.nonprofit.tips')
    }
  ]

  const generalPrinciples = [
    {
      title: t('cv_guide.general_principles.tailor.title'),
      description: t('cv_guide.general_principles.tailor.description'),
      icon: FaCrosshairs
    },
    {
      title: t('cv_guide.general_principles.concise.title'),
      description: t('cv_guide.general_principles.concise.description'),
      icon: FaEye
    },
    {
      title: t('cv_guide.general_principles.profile.title'),
      description: t('cv_guide.general_principles.profile.description'),
      icon: FaStar
    },
    {
      title: t('cv_guide.general_principles.achievements.title'),
      description: t('cv_guide.general_principles.achievements.description'),
      icon: FaChartBar
    },
    {
      title: t('cv_guide.general_principles.proofread.title'),
      description: t('cv_guide.general_principles.proofread.description'),
      icon: FaPencilAlt
    }
  ]

  const tailoringSteps = [
    {
      step: 1,
      title: t('cv_guide.tailoring.step1.title'),
      description: t('cv_guide.tailoring.step1.description')
    },
    {
      step: 2,
      title: t('cv_guide.tailoring.step2.title'),
      description: t('cv_guide.tailoring.step2.description')
    },
    {
      step: 3,
      title: t('cv_guide.tailoring.step3.title'),
      description: t('cv_guide.tailoring.step3.description')
    },
    {
      step: 4,
      title: t('cv_guide.tailoring.step4.title'),
      description: t('cv_guide.tailoring.step4.description')
    },
    {
      step: 5,
      title: t('cv_guide.tailoring.step5.title'),
      description: t('cv_guide.tailoring.step5.description')
    }
  ]

  const recruiterPriorities = [
    {
      title: t('cv_guide.recruiters.experience.title'),
      description: t('cv_guide.recruiters.experience.description')
    },
    {
      title: t('cv_guide.recruiters.education.title'),
      description: t('cv_guide.recruiters.education.description')
    },
    {
      title: t('cv_guide.recruiters.detail.title'),
      description: t('cv_guide.recruiters.detail.description')
    },
    {
      title: t('cv_guide.recruiters.personality.title'),
      description: t('cv_guide.recruiters.personality.description')
    }
  ]

  return (
    <>
      <SEOHead
        title="CV Writing Guide - How to Create a Professional CV"
        description="Learn how to write a professional CV with our comprehensive guide. Get tips for different industries, ATS optimization, and CV writing best practices."
        keywords={[
          'CV writing guide',
          'resume writing tips',
          'professional CV guide',
          'CV writing best practices',
          'ATS optimization',
          'CV writing for different industries',
          'CV writing tips',
          'resume writing guide',
          'CV format guide',
          'CV writing examples'
        ]}
        ogTitle="CV Writing Guide - How to Create a Professional CV"
        ogDescription="Learn how to write a professional CV with our comprehensive guide. Get tips for different industries and ATS optimization."
        canonical="/cv-guide"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Write a Professional CV",
          "description": "Comprehensive guide on writing professional CVs for different industries",
          "url": "https://ladder-fox-dev.vercel.app/cv-guide",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Tailor your CV to the job",
              "text": "Customize your CV for each specific job application"
            },
            {
              "@type": "HowToStep",
              "name": "Use clear formatting",
              "text": "Ensure your CV is well-structured and easy to read"
            },
            {
              "@type": "HowToStep",
              "name": "Include relevant keywords",
              "text": "Add industry-specific keywords for ATS optimization"
            }
          ],
          "supply": [
            {
              "@type": "HowToSupply",
              "name": "Professional CV template"
            }
          ],
          "tool": [
            {
              "@type": "HowToTool",
              "name": "LadderFox CV Builder"
            }
          ]
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('cv_guide.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('cv_guide.subtitle')}
            </p>
          </div>
        </section>

        <main className="flex-grow pt-16">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6">
                <FaBookOpen className="mr-2" />
                {t('cv_guide.badge')}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('cv_guide.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('cv_guide.subtitle')}
              </p>
            </div>

            {/* General Principles */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.general_principles.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {generalPrinciples.map((principle, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <principle.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{principle.title}</h3>
                    <p className="text-gray-600">{principle.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How to Tailor Your CV */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.tailoring.title')}
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  {tailoringSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* What Recruiters Look For */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.recruiters.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recruiterPriorities.map((priority, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{priority.title}</h3>
                    <p className="text-gray-600">{priority.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sector-Specific Tips */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.sectors.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectors.map((sector, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <sector.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{sector.name}</h3>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{t('cv_guide.sectors.emphasis_label')}</h4>
                      <p className="text-gray-600 text-sm">{sector.emphasis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('cv_guide.sectors.tips_label')}</h4>
                      <p className="text-gray-600 text-sm">{sector.tips}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic vs Industry CVs */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.academic_vs_industry.title')}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaGraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">{t('cv_guide.academic_vs_industry.academic.title')}</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.academic.point1')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.academic.point2')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.academic.point3')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.academic.point4')}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaBriefcase className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">{t('cv_guide.academic_vs_industry.industry.title')}</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.industry.point1')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.industry.point2')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.industry.point3')}</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{t('cv_guide.academic_vs_industry.industry.point4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Additional Practical Tips */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.practical_tips.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('cv_guide.practical_tips.master_cv.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('cv_guide.practical_tips.master_cv.description')}</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('cv_guide.practical_tips.format.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('cv_guide.practical_tips.format.description')}</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaShieldAlt className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('cv_guide.practical_tips.pdf.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('cv_guide.practical_tips.pdf.description')}</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('cv_guide.practical_tips.feedback.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('cv_guide.practical_tips.feedback.description')}</p>
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {t('cv_guide.references.title')}
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-gray-600 mb-6">
                  {t('cv_guide.references.description')}
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <a 
                      href={t('cv_guide.references.oxford.url')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    >
                      {t('cv_guide.references.oxford')}
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <a 
                      href={t('cv_guide.references.harvard.url')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    >
                      {t('cv_guide.references.harvard')}
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <a 
                      href={t('cv_guide.references.linkedin.url')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    >
                      {t('cv_guide.references.linkedin')}
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <a 
                      href={t('cv_guide.references.national.url')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    >
                      {t('cv_guide.references.national')}
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <a 
                      href={t('cv_guide.references.academic.url')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                    >
                      {t('cv_guide.references.academic')}
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">{t('cv_guide.cta.title')}</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  {t('cv_guide.cta.subtitle')}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                  <span>{t('cv_guide.cta.button')}</span>
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
} 