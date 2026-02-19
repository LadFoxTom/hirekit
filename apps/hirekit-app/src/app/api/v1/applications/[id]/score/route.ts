import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { ChatOpenAI } from '@langchain/openai';
import { logActivity } from '@/lib/activity';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const application = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: { job: true },
  });

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const cvData = application.cvData as Record<string, any>;
  const jobDescription = application.job?.description || '';
  const jobTitle = application.job?.title || 'General Position';

  // Build CV summary for scoring
  const cvSummary = [
    cvData.summary && `Summary: ${cvData.summary}`,
    cvData.experience?.length &&
      `Experience: ${cvData.experience
        .map((e: any) => `${e.title || ''} at ${e.company || ''} (${e.dates || ''})`)
        .join('; ')}`,
    cvData.education?.length &&
      `Education: ${cvData.education
        .map((e: any) => `${e.degree || ''} ${e.field || ''} at ${e.institution || ''}`)
        .join('; ')}`,
    cvData.skills &&
      `Skills: ${
        Array.isArray(cvData.skills)
          ? cvData.skills.join(', ')
          : typeof cvData.skills === 'object'
          ? Object.values(cvData.skills).flat().join(', ')
          : ''
      }`,
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `You are an AI recruitment assistant. Score this candidate's fit for the position.

Job Title: ${jobTitle}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Candidate CV:
${cvSummary || 'No CV data available'}

Score the candidate on these categories (0-100 each):
1. Skills Match - How well do the candidate's skills match the job requirements?
2. Experience Relevance - How relevant is their work experience?
3. Education Fit - How well does their education align?
4. Overall Fit - Overall suitability considering all factors

Respond ONLY with valid JSON in this exact format:
{
  "skillsMatch": <number>,
  "experienceRelevance": <number>,
  "educationFit": <number>,
  "overallScore": <number>,
  "summary": "<2-3 sentence assessment>"
}`;

  try {
    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      temperature: 0.3,
    });

    const response = await model.invoke(prompt);
    const content = typeof response.content === 'string' ? response.content : '';

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const scoreData = JSON.parse(jsonMatch[0]);
    const overallScore = Math.round(
      Math.max(0, Math.min(100, scoreData.overallScore || 0))
    );

    // Save to database
    await db.application.update({
      where: { id: application.id },
      data: {
        aiScore: overallScore,
        aiScoreData: scoreData,
      },
    });

    logActivity({
      companyId: ctx.companyId,
      applicationId: application.id,
      type: 'ai_scored',
      data: { score: overallScore, summary: scoreData.summary },
      performedBy: session.user.id,
    });

    return NextResponse.json({
      score: overallScore,
      data: scoreData,
    });
  } catch (error: any) {
    console.error('AI Scoring error:', error);
    return NextResponse.json(
      { error: 'AI scoring failed. Please try again.' },
      { status: 500 }
    );
  }
}
