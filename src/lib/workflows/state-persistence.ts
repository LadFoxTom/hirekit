/**
 * State Persistence Module
 * 
 * Handles saving and loading conversation state to/from database
 * Enables conversation continuity across page refreshes
 */

import { PrismaClient } from "@prisma/client";
import type { CareerServiceStateType } from "../state/agent-state";

const prisma = new PrismaClient();

/**
 * Save conversation state to database
 */
export async function saveConversationState(
  userId: string,
  sessionId: string,
  state: CareerServiceStateType
): Promise<void> {
  try {
    // Extract relevant context for storage
    const context = {
      cvId: state.cvId,
      currentIntent: state.currentIntent,
      targetJob: state.targetJob,
      applicationId: state.applicationId,
    };

    // Determine agent type from current intent or action
    const agentType = state.currentIntent || "orchestrator";

    // Determine status
    const status = state.error ? "error" : state.nextAction === "wait_for_user" ? "active" : "completed";

    // Upsert conversation record
    await prisma.agentConversation.upsert({
      where: { sessionId },
      update: {
        messages: JSON.stringify(state.messages),
        context: JSON.stringify(context),
        agentType,
        status,
        updatedAt: new Date(),
      },
      create: {
        userId,
        sessionId,
        messages: JSON.stringify(state.messages),
        context: JSON.stringify(context),
        agentType,
        status,
      },
    });

    console.log(`[Persistence] Saved conversation state for session: ${sessionId}`);

  } catch (error) {
    console.error("[Persistence] Error saving conversation state:", error);
    // Don't throw - persistence failures shouldn't break the workflow
  }
}

/**
 * Load conversation state from database
 */
export async function loadConversationState(
  sessionId: string
): Promise<Partial<CareerServiceStateType> | null> {
  try {
    const conversation = await prisma.agentConversation.findUnique({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!conversation) {
      console.log(`[Persistence] No conversation found for session: ${sessionId}`);
      return null;
    }

    // Parse stored data
    const messages = JSON.parse(conversation.messages as string);
    const context = JSON.parse(conversation.context as string);

    // Reconstruct state
    const state: Partial<CareerServiceStateType> = {
      userId: conversation.userId,
      sessionId: conversation.sessionId,
      messages,
      currentIntent: context.currentIntent,
      cvId: context.cvId,
      targetJob: context.targetJob,
      applicationId: context.applicationId,
      timestamp: conversation.updatedAt,
    };

    console.log(`[Persistence] Loaded conversation state for session: ${sessionId}`);

    return state;

  } catch (error) {
    console.error("[Persistence] Error loading conversation state:", error);
    return null;
  }
}

/**
 * Delete conversation state (for cleanup)
 */
export async function deleteConversationState(sessionId: string): Promise<void> {
  try {
    await prisma.agentConversation.delete({
      where: { sessionId },
    });

    console.log(`[Persistence] Deleted conversation state for session: ${sessionId}`);

  } catch (error) {
    console.error("[Persistence] Error deleting conversation state:", error);
  }
}

/**
 * Get all active conversations for a user
 */
export async function getUserConversations(userId: string): Promise<any[]> {
  try {
    const conversations = await prisma.agentConversation.findMany({
      where: {
        userId,
        status: "active",
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        sessionId: true,
        agentType: true,
        updatedAt: true,
        messages: true,
      },
    });

    return conversations.map(conv => ({
      sessionId: conv.sessionId,
      agentType: conv.agentType,
      updatedAt: conv.updatedAt,
      lastMessage: (() => {
        try {
          const messages = JSON.parse(conv.messages as string);
          return messages[messages.length - 1]?.content || "No messages";
        } catch {
          return "Error loading messages";
        }
      })(),
    }));

  } catch (error) {
    console.error("[Persistence] Error fetching user conversations:", error);
    return [];
  }
}

/**
 * Clean up old conversations (older than 30 days)
 */
export async function cleanupOldConversations(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.agentConversation.deleteMany({
      where: {
        updatedAt: {
          lt: thirtyDaysAgo,
        },
        status: {
          not: "active",
        },
      },
    });

    console.log(`[Persistence] Cleaned up ${result.count} old conversations`);

    return result.count;

  } catch (error) {
    console.error("[Persistence] Error cleaning up conversations:", error);
    return 0;
  }
}

/**
 * Export convenience functions
 */
const statePersistence = {
  save: saveConversationState,
  load: loadConversationState,
  delete: deleteConversationState,
  getUserConversations,
  cleanup: cleanupOldConversations,
};

export default statePersistence;




