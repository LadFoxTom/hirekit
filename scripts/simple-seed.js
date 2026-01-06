const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database
const dbPath = path.join(__dirname, '../prisma/dev.db');

// Create a database connection
const db = new sqlite3.Database(dbPath);

// Helper function to get question text from translations
function getQuestionText(textKey) {
  const questionTexts = {
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
function getQuestionPlaceholder(questionId) {
  const placeholders = {
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
function getQuestionHelpText(questionId) {
  const helpTexts = {
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

// Function to get default questions with full content
function getDefaultQuestions(type) {
  if (type === 'advanced') {
    return [
      { id: 'intro', section: 'introduction', textKey: 'intro.welcome', enabled: true, order: 0, optional: false, phase: 'basic', text: getQuestionText('intro.welcome'), placeholder: '', helpText: '' },
      { id: 'fullName', section: 'personal', textKey: 'question.fullName', enabled: true, order: 1, optional: false, phase: 'basic', text: getQuestionText('question.fullName'), placeholder: getQuestionPlaceholder('fullName'), helpText: getQuestionHelpText('fullName') },
      { id: 'email', section: 'personal', textKey: 'question.email', enabled: true, order: 2, optional: false, phase: 'basic', text: getQuestionText('question.email'), placeholder: getQuestionPlaceholder('email'), helpText: getQuestionHelpText('email') },
      { id: 'phone', section: 'personal', textKey: 'question.phone', enabled: true, order: 3, optional: true, phase: 'basic', text: getQuestionText('question.phone'), placeholder: getQuestionPlaceholder('phone'), helpText: getQuestionHelpText('phone') },
      { id: 'location', section: 'personal', textKey: 'question.location', enabled: true, order: 4, optional: false, phase: 'basic', text: getQuestionText('question.location'), placeholder: getQuestionPlaceholder('location'), helpText: getQuestionHelpText('location') },
      { id: 'summary', section: 'summary', textKey: 'question.summary_enhanced', enabled: true, order: 5, optional: false, phase: 'basic', text: getQuestionText('question.summary_enhanced'), placeholder: '', helpText: getQuestionHelpText('summary_enhanced') },
      { id: 'experience_intro', section: 'experience', textKey: 'question.experience_intro_enhanced', enabled: true, order: 6, optional: false, phase: 'basic', text: getQuestionText('question.experience_intro_enhanced'), placeholder: '', helpText: '' },
      { id: 'experience_company', section: 'experience', textKey: 'question.experience_company', enabled: true, order: 7, optional: false, phase: 'basic', text: getQuestionText('question.experience_company'), placeholder: getQuestionPlaceholder('experience_company'), helpText: '' },
      { id: 'experience_title', section: 'experience', textKey: 'question.experience_title', enabled: true, order: 8, optional: false, phase: 'basic', text: getQuestionText('question.experience_title'), placeholder: getQuestionPlaceholder('experience_title'), helpText: '' },
      { id: 'experience_type', section: 'experience', textKey: 'question.experience_type', enabled: true, order: 9, optional: false, phase: 'basic', text: getQuestionText('question.experience_type'), options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'], placeholder: '', helpText: '' },
      { id: 'experience_location', section: 'experience', textKey: 'question.experience_location', enabled: true, order: 10, optional: true, phase: 'basic', text: getQuestionText('question.experience_location'), placeholder: 'New York, NY', helpText: '' },
      { id: 'experience_current', section: 'experience', textKey: 'question.experience_current', enabled: true, order: 11, optional: false, phase: 'basic', text: getQuestionText('question.experience_current'), options: ['Yes', 'No'], placeholder: '', helpText: '' },
      { id: 'experience_dates', section: 'experience', textKey: 'question.experience_dates_enhanced', enabled: true, order: 12, optional: false, phase: 'basic', text: getQuestionText('question.experience_dates_enhanced'), placeholder: 'January 2020 - Present', helpText: '' },
      { id: 'experience_achievements', section: 'experience', textKey: 'question.experience_achievements', enabled: true, order: 13, optional: false, phase: 'basic', text: getQuestionText('question.experience_achievements'), placeholder: '', helpText: getQuestionHelpText('experience_achievements') },
      { id: 'experience_more', section: 'experience', textKey: 'question.experience_more', enabled: true, order: 14, optional: true, phase: 'basic', text: getQuestionText('question.experience_more'), options: ['Yes', 'No'], placeholder: '', helpText: '' },
      { id: 'education_intro', section: 'education', textKey: 'question.education_intro_enhanced', enabled: true, order: 15, optional: false, phase: 'basic', text: getQuestionText('question.education_intro_enhanced'), placeholder: '', helpText: '' },
      { id: 'education_institution', section: 'education', textKey: 'question.education_institution', enabled: true, order: 16, optional: false, phase: 'basic', text: getQuestionText('question.education_institution'), placeholder: getQuestionPlaceholder('education_institution'), helpText: '' },
      { id: 'education_degree', section: 'education', textKey: 'question.education_degree', enabled: true, order: 17, optional: false, phase: 'basic', text: getQuestionText('question.education_degree'), placeholder: getQuestionPlaceholder('education_degree'), helpText: '' },
      { id: 'education_field', section: 'education', textKey: 'question.education_field', enabled: true, order: 18, optional: false, phase: 'basic', text: getQuestionText('question.education_field'), placeholder: getQuestionPlaceholder('education_field'), helpText: '' },
      { id: 'education_dates', section: 'education', textKey: 'question.education_dates_enhanced', enabled: true, order: 19, optional: false, phase: 'basic', text: getQuestionText('question.education_dates_enhanced'), placeholder: '2016 - 2020', helpText: '' },
      { id: 'education_achievements', section: 'education', textKey: 'question.education_achievements', enabled: true, order: 20, optional: true, phase: 'basic', text: getQuestionText('question.education_achievements'), placeholder: 'GPA: 3.8, Dean\'s List', helpText: '' },
      { id: 'education_more', section: 'education', textKey: 'question.education_more', enabled: true, order: 21, optional: true, phase: 'basic', text: getQuestionText('question.education_more'), options: ['Yes', 'No'], placeholder: '', helpText: '' },
      { id: 'skills_intro', section: 'skills', textKey: 'question.skills_intro', enabled: true, order: 22, optional: false, phase: 'basic', text: getQuestionText('question.skills_intro'), placeholder: '', helpText: '' },
      { id: 'technical_skills', section: 'skills', textKey: 'question.technical_skills', enabled: true, order: 23, optional: false, phase: 'basic', text: getQuestionText('question.technical_skills'), placeholder: 'JavaScript, React, Node.js', helpText: getQuestionHelpText('technical_skills') },
      { id: 'soft_skills', section: 'skills', textKey: 'question.soft_skills', enabled: true, order: 24, optional: false, phase: 'basic', text: getQuestionText('question.soft_skills'), placeholder: 'Leadership, Communication, Problem-solving', helpText: getQuestionHelpText('soft_skills') },
      { id: 'languages', section: 'languages', textKey: 'question.languages_enhanced', enabled: true, order: 25, optional: true, phase: 'basic', text: getQuestionText('question.languages_enhanced'), placeholder: 'English - Native, Spanish - Fluent', helpText: '' },
      { id: 'basic_completion', section: 'completion', textKey: 'completion.basic_success', enabled: true, order: 26, optional: false, phase: 'basic', text: 'Great! Your CV is ready. Would you like to review it or make any changes?', placeholder: '', helpText: '' }
    ];
  } else if (type === 'simplified') {
    return [
      { id: 'intro', section: 'introduction', textKey: 'intro.welcome', enabled: true, order: 0, required: false, text: getQuestionText('intro.welcome'), placeholder: '', helpText: '' },
      { id: 'fullName', section: 'personal', textKey: 'question.fullName', enabled: true, order: 1, required: true, text: getQuestionText('question.fullName'), placeholder: getQuestionPlaceholder('fullName'), helpText: getQuestionHelpText('fullName') },
      { id: 'email', section: 'personal', textKey: 'question.email', enabled: true, order: 2, required: true, text: getQuestionText('question.email'), placeholder: getQuestionPlaceholder('email'), helpText: getQuestionHelpText('email') },
      { id: 'phone', section: 'personal', textKey: 'question.phone', enabled: true, order: 3, required: false, text: getQuestionText('question.phone'), placeholder: getQuestionPlaceholder('phone'), helpText: getQuestionHelpText('phone') },
      { id: 'location', section: 'personal', textKey: 'question.location', enabled: true, order: 4, required: true, text: getQuestionText('question.location'), placeholder: getQuestionPlaceholder('location'), helpText: getQuestionHelpText('location') },
      { id: 'summary', section: 'summary', textKey: 'question.summary_simple', enabled: true, order: 5, required: true, text: getQuestionText('question.summary_simple'), placeholder: '', helpText: '' },
      { id: 'experience_intro', section: 'experience', textKey: 'question.experience_intro_simple', enabled: true, order: 6, required: true, text: getQuestionText('question.experience_intro_simple'), placeholder: '', helpText: '' },
      { id: 'education_intro', section: 'education', textKey: 'question.education_intro_simple', enabled: true, order: 7, required: true, text: getQuestionText('question.education_intro_simple'), placeholder: '', helpText: '' },
      { id: 'skills_intro', section: 'skills', textKey: 'question.skills_intro_simple', enabled: true, order: 8, required: true, text: getQuestionText('question.skills_intro_simple'), placeholder: '', helpText: '' },
      { id: 'languages_intro', section: 'languages', textKey: 'question.languages_intro_simple', enabled: true, order: 9, required: false, text: getQuestionText('question.languages_intro_simple'), placeholder: '', helpText: '' },
      { id: 'completion', section: 'completion', textKey: 'completion.success_simple', enabled: true, order: 10, required: false, text: 'Perfect! Your CV is ready. Would you like to review it?', placeholder: '', helpText: '' }
    ];
  }
  return [];
}

async function seedDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Starting database seeding...');

    // Check if configurations already exist
    db.get("SELECT COUNT(*) as count FROM QuestionConfiguration", (err, row) => {
      if (err) {
        console.error('Error checking existing configurations:', err);
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Configurations already exist, skipping seeding.');
        resolve();
        return;
      }

      // Get default questions with full content
      const defaultAdvancedQuestions = getDefaultQuestions('advanced');
      const defaultSimplifiedQuestions = getDefaultQuestions('simplified');

      // Insert advanced configuration
      const advancedConfig = {
        id: 'clx1234567890abcdef',
        name: 'Default Advanced',
        description: 'Default advanced CV builder questions',
        type: 'advanced',
        isActive: 1,
        isDefault: 1,
        questions: JSON.stringify(defaultAdvancedQuestions),
        version: 1,
        createdBy: 'admin@admin.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.run(`
        INSERT INTO QuestionConfiguration 
        (id, name, description, type, isActive, isDefault, questions, version, createdBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        advancedConfig.id,
        advancedConfig.name,
        advancedConfig.description,
        advancedConfig.type,
        advancedConfig.isActive,
        advancedConfig.isDefault,
        advancedConfig.questions,
        advancedConfig.version,
        advancedConfig.createdBy,
        advancedConfig.createdAt,
        advancedConfig.updatedAt
      ], function(err) {
        if (err) {
          console.error('Error inserting advanced configuration:', err);
          reject(err);
          return;
        }

        console.log('Advanced configuration inserted with ID:', this.lastID);

        // Insert simplified configuration
        const simplifiedConfig = {
          id: 'clx1234567890abcdef2',
          name: 'Default Simplified',
          description: 'Default simplified CV builder questions',
          type: 'simplified',
          isActive: 1,
          isDefault: 1,
          questions: JSON.stringify(defaultSimplifiedQuestions),
          version: 1,
          createdBy: 'admin@admin.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.run(`
          INSERT INTO QuestionConfiguration 
          (id, name, description, type, isActive, isDefault, questions, version, createdBy, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          simplifiedConfig.id,
          simplifiedConfig.name,
          simplifiedConfig.description,
          simplifiedConfig.type,
          simplifiedConfig.isActive,
          simplifiedConfig.isDefault,
          simplifiedConfig.questions,
          simplifiedConfig.version,
          simplifiedConfig.createdBy,
          simplifiedConfig.createdAt,
          simplifiedConfig.updatedAt
        ], function(err) {
          if (err) {
            console.error('Error inserting simplified configuration:', err);
            reject(err);
            return;
          }

          console.log('Simplified configuration inserted with ID:', this.lastID);
          console.log('Database seeding completed successfully!');
          resolve();
        });
      });
    });
  });
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
