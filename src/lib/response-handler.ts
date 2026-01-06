// @ts-nocheck
import { SimplifiedQuestion, STANDARD_RESPONSES } from '@/types/questions-simplified';
import { CVData } from '@/types/cv';

export interface ResponseResult {
  success: boolean;
  message: string;
  shouldMoveToNext: boolean;
  cvDataUpdate?: Partial<CVData>;
  error?: string;
}

export class StandardizedResponseHandler {
  
  static processResponse(
    question: SimplifiedQuestion,
    userInput: string,
    cvData: CVData
  ): ResponseResult {
    
    // Handle empty input for optional questions
    if (!question.required && (!userInput || userInput.trim() === '')) {
      return {
        success: true,
        message: STANDARD_RESPONSES.SKIP_OPTIONAL,
        shouldMoveToNext: true
      };
    }
    
    // Validate input if validation function exists
    if (question.validation) {
      const validation = question.validation(userInput);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.error || STANDARD_RESPONSES.VALIDATION_ERROR,
          shouldMoveToNext: false,
          error: validation.error
        };
      }
    }
    
    // Process the response based on question type
    try {
      const result = this.processQuestionResponse(question, userInput, cvData);
      
      return {
        success: true,
        message: question.acknowledgment || STANDARD_RESPONSES.SUCCESS,
        shouldMoveToNext: true,
        cvDataUpdate: result
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : STANDARD_RESPONSES.VALIDATION_ERROR,
        shouldMoveToNext: false,
        error: error instanceof Error ? error.message : undefined
      };
    }
  }
  
  private static processQuestionResponse(
    question: SimplifiedQuestion,
    userInput: string,
    cvData: CVData
  ): Partial<CVData> {
    
    switch (question.id) {
      case 'fullName':
        return {
          fullName: userInput.trim()
        };
        
      case 'email':
        return {
          contact: {
            ...cvData.contact,
            email: userInput.trim()
          }
        };
        
      case 'phone':
        return {
          contact: {
            ...cvData.contact,
            phone: userInput.trim()
          }
        };
        
      case 'location':
        return {
          contact: {
            ...cvData.contact,
            location: userInput.trim()
          }
        };
        
      case 'summary':
        return {
          summary: userInput.trim()
        };
        
      case 'experience_intro':
        // This will trigger the experience flow
        return {};
        
      case 'education_intro':
        // This will trigger the education flow
        return {
          highestEducation: userInput.trim()
        };
        
      case 'skills_intro':
        // Parse skills from comma-separated input
        const skills = userInput
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);
        
        // Validate that at least one skill is provided
        if (skills.length === 0) {
          throw new Error('Please provide at least one skill. You can separate multiple skills with commas.');
        }
        
        return {
          skills: skills
        };
        
      case 'languages_intro':
        // Parse languages from comma-separated input
        const languages = userInput
          .split(',')
          .map(language => language.trim())
          .filter(language => language.length > 0);
        
        return {
          languages: languages
        };
        
      case 'languages_proficiency':
        // Parse proficiency levels for existing languages
        const proficiencyInput = userInput.trim();
        const languageProficiencies: string[] = [];
        
        (cvData.languages || []).forEach(lang => {
          const langLower = lang.toLowerCase();
          const proficiencyMatch = proficiencyInput.match(new RegExp(`${langLower}\\s*:\\s*([^,]+)`, 'i'));
          const proficiency = proficiencyMatch ? proficiencyMatch[1].trim() : 'Not specified';
          languageProficiencies.push(`${lang}: ${proficiency}`);
        });
        
        return {
          languages: languageProficiencies
        };
        
      // Enhanced data collection for comprehensive CV building
      case 'current_profession':
        return { title: userInput.trim() };
        
      case 'linkedin':
        return { 
          social: { 
            ...cvData.social, 
            linkedin: userInput.trim() 
          } 
        };
        
      case 'website':
        return { 
          social: { 
            ...cvData.social, 
            website: userInput.trim() 
          } 
        };
        
      case 'github':
        return { 
          social: { 
            ...cvData.social, 
            github: userInput.trim() 
          } 
        };
        
      case 'experience_company':
        // Add new experience entry
        const newExperience = {
          title: '',
          company: userInput.trim(),
          type: '',
          location: '',
          current: false,
          dates: '',
          achievements: [],
          content: []
        };
        return { 
          experience: [...(cvData.experience || []), newExperience] 
        };
        
      case 'experience_title':
        // Update the last experience entry
        if (cvData.experience && cvData.experience.length > 0) {
          const updatedExperience = [...cvData.experience];
          updatedExperience[updatedExperience.length - 1].title = userInput.trim();
          return { experience: updatedExperience };
        }
        return {};
        
      case 'experience_dates':
        // Update the last experience entry
        if (cvData.experience && cvData.experience.length > 0) {
          const updatedExperience = [...cvData.experience];
          updatedExperience[updatedExperience.length - 1].dates = userInput.trim();
          return { experience: updatedExperience };
        }
        return {};
        
      case 'education_institution':
        // Add new education entry
        const newEducation = {
          degree: '',
          institution: userInput.trim(),
          field: '',
          dates: '',
          achievements: [],
          content: []
        };
        return { 
          education: [...(cvData.education || []), newEducation] 
        };
        
      case 'education_degree':
        // Update the last education entry
        if (cvData.education && cvData.education.length > 0) {
          const updatedEducation = [...cvData.education];
          updatedEducation[updatedEducation.length - 1].degree = userInput.trim();
          return { education: updatedEducation };
        }
        return {};
        
      case 'education_dates':
        // Update the last education entry
        if (cvData.education && cvData.education.length > 0) {
          const updatedEducation = [...cvData.education];
          updatedEducation[updatedEducation.length - 1].dates = userInput.trim();
          return { education: updatedEducation };
        }
        return {};
        
      case 'skills_technical':
        // Parse technical skills
        const technicalSkills = userInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        return { 
          skills: { 
            ...cvData.skills, 
            technical: technicalSkills 
          } 
        };
        
      case 'skills_soft':
        // Parse soft skills
        const softSkills = userInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        return { 
          skills: { 
            ...cvData.skills, 
            soft: softSkills 
          } 
        };
        
      case 'skills_tools':
        // Parse tools and technologies
        const tools = userInput.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0);
        return { 
          skills: { 
            ...cvData.skills, 
            tools: tools 
          } 
        };
        
      case 'hobbies':
        // Parse hobbies
        const hobbies = userInput.split(',').map(hobby => hobby.trim()).filter(hobby => hobby.length > 0);
        return { hobbies };
        
      case 'certifications':
        // Parse certifications
        const certifications = userInput.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0);
        return { 
          certifications: certifications.map(title => ({ title, content: [] })) 
        };
        
      case 'projects':
        // Parse projects
        const projects = userInput.split(',').map(project => project.trim()).filter(project => project.length > 0);
        return { 
          projects: projects.map(title => ({ title, description: '', content: [] })) 
        };
        
      default:
        return {};
    }
  }
  
  static getNextQuestion(
    currentQuestionIndex: number,
    questions: SimplifiedQuestion[],
    cvData: CVData
  ): SimplifiedQuestion | null {
    
    let nextIndex = currentQuestionIndex + 1;
    
    // Find the next question that should be shown
    while (nextIndex < questions.length) {
      const question = questions[nextIndex];
      
      // Check if question should be skipped
      if (question.skipCondition && question.skipCondition(cvData)) {
        nextIndex++;
        continue;
      }
      
      return question;
    }
    
    return null;
  }
  
  static isQuestionRequired(question: SimplifiedQuestion): boolean {
    return question.required;
  }
  
  static getQuestionValidation(question: SimplifiedQuestion, input: string): { isValid: boolean; error?: string } {
    if (!question.validation) {
      return { isValid: true };
    }
    
    return question.validation(input);
  }
} 