import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://hirekit-nine.vercel.app'),
  title: 'HireKit — Hire Smarter, Faster, All-in-One | ATS, AI Scoring & Career Pages',
  description: 'The all-in-one hiring platform for growing teams. ATS pipeline, AI candidate scoring, hosted career pages, embeddable widgets, interview scheduling, and 15+ tools — all free during early access.',
  openGraph: {
    title: 'HireKit — The Hiring Platform That Replaces 5 Tools',
    description: 'ATS pipeline, AI scoring, career pages, interview scheduling, email templates, and more. One platform, zero complexity. Free during early access.',
    siteName: 'HireKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireKit — The Hiring Platform That Replaces 5 Tools',
    description: 'ATS pipeline, AI scoring, career pages, interview scheduling, email templates, and more. One platform, zero complexity.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="afterInteractive" />
      </body>
    </html>
  );
}
