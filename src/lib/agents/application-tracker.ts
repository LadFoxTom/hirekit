// @ts-nocheck
/**
 * Application Tracker Agent
 * 
 * Records and manages job applications, tracks status changes,
 * and provides application analytics.
 */

import { CareerServiceStateType } from "../state/agent-state";
import { CreateJobApplicationSchema, safeParse, ApplicationStatus } from "../state/schemas";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Application Tracker Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with application tracking confirmation
 */
export async function applicationTrackerAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[Application Tracker] Starting application tracking");

  try {
    // Validate required data
    if (!state.userId) {
      return {
        error: "User ID not found",
        messages: [{
          role: "assistant",
          content: "I need to identify you to track applications. Please log in.",
          timestamp: new Date(),
        }],
        nextAction: "error",
      };
    }

    if (!state.cvId) {
      return {
        error: "No CV selected",
        messages: [{
          role: "assistant",
          content: "Please select which CV you used for this application.",
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    if (!state.targetJob) {
      return {
        error: "No job details provided",
        messages: [{
          role: "assistant",
          content: "Please provide the job details you're applying for (title, company, URL).",
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    // Create application record
    const applicationData = {
      userId: state.userId,
      cvId: state.cvId,
      jobTitle: state.targetJob.title,
      companyName: state.targetJob.company,
      jobUrl: state.targetJob.url,
      jobDescription: state.targetJob.description,
      location: state.targetJob.location,
      salary: state.targetJob.salary,
      status: "applied" as ApplicationStatus,
    };

    // Validate data
    const parseResult = safeParse(CreateJobApplicationSchema, applicationData);
    
    if (!parseResult.success) {
      console.error("[Application Tracker] Validation failed:", parseResult.error);
      return {
        error: `Invalid application data: ${parseResult.error}`,
        messages: [{
          role: "assistant",
          content: "The application data provided is incomplete or invalid. Please ensure you've provided the job title and company name.",
          timestamp: new Date(),
        }],
        nextAction: "error",
      };
    }

    // Create application in database
    const application = await prisma.jobApplication.create({
      data: parseResult.data,
    });

    console.log(`[Application Tracker] Created application: ${application.id}`);

    // Set up follow-up reminder (7 days from now)
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);

    await prisma.jobApplication.update({
      where: { id: application.id },
      data: { followUpDate },
    });

    // Generate confirmation message
    const message = generateConfirmationMessage(application);

    return {
      applicationId: application.id,
      messages: [{
        role: "assistant",
        content: message,
        timestamp: new Date(),
      }],
      nextAction: "wait_for_user",
      error: null,
    };

  } catch (error) {
    console.error("[Application Tracker] Error tracking application:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error tracking application",
      messages: [{
        role: "assistant",
        content: "I encountered an error while tracking your application. Please try again or contact support.",
        timestamp: new Date(),
      }],
      nextAction: "error",
    };
  }
}

/**
 * Update existing application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return {
        success: false,
        message: "Application not found",
      };
    }

    // Calculate response time if moving from 'applied' to another status
    let responseTime = application.responseTime;
    if (application.status === "applied" && newStatus !== "applied") {
      const daysSinceApplied = Math.floor(
        (Date.now() - application.appliedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      responseTime = daysSinceApplied;
    }

    // Update application
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        notes: notes || application.notes,
        responseTime,
        lastUpdated: new Date(),
      },
    });

    return {
      success: true,
      message: `Application status updated to: ${newStatus}`,
    };

  } catch (error) {
    console.error("[Application Tracker] Error updating status:", error);
    return {
      success: false,
      message: "Failed to update application status",
    };
  }
}

/**
 * Get user's applications with optional filtering
 */
export async function getUserApplications(
  userId: string,
  status?: ApplicationStatus
): Promise<any[]> {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        cv: {
          select: {
            title: true,
          },
        },
        letter: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        appliedDate: "desc",
      },
    });

    return applications;

  } catch (error) {
    console.error("[Application Tracker] Error fetching applications:", error);
    return [];
  }
}

/**
 * Get application analytics for user
 */
export async function getApplicationAnalytics(userId: string): Promise<{
  total: number;
  byStatus: Record<string, number>;
  responseRate: number;
  averageResponseTime: number | null;
}> {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
    });

    const total = applications.length;

    // Count by status
    const byStatus: Record<string, number> = {};
    applications.forEach(app => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    // Calculate response rate (responded / total)
    const responded = applications.filter(app => 
      app.status !== "applied" && app.status !== "ghosted"
    ).length;
    const responseRate = total > 0 ? (responded / total) * 100 : 0;

    // Calculate average response time
    const responseTimes = applications
      .map(app => app.responseTime)
      .filter(time => time !== null) as number[];
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : null;

    return {
      total,
      byStatus,
      responseRate,
      averageResponseTime,
    };

  } catch (error) {
    console.error("[Application Tracker] Error calculating analytics:", error);
    return {
      total: 0,
      byStatus: {},
      responseRate: 0,
      averageResponseTime: null,
    };
  }
}

/**
 * Generate confirmation message for new application
 */
function generateConfirmationMessage(application: any): string {
  let message = "## ✅ Application Tracked Successfully\n\n";

  message += `I've added this application to your tracking system:\n\n`;
  message += `**Position:** ${application.jobTitle}\n`;
  message += `**Company:** ${application.companyName}\n`;
  message += `**Applied:** ${application.appliedDate.toLocaleDateString()}\n`;
  message += `**Status:** ${application.status}\n`;
  
  if (application.location) {
    message += `**Location:** ${application.location}\n`;
  }
  
  if (application.salary) {
    message += `**Salary:** ${application.salary}\n`;
  }

  message += `\n`;
  message += `### 📅 Reminders Set\n`;
  message += `- **Follow-up:** ${application.followUpDate?.toLocaleDateString() || "Not set"}\n`;
  message += `\n`;
  message += `### Next Steps\n`;
  message += `- I'll remind you to follow up in 7 days\n`;
  message += `- Update me when you hear back\n`;
  message += `- I can help prepare for interviews\n`;
  message += `- I can generate a tailored cover letter if needed\n`;

  return message;
}

/**
 * Generate status update message
 */
export function generateStatusUpdateMessage(
  oldStatus: string,
  newStatus: string,
  companyName: string
): string {
  const statusMessages: Record<string, string> = {
    viewed: `Great! ${companyName} viewed your application. Keep an eye on your email.`,
    interview_scheduled: `🎉 Excellent news! You have an interview with ${companyName}. Let me know if you need help preparing!`,
    interview_completed: `Interview with ${companyName} completed. Fingers crossed! Update me when you hear back.`,
    offer: `🌟 Congratulations! You received an offer from ${companyName}! This is fantastic news.`,
    rejected: `I'm sorry to hear ${companyName} went with another candidate. Don't get discouraged - keep applying!`,
    withdrawn: `You've withdrawn your application with ${companyName}. That's okay - focus on the best opportunities.`,
    ghosted: `It seems ${companyName} hasn't responded. This happens sometimes. Consider it a sign to focus on companies that value communication.`,
  };

  return statusMessages[newStatus] || `Application status with ${companyName} updated to: ${newStatus}`;
}

export default applicationTrackerAgent;




