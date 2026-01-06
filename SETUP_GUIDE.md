# LadderFox - Strategic Implementation Guide

## 🚀 Phase 1: Database & Infrastructure Setup (Week 1-2)

### 1.1 Database Setup

#### Install Dependencies
```bash
npm install @prisma/client prisma stripe @stripe/stripe-js uploadthing
npm install -D @types/stripe
```

#### Initialize Prisma
```bash
npx prisma init
```

#### Set up PostgreSQL Database
1. **Local Development**: Use Supabase (free tier)
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy connection string to `.env`

2. **Production**: Use Supabase Pro or Railway

#### Environment Variables
Copy `env.example` to `.env.local` and fill in:
```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OpenAI
OPENAI_API_KEY="..."

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### Generate and Run Migrations
```bash
npx prisma generate
npx prisma db push
```

### 1.2 Update Authentication

#### Replace in-memory users with database
Update `src/app/api/auth/[...nextauth]/route.ts` to use Prisma:

```typescript
import { prisma } from '@/lib/db'

// In callbacks.signIn
if (account?.provider === 'google') {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! }
  })
  
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: user.email!,
        name: user.name || '',
      }
    })
  }
}
```

### 1.3 Test Database Integration
```bash
npm run dev
# Test user registration and CV creation
```

## 💰 Phase 2: Monetization Setup (Week 2-3)

### 2.1 Stripe Integration

#### Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

#### Create Pricing Plans
```typescript
// src/lib/stripe.ts
export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['3 AI requests/week', 'Basic templates', 'Watermarked PDFs'],
    stripePriceId: null
  },
  pro: {
    name: 'Pro',
    price: 7,
    features: ['Unlimited AI requests', 'Premium templates', 'No watermark'],
    stripePriceId: 'price_...' // Create in Stripe Dashboard
  },
  team: {
    name: 'Team',
    price: 12,
    features: ['Everything in Pro', 'Team dashboard', 'Template sharing'],
    stripePriceId: 'price_...'
  }
}
```

#### Create Stripe API Routes
```typescript
// src/app/api/stripe/create-checkout/route.ts
// src/app/api/stripe/webhook/route.ts
// src/app/api/stripe/customer-portal/route.ts
```

### 2.2 Usage Tracking
Update chat API to track AI usage:

```typescript
// src/app/api/chat/route.ts
const canUseAI = await UserService.canUseAI(session.user.id)
if (!canUseAI) {
  return NextResponse.json({
    error: 'AI limit reached. Upgrade to Pro for unlimited requests.'
  }, { status: 429 })
}

// Track usage
await UserService.incrementAIRequests(session.user.id)
```

## 🎨 Phase 3: UX/UI Enhancements (Week 3-4)

### 3.1 Onboarding Wizard

#### Create Onboarding Component
```typescript
// src/components/OnboardingWizard.tsx
interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType
}

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to LadderFox',
    description: 'Let\'s create your professional CV in minutes',
    component: WelcomeStep
  },
  {
    id: 'goal',
    title: 'What\'s your goal?',
    description: 'Help us tailor your experience',
    component: GoalSelectionStep
  },
  {
    id: 'template',
    title: 'Choose your template',
    description: 'Pick a design that matches your industry',
    component: TemplateSelectionStep
  }
]
```

### 3.2 Dual Mode Interface

#### Add Mode Toggle
```typescript
// src/components/ModeToggle.tsx
type BuilderMode = 'guided' | 'manual'

interface ModeToggleProps {
  mode: BuilderMode
  onModeChange: (mode: BuilderMode) => void
}
```

#### Manual Editor Component
```typescript
// src/components/ManualCVEditor.tsx
// Tab-based interface for direct editing
```

### 3.3 Smart AI Enhancements

#### Role-based CV Assistance
```typescript
// src/lib/ai-prompts.ts
export const getRoleSpecificPrompt = (role: string) => {
  const rolePrompts = {
    'frontend-developer': 'Focus on React, TypeScript, and modern web technologies...',
    'data-scientist': 'Emphasize Python, machine learning, and statistical analysis...',
    'product-manager': 'Highlight leadership, project management, and business impact...'
  }
  return rolePrompts[role] || ''
}
```

## 🌐 Phase 4: SEO & Growth (Week 4-5)

### 4.1 Technical SEO

#### Add Meta Tags
```typescript
// src/app/layout.tsx
export const metadata = {
  title: 'LadderFox - Create Professional Resumes with AI',
  description: 'Build job-winning CVs in minutes with AI assistance. Choose from 8+ professional templates.',
  openGraph: {
    title: 'LadderFox',
    description: 'AI-powered CV creation',
    images: ['/og-image.png']
  }
}
```

#### Create Sitemap
```typescript
// src/app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://ladderfox.com',
      lastModified: new Date(),
    },
    {
      url: 'https://ladderfox.com/templates',
      lastModified: new Date(),
    },
    // Add more URLs
  ]
}
```

### 4.2 Content Strategy

#### Create Blog Structure
```
src/app/blog/
├── page.tsx
├── [slug]/
│   └── page.tsx
└── categories/
    ├── cv-tips/
    ├── templates/
    └── ai-writing/
```

#### Sample Blog Posts
- "10 CV Mistakes That Cost You Interviews"
- "How to Write a CV Summary That Gets You Hired"
- "Best CV Templates for Tech Professionals"
- "AI vs Human: When to Use Each for CV Writing"

## 📊 Phase 5: Analytics & Optimization (Week 5-6)

### 5.1 Analytics Setup

#### Install Analytics
```bash
npm install posthog-js
```

#### Track Key Events
```typescript
// src/lib/analytics.ts
export const trackEvent = (event: string, properties?: any) => {
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties)
  }
}

// Track CV creation
trackEvent('cv_created', {
  template: templateId,
  hasPhoto: !!photoUrl,
  sections: Object.keys(cvData)
})
```

### 5.2 Performance Optimization

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={template.preview}
  alt={template.name}
  width={300}
  height={200}
  priority
/>
```

#### Code Splitting
```typescript
// Lazy load heavy components
const CVPreview = dynamic(() => import('@/components/CVPreview'), {
  loading: () => <div>Loading preview...</div>
})
```

## 🚀 Phase 6: Deployment & Launch (Week 6)

### 6.1 Production Deployment

#### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

#### Database Migration
```bash
npx prisma db push --accept-data-loss
```

### 6.2 Monitoring Setup

#### Error Tracking
```bash
npm install @sentry/nextjs
```

#### Performance Monitoring
- Vercel Analytics
- PostHog for user behavior
- Database query monitoring

## 📈 Success Metrics

### Week 1-2: Infrastructure
- [ ] Database connected and working
- [ ] User authentication with database
- [ ] CV CRUD operations functional

### Week 3-4: Monetization
- [ ] Database connected and working
- [ ] Stripe integration complete
- [ ] Usage tracking implemented
- [ ] Premium features gated

### Week 5-6: Growth
- [ ] SEO optimized
- [ ] Analytics tracking
- [ ] Performance optimized

### Month 2: Scale
- [ ] 100+ users
- [ ] 10+ premium conversions
- [ ] 50+ CVs created

## 🎯 Next Steps After Launch

1. **A/B Testing**: Test different onboarding flows
2. **Feature Requests**: Implement user-requested features
3. **Partnerships**: Job board integrations
4. **Mobile App**: React Native version
5. **Enterprise**: B2B features for HR teams

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostHog Documentation](https://posthog.com/docs) 