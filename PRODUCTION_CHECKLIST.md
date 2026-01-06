# ✅ Production Migration Quick Checklist

Use this checklist to track your progress through the production migration.

## 📋 Pre-Migration

- [ ] Backup UAT database
- [ ] Document current UAT configuration
- [ ] Review all API quotas/limits

## 🔑 API Keys & Credentials

- [ ] **OpenAI**: Production API key obtained
- [ ] **Adzuna**: Production credentials obtained
- [ ] **Stripe**: Live mode keys obtained
  - [ ] Secret key (`sk_live_...`)
  - [ ] Publishable key (`pk_live_...`)
  - [ ] Webhook secret (`whsec_...`)
  - [ ] Production price IDs created
- [ ] **UploadThing**: Production keys obtained
- [ ] **Google OAuth**: Updated for `ladderfox.com`
- [ ] **NextAuth**: New secret generated

## 🗄️ Database (Neon.tech)

- [ ] Neon.tech production project created
- [ ] Database connection string obtained
- [ ] Connection string includes `?sslmode=require`
- [ ] Connection pooling enabled (recommended for serverless)
- [ ] Database migrations run
- [ ] Connection tested locally

## 🚀 Vercel Setup

- [ ] New Vercel project created (`ladderfox`)
- [ ] Git repository connected
- [ ] Build settings configured
- [ ] All environment variables added
- [ ] Environment set to "Production" only

## 🌐 Domain & DNS

- [ ] Domain `ladderfox.com` added to Vercel
- [ ] DNS records configured
- [ ] DNS propagation verified
- [ ] HTTPS certificate active

## 💳 Stripe Configuration

- [ ] Stripe account in Live Mode
- [ ] Products created in Stripe Dashboard
- [ ] Prices created for all plans
- [ ] Webhook endpoint configured
- [ ] Webhook events selected
- [ ] Webhook secret added to Vercel

## 🔐 Authentication

- [ ] Google OAuth updated:
  - [ ] `ladderfox.com` added to authorized domains
  - [ ] Redirect URI added: `https://ladderfox.com/api/auth/callback/google`
- [ ] `NEXTAUTH_URL` set to `https://ladderfox.com`
- [ ] `NEXTAUTH_SECRET` generated and set

## 🧪 Testing

### Core Features
- [ ] User registration/login
- [ ] CV creation
- [ ] CV editing
- [ ] CV saving/loading
- [ ] PDF export
- [ ] Photo upload

### AI Features
- [ ] Chat agent
- [ ] CV analysis
- [ ] Job search
- [ ] Cover letter generation

### Payments
- [ ] Stripe checkout (test with test card)
- [ ] Subscription creation
- [ ] Webhook events received
- [ ] Plan updates correctly

## 📊 Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (optional)
- [ ] Database monitoring configured
- [ ] Alerts configured

## 🔄 Post-Launch

- [ ] Monitor for 24-48 hours
- [ ] Test all user flows
- [ ] Document any issues
- [ ] Update team
- [ ] Keep UAT environment for testing

---

**Quick Command Reference:**

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Run database migrations
DATABASE_URL="your-prod-db-url" npx prisma db push

# Test build locally
npm run build
```

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

