/**
 * CV Analysis API Endpoint
 * 
 * Direct CV analysis without conversation interface
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import evaluateCVAgent from "@/lib/agents/cv-evaluator";
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

    const result = await evaluateCVAgent(initialState as any);

    return NextResponse.json({
      analysis: result.cvAnalysis,
      message: result.messages?.[0]?.content,
    });

  } catch (error) {
    console.error("[CV Analysis API] Error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}













