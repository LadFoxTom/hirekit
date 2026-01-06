# Current CV Builder Question Flow & Logic

## Overview
This document outlines the current question flow in the CV builder, including the sequence, logic, and response handling for each question.

## Question Flow Structure

### 1. INTRODUCTION PHASE
**Question 1: `intro`**
- **Text**: "Welcome to the CV Builder! I'll help you create a professional CV step by step."
- **Purpose**: Welcome message and introduction
- **Response Handling**: No user input expected, automatically moves to next question

### 2. CONTEXT GATHERING PHASE
**Question 2: `career_stage`**
- **Text**: "What best describes your current career stage? (This helps me tailor the questions to your experience level)"
- **Purpose**: Determines experience level for adaptive flow
- **Response Handling**: 
  - Stores in `cvData.careerStage`
  - Affects which questions are asked later
  - Moves to industry sector question

**Question 3: `industry_sector`**
- **Text**: "What industry or sector are you targeting? (This helps customize terminology and relevant sections)"
- **Purpose**: Customizes terminology and relevant sections
- **Response Handling**:
  - Stores in `cvData.industrySector`
  - Affects which optional sections are shown
  - Moves to target region question

**Question 4: `target_region`**
- **Text**: "Which country/region are you creating this CV for? (This affects format and requirements)"
- **Purpose**: Determines CV format and requirements
- **Response Handling**:
  - Stores in `cvData.targetRegion`
  - Affects CV formatting and legal requirements
  - Moves to personal information

### 3. PERSONAL INFORMATION PHASE
**Question 5: `fullName`**
- **Text**: "What's your full name?"
- **Purpose**: Basic personal information
- **Response Handling**: Stores in `cvData.personal.name`

**Question 6: `pronouns`** (Optional)
- **Text**: "What pronouns would you like to use? (optional)"
- **Purpose**: Inclusive language support
- **Response Handling**: Stores in `cvData.personal.pronouns`

**Question 7: `professional_headline`**
- **Text**: "What's your professional headline or tagline? (A brief, compelling statement about your expertise)"
- **Purpose**: Professional branding
- **Response Handling**: Stores in `cvData.personal.headline`

**Question 8: `career_objective`**
- **Text**: "What type of role are you targeting? (Be specific about your career goals)"
- **Purpose**: Career targeting
- **Response Handling**: Stores in `cvData.personal.careerObjective`

**Question 9: `email`**
- **Text**: "What's your email address?"
- **Purpose**: Contact information
- **Response Handling**: Stores in `cvData.personal.email`

**Question 10: `phone`** (Optional)
- **Text**: "What's your phone number? (optional)"
- **Purpose**: Contact information
- **Response Handling**: Stores in `cvData.personal.phone`

**Question 11: `location`**
- **Text**: "Where are you located? (city, country)"
- **Purpose**: Location information
- **Response Handling**: Stores in `cvData.personal.location`

### 4. LEGAL & AVAILABILITY PHASE
**Question 12: `work_authorization`**
- **Text**: "Are you authorized to work in your target region? (Important for international applications)"
- **Purpose**: Legal compliance
- **Response Handling**: Stores in `cvData.personal.workAuthorization`

**Question 13: `availability`** (Optional)
- **Text**: "When can you start a new position? (e.g., 'Immediately', '2 weeks notice', '1 month')"
- **Purpose**: Availability information
- **Response Handling**: Stores in `cvData.personal.availability`

### 5. SOCIAL MEDIA PHASE
**Question 14: `linkedin`** (Optional)
- **Text**: "What's your LinkedIn profile URL? (optional)"
- **Purpose**: Professional networking
- **Response Handling**: Stores in `cvData.personal.linkedin`

**Question 15: `github`** (Optional)
- **Text**: "What's your GitHub profile URL? (optional)"
- **Purpose**: Technical portfolio
- **Response Handling**: Stores in `cvData.personal.github`

**Question 16: `website`** (Optional)
- **Text**: "Do you have a personal website or portfolio? (optional)"
- **Purpose**: Personal branding
- **Response Handling**: Stores in `cvData.personal.website`

