# 🚀 Production Migration Guide
## Moving from UAT to Production (ladderfox.com)

**Current Status**: UAT at `uat.ladderfox.com`  
**Target**: Production at `ladderfox.com`  
**Folder**: PROD LadderFox (renamed from cv-ai-builder)

---

## 📋 Pre-Migration Checklist

Before starting, ensure you have:

- [ ] Production API keys ready (see list below)
- [ ] Production database created (Neon.tech/PostgreSQL)
- [ ] Production Stripe account configured
- [ ] Production domain (`ladderfox.com`) ready
- [ ] Vercel account access
- [ ] Backup of UAT database (optional but recommended)

---

## 🎯 Step-by-Step Migration Process

### **Phase 1: Prepare Production Environment Variables**

#### 1.1 Create Production API Keys

You'll need to obtain/create production keys for:

**OpenAI** (AI Features):
- [ ] Get production OpenAI API key from https://platform.openai.com/api-keys
- [ ] Ensure you have sufficient credits/quota

**Adzuna** (Job Search):
- [ ] Get production Adzuna credentials from https://developer.adzuna.com/
- [ ] Note: Free tier is 5,000 calls/month, consider upgrading if needed

**Stripe** (Payments):
- [ ] Switch to **Live Mode** in Stripe Dashboard
- [ ] Get production keys:
  - `STRIPE_SECRET_KEY` (starts with `sk_live_`)
  - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_`)
- [ ] Create production products/prices in Stripe Dashboard
- [ ] Set up production webhook endpoint

**UploadThing** (File Uploads):
- [ ] Use existing UploadThing account (or create new)
- [ ] Get production keys from https://uploadthing.com/dashboard

**Google OAuth** (Authentication):
- [ ] Update OAuth credentials in Google Cloud Console
- [ ] Add `ladderfox.com` to authorized domains
- [ ] Update redirect URIs:
  - `https://ladderfox.com/api/auth/callback/google`
  - `https://www.ladderfox.com/api/auth/callback/google`

**NextAuth** (Session Management):
- [ ] Generate new `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```

#### 1.2 Create Production Database

**Option A: Neon.tech (Recommended - Same as UAT)**
1. Go to https://neon.tech
2. Sign in to your account (or create one)
3. Create new project: `ladderfox-production`
4. Select region closest to your users
5. Choose PostgreSQL version (14+ recommended)
6. Copy the connection string from the dashboard
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
7. **Enable Connection Pooling** (Critical for Vercel/serverless):
   - In Neon dashboard, go to your project settings
   - Enable "Connection Pooling" (PgBouncer)
   - Use the pooled connection string for production
   - Pooled format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require&pgbouncer=true`
   - **Why?** Vercel uses serverless functions that create many connections. Pooling prevents connection limit issues.
8. Run migrations:
   ```bash
   DATABASE_URL="your-neon-production-db-url" npx prisma db push
   ```
9. **Test connection**:
   ```bash
   # Test locally with production connection string
   DATABASE_URL="your-neon-url" npx prisma studio
   ```

**Option B: Supabase (Alternative)**
1. Go to https://supabase.com
2. Create new project: `ladderfox-production`
3. Note the database connection string
4. Run migrations:
   ```bash
   DATABASE_URL="your-production-db-url" npx prisma db push
   ```

**Option C: Other PostgreSQL Provider**
- Railway, AWS RDS, etc.
- Ensure PostgreSQL 14+ compatibility

---

### **Phase 2: Set Up New Vercel Project**

#### 2.1 Create New Vercel Project

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Git Repository**:
   - Connect your repository (GitHub/GitLab/Bitbucket)
   - Select the repository containing "PROD LadderFox"
4. **Project Settings**:
   - **Project Name**: `ladderfox` or `ladderfox-production`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

#### 2.2 Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

**Required Variables:**

```bash
# Environment
NODE_ENV=production

# NextAuth
NEXTAUTH_URL=https://ladderfox.com
NEXTAUTH_SECRET=<generate-new-secret-here>

# Database
DATABASE_URL=<your-production-database-url>

# OpenAI
OPENAI_API_KEY=<your-production-openai-key>

# Adzuna
ADZUNA_APP_ID=<your-production-adzuna-app-id>
ADZUNA_API_KEY=<your-production-adzuna-api-key>

# Stripe (Production - Live Mode)
STRIPE_SECRET_KEY=sk_live_<your-stripe-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>

