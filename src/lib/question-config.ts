import { CV_QUESTIONS } from '@/types/questions';
import { SIMPLIFIED_CV_QUESTIONS } from '@/types/questions-simplified';

export interface QuestionConfig {
  id: string;
  section: string;
  textKey: string;
  enabled: boolean;
  order: number;
  optional?: boolean;
  phase?: 'basic' | 'advanced' | 'optimization';
  required?: boolean;
  // Content fields for actual question text
  text?: string;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: string[];
}

export interface QuestionConfiguration {
  id: string;
  name: string;
  description?: string;
  type: 'advanced' | 'simplified';
  questions: QuestionConfig[];
  isActive: boolean;
  isDefault: boolean;
  version: number;
}

// Fallback to default questions if database is not available
export function getDefaultQuestions(type: 'advanced' | 'simplified') {
  if (type === 'advanced') {
    return CV_QUESTIONS.map((q, index) => ({
      id: q.id,
      section: q.section,
      textKey: q.textKey,
      enabled: true,
      order: index,
      optional: q.optional,
      phase: q.phase,
      // Include actual question text from translations
      text: getQuestionText(q.textKey),
      placeholder: getQuestionPlaceholder(q.id),
      helpText: getQuestionHelpText(q.id),
    }));
  } else {
    return SIMPLIFIED_CV_QUESTIONS.map((q, index) => ({
      id: q.id,
      section: q.section,
      textKey: q.textKey,
      enabled: true,
      order: index,
      required: q.required,
      // Include actual question text from translations
      text: getQuestionText(q.textKey),
      placeholder: getQuestionPlaceholder(q.id),
      helpText: getQuestionHelpText(q.id),
    }));
  }
}

// Helper function to get question text from translations
function getQuestionText(textKey: string): string {
  const questionTexts: { [key: string]: string } = {
    'intro.welcome': 'Welcome! I\'ll help you create a professional CV. Let\'s start with some basic information.',
    'question.fullName': 'What\'s your full name?',
    'question.email': 'What\'s your email address?',
    'question.phone': 'What\'s your phone number? (optional)',
    'question.location': 'Where are you located? (city, country)',
    'question.summary_enhanced': 'Write a 3-4 line professional summary that highlights your experience, key skills, and career goals. Think of this as your elevator pitch.',
    'question.experience_intro_enhanced': 'Let\'s add your work experience. I\'ll guide you through each position step by step.',
    'question.experience_company': 'Company name:',
    'question.experience_title': 'Your job title at [Company]:',
    'question.experience_type': 'Employment type: (Full-time, Part-time, Contract, Internship, Freelance)',
    'question.experience_location': 'Location: (City, Remote, Hybrid) (optional)',
    'question.experience_current': 'Is this your current position? (This affects how we handle dates)',
    'question.experience_dates_enhanced': 'When did you start and end this position? (e.g., January 2020 - Present, or specific dates)',
    'question.experience_achievements': 'Describe 3-5 key achievements in this role. Use numbers and impact where possible (e.g., \'Increased sales by 25%\', \'Led team of 10 developers\')',
    'question.experience_more': 'Would you like to add another work experience? (optional)',
    'question.education_intro_enhanced': 'Now let\'s add your education. What\'s your highest level of education?',
    'question.education_institution': 'Institution name:',
    'question.education_degree': 'Degree type: (Bachelor\'s, Master\'s, PhD, etc.)',
    'question.education_field': 'Field of study:',
    'question.education_dates_enhanced': 'When did you start and complete this education? (e.g., 2016 - 2020)',
    'question.education_achievements': 'What were your key achievements? (GPA, honors, relevant coursework, thesis topic) (optional)',
    'question.education_more': 'Would you like to add another education entry? (optional)',
    'question.skills_intro': 'Let\'s organize your skills into categories for better presentation.',
    'question.technical_skills': 'What are your technical skills? (Programming languages, software, technical competencies)',
    'question.soft_skills': 'What are your soft skills? (Leadership, communication, problem-solving, teamwork)',
    'question.tools_software': 'What tools and software are you proficient with? (optional)',
    'question.industry_knowledge': 'What industry-specific knowledge do you have? (optional)',
    'question.languages_enhanced': 'What languages do you speak? Include proficiency levels (e.g., \'English - Native\', \'Spanish - Fluent\', \'French - Intermediate\') (optional)',
    'question.certifications_enhanced': 'Do you have any professional certifications or licenses? Include issuing organization and date (optional)',
    'question.projects_enhanced': 'Have you worked on any notable projects? Include technologies used and outcomes (optional)',
    'question.volunteer_work': 'Do you have any volunteer experience? Include organization, role, and impact (optional)',
    'question.awards_recognition': 'Have you received any awards or recognition? Include organization and year (optional)',
    'question.professional_memberships': 'Are you a member of any professional associations or organizations? (optional)',
    'question.publications_research': 'Do you have any publications, research papers, or presentations? Include citations (optional)',
    'question.references': 'Do you have professional references available upon request? (optional)',
    'question.hobbies_enhanced': 'List 2-3 hobbies or interests that demonstrate transferable skills or cultural fit (optional)',
    'question.template_preference_enhanced': 'Do you have a preference for the CV template style? (Modern, Classic, Creative, Minimal) (optional)',
    'question.quality_review': 'Would you like me to review this section for common mistakes and suggest improvements? (optional)',
    // Simplified questions
    'question.summary_simple': 'Write a brief professional summary (2-3 sentences) about your experience and career goals:',
    'question.experience_intro_simple': 'Let\'s add your work experience. What\'s your most recent job title?',
    'question.education_intro_simple': 'What\'s your highest level of education? (e.g., High School, Bachelor\'s, Master\'s, PhD)',
    'question.skills_intro_simple': 'What are your key skills? (e.g., JavaScript, Project Management, Leadership, Communication)',
    'question.languages_intro_simple': 'What languages do you speak? (e.g., English, Dutch, Spanish, French)',
  };
  
  return questionTexts[textKey] || `Question: ${textKey}`;
}

