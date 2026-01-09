import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { getGoogleFontsUrls } from '@/lib/fonts'
import EnvironmentBadge from '@/components/EnvironmentBadge'

const inter = Inter({ subsets: ['latin'] })

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
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 