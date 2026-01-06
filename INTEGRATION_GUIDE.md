# LadderFox - Third-Party Integration Guide

## 🚀 **Quick Start Setup**

### 1. Environment Variables Setup
Copy `env.example` to `.env.local` and configure:

```bash
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/cv_ai_builder"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (Required for authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (Required for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_TEAM_PRICE_ID="price_..."

# UploadThing (Required for file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Analytics (Optional)
POSTHOG_API_KEY="your-posthog-api-key"
POSTHOG_HOST="https://app.posthog.com"
```

## 💳 **Stripe Integration**

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Create account and get API keys
3. Set up webhook endpoint

### 2. Create Products & Prices
```bash
# In Stripe Dashboard or via API
# Create Pro Plan
stripe products create --name "Pro Plan" --description "Unlimited AI requests and premium features"

# Create Pro Price (monthly)
stripe prices create \
  --product=prod_xxx \
  --unit-amount=700 \
  --currency=usd \
  --recurring-interval=month

# Create Team Plan
stripe products create --name "Team Plan" --description "Team features and analytics"

# Create Team Price (monthly)
stripe prices create \
  --product=prod_yyy \
  --unit-amount=1200 \
  --currency=usd \
  --recurring-interval=month
```

### 3. Set up Webhooks
```bash
# Create webhook endpoint
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook secret to .env.local
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Test Integration
```bash
# Test checkout flow
curl -X POST http://localhost:3000/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro","successUrl":"http://localhost:3000/success","cancelUrl":"http://localhost:3000/cancel"}'
```

## 📁 **UploadThing Integration**

### 1. Create UploadThing Account
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create account and get API keys
3. Set up file routes

### 2. Configure File Routes
```typescript
// src/app/api/uploadthing/core.ts
export const uploadRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Authentication middleware
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Handle upload completion
    }),
  
  cvDocument: f({ pdf: { maxFileSize: "10MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Authentication middleware
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Handle upload completion
    }),
}
```

### 3. Test File Upload
```bash
# Test profile image upload
curl -X POST http://localhost:3000/api/uploadthing/profileImage \
  -F "file=@profile.jpg" \
  -H "Authorization: Bearer your-token"
```

## 🔐 **Google OAuth Setup**

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API

### 2. Configure OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 3. Update Environment Variables
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 🤖 **OpenAI Integration**

### 1. Create OpenAI Account
1. Go to [openai.com](https://openai.com)
2. Create account and get API key
3. Add billing information

### 2. Configure API Key
```bash
OPENAI_API_KEY="sk-..."
```

### 3. Test AI Integration
```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## 🗄️ **Database Setup (Supabase)**

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string

### 2. Run Database Migrations
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed database
npx prisma db seed
```

### 3. Test Database Connection
```bash
# Open Prisma Studio
npx prisma studio

# Test API endpoints
curl http://localhost:3000/api/cv
```

## 📊 **Analytics Setup (PostHog)**

### 1. Create PostHog Account
1. Go to [posthog.com](https://posthog.com)
2. Create account and get API key
3. Set up project

### 2. Configure Analytics
```bash
POSTHOG_API_KEY="phc_..."
POSTHOG_HOST="https://app.posthog.com"
```

### 3. Track Events
```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js'

export const trackEvent = (event: string, properties?: any) => {
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties)
  }
}

// Usage
trackEvent('cv_created', {
  template: 'modern',
  hasPhoto: true,
  sections: ['experience', 'education']
})
```

## 🚀 **Deployment Setup**

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### 2. Environment Variables for Production
```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"

# Stripe (Production keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# UploadThing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"
```

### 3. Domain Configuration
1. Add custom domain in Vercel
2. Update Google OAuth redirect URIs
3. Update Stripe webhook endpoints
4. Configure SSL certificates

## 🔧 **Testing Checklist**

### Pre-Launch Testing
- [ ] Database connection working
- [ ] User authentication (Google OAuth)
- [ ] Stripe checkout flow
- [ ] File upload functionality
- [ ] AI chat responses
- [ ] PDF generation
- [ ] Email notifications
- [ ] Analytics tracking

### Load Testing
```bash
# Test with multiple concurrent users
npm run test:load

# Monitor database performance
npx prisma studio

# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/cv"
```

## 🛠️ **Troubleshooting**

### Common Issues

#### Stripe Webhook Failures
```bash
# Check webhook logs
stripe logs tail

# Verify webhook signature
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "stripe-signature: whsec_..." \
  -d "{}"
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database (development only)
npx prisma db push --force-reset
```

#### File Upload Failures
```bash
# Check UploadThing logs
# Verify file size limits
# Test with different file types
```

#### AI Rate Limiting
```bash
# Check OpenAI usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 📈 **Monitoring & Analytics**

### Key Metrics to Track
- User registration rate
- CV creation completion rate
- Subscription conversion rate
- AI usage patterns
- File upload success rate
- API response times

### Monitoring Tools
- Vercel Analytics
- PostHog for user behavior
- Stripe Dashboard for payments
- Supabase Dashboard for database
- UploadThing Dashboard for files

## 🔒 **Security Best Practices**

### Environment Variables
- Never commit `.env.local` to git
- Use different keys for development/production
- Rotate API keys regularly
- Use strong secrets for NextAuth

### API Security
- Validate all inputs
- Rate limit API endpoints
- Use HTTPS in production
- Implement proper CORS policies

### Data Protection
- Encrypt sensitive data
- Implement proper user permissions
- Regular security audits
- GDPR compliance for EU users

## 📚 **Additional Resources**

- [Stripe Documentation](https://stripe.com/docs)
- [UploadThing Documentation](https://uploadthing.com/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostHog Documentation](https://posthog.com/docs) 