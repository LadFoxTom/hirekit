import { Metadata } from 'next'
import CVAdvisorPage from '@/components/examples/CVAdvisorPage'
import type { Language } from '@/data/professions'

export const metadata: Metadata = {
  title: 'Guide CV & Conseils | LadderFox',
  description: 'Obtenez des conseils CV personnalisés selon votre pays, secteur et profession. Découvrez ce que recherchent les recruteurs et créez un CV professionnel.',
  keywords: [
    'conseils cv',
    'cv astuces',
    'exemple cv',
    'cv professionnel',
    'cv par métier',
    'cv france',
    'curriculum vitae conseils'
  ],
  openGraph: {
    title: 'Guide CV & Conseils | LadderFox',
    description: 'Obtenez des conseils CV personnalisés selon votre pays, secteur et profession.',
    type: 'website',
    locale: 'fr_FR'
  },
  alternates: {
    canonical: '/exemples/cv'
  }
}

export default function FrenchCVAdvisorPage() {
  const language: Language = 'fr'
  return <CVAdvisorPage type="cv" language={language} />
}
