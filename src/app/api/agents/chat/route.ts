/**
 * Chat Agent API Endpoint
 * 
 * Main conversational interface for the multi-agent system.
 * Handles user messages, routes to appropriate agents, and maintains conversation state.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { invokeCareerWorkflow } from "@/lib/workflows/career-workflow";
import { saveConversationState, loadConversationState } from "@/lib/workflows/state-persistence";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

/**
 * POST /api/agents/chat
 * 
 * Send a message to the agent system and get a response
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, sessionId, cvId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate or use provided session ID
    const conversationSessionId = sessionId || randomUUID();

    // Load existing conversation state if resuming
    let existingState = null;
    if (sessionId) {
      existingState = await loadConversationState(sessionId);
    }

    // Load CV data if cvId provided
    let cvData = null;
    if (cvId) {
      const cv = await prisma.cV.findUnique({
        where: { id: cvId },
      });

      if (cv && cv.userId === user.id) {
        // Parse CV content if it's stored as JSON string
        try {
          cvData = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
          console.log(`[Chat API] Loaded CV: ${cv.title}, keys: ${Object.keys(cvData || {}).join(', ')}`);
        } catch (e) {
          console.error("[Chat API] Failed to parse CV content:", e);
          cvData = cv.content;
        }
      } else if (cv) {
        return NextResponse.json(
          { error: "CV not found or access denied" },
          { status: 403 }
        );
      }
    } else if (existingState?.cvId) {
      // Use CV from existing state
      const cv = await prisma.cV.findUnique({
        where: { id: existingState.cvId },
      });

      if (cv && cv.userId === user.id) {
        // Parse CV content if it's stored as JSON string
        try {
          cvData = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
        } catch (e) {
          console.error("[Chat API] Failed to parse CV content:", e);
          cvData = cv.content;
        }
      }
    }

    // Prepare initial state
    const initialState = {
      userId: user.id,
      sessionId: conversationSessionId,
      messages: [
        ...(existingState?.messages || []),
        {
          role: "user" as const,
          content: message,
          timestamp: new Date(),
        },
      ],
      cvId: cvId || existingState?.cvId || null,
      cvData: cvData || existingState?.cvData || null,
      currentIntent: existingState?.currentIntent || null,
      targetJob: existingState?.targetJob || null,
      applicationId: existingState?.applicationId || null,
      timestamp: new Date(),
    };

    console.log(`[Chat API] Processing message for user: ${user.id}, session: ${conversationSessionId}`);

    // Invoke workflow
    const result = await invokeCareerWorkflow(initialState);

    // Save conversation state
    await saveConversationState(user.id, conversationSessionId, result);

    // Extract assistant's latest message
    const assistantMessages = result.messages.filter(m => m.role === "assistant");
    const latestMessage = assistantMessages[assistantMessages.length - 1];

    // Prepare response
    const response = {
      message: latestMessage?.content || "I'm here to help!",
      sessionId: conversationSessionId,
      cvAnalysis: result.cvAnalysis || null,
      jobMatches: result.jobMatches || null,
      applicationId: result.applicationId || null,
      error: result.error || null,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("[Chat API] Error:", error);

    return NextResponse.json(
      {
        error: "An error occurred processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/chat?sessionId=xxx
 * 
 * Retrieve conversation history for a session
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get session ID from query params
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Load conversation state
    const state = await loadConversationState(sessionId);

    if (!state) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify user owns this conversation
    if (state.userId !== user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      sessionId,
      messages: state.messages || [],
      cvId: state.cvId,
      currentIntent: state.currentIntent,
    });

  } catch (error) {
    console.error("[Chat API GET] Error:", error);

    return NextResponse.json(
      {
        error: "An error occurred retrieving the conversation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}



