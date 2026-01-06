'use client';

import { motion } from 'framer-motion';
import { FaMousePointer, FaFileAlt, FaDownload, FaBrain, FaShieldAlt, FaMobileAlt, FaPalette, FaRocket } from 'react-icons/fa';
import { useLocale } from '@/context/LocaleContext';

const features = [
  {
    name: 'landing.features.intuitive.name',
    description: 'landing.features.intuitive.description',
    icon: <FaMousePointer className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: 'landing.features.intuitive.badge',
  },
  {
    name: 'landing.features.templates.name',
    description: 'landing.features.templates.description',
    icon: <FaFileAlt className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    badge: 'landing.features.templates.badge',
  },
  {
    name: 'landing.features.export.name',
    description: 'landing.features.export.description',
    icon: <FaDownload className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    badge: 'landing.features.export.badge',
  },
  {
    name: 'landing.features.ai.name',
    description: 'landing.features.ai.description',
    icon: <FaBrain className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    badge: 'landing.features.ai.badge',
  },
  {
    name: 'landing.features.security.name',
    description: 'landing.features.security.description',
    icon: <FaShieldAlt className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    badge: 'landing.features.security.badge',
  },
  {
    name: 'landing.features.mobile.name',
    description: 'landing.features.mobile.description',
    icon: <FaMobileAlt className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    badge: 'landing.features.mobile.badge',
  },
  {
    name: 'landing.features.customizable.name',
    description: 'landing.features.customizable.description',
    icon: <FaPalette className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    badge: 'landing.features.customizable.badge',
  },
  {
    name: 'landing.features.fast.name',
    description: 'landing.features.fast.description',
    icon: <FaRocket className="h-6 w-6" />,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    badge: 'landing.features.fast.badge',
  },
];

export default function FeaturesSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-100 rounded-full opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
            <FaRocket className="mr-2" />
            {t('landing.features.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('landing.features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('landing.features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* Icon with gradient background */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: feature.gradient }}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gray-100 text-gray-700">
                  {t(feature.badge)}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {t(feature.name)}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.description)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 