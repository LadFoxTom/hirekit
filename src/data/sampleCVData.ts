import { CVData } from '@/types/cv'

// Comprehensive sample CV data for development and testing
export const sampleCVData: CVData = {
  template: 'modern',
  fullName: 'Alex Morgan',
  title: 'Senior Software Engineer',
  summary: 'Experienced software engineer with over 8 years of expertise in building scalable web applications and microservices. Passionate about clean code, performance optimization, and mentoring junior developers.',
  photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  contact: {
    email: 'alex.morgan@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA'
  },
  social: {
    linkedin: 'https://linkedin.com/in/alexmorgan',
    github: 'https://github.com/alexmorgan',
    website: 'https://alexmorgan.dev'
  },
  layout: {
    photoPosition: 'left',
    showIcons: true,
    accentColor: '#3b82f6',
    sectionOrder: [
      'summary',
      'experience',
      'skills',
      'education',
      'certifications',
      'projects',
      'languages',
      'hobbies'
    ]
  },
  experience: [
    {
      title: 'Senior Software Engineer at TechCorp (2020-Present)',
      content: [
        'Led a team of 5 engineers to deliver a mission-critical payment processing system serving 2M+ users',
        'Architected and implemented a microservices infrastructure that reduced server costs by 35%',
        'Key Responsibilities:',
        'Develop and maintain backend services using Node.js, Express, and TypeScript',
        'Implement CI/CD pipelines and automated testing strategies',
        'Performance optimization and code quality monitoring',
        'Key Achievements:',
        'Reduced API response time by 60% through strategic caching and indexing',
        'Mentored 3 junior developers who were promoted to mid-level within 12 months'
      ]
    },
    {
      title: 'Full Stack Developer at InnovateSoft (2017-2020)',
      content: [
        'Developed and maintained multiple client projects using React, Angular, and Node.js',
        'Collaborated with UX designers to implement responsive interfaces for web and mobile applications',
        'Key Responsibilities:',
        'Full stack development with focus on frontend technologies',
        'Direct client communication and requirement gathering',
        'Database schema design and optimization',
        'Key Achievements:',
        'Built an e-commerce platform that increased client conversion rate by 28%',
        'Implemented automated testing that reduced QA time by 40%'
      ]
    }
  ],
  education: [
    {
      degree: 'Master of Computer Science - Stanford University (2015-2017)',
      content: [
        'GPA: 3.9/4.0',
        'Specialization in Artificial Intelligence and Machine Learning',
        'Coursework:',
        'Advanced Algorithms',
        'Machine Learning',
        'Distributed Systems',
        'Natural Language Processing',
        'Honors:',
        'Dean\'s List for Academic Excellence',
        'Outstanding Graduate Student Award'
      ]
    },
    {
      degree: 'Bachelor of Science in Computer Engineering - MIT (2011-2015)',
      content: [
        'GPA: 3.8/4.0',
        'Minor in Mathematics',
        'Coursework:',
        'Data Structures and Algorithms',
        'Computer Architecture',
        'Operating Systems',
        'Database Systems'
      ]
    }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 
    'GraphQL', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Docker', 
    'Kubernetes', 'AWS', 'CI/CD', 'Jest', 'React Testing Library', 
    'Performance Optimization', 'System Architecture', 'Microservices'
  ],
  languages: [
    'English (Native)', 'Spanish (Professional)', 'French (Conversational)'
  ],
  certifications: [
    {
      title: 'Professional Certifications',
      content: [
        'AWS Certified Solutions Architect - Professional',
        'Google Cloud Professional Data Engineer',
        'MongoDB Certified Developer',
        'Kubernetes Certified Administrator (CKA)',
        'Skills gained:',
        'Cloud infrastructure management and optimization',
        'Data pipeline design and implementation',
        'Container orchestration and deployment strategies'
      ]
    }
  ],
  projects: [
    {
      title: 'Open Source Projects',
      content: [
        'TypeStrongDB - A type-safe ORM for TypeScript (4,500+ GitHub stars)',
        'React Component Library - Accessible UI components with 200k+ monthly downloads',
        'Key features:',
        'Fully tested with 95%+ code coverage',
        'Comprehensive documentation with Storybook',
        'CI/CD pipeline with automated releases',
        'Technologies:',
        'TypeScript, React, Jest, GitHub Actions, Semantic Release'
      ]
    },
    {
      title: 'Personal Projects',
      content: [
        'AI Code Review Assistant - A tool that uses GPT to suggest code improvements',
        'Personal Finance Dashboard - Visualization of spending patterns with predictive analysis',
        'Technologies:',
        'Python, OpenAI API, D3.js, Next.js, Supabase'
      ]
    }
  ],
  hobbies: [
    'Rock Climbing', 'Piano', 'Hiking', 'Open Source Contributing', 'Travel', 'Photography'
  ]
}

// Shorter sample CV data with just the essential information
export const minimumSampleCVData: CVData = {
  template: 'modern',
  fullName: 'Sam Wilson',
  title: 'Web Developer',
  summary: 'Frontend developer with experience in React and TypeScript.',
  contact: {
    email: 'sam@example.com',
    phone: '(555) 987-6543',
    location: 'Seattle, WA'
  },
  experience: [
    {
      title: 'Frontend Developer at WebCo (2020-Present)',
      content: [
        'Built responsive web applications using React',
        'Collaborated with designers to implement UI components',
        'Maintained testing suite using Jest and React Testing Library'
      ]
    }
  ],
  education: [
    {
      degree: 'BS in Computer Science - State University (2016-2020)',
      content: [
        'GPA: 3.5/4.0',
        'Focus on web technologies and programming'
      ]
    }
  ],
  skills: [
    'JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Git'
  ]
} 