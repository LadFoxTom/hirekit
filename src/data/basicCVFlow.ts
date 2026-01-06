// @ts-nocheck
/**
 * Basic CV Builder Flow - Comprehensive Question Set
 * 
 * Complete flow for creating professional CVs with all essential information
 * Based on HR expert recommendations and industry best practices
 */

import { FlowNode, FlowEdge } from '@/types/flow';

export const BASIC_CV_FLOW_NODES: FlowNode[] = [
  // Start Node
  {
    id: 'start',
    type: 'start',
    position: { x: 100, y: 50 },
    data: {
      label: 'Start',
      description: 'Basic CV Builder Flow begins here'
    }
  },
  
  // Introduction
  {
    id: 'intro',
    type: 'message',
    position: { x: 100, y: 150 },
    data: {
      label: 'Welcome to Basic CV Builder',
      content: 'Welcome! I\'ll help you create a professional CV in just a few minutes. Let\'s start with your basic information.',
      messageType: 'welcome'
    }
  },

  // Personal Information Section
  {
    id: 'full_name',
    type: 'question',
    position: { x: 100, y: 250 },
    data: {
      label: 'What is your full name?',
      questionType: 'text',
      variableName: 'fullName',
      placeholder: 'Enter your full name (e.g., John Smith)',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      helpText: 'Use your professional name as it appears on official documents'
    }
  },

  {
    id: 'preferred_name',
    type: 'question',
    position: { x: 100, y: 250 },
    data: {
      label: 'Do you have a preferred name or nickname?',
      questionType: 'text',
      variableName: 'preferredName',
      placeholder: 'Enter preferred name (optional)',
      validation: {
        required: false,
        maxLength: 50
      },
      helpText: 'This will be used in your professional summary if different from your full name'
    }
  },

  {
    id: 'email',
    type: 'question',
    position: { x: 100, y: 750 },
    data: {
      label: 'What is your professional email address?',
      questionType: 'text',
      variableName: 'email',
      placeholder: 'your.email@example.com',
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      },
      helpText: 'Use a professional email address, preferably with your name'
    }
  },

  {
    id: 'phone',
    type: 'question',
    position: { x: 100, y: 750 },
    data: {
      label: 'What is your phone number?',
      questionType: 'text',
      variableName: 'phone',
      placeholder: '+1 (555) 123-4567',
      validation: {
        required: true,
        pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$'
      },
      helpText: 'Include country code for international applications'
    }
  },

  {
    id: 'location',
    type: 'question',
    position: { x: 100, y: 750 },
    data: {
      label: 'Where are you located?',
      questionType: 'text',
      variableName: 'location',
      placeholder: 'City, Country (e.g., New York, USA)',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      helpText: 'City and country are sufficient for privacy'
    }
  },

  {
    id: 'linkedin',
    type: 'question',
    position: { x: 100, y: 750 },
    data: {
      label: 'What is your LinkedIn profile URL?',
      questionType: 'text',
      variableName: 'linkedin',
      placeholder: 'https://linkedin.com/in/yourname',
      validation: {
        required: false,
        pattern: '^https?://(www\\.)?linkedin\\.com/in/.*'
      },
      helpText: 'Optional but highly recommended for professional networking'
    }
  },

  {
    id: 'website',
    type: 'question',
    position: { x: 100, y: 750 },
    data: {
      label: 'Do you have a personal website or portfolio?',
      questionType: 'text',
      variableName: 'website',
      placeholder: 'https://yourname.com (optional)',
      validation: {
        required: false,
        pattern: '^https?://.*'
      },
      helpText: 'Include if you have a professional website or portfolio'
    }
  },

  // Professional Summary Section
  {
    id: 'current_title',
    type: 'question',
    position: { x: 300, y: 150 },
    data: {
      label: 'What is your current job title or target role?',
      questionType: 'text',
      variableName: 'currentTitle',
      placeholder: 'e.g., Senior Software Engineer, Marketing Manager',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      helpText: 'Your current position or the role you\'re targeting'
    }
  },

  {
    id: 'experience_years',
    type: 'question',
    position: { x: 300, y: 250 },
    data: {
      label: 'How many years of professional experience do you have?',
      questionType: 'select',
      variableName: 'experienceYears',
      options: [
        '0-1 years (Entry level)',
        '2-3 years (Junior)',
        '4-6 years (Mid-level)',
        '7-10 years (Senior)',
        '11-15 years (Lead)',
        '16+ years (Executive)'
      ],
      validation: {
        required: true
      },
      helpText: 'Total years of professional work experience'
    }
  },

  {
    id: 'professional_summary',
    type: 'question',
    position: { x: 300, y: 750 },
    data: {
      label: 'Describe yourself professionally in 2-3 sentences',
      questionType: 'textarea',
      variableName: 'professionalSummary',
      placeholder: 'I am a passionate software engineer with 5 years of experience in full-stack development...',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 500
      },
      helpText: 'Highlight your key strengths, experience, and what makes you unique'
    }
  },

  {
    id: 'top_strengths',
    type: 'question',
    position: { x: 300, y: 750 },
    data: {
      label: 'What are your top 3 professional strengths?',
      questionType: 'multiple',
      variableName: 'topStrengths',
      options: [
        'Leadership',
        'Problem Solving',
        'Communication',
        'Technical Skills',
        'Creativity',
        'Analytical Thinking',
        'Teamwork',
        'Project Management',
        'Customer Service',
        'Strategic Planning',
        'Innovation',
        'Adaptability'
      ],
      validation: {
        required: true,
        minSelections: 3,
        maxSelections: 3
      },
      helpText: 'Select your strongest professional qualities'
    }
  },

  // Work Experience Section
  {
    id: 'current_company',
    type: 'question',
    position: { x: 500, y: 150 },
    data: {
      label: 'What is your current company name?',
      questionType: 'text',
      variableName: 'currentCompany',
      placeholder: 'e.g., Google, Microsoft, ABC Corp',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      helpText: 'Your current employer or most recent company'
    }
  },

  {
    id: 'current_role_dates',
    type: 'question',
    position: { x: 500, y: 250 },
    data: {
      label: 'When did you start your current role?',
      questionType: 'text',
      variableName: 'currentRoleStartDate',
      placeholder: 'MM/YYYY (e.g., 01/2020)',
      validation: {
        required: true,
        pattern: '^(0[1-9]|1[0-2])/\\d{4}$'
      },
      helpText: 'Month and year when you started this position'
    }
  },

  {
    id: 'current_role_description',
    type: 'question',
    position: { x: 500, y: 750 },
    data: {
      label: 'Describe your current role and key responsibilities',
      questionType: 'textarea',
      variableName: 'currentRoleDescription',
      placeholder: 'List your main responsibilities and daily tasks...',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 1000
      },
      helpText: 'Focus on your main duties and responsibilities'
    }
  },

  {
    id: 'current_achievements',
    type: 'question',
    position: { x: 500, y: 750 },
    data: {
      label: 'What are your biggest achievements in this role?',
      questionType: 'textarea',
      variableName: 'currentAchievements',
      placeholder: 'Include quantifiable results and impact...',
      validation: {
        required: true,
        minLength: 30,
        maxLength: 800
      },
      helpText: 'Include specific metrics, improvements, or recognitions'
    }
  },

  {
    id: 'previous_experience',
    type: 'question',
    position: { x: 500, y: 750 },
    data: {
      label: 'Tell me about your previous work experience',
      questionType: 'textarea',
      variableName: 'previousExperience',
      placeholder: 'Describe your previous roles, companies, and key achievements...',
      validation: {
        required: false,
        maxLength: 1500
      },
      helpText: 'Include 2-3 most relevant previous positions with key achievements'
    }
  },

  // Skills Section
  {
    id: 'technical_skills',
    type: 'question',
    position: { x: 700, y: 150 },
    data: {
      label: 'What are your technical skills?',
      questionType: 'multiple',
      variableName: 'technicalSkills',
      options: [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
        'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django',
        'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure',
        'Docker', 'Kubernetes', 'Git', 'Linux', 'Machine Learning',
        'Data Science', 'DevOps', 'Mobile Development', 'UI/UX Design',
        'Project Management', 'Agile/Scrum', 'Salesforce', 'Microsoft Office'
      ],
      validation: {
        required: true,
        minSelections: 3
      },
      helpText: 'Select all relevant technical skills and tools'
    }
  },

  {
    id: 'soft_skills',
    type: 'question',
    position: { x: 700, y: 250 },
    data: {
      label: 'What are your strongest soft skills?',
      questionType: 'multiple',
      variableName: 'softSkills',
      options: [
        'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
        'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
        'Emotional Intelligence', 'Negotiation', 'Presentation Skills',
        'Customer Service', 'Mentoring', 'Strategic Planning', 'Innovation'
      ],
      validation: {
        required: true,
        minSelections: 3
      },
      helpText: 'Select your strongest interpersonal and professional skills'
    }
  },

  {
    id: 'languages',
    type: 'question',
    position: { x: 700, y: 750 },
    data: {
      label: 'What languages do you speak?',
      questionType: 'multiple',
      variableName: 'languages',
      options: [
        'English (Native)', 'English (Fluent)', 'English (Conversational)',
        'Spanish (Native)', 'Spanish (Fluent)', 'Spanish (Conversational)',
        'French (Native)', 'French (Fluent)', 'French (Conversational)',
        'German (Native)', 'German (Fluent)', 'German (Conversational)',
        'Chinese (Native)', 'Chinese (Fluent)', 'Chinese (Conversational)',
        'Portuguese (Native)', 'Portuguese (Fluent)', 'Portuguese (Conversational)',
        'Other'
      ],
      validation: {
        required: false
      },
      helpText: 'Include all languages with proficiency level'
    }
  },

  // Education Section
  {
    id: 'education_level',
    type: 'question',
    position: { x: 900, y: 150 },
    data: {
      label: 'What is your highest level of education?',
      questionType: 'select',
      variableName: 'educationLevel',
      options: [
        'High School Diploma',
        'Associate Degree',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'Doctorate (PhD)',
        'Professional Degree',
        'Other'
      ],
      validation: {
        required: true
      },
      helpText: 'Your highest completed level of education'
    }
  },

  {
    id: 'degree_field',
    type: 'question',
    position: { x: 900, y: 250 },
    data: {
      label: 'What did you study?',
      questionType: 'text',
      variableName: 'degreeField',
      placeholder: 'e.g., Computer Science, Business Administration, Marketing',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      helpText: 'Your field of study or major'
    }
  },

  {
    id: 'university',
    type: 'question',
    position: { x: 900, y: 750 },
    data: {
      label: 'Which university or institution?',
      questionType: 'text',
      variableName: 'university',
      placeholder: 'e.g., Stanford University, MIT, University of California',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      helpText: 'Name of your educational institution'
    }
  },

  {
    id: 'graduation_year',
    type: 'question',
    position: { x: 900, y: 750 },
    data: {
      label: 'When did you graduate?',
      questionType: 'text',
      variableName: 'graduationYear',
      placeholder: 'YYYY (e.g., 2020)',
      validation: {
        required: true,
        pattern: '^\\d{4}$'
      },
      helpText: 'Year of graduation or expected graduation'
    }
  },

  {
    id: 'gpa',
    type: 'question',
    position: { x: 900, y: 750 },
    data: {
      label: 'What was your GPA? (Optional)',
      questionType: 'text',
      variableName: 'gpa',
      placeholder: '3.8/4.0 or 3.8',
      validation: {
        required: false,
        pattern: '^[0-4](\\.\\d{1,2})?$'
      },
      helpText: 'Only include if above 3.5 or you\'re a recent graduate'
    }
  },

  // Additional Information
  {
    id: 'certifications',
    type: 'question',
    position: { x: 1100, y: 150 },
    data: {
      label: 'Do you have any professional certifications?',
      questionType: 'textarea',
      variableName: 'certifications',
      placeholder: 'List any relevant certifications, licenses, or professional qualifications...',
      validation: {
        required: false,
        maxLength: 500
      },
      helpText: 'Include certifications that are relevant to your field'
    }
  },

  {
    id: 'projects',
    type: 'question',
    position: { x: 1100, y: 250 },
    data: {
      label: 'Tell me about any notable projects you\'ve worked on',
      questionType: 'textarea',
      variableName: 'projects',
      placeholder: 'Describe key projects, your role, technologies used, and outcomes...',
      validation: {
        required: false,
        maxLength: 800
      },
      helpText: 'Include projects that showcase your skills and achievements'
    }
  },

  {
    id: 'interests',
    type: 'question',
    position: { x: 1100, y: 750 },
    data: {
      label: 'What are your professional interests or hobbies?',
      questionType: 'textarea',
      variableName: 'interests',
      placeholder: 'Include interests that are relevant to your professional development...',
      validation: {
        required: false,
        maxLength: 300
      },
      helpText: 'Keep it professional and relevant to your career'
    }
  },

  // Completion
  {
    id: 'completion',
    type: 'message',
    position: { x: 1100, y: 750 },
    data: {
      label: 'CV Creation Complete!',
      content: 'Excellent! I\'ve gathered all the essential information for your professional CV. Your CV will be generated with all the details you\'ve provided.',
      messageType: 'completion'
    }
  }
];

