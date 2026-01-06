import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const LETTER_ANALYSIS_SYSTEM_PROMPT = `
You are an expert career coach and recruitment specialist with 15+ years of experience evaluating motivational letters and cover letters. You provide critical, honest, and constructive feedback based on professional standards.

Your analysis should be:
1. CRITICAL - Don't inflate scores. A mediocre letter should score 40-60, not 80+
2. REALISTIC - Base scores on actual content quality, not wishful thinking
3. CONSTRUCTIVE - Provide specific, actionable feedback
4. COMPREHENSIVE - Evaluate all aspects of the letter

Analysis Criteria (100 points total):
- Content Quality (30 points): Relevance, specificity, evidence, personalization
- Structure & Flow (20 points): Organization, paragraph structure, logical progression
- Language & Tone (20 points): Professionalism, clarity, appropriateness
- Job Alignment (15 points): Match with job requirements, company research
- Technical Quality (15 points): Grammar, spelling, formatting, length

Scoring Guidelines:
- 90-100: Exceptional - Ready for submission
- 80-89: Very Good - Minor improvements needed
- 70-79: Good - Several improvements needed
- 60-69: Fair - Significant improvements needed
- 50-59: Poor - Major revision required
- Below 50: Very Poor - Complete rewrite needed

For empty or minimal content, score appropriately low (10-30 points).

Analyze the following letter and provide a detailed, critical assessment.
`

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { letterContent, jobDescription, companyName, position } = await request.json()

    if (!letterContent) {
      return NextResponse.json(
        { error: 'Letter content is required' },
        { status: 400 }
      )
    }

    // Analyze letter content
    const analysis = analyzeLetterContent(letterContent, jobDescription, companyName, position)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Letter analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze letter' },
      { status: 500 }
    )
  }
}

