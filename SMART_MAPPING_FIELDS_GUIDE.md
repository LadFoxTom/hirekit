# Smart CV Mapping Fields Guide

## Table of Contents
1. [Overview](#overview)
2. [CV Data Structure](#cv-data-structure)
3. [Available Mapping Fields](#available-mapping-fields)
4. [Mapping Types](#mapping-types)
5. [Data Transformations](#data-transformations)
6. [Validation Rules](#validation-rules)
7. [Conditional Mapping](#conditional-mapping)
8. [Import/Export Configuration](#importexport-configuration)
9. [Complete Examples](#complete-examples)
10. [Best Practices](#best-practices)
11. [API Reference](#api-reference)

## Overview

The Smart CV Mapping system intelligently connects chatbot flow responses to CV document fields. This guide provides comprehensive documentation of all available CV fields, mapping types, transformations, and validation rules that developers can use to create sophisticated mapping configurations.

### Key Features
- **AI-Powered Field Detection**: Automatically suggests optimal field mappings
- **Conditional Logic**: Map fields based on user responses and context
- **Data Transformations**: Format and enhance data before mapping
- **Validation Rules**: Ensure data quality and completeness
- **Import/Export**: Share and version control mapping configurations

## CV Data Structure

The CV data structure is organized into logical sections with nested fields:

```typescript
interface CVData {
  // Personal Information
  fullName?: string
  pronouns?: string
  professionalHeadline?: string
  careerObjective?: string
  title?: string
  
  // Contact Information
  contact?: {
    email?: string
    phone?: string
    location?: string
  }
  
  // Career Context
  careerStage?: 'student' | 'recent_graduate' | 'career_changer' | 'experienced'
  industrySector?: string
  targetRegion?: string
  
  // Work Authorization & Availability
  workAuthorization?: string
  availability?: string
  
  // Social Links
  social?: {
    linkedin?: string
    github?: string
    website?: string
    twitter?: string
    instagram?: string
  }
  
  // Professional Summary
  summary?: string
  
  // Education Level
  highestEducation?: string
  
  // Experience (Array)
  experience?: Array<{
    company?: string
    title: string
    type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'
    location?: string
    current?: boolean
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>
  
  // Education (Array)
  education?: Array<{
    institution?: string
    degree?: string
    field?: string
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>
  
  // Skills (Object or Array)
  skills?: {
    technical?: string[]
    soft?: string[]
    tools?: string[]
    industry?: string[]
  } | string[] // Legacy support
  
  // Additional Sections
  languages?: string[]
  hobbies?: string[]
  certifications?: CVSection[]
  projects?: CVSection[]
  volunteerWork?: CVSection[]
  awardsRecognition?: CVSection[]
  professionalMemberships?: string[]
  publicationsResearch?: CVSection[]
  references?: string
  
  // Layout & Styling
  photoUrl?: string
  template?: string
  layout?: LayoutConfig
}
```

## Available Mapping Fields

### 1. Personal Information Fields

#### Basic Personal Data
```json
{
  "field": "fullName",
  "description": "Complete name as it should appear on CV",
  "type": "string",
  "validation": ["required", "minLength:2", "maxLength:100"],
  "transformations": ["capitalize", "trim"]
}
```

```json
{
  "field": "pronouns",
  "description": "Preferred pronouns (e.g., he/him, she/her, they/them)",
  "type": "string",
  "validation": ["optional"],
  "transformations": ["lowercase"]
}
```

```json
{
  "field": "professionalHeadline",
  "description": "Professional headline or tagline",
  "type": "string",
  "validation": ["maxLength:150"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "careerObjective",
  "description": "Career objective or goal statement",
  "type": "string",
  "validation": ["maxLength:500"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "title",
  "description": "Current or desired job title",
  "type": "string",
  "validation": ["required", "maxLength:100"],
  "transformations": ["capitalize"]
}
```

### 2. Contact Information Fields

#### Email
```json
{
  "field": "contact.email",
  "description": "Primary email address",
  "type": "string",
  "validation": ["required", "email"],
  "transformations": ["lowercase", "trim"]
}
```

#### Phone
```json
{
  "field": "contact.phone",
  "description": "Primary phone number",
  "type": "string",
  "validation": ["phone"],
  "transformations": ["format_phone"]
}
```

#### Location
```json
{
  "field": "contact.location",
  "description": "Current location (city, state/country)",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

### 3. Career Context Fields

#### Career Stage
```json
{
  "field": "careerStage",
  "description": "Current career stage",
  "type": "enum",
  "options": ["student", "recent_graduate", "career_changer", "experienced"],
  "validation": ["required"],
  "transformations": ["lowercase"]
}
```

#### Industry Sector
```json
{
  "field": "industrySector",
  "description": "Target industry or sector",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

#### Target Region
```json
{
  "field": "targetRegion",
  "description": "Geographic region for job search",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

### 4. Work Authorization & Availability

```json
{
  "field": "workAuthorization",
  "description": "Work authorization status",
  "type": "string",
  "validation": ["maxLength:200"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "availability",
  "description": "Availability for work",
  "type": "string",
  "validation": ["maxLength:200"],
  "transformations": ["capitalize"]
}
```

### 5. Social Links

```json
{
  "field": "social.linkedin",
  "description": "LinkedIn profile URL",
  "type": "string",
  "validation": ["url"],
  "transformations": ["normalize_url"]
}
```

```json
{
  "field": "social.github",
  "description": "GitHub profile URL",
  "type": "string",
  "validation": ["url"],
  "transformations": ["normalize_url"]
}
```

```json
{
  "field": "social.website",
  "description": "Personal or professional website",
  "type": "string",
  "validation": ["url"],
  "transformations": ["normalize_url"]
}
```

### 6. Professional Summary

```json
{
  "field": "summary",
  "description": "Professional summary or objective",
  "type": "string",
  "validation": ["maxLength:1000"],
  "transformations": ["capitalize", "ai_enhance"]
}
```

### 7. Education Level

```json
{
  "field": "highestEducation",
  "description": "Highest level of education completed",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

### 8. Experience Fields (Array)

#### Individual Experience Entry
```json
{
  "field": "experience.0.title",
  "description": "Job title for first experience entry",
  "type": "string",
  "validation": ["required", "maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "experience.0.company",
  "description": "Company name for first experience entry",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "experience.0.type",
  "description": "Employment type",
  "type": "enum",
  "options": ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
  "validation": ["required"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "experience.0.location",
  "description": "Work location",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "experience.0.current",
  "description": "Whether this is current position",
  "type": "boolean",
  "validation": ["required"],
  "transformations": ["boolean_parse"]
}
```

```json
{
  "field": "experience.0.dates",
  "description": "Employment dates",
  "type": "string",
  "validation": ["maxLength:50"],
  "transformations": ["format_date"]
}
```

```json
{
  "field": "experience.0.achievements",
  "description": "Key achievements and accomplishments",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "bullet_points"]
}
```

### 9. Education Fields (Array)

#### Individual Education Entry
```json
{
  "field": "education.0.institution",
  "description": "Educational institution name",
  "type": "string",
  "validation": ["required", "maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "education.0.degree",
  "description": "Degree or qualification",
  "type": "string",
  "validation": ["required", "maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "education.0.field",
  "description": "Field of study",
  "type": "string",
  "validation": ["maxLength:100"],
  "transformations": ["capitalize"]
}
```

```json
{
  "field": "education.0.dates",
  "description": "Education dates",
  "type": "string",
  "validation": ["maxLength:50"],
  "transformations": ["format_date"]
}
```

```json
{
  "field": "education.0.achievements",
  "description": "Academic achievements",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "bullet_points"]
}
```

### 10. Skills Fields

#### Technical Skills
```json
{
  "field": "skills.technical",
  "description": "Technical and hard skills",
  "type": "array",
  "validation": ["maxItems:20"],
  "transformations": ["capitalize", "remove_duplicates", "sort"]
}
```

#### Soft Skills
```json
{
  "field": "skills.soft",
  "description": "Soft skills and interpersonal abilities",
  "type": "array",
  "validation": ["maxItems:15"],
  "transformations": ["capitalize", "remove_duplicates", "sort"]
}
```

#### Tools
```json
{
  "field": "skills.tools",
  "description": "Software tools and technologies",
  "type": "array",
  "validation": ["maxItems:20"],
  "transformations": ["capitalize", "remove_duplicates", "sort"]
}
```

#### Industry Skills
```json
{
  "field": "skills.industry",
  "description": "Industry-specific skills",
  "type": "array",
  "validation": ["maxItems:15"],
  "transformations": ["capitalize", "remove_duplicates", "sort"]
}
```

### 11. Additional Sections

#### Languages
```json
{
  "field": "languages",
  "description": "Languages spoken with proficiency levels",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "format_language_proficiency"]
}
```

#### Hobbies
```json
{
  "field": "hobbies",
  "description": "Personal interests and hobbies",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "remove_duplicates"]
}
```

#### Certifications
```json
{
  "field": "certifications",
  "description": "Professional certifications and licenses",
  "type": "array",
  "validation": ["maxItems:20"],
  "transformations": ["capitalize", "format_certification"]
}
```

#### Projects
```json
{
  "field": "projects",
  "description": "Personal or professional projects",
  "type": "array",
  "validation": ["maxItems:15"],
  "transformations": ["capitalize", "format_project"]
}
```

#### Volunteer Work
```json
{
  "field": "volunteerWork",
  "description": "Volunteer experience and community involvement",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "format_volunteer"]
}
```

#### Awards & Recognition
```json
{
  "field": "awardsRecognition",
  "description": "Awards, honors, and recognition",
  "type": "array",
  "validation": ["maxItems:15"],
  "transformations": ["capitalize", "format_award"]
}
```

#### Professional Memberships
```json
{
  "field": "professionalMemberships",
  "description": "Professional associations and memberships",
  "type": "array",
  "validation": ["maxItems:10"],
  "transformations": ["capitalize", "remove_duplicates"]
}
```

#### Publications & Research
```json
{
  "field": "publicationsResearch",
  "description": "Publications, research, and academic work",
  "type": "array",
  "validation": ["maxItems:20"],
  "transformations": ["capitalize", "format_publication"]
}
```

#### References
```json
{
  "field": "references",
  "description": "Professional references",
  "type": "string",
  "validation": ["maxLength:500"],
  "transformations": ["capitalize"]
}
```

## Mapping Types

### 1. Direct Mapping
Maps flow variable directly to CV field without conditions.

```json
{
  "id": "map_full_name",
  "sourceNodeId": "personal_info",
  "sourceVariable": "fullName",
  "targetCvField": "fullName",
  "targetSection": "personal",
  "mappingType": "direct",
  "priority": 1,
  "confidence": 0.95,
  "isActive": true
}
```

### 2. Conditional Mapping
Maps based on specific conditions or user responses.

```json
{
  "id": "map_experience_by_level",
  "sourceNodeId": "experience_question",
  "sourceVariable": "experience",
  "targetCvField": "experience.0.title",
  "targetSection": "experience",
  "mappingType": "conditional",
  "conditions": [
    {
      "field": "experienceLevel",
      "operator": "equals",
      "value": "senior"
    }
  ],
  "priority": 1,
  "confidence": 0.9,
  "isActive": true
}
```

### 3. Aggregated Mapping
Combines multiple flow variables into a single CV field.

```json
{
  "id": "map_skills_aggregated",
  "sourceNodeId": "skills_question",
  "sourceVariable": "allSkills",
  "targetCvField": "skills.technical",
  "targetSection": "skills",
  "mappingType": "aggregated",
  "priority": 1,
  "confidence": 0.85,
  "isActive": true
}
```

### 4. Transformed Mapping
Applies data transformations before mapping.

```json
{
  "id": "map_phone_formatted",
  "sourceNodeId": "contact_info",
  "sourceVariable": "phone",
  "targetCvField": "contact.phone",
  "targetSection": "contact",
  "mappingType": "transformed",
  "priority": 1,
  "confidence": 0.95,
  "isActive": true
}
```

## Data Transformations

### 1. Text Transformations

#### Capitalize
```json
{
  "id": "capitalize_names",
  "field": "fullName",
  "transformationType": "capitalize",
  "parameters": {
    "mode": "title_case"
  }
}
```

#### Trim
```json
{
  "id": "trim_whitespace",
  "field": "email",
  "transformationType": "trim",
  "parameters": {}
}
```

#### Lowercase
```json
{
  "id": "lowercase_email",
  "field": "contact.email",
  "transformationType": "lowercase",
  "parameters": {}
}
```

### 2. Date Transformations

#### Format Date
```json
{
  "id": "format_dates",
  "field": "experience.0.dates",
  "transformationType": "format_date",
  "parameters": {
    "inputFormat": "MM/YYYY",
    "outputFormat": "MMM YYYY"
  }
}
```

### 3. Phone Transformations

#### Format Phone
```json
{
  "id": "format_phone",
  "field": "contact.phone",
  "transformationType": "format_phone",
  "parameters": {
    "format": "international",
    "countryCode": "US"
  }
}
```

### 4. URL Transformations

#### Normalize URL
```json
{
  "id": "normalize_linkedin",
  "field": "social.linkedin",
  "transformationType": "normalize_url",
  "parameters": {
    "addProtocol": true,
    "removeTrailingSlash": true
  }
}
```

### 5. Array Transformations

#### Remove Duplicates
```json
{
  "id": "remove_duplicate_skills",
  "field": "skills.technical",
  "transformationType": "remove_duplicates",
  "parameters": {
    "caseSensitive": false
  }
}
```

#### Sort
```json
{
  "id": "sort_skills",
  "field": "skills.technical",
  "transformationType": "sort",
  "parameters": {
    "order": "alphabetical"
  }
}
```

### 6. AI-Enhanced Transformations

#### AI Enhance
```json
{
  "id": "enhance_summary",
  "field": "summary",
  "transformationType": "ai_enhance",
  "parameters": {
    "prompt": "Improve this professional summary to be more compelling and concise",
    "maxLength": 500
  },
  "aiPrompt": "Rewrite this professional summary to be more impactful and concise while maintaining the original meaning"
}
```

#### Extract Keywords
```json
{
  "id": "extract_skills",
  "field": "skills.technical",
  "transformationType": "extract_keywords",
  "parameters": {
    "sourceField": "experience.0.achievements",
    "category": "technical_skills"
  },
  "aiPrompt": "Extract technical skills and tools from this experience description"
}
```

## Validation Rules

### 1. Required Validation
```json
{
  "id": "require_full_name",
  "field": "fullName",
  "ruleType": "required",
  "parameters": {},
  "errorMessage": "Full name is required"
}
```

### 2. Format Validation
```json
{
  "id": "validate_email",
  "field": "contact.email",
  "ruleType": "format",
  "parameters": {
    "pattern": "email"
  },
  "errorMessage": "Please enter a valid email address"
}
```

### 3. Length Validation
```json
{
  "id": "validate_summary_length",
  "field": "summary",
  "ruleType": "length",
  "parameters": {
    "minLength": 50,
    "maxLength": 1000
  },
  "errorMessage": "Summary must be between 50 and 1000 characters"
}
```

### 4. AI Validation
```json
{
  "id": "ai_validate_experience",
  "field": "experience.0.achievements",
  "ruleType": "ai_validate",
  "parameters": {
    "checkRelevance": true,
    "checkCompleteness": true
  },
  "errorMessage": "Experience description could be improved",
  "aiPrompt": "Validate that this experience description is relevant, complete, and professional"
}
```

## Conditional Mapping

### 1. Simple Conditions
```json
{
  "conditions": [
    {
      "field": "experienceLevel",
      "operator": "equals",
      "value": "senior"
    }
  ]
}
```

### 2. Complex Conditions
```json
{
  "conditions": [
    {
      "field": "industrySector",
      "operator": "equals",
      "value": "technology"
    },
    {
      "field": "experienceLevel",
      "operator": "in_list",
      "value": "mid,senior"
    }
  ]
}
```

### 3. AI Classification
```json
{
  "conditions": [
    {
      "field": "userInput",
      "operator": "ai_classify",
      "value": "technical_role",
      "aiPrompt": "Classify if this role description is for a technical position"
    }
  ]
}
```

## Import/Export Configuration

### 1. Export Mapping Configuration
```json
{
  "id": "basic_cv_mapping",
  "name": "Basic CV Builder Mapping",
  "description": "Smart mapping configuration for Basic CV Builder flow",
  "flowId": "basic_cv_flow",
  "industryContext": "Universal",
  "mappings": [...],
  "transformations": [...],
  "validations": [...],
  "userPreferences": {
    "preferredDateFormat": "MMM YYYY",
    "nameFormat": "first_last",
    "experienceOrder": "chronological",
    "skillCategorization": "automatic",
    "languageStyle": "formal"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Import Mapping Configuration
```json
{
  "action": "import",
  "config": {
    "id": "imported_mapping",
    "name": "Imported Mapping Configuration",
    "description": "Mapping configuration imported from external source",
    "flowId": "target_flow_id",
    "mappings": [...],
    "transformations": [...],
    "validations": [...]
  }
}
```

## Complete Examples

### 1. Basic Personal Information Mapping
```json
{
  "id": "personal_info_mapping",
  "name": "Personal Information Mapping",
  "description": "Maps basic personal information fields",
  "flowId": "personal_info_flow",
  "mappings": [
    {
      "id": "map_full_name",
      "sourceNodeId": "full_name_question",
      "sourceVariable": "fullName",
      "targetCvField": "fullName",
      "targetSection": "personal",
      "mappingType": "direct",
      "priority": 1,
      "confidence": 0.95,
      "isActive": true
    },
    {
      "id": "map_email",
      "sourceNodeId": "email_question",
      "sourceVariable": "email",
      "targetCvField": "contact.email",
      "targetSection": "contact",
      "mappingType": "direct",
      "priority": 1,
      "confidence": 0.98,
      "isActive": true
    },
    {
      "id": "map_phone",
      "sourceNodeId": "phone_question",
      "sourceVariable": "phone",
      "targetCvField": "contact.phone",
      "targetSection": "contact",
      "mappingType": "transformed",
      "priority": 1,
      "confidence": 0.95,
      "isActive": true
    }
  ],
  "transformations": [
    {
      "id": "format_phone",
      "field": "contact.phone",
      "transformationType": "format_phone",
      "parameters": {
        "format": "international",
        "countryCode": "US"
      }
    }
  ],
  "validations": [
    {
      "id": "validate_email",
      "field": "contact.email",
      "ruleType": "format",
      "parameters": {
        "pattern": "email"
      },
      "errorMessage": "Please enter a valid email address"
    }
  ]
}
```

### 2. Experience-Based Conditional Mapping
```json
{
  "id": "experience_conditional_mapping",
  "name": "Experience Conditional Mapping",
  "description": "Maps experience based on user's career level",
  "flowId": "experience_flow",
  "mappings": [
    {
      "id": "map_junior_experience",
      "sourceNodeId": "experience_question",
      "sourceVariable": "experience",
      "targetCvField": "experience.0.title",
      "targetSection": "experience",
      "mappingType": "conditional",
      "conditions": [
        {
          "field": "experienceLevel",
          "operator": "equals",
          "value": "junior"
        }
      ],
      "priority": 1,
      "confidence": 0.9,
      "isActive": true
    },
    {
      "id": "map_senior_experience",
      "sourceNodeId": "experience_question",
      "sourceVariable": "experience",
      "targetCvField": "experience.0.title",
      "targetSection": "experience",
      "mappingType": "conditional",
      "conditions": [
        {
          "field": "experienceLevel",
          "operator": "in_list",
          "value": "mid,senior,expert"
        }
      ],
      "priority": 1,
      "confidence": 0.9,
      "isActive": true
    }
  ]
}
```

### 3. Skills Aggregation Mapping
```json
{
  "id": "skills_aggregation_mapping",
  "name": "Skills Aggregation Mapping",
  "description": "Aggregates and categorizes skills from multiple sources",
  "flowId": "skills_flow",
  "mappings": [
    {
      "id": "map_technical_skills",
      "sourceNodeId": "technical_skills_question",
      "sourceVariable": "technicalSkills",
      "targetCvField": "skills.technical",
      "targetSection": "skills",
      "mappingType": "aggregated",
      "priority": 1,
      "confidence": 0.85,
      "isActive": true
    },
    {
      "id": "map_soft_skills",
      "sourceNodeId": "soft_skills_question",
      "sourceVariable": "softSkills",
      "targetCvField": "skills.soft",
      "targetSection": "skills",
      "mappingType": "aggregated",
      "priority": 1,
      "confidence": 0.85,
      "isActive": true
    }
  ],
  "transformations": [
    {
      "id": "process_technical_skills",
      "field": "skills.technical",
      "transformationType": "extract_keywords",
      "parameters": {
        "sourceField": "technicalSkills",
        "category": "technical"
      }
    },
    {
      "id": "remove_duplicate_skills",
      "field": "skills.technical",
      "transformationType": "remove_duplicates",
      "parameters": {
        "caseSensitive": false
      }
    },
    {
      "id": "sort_skills",
      "field": "skills.technical",
      "transformationType": "sort",
      "parameters": {
        "order": "alphabetical"
      }
    }
  ]
}
```

## Best Practices

### 1. Field Mapping Strategy
- **Use descriptive IDs**: `map_full_name` instead of `mapping_1`
- **Set appropriate priorities**: Higher priority for critical fields
- **Include confidence scores**: Help with mapping quality assessment
- **Use conditional mapping**: For context-dependent fields

### 2. Data Transformation
- **Apply transformations early**: Before validation
- **Use AI enhancements sparingly**: For complex content improvement
- **Chain transformations**: Multiple transformations for complex data
- **Test transformations**: Ensure they work with real data

### 3. Validation Rules
- **Validate early**: Catch errors before mapping
- **Provide clear error messages**: Help users understand issues
- **Use appropriate validation types**: Match validation to data type
- **Consider AI validation**: For complex content validation

### 4. Performance Optimization
- **Limit mapping complexity**: Avoid overly complex conditions
- **Use efficient transformations**: Prefer simple transformations
- **Cache mapping results**: For frequently used mappings
- **Monitor mapping performance**: Track success rates

### 5. Error Handling
- **Provide fallback mappings**: For when primary mappings fail
- **Log mapping errors**: For debugging and improvement
- **Graceful degradation**: Continue with partial mappings
- **User feedback**: Allow users to correct mapping errors

## API Reference

### 1. Create Mapping Configuration
```http
POST /api/smart-mapping/config
Content-Type: application/json

{
  "flowId": "flow_id",
  "name": "Mapping Configuration Name",
  "description": "Description of the mapping",
  "industryContext": "Technology",
  "mappings": [...],
  "transformations": [...],
  "validations": [...]
}
```

### 2. Update Mapping Configuration
```http
PUT /api/smart-mapping/config/{configId}
Content-Type: application/json

{
  "name": "Updated Name",
  "mappings": [...],
  "transformations": [...],
  "validations": [...]
}
```

### 3. Process User Input
```http
POST /api/smart-mapping/process
Content-Type: application/json

{
  "flowId": "flow_id",
  "userInput": "User's response",
  "conversationHistory": [...],
  "currentNode": {...},
  "flowState": {...}
}
```

### 4. Generate Mapping Suggestions
```http
POST /api/smart-mapping/suggestions
Content-Type: application/json

{
  "flowId": "flow_id",
  "flowNodes": [...],
  "cvTemplate": {...}
}
```

### 5. Export Mapping Configuration
```http
GET /api/smart-mapping/config/{configId}/export
```

### 6. Import Mapping Configuration
```http
POST /api/smart-mapping/import
Content-Type: application/json

{
  "config": {...}
}
```

---

This guide provides comprehensive documentation for all available CV fields, mapping types, transformations, and validation rules. Use this as a reference when creating mapping configurations for your chatbot flows.
