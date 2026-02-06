import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { Providers } from './providers'
import { getGoogleFontsUrls } from '@/lib/fonts'
import EnvironmentBadge from '@/components/EnvironmentBadge'
import Hotjar from '@/components/Hotjar'
import GoogleAnalytics from '@/components/GoogleAnalytics'

// Dynamically import ConsentBanner to avoid SSR issues
const ConsentBanner = dynamic(() => import('@/components/ConsentBanner'), {
  ssr: false,
})

const inter = Inter({ subsets: ['latin'] })

// Viewport configuration - must be separate from metadata in Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: {
    default: 'LadderFox - Create Professional CVs with AI Assistance',
    template: '%s | LadderFox'
  },
  description: 'Build job-winning CVs in minutes with AI assistance. Choose from 20+ professional templates. Export to PDF, get AI writing help, and create cover letters.',
  keywords: [
    'CV builder',
    'resume builder',
    'AI CV creator',
    'professional CV templates',
    'CV maker',
    'resume templates',
    'cover letter builder',
    'job application',
    'career tools',
    'CV writing',
    'resume writing',
    'AI writing assistant',
    'PDF CV export',
    'modern CV templates',
    'professional resume'
  ],
  authors: [{ name: 'LadderFox Team' }],
  creator: 'LadderFox',
  publisher: 'LadderFox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ladder-fox-dev.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ladder-fox-dev.vercel.app',
    title: 'LadderFox - Create Professional CVs with AI Assistance',
    description: 'Build job-winning CVs in minutes with AI assistance. Choose from 20+ professional templates. Export to PDF, get AI writing help, and create cover letters.',
    siteName: 'LadderFox',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LadderFox - AI-Powered CV Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LadderFox - Create Professional CVs with AI Assistance',
    description: 'Build job-winning CVs in minutes with AI assistance. Choose from 20+ professional templates.',
    images: ['/og-image.png'],
    creator: '@ladderfox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'business',
  classification: 'CV Builder, Resume Builder, Career Tools',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-BT59N8YB46'
  const gaEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED === 'true'
  const contentsquareEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_CONTENTSQUARE_ENABLED === 'true'
  const contentsquareScriptUrl = process.env.NEXT_PUBLIC_CONTENTSQUARE_SCRIPT_URL || 'https://t.contentsquare.net/uxa/04f04fecfbf56.js'

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        {gaEnabled && (
          <>
            {/* Google tag (gtag.js) - Initialize dataLayer early for Consent Mode */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                `,
              }}
            />
          </>
        )}
        {contentsquareEnabled && (
          <script
            src={contentsquareScriptUrl}
            async
          />
        )}
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LadderFox",
              "url": process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://www.ladderfox.com",
              "logo": `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://www.ladderfox.com"}/logo.png`,
              "description": "AI-powered CV and resume builder helping professionals create stunning resumes",
              "sameAs": [
                "https://twitter.com/ladderfox",
                "https://linkedin.com/company/ladderfox"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@ladderfox.com"
              }
            })
          }}
        />
        {gaEnabled && (
          <GoogleAnalytics 
            trackingId={gaId}
            enabled={gaEnabled}
          />
        )}
        <Hotjar 
          siteId={process.env.NEXT_PUBLIC_HOTJAR_SITE_ID ? parseInt(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID) : undefined}
          enabled={process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_HOTJAR_ENABLED === 'true'}
        />
        <Providers>
          <ConsentBanner />
          {children}
        </Providers>
      </body>
    </html>
  )
} 