export const BASIC_CV_FLOW_EDGES: FlowEdge[] = [
  // Start flow
  { id: 'start_to_intro', source: 'start', target: 'intro' },
  
  // Introduction flow
  { id: 'intro_to_name', source: 'intro', target: 'full_name' },
  
  // Personal information flow
  { id: 'name_to_preferred', source: 'full_name', target: 'preferred_name' },
  { id: 'preferred_to_email', source: 'preferred_name', target: 'email' },
  { id: 'email_to_phone', source: 'email', target: 'phone' },
  { id: 'phone_to_location', source: 'phone', target: 'location' },
  { id: 'location_to_linkedin', source: 'location', target: 'linkedin' },
  { id: 'linkedin_to_website', source: 'linkedin', target: 'website' },
  
  // Professional summary flow
  { id: 'website_to_title', source: 'website', target: 'current_title' },
  { id: 'title_to_experience', source: 'current_title', target: 'experience_years' },
  { id: 'experience_to_summary', source: 'experience_years', target: 'professional_summary' },
  { id: 'summary_to_strengths', source: 'professional_summary', target: 'top_strengths' },
  
  // Work experience flow
  { id: 'strengths_to_company', source: 'top_strengths', target: 'current_company' },
  { id: 'company_to_dates', source: 'current_company', target: 'current_role_dates' },
  { id: 'dates_to_description', source: 'current_role_dates', target: 'current_role_description' },
  { id: 'description_to_achievements', source: 'current_role_description', target: 'current_achievements' },
  { id: 'achievements_to_previous', source: 'current_achievements', target: 'previous_experience' },
  
  // Skills flow
  { id: 'previous_to_technical', source: 'previous_experience', target: 'technical_skills' },
  { id: 'technical_to_soft', source: 'technical_skills', target: 'soft_skills' },
  { id: 'soft_to_languages', source: 'soft_skills', target: 'languages' },
  
  // Education flow
  { id: 'languages_to_education', source: 'languages', target: 'education_level' },
  { id: 'education_to_field', source: 'education_level', target: 'degree_field' },
  { id: 'field_to_university', source: 'degree_field', target: 'university' },
  { id: 'university_to_graduation', source: 'university', target: 'graduation_year' },
  { id: 'graduation_to_gpa', source: 'graduation_year', target: 'gpa' },
  
  // Additional information flow
  { id: 'gpa_to_certifications', source: 'gpa', target: 'certifications' },
  { id: 'certifications_to_projects', source: 'certifications', target: 'projects' },
  { id: 'projects_to_interests', source: 'projects', target: 'interests' },
  { id: 'interests_to_completion', source: 'interests', target: 'completion' }
];

export const BASIC_CV_FLOW = {
  id: 'basic_cv_flow',
  name: 'Basic CV Builder Flow',
  description: 'Complete basic CV builder flow with essential questions for quick CV creation',
  version: '1.0.0',
  nodes: BASIC_CV_FLOW_NODES,
  edges: BASIC_CV_FLOW_EDGES,
  variables: [],
  settings: {
    timeout: 30000,
    retryAttempts: 3,
    enableLogging: true,
    enableAnalytics: true
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: {
    createdBy: 'System',
    estimatedTime: '10-15 minutes',
    questionCount: BASIC_CV_FLOW_NODES.filter(n => n.type === 'question').length,
    targetAudience: 'All professionals',
    industryScope: 'Universal'
  }
};

export default BASIC_CV_FLOW;
