// Comprehensive font configuration system
export interface FontConfig {
  id: string
  name: string
  category: string
  fontFamily: string
  googleFonts?: string
  googleFontsUrl?: string
  cssVariable?: string
  description: string
  weights?: string[]
}

export const FONT_CONFIGS: FontConfig[] = [
  // Professional & Corporate
  {
    id: 'inter',
    name: 'Inter',
    category: 'Professional',
    fontFamily: 'Inter, sans-serif',
    googleFonts: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-inter',
    description: 'Modern, clean sans-serif perfect for professional documents',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'Professional',
    fontFamily: 'Roboto, sans-serif',
    googleFonts: 'Roboto',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    cssVariable: '--font-roboto',
    description: 'Google\'s signature font, excellent readability',
    weights: ['300', '400', '500', '700']
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Professional',
    fontFamily: 'Poppins, sans-serif',
    googleFonts: 'Poppins',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-poppins',
    description: 'Geometric sans-serif with rounded features',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Professional',
    fontFamily: 'Montserrat, sans-serif',
    googleFonts: 'Montserrat',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-montserrat',
    description: 'Elegant geometric sans-serif with modern appeal',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'Professional',
    fontFamily: 'Open Sans, sans-serif',
    googleFonts: 'Open+Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-open-sans',
    description: 'Humanist sans-serif designed for excellent legibility',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Professional',
    fontFamily: 'DM Sans, sans-serif',
    googleFonts: 'DM+Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-dm-sans',
    description: 'Low-contrast geometric sans-serif',
    weights: ['300', '400', '500', '600', '700']
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
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
    cssVariable: '--font-merriweather',
    description: 'Serif font designed for on-screen reading',
    weights: ['300', '400', '700']
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'Traditional',
    fontFamily: 'Playfair Display, serif',
    googleFonts: 'Playfair+Display',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    cssVariable: '--font-playfair-display',
    description: 'Elegant serif with dramatic thick-thin transitions',
    weights: ['400', '500', '600', '700']
  },
  {
    id: 'crimson-text',
    name: 'Crimson Text',
    category: 'Traditional',
    fontFamily: 'Crimson Text, serif',
    googleFonts: 'Crimson+Text',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
    cssVariable: '--font-crimson-text',
    description: 'Serif font designed for book typography',
    weights: ['400', '600', '700']
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'Traditional',
    fontFamily: 'Lora, serif',
    googleFonts: 'Lora',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
    cssVariable: '--font-lora',
    description: 'Serif font optimized for body text',
    weights: ['400', '500', '600', '700']
  },

  // Creative & Modern
  {
    id: 'nunito',
    name: 'Nunito',
    category: 'Creative',
    fontFamily: 'Nunito, sans-serif',
    googleFonts: 'Nunito',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-nunito',
    description: 'Rounded terminal sans-serif with friendly appearance',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'quicksand',
    name: 'Quicksand',
    category: 'Creative',
    fontFamily: 'Quicksand, sans-serif',
    googleFonts: 'Quicksand',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-quicksand',
    description: 'Display sans-serif with rounded terminals',
    weights: ['300', '400', '500', '600', '700']
  },

  // Technology & Digital
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'Technology',
    fontFamily: 'JetBrains Mono, monospace',
    googleFonts: 'JetBrains+Mono',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-jetbrains-mono',
    description: 'Programming font with ligatures and excellent readability',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    category: 'Technology',
    fontFamily: 'Source Code Pro, monospace',
    googleFonts: 'Source+Code+Pro',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-source-code-pro',
    description: 'Monospace font designed for source code',
    weights: ['300', '400', '500', '600', '700']
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'Technology',
    fontFamily: 'Fira Code, monospace',
    googleFonts: 'Fira+Code',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
    cssVariable: '--font-fira-code',
    description: 'Monospace font with programming ligatures',
    weights: ['300', '400', '500', '600', '700']
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
  }
]

// Get all Google Fonts URLs for loading
export const getGoogleFontsUrls = (): string[] => {
  return FONT_CONFIGS
    .filter(font => font.googleFontsUrl)
    .map(font => font.googleFontsUrl!)
}

// Get font by ID
export const getFontById = (id: string): FontConfig | undefined => {
  return FONT_CONFIGS.find(font => font.id === id)
}

// Get fonts by category
export const getFontsByCategory = (category: string): FontConfig[] => {
  return FONT_CONFIGS.filter(font => font.category === category)
}

// Get all categories
export const getFontCategories = (): string[] => {
  return Array.from(new Set(FONT_CONFIGS.map(font => font.category)))
} 