# UAT Environment Setup Guide

This guide will help you set up a complete UAT (User Acceptance Testing) environment for LadderFox at `uat.ladderfox.com`.

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project: `ladderfox-uat`
   - Note down the database URL

2. **Set Environment Variables**
   ```bash
   # Copy the template
   cp env.uat.example .env.uat
   
   # Edit with your actual values
   DATABASE_URL="postgresql://postgres:[password]@db.[uat-project].supabase.co:5432/postgres"
   ```

### 2. Deploy to UAT

```bash
# Deploy to UAT environment
npm run deploy:uat
```

## 📋 Detailed Setup Steps

### Step 1: Database Configuration

#### Option A: Supabase (Recommended)
```bash
# 1. Create project at supabase.com
# 2. Get connection string from Settings → Database
# 3. Update .env.uat with your DATABASE_URL
```

#### Option B: Railway
```bash
# 1. Create new PostgreSQL database
# 2. Get connection string
# 3. Update .env.uat
```

### Step 2: Environment Variables

Create `.env.uat` with the following variables:

```bash
# Required
NODE_ENV=uat
NEXTAUTH_URL=https://uat.ladderfox.com
NEXTAUTH_SECRET=your-secure-secret-key
DATABASE_URL=your-uat-database-url

# Stripe (Test keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your-app-id

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Step 3: Database Migration

```bash
# Push schema to UAT database
npm run db:uat:push

# Set up test data
npm run setup:uat
```

### Step 4: Deploy to Vercel

```bash
# Deploy to UAT
npm run deploy:uat
```

## 🧪 Test Data

The UAT environment includes the following test accounts:

### Test Users
- **test1@uat.ladderfox.com** (Test User 1)
- **test2@uat.ladderfox.com** (Test User 2)  
- **admin@uat.ladderfox.com** (UAT Admin)

### Test Data
- Sample CVs with different templates
- Sample cover letters
- Sample job applications
- Test payment flows

## 🔧 Environment Features

### Environment Badge
- Orange "UAT" badge displayed in top-right corner
- Helps distinguish from production environment

### Test Mode
- All payments use Stripe test keys
- No real charges processed
- Test cards can be used for payment testing

### Enhanced Logging
- Debug logging enabled
- Error tracking for UAT environment
- Performance monitoring

## 🚨 Important Notes

### Security
- Use test API keys only
- No real user data in UAT
- Separate database from production

### Testing
- Test all features thoroughly
- Verify payment flows with test cards
- Check all templates and exports

### Data Management
- UAT database can be reset anytime
- Test data is automatically seeded
- No production data should be copied to UAT

## 🔄 Maintenance

### Regular Tasks
```bash
# Update UAT database schema
npm run db:uat:push

# Reset and reseed test data
npm run setup:uat

# Deploy latest changes
npm run deploy:uat
```

### Monitoring
- Check application logs
- Monitor database performance
- Verify all integrations work

## 🆘 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test database connection
npm run db:uat:studio
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

#### Deployment Issues
```bash
# Check Vercel logs
vercel logs

# Redeploy
npm run deploy:uat
```

### Support
- Check Vercel deployment logs
- Review application error logs
- Test database connectivity

## 📊 UAT Checklist

- [ ] Database connection working
- [ ] All pages load correctly
- [ ] User registration/login works
- [ ] CV builder functional
- [ ] Cover letter builder works
- [ ] PDF export working
- [ ] Payment flows (test mode)
- [ ] AI features operational
- [ ] File uploads working
- [ ] Email notifications (if configured)
- [ ] Environment badge visible
- [ ] No production data exposed

## 🎯 Next Steps

After UAT is running:

1. **Test thoroughly** - All features and user flows
2. **Gather feedback** - From team members and testers
3. **Fix issues** - Address any bugs or problems
4. **Prepare production** - Set up production environment
5. **Launch** - Deploy to production

---

**UAT URL**: https://uat.ladderfox.com
**Status**: Ready for testing
**Last Updated**: December 2024 