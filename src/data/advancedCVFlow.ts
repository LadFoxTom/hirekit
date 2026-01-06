// @ts-nocheck
/**
 * Advanced CV Builder Flow - Comprehensive Professional CV Creation
 * 
 * Complete advanced flow for creating detailed, industry-specific CVs
 * with conditional logic, detailed sections, and professional optimization
 */

import { FlowNode, FlowEdge } from '@/types/flow';

export const ADVANCED_CV_FLOW_NODES: FlowNode[] = [
  // Start Node
  {
    id: 'start',
    type: 'start',
    position: { x: 100, y: 50 },
    data: {
      label: 'Start',
      description: 'Advanced CV Builder Flow begins here'
    }
  },
  
  // Introduction
  {
    id: 'intro',
    type: 'message',
    position: { x: 100, y: 150 },
    data: {
      label: 'Welcome to Advanced CV Builder',
      content: 'Welcome to our Advanced CV Builder! I\'ll help you create a comprehensive, professional CV that stands out. This process will take about 20-30 minutes and will gather detailed information to create a powerful CV.',
      messageType: 'welcome'
    }
  },

  // Industry and Role Selection
  {
    id: 'industry',
    type: 'question',
    position: { x: 100, y: 1050 },
    data: {
      label: 'What industry are you in or targeting?',
      questionType: 'select',
      variableName: 'industry',
      options: [
        'Technology/Software',
        'Finance/Banking',
        'Healthcare/Medical',
        'Marketing/Advertising',
        'Education/Academia',
        'Consulting',
        'Manufacturing',
        'Retail/E-commerce',
        'Non-profit',
        'Government/Public Sector',
        'Legal',
        'Real Estate',
        'Media/Entertainment',
        'Engineering',
        'Sales/Business Development',
        'Human Resources',
        'Operations/Supply Chain',
        'Research/Science',
        'Creative/Design',
        'Other'
      ],
      validation: {
        required: true
      },
      helpText: 'This helps us customize questions and suggestions for your industry'
    }
  },

  {
    id: 'career_level',
    type: 'question',
    position: { x: 100, y: 1050 },
    data: {
      label: 'What is your career level?',
      questionType: 'select',
      variableName: 'careerLevel',
      options: [
        'Entry Level (0-2 years)',
        'Junior (2-4 years)',
        'Mid-Level (4-8 years)',
        'Senior (8-12 years)',
        'Lead/Principal (12-15 years)',
        'Executive/Director (15+ years)',
        'C-Level/VP (15+ years)'
      ],
      validation: {
        required: true
      },
      helpText: 'This determines the depth and focus of questions'
    }
  },

  {
    id: 'target_role',
    type: 'question',
    position: { x: 100, y: 1050 },
    data: {
      label: 'What is your target role or current position?',
      questionType: 'text',
      variableName: 'targetRole',
      placeholder: 'e.g., Senior Software Engineer, Marketing Director, Data Scientist',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      helpText: 'Be specific about the role you want or currently have'
    }
  },

  // Personal Information Section
  {
    id: 'full_name',
    type: 'question',
    position: { x: 300, y: 150 },
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
    position: { x: 300, y: 1050 },
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
    position: { x: 300, y: 1050 },
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
    position: { x: 300, y: 1050 },
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
    position: { x: 300, y: 1050 },
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
    position: { x: 300, y: 1050 },
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
    position: { x: 300, y: 1050 },
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

  {
    id: 'github',
    type: 'question',
    position: { x: 300, y: 1050 },
    data: {
      label: 'Do you have a GitHub profile? (For technical roles)',
      questionType: 'text',
      variableName: 'github',
      placeholder: 'https://github.com/yourname (optional)',
      validation: {
        required: false,
        pattern: '^https?://(www\\.)?github\\.com/.*'
      },
      helpText: 'Include if you have a GitHub profile with relevant projects'
    }
  },

  // Professional Summary Section
  {
    id: 'experience_years',
    type: 'question',
    position: { x: 500, y: 150 },
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
    position: { x: 500, y: 1050 },
    data: {
      label: 'Write a compelling professional summary (3-4 sentences)',
      questionType: 'textarea',
      variableName: 'professionalSummary',
      placeholder: 'I am a passionate software engineer with 5 years of experience in full-stack development...',
      validation: {
        required: true,
        minLength: 100,
        maxLength: 600
      },
      helpText: 'Highlight your key strengths, experience, and what makes you unique. This is your elevator pitch.'
    }
  },

  {
    id: 'key_achievements',
    type: 'question',
    position: { x: 500, y: 1050 },
    data: {
      label: 'What are your top 3 career achievements?',
      questionType: 'textarea',
      variableName: 'keyAchievements',
      placeholder: 'List your most significant professional accomplishments with quantifiable results...',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 800
      },
      helpText: 'Include specific metrics, improvements, or recognitions that demonstrate your impact'
    }
  },

  {
    id: 'career_objectives',
    type: 'question',
    position: { x: 500, y: 1050 },
    data: {
      label: 'What are your career objectives?',
      questionType: 'textarea',
      variableName: 'careerObjectives',
      placeholder: 'Describe your short-term and long-term career goals...',
      validation: {
        required: false,
        maxLength: 400
      },
      helpText: 'Optional: Share your career aspirations and goals'
    }
  },

  // Detailed Work Experience Section
  {
    id: 'current_company',
    type: 'question',
    position: { x: 700, y: 150 },
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
    id: 'company_industry',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'What industry is your current company in?',
      questionType: 'text',
      variableName: 'companyIndustry',
      placeholder: 'e.g., Technology, Finance, Healthcare',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      helpText: 'The industry sector of your current company'
    }
  },

  {
    id: 'company_size',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'What is the size of your current company?',
      questionType: 'select',
      variableName: 'companySize',
      options: [
        'Startup (1-10 employees)',
        'Small (11-50 employees)',
        'Medium (51-200 employees)',
        'Large (201-1000 employees)',
        'Enterprise (1000+ employees)',
        'Fortune 500',
        'Government/Public Sector'
      ],
      validation: {
        required: true
      },
      helpText: 'Company size helps provide context for your experience'
    }
  },

  {
    id: 'current_role_dates',
    type: 'question',
    position: { x: 700, y: 1050 },
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
    id: 'current_role_type',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'What type of employment is this?',
      questionType: 'select',
      variableName: 'currentRoleType',
      options: [
        'Full-time',
        'Part-time',
        'Contract',
        'Freelance',
        'Internship',
        'Consulting',
        'Remote',
        'Hybrid'
      ],
      validation: {
        required: true
      },
      helpText: 'Type of employment arrangement'
    }
  },

  {
    id: 'current_role_location',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'Where is this role located?',
      questionType: 'text',
      variableName: 'currentRoleLocation',
      placeholder: 'City, Country (e.g., San Francisco, CA)',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 100
      },
      helpText: 'Location of your current role'
    }
  },

  {
    id: 'current_role_description',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'Describe your current role and key responsibilities',
      questionType: 'textarea',
      variableName: 'currentRoleDescription',
      placeholder: 'List your main responsibilities and daily tasks...',
      validation: {
        required: true,
        minLength: 100,
        maxLength: 1200
      },
      helpText: 'Provide detailed description of your current role and responsibilities'
    }
  },

  {
    id: 'current_achievements',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'What are your biggest achievements in this role?',
      questionType: 'textarea',
      variableName: 'currentAchievements',
      placeholder: 'Include quantifiable results, improvements, and impact...',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 1000
      },
      helpText: 'Include specific metrics, improvements, or recognitions with numbers when possible'
    }
  },

  {
    id: 'team_management',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'Do you manage a team? If so, how large?',
      questionType: 'text',
      variableName: 'teamManagement',
      placeholder: 'e.g., 5 direct reports, 12-person cross-functional team, or N/A',
      validation: {
        required: false,
        maxLength: 100
      },
      helpText: 'Include team size and management responsibilities if applicable'
    }
  },

  {
    id: 'budget_responsibility',
    type: 'question',
    position: { x: 700, y: 1050 },
    data: {
      label: 'Do you have budget responsibility? If so, what amount?',
      questionType: 'text',
      variableName: 'budgetResponsibility',
      placeholder: 'e.g., $500K annual budget, $2M project budget, or N/A',
      validation: {
        required: false,
        maxLength: 100
      },
      helpText: 'Include budget amounts and scope of financial responsibility'
    }
  },

  // Previous Experience Section
  {
    id: 'previous_positions',
    type: 'question',
    position: { x: 900, y: 150 },
    data: {
      label: 'Tell me about your previous work experience',
      questionType: 'textarea',
      variableName: 'previousPositions',
      placeholder: 'Describe your 2-3 most relevant previous positions with companies, roles, dates, and key achievements...',
      validation: {
        required: true,
        minLength: 100,
        maxLength: 2000
      },
      helpText: 'Include 2-3 most relevant previous positions with key achievements and quantifiable results'
    }
  },

  {
    id: 'career_progression',
    type: 'question',
    position: { x: 900, y: 1050 },
    data: {
      label: 'Describe your career progression and growth',
      questionType: 'textarea',
      variableName: 'careerProgression',
      placeholder: 'How have you grown in your career? Include promotions, role changes, and skill development...',
      validation: {
        required: false,
        maxLength: 800
      },
      helpText: 'Highlight your career growth, promotions, and professional development'
    }
  },

  {
    id: 'leadership_experience',
    type: 'question',
    position: { x: 900, y: 1050 },
    data: {
      label: 'Describe your leadership experience',
      questionType: 'textarea',
      variableName: 'leadershipExperience',
      placeholder: 'Include any leadership roles, mentoring, project leadership, or team building experience...',
      validation: {
        required: false,
        maxLength: 800
      },
      helpText: 'Highlight leadership roles, mentoring, and team building experience'
    }
  },

  // Skills Section
  {
    id: 'technical_skills',
    type: 'question',
    position: { x: 1100, y: 150 },
    data: {
      label: 'What are your technical skills?',
      questionType: 'multiple',
      variableName: 'technicalSkills',
      options: [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript',
        'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
        'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP',
        'Docker', 'Kubernetes', 'Git', 'Linux', 'Machine Learning', 'AI',
        'Data Science', 'DevOps', 'Mobile Development', 'UI/UX Design',
        'Project Management', 'Agile/Scrum', 'Salesforce', 'Microsoft Office',
        'Tableau', 'Power BI', 'SQL', 'NoSQL', 'GraphQL', 'REST APIs',
        'Microservices', 'CI/CD', 'Terraform', 'Jenkins', 'GitLab'
      ],
      validation: {
        required: true,
        minSelections: 5
      },
      helpText: 'Select all relevant technical skills and tools you use professionally'
    }
  },

  {
    id: 'skill_proficiency',
    type: 'question',
    position: { x: 1100, y: 1050 },
    data: {
      label: 'Rate your proficiency in your top 5 technical skills',
      questionType: 'textarea',
      variableName: 'skillProficiency',
      placeholder: 'List your top 5 skills with proficiency level (Beginner, Intermediate, Advanced, Expert)...',
      validation: {
        required: true,
        minLength: 50,
        maxLength: 500
      },
      helpText: 'Be honest about your skill levels - this helps employers understand your expertise'
    }
  },

  {
    id: 'soft_skills',
    type: 'question',
    position: { x: 1100, y: 1050 },
    data: {
      label: 'What are your strongest soft skills?',
      questionType: 'multiple',
      variableName: 'softSkills',
      options: [
        'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
        'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
        'Emotional Intelligence', 'Negotiation', 'Presentation Skills',
        'Customer Service', 'Mentoring', 'Strategic Planning', 'Innovation',
        'Conflict Resolution', 'Decision Making', 'Public Speaking',
        'Cross-cultural Communication', 'Change Management', 'Risk Management'
      ],
      validation: {
        required: true,
        minSelections: 5
      },
      helpText: 'Select your strongest interpersonal and professional skills'
    }
  },

  {
    id: 'languages',
    type: 'question',
    position: { x: 1100, y: 1050 },
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
        'Japanese (Native)', 'Japanese (Fluent)', 'Japanese (Conversational)',
        'Korean (Native)', 'Korean (Fluent)', 'Korean (Conversational)',
        'Arabic (Native)', 'Arabic (Fluent)', 'Arabic (Conversational)',
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
    position: { x: 1300, y: 150 },
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
        'Professional Degree (JD, MD, etc.)',
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
    position: { x: 1300, y: 1050 },
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
    position: { x: 1300, y: 1050 },
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
    position: { x: 1300, y: 1050 },
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
    position: { x: 1300, y: 1050 },
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

  {
    id: 'academic_achievements',
    type: 'question',
    position: { x: 1300, y: 1050 },
    data: {
      label: 'Any academic achievements or honors?',
      questionType: 'textarea',
      variableName: 'academicAchievements',
      placeholder: 'Include honors, awards, scholarships, dean\'s list, etc...',
      validation: {
        required: false,
        maxLength: 400
      },
      helpText: 'Include academic honors, awards, or distinctions'
    }
  },

  {
    id: 'relevant_coursework',
    type: 'question',
    position: { x: 1300, y: 1050 },
    data: {
      label: 'Relevant coursework (for recent graduates)',
      questionType: 'textarea',
      variableName: 'relevantCoursework',
      placeholder: 'List relevant courses that apply to your target role...',
      validation: {
        required: false,
        maxLength: 300
      },
      helpText: 'Include relevant courses if you\'re a recent graduate'
    }
  },

  // Additional Sections
  {
    id: 'certifications',
    type: 'question',
    position: { x: 1500, y: 150 },
    data: {
      label: 'Professional certifications and licenses',
      questionType: 'textarea',
      variableName: 'certifications',
      placeholder: 'List all relevant certifications, licenses, and professional qualifications with dates...',
      validation: {
        required: false,
        maxLength: 800
      },
      helpText: 'Include certifications that are relevant to your field with completion dates'
    }
  },

  {
    id: 'projects',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Notable projects and portfolio work',
      questionType: 'textarea',
      variableName: 'projects',
      placeholder: 'Describe key projects, your role, technologies used, challenges overcome, and outcomes...',
      validation: {
        required: false,
        maxLength: 1200
      },
      helpText: 'Include projects that showcase your skills, problem-solving abilities, and achievements'
    }
  },

  {
    id: 'publications',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Publications, research, or thought leadership',
      questionType: 'textarea',
      variableName: 'publications',
      placeholder: 'Include any publications, research papers, articles, or thought leadership content...',
      validation: {
        required: false,
        maxLength: 600
      },
      helpText: 'Include if you have published work, research, or thought leadership content'
    }
  },

  {
    id: 'awards',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Awards and recognitions',
      questionType: 'textarea',
      variableName: 'awards',
      placeholder: 'List any professional awards, recognitions, or honors received...',
      validation: {
        required: false,
        maxLength: 500
      },
      helpText: 'Include professional awards, recognitions, or honors'
    }
  },

  {
    id: 'volunteer',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Volunteer experience and community involvement',
      questionType: 'textarea',
      variableName: 'volunteerExperience',
      placeholder: 'Include relevant volunteer work, community involvement, or pro bono projects...',
      validation: {
        required: false,
        maxLength: 600
      },
      helpText: 'Include volunteer work that demonstrates leadership, skills, or values'
    }
  },

  {
    id: 'professional_associations',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Professional associations and memberships',
      questionType: 'textarea',
      variableName: 'professionalAssociations',
      placeholder: 'List professional organizations, memberships, and any leadership roles...',
      validation: {
        required: false,
        maxLength: 400
      },
      helpText: 'Include professional organizations and any leadership roles within them'
    }
  },

  {
    id: 'interests',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Professional interests and hobbies',
      questionType: 'textarea',
      variableName: 'interests',
      placeholder: 'Include interests that are relevant to your professional development or demonstrate skills...',
      validation: {
        required: false,
        maxLength: 400
      },
      helpText: 'Keep it professional and relevant to your career development'
    }
  },

  {
    id: 'references',
    type: 'question',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'References availability',
      questionType: 'select',
      variableName: 'references',
      options: [
        'Available upon request',
        'Available immediately',
        'Will provide upon interview',
        'Not available'
      ],
      validation: {
        required: true
      },
      helpText: 'Indicate your reference availability'
    }
  },

  // Completion
  {
    id: 'completion',
    type: 'message',
    position: { x: 1500, y: 1050 },
    data: {
      label: 'Advanced CV Creation Complete!',
      content: 'Excellent! I\'ve gathered comprehensive information for your professional CV. Your advanced CV will be generated with all the detailed information you\'ve provided, optimized for your industry and career level.',
      messageType: 'completion'
    }
  }
];

