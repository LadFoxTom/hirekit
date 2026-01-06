import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaHeart,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaRocket
} from 'react-icons/fa';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  'aria-hidden'?: boolean;
}

const navigation = {
  product: [
    { nameKey: 'footer.product.cv_builder', href: '/' },
    { nameKey: 'footer.product.letter_builder', href: '/letter' },
    { nameKey: 'footer.product.cv_guide', href: '/cv-guide' },
    { nameKey: 'footer.product.pricing', href: '/pricing' },
  ],
  company: [
    { nameKey: 'footer.company.about', href: '/about' },
    { nameKey: 'footer.company.contact', href: '/contact' },
    { nameKey: 'footer.company.faq', href: '/faq' },
    { nameKey: 'footer.company.privacy', href: '/data-compliance' },
    { nameKey: 'footer.company.terms', href: '/terms' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: FaTwitter,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: FaLinkedin,
    },
  ],
};

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold">LadderFox</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              {t('footer.brand.description')}
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.product.title')}</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.nameKey}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {t(item.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.nameKey}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {t(item.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-r-lg transition-all duration-200">
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FaShieldAlt className="w-4 h-4 mr-1" />
                  {t('footer.stats.secure')}
                </span>
                <span className="flex items-center">
                  <FaRocket className="w-4 h-4 mr-1" />
                  {t('footer.stats.ai_powered')}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-400">
              {t('footer.made_with')} <FaHeart className="inline w-3 h-3 text-red-500" /> {t('footer.for_job_seekers')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 