export interface SimplifiedQuestion {
  id: string;
  section: string;
  textKey: string;
  required: boolean;
  validation?: (input: string) => { isValid: boolean; error?: string };
  acknowledgment?: string;
  skipCondition?: (cvData: any) => boolean;
}

export const SIMPLIFIED_CV_QUESTIONS: SimplifiedQuestion[] = [
  // 1. INTRODUCTION
  {
    id: 'intro',
    section: 'introduction',
    textKey: 'intro.welcome',
    required: false,
    acknowledgment: 'Great! Let\'s start building your professional CV.'
  },
  
  // 2. BASIC PERSONAL INFO (Core CV requirements)
  {
    id: 'fullName',
    section: 'personal',
    textKey: 'question.fullName',
    required: true,
    validation: (input) => {
      if (!input.trim()) return { isValid: false, error: 'Please enter your full name.' };
      if (input.length < 2) return { isValid: false, error: 'Name must be at least 2 characters.' };
      return { isValid: true };
    },
    acknowledgment: 'Perfect! Your name has been added to your CV.'
  },
  
  {
    id: 'email',
    section: 'personal',
    textKey: 'question.email',
    required: true,
    validation: (input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) return { isValid: false, error: 'Please enter a valid email address.' };
      return { isValid: true };
    },
    acknowledgment: 'Email added successfully!'
  },
  
  {
    id: 'phone',
    section: 'personal',
    textKey: 'question.phone',
    required: false,
    validation: (input) => {
      if (!input.trim()) return { isValid: true }; // Optional field
      if (input.length < 7) return { isValid: false, error: 'Please enter a valid phone number.' };
      return { isValid: true };
    },
    acknowledgment: 'Phone number added to your CV.'
  },
  
  {
    id: 'location',
    section: 'personal',
    textKey: 'question.location',
    required: true,
    validation: (input) => {
      if (!input.trim()) return { isValid: false, error: 'Please enter your location.' };
      return { isValid: true };
    },
    acknowledgment: 'Location added to your CV.'
  },
  
  // 3. PROFESSIONAL SUMMARY (Core CV requirement)
  {
    id: 'summary',
    section: 'summary',
    textKey: 'question.summary_simple',
    required: true,
    validation: (input) => {
      if (!input.trim()) return { isValid: false, error: 'Please write a professional summary.' };
      if (input.length < 50) return { isValid: false, error: 'Summary should be at least 50 characters.' };
      return { isValid: true };
    },
    acknowledgment: 'quick_cv.excellent_summary'
  },
  
  // 4. WORK EXPERIENCE (Core CV requirement)
  {
    id: 'experience_intro',
    section: 'experience',
    textKey: 'question.experience_intro_simple',
    required: true,
    acknowledgment: 'Let\'s add your work experience step by step.'
  },
  
  // 5. EDUCATION (Core CV requirement)
  {
    id: 'education_intro',
    section: 'education',
    textKey: 'question.education_intro_simple',
    required: true,
    acknowledgment: 'Now let\'s add your education background.'
  },
  
  // 6. SKILLS (Core CV requirement)
  {
    id: 'skills_intro',
    section: 'skills',
    textKey: 'question.skills_intro_simple',
    required: true,
    acknowledgment: 'Skills are crucial for your CV. Let\'s add them.'
  },
  
  // 7. LANGUAGES (Core CV requirement)
  {
    id: 'languages_intro',
    section: 'languages',
    textKey: 'question.languages_intro_simple',
    required: false,
    acknowledgment: 'Languages added to your CV.'
  },
  
  // 8. LANGUAGE PROFICIENCY (Optional follow-up)
  {
    id: 'languages_proficiency',
    section: 'languages',
    textKey: 'question.languages_proficiency_simple',
    required: false,
    acknowledgment: 'Language proficiency levels added.'
  },
  
  // 9. ADDITIONAL PROFESSIONAL INFORMATION
  {
    id: 'current_profession',
    section: 'professional',
    textKey: 'question.current_profession',
    required: false,
    validation: (input) => {
      if (!input.trim()) return { isValid: true }; // Optional field
      return { isValid: true };
    },
    acknowledgment: 'Professional title added to your CV.'
  },
  
  // 10. SOCIAL LINKS
  {
    id: 'linkedin',
    section: 'social',
    textKey: 'question.linkedin',
    required: false,
    validation: (input) => {
      if (!input.trim()) return { isValid: true }; // Optional field
      if (!input.includes('linkedin.com')) return { isValid: false, error: 'Please enter a valid LinkedIn URL.' };
      return { isValid: true };
    },
    acknowledgment: 'LinkedIn profile added to your CV.'
  },
  
  {
    id: 'website',
    section: 'social',
    textKey: 'question.website',
    required: false,
    validation: (input) => {
      if (!input.trim()) return { isValid: true }; // Optional field
      if (!input.startsWith('http')) return { isValid: false, error: 'Please enter a valid website URL starting with http:// or https://' };
      return { isValid: true };
    },
    acknowledgment: 'Website added to your CV.'
  },
  
  {
    id: 'github',
    section: 'social',
    textKey: 'question.github',
    required: false,
    validation: (input) => {
      if (!input.trim()) return { isValid: true }; // Optional field
      if (!input.includes('github.com')) return { isValid: false, error: 'Please enter a valid GitHub URL.' };
      return { isValid: true };
    },
    acknowledgment: 'GitHub profile added to your CV.'
  },
  
  // 11. COMPLETION
  {
    id: 'completion',
    section: 'completion',
    textKey: 'completion.success_simple',
    required: false,
    acknowledgment: 'Your professional CV is ready! You can now preview and download it.'
  }
];

// Standardized response messages
export const STANDARD_RESPONSES = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  SUCCESS: 'Information saved successfully!',
  SKIP_OPTIONAL: 'Skipping this optional question.',
  NEXT_QUESTION: 'Moving to the next question...',
  EXPERIENCE_ADDED: 'Work experience added successfully!',
  EDUCATION_ADDED: 'Education added successfully!',
  SKILLS_ADDED: 'Skills added successfully!',
  CV_COMPLETE: 'Your CV is now complete and ready for download!'
};

// Validation functions
export const VALIDATION_FUNCTIONS = {
  required: (input: string) => {
    return input.trim().length > 0;
  },
  
  email: (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  },
  
  phone: (input: string) => {
    if (!input.trim()) return true; // Optional
    return input.length >= 7;
  },
  
  minLength: (input: string, min: number) => {
    return input.trim().length >= min;
  }
}; 