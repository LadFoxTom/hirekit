import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { ChatOpenAI } from '@langchain/openai';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    include: { branding: true },
  });
  if (!company) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { title, bullets, tone, department } = body;

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const prompt = `You are a professional HR content writer. Generate a complete job description for the following role.

Company: ${company.name}
${company.branding?.tagline ? `Company tagline: ${company.branding.tagline}` : ''}
Job Title: ${title}
${department ? `Department: ${department}` : ''}
${tone ? `Tone: ${tone}` : 'Tone: Professional and welcoming'}
${bullets ? `Key points to include:\n${bullets}` : ''}

Generate a well-structured job description with these sections:
1. About the Role (2-3 sentences)
2. Responsibilities (5-7 bullet points)
3. Requirements (5-7 bullet points)
4. Nice to Have (3-4 bullet points)
5. What We Offer (3-5 bullet points)

Use plain text with line breaks. Do not use markdown headers (no # symbols). Use simple formatting like "About the Role:" as section headers. Use "- " for bullet points. Keep it concise and engaging.`;

  try {
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke(prompt);
    const description = typeof response.content === 'string'
      ? response.content
      : '';

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('AI description generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 }
    );
  }
}