# Stripe Price IDs (Production)
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR=price_<your-price-id>
STRIPE_BASIC_MONTHLY_PRICE_ID_USD=price_<your-price-id>
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR=price_<your-price-id>
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD=price_<your-price-id>
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_<your-price-id>
STRIPE_BASIC_YEARLY_PRICE_ID_USD=price_<your-price-id>

# UploadThing
UPLOADTHING_SECRET=sk_live_<your-uploadthing-secret>
UPLOADTHING_APP_ID=<your-uploadthing-app-id>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Supabase (optional - only if using Supabase instead of Neon)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-key>
```

**Important**: 
- Set these for **Production** environment only (not Preview/Development)
- Use **Production** keys (not test keys)

#### 2.3 Configure Domain

1. In Vercel project → **Settings** → **Domains**
2. **Add Domain**: `ladderfox.com`
3. **Add Domain**: `www.ladderfox.com` (optional, for www redirect)
4. Follow DNS configuration instructions:
   - Add A record or CNAME as instructed
   - Wait for DNS propagation (can take up to 24 hours, usually < 1 hour)

---

### **Phase 3: Update Code for Production**

#### 3.1 Update Package.json

Update the project name in `package.json`:

```json
{
  "name": "ladderfox",
  "version": "1.0.0",
  ...
}
```

#### 3.2 Update Environment Detection

The `src/lib/environment.ts` file should already handle production. Verify:

```typescript
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};
```

#### 3.3 Update NEXTAUTH_URL

Ensure `NEXTAUTH_URL` is set correctly in Vercel environment variables:
- Production: `https://ladderfox.com`
- UAT: `https://uat.ladderfox.com` (keep separate)

#### 3.4 Update Stripe Webhook

1. In Stripe Dashboard → **Webhooks**
2. Add endpoint: `https://ladderfox.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to Vercel as `STRIPE_WEBHOOK_SECRET`

---

### **Phase 4: Deploy to Production**

#### 4.1 Initial Deployment

1. **Push code to Git** (if not already):
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy via Vercel**:
   - Vercel will auto-deploy on push, OR
   - Go to Vercel Dashboard → **Deployments** → **Redeploy**

3. **Monitor build logs**:
   - Check for any errors
   - Ensure build completes successfully

#### 4.2 Verify Deployment

After deployment, verify:

- [ ] Site loads at `ladderfox.com`
- [ ] No console errors
- [ ] Authentication works (Google OAuth)
- [ ] Database connection successful
- [ ] API routes respond correctly

---

### **Phase 5: Post-Deployment Verification**

#### 5.1 Functional Testing

Test all critical features:

**Authentication:**
- [ ] Google OAuth login works
- [ ] Email/password login works (if enabled)
- [ ] Session persistence works
- [ ] Logout works

**CV Builder:**
- [ ] Create new CV
- [ ] Edit CV
- [ ] Save CV
- [ ] Load saved CV
- [ ] PDF export works
- [ ] Photo upload works

**AI Features:**
- [ ] Chat agent responds
- [ ] CV analysis works
- [ ] Job search works
- [ ] Cover letter generation works

**Payments:**
- [ ] Stripe checkout works (test with test card first)
- [ ] Subscription creation works
- [ ] Webhook receives events
- [ ] User plan updates correctly

**File Uploads:**
- [ ] Photo upload to UploadThing works
- [ ] Files are accessible

#### 5.2 Performance Testing

- [ ] Page load times acceptable (< 3s)
- [ ] API response times acceptable (< 2s)
- [ ] No memory leaks
- [ ] Database queries optimized

#### 5.3 Security Checklist

- [ ] HTTPS enforced
- [ ] Environment variables not exposed
- [ ] API routes protected
- [ ] CORS configured correctly
- [ ] Rate limiting active (if implemented)

---

### **Phase 6: Monitoring & Maintenance**

#### 6.1 Set Up Monitoring

**Vercel Analytics:**
- Enable in Vercel Dashboard → **Analytics**
- Monitor page views, performance

**Error Tracking:**
- Consider Sentry or similar
- Monitor API errors
- Track user-reported issues

**Database Monitoring:**
- Monitor connection pool
- Track query performance
- Set up alerts for high usage

#### 6.2 Set Up Alerts

- [ ] Vercel deployment failures
- [ ] Database connection issues
- [ ] High error rates
- [ ] API quota warnings (OpenAI, Adzuna)

---

## 🔄 Keeping UAT and Production Separate

### Best Practices

1. **Separate Git Branches** (Optional but recommended):
   - `main` → Production
   - `uat` → UAT environment

2. **Separate Vercel Projects**:
   - ✅ **UAT Project**: `uat-ladderfox` → `uat.ladderfox.com`
   - ✅ **Production Project**: `ladderfox` → `ladderfox.com`

3. **Separate Databases**:
   - UAT database for testing
   - Production database for live users

4. **Separate API Keys**:
   - Use test keys for UAT (Stripe test mode)
   - Use production keys for production

5. **Environment Variables**:
   - Never mix UAT and production keys
   - Use Vercel's environment-specific variables

---

## 📝 Environment Variables Reference

### Complete List of Required Variables

```bash
# ============================================
# CORE CONFIGURATION
# ============================================
NODE_ENV=production
NEXTAUTH_URL=https://ladderfox.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# ============================================
# DATABASE (Neon.tech - Recommended)
# ============================================
# Neon.tech connection string format:
# postgresql://user:password@host.neon.tech/dbname?sslmode=require
# For connection pooling (recommended for serverless):
# postgresql://user:password@host.neon.tech/dbname?sslmode=require&pgbouncer=true
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# ============================================
# AI SERVICES
# ============================================
OPENAI_API_KEY=sk-proj-<your-key>
OPENAI_MODEL=gpt-4-turbo-preview

