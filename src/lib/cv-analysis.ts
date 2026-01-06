// CV Analysis System - Evidence-based guidance for CV improvement
// Based on research from leading universities and career services

export interface CVAnalysisResult {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  sectorSpecificAdvice: string[];
  recommendations: string[];
  keywordAnalysis: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
  structureAnalysis: {
    isWellStructured: boolean;
    issues: string[];
    suggestions: string[];
  };
  achievementAnalysis: {
    hasQuantifiedResults: boolean;
    achievementQuality: 'high' | 'medium' | 'low';
    suggestions: string[];
  };
}

export interface SectorGuidance {
  name: string;
  keyElements: string[];
  keywords: string[];
  formatTips: string[];
  commonMistakes: string[];
}

export const SECTOR_GUIDANCE: Record<string, SectorGuidance> = {
  'sales-marketing': {
    name: 'Sales & Marketing',
    keyElements: [
      'Quantified sales achievements',
      'Client relationship management',
      'Revenue growth metrics',
      'Market expansion results',
      'Campaign performance data'
    ],
    keywords: [
      'revenue growth', 'sales targets', 'client acquisition', 'market share',
      'lead generation', 'customer retention', 'ROI', 'conversion rates',
      'pipeline management', 'negotiation', 'presentation skills'
    ],
    formatTips: [
      'Use bullet points for sales results',
      'Include percentages and monetary values',
      'Highlight client relationships and partnerships',
      'Show progression in sales performance'
    ],
    commonMistakes: [
      'Not quantifying sales achievements',
      'Focusing on duties rather than results',
      'Missing client relationship details',
      'Lack of market-specific experience'
    ]
  },
  'it-technology': {
    name: 'IT & Technology',
    keyElements: [
      'Technical skills and certifications',
      'Project roles and responsibilities',
      'Programming languages and tools',
      'System implementations',
      'Technical problem-solving'
    ],
    keywords: [
      'programming languages', 'frameworks', 'databases', 'cloud platforms',
      'agile methodologies', 'devops', 'cybersecurity', 'machine learning',
      'API development', 'system architecture', 'technical leadership'
    ],
    formatTips: [
      'List all relevant technologies clearly',
      'Detail your role in technical projects',
      'Include certifications and training',
      'Show progression in technical skills'
    ],
    commonMistakes: [
      'Not listing specific technologies',
      'Missing project impact details',
      'Lack of technical certifications',
      'Generic project descriptions'
    ]
  },
  'healthcare': {
    name: 'Healthcare',
    keyElements: [
      'Patient care experience',
      'Clinical skills and certifications',
      'Teamwork and collaboration',
      'Empathy and communication',
      'Healthcare regulations knowledge'
    ],
    keywords: [
      'patient care', 'clinical skills', 'healthcare regulations', 'teamwork',
      'empathy', 'communication', 'medical procedures', 'patient safety',
      'healthcare technology', 'interdisciplinary collaboration'
    ],
    formatTips: [
      'Emphasize soft skills and patient interaction',
      'List relevant licenses and certifications',
      'Highlight teamwork and collaboration',
      'Include patient outcomes when possible'
    ],
    commonMistakes: [
      'Not emphasizing soft skills',
      'Missing relevant licenses',
      'Lack of teamwork examples',
      'Generic clinical descriptions'
    ]
  },
  'education': {
    name: 'Education',
    keyElements: [
      'Teaching methods and approaches',
      'Curriculum development',
      'Student engagement and outcomes',
      'Educational technology',
      'Mentoring and leadership'
    ],
    keywords: [
      'curriculum development', 'student engagement', 'teaching methodologies',
      'educational technology', 'assessment strategies', 'classroom management',
      'student outcomes', 'mentoring', 'educational leadership'
    ],
    formatTips: [
      'Detail teaching experience and methods',
      'Include student outcomes and achievements',
      'Highlight curriculum development work',
      'Show progression in teaching skills'
    ],
    commonMistakes: [
      'Not detailing teaching methods',
      'Missing student outcome data',
      'Lack of curriculum development examples',
      'Generic teaching descriptions'
    ]
  },
  'research-academia': {
    name: 'Research & Academia',
    keyElements: [
      'Publications and research output',
      'Research methodologies',
      'Grant funding and awards',
      'Collaborations and partnerships',
      'Teaching and mentoring'
    ],
    keywords: [
      'publications', 'research grants', 'methodologies', 'collaborations',
      'peer-reviewed', 'conference presentations', 'research impact',
      'academic leadership', 'mentoring', 'interdisciplinary research'
    ],
    formatTips: [
      'Include detailed publications section',
      'List research grants and funding',
      'Detail research impact and collaborations',
      'Show progression in research career'
    ],
    commonMistakes: [
      'Not listing publications clearly',
      'Missing grant funding details',
      'Lack of research impact description',
      'Generic research descriptions'
    ]
  },
  'administration': {
    name: 'Administration',
    keyElements: [
      'Organizational skills',
      'Software proficiency',
      'Process improvement',
      'Client/customer service',
      'Accuracy and attention to detail'
    ],
    keywords: [
      'process improvement', 'organizational skills', 'software proficiency',
      'client service', 'accuracy', 'efficiency', 'project coordination',
      'data management', 'administrative systems'
    ],
    formatTips: [
      'List specific software and systems',
      'Quantify efficiency improvements',
      'Highlight organizational achievements',
      'Show progression in administrative skills'
    ],
    commonMistakes: [
      'Not listing specific software',
      'Missing efficiency metrics',
      'Lack of organizational examples',
      'Generic administrative descriptions'
    ]
  },
  'creative-design': {
    name: 'Creative & Design',
    keyElements: [
      'Portfolio and creative projects',
      'Design software proficiency',
      'Creative problem-solving',
      'Client collaboration',
      'Innovation and creativity'
    ],
    keywords: [
      'design software', 'creative projects', 'portfolio', 'client collaboration',
      'creative problem-solving', 'innovation', 'visual design', 'branding',
      'user experience', 'creative direction'
    ],
    formatTips: [
      'Include portfolio link prominently',
      'Use visually appealing layout',
      'Highlight creative problem-solving',
      'Show progression in creative skills'
    ],
    commonMistakes: [
      'Missing portfolio link',
      'Not showcasing creative process',
      'Lack of client collaboration examples',
      'Generic creative descriptions'
    ]
  },
  'construction-engineering': {
    name: 'Construction & Engineering',
    keyElements: [
      'Technical certifications',
      'Safety record and compliance',
      'Project management',
      'Technical skills and expertise',
      'Team leadership'
    ],
    keywords: [
      'project management', 'safety compliance', 'technical certifications',
      'engineering design', 'construction management', 'quality control',
      'team leadership', 'technical expertise', 'regulatory compliance'
    ],
    formatTips: [
      'List relevant certifications clearly',
      'Detail project roles and responsibilities',
      'Emphasize safety record and compliance',
      'Show progression in technical skills'
    ],
    commonMistakes: [
      'Not listing certifications',
      'Missing safety compliance details',
      'Lack of project impact description',
      'Generic technical descriptions'
    ]
  },
  'hospitality-tourism': {
    name: 'Hospitality & Tourism',
    keyElements: [
      'Customer service excellence',
      'Stress management',
      'Language skills',
      'Flexibility and adaptability',
      'Cultural awareness'
    ],
    keywords: [
      'customer service', 'stress management', 'language skills', 'flexibility',
      'cultural awareness', 'guest relations', 'hospitality management',
      'tourism services', 'multilingual', 'cross-cultural communication'
    ],
    formatTips: [
      'List languages and cultural skills',
      'Highlight customer-facing experience',
      'Emphasize flexibility and adaptability',
      'Show progression in hospitality skills'
    ],
    commonMistakes: [
      'Not listing language skills',
      'Missing customer service examples',
      'Lack of cultural awareness',
      'Generic hospitality descriptions'
    ]
  },
  'nonprofit-third-sector': {
    name: 'Non-Profit & Third Sector',
    keyElements: [
      'Mission alignment',
      'Volunteer experience',
      'Fundraising and development',
      'Community engagement',
      'Teamwork and collaboration'
    ],
    keywords: [
      'mission alignment', 'volunteer experience', 'fundraising', 'community engagement',
      'nonprofit management', 'social impact', 'stakeholder engagement',
      'program development', 'advocacy', 'social responsibility'
    ],
    formatTips: [
      'Emphasize passion for the cause',
      'Include volunteer experience',
      'Quantify fundraising results',
      'Show progression in nonprofit work'
    ],
    commonMistakes: [
      'Not showing mission alignment',
      'Missing volunteer experience',
      'Lack of fundraising examples',
      'Generic nonprofit descriptions'
    ]
  }
};

