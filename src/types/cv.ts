export interface CVSection {
  title: string
  content: string[]
  listStyle?: 'bullet' | 'number' | 'arrow'
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
  instagram?: string
  [key: string]: string | undefined
}

export interface CVData {
  // Career Stage & Industry (NEW)
  careerStage?: 'student' | 'recent_graduate' | 'career_changer' | 'experienced'
  industrySector?: string
  targetRegion?: string
  
  // Enhanced Personal Information
  fullName?: string
  preferredName?: string
  pronouns?: string
  professionalHeadline?: string
  careerObjective?: string
  title?: string
  
  // Enhanced Contact Information
  contact?: {
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    website?: string
  }
  
  // Legal & Availability (NEW)
  workAuthorization?: string
  availability?: string
  
  social?: SocialLinks
  summary?: string
  
  // Education Level (NEW)
  highestEducation?: string
  
  // Professional Information
  experienceYears?: string
  topStrengths?: string
  
  // Work Experience Details
  currentCompany?: string
  currentRoleStartDate?: string
  currentRoleDescription?: string
  currentAchievements?: string
  previousExperience?: string
  
  // Skills
  technicalSkills?: string
  softSkills?: string
  
  // Education Details
  educationLevel?: string
  degreeField?: string
  university?: string
  graduationYear?: string
  gpa?: string
  
  // Additional Information
  certifications?: string | Array<{
    title: string
    institution?: string
    year?: string
    content?: string[]
  }>
  projects?: string | Array<{
    title: string
    organization?: string
    startDate?: string
    endDate?: string
    content?: string[]
  }>
  interests?: string
  
