/**
 * Smart Mapping Configurations for CV Builder Flows
 * 
 * Complete mapping configurations that connect flow questions to CV fields
 * with intelligent field mapping, transformations, and validations
 */

import { SmartMappingConfig, FieldMapping, DataTransformation, ValidationRule } from '@/lib/smart-cv-mapper';

// Basic CV Flow Mapping Configuration
export const BASIC_CV_MAPPING_CONFIG: SmartMappingConfig = {
  id: 'basic_cv_mapping',
  name: 'Basic CV Builder Mapping',
  description: 'Smart mapping configuration for Basic CV Builder flow',
  flowId: 'basic_cv_flow',
  industryContext: 'Universal',
  mappings: [
    // Personal Information Mappings
    {
      id: 'map_full_name',
      sourceNodeId: 'full_name',
      sourceVariable: 'fullName',
      targetCvField: 'fullName',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_preferred_name',
      sourceNodeId: 'preferred_name',
      sourceVariable: 'preferredName',
      targetCvField: 'preferredName',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_email',
      sourceNodeId: 'email',
      sourceVariable: 'email',
      targetCvField: 'contact.email',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.98,
      isActive: true
    },
    {
      id: 'map_phone',
      sourceNodeId: 'phone',
      sourceVariable: 'phone',
      targetCvField: 'contact.phone',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.98,
      isActive: true
    },
    {
      id: 'map_location',
      sourceNodeId: 'location',
      sourceVariable: 'location',
      targetCvField: 'contact.location',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_linkedin',
      sourceNodeId: 'linkedin',
      sourceVariable: 'linkedin',
      targetCvField: 'contact.linkedin',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_website',
      sourceNodeId: 'website',
      sourceVariable: 'website',
      targetCvField: 'contact.website',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Professional Summary Mappings
    {
      id: 'map_current_title',
      sourceNodeId: 'current_title',
      sourceVariable: 'currentTitle',
      targetCvField: 'title',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_experience_years',
      sourceNodeId: 'experience_years',
      sourceVariable: 'experienceYears',
      targetCvField: 'experienceYears',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_professional_summary',
      sourceNodeId: 'professional_summary',
      sourceVariable: 'professionalSummary',
      targetCvField: 'summary',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_top_strengths',
      sourceNodeId: 'top_strengths',
      sourceVariable: 'topStrengths',
      targetCvField: 'strengths',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Work Experience Mappings
    {
      id: 'map_current_company',
      sourceNodeId: 'current_company',
      sourceVariable: 'currentCompany',
      targetCvField: 'experience.0.company',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_current_role_dates',
      sourceNodeId: 'current_role_dates',
      sourceVariable: 'currentRoleStartDate',
      targetCvField: 'experience.0.dates',
      targetSection: 'experience',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_current_role_description',
      sourceNodeId: 'current_role_description',
      sourceVariable: 'currentRoleDescription',
      targetCvField: 'experience.0.description',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_current_achievements',
      sourceNodeId: 'current_achievements',
      sourceVariable: 'currentAchievements',
      targetCvField: 'experience.0.achievements',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_previous_experience',
      sourceNodeId: 'previous_experience',
      sourceVariable: 'previousExperience',
      targetCvField: 'previousExperience',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Skills Mappings
    {
      id: 'map_technical_skills',
      sourceNodeId: 'technical_skills',
      sourceVariable: 'technicalSkills',
      targetCvField: 'skills.technical',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_soft_skills',
      sourceNodeId: 'soft_skills',
      sourceVariable: 'softSkills',
      targetCvField: 'skills.soft',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_languages',
      sourceNodeId: 'languages',
      sourceVariable: 'languages',
      targetCvField: 'languages',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Education Mappings
    {
      id: 'map_education_level',
      sourceNodeId: 'education_level',
      sourceVariable: 'educationLevel',
      targetCvField: 'education.0.degree',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_degree_field',
      sourceNodeId: 'degree_field',
      sourceVariable: 'degreeField',
      targetCvField: 'education.0.field',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_university',
      sourceNodeId: 'university',
      sourceVariable: 'university',
      targetCvField: 'education.0.institution',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_graduation_year',
      sourceNodeId: 'graduation_year',
      sourceVariable: 'graduationYear',
      targetCvField: 'education.0.dates',
      targetSection: 'education',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_gpa',
      sourceNodeId: 'gpa',
      sourceVariable: 'gpa',
      targetCvField: 'education.0.gpa',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Additional Information Mappings
    {
      id: 'map_certifications',
      sourceNodeId: 'certifications',
      sourceVariable: 'certifications',
      targetCvField: 'certifications',
      targetSection: 'additional',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_projects',
      sourceNodeId: 'projects',
      sourceVariable: 'projects',
      targetCvField: 'projects',
      targetSection: 'additional',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_interests',
      sourceNodeId: 'interests',
      sourceVariable: 'interests',
      targetCvField: 'hobbies',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    }
  ],
  transformations: [
    {
      id: 'format_dates',
      field: 'experience.0.dates',
      transformationType: 'format_date',
      parameters: {
        inputFormat: 'MM/YYYY',
        outputFormat: 'MMM YYYY'
      }
    },
    {
      id: 'format_graduation_date',
      field: 'education.0.dates',
      transformationType: 'format_date',
      parameters: {
        inputFormat: 'YYYY',
        outputFormat: 'YYYY'
      }
    },
    {
      id: 'capitalize_names',
      field: 'fullName',
      transformationType: 'capitalize',
      parameters: {
        case: 'title'
      }
    },
    {
      id: 'capitalize_title',
      field: 'title',
      transformationType: 'capitalize',
      parameters: {
        case: 'title'
      }
    }
  ],
  validations: [
    {
      id: 'validate_email',
      field: 'contact.email',
      ruleType: 'format',
      parameters: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      },
      errorMessage: 'Please enter a valid email address'
    },
    {
      id: 'validate_phone',
      field: 'contact.phone',
      ruleType: 'format',
      parameters: {
        pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$'
      },
      errorMessage: 'Please enter a valid phone number'
    },
    {
      id: 'validate_summary_length',
      field: 'summary',
      ruleType: 'length',
      parameters: {
        minLength: 50,
        maxLength: 500
      },
      errorMessage: 'Professional summary should be between 50-500 characters'
    },
    {
      id: 'validate_required_fields',
      field: 'fullName',
      ruleType: 'required',
      parameters: {},
      errorMessage: 'Full name is required'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Advanced CV Flow Mapping Configuration
export const ADVANCED_CV_MAPPING_CONFIG: SmartMappingConfig = {
  id: 'advanced_cv_mapping',
  name: 'Advanced CV Builder Mapping',
  description: 'Comprehensive smart mapping configuration for Advanced CV Builder flow',
  flowId: 'advanced_cv_flow',
  industryContext: 'All Industries',
  mappings: [
    // Personal Information Mappings (same as basic but with additional fields)
    {
      id: 'map_full_name_adv',
      sourceNodeId: 'full_name',
      sourceVariable: 'fullName',
      targetCvField: 'fullName',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_preferred_name_adv',
      sourceNodeId: 'preferred_name',
      sourceVariable: 'preferredName',
      targetCvField: 'preferredName',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_email_adv',
      sourceNodeId: 'email',
      sourceVariable: 'email',
      targetCvField: 'contact.email',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.98,
      isActive: true
    },
    {
      id: 'map_phone_adv',
      sourceNodeId: 'phone',
      sourceVariable: 'phone',
      targetCvField: 'contact.phone',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.98,
      isActive: true
    },
    {
      id: 'map_location_adv',
      sourceNodeId: 'location',
      sourceVariable: 'location',
      targetCvField: 'contact.location',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_linkedin_adv',
      sourceNodeId: 'linkedin',
      sourceVariable: 'linkedin',
      targetCvField: 'contact.linkedin',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_website_adv',
      sourceNodeId: 'website',
      sourceVariable: 'website',
      targetCvField: 'contact.website',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_github_adv',
      sourceNodeId: 'github',
      sourceVariable: 'github',
      targetCvField: 'contact.github',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Industry and Career Context
    {
      id: 'map_industry',
      sourceNodeId: 'industry',
      sourceVariable: 'industry',
      targetCvField: 'industry',
      targetSection: 'context',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_career_level',
      sourceNodeId: 'career_level',
      sourceVariable: 'careerLevel',
      targetCvField: 'careerLevel',
      targetSection: 'context',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_target_role',
      sourceNodeId: 'target_role',
      sourceVariable: 'targetRole',
      targetCvField: 'title',
      targetSection: 'personal',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },

    // Enhanced Professional Summary
    {
      id: 'map_experience_years_adv',
      sourceNodeId: 'experience_years',
      sourceVariable: 'experienceYears',
      targetCvField: 'experienceYears',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_professional_summary_adv',
      sourceNodeId: 'professional_summary',
      sourceVariable: 'professionalSummary',
      targetCvField: 'summary',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_key_achievements',
      sourceNodeId: 'key_achievements',
      sourceVariable: 'keyAchievements',
      targetCvField: 'keyAchievements',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_career_objectives',
      sourceNodeId: 'career_objectives',
      sourceVariable: 'careerObjectives',
      targetCvField: 'careerObjectives',
      targetSection: 'summary',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Detailed Work Experience
    {
      id: 'map_current_company_adv',
      sourceNodeId: 'current_company',
      sourceVariable: 'currentCompany',
      targetCvField: 'experience.0.company',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_company_industry',
      sourceNodeId: 'company_industry',
      sourceVariable: 'companyIndustry',
      targetCvField: 'experience.0.industry',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_company_size',
      sourceNodeId: 'company_size',
      sourceVariable: 'companySize',
      targetCvField: 'experience.0.companySize',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_current_role_dates_adv',
      sourceNodeId: 'current_role_dates',
      sourceVariable: 'currentRoleStartDate',
      targetCvField: 'experience.0.dates',
      targetSection: 'experience',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_current_role_type',
      sourceNodeId: 'current_role_type',
      sourceVariable: 'currentRoleType',
      targetCvField: 'experience.0.employmentType',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_current_role_location',
      sourceNodeId: 'current_role_location',
      sourceVariable: 'currentRoleLocation',
      targetCvField: 'experience.0.location',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_current_role_description_adv',
      sourceNodeId: 'current_role_description',
      sourceVariable: 'currentRoleDescription',
      targetCvField: 'experience.0.description',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_current_achievements_adv',
      sourceNodeId: 'current_achievements',
      sourceVariable: 'currentAchievements',
      targetCvField: 'experience.0.achievements',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_team_management',
      sourceNodeId: 'team_management',
      sourceVariable: 'teamManagement',
      targetCvField: 'experience.0.teamManagement',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_budget_responsibility',
      sourceNodeId: 'budget_responsibility',
      sourceVariable: 'budgetResponsibility',
      targetCvField: 'experience.0.budgetResponsibility',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Previous Experience
    {
      id: 'map_previous_positions',
      sourceNodeId: 'previous_positions',
      sourceVariable: 'previousPositions',
      targetCvField: 'previousExperience',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_career_progression',
      sourceNodeId: 'career_progression',
      sourceVariable: 'careerProgression',
      targetCvField: 'careerProgression',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_leadership_experience',
      sourceNodeId: 'leadership_experience',
      sourceVariable: 'leadershipExperience',
      targetCvField: 'leadershipExperience',
      targetSection: 'experience',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Enhanced Skills
    {
      id: 'map_technical_skills_adv',
      sourceNodeId: 'technical_skills',
      sourceVariable: 'technicalSkills',
      targetCvField: 'skills.technical',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_skill_proficiency',
      sourceNodeId: 'skill_proficiency',
      sourceVariable: 'skillProficiency',
      targetCvField: 'skillProficiency',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_soft_skills_adv',
      sourceNodeId: 'soft_skills',
      sourceVariable: 'softSkills',
      targetCvField: 'skills.soft',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_languages_adv',
      sourceNodeId: 'languages',
      sourceVariable: 'languages',
      targetCvField: 'languages',
      targetSection: 'skills',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Enhanced Education
    {
      id: 'map_education_level_adv',
      sourceNodeId: 'education_level',
      sourceVariable: 'educationLevel',
      targetCvField: 'education.0.degree',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_degree_field_adv',
      sourceNodeId: 'degree_field',
      sourceVariable: 'degreeField',
      targetCvField: 'education.0.field',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_university_adv',
      sourceNodeId: 'university',
      sourceVariable: 'university',
      targetCvField: 'education.0.institution',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.95,
      isActive: true
    },
    {
      id: 'map_graduation_year_adv',
      sourceNodeId: 'graduation_year',
      sourceVariable: 'graduationYear',
      targetCvField: 'education.0.dates',
      targetSection: 'education',
      mappingType: 'transformed',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_gpa_adv',
      sourceNodeId: 'gpa',
      sourceVariable: 'gpa',
      targetCvField: 'education.0.gpa',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_academic_achievements',
      sourceNodeId: 'academic_achievements',
      sourceVariable: 'academicAchievements',
      targetCvField: 'education.0.achievements',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_relevant_coursework',
      sourceNodeId: 'relevant_coursework',
      sourceVariable: 'relevantCoursework',
      targetCvField: 'education.0.coursework',
      targetSection: 'education',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },

    // Additional Professional Sections
    {
      id: 'map_certifications_adv',
      sourceNodeId: 'certifications',
      sourceVariable: 'certifications',
      targetCvField: 'certifications',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_projects_adv',
      sourceNodeId: 'projects',
      sourceVariable: 'projects',
      targetCvField: 'projects',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_publications',
      sourceNodeId: 'publications',
      sourceVariable: 'publications',
      targetCvField: 'publications',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_awards',
      sourceNodeId: 'awards',
      sourceVariable: 'awards',
      targetCvField: 'awards',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_volunteer',
      sourceNodeId: 'volunteer',
      sourceVariable: 'volunteerExperience',
      targetCvField: 'volunteerExperience',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_professional_associations',
      sourceNodeId: 'professional_associations',
      sourceVariable: 'professionalAssociations',
      targetCvField: 'professionalAssociations',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_interests_adv',
      sourceNodeId: 'interests',
      sourceVariable: 'interests',
      targetCvField: 'hobbies',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    },
    {
      id: 'map_references',
      sourceNodeId: 'references',
      sourceVariable: 'references',
      targetCvField: 'references',
      targetSection: 'additional',
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    }
  ],
  transformations: [
    {
      id: 'format_dates_adv',
      field: 'experience.0.dates',
      transformationType: 'format_date',
      parameters: {
        inputFormat: 'MM/YYYY',
        outputFormat: 'MMM YYYY'
      }
    },
    {
      id: 'format_graduation_date_adv',
      field: 'education.0.dates',
      transformationType: 'format_date',
      parameters: {
        inputFormat: 'YYYY',
        outputFormat: 'YYYY'
      }
    },
    {
      id: 'capitalize_names_adv',
      field: 'fullName',
      transformationType: 'capitalize',
      parameters: {
        case: 'title'
      }
    },
    {
      id: 'capitalize_title_adv',
      field: 'title',
      transformationType: 'capitalize',
      parameters: {
        case: 'title'
      }
    },
    {
      id: 'enhance_summary',
      field: 'summary',
      transformationType: 'ai_enhance',
      parameters: {
        prompt: 'Enhance this professional summary to be more compelling and impactful while maintaining the original meaning'
      }
    }
  ],
  validations: [
    {
      id: 'validate_email_adv',
      field: 'contact.email',
      ruleType: 'format',
      parameters: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      },
      errorMessage: 'Please enter a valid email address'
    },
    {
      id: 'validate_phone_adv',
      field: 'contact.phone',
      ruleType: 'format',
      parameters: {
        pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$'
      },
      errorMessage: 'Please enter a valid phone number'
    },
    {
      id: 'validate_summary_length_adv',
      field: 'summary',
      ruleType: 'length',
      parameters: {
        minLength: 100,
        maxLength: 600
      },
      errorMessage: 'Professional summary should be between 100-600 characters'
    },
    {
      id: 'validate_required_fields_adv',
      field: 'fullName',
      ruleType: 'required',
      parameters: {},
      errorMessage: 'Full name is required'
    },
    {
      id: 'validate_industry_specific',
      field: 'industry',
      ruleType: 'required',
      parameters: {},
      errorMessage: 'Industry selection is required for advanced CV'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const smartMappingConfigs = {
  BASIC_CV_MAPPING_CONFIG,
  ADVANCED_CV_MAPPING_CONFIG
};

export default smartMappingConfigs;
