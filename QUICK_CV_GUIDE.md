# Basic CV Builder - Question Flow Guide

## Overview
The Basic CV Builder is designed to create professional CVs efficiently through a standardized conversational flow. This document outlines the complete question path and logic implemented in the system.

## Question Flow Structure

### 1. INTRODUCTION
**Question ID**: `intro`
**Message**: "Welcome to the Basic CV Builder! I'll help you create a professional CV in just a few minutes. Let's start with your basic information."
**Purpose**: Welcome message and flow introduction
**Required**: No
**Logic**: Displayed once at the start

---

### 2. FULL NAME
**Question ID**: `fullName`
**Message**: "What's your full name?"
**Purpose**: Collect user's full name
**Required**: Yes
**Validation**: 
- Must not be empty
- Must be at least 2 characters
**Logic**: 
- Saves to `cvData.fullName`
- Advances to next question on success

---

### 3. EMAIL ADDRESS
**Question ID**: `email`
**Message**: "What's your email address?"
**Purpose**: Collect user's email
**Required**: Yes
**Validation**: 
- Must be valid email format
**Logic**: 
- Saves to `cvData.contact.email`
- Advances to next question on success

---

### 4. PHONE NUMBER
**Question ID**: `phone`
**Message**: "What's your phone number? (Optional)"
**Purpose**: Collect user's phone number
**Required**: No
**Validation**: 
- Optional field
- If provided, must be at least 7 characters
**Logic**: 
- Saves to `cvData.contact.phone`
- Advances to next question on success

---

### 5. LOCATION
**Question ID**: `location`
**Message**: "Where are you located? (City, Country)"
**Purpose**: Collect user's location
**Required**: Yes
**Validation**: 
- Must not be empty
**Logic**: 
- Saves to `cvData.contact.location`
- Advances to next question on success

---

### 6. PROFESSIONAL SUMMARY
**Question ID**: `summary`
**Message**: "Write a brief professional summary about your background and skills"
**Purpose**: Collect professional summary
**Required**: Yes
**Validation**: 
- Must not be empty
- Must be at least 50 characters
**Logic**: 
- Saves to `cvData.summary`
- Advances to next question on success

---

### 7. WORK EXPERIENCE - INTRO
**Question ID**: `experience_intro`
**Message**: "Do you have work experience? (Yes/No)"
**Purpose**: Determine if user has work experience
**Required**: Yes
**Logic**: 
- **If Yes**: Initiates multi-step experience collection
- **If No**: Skips to education section

---

### 8. WORK EXPERIENCE - MULTI-STEP COLLECTION
**Flow**: Only triggered if user answers "Yes" to experience intro

#### 8.1 Job Title
**Step**: `experienceStep === 'title'`
**Message**: "Great! What was your job title?"
**Logic**: 
- Saves to `currentExperience.title`
- Advances to company step

#### 8.2 Company
**Step**: `experienceStep === 'company'`
**Message**: "What company did you work for?"
**Logic**: 
- Saves to `currentExperience.company`
- Advances to dates step

#### 8.3 Dates
**Step**: `experienceStep === 'dates'`
**Message**: "When did you work there? (e.g., "2020 - 2023" or "2021 - Present")"
**Logic**: 
- Saves to `currentExperience.dates`
- Advances to achievements step

#### 8.4 Achievements
**Step**: `experienceStep === 'achievements'`
**Message**: "What were your key achievements? (List them one by one, or type "done" when finished)"
**Logic**: 
- **If "done"**: Saves experience and asks if want to add more
- **If achievement**: Adds to `currentExperience.achievements` array
- Continues until user types "done"

#### 8.5 Add More Experience
**Step**: `experienceStep === 'more'`
**Message**: "Experience added! Do you want to add another job? (Yes/No)"
**Logic**: 
- **If Yes**: Resets `currentExperience` and starts new experience flow
- **If No**: Advances to education section

---

### 9. EDUCATION - INTRO
**Question ID**: `education_intro`
**Message**: "Do you have a study/diploma to add? (Yes/No)"
**Purpose**: Determine if user has education to add
**Required**: Yes
**Logic**: 
- **If Yes**: Initiates multi-step education collection
- **If No**: Skips to skills section

---

### 10. EDUCATION - MULTI-STEP COLLECTION
**Flow**: Only triggered if user answers "Yes" to education intro

#### 10.1 Education Level
**Step**: `educationStep === 'highest_level'`
**Message**: "What's your highest level of education? (e.g., High School, Bachelor's, Master's, PhD)"
**Logic**: 
- Saves to `cvData.highestEducation`
- Advances to degree step

#### 10.2 Degree
**Step**: `educationStep === 'degree'`
**Message**: "What degree did you earn? (e.g., Bachelor of Science, Master of Arts)"
**Logic**: 
- Saves to `currentEducation.degree`
- Advances to institution step