  // Enhanced Experience Structure (with backward compatibility)
  experience?: Array<{
    company?: string
    title: string
    type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'
    location?: string
    current?: boolean
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>
  
  // Enhanced Education Structure (with backward compatibility)
  education?: Array<{
    institution?: string
    degree?: string
    field?: string
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>
  
  // Enhanced Skills Structure (with backward compatibility)
  skills?: {
    technical?: string[]
    soft?: string[]
    tools?: string[]
    industry?: string[]
  } | string[] // Legacy support
  
  languages?: string[]
  hobbies?: string[]
  
  // New Sections
  volunteerWork?: CVSection[]
  awardsRecognition?: CVSection[]
  professionalMemberships?: string[]
  publicationsResearch?: CVSection[]
  references?: string
  
  photoUrl?: string
  photos?: string[] // Array of photo URLs for this CV
  template?: string
  layout?: {
    photoPosition?: 'left' | 'right' | 'center' | 'none'
    photoShape?: 'circle' | 'square' | 'rounded'
    photoPositionX?: number // 0-100, CSS object-position percentage
    photoPositionY?: number // 0-100, CSS object-position percentage
    photoSize?: number // Size in pixels (40-120 range)
    photoBorderColor?: string // Hex color for border
    photoBorderWidth?: number // Border width in pixels (0-8 range)
    showIcons?: boolean
    accentColor?: string
    sectionOrder?: string[]
    sectionIcons?: {
      [sectionId: string]: string
    }
    fontFamily?: string
    sectionTitles?: {
      [sectionId: string]: string
    }
    // Enhanced contact display options
    contactDisplay?: 'inline' | 'stacked' | 'centered' | 'justified' | 'separated'
    contactAlignment?: 'left' | 'center' | 'right' | 'justify'
    contactSpacing?: 'tight' | 'normal' | 'spread'
    contactSeparator?: 'none' | 'dot' | 'pipe' | 'bullet' | 'dash'
    contactIcons?: boolean
    // Enhanced social links options
    socialLinksDisplay?: 'icons' | 'text' | 'icons-text' | 'buttons' | 'minimal'
    socialLinksPosition?: 'inline' | 'below' | 'separate' | 'header-right'
    socialLinksAlignment?: 'left' | 'center' | 'right' | 'justify'
    socialLinksSpacing?: 'tight' | 'normal' | 'spread'
    socialLinksStyle?: 'default' | 'rounded' | 'outlined' | 'minimal'
    socialLinksIcons?: boolean
    socialLinksColor?: 'primary' | 'secondary' | 'accent' | 'custom'
    // Header layout options
    headerLayout?: 'standard' | 'compact' | 'spacious' | 'minimal'
    headerAlignment?: 'left' | 'center' | 'right'
    headerSpacing?: 'tight' | 'normal' | 'spread'
    // General layout
    sidebarPosition?: 'none' | 'left' | 'right'
    hiddenSections?: string[]
  }
  // Onboarding and metadata
  goal?: string
  experienceLevel?: string
  onboardingCompleted?: boolean
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface TemplateStyles {
  fontFamily: string
  primaryColor: string
  secondaryColor: string
  spacing: string
  borderStyle?: string
  headerStyle?: 'centered' | 'left-aligned' | 'modern' | 'minimalist' | 'creative'
  sectionStyle?: 'boxed' | 'underlined' | 'minimal' | 'card' | 'gradient'
  accentColor?: string
  backgroundColor?: string
  iconSet?: 'minimal' | 'solid' | 'outline' | 'none'
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  preview: string
  styles: TemplateStyles
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional template with a modern look',
    preview: '/templates/modern-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'minimal',
      iconSet: 'outline'
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional template perfect for conservative industries',
    preview: '/templates/classic-preview.png',
    styles: {
      fontFamily: 'Georgia, serif',
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      spacing: '1.25rem',
      borderStyle: '1px solid #e2e8f0',
      headerStyle: 'centered',
      sectionStyle: 'underlined',
      iconSet: 'minimal'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with this bold and creative design',
    preview: '/templates/creative-preview.png',
    styles: {
      fontFamily: 'Poppins, sans-serif',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      spacing: '2rem',
      headerStyle: 'creative',
      sectionStyle: 'gradient',
      accentColor: '#ec4899',
      iconSet: 'solid'
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant and sophisticated design for senior positions',
    preview: '/templates/executive-preview.png',
    styles: {
      fontFamily: 'Playfair Display, serif',
      primaryColor: '#18181b',
      secondaryColor: '#3f3f46',
      spacing: '1.75rem',
      borderStyle: '2px solid #18181b',
      headerStyle: 'left-aligned',
      sectionStyle: 'underlined',
      iconSet: 'minimal'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimalistic design that focuses on content',
    preview: '/templates/minimal-preview.png',
    styles: {
      fontFamily: 'system-ui, sans-serif',
      primaryColor: '#0f172a',
      secondaryColor: '#334155',
      spacing: '1rem',
      headerStyle: 'minimalist',
      sectionStyle: 'minimal',
      iconSet: 'none'
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern template designed for tech professionals',
    preview: '/templates/tech-preview.png',
    styles: {
      fontFamily: 'JetBrains Mono, monospace',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'card',
      backgroundColor: '#f8fafc',
      iconSet: 'outline'
    }
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Dynamic and energetic design for startup environments',
    preview: '/templates/startup-preview.png',
    styles: {
      fontFamily: 'DM Sans, sans-serif',
      primaryColor: '#8b5cf6',
      secondaryColor: '#6d28d9',
      spacing: '1.75rem',
      headerStyle: 'creative',
      sectionStyle: 'gradient',
      accentColor: '#f472b6',
      backgroundColor: '#faf5ff',
      iconSet: 'solid'
    }
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Professional template for academic and research positions',
    preview: '/templates/academic-preview.png',
    styles: {
      fontFamily: 'Merriweather, serif',
      primaryColor: '#1e40af',
      secondaryColor: '#1e3a8a',
      spacing: '1.5rem',
      headerStyle: 'centered',
      sectionStyle: 'underlined',
      backgroundColor: '#f8fafc',
      iconSet: 'minimal'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Polished and sophisticated design for corporate professionals',
    preview: '/templates/professional-preview.png',
    styles: {
      fontFamily: 'Montserrat, sans-serif',
      primaryColor: '#334155',
      secondaryColor: '#64748b',
      spacing: '1.25rem',
      headerStyle: 'left-aligned',
      sectionStyle: 'boxed',
      backgroundColor: '#ffffff',
      accentColor: '#0369a1',
      iconSet: 'minimal'
    }
  },
  {
    id: 'twocolumn',
    name: 'Two Column',
    description: 'Modern two-column layout with skills and info in the sidebar',
    preview: '/templates/twocolumn-preview.png',
    styles: {
      fontFamily: 'Roboto, sans-serif',
      primaryColor: '#0f172a',
      secondaryColor: '#475569',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'minimal',
      backgroundColor: '#ffffff',
      accentColor: '#4f46e5',
      iconSet: 'solid'
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Professional template designed for healthcare and medical professionals',
    preview: '/templates/healthcare-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      spacing: '1.5rem',
      headerStyle: 'centered',
      sectionStyle: 'boxed',
      backgroundColor: '#fef2f2',
      accentColor: '#f87171',
      iconSet: 'solid'
    }
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Results-focused design that highlights achievements and metrics',
    preview: '/templates/sales-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'card',
      backgroundColor: '#f0fdf4',
      accentColor: '#34d399',
      iconSet: 'solid'
    }
  },
  {
    id: 'admin',
    name: 'Administrative',
    description: 'Organized and detail-oriented design for administrative roles',
    preview: '/templates/admin-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      spacing: '1.25rem',
      headerStyle: 'left-aligned',
      sectionStyle: 'underlined',
      backgroundColor: '#faf5ff',
      accentColor: '#a78bfa',
      iconSet: 'outline'
    }
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    description: 'Mission-driven design for non-profit and social impact roles',
    preview: '/templates/nonprofit-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#ea580c',
      secondaryColor: '#c2410c',
      spacing: '1.5rem',
      headerStyle: 'centered',
      sectionStyle: 'boxed',
      backgroundColor: '#fff7ed',
      accentColor: '#fb923c',
      iconSet: 'solid'
    }
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Conservative and trustworthy design for financial professionals',
    preview: '/templates/finance-preview.png',
    styles: {
      fontFamily: 'Georgia, serif',
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      spacing: '1.25rem',
      headerStyle: 'centered',
      sectionStyle: 'underlined',
      backgroundColor: '#f8fafc',
      accentColor: '#64748b',
      iconSet: 'minimal'
    }
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Professional and authoritative design for legal professionals',
    preview: '/templates/legal-preview.png',
    styles: {
      fontFamily: 'Times New Roman, serif',
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      spacing: '1.5rem',
      headerStyle: 'left-aligned',
      sectionStyle: 'underlined',
      backgroundColor: '#ffffff',
      accentColor: '#64748b',
      iconSet: 'minimal'
    }
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Warm and approachable design for educators and trainers',
    preview: '/templates/education-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#0891b2',
      secondaryColor: '#0e7490',
      spacing: '1.5rem',
      headerStyle: 'centered',
      sectionStyle: 'boxed',
      backgroundColor: '#f0f9ff',
      accentColor: '#22d3ee',
      iconSet: 'solid'
    }
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Creative and engaging design for marketing professionals',
    preview: '/templates/marketing-preview.png',
    styles: {
      fontFamily: 'Poppins, sans-serif',
      primaryColor: '#ec4899',
      secondaryColor: '#be185d',
      spacing: '1.75rem',
      headerStyle: 'creative',
      sectionStyle: 'gradient',
      backgroundColor: '#fdf2f8',
      accentColor: '#f9a8d4',
      iconSet: 'solid'
    }
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Visually striking design for creative professionals',
    preview: '/templates/design-preview.png',
    styles: {
      fontFamily: 'Poppins, sans-serif',
      primaryColor: '#8b5cf6',
      secondaryColor: '#7c3aed',
      spacing: '2rem',
      headerStyle: 'creative',
      sectionStyle: 'gradient',
      backgroundColor: '#faf5ff',
      accentColor: '#c4b5fd',
      iconSet: 'solid'
    }
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Technical and precise design for engineering professionals',
    preview: '/templates/engineering-preview.png',
    styles: {
      fontFamily: 'JetBrains Mono, monospace',
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'card',
      backgroundColor: '#f0f9ff',
      accentColor: '#38bdf8',
      iconSet: 'outline'
    }
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Professional and analytical design for consultants',
    preview: '/templates/consulting-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#334155',
      secondaryColor: '#64748b',
      spacing: '1.5rem',
      headerStyle: 'left-aligned',
      sectionStyle: 'boxed',
      backgroundColor: '#f8fafc',
      accentColor: '#64748b',
      iconSet: 'minimal'
    }
  },
  {
    id: 'freelance',
    name: 'Freelance',
    description: 'Versatile and personal design for freelancers and contractors',
    preview: '/templates/freelance-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'minimal',
      backgroundColor: '#f0fdf4',
      accentColor: '#34d399',
      iconSet: 'outline'
    }
  },
  {
    id: 'graduate',
    name: 'Graduate',
    description: 'Fresh and optimistic design for recent graduates',
    preview: '/templates/graduate-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#6366f1',
      secondaryColor: '#4f46e5',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'card',
      backgroundColor: '#f5f3ff',
      accentColor: '#a5b4fc',
      iconSet: 'outline'
    }
  },
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    description: 'Contemporary executive design with modern flair',
    preview: '/templates/executive-modern-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#18181b',
      secondaryColor: '#3f3f46',
      spacing: '1.75rem',
      headerStyle: 'modern',
      sectionStyle: 'minimal',
      backgroundColor: '#fafafa',
      accentColor: '#71717a',
      iconSet: 'outline'
    }
  },
  {
    id: 'creative-minimal',
    name: 'Creative Minimal',
    description: 'Minimalist design with creative accents',
    preview: '/templates/creative-minimal-preview.png',
    styles: {
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#0f172a',
      secondaryColor: '#334155',
      spacing: '1.5rem',
      headerStyle: 'minimalist',
      sectionStyle: 'minimal',
      accentColor: '#6366f1',
      backgroundColor: '#ffffff',
      iconSet: 'outline'
    }
  },
  {
    id: 'corporate-bold',
    name: 'Corporate Bold',
    description: 'Bold and confident design for corporate leaders',
    preview: '/templates/corporate-bold-preview.png',
    styles: {
      fontFamily: 'Montserrat, sans-serif',
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      spacing: '1.5rem',
      headerStyle: 'modern',
      sectionStyle: 'boxed',
      backgroundColor: '#ffffff',
      accentColor: '#2563eb',
      iconSet: 'solid'
    }
  }
]