export const ADVANCED_CV_FLOW_EDGES: FlowEdge[] = [
  // Start flow
  { id: 'start_to_intro', source: 'start', target: 'intro' },
  
  // Introduction flow
  { id: 'intro_to_industry', source: 'intro', target: 'industry' },
  
  // Industry and role selection
  { id: 'industry_to_career_level', source: 'industry', target: 'career_level' },
  { id: 'career_level_to_target_role', source: 'career_level', target: 'target_role' },
  
  // Personal information flow
  { id: 'target_role_to_name', source: 'target_role', target: 'full_name' },
  { id: 'name_to_preferred', source: 'full_name', target: 'preferred_name' },
  { id: 'preferred_to_email', source: 'preferred_name', target: 'email' },
  { id: 'email_to_phone', source: 'email', target: 'phone' },
  { id: 'phone_to_location', source: 'phone', target: 'location' },
  { id: 'location_to_linkedin', source: 'location', target: 'linkedin' },
  { id: 'linkedin_to_website', source: 'linkedin', target: 'website' },
  { id: 'website_to_github', source: 'website', target: 'github' },
  
  // Professional summary flow
  { id: 'github_to_experience', source: 'github', target: 'experience_years' },
  { id: 'experience_to_summary', source: 'experience_years', target: 'professional_summary' },
  { id: 'summary_to_achievements', source: 'professional_summary', target: 'key_achievements' },
  { id: 'achievements_to_objectives', source: 'key_achievements', target: 'career_objectives' },
  
  // Detailed work experience flow
  { id: 'objectives_to_company', source: 'career_objectives', target: 'current_company' },
  { id: 'company_to_industry', source: 'current_company', target: 'company_industry' },
  { id: 'industry_to_size', source: 'company_industry', target: 'company_size' },
  { id: 'size_to_dates', source: 'company_size', target: 'current_role_dates' },
  { id: 'dates_to_type', source: 'current_role_dates', target: 'current_role_type' },
  { id: 'type_to_location', source: 'current_role_type', target: 'current_role_location' },
  { id: 'location_to_description', source: 'current_role_location', target: 'current_role_description' },
  { id: 'description_to_achievements', source: 'current_role_description', target: 'current_achievements' },
  { id: 'achievements_to_team', source: 'current_achievements', target: 'team_management' },
  { id: 'team_to_budget', source: 'team_management', target: 'budget_responsibility' },
  
  // Previous experience flow
  { id: 'budget_to_previous', source: 'budget_responsibility', target: 'previous_positions' },
  { id: 'previous_to_progression', source: 'previous_positions', target: 'career_progression' },
  { id: 'progression_to_leadership', source: 'career_progression', target: 'leadership_experience' },
  
  // Skills flow
  { id: 'leadership_to_technical', source: 'leadership_experience', target: 'technical_skills' },
  { id: 'technical_to_proficiency', source: 'technical_skills', target: 'skill_proficiency' },
  { id: 'proficiency_to_soft', source: 'skill_proficiency', target: 'soft_skills' },
  { id: 'soft_to_languages', source: 'soft_skills', target: 'languages' },
  
  // Education flow
  { id: 'languages_to_education', source: 'languages', target: 'education_level' },
  { id: 'education_to_field', source: 'education_level', target: 'degree_field' },
  { id: 'field_to_university', source: 'degree_field', target: 'university' },
  { id: 'university_to_graduation', source: 'university', target: 'graduation_year' },
  { id: 'graduation_to_gpa', source: 'graduation_year', target: 'gpa' },
  { id: 'gpa_to_achievements', source: 'gpa', target: 'academic_achievements' },
  { id: 'achievements_to_coursework', source: 'academic_achievements', target: 'relevant_coursework' },
  
  // Additional sections flow
  { id: 'coursework_to_certifications', source: 'relevant_coursework', target: 'certifications' },
  { id: 'certifications_to_projects', source: 'certifications', target: 'projects' },
  { id: 'projects_to_publications', source: 'projects', target: 'publications' },
  { id: 'publications_to_awards', source: 'publications', target: 'awards' },
  { id: 'awards_to_volunteer', source: 'awards', target: 'volunteer' },
  { id: 'volunteer_to_associations', source: 'volunteer', target: 'professional_associations' },
  { id: 'associations_to_interests', source: 'professional_associations', target: 'interests' },
  { id: 'interests_to_references', source: 'interests', target: 'references' },
  { id: 'references_to_completion', source: 'references', target: 'completion' }
];

export const ADVANCED_CV_FLOW = {
  id: 'advanced_cv_flow',
  name: 'Advanced CV Builder Flow',
  description: 'Comprehensive advanced CV builder flow with detailed questions, conditional branching, and optimization features',
  version: '1.0.0',
  nodes: ADVANCED_CV_FLOW_NODES,
  edges: ADVANCED_CV_FLOW_EDGES,
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
    estimatedTime: '20-30 minutes',
    questionCount: ADVANCED_CV_FLOW_NODES.filter(n => n.type === 'question').length,
    targetAudience: 'Experienced professionals',
    industryScope: 'All industries with customization'
  }
};

export default ADVANCED_CV_FLOW;
