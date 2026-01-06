/**
 * Job Matching API Endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import jobMatcherAgent from "@/lib/agents/job-matcher";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { cvId } = body;

    if (!cvId) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 });
    }

    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
    });

    if (!cv || cv.userId !== user.id) {
      return NextResponse.json({ error: "CV not found or access denied" }, { status: 403 });
    }

    const initialState = {
      userId: user.id,
      sessionId: "",
      messages: [],
      cvId: cv.id,
      cvData: cv.content,
      timestamp: new Date(),
    };

    const result = await jobMatcherAgent(initialState as any);

    return NextResponse.json({
      jobs: result.jobMatches || [],
      message: result.messages?.[0]?.content,
    });

  } catch (error) {
    console.error("[Job Matching API] Error:", error);
    return NextResponse.json(
      { error: "Job matching failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * GET saved job matches for user
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

    const jobs = await prisma.jobMatch.findMany({
      where: { userId: user.id },
      orderBy: { matchScore: "desc" },
      take: 50,
    });

    return NextResponse.json({ jobs });

  } catch (error) {
    console.error("[Job Matching API GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}