export interface ColorPalette {
  id: string
  name: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

export const COLOR_PALETTES: ColorPalette[] = [
  // Professional & Corporate
  {
    id: 'navy-blue',
    name: 'Navy Blue',
    category: 'Professional',
    colors: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    category: 'Professional',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      text: '#111827'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'Professional',
    colors: {
      primary: '#166534',
      secondary: '#16a34a',
      accent: '#4ade80',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    category: 'Professional',
    colors: {
      primary: '#991b1b',
      secondary: '#dc2626',
      accent: '#f87171',
      background: '#ffffff',
      text: '#1f2937'
    }
  },

  // Creative & Modern
  {
    id: 'purple-gradient',
    name: 'Purple Gradient',
    category: 'Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#faf5ff',
      text: '#1f2937'
    }
  },
  {
    id: 'teal-modern',
    name: 'Teal Modern',
    category: 'Creative',
    colors: {
      primary: '#0f766e',
      secondary: '#14b8a6',
      accent: '#5eead4',
      background: '#f0fdfa',
      text: '#1f2937'
    }
  },
  {
    id: 'coral-vibrant',
    name: 'Coral Vibrant',
    category: 'Creative',
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#fdba74',
      background: '#fff7ed',
      text: '#1f2937'
    }
  },
  {
    id: 'indigo-deep',
    name: 'Indigo Deep',
    category: 'Creative',
    colors: {
      primary: '#3730a3',
      secondary: '#6366f1',
      accent: '#a5b4fc',
      background: '#f5f3ff',
      text: '#1f2937'
    }
  },

