'use client'

import { CVPreview } from './CVPreview'
import { CV_TEMPLATES } from '@/types/cv'

const sampleData = {
  fullName: 'Alex Johnson',
  title: 'Senior Software Engineer',
  contact: {
    email: 'alex.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Experienced software engineer with a track record of building scalable applications and leading development teams.',
  experience: [
    {
      title: 'Senior Software Engineer at Tech Corp',
      content: [
        'Led development of cloud-native microservices architecture',
        'Managed team of 5 engineers, improving sprint velocity by 40%'
      ]
    }
  ],
  education: [
    {
      title: 'M.S. Computer Science',
      content: [
        'Stanford University, 2018',
        'Focus on Artificial Intelligence and Machine Learning'
      ]
    }
  ],
  skills: [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker'
  ]
}

export default function TemplatePreviewGenerator() {
  return (
    <div className="grid grid-cols-1 gap-8 p-8">
      {CV_TEMPLATES.map(template => (
        <div key={template.id} className="border rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">{template.name} Template</h2>
          <div className="transform scale-50 origin-top-left">
            <CVPreview
              data={{
                ...sampleData,
                template: template.id
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
} 