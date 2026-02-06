import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Anschreiben Leitfaden & Tipps | LadderFox',
  description: 'Erhalten Sie personalisierte Anschreiben-Tipps basierend auf Ihrem Land, Ihrer Branche und Ihrem Beruf. Schreiben Sie ein überzeugendes Bewerbungsanschreiben.',
  keywords: [
    'anschreiben tipps',
    'bewerbungsschreiben',
    'anschreiben beispiel',
    'motivationsschreiben',
    'anschreiben nach beruf',
    'bewerbung deutschland',
    'anschreiben vorlage'
  ],
  openGraph: {
    title: 'Anschreiben Leitfaden & Tipps | LadderFox',
    description: 'Erhalten Sie personalisierte Anschreiben-Tipps basierend auf Ihrem Land, Ihrer Branche und Ihrem Beruf.',
    type: 'website',
    locale: 'de_DE'
  },
  alternates: {
    canonical: '/beispiele/anschreiben'
  }
}

export default function GermanLetterAdvisorPage() {
  const language: Language = 'de'
  return <CVAdvisorPage type="letter" language={language} />
}
