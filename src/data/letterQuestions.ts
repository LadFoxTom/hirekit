import { LetterQuestion } from '@/types/letter'

export const LETTER_QUESTIONS: LetterQuestion[] = [
  {
    id: 'welcome',
    textKey: 'letter_builder.new_flow.welcome',
    type: 'text'
  },
  {
    id: 'job_description',
    textKey: 'letter_builder.new_flow.job_description',
    type: 'textarea',
    required: true,
    placeholder: 'Paste the job description here...'
  },
  {
    id: 'analyze_job',
    textKey: 'letter_builder.new_flow.analyze_job',
    type: 'select',
    options: ['yes', 'no'],
    optionsLabels: {
      yes: 'Yes, analyze the job description',
      no: 'No, I\'ll provide my own information'
    }
  },
  {
    id: 'optimization_areas',
    textKey: 'letter_builder.new_flow.optimization_areas',
    type: 'multiselect',
    options: ['experience_match', 'skills_highlight', 'achievements', 'company_research', 'culture_fit', 'career_goals'],
    optionsLabels: {
      experience_match: 'Match my experience to job requirements',
      skills_highlight: 'Highlight relevant skills',
      achievements: 'Showcase my achievements',
      company_research: 'Include company research',
      culture_fit: 'Demonstrate culture fit',
      career_goals: 'Align with career goals'
    }
  },
  {
    id: 'personal_info',
    textKey: 'letter_builder.new_flow.personal_info',
    type: 'text'
  },
  {
    id: 'sender_name',
    textKey: 'letter_builder.new_flow.sender_name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Alex Johnson'
  },
  {
    id: 'sender_title',
    textKey: 'letter_builder.new_flow.sender_title',
    type: 'text',
    placeholder: 'e.g., Software Developer'
  },
  {
    id: 'sender_email',
    textKey: 'letter_builder.new_flow.sender_email',
    type: 'text',
    required: true,
    placeholder: 'e.g., alex.johnson@email.com'
  },
  {
    id: 'sender_phone',
    textKey: 'letter_builder.new_flow.sender_phone',
    type: 'text',
    placeholder: 'e.g., +1 (555) 123-4567'
  },
  {
    id: 'tone_preference',
    textKey: 'letter_builder.new_flow.tone_preference',
    type: 'select',
    options: ['professional', 'enthusiastic', 'confident', 'humble', 'assertive']
  },
  {
    id: 'letter_length',
    textKey: 'letter_builder.new_flow.letter_length',
    type: 'select',
    options: ['concise', 'standard', 'detailed']
  },
  {
    id: 'generate_letter',
    textKey: 'letter_builder.new_flow.generate_letter',
    type: 'text'
  }
] 