**Question 17: `other_social`** (Optional)
- **Text**: "Any other social media profiles you'd like to include? (optional)"
- **Purpose**: Additional online presence
- **Response Handling**: Stores in `cvData.personal.otherSocial`

### 6. PROFESSIONAL SUMMARY PHASE
**Question 18: `summary`**
- **Text**: "Write a 3-4 line professional summary that highlights your experience, key skills, and career goals. Think of this as your elevator pitch."
- **Purpose**: Professional summary
- **Response Handling**: 
  - Stores in `cvData.summary`
  - **CRITICAL**: This question triggers the experience flow logic
  - After summary, asks about relevant experience with options for no experience

### 7. WORK EXPERIENCE PHASE (Multi-step)
**Question 19: `experience_intro`**
- **Text**: "Let's add your work experience. I'll guide you through each position step by step."
- **Purpose**: Introduction to experience collection
- **Response Handling**: Moves to multi-step experience collection

**Experience Multi-step Flow:**
1. **Job Title**: "What's your job title?"
2. **Company**: "What company did you work for as [title]?"
3. **Employment Type**: "What type of employment was this? (Full-time, Part-time, Contract, Internship, Freelance)"
4. **Location**: "Where was this position located? (City, Remote, Hybrid) (optional)"
5. **Current Position**: "Is this your current position? (Yes/No)"
6. **Dates**: "When did you start and end this position? (e.g., January 2020 - Present)"
7. **Achievements**: "Describe 3-5 key achievements in this role. Use numbers and impact where possible"
8. **More Experience**: "Would you like to add another work experience? (Yes/No)"

**Special Logic for No Experience:**
- If user indicates no relevant experience, provides options:
  1. "I have no work experience at all"
  2. "I have experience in a different field"
  3. "I want to focus on education and skills"

### 8. EDUCATION PHASE (Multi-step)
**Question 20: `education_intro`**
- **Text**: "Now let's add your education. What's your highest level of education?"
- **Purpose**: Introduction to education collection
- **Response Handling**: 
  - Stores in `cvData.highestEducation`
  - Moves to multi-step education collection

**Education Multi-step Flow:**
1. **Institution**: "Institution name:"
2. **Degree**: "Degree type: (Bachelor's, Master's, PhD, etc.)"
3. **Field**: "Field of study:"
4. **Dates**: "When did you start and complete this education? (e.g., 2016 - 2020)"
5. **Achievements**: "What were your key achievements? (GPA, honors, relevant coursework, thesis topic) (optional)"
6. **More Education**: "Would you like to add another education entry? (Yes/No)"

### 9. SKILLS PHASE
**Question 21: `skills_intro`**
- **Text**: "Let's organize your skills into categories for better presentation."
- **Purpose**: Introduction to skills collection
- **Response Handling**: Moves to skills categories

**Question 22: `technical_skills`**
- **Text**: "What are your technical skills? (Programming languages, software, technical competencies)"
- **Purpose**: Technical skills collection
- **Response Handling**: Stores in `cvData.skills.technical`

**Question 23: `soft_skills`**
- **Text**: "What are your soft skills? (Leadership, communication, problem-solving, teamwork)"
- **Purpose**: Soft skills collection
- **Response Handling**: Stores in `cvData.skills.soft`

**Question 24: `tools_software`** (Optional)
- **Text**: "What tools and software are you proficient with? (optional)"
- **Purpose**: Tools and software skills
- **Response Handling**: Stores in `cvData.skills.tools`

**Question 25: `industry_knowledge`** (Optional)
- **Text**: "What industry-specific knowledge do you have? (optional)"
- **Purpose**: Industry-specific knowledge
- **Response Handling**: Stores in `cvData.skills.industry`

### 10. OPTIONAL SECTIONS PHASE
**Question 26: `languages`** (Optional)
- **Text**: "What languages do you speak? Include proficiency levels (e.g., 'English - Native', 'Spanish - Fluent', 'French - Intermediate') (optional)"
- **Purpose**: Language skills
- **Response Handling**: Stores in `cvData.languages`

**Question 27: `certifications`** (Optional)
- **Text**: "Do you have any professional certifications or licenses? Include issuing organization and date (optional)"
- **Purpose**: Professional certifications
- **Response Handling**: Stores in `cvData.certifications`

