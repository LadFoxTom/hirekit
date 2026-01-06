export interface Question {
  id: string;
  section: string;
  textKey: string;
  optional?: boolean;
  skipCondition?: (cvData: any) => boolean;
  dependsOn?: string[];
  phase?: 'basic' | 'advanced' | 'optimization'; // New field to categorize questions
}

export const CV_QUESTIONS: Question[] = [
  // ===== PHASE 1: BASIC QUESTIONS (Essential for every CV) =====
  
  // Introduction
  {
    id: 'intro',
    section: 'introduction',
    textKey: "intro.welcome",
    phase: 'basic'
  },
  
  // Personal Information (Core)
  {
    id: 'fullName',
    section: 'personal',
    textKey: "question.fullName",
    phase: 'basic'
  },
  {
    id: 'email',
    section: 'personal',
    textKey: "question.email",
    phase: 'basic'
  },
  {
    id: 'phone',
    section: 'personal',
    textKey: "question.phone",
    optional: true,
    phase: 'basic'
  },
  {
    id: 'location',
    section: 'personal',
    textKey: "question.location",
    phase: 'basic'
  },
  
  // Professional Summary (Core)
  {
    id: 'summary',
    section: 'summary',
    textKey: "question.summary_enhanced",
    phase: 'basic'
  },
  
  // Work Experience (Core)
  {
    id: 'experience_intro',
    section: 'experience',
    textKey: "question.experience_intro_enhanced",
    phase: 'basic'
  },
  {
    id: 'experience_company',
    section: 'experience',
    textKey: "question.experience_company",
    phase: 'basic'
  },
  {
    id: 'experience_title',
    section: 'experience',
    textKey: "question.experience_title",
    phase: 'basic'
  },
  {
    id: 'experience_type',
    section: 'experience',
    textKey: "question.experience_type",
    phase: 'basic'
  },
  {
    id: 'experience_location',
    section: 'experience',
    textKey: "question.experience_location",
    optional: true,
    phase: 'basic'
  },
  {
    id: 'experience_current',
    section: 'experience',
    textKey: "question.experience_current",
    phase: 'basic'
  },
  {
    id: 'experience_dates',
    section: 'experience',
    textKey: "question.experience_dates_enhanced",
    phase: 'basic'
  },
  {
    id: 'experience_achievements',
    section: 'experience',
    textKey: "question.experience_achievements",
    phase: 'basic'
  },
  {
    id: 'experience_more',
    section: 'experience',
    textKey: "question.experience_more",
    optional: true,
    phase: 'basic'
  },
  
  // Education (Core)
  {
    id: 'education_intro',
    section: 'education',
    textKey: "question.education_intro_enhanced",
    phase: 'basic'
  },
  {
    id: 'education_institution',
    section: 'education',
    textKey: "question.education_institution",
    phase: 'basic'
  },
  {
    id: 'education_degree',
    section: 'education',
    textKey: "question.education_degree",
    phase: 'basic'
  },
  {
    id: 'education_field',
    section: 'education',
    textKey: "question.education_field",
    phase: 'basic'
  },
  {
    id: 'education_dates',
    section: 'education',
    textKey: "question.education_dates_enhanced",
    phase: 'basic'
  },
  {
    id: 'education_achievements',
    section: 'education',
    textKey: "question.education_achievements",
    optional: true,
    phase: 'basic'
  },
  {
    id: 'education_more',
    section: 'education',
    textKey: "question.education_more",
    optional: true,
    phase: 'basic'
  },
  
  // Skills (Core)
  {
    id: 'skills_intro',
    section: 'skills',
    textKey: "question.skills_intro",
    phase: 'basic'
  },
  {
    id: 'technical_skills',
    section: 'skills',
    textKey: "question.technical_skills",
    phase: 'basic'
  },
  {
    id: 'soft_skills',
    section: 'skills',
    textKey: "question.soft_skills",
    phase: 'basic'
  },
  
  // Languages (Core)
  {
    id: 'languages',
    section: 'languages',
    textKey: "question.languages_enhanced",
    optional: true,
    phase: 'basic'
  },
  
  // Basic Completion
  {
    id: 'basic_completion',
    section: 'completion',
    textKey: "completion.basic_success",
    phase: 'basic'
  },
  
  // ===== PHASE 2: ADVANCED QUESTIONS (Optional enhancements) =====
  
  // Career Context (Advanced)
  {
    id: 'career_stage',
    section: 'career_stage',
    textKey: "question.career_stage",
    phase: 'advanced'
  },
  {
    id: 'industry_sector',
    section: 'industry',
    textKey: "question.industry_sector",
    phase: 'advanced'
  },
  {
    id: 'target_region',
    section: 'regional',
    textKey: "question.target_region",
    phase: 'advanced'
  },
  
  // Enhanced Personal Information
  {
    id: 'pronouns',
    section: 'personal',
    textKey: "question.pronouns",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'professional_headline',
    section: 'personal',
    textKey: "question.professional_headline",
    phase: 'advanced'
  },
  {
    id: 'career_objective',
    section: 'personal',
    textKey: "question.career_objective",
    phase: 'advanced'
  },
  
  // Legal & Availability
  {
    id: 'work_authorization',
    section: 'legal',
    textKey: "question.work_authorization",
    phase: 'advanced'
  },
  {
    id: 'availability',
    section: 'availability',
    textKey: "question.availability",
    optional: true,
    phase: 'advanced'
  },
  
  // Social Media Links
  {
    id: 'linkedin',
    section: 'social',
    textKey: "question.linkedin",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'github',
    section: 'social',
    textKey: "question.github",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'website',
    section: 'social',
    textKey: "question.website",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'other_social',
    section: 'social',
    textKey: "question.other_social",
    optional: true,
    phase: 'advanced'
  },
  
  // Enhanced Skills
  {
    id: 'tools_software',
    section: 'skills',
    textKey: "question.tools_software",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'industry_knowledge',
    section: 'skills',
    textKey: "question.industry_knowledge",
    optional: true,
    phase: 'advanced'
  },
  
  // Additional Sections
  {
    id: 'certifications',
    section: 'certifications',
    textKey: "question.certifications_enhanced",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'projects',
    section: 'projects',
    textKey: "question.projects_enhanced",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'volunteer_work',
    section: 'volunteer',
    textKey: "question.volunteer_work",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'awards_recognition',
    section: 'awards',
    textKey: "question.awards_recognition",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'professional_memberships',
    section: 'memberships',
    textKey: "question.professional_memberships",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'publications_research',
    section: 'publications',
    textKey: "question.publications_research",
    optional: true,
    skipCondition: (cvData) => !['academic', 'research'].includes(cvData.industrySector),
    phase: 'advanced'
  },
  {
    id: 'references',
    section: 'references',
    textKey: "question.references",
    optional: true,
    phase: 'advanced'
  },
  {
    id: 'hobbies',
    section: 'hobbies',
    textKey: "question.hobbies_enhanced",
    optional: true,
    phase: 'advanced'
  },
  
  // Template Selection
  {
    id: 'template_preference',
    section: 'preferences',
    textKey: "question.template_preference_enhanced",
    optional: true,
    phase: 'advanced'
  },
  
  // Quality Review
  {
    id: 'quality_review',
    section: 'quality',
    textKey: "question.quality_review",
    optional: true,
    phase: 'advanced'
  },
  
  // Final Completion
  {
    id: 'completion',
    section: 'completion',
    textKey: "completion.success_enhanced",
    phase: 'advanced'
  }
];

