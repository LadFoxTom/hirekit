# CV Builder Questions - Current Implementation

## Overview
This document provides a complete overview of all questions currently implemented in the CV Builder. The questions are organized by sections and follow a logical flow to gather comprehensive CV information.

## Question Structure
Each question has the following properties:
- **ID**: Unique identifier for the question
- **Section**: Category the question belongs to
- **Text**: The actual question text shown to users
- **Optional**: Whether the question is optional (default: required)

---

## 1. Introduction
**ID**: `intro`  
**Section**: `introduction`  
**Text**: "Welcome to the CV Builder! I'll help you create a professional CV step by step. Let's start by gathering your basic information."  
**Optional**: No (this is the welcome message)

---

## 2. Personal Information

### 2.1 Full Name
**ID**: `fullName`  
**Section**: `personal`  
**Text**: "What's your full name?"  
**Optional**: No

### 2.2 Job Title
**ID**: `title`  
**Section**: `personal`  
**Text**: "What job title would you like to use on your CV? (Your current position or the position you're applying for)"  
**Optional**: No

### 2.3 Email Address
**ID**: `email`  
**Section**: `personal`  
**Text**: "What's your email address?"  
**Optional**: No

### 2.4 Phone Number
**ID**: `phone`  
**Section**: `personal`  
**Text**: "What's your phone number? (optional)"  
**Optional**: Yes

### 2.5 Location
**ID**: `location`  
**Section**: `personal`  
**Text**: "Where are you located? (city, country)"  
**Optional**: No

---

## 3. Social Media Links

### 3.1 LinkedIn Profile
**ID**: `linkedin`  
**Section**: `social`  
**Text**: "What's your LinkedIn profile URL? (optional)"  
**Optional**: Yes

### 3.2 GitHub Profile
**ID**: `github`  
**Section**: `social`  
**Text**: "What's your GitHub profile URL? (optional)"  
**Optional**: Yes

### 3.3 Personal Website
**ID**: `website`  
**Section**: `social`  
**Text**: "Do you have a personal website or portfolio? (optional)"  
**Optional**: Yes

### 3.4 Other Social Media
**ID**: `other_social`  
**Section**: `social`  
**Text**: "Any other social media profiles you'd like to include? (optional)"  
**Optional**: Yes

---

## 4. Professional Summary
**ID**: `summary`  
**Section**: `summary`  
**Text**: "Tell me about your professional background and career goals. What makes you unique?"  
**Optional**: No

---

## 5. Work Experience

### 5.1 Experience Introduction
**ID**: `experience_intro`  
**Section**: `experience`  
**Text**: "Let's add your work experience. What's the most recent position you've held?"  
**Optional**: No

### 5.2 Experience Dates
**ID**: `experience_dates`  
**Section**: `experience`  
**Text**: "When did you start and end this position? (e.g., January 2020 - Present)"  
**Optional**: No

### 5.3 Experience Details
**ID**: `experience_details`  
**Section**: `experience`  
**Text**: "What were your main responsibilities and achievements in this role?"  
**Optional**: No

### 5.4 More Experience
**ID**: `experience_more`  
**Section**: `experience`  
**Text**: "Would you like to add another work experience? (optional)"  
**Optional**: Yes

---

## 6. Education

### 6.1 Education Introduction
**ID**: `education_intro`  
**Section**: `education`  
**Text**: "Now let's add your education. What's your highest level of education?"  
**Optional**: No

### 6.2 Education Dates
**ID**: `education_dates`  
**Section**: `education`  
**Text**: "When did you start and complete this education? (e.g., 2016 - 2020)"  
**Optional**: No

### 6.3 Education Details
**ID**: `education_details`  
**Section**: `education`  
**Text**: "What did you study and what were your key achievements?"  
**Optional**: No

### 6.4 More Education
**ID**: `education_more`  
**Section**: `education`  
**Text**: "Would you like to add another education entry? (optional)"  
**Optional**: Yes

---

## 7. Skills
**ID**: `skills`  
**Section**: `skills`  
**Text**: "What are your key skills and competencies? (e.g., JavaScript, Project Management, Leadership)"  
**Optional**: No

---

## 8. Languages
**ID**: `languages`  
**Section**: `languages`  
**Text**: "What languages do you speak? (optional)"  
**Optional**: Yes

---

## 9. Hobbies & Interests
**ID**: `hobbies`  
**Section**: `hobbies`  
**Text**: "What are your interests and activities outside of work? (optional)"  
**Optional**: Yes

---

## 10. Certifications
**ID**: `certifications`  
**Section**: `certifications`  
**Text**: "Do you have any professional certifications or licenses? (optional)"  
**Optional**: Yes

---

## 11. Projects
**ID**: `projects`  
**Section**: `projects`  
**Text**: "Have you worked on any notable projects? (optional)"  
**Optional**: Yes

---

## 12. Template Preference
**ID**: `template_preference`  
**Section**: `preferences`  
**Text**: "Do you have a preference for the CV template style? (optional)"  
**Optional**: Yes

---

## 13. Completion
**ID**: `completion`  
**Section**: `completion`  
**Text**: "Excellent! Your CV is ready. You can now edit, customize, and download it. What would you like to do next?"  
**Optional**: No

### Available Commands After Completion:
- Type 'edit [section]' to modify a specific section
- Type 'switch template [name]' to change your CV template
- Type 'add photo' to include a profile picture
- Type 'clear' to start over
- Type 'download' to save your CV as a PDF

---

## Summary Statistics

- **Total Questions**: 25
- **Required Questions**: 12
- **Optional Questions**: 13
- **Sections**: 8 (introduction, personal, social, summary, experience, education, skills, languages, hobbies, certifications, projects, preferences, completion)

## Question Flow
1. **Introduction** → Welcome message
2. **Personal Information** → Basic contact details
3. **Social Media** → Professional online presence
4. **Professional Summary** → Career overview
5. **Work Experience** → Employment history (with option to add multiple)
6. **Education** → Academic background (with option to add multiple)
7. **Skills** → Key competencies
8. **Languages** → Language proficiency
9. **Hobbies & Interests** → Personal interests
10. **Certifications** → Professional credentials
11. **Projects** → Notable projects
12. **Template Preference** → Visual style preference
13. **Completion** → Final instructions and next steps

---

## Feedback Areas to Consider

1. **Question Order**: Is the current flow logical and user-friendly?
2. **Question Clarity**: Are the questions clear and easy to understand?
3. **Optional vs Required**: Are the right questions marked as optional?
4. **Missing Sections**: Are there any important CV sections missing?
5. **Question Wording**: Could any questions be worded better?
6. **Additional Questions**: Are there any questions that should be added?
7. **Question Complexity**: Are any questions too complex or too simple?
8. **Cultural Considerations**: Are the questions appropriate for different cultures/regions? 