  // Tech & Digital
  {
    id: 'cyber-green',
    name: 'Cyber Green',
    category: 'Technology',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f0fdf4',
      text: '#1f2937'
    }
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    category: 'Technology',
    colors: {
      primary: '#0284c7',
      secondary: '#0ea5e9',
      accent: '#38bdf8',
      background: '#f0f9ff',
      text: '#1f2937'
    }
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    category: 'Technology',
    colors: {
      primary: '#be185d',
      secondary: '#ec4899',
      accent: '#f9a8d4',
      background: '#fdf2f8',
      text: '#1f2937'
    }
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    category: 'Technology',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#111827',
      text: '#f9fafb'
    }
  },

  // Finance & Legal
  {
    id: 'golden-amber',
    name: 'Golden Amber',
    category: 'Finance',
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      accent: '#fbbf24',
      background: '#fffbeb',
      text: '#1f2937'
    }
  },
  {
    id: 'emerald-professional',
    name: 'Emerald Professional',
    category: 'Finance',
    colors: {
      primary: '#047857',
      secondary: '#059669',
      accent: '#10b981',
      background: '#ecfdf5',
      text: '#1f2937'
    }
  },
  {
    id: 'slate-conservative',
    name: 'Slate Conservative',
    category: 'Legal',
    colors: {
      primary: '#475569',
      secondary: '#64748b',
      accent: '#94a3b8',
      background: '#f8fafc',
      text: '#1f2937'
    }
  },
  {
    id: 'oxford-blue',
    name: 'Oxford Blue',
    category: 'Legal',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#eff6ff',
      text: '#1f2937'
    }
  },

  // Healthcare & Education
  {
    id: 'medical-red',
    name: 'Medical Red',
    category: 'Healthcare',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f87171',
      background: '#fef2f2',
      text: '#1f2937'
    }
  },
  {
    id: 'healing-teal',
    name: 'Healing Teal',
    category: 'Healthcare',
    colors: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#5eead4',
      background: '#f0fdfa',
      text: '#1f2937'
    }
  },
  {
    id: 'academic-blue',
    name: 'Academic Blue',
    category: 'Education',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#eff6ff',
      text: '#1f2937'
    }
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    category: 'Education',
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#fdba74',
      background: '#fff7ed',
      text: '#1f2937'
    }
  },

  // Creative & Design
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    category: 'Creative',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      background: '#fff7ed',
      text: '#1f2937'
    }
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    category: 'Creative',
    colors: {
      primary: '#0c4a6e',
      secondary: '#0369a1',
      accent: '#0ea5e9',
      background: '#f0f9ff',
      text: '#1f2937'
    }
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    category: 'Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#faf5ff',
      text: '#1f2937'
    }
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    category: 'Creative',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f0fdf4',
      text: '#1f2937'
    }
  },

  // Minimalist & Clean
  {
    id: 'pure-white',
    name: 'Pure White',
    category: 'Minimalist',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  {
    id: 'soft-gray',
    name: 'Soft Gray',
    category: 'Minimalist',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#f9fafb',
      text: '#1f2937'
    }
  },
  {
    id: 'warm-beige',
    name: 'Warm Beige',
    category: 'Minimalist',
    colors: {
      primary: '#92400e',
      secondary: '#a16207',
      accent: '#d97706',
      background: '#fefce8',
      text: '#1f2937'
    }
  },
  {
    id: 'cool-slate',
    name: 'Cool Slate',
    category: 'Minimalist',
    colors: {
      primary: '#475569',
      secondary: '#64748b',
      accent: '#94a3b8',
      background: '#f8fafc',
      text: '#1f2937'
    }
  }
]

