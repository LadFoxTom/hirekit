import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Lebenslauf Leitfaden & Tipps | LadderFox',
  description: 'Erhalten Sie personalisierte Lebenslauf-Tipps basierend auf Ihrem Land, Ihrer Branche und Ihrem Beruf. Entdecken Sie, was Recruiter suchen und erstellen Sie einen professionellen Lebenslauf.',
  keywords: [
    'lebenslauf tipps',
    'cv tipps',
    'lebenslauf beispiel',
    'professioneller lebenslauf',
    'lebenslauf nach beruf',
    'lebenslauf deutschland',
    'curriculum vitae tipps'
  ],
  openGraph: {
    title: 'Lebenslauf Leitfaden & Tipps | LadderFox',
    description: 'Erhalten Sie personalisierte Lebenslauf-Tipps basierend auf Ihrem Land, Ihrer Branche und Ihrem Beruf.',
    type: 'website',
    locale: 'de_DE'
  },
  alternates: {
    canonical: '/beispiele/lebenslauf'
  }
}

export default function GermanCVAdvisorPage() {
  const language: Language = 'de'
  return <CVAdvisorPage type="cv" language={language} />
}
