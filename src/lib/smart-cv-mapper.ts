/**
 * Smart CV Mapping Engine - Revolutionary AI-Powered Field Mapping
 * 
 * This is a cutting-edge solution that intelligently connects chatbot flows
 * to CV documents with unprecedented accuracy and flexibility.
 */

import { CVData } from '@/types/cv';
import { FlowNode, FlowEdge } from '@/types/flow';

// OpenAI client is only used on server-side
let openai: any = null;

// Initialize OpenAI only on server-side
if (typeof window === 'undefined' && process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai').default;
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Advanced mapping configuration
export interface SmartMappingConfig {
  id: string;
  name: string;
  description: string;
  flowId: string;
  mappings: FieldMapping[];
  transformations: DataTransformation[];
  validations: ValidationRule[];
  industryContext?: string;
  userPreferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface FieldMapping {
  id: string;
  sourceNodeId: string;
  sourceVariable: string;
  targetCvField: string;
  targetSection: string;
  mappingType: 'direct' | 'conditional' | 'aggregated' | 'transformed';
  conditions?: MappingCondition[];
  priority: number;
  confidence: number;
  isActive: boolean;
}

export interface MappingCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'regex' | 'ai_classify';
  value: string;
  aiPrompt?: string;
}

export interface DataTransformation {
  id: string;
  field: string;
  transformationType: 'format_date' | 'capitalize' | 'extract_keywords' | 'ai_enhance' | 'custom';
  parameters: Record<string, any>;
  aiPrompt?: string;
}

export interface ValidationRule {
  id: string;
  field: string;
  ruleType: 'required' | 'format' | 'length' | 'ai_validate';
  parameters: Record<string, any>;
  errorMessage: string;
  aiPrompt?: string;
}

export interface UserPreferences {
  preferredDateFormat: string;
  nameFormat: 'first_last' | 'last_first' | 'full';
  experienceOrder: 'chronological' | 'relevance' | 'achievement';
  skillCategorization: 'automatic' | 'manual' | 'hybrid';
  languageStyle: 'formal' | 'casual' | 'technical';
}

export interface MappingResult {
  success: boolean;
  cvUpdate: Partial<CVData>;
  confidence: number;
  warnings: string[];
  suggestions: string[];
  appliedTransformations: string[];
  appliedValidations: string[];
}

export class SmartCVMapper {
  private config: SmartMappingConfig;
  private openai: any;

  constructor(config: SmartMappingConfig) {
    this.config = config;
    this.openai = openai;
  }

  /**
   * 🧠 AI-Powered Context Analysis
   * Analyzes conversation context to determine optimal CV field mapping
   */
  async analyzeContext(
    userInput: string,
    conversationHistory: Array<{ role: string; content: string }>,
    currentNode: FlowNode,
    flowState: Record<string, any>
  ): Promise<ContextAnalysis> {
    // If OpenAI is not available (client-side), use fallback analysis
    if (!this.openai) {
      return this.getFallbackAnalysis(userInput, currentNode);
    }

    const prompt = `
You are an expert CV data analyst. Analyze the following conversation context and determine the optimal CV field mapping.

User Input: "${userInput}"
Current Node: ${currentNode.id} - ${currentNode.data?.label || 'Unknown'}
Flow State: ${JSON.stringify(flowState, null, 2)}
Conversation History: ${JSON.stringify(conversationHistory.slice(-5), null, 2)}

Industry Context: ${this.config.industryContext || 'General'}

Available CV Fields:
- Personal: fullName, title, contact (email, phone, location)
- Experience: title, company, dates, achievements, location
- Education: degree, institution, field, dates, achievements
- Skills: technical, soft, tools, industry-specific
- Summary: professional summary
- Projects: title, description, technologies, achievements
- Certifications: title, issuer, date, credential_id
- Languages: language, proficiency
- Hobbies: interests, activities

Analyze and provide:
1. Primary CV field this input should map to
2. Secondary possible fields
3. Confidence score (0-1)
4. Suggested data transformations
5. Validation recommendations
6. Context insights

Respond in JSON format:
{
  "primaryField": "experience.title",
  "secondaryFields": ["experience.company"],
  "confidence": 0.95,
  "suggestedTransformations": ["capitalize", "extract_dates"],
  "validationRecommendations": ["required", "length_check"],
  "contextInsights": "User is describing their current job role",
  "extractedData": {
    "title": "Software Engineer",
    "company": "Google",
    "dates": "2021-Present"
  }
}
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      return analysis as ContextAnalysis;
    } catch (error) {
      console.error('Context analysis failed:', error);
      return this.getFallbackAnalysis(userInput, currentNode);
    }
  }

  /**
   * 🎯 Smart Field Mapping
   * Maps user input to CV fields using AI and configuration
   */
  async mapToCVFields(
    userInput: string,
    conversationHistory: Array<{ role: string; content: string }>,
    currentNode: FlowNode,
    flowState: Record<string, any>
  ): Promise<MappingResult> {
    // SmartCVMapper processing user input

    // Step 1: Analyze context
    const contextAnalysis = await this.analyzeContext(
      userInput,
      conversationHistory,
      currentNode,
      flowState
    );
    // Context analysis completed

    // Step 2: Find applicable mappings
    const applicableMappings = this.findApplicableMappings(
      currentNode.id,
      contextAnalysis
    );

    // Step 3: Apply transformations
    const transformedData = await this.applyTransformations(
      userInput,
      contextAnalysis.extractedData,
      applicableMappings
    );

    // Step 4: Validate data
    const validationResult = await this.validateData(
      transformedData,
      applicableMappings
    );

    // Step 5: Build CV update
    const cvUpdate = this.buildCVUpdate(
      transformedData,
      applicableMappings,
      contextAnalysis
    );

    const result = {
      success: validationResult.isValid,
      cvUpdate,
      confidence: contextAnalysis.confidence,
      warnings: validationResult.warnings,
      suggestions: this.generateSuggestions(contextAnalysis, transformedData),
      appliedTransformations: transformedData.appliedTransformations,
      appliedValidations: validationResult.appliedValidations
    };

    // Mapping result completed
    return result;
  }

  /**
   * 🎨 Visual Mapping Configuration
   * Provides interface for drag-and-drop field mapping
   */
  generateMappingSuggestions(
    flowNodes: FlowNode[],
    cvTemplate: CVData
  ): MappingSuggestion[] {
    const suggestions: MappingSuggestion[] = [];

    for (const node of flowNodes) {
      if (node.type === 'question' && node.data?.variableName) {
        const suggestion = this.analyzeNodeForMapping(node, cvTemplate);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 🔄 Adaptive Learning
   * Learns from user corrections and improves mapping accuracy
   */
  async learnFromCorrection(
    originalMapping: FieldMapping,
    userCorrection: {
      correctField: string;
      correctSection: string;
      userInput: string;
      context: any;
    }
  ): Promise<void> {
    // Update mapping confidence
    const mapping = this.config.mappings.find(m => m.id === originalMapping.id);
    if (mapping) {
      mapping.confidence = Math.max(0.1, mapping.confidence - 0.1);
    }

    // Create new mapping if needed
    const newMapping: FieldMapping = {
      id: `learned_${Date.now()}`,
      sourceNodeId: originalMapping.sourceNodeId,
      sourceVariable: originalMapping.sourceVariable,
      targetCvField: userCorrection.correctField,
      targetSection: userCorrection.correctSection,
      mappingType: 'direct',
      priority: 1,
      confidence: 0.9,
      isActive: true
    };

    this.config.mappings.push(newMapping);

    // Update user preferences
    this.updateUserPreferences(userCorrection);
  }

  /**
   * 🎛️ Advanced Configuration
   * Provides rich configuration options for power users
   */
  createConditionalMapping(
    sourceNodeId: string,
    conditions: MappingCondition[],
    targetField: string,
    targetSection: string
  ): FieldMapping {
    return {
      id: `conditional_${Date.now()}`,
      sourceNodeId,
      sourceVariable: 'user_input',
      targetCvField: targetField,
      targetSection,
      mappingType: 'conditional',
      conditions,
      priority: 1,
      confidence: 0.8,
      isActive: true
    };
  }

  /**
   * 🔍 Real-time Preview
   * Shows how mapped data will appear in the CV
   */
  generatePreview(
    mappedData: Record<string, any>,
    cvTemplate: CVData
  ): CVPreview {
    const preview = { ...cvTemplate };

    // Apply mapped data to preview
    for (const [field, value] of Object.entries(mappedData)) {
      this.setNestedField(preview, field, value);
    }

    return {
      original: cvTemplate,
      preview,
      changes: this.calculateChanges(cvTemplate, preview),
      confidence: this.calculateOverallConfidence(mappedData)
    };
  }

  // Private helper methods
  private findApplicableMappings(
    nodeId: string,
    contextAnalysis: ContextAnalysis
  ): FieldMapping[] {
    const applicableMappings = this.config.mappings
      .filter(mapping => 
        mapping.sourceNodeId === nodeId && 
        mapping.isActive &&
        this.evaluateConditions(mapping.conditions, contextAnalysis)
      )
      .sort((a, b) => b.priority - a.priority);
    
    return applicableMappings;
  }

  private async applyTransformations(
    userInput: string,
    extractedData: Record<string, any>,
    mappings: FieldMapping[]
  ): Promise<TransformedData> {
    const result: TransformedData = {
      data: { ...extractedData },
      appliedTransformations: []
    };

    for (const mapping of mappings) {
      const transformations = this.config.transformations.filter(
        t => t.field === mapping.targetCvField
      );

      for (const transformation of transformations) {
        const transformed = await this.applyTransformation(
          result.data,
          transformation
        );
        result.data = { ...result.data, ...transformed };
        result.appliedTransformations.push(transformation.id);
      }
    }

    return result;
  }

  private async validateData(
    data: TransformedData,
    mappings: FieldMapping[]
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      warnings: [],
      appliedValidations: []
    };

    for (const mapping of mappings) {
      const validations = this.config.validations.filter(
        v => v.field === mapping.targetCvField
      );

      for (const validation of validations) {
        const validationResult = await this.applyValidation(
          data.data,
          validation
        );
        
        if (!validationResult.isValid) {
          result.isValid = false;
          result.warnings.push(validation.errorMessage);
        }
        
        result.appliedValidations.push(validation.id);
      }
    }

    return result;
  }

  private buildCVUpdate(
    transformedData: TransformedData,
    mappings: FieldMapping[],
    contextAnalysis: ContextAnalysis
  ): Partial<CVData> {
    const cvUpdate: Partial<CVData> = {};

    // Building CV update

    // If no mappings found, use the extracted data directly
    if (mappings.length === 0) {
      // No mappings found, using extracted data directly
      for (const [key, value] of Object.entries(contextAnalysis.extractedData)) {
        if (value !== undefined && value !== null && value !== '') {
          // Map common field names to CV structure
          if (key === 'fullName') {
            cvUpdate.fullName = value as string;
          } else if (key === 'preferredName') {
            cvUpdate.preferredName = value as string;
          } else if (key === 'email') {
            cvUpdate.contact = { ...cvUpdate.contact, email: value as string };
          } else if (key === 'phone') {
            cvUpdate.contact = { ...cvUpdate.contact, phone: value as string };
          } else if (key === 'location') {
            cvUpdate.contact = { ...cvUpdate.contact, location: value as string };
          } else if (key === 'linkedin') {
            cvUpdate.contact = { ...cvUpdate.contact, linkedin: value as string };
          } else if (key === 'website') {
            cvUpdate.contact = { ...cvUpdate.contact, website: value as string };
          } else if (key === 'title') {
            cvUpdate.title = value as string;
          } else if (key === 'experienceYears') {
            cvUpdate.experienceYears = value as string;
          } else if (key === 'summary' || key === 'content' || key === 'professionalSummary') {
            cvUpdate.summary = value as string;
          } else if (key === 'topStrengths') {
            cvUpdate.topStrengths = value as string;
          } else if (key === 'currentCompany') {
            cvUpdate.currentCompany = value as string;
          } else if (key === 'currentRoleStartDate') {
            cvUpdate.currentRoleStartDate = value as string;
          } else if (key === 'currentRoleDescription') {
            cvUpdate.currentRoleDescription = value as string;
          } else if (key === 'currentAchievements') {
            cvUpdate.currentAchievements = value as string;
          } else if (key === 'previousExperience') {
            cvUpdate.previousExperience = this.parsePreviousExperience(value as string);
          } else if (key === 'technicalSkills') {
            cvUpdate.technicalSkills = this.parseSkills(value as string, 'technical');
          } else if (key === 'softSkills') {
            cvUpdate.softSkills = this.parseSkills(value as string, 'soft');
          } else if (key === 'languages') {
            cvUpdate.languages = this.parseLanguages(value as string);
          } else if (key === 'educationLevel') {
            cvUpdate.educationLevel = value as string;
          } else if (key === 'degreeField') {
            cvUpdate.degreeField = value as string;
          } else if (key === 'university') {
            cvUpdate.university = value as string;
          } else if (key === 'graduationYear') {
            cvUpdate.graduationYear = value as string;
          } else if (key === 'gpa') {
            cvUpdate.gpa = value as string;
          } else if (key === 'certifications') {
            cvUpdate.certifications = this.parseCertifications(value as string);
          } else if (key === 'projects') {
            cvUpdate.projects = this.parseProjects(value as string);
          } else if (key === 'interests') {
            cvUpdate.interests = this.parseInterests(value as string);
          } else if (key === 'skills') {
            cvUpdate.skills = value as string[];
          }
          // Direct mapping applied
        }
      }
    } else {
      // Use mappings
      for (const mapping of mappings) {
        const value = transformedData.data[mapping.targetCvField] || contextAnalysis.extractedData[mapping.targetCvField];
        if (value !== undefined) {
          this.setNestedField(cvUpdate, mapping.targetCvField, value);
        }
      }
    }

    // CV update completed
    return cvUpdate;
  }

  private setNestedField(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  private getFallbackAnalysis(userInput: string, currentNode: FlowNode): ContextAnalysis {
    console.log('🔄 Using fallback analysis for:', { userInput, nodeId: currentNode.id, variableName: currentNode.data?.variableName });
    
    // Simple rule-based fallback analysis
    const input = userInput.toLowerCase();
    const nodeLabel = currentNode.data?.label?.toLowerCase() || '';
    const variableName = currentNode.data?.variableName || '';

    // Determine field based on variable name and content
    let primaryField = 'summary';
    let confidence = 0.6;
    let extractedData: Record<string, any> = { content: userInput };

    // Check variable name first - comprehensive mapping for Basic CV Builder
    if (variableName.includes('name') || variableName.includes('fullName')) {
      primaryField = 'fullName';
      confidence = 0.8;
      extractedData = { fullName: userInput };
    } else if (variableName.includes('preferredName') || variableName.includes('preferred_name')) {
      primaryField = 'preferredName';
      confidence = 0.8;
      extractedData = { preferredName: userInput };
    } else if (variableName.includes('email')) {
      primaryField = 'contact.email';
      confidence = 0.9;
      extractedData = { email: userInput };
    } else if (variableName.includes('phone')) {
      primaryField = 'contact.phone';
      confidence = 0.9;
      extractedData = { phone: userInput };
    } else if (variableName.includes('location')) {
      primaryField = 'contact.location';
      confidence = 0.9;
      extractedData = { location: userInput };
    } else if (variableName.includes('linkedin')) {
      primaryField = 'contact.linkedin';
      confidence = 0.9;
      extractedData = { linkedin: userInput };
    } else if (variableName.includes('website')) {
      primaryField = 'contact.website';
      confidence = 0.9;
      extractedData = { website: userInput };
    } else if (variableName.includes('title') || variableName.includes('currentTitle') || variableName.includes('current_title')) {
      primaryField = 'title';
      confidence = 0.8;
      extractedData = { title: userInput };
    } else if (variableName.includes('experienceYears') || variableName.includes('experience_years')) {
      primaryField = 'experienceYears';
      confidence = 0.8;
      extractedData = { experienceYears: userInput };
    } else if (variableName.includes('summary') || variableName.includes('professionalSummary') || variableName.includes('professional_summary')) {
      primaryField = 'summary';
      confidence = 0.8;
      extractedData = { professionalSummary: userInput };
    } else if (variableName.includes('topStrengths') || variableName.includes('top_strengths')) {
      primaryField = 'topStrengths';
      confidence = 0.8;
      extractedData = { topStrengths: userInput };
    } else if (variableName.includes('currentCompany') || variableName.includes('current_company')) {
      primaryField = 'currentCompany';
      confidence = 0.8;
      extractedData = { currentCompany: userInput };
    } else if (variableName.includes('currentRoleStartDate') || variableName.includes('current_role_start_date')) {
      primaryField = 'currentRoleStartDate';
      confidence = 0.8;
      extractedData = { currentRoleStartDate: userInput };
    } else if (variableName.includes('currentRoleDescription') || variableName.includes('current_role_description')) {
      primaryField = 'currentRoleDescription';
      confidence = 0.8;
      extractedData = { currentRoleDescription: userInput };
    } else if (variableName.includes('currentAchievements') || variableName.includes('current_achievements')) {
      primaryField = 'currentAchievements';
      confidence = 0.8;
      extractedData = { currentAchievements: userInput };
    } else if (variableName.includes('previousExperience') || variableName.includes('previous_experience')) {
      primaryField = 'previousExperience';
      confidence = 0.8;
      extractedData = { previousExperience: userInput };
    } else if (variableName.includes('technicalSkills') || variableName.includes('technical_skills')) {
      primaryField = 'technicalSkills';
      confidence = 0.8;
      extractedData = { technicalSkills: userInput };
    } else if (variableName.includes('softSkills') || variableName.includes('soft_skills')) {
      primaryField = 'softSkills';
      confidence = 0.8;
      extractedData = { softSkills: userInput };
    } else if (variableName.includes('languages')) {
      primaryField = 'languages';
      confidence = 0.8;
      extractedData = { languages: userInput };
    } else if (variableName.includes('educationLevel') || variableName.includes('education_level')) {
      primaryField = 'educationLevel';
      confidence = 0.8;
      extractedData = { educationLevel: userInput };
    } else if (variableName.includes('degreeField') || variableName.includes('degree_field')) {
      primaryField = 'degreeField';
      confidence = 0.8;
      extractedData = { degreeField: userInput };
    } else if (variableName.includes('university')) {
      primaryField = 'university';
      confidence = 0.8;
      extractedData = { university: userInput };
    } else if (variableName.includes('graduationYear') || variableName.includes('graduation_year')) {
      primaryField = 'graduationYear';
      confidence = 0.8;
      extractedData = { graduationYear: userInput };
    } else if (variableName.includes('gpa')) {
      primaryField = 'gpa';
      confidence = 0.8;
      extractedData = { gpa: userInput };
    } else if (variableName.includes('certifications')) {
      primaryField = 'certifications';
      confidence = 0.8;
      extractedData = { certifications: userInput };
    } else if (variableName.includes('projects')) {
      primaryField = 'projects';
      confidence = 0.8;
      extractedData = { projects: userInput };
    } else if (variableName.includes('interests')) {
      primaryField = 'interests';
      confidence = 0.8;
      extractedData = { interests: userInput };
    } else if (variableName.includes('skill')) {
      primaryField = 'skills';
      confidence = 0.8;
      extractedData = { skills: userInput.split(',').map(s => s.trim()) };
    } else if (variableName.includes('experience') || variableName.includes('job') || variableName.includes('work')) {
      primaryField = 'experience.0.title';
      confidence = 0.7;
      extractedData = { title: userInput };
    } else if (variableName.includes('education') || variableName.includes('degree')) {
      primaryField = 'education.0.degree';
      confidence = 0.7;
      extractedData = { degree: userInput };
    }

    // Check content for additional clues
    if (input.includes('@') && !primaryField.includes('email')) {
      primaryField = 'contact.email';
      confidence = 0.9;
      extractedData = { email: userInput };
    } else if (input.includes('+') || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(input)) {
      primaryField = 'contact.phone';
      confidence = 0.9;
      extractedData = { phone: userInput };
    } else if (input.includes('years') || input.includes('experience') || input.includes('worked')) {
      primaryField = 'experience.0.title';
      confidence = 0.7;
      extractedData = { title: userInput };
    }

    const result = {
      primaryField,
      secondaryFields: [],
      confidence,
      suggestedTransformations: ['capitalize'],
      validationRecommendations: ['required'],
      contextInsights: `Fallback analysis based on variable "${variableName}" and content patterns`,
      extractedData
    };

    console.log('🔄 Fallback analysis result:', result);
    return result;
  }

  private analyzeNodeForMapping(node: FlowNode, cvTemplate: CVData): MappingSuggestion | null {
    if (!node.data?.label && !node.data?.question) {
      return null;
    }

    const nodeText = (node.data?.label || node.data?.question || '').toLowerCase();
    const variableName = node.data?.variableName || node.id;

    // AI-powered field mapping suggestions based on content analysis
    const suggestions = this.getFieldSuggestions(nodeText, variableName);
    
    if (suggestions.length === 0) {
      return null;
    }

    const bestSuggestion = suggestions[0];
    
    return {
      nodeId: node.id,
      nodeLabel: node.data?.label || node.id,
      nodeType: node.type,
      suggestedField: bestSuggestion.field,
      suggestedSection: bestSuggestion.section,
      confidence: bestSuggestion.confidence,
      reasoning: bestSuggestion.reasoning,
      alternativeFields: suggestions.slice(1).map(s => s.field)
    };
  }

  private getFieldSuggestions(nodeText: string, variableName: string): Array<{
    field: string;
    section: string;
    confidence: number;
    reasoning: string;
  }> {
    const suggestions: Array<{
      field: string;
      section: string;
      confidence: number;
      reasoning: string;
    }> = [];

    // Name-related fields
    if (this.matchesPattern(nodeText, ['name', 'full name', 'first name', 'last name', 'your name'])) {
      suggestions.push({
        field: 'fullName',
        section: 'Personal',
        confidence: 0.95,
        reasoning: 'Question asks for personal name information'
      });
    }

    // Email fields
    if (this.matchesPattern(nodeText, ['email', 'e-mail', 'mail', 'contact email'])) {
      suggestions.push({
        field: 'contact.email',
        section: 'Contact',
        confidence: 0.95,
        reasoning: 'Question asks for email address'
      });
    }

    // Phone fields
    if (this.matchesPattern(nodeText, ['phone', 'telephone', 'mobile', 'cell', 'number'])) {
      suggestions.push({
        field: 'contact.phone',
        section: 'Contact',
        confidence: 0.9,
        reasoning: 'Question asks for phone number'
      });
    }

    // Location fields
    if (this.matchesPattern(nodeText, ['location', 'address', 'city', 'country', 'where', 'based'])) {
      suggestions.push({
        field: 'contact.location',
        section: 'Contact',
        confidence: 0.85,
        reasoning: 'Question asks for location information'
      });
    }

    // Job title fields
    if (this.matchesPattern(nodeText, ['title', 'position', 'role', 'job title', 'current role'])) {
      suggestions.push({
        field: 'title',
        section: 'Personal',
        confidence: 0.9,
        reasoning: 'Question asks for job title or position'
      });
    }

    // Experience fields
    if (this.matchesPattern(nodeText, ['experience', 'work', 'job', 'career', 'employment'])) {
      suggestions.push({
        field: 'experience.0.title',
        section: 'Experience',
        confidence: 0.8,
        reasoning: 'Question asks about work experience'
      });
    }

    // Company fields
    if (this.matchesPattern(nodeText, ['company', 'employer', 'organization', 'workplace'])) {
      suggestions.push({
        field: 'experience.0.company',
        section: 'Experience',
        confidence: 0.85,
        reasoning: 'Question asks about company or employer'
      });
    }

    // Education fields
    if (this.matchesPattern(nodeText, ['education', 'degree', 'university', 'college', 'school', 'qualification'])) {
      suggestions.push({
        field: 'education.0.degree',
        section: 'Education',
        confidence: 0.8,
        reasoning: 'Question asks about educational background'
      });
    }

    // Skills fields
    if (this.matchesPattern(nodeText, ['skill', 'ability', 'expertise', 'technology', 'programming', 'language'])) {
      suggestions.push({
        field: 'skills.technical',
        section: 'Skills',
        confidence: 0.75,
        reasoning: 'Question asks about skills or technical abilities'
      });
    }

    // Summary fields
    if (this.matchesPattern(nodeText, ['summary', 'about', 'introduction', 'overview', 'describe yourself'])) {
      suggestions.push({
        field: 'summary',
        section: 'Summary',
        confidence: 0.8,
        reasoning: 'Question asks for personal or professional summary'
      });
    }

    // Industry fields
    if (this.matchesPattern(nodeText, ['industry', 'sector', 'field', 'domain', 'business'])) {
      suggestions.push({
        field: 'experience.0.company',
        section: 'Experience',
        confidence: 0.7,
        reasoning: 'Question asks about industry or business sector'
      });
    }

    // Years of experience
    if (this.matchesPattern(nodeText, ['years', 'experience', 'how long', 'duration'])) {
      suggestions.push({
        field: 'experience.0.dates',
        section: 'Experience',
        confidence: 0.7,
        reasoning: 'Question asks about years of experience'
      });
    }

    // Projects
    if (this.matchesPattern(nodeText, ['project', 'portfolio', 'work sample', 'achievement'])) {
      suggestions.push({
        field: 'projects.0.title',
        section: 'Projects',
        confidence: 0.75,
        reasoning: 'Question asks about projects or achievements'
      });
    }

    // Certifications
    if (this.matchesPattern(nodeText, ['certification', 'certificate', 'license', 'credential'])) {
      suggestions.push({
        field: 'certifications.0.title',
        section: 'Certifications',
        confidence: 0.8,
        reasoning: 'Question asks about certifications or credentials'
      });
    }

    // Languages
    if (this.matchesPattern(nodeText, ['language', 'speak', 'fluent', 'bilingual'])) {
      suggestions.push({
        field: 'languages.0.language',
        section: 'Languages',
        confidence: 0.8,
        reasoning: 'Question asks about language skills'
      });
    }

    // Sort by confidence and return
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private matchesPattern(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private updateUserPreferences(correction: any): void {
    // Update user preferences based on corrections
  }

  private evaluateConditions(conditions: MappingCondition[] | undefined, context: ContextAnalysis): boolean {
    if (!conditions) return true;
    // Evaluate mapping conditions
    return true; // Placeholder
  }

  private async applyTransformation(data: Record<string, any>, transformation: DataTransformation): Promise<Record<string, any>> {
    // Apply data transformation
    return data; // Placeholder
  }

  private async applyValidation(data: Record<string, any>, validation: ValidationRule): Promise<{ isValid: boolean }> {
    // Apply validation rule
    return { isValid: true }; // Placeholder
  }

  private generateSuggestions(contextAnalysis: ContextAnalysis, transformedData: TransformedData): string[] {
    // Generate helpful suggestions
    return []; // Placeholder
  }

  private parseCertifications(certificationsText: string): string | Array<{title: string, institution?: string, year?: string, content?: string[]}> {
    if (!certificationsText || certificationsText.trim().length === 0) {
      return '';
    }

    // Try to parse structured certifications
    const certifications: Array<{title: string, institution?: string, year?: string, content?: string[]}> = [];
    
    // Split by common separators (comma, semicolon, newline)
    const certEntries = certificationsText.split(/[,;]|\n/).map(entry => entry.trim()).filter(entry => entry.length > 0);
    
    for (const entry of certEntries) {
      const cert: {title: string, institution?: string, year?: string, content?: string[]} = { title: entry };
      
      // Try to extract institution and year using various patterns
      const patterns = [
        // "Certification Name from Institution in 2022"
        /^(.+?)\s+from\s+(.+?)\s+in\s+(\d{4})$/i,
        // "Certification Name by Institution (2022)"
        /^(.+?)\s+by\s+(.+?)\s+\((\d{4})\)$/i,
        // "Certification Name (Institution, 2022)"
        /^(.+?)\s+\((.+?),\s*(\d{4})\)$/i,
        // "Certification Name - Institution - 2022"
        /^(.+?)\s*-\s*(.+?)\s*-\s*(\d{4})$/i,
        // "Certification Name, Institution, 2022"
        /^(.+?),\s*(.+?),\s*(\d{4})$/i,
        // "Certification Name (Institution)"
        /^(.+?)\s+\((.+?)\)$/i,
        // "Certification Name - Institution"
        /^(.+?)\s*-\s*(.+?)$/i,
        // "Certification Name, Institution"
        /^(.+?),\s*(.+?)$/i,
        // "Certification Name 2022"
        /^(.+?)\s+(\d{4})$/i
      ];
      
      let matched = false;
      for (const pattern of patterns) {
        const match = entry.match(pattern);
        if (match) {
          if (match.length === 4) {
            // Pattern with title, institution, year
            cert.title = match[1].trim();
            cert.institution = match[2].trim();
            cert.year = match[3].trim();
          } else if (match.length === 3) {
            // Pattern with title and either institution or year
            cert.title = match[1].trim();
            const secondPart = match[2].trim();
            if (/^\d{4}$/.test(secondPart)) {
              cert.year = secondPart;
            } else {
              cert.institution = secondPart;
            }
          }
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // If no pattern matched, use the entire entry as title
        cert.title = entry;
      }
      
      certifications.push(cert);
    }
    
    // If we successfully parsed structured data, return it
    if (certifications.length > 0 && certifications.some(cert => cert.institution || cert.year)) {
      return certifications;
    }
    
    // Otherwise, return as simple string
    return certificationsText;
  }

  private parseProjects(projectsText: string): string | Array<{title: string, organization?: string, startDate?: string, endDate?: string, content?: string[]}> {
    if (!projectsText || projectsText.trim().length === 0) {
      return '';
    }

    // Try to parse structured projects
    const projects: Array<{title: string, organization?: string, startDate?: string, endDate?: string, content?: string[]}> = [];
    
    // Split by common separators (comma, semicolon, newline)
    const projectEntries = projectsText.split(/[,;]|\n/).map(entry => entry.trim()).filter(entry => entry.length > 0);
    
    for (const entry of projectEntries) {
      const project: {title: string, organization?: string, startDate?: string, endDate?: string, content?: string[]} = { title: entry };
      
      // Try to extract organization and dates using various patterns
      const patterns = [
        // "Project Name at Organization from Jan 2023 to Jun 2023"
        /^(.+?)\s+at\s+(.+?)\s+from\s+(.+?)\s+to\s+(.+?)$/i,
        // "Project Name for Organization (Jan 2023 - Jun 2023)"
        /^(.+?)\s+for\s+(.+?)\s+\((.+?)\s*-\s*(.+?)\)$/i,
        // "Project Name with Organization, Jan 2023 - Jun 2023"
        /^(.+?)\s+with\s+(.+?),\s*(.+?)\s*-\s*(.+?)$/i,
        // "Project Name - Organization - Jan 2023 - Jun 2023"
        /^(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)$/i,
        // "Project Name, Organization, Jan 2023 - Jun 2023"
        /^(.+?),\s*(.+?),\s*(.+?)\s*-\s*(.+?)$/i,
        // "Project Name at Organization"
        /^(.+?)\s+at\s+(.+?)$/i,
        // "Project Name for Organization"
        /^(.+?)\s+for\s+(.+?)$/i,
        // "Project Name with Organization"
        /^(.+?)\s+with\s+(.+?)$/i,
        // "Project Name - Organization"
        /^(.+?)\s*-\s*(.+?)$/i,
        // "Project Name, Organization"
        /^(.+?),\s*(.+?)$/i
      ];
      
      let matched = false;
      for (const pattern of patterns) {
        const match = entry.match(pattern);
        if (match) {
          if (match.length === 5) {
            // Pattern with title, organization, start date, end date
            project.title = match[1].trim();
            project.organization = match[2].trim();
            project.startDate = match[3].trim();
            project.endDate = match[4].trim();
          } else if (match.length === 3) {
            // Pattern with title and organization
            project.title = match[1].trim();
            project.organization = match[2].trim();
          }
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // If no pattern matched, use the entire entry as title
        project.title = entry;
      }
      
      projects.push(project);
    }
    
    // If we successfully parsed structured data, return it
    if (projects.length > 0 && projects.some(proj => proj.organization || proj.startDate || proj.endDate)) {
      return projects;
    }
    
    // Otherwise, return as simple string
    return projectsText;
  }

  private parseLanguages(languagesText: string): string[] {
    if (!languagesText || languagesText.trim().length === 0) {
      return [];
    }

    // Split by common separators and clean up
    const languages = languagesText.split(/[,;]|\n/).map(lang => lang.trim()).filter(lang => lang.length > 0);
    
    // Process each language to extract proficiency levels
    const processedLanguages: string[] = [];
    
    for (const lang of languages) {
      // Check for proficiency indicators
      const proficiencyPatterns = [
        /^(.+?)\s*\((native|fluent|conversational|beginner|intermediate|advanced)\)$/i,
        /^(.+?)\s*-\s*(native|fluent|conversational|beginner|intermediate|advanced)$/i,
        /^(.+?)\s*:\s*(native|fluent|conversational|beginner|intermediate|advanced)$/i,
        /^(native|fluent|conversational|beginner|intermediate|advanced)\s+(.+?)$/i
      ];
      
      let processed = lang;
      for (const pattern of proficiencyPatterns) {
        const match = lang.match(pattern);
        if (match) {
          if (match.length === 3) {
            // Format: "Language (Proficiency)" or "Language - Proficiency"
            const language = match[1].trim();
            const proficiency = match[2].trim();
            processed = `${language} (${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)})`;
          } else if (match.length === 3 && match[1].match(/^(native|fluent|conversational|beginner|intermediate|advanced)$/i)) {
            // Format: "Proficiency Language"
            const proficiency = match[1].trim();
            const language = match[2].trim();
            processed = `${language} (${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)})`;
          }
          break;
        }
      }
      
      processedLanguages.push(processed);
    }
    
    return processedLanguages;
  }

  private parseSkills(skillsText: string, skillType: 'technical' | 'soft'): string {
    if (!skillsText || skillsText.trim().length === 0) {
      return '';
    }

    // Split by common separators and clean up
    const skills = skillsText.split(/[,;]|\n/).map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    // Process each skill to extract proficiency levels or categories
    const processedSkills: string[] = [];
    
    for (const skill of skills) {
      // Check for proficiency indicators
      const proficiencyPatterns = [
        /^(.+?)\s*\((expert|advanced|intermediate|beginner|proficient|skilled)\)$/i,
        /^(.+?)\s*-\s*(expert|advanced|intermediate|beginner|proficient|skilled)$/i,
        /^(.+?)\s*:\s*(expert|advanced|intermediate|beginner|proficient|skilled)$/i,
        /^(expert|advanced|intermediate|beginner|proficient|skilled)\s+(.+?)$/i
      ];
      
      let processed = skill;
      for (const pattern of proficiencyPatterns) {
        const match = skill.match(pattern);
        if (match) {
          if (match.length === 3) {
            // Format: "Skill (Proficiency)" or "Skill - Proficiency"
            const skillName = match[1].trim();
            const proficiency = match[2].trim();
            processed = `${skillName} (${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)})`;
          } else if (match.length === 3 && match[1].match(/^(expert|advanced|intermediate|beginner|proficient|skilled)$/i)) {
            // Format: "Proficiency Skill"
            const proficiency = match[1].trim();
            const skillName = match[2].trim();
            processed = `${skillName} (${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)})`;
          }
          break;
        }
      }
      
      processedSkills.push(processed);
    }
    
    // Return as comma-separated string for now (could be enhanced to return structured data)
    return processedSkills.join(', ');
  }

  private parseInterests(interestsText: string): string {
    if (!interestsText || interestsText.trim().length === 0) {
      return '';
    }

    // Split by common separators and clean up
    const interests = interestsText.split(/[,;]|\n/).map(interest => interest.trim()).filter(interest => interest.length > 0);
    
    // Process each interest to categorize and clean up
    const processedInterests: string[] = [];
    
    for (const interest of interests) {
      // Clean up common variations
      let processed = interest;
      
      // Remove common prefixes/suffixes
      processed = processed.replace(/^(i like|i enjoy|i love|i'm interested in|i'm passionate about)\s+/i, '');
      processed = processed.replace(/\s+(and|&|,)$/i, '');
      
      // Capitalize first letter
      processed = processed.charAt(0).toUpperCase() + processed.slice(1);
      
      processedInterests.push(processed);
    }
    
    // Return as comma-separated string
    return processedInterests.join(', ');
  }

  private parsePreviousExperience(experienceText: string): string {
    if (!experienceText || experienceText.trim().length === 0) {
      return '';
    }

    // Split by common separators (double newline, semicolon, or "---" separators)
    const experienceEntries = experienceText.split(/\n\s*\n|;|\n---\n|\n---/).map(entry => entry.trim()).filter(entry => entry.length > 0);
    
    // If no clear separators found, try to split by job indicators
    if (experienceEntries.length === 1) {
      // Look for patterns that indicate multiple jobs
      const jobIndicators = [
        /(?:^|\n)\s*(?:at\s+[^,\n]+|for\s+[^,\n]+|with\s+[^,\n]+|@\s+[^,\n]+)/gi,
        /(?:^|\n)\s*\d{4}\s*[-–]\s*\d{4}/g,
        /(?:^|\n)\s*\d{4}\s*[-–]\s*Present/gi
      ];
      
      let hasMultipleJobs = false;
      for (const pattern of jobIndicators) {
        const matches = experienceText.match(pattern);
        if (matches && matches.length > 1) {
          hasMultipleJobs = true;
          break;
        }
      }
      
      if (hasMultipleJobs) {
        // Try to split by job patterns
        const jobSplitPatterns = [
          /(?=\n\s*(?:at\s+|for\s+|with\s+|@\s+|\d{4}\s*[-–]))/gi,
          /(?=\n\s*[A-Z][^,\n]*\s+(?:at|for|with|@))/gi
        ];
        
        for (const pattern of jobSplitPatterns) {
          const split = experienceText.split(pattern).filter(entry => entry.trim().length > 0);
          if (split.length > 1) {
            experienceEntries.length = 0; // Clear array
            experienceEntries.push(...split.map(entry => entry.trim()));
            break;
          }
        }
      }
    }
    
    // Process each experience entry
    const processedExperiences: string[] = [];
    
    for (const entry of experienceEntries) {
      let processed = entry;
      
      // Clean up common formatting issues
      processed = processed.replace(/^\s*[-•*]\s*/gm, ''); // Remove bullet points
      processed = processed.replace(/\n\s*\n/g, '\n'); // Remove extra newlines
      processed = processed.replace(/^\s+|\s+$/g, ''); // Trim whitespace
      
      // Add proper formatting if it looks like a job entry
      if (processed.length > 0) {
        // Check if it starts with a job title or company
        const jobPatterns = [
          /^(?:[A-Z][^,\n]*\s+(?:at|for|with|@)\s+[^,\n]+)/i,
          /^\d{4}\s*[-–]\s*\d{4}/,
          /^\d{4}\s*[-–]\s*Present/i
        ];
        
        let isJobEntry = false;
        for (const pattern of jobPatterns) {
          if (pattern.test(processed)) {
            isJobEntry = true;
            break;
          }
        }
        
        if (isJobEntry) {
          // Format as a proper job entry
          processed = processed.charAt(0).toUpperCase() + processed.slice(1);
        }
        
        processedExperiences.push(processed);
      }
    }
    
    // Return as formatted text with clear separation
    return processedExperiences.join('\n\n---\n\n');
  }

  private calculateChanges(original: CVData, preview: CVData): Record<string, any> {
    // Calculate what changed
    return {}; // Placeholder
  }

  private calculateOverallConfidence(mappedData: Record<string, any>): number {
    // Calculate overall confidence score
    return 0.8; // Placeholder
  }
}

// Supporting interfaces
interface ContextAnalysis {
  primaryField: string;
  secondaryFields: string[];
  confidence: number;
  suggestedTransformations: string[];
  validationRecommendations: string[];
  contextInsights: string;
  extractedData: Record<string, any>;
}

interface TransformedData {
  data: Record<string, any>;
  appliedTransformations: string[];
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  appliedValidations: string[];
}

export interface MappingSuggestion {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  suggestedField: string;
  suggestedSection: string;
  confidence: number;
  reasoning: string;
  alternativeFields?: string[];
}

interface CVPreview {
  original: CVData;
  preview: CVData;
  changes: Record<string, any>;
  confidence: number;
}

export default SmartCVMapper;