**Question 28: `projects`** (Optional)
- **Text**: "Have you worked on any notable projects? Include technologies used and outcomes (optional)"
- **Purpose**: Project portfolio
- **Response Handling**: Stores in `cvData.projects`

**Question 29: `volunteer_work`** (Optional)
- **Text**: "Do you have any volunteer experience? Include organization, role, and impact (optional)"
- **Purpose**: Volunteer experience
- **Response Handling**: Stores in `cvData.volunteer`

**Question 30: `awards_recognition`** (Optional)
- **Text**: "Have you received any awards or recognition? Include organization and year (optional)"
- **Purpose**: Awards and recognition
- **Response Handling**: Stores in `cvData.awards`

**Question 31: `professional_memberships`** (Optional)
- **Text**: "Are you a member of any professional associations or organizations? (optional)"
- **Purpose**: Professional memberships
- **Response Handling**: Stores in `cvData.memberships`

**Question 32: `publications_research`** (Optional, Conditional)
- **Text**: "Do you have any publications, research papers, or presentations? Include citations (optional)"
- **Purpose**: Academic/research publications
- **Response Handling**: Stores in `cvData.publications`
- **Skip Condition**: Only shown if `industrySector` is 'academic' or 'research'

**Question 33: `references`** (Optional)
- **Text**: "Do you have professional references available upon request? (optional)"
- **Purpose**: References availability
- **Response Handling**: Stores in `cvData.references`

**Question 34: `hobbies`** (Optional)
- **Text**: "List 2-3 hobbies or interests that demonstrate transferable skills or cultural fit (optional)"
- **Purpose**: Personal interests
- **Response Handling**: Stores in `cvData.hobbies`

### 11. PREFERENCES & QUALITY PHASE
**Question 35: `template_preference`** (Optional)
- **Text**: "Do you have a preference for the CV template style? (Modern, Classic, Creative, Minimal) (optional)"
- **Purpose**: Template preference
- **Response Handling**: Stores in `cvData.template`

**Question 36: `quality_review`** (Optional)
- **Text**: "Would you like me to review this section for common mistakes and suggest improvements? (optional)"
- **Purpose**: Quality review
- **Response Handling**: Triggers AI analysis if requested

### 12. COMPLETION PHASE
**Question 37: `completion`**
- **Text**: "Congratulations! Your CV is complete. You can now preview, download, and share your professional CV."
- **Purpose**: Completion message
- **Response Handling**: Marks CV as complete

## Current Issues with Response Handling

### 1. **Inconsistent Flow Logic**
- The `summary` question triggers experience flow, but the logic is complex and can cause loops
- Experience multi-step flow doesn't properly handle "no experience" scenarios
- Education flow doesn't properly transition to skills

### 2. **Missing Standardization**
- No standardized response validation
- No clear error handling for invalid inputs
- No consistent acknowledgment messages

### 3. **AI Integration Issues**
- AI analysis is not properly integrated into the flow
- No clear triggers for when AI should analyze
- AI suggestions are not automatically applied

### 4. **Skip Logic Problems**
- Optional questions don't have clear skip logic
- Conditional questions (like publications) may not work properly
- No clear indication of which questions are optional

## Recommendations for Standardization

### 1. **Standardize Response Handling**
- Create consistent acknowledgment messages for each question
- Implement proper validation for each input type
- Add clear error messages for invalid inputs

### 2. **Simplify Multi-step Flows**
- Make experience and education flows more linear
- Add clear progress indicators for multi-step processes
- Provide better guidance for "no experience" scenarios

### 3. **Improve AI Integration**
- Define clear triggers for AI analysis
- Create standardized AI response handling
- Implement automatic application of AI suggestions

### 4. **Add Flow Control**
- Implement proper skip logic for optional questions
- Add clear indicators for optional vs. required questions
- Create better transition logic between sections

## Total Questions: 37
- **Required**: ~20 questions
- **Optional**: ~17 questions
- **Conditional**: 1 question (publications_research)

This flow provides a comprehensive CV building experience but needs standardization for better user experience and consistent response handling. 