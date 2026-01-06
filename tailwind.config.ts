import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ladderfox: {
          light: '#8ECAE6',
          blue: '#219EBC',
          dark: '#023047',
          yellow: '#FFB703',
          orange: '#FB8500',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        // Professional fonts
        'font-inter': ['Inter', 'sans-serif'],
        'font-roboto': ['Roboto', 'sans-serif'],
        'font-poppins': ['Poppins', 'sans-serif'],
        'font-montserrat': ['Montserrat', 'sans-serif'],
        'font-open-sans': ['Open Sans', 'sans-serif'],
        'font-dm-sans': ['DM Sans', 'sans-serif'],
        
        // Traditional fonts
        'font-georgia': ['Georgia', 'serif'],
        'font-times': ['Times New Roman', 'serif'],
        'font-merriweather': ['Merriweather', 'serif'],
        'font-playfair': ['Playfair Display', 'serif'],
        'font-crimson': ['Crimson Text', 'serif'],
        'font-lora': ['Lora', 'serif'],
        
        // Creative fonts
        'font-nunito': ['Nunito', 'sans-serif'],
        'font-quicksand': ['Quicksand', 'sans-serif'],
        
        // Technology fonts
        'font-jetbrains': ['JetBrains Mono', 'monospace'],
        'font-source-code': ['Source Code Pro', 'monospace'],
        'font-fira-code': ['Fira Code', 'monospace'],
        
        // System fonts
        'font-system': ['system-ui', 'sans-serif'],
        'font-helvetica': ['Helvetica', 'Arial', 'sans-serif'],
        'font-arial': ['Arial', 'sans-serif'],
        'font-calibri': ['Calibri', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config 