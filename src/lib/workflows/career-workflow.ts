// @ts-nocheck
/**
 * LangGraph Career Service Workflow
 * 
 * Main workflow that orchestrates all career service agents.
 * Uses conditional routing to direct requests to appropriate specialists.
 */

import { StateGraph, END } from "@langchain/langgraph";
import { CareerServiceState, WorkflowActions } from "../state/agent-state";
import type { CareerServiceStateType } from "../state/agent-state";

// Import agents
import orchestratorAgent from "../agents/orchestrator";
import evaluateCVAgent from "../agents/cv-evaluator";
import jobMatcherAgent from "../agents/job-matcher";
import applicationTrackerAgent from "../agents/application-tracker";
import letterEnhancerAgent from "../agents/letter-enhancer";

/**
 * Define workflow nodes
 * Each node is a function that receives state and returns state updates
 */

// Orchestrator node - entry point
async function orchestratorNode(state: CareerServiceStateType): Promise<Partial<CareerServiceStateType>> {
  return orchestratorAgent(state);
}

// CV Analysis node
async function analyzeCVNode(state: CareerServiceStateType): Promise<Partial<CareerServiceStateType>> {
  return evaluateCVAgent(state);
}

// Job Matching node
async function findJobsNode(state: CareerServiceStateType): Promise<Partial<CareerServiceStateType>> {
  return jobMatcherAgent(state);
}

// Application Tracking node
async function trackApplicationNode(state: CareerServiceStateType): Promise<Partial<CareerServiceStateType>> {
  return applicationTrackerAgent(state);
}

// Cover Letter Enhancement node
async function enhanceLetterNode(state: CareerServiceStateType): Promise<Partial<CareerServiceStateType>> {
  return letterEnhancerAgent(state);
}

/**
 * Routing function - decides which node to execute next based on nextAction
 * Returns string keys that match the conditional edges mapping
 */
function routeByAction(state: CareerServiceStateType): string {
  const action = state.nextAction;

  console.log(`[Workflow] Routing decision: ${action}`);

  // Handle null/undefined action
  if (!action) {
    console.warn(`[Workflow] No action set, defaulting to __end__`);
    return "__end__";
  }

  switch (action) {
    case WorkflowActions.ANALYZE_CV:
    case "analyze_cv":
      return "analyze_cv";
    case WorkflowActions.FIND_JOBS:
    case "find_jobs":
      return "find_jobs";
    case WorkflowActions.TRACK_APPLICATION:
    case "track_application":
      return "track_application";
    case WorkflowActions.ENHANCE_LETTER:
    case "enhance_letter":
      return "enhance_letter";
    case WorkflowActions.RESPOND_GENERAL:
    case WorkflowActions.WAIT_FOR_USER:
    case WorkflowActions.ERROR:
    case WorkflowActions.END:
    case "respond_general":
    case "wait_for_user":
    case "error":
    case "end":
      return "__end__";
    default:
      console.warn(`[Workflow] Unknown action: ${action}, defaulting to __end__`);
      return "__end__";
  }
}

/**
 * Build the workflow graph
 */
export function buildCareerWorkflow() {
  // Create state graph with our state schema
  const workflow = new StateGraph(CareerServiceState);

  // Add all nodes to the graph
  workflow.addNode("orchestrator", orchestratorNode);
  workflow.addNode("analyze_cv", analyzeCVNode);
  workflow.addNode("find_jobs", findJobsNode);
  workflow.addNode("track_application", trackApplicationNode);
  workflow.addNode("enhance_letter", enhanceLetterNode);

  // Set orchestrator as entry point
  workflow.setEntryPoint("orchestrator");

  // Add conditional edges from orchestrator to other nodes
  // Note: "__end__" is required for LangGraph to recognize END as a valid destination
  workflow.addConditionalEdges(
    "orchestrator",
    routeByAction,
    {
      analyze_cv: "analyze_cv",
      find_jobs: "find_jobs",
      track_application: "track_application",
      enhance_letter: "enhance_letter",
      __end__: END,
    }
  );

  // All specialized agents return to END after execution
  workflow.addEdge("analyze_cv", END);
  workflow.addEdge("find_jobs", END);
  workflow.addEdge("track_application", END);
  workflow.addEdge("enhance_letter", END);

  // Compile the graph into an executable workflow
  const compiledWorkflow = workflow.compile();

  return compiledWorkflow;
}

/**
 * Invoke the workflow with initial state
 */
export async function invokeCareerWorkflow(
  initialState: Partial<CareerServiceStateType>
): Promise<CareerServiceStateType> {
  try {
    console.log("[Workflow] Starting workflow execution");

    const workflow = buildCareerWorkflow();

    // Invoke workflow with initial state
    const result = await workflow.invoke(initialState);

    console.log("[Workflow] Workflow execution complete");

    return result as CareerServiceStateType;

  } catch (error) {
    console.error("[Workflow] Error during workflow execution:", error);

    // Return error state
    return {
      ...initialState,
      error: error instanceof Error ? error.message : "Unknown workflow error",
      nextAction: WorkflowActions.ERROR,
      messages: [
        ...(initialState.messages || []),
        {
          role: "assistant",
          content: "I encountered an error processing your request. Please try again or contact support.",
          timestamp: new Date(),
        },
      ],
    } as CareerServiceStateType;
  }
}

/**
 * Stream the workflow execution (for real-time UI updates)
 */
export async function* streamCareerWorkflow(
  initialState: Partial<CareerServiceStateType>
): AsyncGenerator<Partial<CareerServiceStateType>, void, unknown> {
  try {
    console.log("[Workflow] Starting streaming workflow execution");

    const workflow = buildCareerWorkflow();

    // Stream workflow execution
    const stream = await workflow.stream(initialState);

    for await (const chunk of stream) {
      yield chunk;
    }

    console.log("[Workflow] Streaming workflow complete");

  } catch (error) {
    console.error("[Workflow] Error during streaming workflow:", error);

    yield {
      error: error instanceof Error ? error.message : "Unknown workflow error",
      nextAction: WorkflowActions.ERROR,
      messages: [{
        role: "assistant",
        content: "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }],
    };
  }
}

/**
 * Export for convenience
 */
const careerWorkflow = {
  build: buildCareerWorkflow,
  invoke: invokeCareerWorkflow,
  stream: streamCareerWorkflow,
};

export default careerWorkflow;



