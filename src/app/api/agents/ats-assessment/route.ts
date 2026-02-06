/**
 * ATS Assessment API Endpoint
 * 
 * Direct ATS/CV assessment without conversation interface
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import assessATSAgent from "@/lib/agents/ats-assessor";
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
    const { cvId, cvData, language } = body;

    // Allow either cvId (from database) or cvData (direct assessment)
    let assessmentCvData = cvData;
    let assessmentCvId = cvId;

    if (cvId && !cvData) {
      const cv = await prisma.cV.findUnique({
        where: { id: cvId },
      });

      if (!cv || cv.userId !== user.id) {
        return NextResponse.json({ error: "CV not found or access denied" }, { status: 403 });
      }

      assessmentCvData = cv.content;
      assessmentCvId = cv.id;
    }

    if (!assessmentCvData) {
      return NextResponse.json({ error: "CV data is required" }, { status: 400 });
    }

    const initialState = {
      userId: user.id,
      sessionId: "",
      messages: [],
      cvId: assessmentCvId || "",
      cvData: assessmentCvData,
      language: language || 'en',
      timestamp: new Date(),
    };

    const result = await assessATSAgent(initialState as any);

    if (result.error) {
      return NextResponse.json(
        { error: result.error, details: result.messages?.[0]?.content },
        { status: 500 }
      );
    }

    // Extract the full assessment data including explanations
    const assessment = result.cvAnalysis || {};

    return NextResponse.json({
      assessment: assessment,
      message: result.messages?.[0]?.content,
    });

  } catch (error) {
    console.error("[ATS Assessment API] Error:", error);
    return NextResponse.json(
      { error: "Assessment failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
