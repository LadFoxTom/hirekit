'use client'

import React from 'react'
import Link from 'next/link'
import { 
  FaArrowRight, FaFileAlt, FaBrain, 
  FaDownload, FaMobile, FaShieldAlt, FaRocket, FaMagic,
  FaCheck
} from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'

const features = [
  {
    icon: FaBrain,
    titleKey: 'landing.features.ai_suggestions.title',
    descriptionKey: 'landing.features.ai_suggestions.description',
    color: 'blue'
  },
  {
    icon: FaDownload,
    titleKey: 'landing.features.pdf_export.title',
    descriptionKey: 'landing.features.pdf_export.description',
    color: 'green'
  },
  {
    icon: FaMobile,
    titleKey: 'landing.features.mobile.title',
    descriptionKey: 'landing.features.mobile.description',
    color: 'purple'
  },
  {
    icon: FaShieldAlt,
    titleKey: 'landing.features.ats.title',
    descriptionKey: 'landing.features.ats.description',
    color: 'orange'
  }
]

export default function NewSection() {
  const { t } = useLocale();
  
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Feature Highlights */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
            <FaRocket className="mr-2" />
            {t('landing.features.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('landing.features.title.prefix')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('landing.features.title.highlight')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const colorClasses = {
              blue: 'text-blue-600 bg-blue-100',
              green: 'text-green-600 bg-green-100',
              purple: 'text-purple-600 bg-purple-100',
              orange: 'text-orange-600 bg-orange-100'
            }
            
            return (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto transition-transform duration-300 group-hover:scale-110 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            )
          })}
        </div>

        {/* Motivational Letter Builder Promo */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-white text-sm font-semibold mb-4">
                <FaMagic className="mr-2" />
                {t('landing.letter_promo.badge')}
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {t('landing.letter_promo.title')}
              </h3>
              <p className="text-base sm:text-lg text-purple-100 mb-6 leading-relaxed">
                {t('landing.letter_promo.subtitle')}
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <FaCheck className="text-green-300 mr-3" />
                  <span>{t('landing.letter_promo.features.personalized')}</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-300 mr-3" />
                  <span>{t('landing.letter_promo.features.templates')}</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-300 mr-3" />
                  <span>{t('landing.letter_promo.features.download')}</span>
                </div>
              </div>
              <Link
                href="/letter"
                className="group inline-flex items-center justify-center bg-white hover:bg-gray-100 text-purple-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>{t('landing.letter_promo.create_letter')}</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <FaFileAlt className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{t('landing.letter_promo.card.title')}</div>
                    <div className="text-purple-200 text-sm">{t('landing.letter_promo.card.subtitle')}</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="h-2 bg-white bg-opacity-20 rounded"></div>
                  <div className="h-2 bg-white bg-opacity-20 rounded w-3/4"></div>
                  <div className="h-2 bg-white bg-opacity-20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 