# ============================================
# JOB SEARCH
# ============================================
ADZUNA_APP_ID=<your-app-id>
ADZUNA_API_KEY=<your-api-key>

# ============================================
# PAYMENTS (STRIPE - PRODUCTION)
# ============================================
STRIPE_SECRET_KEY=sk_live_<your-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<your-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-secret>

# Stripe Price IDs (Production)
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR=price_<id>
STRIPE_BASIC_MONTHLY_PRICE_ID_USD=price_<id>
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR=price_<id>
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD=price_<id>
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_<id>
STRIPE_BASIC_YEARLY_PRICE_ID_USD=price_<id>

# ============================================
# FILE UPLOADS
# ============================================
UPLOADTHING_SECRET=sk_live_<your-secret>
UPLOADTHING_APP_ID=<your-app-id>

# ============================================
# AUTHENTICATION
# ============================================
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>

# ============================================
# SUPABASE (OPTIONAL - Only if using Supabase instead of Neon)
# ============================================
# Note: UAT uses Neon.tech, production should use Neon.tech for consistency
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-key>
SUPABASE_URL=<your-url>
SUPABASE_KEY=<your-key>

# ============================================
# ANALYTICS (OPTIONAL)
# ============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_<your-key>
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails
**Solution**: Check build logs, ensure all dependencies are in `package.json`

### Issue 2: Database Connection Fails
**Solution**: 
- Verify `DATABASE_URL` is correct
- For Neon.tech: Ensure connection string includes `?sslmode=require`
- For Neon.tech: Check if connection pooling is enabled (recommended for serverless)
- Check database firewall allows Vercel IPs (Neon.tech allows all by default)
- Ensure database is accessible from internet
- Test connection string locally before deploying

### Issue 3: Authentication Not Working
**Solution**:
- Verify `NEXTAUTH_URL` matches domain
- Check Google OAuth redirect URIs
- Ensure `NEXTAUTH_SECRET` is set

### Issue 4: Stripe Payments Fail
**Solution**:
- Verify using **live** keys (not test)
- Check webhook endpoint is configured
- Ensure webhook secret matches

### Issue 5: API Keys Not Working
**Solution**:
- Double-check keys are production keys
- Verify no extra spaces/characters
- Check API quotas/limits

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All production API keys configured
- [ ] Production database created and migrated
- [ ] Vercel project created and configured
- [ ] Domain connected and DNS configured
- [ ] Environment variables set in Vercel
- [ ] Stripe webhook configured
- [ ] Google OAuth updated for production domain
- [ ] All features tested in production
- [ ] Monitoring/analytics set up
- [ ] Backup strategy in place
- [ ] UAT environment still accessible for testing

---

## 📞 Support & Next Steps

After migration:

1. **Monitor closely** for first 24-48 hours
2. **Test all critical user flows**
3. **Keep UAT environment** for testing new features
4. **Document any issues** encountered
5. **Update team** on production status

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Ready for Production Migration

