/**
 * LangGraph State Schema for Multi-Agent Career Service System
 * 
 * This state object flows through the entire workflow and carries all context
 * needed by specialized agents. Each agent receives this state and returns updates.
 */

import { Annotation } from "@langchain/langgraph";
import { CVData } from "@/types/cv";

/**
 * Message structure for conversation history
 */
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

/**
 * Job context when discussing specific opportunities
 */
export interface TargetJob {
  title: string;
  company: string;
  description: string;
  url?: string;
  location?: string;
  salary?: string;
  remote?: boolean;
}

/**
 * CV Analysis results from evaluator agent
 */
export interface CVAnalysisResult {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  details?: {
    experienceQuality: number;
    skillsRelevance: number;
    formatting: number;
    atsCompatibility: number;
  };
}

/**
 * Job match from matcher agent
 */
export interface JobMatchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  remote: boolean;
  description: string;
  url: string;
  matchScore: number;
  matchReason: string;
  keywordMatches: string[];
  source: string;
  postedDate?: Date;
}

/**
 * Define the state schema using LangGraph Annotation API
 * This creates both the schema and TypeScript type
 */
export const CareerServiceState = Annotation.Root({
  // User context
  userId: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),
  
  sessionId: Annotation<string>({
    reducer: (_, update) => update,
    default: () => "",
  }),
  
  // Conversation
  messages: Annotation<Message[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => [],
  }),
  
  currentIntent: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  // CV context
  cvId: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  cvData: Annotation<CVData | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  // Job context
  targetJob: Annotation<TargetJob | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  // Analysis results
  cvAnalysis: Annotation<CVAnalysisResult | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  jobMatches: Annotation<JobMatchResult[]>({
    reducer: (_, update) => update,
    default: () => [],
  }),
  
  // Application tracking
  applicationId: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  // Workflow control
  nextAction: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  error: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  
  // Metadata
  timestamp: Annotation<Date>({
    reducer: (_, update) => update,
    default: () => new Date(),
  }),
});

/**
 * Export the TypeScript type inferred from the state schema
 */
export type CareerServiceStateType = typeof CareerServiceState.State;

/**
 * Possible next actions for workflow routing
 */
export const WorkflowActions = {
  ANALYZE_CV: "analyze_cv",
  FIND_JOBS: "find_jobs",
  TRACK_APPLICATION: "track_application",
  ENHANCE_LETTER: "enhance_letter",
  RESPOND_GENERAL: "respond_general",
  WAIT_FOR_USER: "wait_for_user",
  ERROR: "error",
  END: "end",
} as const;

/**
 * Type for workflow actions
 */
export type WorkflowAction = typeof WorkflowActions[keyof typeof WorkflowActions];