export interface FontFamily {
  id: string
  name: string
  category: string
  fontFamily: string
  googleFonts?: string
  description: string
}

export const FONT_FAMILIES: FontFamily[] = [
  // Professional & Corporate
  {
    id: 'inter',
    name: 'Inter',
    category: 'Professional',
    fontFamily: 'Inter, sans-serif',
    googleFonts: 'Inter',
    description: 'Modern, clean sans-serif perfect for professional documents'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'Professional',
    fontFamily: 'Roboto, sans-serif',
    googleFonts: 'Roboto',
    description: 'Google\'s signature font, excellent readability'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Professional',
    fontFamily: 'Montserrat, sans-serif',
    googleFonts: 'Montserrat',
    description: 'Elegant geometric sans-serif with modern appeal'
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'Professional',
    fontFamily: 'Open Sans, sans-serif',
    googleFonts: 'Open+Sans',
    description: 'Humanist sans-serif designed for excellent legibility'
  },

  // Traditional & Classic
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'Traditional',
    fontFamily: 'Georgia, serif',
    description: 'Classic serif font with excellent readability'
  },
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    category: 'Traditional',
    fontFamily: 'Times New Roman, serif',
    description: 'Traditional serif font for conservative industries'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'Traditional',
    fontFamily: 'Merriweather, serif',
    googleFonts: 'Merriweather',
    description: 'Serif font designed for on-screen reading'
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'Traditional',
    fontFamily: 'Playfair Display, serif',
    googleFonts: 'Playfair+Display',
    description: 'Elegant serif with dramatic thick-thin transitions'
  },

  // Creative & Modern
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Creative',
    fontFamily: 'Poppins, sans-serif',
    googleFonts: 'Poppins',
    description: 'Geometric sans-serif with rounded features'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Creative',
    fontFamily: 'DM Sans, sans-serif',
    googleFonts: 'DM+Sans',
    description: 'Low-contrast geometric sans-serif'
  },
  {
    id: 'nunito',
    name: 'Nunito',
    category: 'Creative',
    fontFamily: 'Nunito, sans-serif',
    googleFonts: 'Nunito',
    description: 'Rounded terminal sans-serif with friendly appearance'
  },
  {
    id: 'quicksand',
    name: 'Quicksand',
    category: 'Creative',
    fontFamily: 'Quicksand, sans-serif',
    googleFonts: 'Quicksand',
    description: 'Display sans-serif with rounded terminals'
  },

  // Technology & Digital
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'Technology',
    fontFamily: 'JetBrains Mono, monospace',
    googleFonts: 'JetBrains+Mono',
    description: 'Programming font with ligatures and excellent readability'
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    category: 'Technology',
    fontFamily: 'Source Code Pro, monospace',
    googleFonts: 'Source+Code+Pro',
    description: 'Monospace font designed for source code'
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'Technology',
    fontFamily: 'Fira Code, monospace',
    googleFonts: 'Fira+Code',
    description: 'Monospace font with programming ligatures'
  },
  {
    id: 'ubuntu-mono',
    name: 'Ubuntu Mono',
    category: 'Technology',
    fontFamily: 'Ubuntu Mono, monospace',
    googleFonts: 'Ubuntu+Mono',
    description: 'Ubuntu\'s monospace font for technical documents'
  },

  // Minimalist & Clean
  {
    id: 'system-ui',
    name: 'System UI',
    category: 'Minimalist',
    fontFamily: 'system-ui, sans-serif',
    description: 'Native system font for clean, minimal appearance'
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    category: 'Minimalist',
    fontFamily: 'Helvetica, Arial, sans-serif',
    description: 'Classic sans-serif with excellent clarity'
  },
  {
    id: 'arial',
    name: 'Arial',
    category: 'Minimalist',
    fontFamily: 'Arial, sans-serif',
    description: 'Widely available sans-serif with good readability'
  },
  {
    id: 'calibri',
    name: 'Calibri',
    category: 'Minimalist',
    fontFamily: 'Calibri, sans-serif',
    description: 'Microsoft\'s default font, clean and readable'
  },

  // Academic & Research
  {
    id: 'crimson-text',
    name: 'Crimson Text',
    category: 'Academic',
    fontFamily: 'Crimson Text, serif',
    googleFonts: 'Crimson+Text',
    description: 'Serif font designed for book typography'
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'Academic',
    fontFamily: 'Lora, serif',
    googleFonts: 'Lora',
    description: 'Serif font optimized for body text'
  },
  {
    id: 'source-serif-pro',
    name: 'Source Serif Pro',
    category: 'Academic',
    fontFamily: 'Source Serif Pro, serif',
    googleFonts: 'Source+Serif+Pro',
    description: 'Serif font designed for digital reading'
  },
  {
    id: 'eb-garamond',
    name: 'EB Garamond',
    category: 'Academic',
    fontFamily: 'EB Garamond, serif',
    googleFonts: 'EB+Garamond',
    description: 'Classic Garamond revival for academic documents'
  }
] 