export const GENERAL_CV_PRINCIPLES = {
  structure: {
    required: ['contact information', 'professional summary', 'work experience', 'education'],
    optional: ['skills', 'certifications', 'projects', 'volunteer work', 'languages'],
    tips: [
      'Keep to 1-2 pages for industry CVs',
      'Use clear headings and bullet points',
      'Maintain consistent formatting',
      'Start with most relevant information'
    ]
  },
  content: {
    achievements: [
      'Use quantifiable results (numbers, percentages, monetary values)',
      'Focus on impact rather than just duties',
      'Use action verbs to start bullet points',
      'Include context and scope of responsibilities'
    ],
    keywords: [
      'Analyze job description for key terms',
      'Use industry-specific terminology',
      'Include both technical and soft skills',
      'Mirror language used by the employer'
    ],
    tailoring: [
      'Customize for each job application',
      'Prioritize relevant experience',
      'Remove irrelevant information',
      'Adjust summary to match job requirements'
    ]
  },
  commonMistakes: [
    'Spelling and grammar errors',
    'Generic, non-tailored content',
    'Focusing on duties rather than achievements',
    'Missing quantifiable results',
    'Poor formatting and structure',
    'Irrelevant information',
    'Lack of keywords from job description'
  ]
};

export function analyzeCV(cvContent: string, targetSector?: string, jobDescription?: string): CVAnalysisResult {
  const analysis: CVAnalysisResult = {
    overallScore: 0,
    strengths: [],
    areasForImprovement: [],
    sectorSpecificAdvice: [],
    recommendations: [],
    keywordAnalysis: {
      found: [],
      missing: [],
      suggestions: []
    },
    structureAnalysis: {
      isWellStructured: false,
      issues: [],
      suggestions: []
    },
    achievementAnalysis: {
      hasQuantifiedResults: false,
      achievementQuality: 'low',
      suggestions: []
    }
  };

  // Analyze structure
  const hasContactInfo = /(email|phone|address|linkedin)/i.test(cvContent);
  const hasSummary = /(summary|profile|objective)/i.test(cvContent);
  const hasExperience = /(experience|work|employment|job)/i.test(cvContent);
  const hasEducation = /(education|degree|university|college)/i.test(cvContent);

  if (hasContactInfo && hasSummary && hasExperience && hasEducation) {
    analysis.structureAnalysis.isWellStructured = true;
    analysis.strengths.push('Good basic structure with all essential sections');
  } else {
    analysis.structureAnalysis.issues.push('Missing essential sections');
    if (!hasContactInfo) analysis.structureAnalysis.issues.push('Missing contact information');
    if (!hasSummary) analysis.structureAnalysis.issues.push('Missing professional summary');
    if (!hasExperience) analysis.structureAnalysis.issues.push('Missing work experience');
    if (!hasEducation) analysis.structureAnalysis.issues.push('Missing education');
  }

  // Analyze achievements
  const quantifiedResults = /(\d+%|\$\d+|\d+ people|\d+ projects|\d+ years)/g;
  const achievementMatches = cvContent.match(quantifiedResults);
  
  if (achievementMatches && achievementMatches.length > 0) {
    analysis.achievementAnalysis.hasQuantifiedResults = true;
    analysis.achievementAnalysis.achievementQuality = achievementMatches.length > 3 ? 'high' : 'medium';
    analysis.strengths.push(`Good use of quantifiable results (${achievementMatches.length} found)`);
  } else {
    analysis.achievementAnalysis.suggestions.push('Add quantifiable results to demonstrate impact');
    analysis.areasForImprovement.push('Lack of quantifiable achievements');
  }

  // Analyze action verbs
  const actionVerbs = /(led|managed|developed|implemented|created|improved|increased|reduced|achieved|delivered|established|coordinated|facilitated|designed|built|launched|streamlined|optimized|enhanced|generated)/gi;
  const verbMatches = cvContent.match(actionVerbs);
  
  if (verbMatches && verbMatches.length > 5) {
    analysis.strengths.push('Good use of action verbs');
  } else {
    analysis.achievementAnalysis.suggestions.push('Use more action verbs to start bullet points');
  }

  // Sector-specific analysis
  if (targetSector && SECTOR_GUIDANCE[targetSector]) {
    const sector = SECTOR_GUIDANCE[targetSector];
    
    // Check for sector-specific keywords
    sector.keywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(cvContent)) {
        analysis.keywordAnalysis.found.push(keyword);
      } else {
        analysis.keywordAnalysis.missing.push(keyword);
      }
    });

    // Provide sector-specific advice
    if (analysis.keywordAnalysis.missing.length > 0) {
      analysis.sectorSpecificAdvice.push(`Consider adding these ${sector.name} keywords: ${analysis.keywordAnalysis.missing.slice(0, 5).join(', ')}`);
    }

    sector.commonMistakes.forEach(mistake => {
      if (!cvContent.toLowerCase().includes(mistake.toLowerCase())) {
        analysis.sectorSpecificAdvice.push(`Ensure you address: ${mistake}`);
      }
    });
  }

  // Job description analysis
  if (jobDescription) {
    const jobKeywords = extractKeywords(jobDescription);
    jobKeywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(cvContent)) {
        analysis.keywordAnalysis.found.push(keyword);
      } else {
        analysis.keywordAnalysis.missing.push(keyword);
      }
    });

    if (analysis.keywordAnalysis.missing.length > 0) {
      analysis.recommendations.push(`Add these job-specific keywords: ${analysis.keywordAnalysis.missing.slice(0, 5).join(', ')}`);
    }
  }

  // Calculate overall score
  let score = 0;
  if (analysis.structureAnalysis.isWellStructured) score += 25;
  if (analysis.achievementAnalysis.hasQuantifiedResults) score += 25;
  if (analysis.keywordAnalysis.found.length > 5) score += 25;
  if (analysis.strengths.length > analysis.areasForImprovement.length) score += 25;
  
  analysis.overallScore = Math.min(100, score);

  // Generate recommendations
  if (analysis.overallScore < 70) {
    analysis.recommendations.push('Consider a comprehensive CV review and restructuring');
  }
  
  if (!analysis.achievementAnalysis.hasQuantifiedResults) {
    analysis.recommendations.push('Add specific numbers and metrics to demonstrate your impact');
  }

  if (analysis.keywordAnalysis.missing.length > 0) {
    analysis.recommendations.push('Incorporate more relevant keywords from the job description');
  }

  return analysis;
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in a real implementation, you might use NLP libraries
  const commonKeywords = [
    'management', 'leadership', 'communication', 'teamwork', 'problem solving',
    'analysis', 'planning', 'organization', 'coordination', 'implementation',
    'development', 'design', 'research', 'evaluation', 'assessment',
    'training', 'mentoring', 'coaching', 'supervision', 'project management'
  ];

  return commonKeywords.filter(keyword => 
    new RegExp(keyword, 'i').test(text)
  );
}

