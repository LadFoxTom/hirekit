import { LetterTemplate } from '@/types/letter'

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, formal business letter format',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    styles: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: '1in',
      alignment: 'left',
      letterStyle: 'formal'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary, clean design',
    preview: 'bg-gradient-to-br from-gray-50 to-slate-100',
    styles: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11pt',
      lineSpacing: '1.4',
      margins: '0.75in',
      alignment: 'left',
      letterStyle: 'semi-formal'
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium, sophisticated format',
    preview: 'bg-gradient-to-br from-purple-50 to-violet-100',
    styles: {
      fontFamily: 'Georgia, serif',
      fontSize: '12pt',
      lineSpacing: '1.6',
      margins: '1.25in',
      alignment: 'left',
      letterStyle: 'formal'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Innovative, modern design',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
    styles: {
      fontFamily: 'Calibri, sans-serif',
      fontSize: '11pt',
      lineSpacing: '1.3',
      margins: '0.5in',
      alignment: 'left',
      letterStyle: 'creative'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant design',
    preview: 'bg-gradient-to-br from-white to-gray-50',
    styles: {
      fontFamily: 'Helvetica, sans-serif',
      fontSize: '10pt',
      lineSpacing: '1.2',
      margins: '0.5in',
      alignment: 'left',
      letterStyle: 'semi-formal'
    }
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic business letter format',
    preview: 'bg-gradient-to-br from-amber-50 to-orange-100',
    styles: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: '1in',
      alignment: 'justify',
      letterStyle: 'formal'
    }
  }
] 