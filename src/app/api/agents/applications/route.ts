/**
 * Application Tracking API Endpoints
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getUserApplications, 
  updateApplicationStatus, 
  getApplicationAnalytics 
} from "@/lib/agents/application-tracker";
import { ApplicationStatusEnum } from "@/lib/state/schemas";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/agents/applications - List user's applications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const applications = await getUserApplications(
      user.id,
      status ? (status as any) : undefined
    );

    return NextResponse.json({ applications });

  } catch (error) {
    console.error("[Applications API GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/applications/[id] - Update application status
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const parseResult = ApplicationStatusEnum.safeParse(status);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const result = await updateApplicationStatus(applicationId, status, notes);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: result.message });

  } catch (error) {
    console.error("[Applications API PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update application", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}