// Helper functions to get questions by phase
export const getBasicQuestions = () => CV_QUESTIONS.filter(q => q.phase === 'basic');
export const getAdvancedQuestions = () => CV_QUESTIONS.filter(q => q.phase === 'advanced');
export const getOptimizationQuestions = () => CV_QUESTIONS.filter(q => q.phase === 'optimization');

// Helper to check if basic phase is complete
export const isBasicPhaseComplete = (cvData: any) => {
  const basicQuestions = getBasicQuestions();
  const requiredBasicQuestions = basicQuestions.filter(q => !q.optional);
  
  // Check if all required basic questions have been answered
  return requiredBasicQuestions.every(question => {
    switch (question.id) {
      case 'fullName':
        return cvData.fullName && cvData.fullName.trim().length > 0;
      case 'email':
        return cvData.contact?.email && cvData.contact.email.trim().length > 0;
      case 'location':
        return cvData.contact?.location && cvData.contact.location.trim().length > 0;
      case 'summary':
        return cvData.summary && cvData.summary.trim().length > 0;
      case 'experience_intro':
        return cvData.experience && cvData.experience.length > 0;
      case 'education_intro':
        return cvData.education && cvData.education.length > 0;
      case 'skills_intro':
        return cvData.skills && (
          Array.isArray(cvData.skills) ? cvData.skills.length > 0 : 
          Object.values(cvData.skills).some((skillArray: any) => skillArray.length > 0)
        );
      default:
        return true; // For optional questions
    }
  });
}; 