# LadderFox Design System
## Style Guide for External Development (board.ladderfox.com)

**Version**: 1.0  
**Last Updated**: January 2025  
**Purpose**: Job Board Application Development  
**Integration**: Must maintain visual consistency with main LadderFox application

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Dark Mode](#dark-mode)
7. [Animations & Transitions](#animations--transitions)
8. [Icons](#icons)
9. [Forms & Inputs](#forms--inputs)
10. [Buttons](#buttons)
11. [Cards & Containers](#cards--containers)
12. [Navigation](#navigation)
13. [Responsive Design](#responsive-design)
14. [Code Examples](#code-examples)

---

## Brand Overview

**LadderFox** is a modern, AI-powered career platform. The design philosophy emphasizes:
- **Professional yet approachable**: Clean, modern interface
- **High contrast**: Dark backgrounds with vibrant accents
- **Smooth interactions**: Subtle animations and transitions
- **Accessibility first**: WCAG 2.1 AA compliant

---

## Color Palette

### Primary Brand Colors

```css
/* CSS Custom Properties */
:root {
  --color-ladderfox-light: #8ECAE6;    /* Light Blue */
  --color-ladderfox-blue: #219EBC;     /* Primary Blue */
  --color-ladderfox-dark: #023047;     /* Dark Blue */
  --color-ladderfox-yellow: #FFB703;   /* Accent Yellow */
  --color-ladderfox-orange: #FB8500;   /* Accent Orange */
}
```

**Hex Values**:
- **Light Blue**: `#8ECAE6` - Used for backgrounds, highlights
- **Primary Blue**: `#219EBC` - Primary actions, links, emphasis
- **Dark Blue**: `#023047` - Text, headers, dark backgrounds
- **Accent Yellow**: `#FFB703` - Warnings, highlights, CTAs
- **Accent Orange**: `#FB8500` - Important actions, alerts

### Extended Color System (Tailwind)

**Primary Palette** (Blue spectrum):
```css
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  /* Base */
primary-600: #0284c7
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
```

**Named LadderFox Colors** (Tailwind classes):
```css
ladderfox-light:  #8ECAE6
ladderfox-blue:   #219EBC
ladderfox-dark:   #023047
ladderfox-yellow: #FFB703
ladderfox-orange: #FB8500
```

### Semantic Colors

**Success**:
```css
success-light: #10b981
success-dark:  #059669
```

**Warning**:
```css
warning-light: #FFB703  /* LadderFox Yellow */
warning-dark:  #f59e0b
```

**Error**:
```css
error-light: #ef4444
error-dark:  #dc2626
```

**Info**:
```css
info-light: #3b82f6
info-dark:  #2563eb
```

### Dark Mode Background Colors

```css
/* Main backgrounds */
bg-primary:   #0a0a0a   /* Page background */
bg-secondary: #0d0d0d   /* Section background */
bg-tertiary:  #1a1a1a   /* Card background */
bg-elevated:  #1f1f1f   /* Elevated elements */

/* Borders */
border-subtle:  rgba(255, 255, 255, 0.05)  /* white/5 */
border-medium:  rgba(255, 255, 255, 0.10)  /* white/10 */
border-strong:  rgba(255, 255, 255, 0.20)  /* white/20 */
```

### Text Colors

```css
/* Dark mode text */
text-primary:   #ffffff       /* Headings, important text */
text-secondary: #d1d5db       /* Body text (gray-300) */
text-tertiary:  #9ca3af       /* Muted text (gray-400) */
text-disabled:  #6b7280       /* Disabled text (gray-500) */

/* Light mode text */
text-dark:      #111827       /* Primary text (gray-900) */
text-dark-muted:#4b5563       /* Secondary text (gray-600) */
```

---

## Typography

### Font Families

**Primary Font**: Inter (sans-serif)
```css
font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
```

**Available Fonts** (via Google Fonts):
- **Sans-serif**: Inter (primary), Roboto, Poppins, Montserrat, Open Sans, DM Sans, Nunito, Quicksand
- **Serif**: Merriweather, Playfair Display, Crimson Text, Lora, Georgia, Times New Roman
- **Monospace**: JetBrains Mono, Source Code Pro, Fira Code

### Font Sizes

```css
/* Tailwind classes */
text-xs:   0.75rem   (12px)
text-sm:   0.875rem  (14px)
text-base: 1rem      (16px)
text-lg:   1.125rem  (18px)
text-xl:   1.25rem   (20px)
text-2xl:  1.5rem    (24px)
text-3xl:  1.875rem  (30px)
text-4xl:  2.25rem   (36px)
text-5xl:  3rem      (48px)
text-6xl:  3.75rem   (60px)
```

### Font Weights

```css
font-light:     300
font-normal:    400
font-medium:    500
font-semibold:  600
font-bold:      700
```

### Line Heights

```css
leading-none:   1
leading-tight:  1.25
leading-snug:   1.375
leading-normal: 1.5
leading-relaxed:1.625
leading-loose:  2
```

### Typography Scale

**Headings**:
```css
/* H1 - Page titles */
font-size: 2.25rem (36px)
font-weight: 700
line-height: 1.2
color: #ffffff (dark mode)

/* H2 - Section titles */
font-size: 1.875rem (30px)
font-weight: 600
line-height: 1.3
color: #ffffff

/* H3 - Subsection titles */
font-size: 1.5rem (24px)
font-weight: 600
line-height: 1.4
color: #d1d5db

/* H4 - Component titles */
font-size: 1.25rem (20px)
font-weight: 500
line-height: 1.5
color: #d1d5db
```

**Body Text**:
```css
/* Regular body */
font-size: 1rem (16px)
font-weight: 400
line-height: 1.5
color: #d1d5db

/* Small text */
font-size: 0.875rem (14px)
font-weight: 400
line-height: 1.5
color: #9ca3af

/* Captions */
font-size: 0.75rem (12px)
font-weight: 400
line-height: 1.5
color: #6b7280
```

---

## Spacing & Layout

### Spacing Scale (Tailwind)

```css
0:    0px
1:    0.25rem  (4px)
2:    0.5rem   (8px)
3:    0.75rem  (12px)
4:    1rem     (16px)
5:    1.25rem  (20px)
6:    1.5rem   (24px)
8:    2rem     (32px)
10:   2.5rem   (40px)
12:   3rem     (48px)
16:   4rem     (64px)
20:   5rem     (80px)
24:   6rem     (96px)
32:   8rem     (128px)
40:   10rem    (160px)
48:   12rem    (192px)
64:   16rem    (256px)
128:  32rem    (512px)
144:  36rem    (576px)
```

### Container Widths

```css
/* Max widths */
max-w-xs:   20rem   (320px)
max-w-sm:   24rem   (384px)
max-w-md:   28rem   (448px)
max-w-lg:   32rem   (512px)
max-w-xl:   36rem   (576px)
max-w-2xl:  42rem   (672px)
max-w-3xl:  48rem   (768px)
max-w-4xl:  56rem   (896px)
max-w-5xl:  64rem   (1024px)
max-w-6xl:  72rem   (1152px)
max-w-7xl:  80rem   (1280px)
```

### Layout Grid

**Standard Page Layout**:
```html
<div class="min-h-screen bg-[#0a0a0a]">
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Content -->
  </main>
</div>
```

**Responsive Padding**:
```css
/* Mobile */
px-4 py-4   (16px)

/* Tablet */
sm:px-6 sm:py-6   (24px)

/* Desktop */
lg:px-8 lg:py-8   (32px)
```

---

## Components

### Cards

**Standard Card**:
```html
<div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 
            hover:border-white/10 transition-all duration-300 
            shadow-lg hover:shadow-xl">
  <!-- Card content -->
</div>
```

**Elevated Card**:
```html
<div class="bg-[#1f1f1f] border border-white/10 rounded-xl p-6 
            shadow-2xl">
  <!-- Card content -->
</div>
```

**Interactive Card** (hover effects):
```html
<div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 
            cursor-pointer hover:border-blue-500/50 
            hover:bg-[#1f1f1f] transition-all duration-300 
            transform hover:scale-[1.02]">
  <!-- Card content -->
</div>
```

### Gradients

**Primary Gradient** (Blue to Purple):
```css
background: linear-gradient(to right, #0ea5e9, #8b5cf6);
/* Tailwind: bg-gradient-to-r from-blue-500 to-purple-500 */
```

**Accent Gradient** (Orange to Yellow):
```css
background: linear-gradient(to right, #FB8500, #FFB703);
/* Tailwind: bg-gradient-to-r from-[#FB8500] to-[#FFB703] */
```

**Success Gradient**:
```css
background: linear-gradient(to right, #10b981, #059669);
/* Tailwind: bg-gradient-to-r from-green-500 to-green-600 */
```

**Overlay Gradient** (for backgrounds):
```css
background: linear-gradient(to bottom, rgba(10, 10, 10, 0), rgba(10, 10, 10, 1));
```

---

## Dark Mode

LadderFox uses **dark mode by default**. All components should be designed with dark backgrounds.

### Dark Mode Color System

```css
/* Background layers (darkest to lightest) */
bg-[#0a0a0a]  /* Page background */
bg-[#0d0d0d]  /* Section background */
bg-[#1a1a1a]  /* Card background */
bg-[#1f1f1f]  /* Elevated elements */
bg-[#2a2a2a]  /* Hover states */

/* Borders (subtle to strong) */
border-white/5   /* Subtle dividers */
border-white/10  /* Standard borders */
border-white/20  /* Emphasized borders */
border-white/30  /* Strong borders */

/* Text (bright to muted) */
text-white          /* Headings */
text-gray-200       /* Body text */
text-gray-300       /* Secondary text */
text-gray-400       /* Muted text */
text-gray-500       /* Disabled text */
```

### Contrast Requirements

- **Text on dark background**: Minimum contrast ratio 7:1
- **Interactive elements**: Minimum contrast ratio 4.5:1
- **Focus indicators**: Minimum 3:1 contrast with background

---

## Animations & Transitions

### Transition Speeds

```css
transition-none:    0ms
transition-fast:    150ms
transition-normal:  300ms
transition-slow:    500ms
```

### Hover Transitions

**Standard hover**:
```css
transition-all duration-300 hover:scale-105
```

**Subtle hover**:
```css
transition-colors duration-200
```

**Smooth transform**:
```css
transition-transform duration-300 ease-in-out
```

### Framer Motion Variants

**Fade In**:
```javascript
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}
```

**Slide In**:
```javascript
const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}
```

**Scale In**:
```javascript
const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
}
```

---

## Icons

**Icon Library**: React Icons (Feather Icons - `react-icons/fi`)

### Common Icons

```javascript
import { 
  FiMenu, FiX, FiUser, FiSettings, FiBriefcase,
  FiFileText, FiEdit3, FiTrash2, FiDownload,
  FiSearch, FiFilter, FiChevronDown, FiChevronRight,
  FiPlus, FiCheck, FiStar, FiHeart,
  FiMail, FiPhone, FiMapPin, FiCalendar,
  FiClock, FiDollarSign, FiTrendingUp
} from 'react-icons/fi';
```

### Icon Sizes

```css
size={16}   /* Small - 16px */
size={20}   /* Medium - 20px */
size={24}   /* Large - 24px */
size={32}   /* XLarge - 32px */
```

### Icon Colors

```css
text-gray-400     /* Muted icons */
text-gray-300     /* Standard icons */
text-white        /* Emphasized icons */
text-blue-500     /* Primary action icons */
text-green-500    /* Success icons */
text-yellow-500   /* Warning icons */
text-red-500      /* Error/danger icons */
```

---

## Forms & Inputs

### Text Input

```html
<input 
  type="text"
  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 
         rounded-lg text-gray-300 placeholder-gray-500 
         focus:outline-none focus:border-blue-500 focus:ring-1 
         focus:ring-blue-500 transition-all"
  placeholder="Enter text..."
/>
```

### Textarea

```html
<textarea 
  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 
         rounded-lg text-gray-300 placeholder-gray-500 
         focus:outline-none focus:border-blue-500 focus:ring-1 
         focus:ring-blue-500 transition-all resize-none"
  rows="4"
  placeholder="Enter description..."
></textarea>
```

### Select Dropdown

```html
<select 
  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 
         rounded-lg text-gray-300 focus:outline-none 
         focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
         transition-all appearance-none cursor-pointer">
  <option>Select option...</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox

```html
<label class="flex items-center gap-3 cursor-pointer group">
  <input 
    type="checkbox"
    class="w-5 h-5 rounded border-white/20 bg-[#0a0a0a] 
           text-blue-500 focus:ring-2 focus:ring-blue-500 
           focus:ring-offset-0 transition-all cursor-pointer"
  />
  <span class="text-gray-300 group-hover:text-white transition-colors">
    Remember me
  </span>
</label>
```

### Radio Button

```html
<label class="flex items-center gap-3 cursor-pointer group">
  <input 
    type="radio"
    name="option"
    class="w-5 h-5 border-white/20 bg-[#0a0a0a] text-blue-500 
           focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 
           transition-all cursor-pointer"
  />
  <span class="text-gray-300 group-hover:text-white transition-colors">
    Option 1
  </span>
</label>
```

### Search Input

```html
<div class="relative">
  <input 
    type="search"
    class="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-white/10 
           rounded-lg text-gray-300 placeholder-gray-500 
           focus:outline-none focus:border-blue-500 focus:ring-1 
           focus:ring-blue-500 transition-all"
    placeholder="Search jobs..."
  />
  <FiSearch class="absolute left-4 top-1/2 -translate-y-1/2 
                   text-gray-400" size={20} />
</div>
```

---

## Buttons

### Primary Button

```html
<button class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
               hover:from-blue-600 hover:to-purple-600 
               text-white font-medium rounded-lg 
               transition-all duration-300 shadow-lg 
               hover:shadow-xl transform hover:scale-105 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:ring-offset-2 focus:ring-offset-[#0a0a0a]">
  Primary Action
</button>
```

### Secondary Button

```html
<button class="px-6 py-3 bg-white/5 hover:bg-white/10 
               text-gray-300 hover:text-white 
               border border-white/10 hover:border-white/20 
               font-medium rounded-lg transition-all duration-300 
               focus:outline-none focus:ring-2 focus:ring-gray-500">
  Secondary Action
</button>
```

### Outline Button

```html
<button class="px-6 py-3 bg-transparent border-2 border-blue-500 
               text-blue-400 hover:bg-blue-500/10 
               font-medium rounded-lg transition-all duration-300 
               focus:outline-none focus:ring-2 focus:ring-blue-500">
  Outline Button
</button>
```

### Icon Button

```html
<button class="p-3 bg-white/5 hover:bg-white/10 
               text-gray-400 hover:text-white 
               rounded-lg transition-colors duration-200 
               focus:outline-none focus:ring-2 focus:ring-gray-500">
  <FiSettings size={20} />
</button>
```

### Danger Button

```html
<button class="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 
               text-red-400 hover:text-red-300 
               border border-red-500/30 hover:border-red-500/50 
               font-medium rounded-lg transition-all duration-300 
               focus:outline-none focus:ring-2 focus:ring-red-500">
  Delete
</button>
```

### Success Button

```html
<button class="px-6 py-3 bg-green-500/10 hover:bg-green-500/20 
               text-green-400 hover:text-green-300 
               border border-green-500/30 hover:border-green-500/50 
               font-medium rounded-lg transition-all duration-300 
               focus:outline-none focus:ring-2 focus:ring-green-500">
  Save
</button>
```

### Disabled Button

```html
<button class="px-6 py-3 bg-gray-800 text-gray-500 
               font-medium rounded-lg cursor-not-allowed opacity-50"
        disabled>
  Disabled
</button>
```

---

## Cards & Containers

### Job Card (Recommended for Job Board)

```html
<div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 
            hover:border-blue-500/30 hover:bg-[#1f1f1f] 
            transition-all duration-300 cursor-pointer group">
  <!-- Header -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
      <h3 class="text-xl font-semibold text-white mb-2 
                 group-hover:text-blue-400 transition-colors">
        Senior Software Engineer
      </h3>
      <p class="text-gray-400 text-sm">Company Name • Location</p>
    </div>
    <button class="p-2 hover:bg-white/5 rounded-lg transition-colors">
      <FiHeart class="text-gray-400 hover:text-red-400" size={20} />
    </button>
  </div>
  
  <!-- Tags -->
  <div class="flex flex-wrap gap-2 mb-4">
    <span class="px-3 py-1 bg-blue-500/10 text-blue-400 
                 text-xs rounded-full border border-blue-500/20">
      Full-time
    </span>
    <span class="px-3 py-1 bg-green-500/10 text-green-400 
                 text-xs rounded-full border border-green-500/20">
      Remote
    </span>
  </div>
  
  <!-- Description -->
  <p class="text-gray-300 text-sm mb-4 line-clamp-2">
    Job description text goes here...
  </p>
  
  <!-- Footer -->
  <div class="flex items-center justify-between pt-4 
              border-t border-white/5">
    <span class="text-gray-400 text-sm flex items-center gap-2">
      <FiClock size={16} />
      Posted 2 days ago
    </span>
    <span class="text-green-400 font-medium">$120k - $150k</span>
  </div>
</div>
```

### Section Container

```html
<section class="py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold text-white mb-8">Section Title</h2>
    <!-- Section content -->
  </div>
</section>
```

### Modal/Dialog

```html
<div class="fixed inset-0 bg-black/80 backdrop-blur-sm 
            flex items-center justify-center z-50 p-4">
  <div class="bg-[#1a1a1a] border border-white/10 rounded-2xl 
              max-w-lg w-full p-8 shadow-2xl">
    <!-- Modal header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold text-white">Modal Title</h3>
      <button class="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <FiX class="text-gray-400" size={24} />
      </button>
    </div>
    
    <!-- Modal content -->
    <div class="mb-6">
      <!-- Content -->
    </div>
    
    <!-- Modal actions -->
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2 bg-white/5 hover:bg-white/10 
                     text-gray-300 rounded-lg transition-colors">
        Cancel
      </button>
      <button class="px-4 py-2 bg-gradient-to-r from-blue-500 
                     to-purple-500 text-white rounded-lg 
                     hover:from-blue-600 hover:to-purple-600 
                     transition-all">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Navigation

### Top Navigation Bar

```html
<nav class="bg-[#0d0d0d] border-b border-white/5 sticky top-0 z-50 
            backdrop-blur-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="text-2xl font-bold">
          <span class="text-white">Ladder</span>
          <span class="text-blue-500">Fox</span>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-6">
        <a href="#" class="text-gray-300 hover:text-white 
                          transition-colors">
          Jobs
        </a>
        <a href="#" class="text-gray-300 hover:text-white 
                          transition-colors">
          Companies
        </a>
        <a href="#" class="text-gray-300 hover:text-white 
                          transition-colors">
          About
        </a>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 bg-white/5 hover:bg-white/10 
                       text-gray-300 rounded-lg transition-colors">
          Sign In
        </button>
        <button class="px-4 py-2 bg-gradient-to-r from-blue-500 
                       to-purple-500 text-white rounded-lg 
                       hover:from-blue-600 hover:to-purple-600 
                       transition-all">
          Post Job
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Sidebar Navigation

```html
<aside class="w-64 bg-[#0d0d0d] border-r border-white/5 
              h-screen sticky top-0 p-4">
  <!-- Logo -->
  <div class="mb-8">
    <div class="text-2xl font-bold">
      <span class="text-white">Ladder</span>
      <span class="text-blue-500">Fox</span>
    </div>
  </div>
  
  <!-- Navigation Items -->
  <nav class="space-y-2">
    <a href="#" class="flex items-center gap-3 px-4 py-3 
                       bg-blue-500/10 text-blue-400 
                       border-l-2 border-blue-500 rounded-r-lg">
      <FiBriefcase size={20} />
      <span class="font-medium">Jobs</span>
    </a>
    
    <a href="#" class="flex items-center gap-3 px-4 py-3 
                       text-gray-400 hover:text-white hover:bg-white/5 
                       rounded-lg transition-all">
      <FiFileText size={20} />
      <span>Applications</span>
    </a>
    
    <a href="#" class="flex items-center gap-3 px-4 py-3 
                       text-gray-400 hover:text-white hover:bg-white/5 
                       rounded-lg transition-all">
      <FiSettings size={20} />
      <span>Settings</span>
    </a>
  </nav>
</aside>
```

---

## Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
sm:   640px   /* Small devices (tablets) */
md:   768px   /* Medium devices (landscape tablets) */
lg:   1024px  /* Large devices (laptops) */
xl:   1280px  /* Extra large devices (desktops) */
2xl:  1536px  /* 2X large devices (large desktops) */
```

### Mobile-First Approach

**Always design mobile-first, then scale up**:

```html
<div class="px-4 sm:px-6 lg:px-8">
  <!-- Mobile: 16px padding -->
  <!-- Tablet: 24px padding -->
  <!-- Desktop: 32px padding -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Mobile: 1 column -->
  <!-- Tablet: 2 columns -->
  <!-- Desktop: 3 columns -->
</div>
```

### Mobile Navigation (Hamburger Menu)

```html
<!-- Mobile menu button -->
<button class="md:hidden p-2 text-gray-400 hover:text-white">
  <FiMenu size={24} />
</button>

<!-- Mobile menu (hidden by default) -->
<div class="md:hidden fixed inset-0 bg-[#0d0d0d] z-50 
            transform translate-x-full transition-transform">
  <!-- Menu content -->
</div>
```

---

## Code Examples

### Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LadderFox Job Board</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --color-ladderfox-light: #8ECAE6;
      --color-ladderfox-blue: #219EBC;
      --color-ladderfox-dark: #023047;
      --color-ladderfox-yellow: #FFB703;
      --color-ladderfox-orange: #FB8500;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0a;
      color: #d1d5db;
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="bg-[#0d0d0d] border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="text-2xl font-bold">
          <span class="text-white">Ladder</span>
          <span class="text-blue-500">Fox</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 bg-white/5 hover:bg-white/10 
                         text-gray-300 rounded-lg transition-colors">
            Sign In
          </button>
          <button class="px-4 py-2 bg-gradient-to-r from-blue-500 
                         to-purple-500 text-white rounded-lg">
            Post Job
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-bold text-white mb-8">
      Find Your Dream Job
    </h1>
    
    <!-- Job Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Job Card -->
      <div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 
                  hover:border-blue-500/30 transition-all">
        <h3 class="text-xl font-semibold text-white mb-2">
          Job Title
        </h3>
        <p class="text-gray-400 text-sm mb-4">
          Company • Location
        </p>
        <p class="text-gray-300 text-sm">
          Job description...
        </p>
      </div>
    </div>
  </main>
</body>
</html>
```

---

## Integration with LadderFox API

The job board should be designed to integrate with LadderFox's job agent API.

### Expected API Endpoints

```javascript
// GET /api/jobs - Retrieve job listings
// POST /api/jobs - Create new job listing
// GET /api/jobs/:id - Get specific job
// PUT /api/jobs/:id - Update job
// DELETE /api/jobs/:id - Delete job

// Example job object structure:
{
  id: "job_123",
  title: "Senior Software Engineer",
  company: "Company Name",
  location: "Remote",
  type: "Full-time",
  salary: "$120k - $150k",
  description: "Job description...",
  requirements: ["Requirement 1", "Requirement 2"],
  benefits: ["Benefit 1", "Benefit 2"],
  tags: ["React", "TypeScript", "Remote"],
  postedDate: "2025-01-01",
  applicationUrl: "https://...",
  companyLogo: "https://..."
}
```

---

## Additional Resources

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ladderfox: {
          light: '#8ECAE6',
          blue: '#219EBC',
          dark: '#023047',
          yellow: '#FFB703',
          orange: '#FB8500',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}
```

### CSS Custom Properties (for non-Tailwind projects)

```css
:root {
  /* Brand Colors */
  --color-ladderfox-light: #8ECAE6;
  --color-ladderfox-blue: #219EBC;
  --color-ladderfox-dark: #023047;
  --color-ladderfox-yellow: #FFB703;
  --color-ladderfox-orange: #FB8500;
  
  /* Background Colors */
  --bg-primary: #0a0a0a;
  --bg-secondary: #0d0d0d;
  --bg-tertiary: #1a1a1a;
  --bg-elevated: #1f1f1f;
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --text-disabled: #6b7280;
  
  /* Border Colors */
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-medium: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.20);
}
```

---

## Quick Reference Card

### Most Common Classes

**Backgrounds**:
- `bg-[#0a0a0a]` - Page background
- `bg-[#1a1a1a]` - Card background
- `bg-gradient-to-r from-blue-500 to-purple-500` - Primary gradient

**Text**:
- `text-white` - Headings
- `text-gray-300` - Body text
- `text-gray-400` - Muted text

**Borders**:
- `border border-white/5` - Subtle border
- `border border-white/10` - Standard border

**Spacing**:
- `p-6` - Standard padding (24px)
- `gap-4` - Standard gap (16px)
- `mb-4` - Standard margin bottom (16px)

**Hover Effects**:
- `hover:bg-white/10` - Subtle hover
- `hover:scale-105` - Scale hover
- `transition-all duration-300` - Smooth transition

---

## Contact & Support

For questions about implementing this design system:
- **Primary Application**: cv-ai-builder (main LadderFox app)
- **Target Application**: board.ladderfox.com (job board)
- **Design Philosophy**: Dark mode, modern, professional, accessible

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: LadderFox Development Team