#### 10.3 Institution
**Step**: `educationStep === 'institution'`
**Message**: "What institution did you attend? (e.g., University of Amsterdam)"
**Logic**: 
- Saves to `currentEducation.institution`
- Advances to dates step

#### 10.4 Dates
**Step**: `educationStep === 'dates'`
**Message**: "When did you graduate? (e.g., "2018 - 2022" or "2020")"
**Logic**: 
- Saves to `currentEducation.dates`
- Advances to field step

#### 10.5 Field of Study
**Step**: `educationStep === 'field'`
**Message**: "What was your field of study?"
**Logic**: 
- Saves to `currentEducation.field`
- Advances to achievements step

#### 10.6 Achievements
**Step**: `educationStep === 'achievements'`
**Message**: "What were your key achievements? (List them one by one, or type "done" when finished)"
**Logic**: 
- **If "done"**: Saves education and asks if want to add more
- **If achievement**: Adds to `currentEducation.achievements` array
- Continues until user types "done"

#### 10.7 Add More Education
**Step**: `educationStep === 'more'`
**Message**: "Education added! Do you want to add another degree? (Yes/No)"
**Logic**: 
- **If Yes**: Resets `currentEducation` and starts new education flow
- **If No**: Advances to skills section

---

### 11. SKILLS
**Question ID**: `skills_intro`
**Message**: "What are your key skills? (e.g., JavaScript, Project Management, Leadership, Communication)"
**Purpose**: Collect user's skills
**Required**: Yes
**Logic**: 
- Parses comma-separated input
- Saves to `cvData.skills` array
- Advances to languages section

---

### 12. LANGUAGES
**Question ID**: `languages_intro`
**Message**: "What languages do you speak? (e.g., English, Dutch, Spanish, French)"
**Purpose**: Collect user's languages
**Required**: No
**Logic**: 
- Parses comma-separated input
- Saves to `cvData.languages` array
- Advances to completion

---

### 13. COMPLETION
**Question ID**: `completion`
**Message**: "Congratulations! Your professional CV is complete. You can now preview, download, and share your CV."
**Purpose**: Indicate CV completion
**Required**: No
**Logic**: 
- Sets progress to 100%
- Enables CV preview and download options

---

## State Management

### Key State Variables
- `currentQuestionIndex`: Tracks current question position
- `experienceStep`: Manages experience collection flow (`'intro' | 'title' | 'company' | 'dates' | 'achievements' | 'more'`)
- `educationStep`: Manages education collection flow (`'intro' | 'has_education' | 'highest_level' | 'degree' | 'institution' | 'dates' | 'field' | 'achievements' | 'more'`)
- `educationAnswered`: Prevents duplicate education questions
- `currentExperience`: Temporary storage for experience being collected
- `currentEducation`: Temporary storage for education being collected

### CV Data Structure
```typescript
interface CVData {
  fullName: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    dates: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
    field: string;
    achievements: string[];
  }>;
  skills: string[];
  languages: string[];
  highestEducation?: string;
}
```

## Flow Control Logic

### Experience Flow
1. **Intro**: Ask if user has experience
2. **If No**: Skip to education
3. **If Yes**: Multi-step collection (title → company → dates → achievements → more)

### Education Flow
1. **Intro**: Ask if user has education
2. **If No**: Skip to skills
3. **If Yes**: Multi-step collection (level → degree → institution → dates → field → achievements → more)

### Skip Logic
- Experience: Can skip if no work experience
- Education: Can skip if no education
- Languages: Optional field

### Progress Tracking
- Progress bar updates based on `currentQuestionIndex`
- 100% completion when reaching `completion` question

## Error Handling

### Validation
- Required fields must not be empty
- Email must be valid format
- Phone number minimum length (if provided)
- Summary minimum length (50 characters)

### User Feedback
- Clear error messages for invalid input
- Confirmation messages for successful saves
- Progress indicators throughout the flow

## Special Features

### AI Integration
- AI Check button for analysis (token-based)
- Structured AI templates for consistent responses
- Token management system for different user plans

### CV Preview
- Real-time preview updates
- Professional formatting
- Download and print capabilities

### Data Persistence
- Local storage for token usage
- CV data persistence during session
- Clear CV functionality with confirmation

## Technical Implementation

### File Structure
- `src/app/quick-cv/page.tsx`: Main component
- `src/types/questions-simplified.ts`: Question definitions
- `src/lib/response-handler.ts`: Response processing
- `src/components/CVPreview.tsx`: Preview rendering

### Key Functions
- `handleSendMessage()`: Main message processing
- `getQuestionMessage()`: Message retrieval
- `StandardizedResponseHandler.processResponse()`: Response processing
- `confirmClearCV()`: CV reset functionality

This guide provides a complete overview of the Basic CV Builder's question flow, state management, and technical implementation. 