import { CVData } from '@/types/cv';

export interface AIAnalysisInput {
  conversation: Array<{ role: 'user' | 'assistant'; content: string }>;
  cvData: CVData;
  currentQuestionIndex: number;
  experienceStep?: string;
  educationStep?: string;
  hasNoRelevantExperience?: boolean;
}

export interface AIAnalysisOutput {
  userSuggestions: {
    title: string;
    description: string;
    recommendations: string[];
    nextSteps: string[];
  };
  cvImprovements: {
    sections: Array<{
      sectionId: string;
      sectionName: string;
      currentContent: string[];
      suggestedContent: string[];
      reason: string;
    }>;
    missingSections: Array<{
      sectionId: string;
      sectionName: string;
      suggestedContent: string[];
      reason: string;
    }>;
  };
  flowAnalysis: {
    currentProgress: number;
    missingInformation: string[];
    suggestedNextQuestion?: {
      id: string;
      text: string;
      reason: string;
    };
  };
}

export function createAIAnalysisPrompt(input: AIAnalysisInput): string {
  const { conversation, cvData, currentQuestionIndex, experienceStep, educationStep, hasNoRelevantExperience } = input;
  
  return `You are an expert CV builder AI assistant. Analyze the current conversation and CV data to provide comprehensive feedback and improvements.

CONTEXT:
- Current CV Data: ${JSON.stringify(cvData, null, 2)}
- Conversation History: ${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
- Current Question Index: ${currentQuestionIndex}
- Experience Step: ${experienceStep || 'none'}
- Education Step: ${educationStep || 'none'}
- Has No Relevant Experience: ${hasNoRelevantExperience || false}

TASK:
Analyze the conversation and CV data to provide:
1. User-facing suggestions for better CV building
2. Specific CV improvements with new content
3. Flow analysis and next steps

RESPONSE FORMAT (JSON only):
{
  "userSuggestions": {
    "title": "Brief title for the suggestions",
    "description": "Overall assessment of the CV building progress",
    "recommendations": [
      "Specific actionable recommendation 1",
      "Specific actionable recommendation 2"
    ],
    "nextSteps": [
      "Immediate next step 1",
      "Immediate next step 2"
    ]
  },
  "cvImprovements": {
    "sections": [
      {
        "sectionId": "personal",
        "sectionName": "Personal Information",
        "currentContent": ["current content"],
        "suggestedContent": ["improved content"],
        "reason": "Why this improvement is needed"
      }
    ],
    "missingSections": [
      {
        "sectionId": "skills",
        "sectionName": "Skills",
        "suggestedContent": ["suggested content"],
        "reason": "Why this section should be added"
      }
    ]
  },
  "flowAnalysis": {
    "currentProgress": 45,
    "missingInformation": ["name", "email", "experience"],
    "suggestedNextQuestion": {
      "id": "fullName",
      "text": "What's your full name?",
      "reason": "Basic personal information is needed first"
    }
  }
}

Provide only valid JSON.`;
}

export function parseAIResponse(response: string): AIAnalysisOutput {
  try {
    const parsed = JSON.parse(response);
    
    // Validate and provide defaults for missing fields
    return {
      userSuggestions: {
        title: parsed.userSuggestions?.title || 'CV Analysis Complete',
        description: parsed.userSuggestions?.description || 'Analysis completed successfully',
        recommendations: parsed.userSuggestions?.recommendations || [],
        nextSteps: parsed.userSuggestions?.nextSteps || []
      },
      cvImprovements: {
        sections: parsed.cvImprovements?.sections || [],
        missingSections: parsed.cvImprovements?.missingSections || []
      },
      flowAnalysis: {
        currentProgress: parsed.flowAnalysis?.currentProgress || 0,
        missingInformation: parsed.flowAnalysis?.missingInformation || [],
        suggestedNextQuestion: parsed.flowAnalysis?.suggestedNextQuestion
      }
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      userSuggestions: {
        title: 'Analysis Error',
        description: 'Failed to analyze the conversation properly',
        recommendations: ['Please try the analysis again'],
        nextSteps: ['Continue with the current flow']
      },
      cvImprovements: {
        sections: [],
        missingSections: []
      },
      flowAnalysis: {
        currentProgress: 0,
        missingInformation: [],
        suggestedNextQuestion: undefined
      }
    };
  }
} 