import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Guide Lettre de Motivation & Conseils | LadderFox',
  description: 'Obtenez des conseils personnalisés pour votre lettre de motivation selon votre pays, secteur et profession. Rédigez une lettre percutante.',
  keywords: [
    'lettre de motivation conseils',
    'lettre de motivation exemple',
    'lettre de motivation professionnelle',
    'lettre par métier',
    'candidature france',
    'lettre de motivation modèle'
  ],
  openGraph: {
    title: 'Guide Lettre de Motivation & Conseils | LadderFox',
    description: 'Obtenez des conseils personnalisés pour votre lettre de motivation selon votre pays, secteur et profession.',
    type: 'website',
    locale: 'fr_FR'
  },
  alternates: {
    canonical: '/exemples/lettre'
  }
}

export default function FrenchLetterAdvisorPage() {
  const language: Language = 'fr'
  return <CVAdvisorPage type="letter" language={language} />
}
