export interface LetterData {
  // Basic Information
  recipientName?: string
  recipientTitle?: string
  companyName?: string
  companyAddress?: string
  
  // Sender Information
  senderName?: string
  senderTitle?: string
  senderAddress?: string
  senderEmail?: string
  senderPhone?: string
  
  // Letter Content
  subject?: string
  opening?: string
  body?: string[]
  closing?: string
  signature?: string
  
  // Job Information
  jobTitle?: string
  jobDescription?: string
  applicationDate?: string
  
  // CV Information
  cvText?: string
  
  // Letter Metadata
  template?: string
  layout?: {
    fontFamily?: string
    fontSize?: string
    lineSpacing?: string
    margins?: string
    alignment?: 'left' | 'center' | 'justify'
    showDate?: boolean
    showAddress?: boolean
    showSubject?: boolean
    letterStyle?: 'formal' | 'semi-formal' | 'creative'
  }
  
  // AI Generation Settings
  tone?: 'professional' | 'enthusiastic' | 'confident' | 'humble' | 'assertive'
  focus?: 'experience' | 'skills' | 'achievements' | 'culture-fit' | 'growth'
  length?: 'concise' | 'standard' | 'detailed'
  
  // Onboarding and metadata
  goal?: string
  experienceLevel?: string
  onboardingCompleted?: boolean
  
  // Versioning
  currentVersion?: number
  versions?: LetterVersion[]
}

export interface LetterVersion {
  version: number
  timestamp: Date
  subject?: string
  opening?: string
  body?: string[]
  closing?: string
  editRequest?: string
  explanation?: string
  isInitialDraft?: boolean
}

export interface LetterSection {
  title: string
  content: string[]
  listStyle?: 'bullet' | 'number' | 'arrow' | 'none'
}

export interface LetterTemplate {
  id: string
  name: string
  description: string
  preview: string
  styles: {
    fontFamily: string
    fontSize: string
    lineSpacing: string
    margins: string
    alignment: 'left' | 'center' | 'justify'
    letterStyle: 'formal' | 'semi-formal' | 'creative'
  }
}

export interface LetterQuestion {
  id: string
  textKey: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'file' | 'multiselect'
  required?: boolean
  placeholder?: string
  options?: string[]
  optionsLabels?: Record<string, string>
} 