function analyzeLetterContent(
  letterContent: string, 
  jobDescription?: string, 
  companyName?: string, 
  position?: string
) {
  const content = letterContent.trim()
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  const charCount = content.length

  // Initialize analysis
  const analysis = {
    overallScore: 0,
    contentQuality: { score: 0, maxScore: 30, issues: [] as string[], strengths: [] as string[] },
    structureFlow: { score: 0, maxScore: 20, issues: [] as string[], strengths: [] as string[] },
    languageTone: { score: 0, maxScore: 20, issues: [] as string[], strengths: [] as string[] },
    jobAlignment: { score: 0, maxScore: 15, issues: [] as string[], strengths: [] as string[] },
    technicalQuality: { score: 0, maxScore: 15, issues: [] as string[], strengths: [] as string[] },
    detailedFeedback: {
      strengths: [] as string[],
      weaknesses: [] as string[],
      suggestions: [] as string[]
    },
    metrics: {
      wordCount,
      charCount,
      readabilityScore: 0,
      keywordMatch: 0
    }
  }

  // Check for empty or minimal content
  if (wordCount < 50) {
    analysis.overallScore = Math.max(10, wordCount * 0.4)
    analysis.detailedFeedback.weaknesses.push('Letter is too short - needs substantial content')
    analysis.detailedFeedback.suggestions.push('Add detailed content covering your motivation, experience, and fit for the role')
    return analysis
  }

  // Content Quality Analysis (30 points)
  let contentScore = 0
  
  // Check for personalization
  if (companyName && content.toLowerCase().includes(companyName.toLowerCase())) {
    contentScore += 5
    analysis.contentQuality.strengths.push('Mentions the company specifically')
  } else {
    analysis.contentQuality.issues.push('No specific company mention')
  }

  // Check for position-specific content
  if (position && content.toLowerCase().includes(position.toLowerCase())) {
    contentScore += 5
    analysis.contentQuality.strengths.push('References the specific position')
  } else {
    analysis.contentQuality.issues.push('No specific position reference')
  }

  // Check for concrete examples/achievements
  const hasConcreteExamples = /(achieved|increased|improved|developed|managed|led|created|implemented)/i.test(content)
  if (hasConcreteExamples) {
    contentScore += 8
    analysis.contentQuality.strengths.push('Includes concrete examples and achievements')
  } else {
    analysis.contentQuality.issues.push('Lacks concrete examples and achievements')
  }

  // Check for motivation/interest
  const hasMotivation = /(motivated|interested|passionate|excited|enthusiastic|eager)/i.test(content)
  if (hasMotivation) {
    contentScore += 4
    analysis.contentQuality.strengths.push('Shows genuine interest and motivation')
  } else {
    analysis.contentQuality.issues.push('Does not clearly express motivation for the role')
  }

  // Check for relevant experience
  const hasExperience = /(experience|worked|previous|background|skills)/i.test(content)
  if (hasExperience) {
    contentScore += 4
    analysis.contentQuality.strengths.push('Mentions relevant experience')
  } else {
    analysis.contentQuality.issues.push('Does not connect experience to the role')
  }

  // Check for future orientation
  const hasFuture = /(contribute|add value|bring|offer|future|growth)/i.test(content)
  if (hasFuture) {
    contentScore += 4
    analysis.contentQuality.strengths.push('Shows what you can contribute')
  } else {
    analysis.contentQuality.issues.push('Does not clearly state what you can contribute')
  }

  analysis.contentQuality.score = Math.min(30, contentScore)

  // Structure & Flow Analysis (20 points)
  let structureScore = 0
  
  // Check for clear paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  if (paragraphs.length >= 3) {
    structureScore += 8
    analysis.structureFlow.strengths.push('Good paragraph structure')
  } else {
    analysis.structureFlow.issues.push('Insufficient paragraph structure')
  }

  // Check for logical flow
  const hasOpening = /(dear|to whom|applying|position|role)/i.test(content.substring(0, 200))
  const hasClosing = /(sincerely|thank you|regards|best regards|yours truly)/i.test(content.substring(content.length - 200))
  
  if (hasOpening && hasClosing) {
    structureScore += 6
    analysis.structureFlow.strengths.push('Proper opening and closing')
  } else {
    analysis.structureFlow.issues.push('Missing proper opening or closing')
  }

  // Check for transitions
  const hasTransitions = /(furthermore|moreover|additionally|however|therefore|consequently)/i.test(content)
  if (hasTransitions) {
    structureScore += 3
    analysis.structureFlow.strengths.push('Good use of transitions')
  } else {
    analysis.structureFlow.issues.push('Could use better transitions between ideas')
  }

  // Check for appropriate length
  if (wordCount >= 200 && wordCount <= 400) {
    structureScore += 3
    analysis.structureFlow.strengths.push('Appropriate length')
  } else if (wordCount < 200) {
    analysis.structureFlow.issues.push('Too short - needs more content')
  } else {
    analysis.structureFlow.issues.push('Too long - consider condensing')
  }

  analysis.structureFlow.score = Math.min(20, structureScore)

  // Language & Tone Analysis (20 points)
  let languageScore = 0
  
  // Check for professional tone
  const hasProfessionalTone = !/(i'm|i am|i'm really|i am really)/i.test(content) && 
                              /(professional|experienced|qualified|capable)/i.test(content)
  if (hasProfessionalTone) {
    languageScore += 8
    analysis.languageTone.strengths.push('Professional tone maintained')
  } else {
    analysis.languageTone.issues.push('Could be more professional in tone')
  }

  // Check for active voice
  const activeVoiceCount = (content.match(/\b(am|is|are|was|were|be|been|being)\b/gi) || []).length
  const totalSentences = (content.match(/[.!?]+/g) || []).length
  const passiveRatio = activeVoiceCount / Math.max(1, totalSentences)
  
  if (passiveRatio < 0.3) {
    languageScore += 6
    analysis.languageTone.strengths.push('Good use of active voice')
  } else {
    analysis.languageTone.issues.push('Too much passive voice - use active voice')
  }

  // Check for clarity
  const longSentences = content.split(/[.!?]+/).filter(s => s.trim().split(' ').length > 25).length
  if (longSentences === 0) {
    languageScore += 6
    analysis.languageTone.strengths.push('Clear, concise sentences')
  } else {
    analysis.languageTone.issues.push('Some sentences are too long and complex')
  }

  analysis.languageTone.score = Math.min(20, languageScore)

  // Job Alignment Analysis (15 points)
  let alignmentScore = 0
  
  if (jobDescription) {
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription)
    const foundKeywords = jobKeywords.filter(keyword => 
      new RegExp(keyword, 'i').test(content)
    )
    
    const keywordMatch = (foundKeywords.length / Math.max(1, jobKeywords.length)) * 100
    analysis.metrics.keywordMatch = Math.round(keywordMatch)
    
    if (keywordMatch > 60) {
      alignmentScore += 8
      analysis.jobAlignment.strengths.push('Good keyword alignment with job description')
    } else {
      analysis.jobAlignment.issues.push('Low keyword match with job description')
    }
  }

  // Check for company research
  if (companyName && content.toLowerCase().includes(companyName.toLowerCase())) {
    alignmentScore += 4
    analysis.jobAlignment.strengths.push('Shows company research')
  } else {
    analysis.jobAlignment.issues.push('No evidence of company research')
  }

  // Check for role-specific content
  if (position && content.toLowerCase().includes(position.toLowerCase())) {
    alignmentScore += 3
    analysis.jobAlignment.strengths.push('Addresses the specific role')
  } else {
    analysis.jobAlignment.issues.push('Does not specifically address the role')
  }

  analysis.jobAlignment.score = Math.min(15, alignmentScore)

  // Technical Quality Analysis (15 points)
  let technicalScore = 0
  
  // Check for spelling/grammar (basic check)
  const commonErrors = [
    /your\s+you're/gi,
    /you're\s+your/gi,
    /its\s+it's/gi,
    /it's\s+its/gi,
    /their\s+they're/gi,
    /they're\s+their/gi,
    /there\s+their/gi,
    /their\s+there/gi
  ]
  
  const errorCount = commonErrors.reduce((count, pattern) => 
    count + (content.match(pattern) || []).length, 0
  )
  
  if (errorCount === 0) {
    technicalScore += 8
    analysis.technicalQuality.strengths.push('No obvious spelling/grammar errors')
  } else {
    analysis.technicalQuality.issues.push(`Found ${errorCount} potential spelling/grammar errors`)
  }

  // Check for proper formatting
  const hasProperFormatting = content.includes('\n\n') && 
                              (content.includes('Dear') || content.includes('To whom'))
  if (hasProperFormatting) {
    technicalScore += 4
    analysis.technicalQuality.strengths.push('Proper letter formatting')
  } else {
    analysis.technicalQuality.issues.push('Improper letter formatting')
  }

  // Check for appropriate length
  if (wordCount >= 150 && wordCount <= 500) {
    technicalScore += 3
    analysis.technicalQuality.strengths.push('Appropriate letter length')
  } else {
    analysis.technicalQuality.issues.push('Letter length needs adjustment')
  }

  analysis.technicalQuality.score = Math.min(15, technicalScore)

  // Calculate overall score
  analysis.overallScore = 
    analysis.contentQuality.score +
    analysis.structureFlow.score +
    analysis.languageTone.score +
    analysis.jobAlignment.score +
    analysis.technicalQuality.score

  // Generate detailed feedback
  analysis.detailedFeedback.strengths = [
    ...analysis.contentQuality.strengths,
    ...analysis.structureFlow.strengths,
    ...analysis.languageTone.strengths,
    ...analysis.jobAlignment.strengths,
    ...analysis.technicalQuality.strengths
  ]

  analysis.detailedFeedback.weaknesses = [
    ...analysis.contentQuality.issues,
    ...analysis.structureFlow.issues,
    ...analysis.languageTone.issues,
    ...analysis.jobAlignment.issues,
    ...analysis.technicalQuality.issues
  ]

  // Generate suggestions based on issues
  if (analysis.contentQuality.issues.length > 0) {
    analysis.detailedFeedback.suggestions.push('Add more specific examples and achievements')
    analysis.detailedFeedback.suggestions.push('Include concrete evidence of your capabilities')
  }

  if (analysis.structureFlow.issues.length > 0) {
    analysis.detailedFeedback.suggestions.push('Improve paragraph structure and flow')
    analysis.detailedFeedback.suggestions.push('Add proper transitions between ideas')
  }

  if (analysis.languageTone.issues.length > 0) {
    analysis.detailedFeedback.suggestions.push('Use more professional and active language')
    analysis.detailedFeedback.suggestions.push('Keep sentences clear and concise')
  }

  if (analysis.jobAlignment.issues.length > 0) {
    analysis.detailedFeedback.suggestions.push('Research the company and mention specific details')
    analysis.detailedFeedback.suggestions.push('Align content more closely with job requirements')
  }

  if (analysis.technicalQuality.issues.length > 0) {
    analysis.detailedFeedback.suggestions.push('Proofread carefully for spelling and grammar')
    analysis.detailedFeedback.suggestions.push('Ensure proper letter formatting')
  }

  // Calculate readability score (Flesch Reading Ease approximation)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const syllables = content.toLowerCase().replace(/[^a-z]/g, '').length * 0.4 // approximation
  const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount))))
  analysis.metrics.readabilityScore = Math.round(readabilityScore)

  return analysis
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'been', 'from', 'they', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'some', 'very', 'into', 'just', 'only', 'know', 'take', 'than', 'them', 'well', 'also', 'come', 'first', 'want', 'look', 'new', 'because', 'any', 'these', 'give', 'day', 'most', 'after', 'before', 'between', 'during', 'under', 'within', 'without', 'against', 'among', 'through', 'throughout', 'toward', 'towards', 'upon', 'above', 'across', 'along', 'around', 'behind', 'below', 'beneath', 'beside', 'beyond', 'inside', 'outside', 'over', 'past', 'since', 'until'].includes(word))
  
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word)
} 