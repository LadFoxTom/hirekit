'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import SEOHead from '@/components/SEOHead'
import { 
  FaRocket, 
  FaLightbulb, 
  FaUsers, 
  FaShieldAlt, 
  FaArrowRight,
  FaStar,
  FaHeart,
  FaCheck,
  FaGraduationCap,
  FaBriefcase,
  FaChartBar,
  FaDownload
} from 'react-icons/fa'

export default function AboutPage() {
  const { t, language } = useLocale()

  const features = [
    {
      icon: FaRocket,
      title: t('about.features.ai_powered.title'),
      description: t('about.features.ai_powered.description')
    },
    {
      icon: FaLightbulb,
      title: t('about.features.smart_suggestions.title'),
      description: t('about.features.smart_suggestions.description')
    },
    {
      icon: FaUsers,
      title: t('about.features.user_friendly.title'),
      description: t('about.features.user_friendly.description')
    },
    {
      icon: FaShieldAlt,
      title: t('about.features.secure.title'),
      description: t('about.features.secure.description')
    }
  ]

  const howItWorks = [
    {
      icon: FaGraduationCap,
      title: t('about.how_it_works.step1.title'),
      description: t('about.how_it_works.step1.description')
    },
    {
      icon: FaBriefcase,
      title: t('about.how_it_works.step2.title'),
      description: t('about.how_it_works.step2.description')
    },
    {
      icon: FaChartBar,
      title: t('about.how_it_works.step3.title'),
      description: t('about.how_it_works.step3.description')
    },
    {
      icon: FaDownload,
      title: t('about.how_it_works.step4.title'),
      description: t('about.how_it_works.step4.description')
    }
  ]

  const values = [
    {
      icon: FaStar,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: FaHeart,
      title: t('about.values.accessibility.title'),
      description: t('about.values.accessibility.description')
    },
    {
      icon: FaCheck,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    }
  ]

  return (
    <>
      <SEOHead
        title="About LadderFox - AI-Powered CV Builder"
        description="Learn about LadderFox, the modern AI-powered CV builder that helps professionals create stunning resumes. Discover our mission, values, and commitment to career success."
        keywords={[
          'about LadderFox',
          'CV builder company',
          'AI resume builder',
          'professional CV creator',
          'career tools',
          'resume builder mission',
          'CV builder values',
          'AI-powered career tools',
          'professional resume company',
          'career success platform'
        ]}
        ogTitle="About LadderFox - AI-Powered CV Builder"
        ogDescription="Learn about LadderFox, the modern AI-powered CV builder that helps professionals create stunning resumes."
        canonical="/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "LadderFox",
          "description": "AI-powered CV and resume builder helping professionals create stunning resumes",
          "url": "https://ladder-fox-dev.vercel.app",
          "logo": "https://ladder-fox-dev.vercel.app/logo.png",
          "sameAs": [
            "https://twitter.com/ladderfox",
            "https://linkedin.com/company/ladderfox"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@ladderfox.com"
          },
          "foundingDate": "2024"
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
            <p className="text-lg opacity-90 max-w-4xl mx-auto">
              {t('about.description')}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                {t('about.mission.description')}
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4">
                {t('about.mission.description2')}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.why_choose.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                    <feature.icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.how_it_works.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                    <step.icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.values.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                    <value.icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your Professional CV?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already created their perfect CV with LadderFox.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Now
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
} 