// Helper function to get placeholder text
function getQuestionPlaceholder(questionId: string): string {
  const placeholders: { [key: string]: string } = {
    'fullName': 'John Doe',
    'email': 'john.doe@email.com',
    'phone': '+1 (555) 123-4567',
    'location': 'New York, USA',
    'experience_company': 'Acme Corporation',
    'experience_title': 'Software Engineer',
    'education_institution': 'University of Technology',
    'education_degree': 'Bachelor of Science',
    'education_field': 'Computer Science',
  };
  
  return placeholders[questionId] || '';
}

// Helper function to get help text
function getQuestionHelpText(questionId: string): string {
  const helpTexts: { [key: string]: string } = {
    'fullName': 'Enter your full legal name as it should appear on your CV',
    'email': 'Use a professional email address',
    'phone': 'Include country code if applying internationally',
    'location': 'City and country are sufficient for most applications',
    'summary_enhanced': 'Focus on your key strengths and what makes you unique',
    'experience_achievements': 'Use specific numbers and metrics when possible',
    'technical_skills': 'List programming languages, frameworks, and tools you\'re proficient with',
    'soft_skills': 'Include leadership, communication, and problem-solving abilities',
  };
  
  return helpTexts[questionId] || '';
}

// Load questions from database configuration
export async function loadQuestionConfiguration(type: 'advanced' | 'simplified'): Promise<QuestionConfig[]> {
  try {
    const response = await fetch(`/api/questions/active?type=${type}`);
    
    if (response.ok) {
      const config = await response.json();
      return config.questions.filter((q: QuestionConfig) => q.enabled);
    } else {
      console.warn(`Failed to load ${type} question configuration, using defaults`);
      return getDefaultQuestions(type);
    }
  } catch (error) {
    console.error(`Error loading ${type} question configuration:`, error);
    return getDefaultQuestions(type);
  }
}

// Convert question config back to original format for compatibility
export function convertToOriginalFormat(configs: QuestionConfig[], type: 'advanced' | 'simplified') {
  if (type === 'advanced') {
    return configs.map(config => ({
      id: config.id,
      section: config.section,
      textKey: config.textKey,
      optional: config.optional,
      phase: config.phase,
    }));
  } else {
    return configs.map(config => ({
      id: config.id,
      section: config.section,
      textKey: config.textKey,
      required: config.required,
    }));
  }
}

// Validate question configuration
export function validateQuestionConfiguration(config: QuestionConfiguration): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.name || config.name.trim().length === 0) {
    errors.push('Configuration name is required');
  }

  if (!config.type || !['advanced', 'simplified'].includes(config.type)) {
    errors.push('Configuration type must be "advanced" or "simplified"');
  }

  if (!config.questions || !Array.isArray(config.questions) || config.questions.length === 0) {
    errors.push('At least one question is required');
  }

  // Check for duplicate question IDs
  const questionIds = config.questions.map(q => q.id);
  const duplicateIds = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate question IDs found: ${duplicateIds.join(', ')}`);
  }

  // Check for duplicate orders
  const orders = config.questions.map(q => q.order);
  const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicateOrders.length > 0) {
    errors.push(`Duplicate question orders found: ${duplicateOrders.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