export function generateCVAdvice(analysis: CVAnalysisResult, sector?: string): string {
  let advice = '';

  // Overall assessment
  if (analysis.overallScore >= 80) {
    advice += 'Your CV shows strong fundamentals with good structure and achievements. ';
  } else if (analysis.overallScore >= 60) {
    advice += 'Your CV has good potential but needs some improvements. ';
  } else {
    advice += 'Your CV needs significant improvement to be competitive. ';
  }

  // Structure advice
  if (!analysis.structureAnalysis.isWellStructured) {
    advice += 'Ensure your CV includes all essential sections: contact information, professional summary, work experience, and education. ';
  }

  // Achievement advice
  if (!analysis.achievementAnalysis.hasQuantifiedResults) {
    advice += 'Add specific numbers and metrics to demonstrate your impact. For example, instead of "managed a team," say "led a team of 8 people to deliver a project 2 weeks ahead of schedule." ';
  }

  // Keyword advice
  if (analysis.keywordAnalysis.missing.length > 0) {
    advice += `Consider incorporating these keywords: ${analysis.keywordAnalysis.missing.slice(0, 5).join(', ')}. `;
  }

  // Sector-specific advice
  if (sector && SECTOR_GUIDANCE[sector]) {
    const sectorGuide = SECTOR_GUIDANCE[sector];
    advice += `For ${sectorGuide.name} roles, focus on: ${sectorGuide.keyElements.slice(0, 3).join(', ')}. `;
  }

  return advice.trim();
}

export function getSectorGuidance(sector: string): SectorGuidance | null {
  return SECTOR_GUIDANCE[sector] || null;
}

export function getAllSectors(): string[] {
  return Object.keys(SECTOR_GUIDANCE);
} 