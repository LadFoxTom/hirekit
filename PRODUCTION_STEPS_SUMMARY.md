# 🎯 Production Migration - Logical Steps Summary

This document outlines the **most logical order** of steps to migrate from UAT to Production.

---

## 📌 **Step 1: Prepare Production Resources (Do This First)**

Before touching Vercel or code, gather all production credentials:

1. **Get Production API Keys**:
   - OpenAI (production key)
   - Adzuna (production credentials)
   - Stripe (switch to Live Mode, get live keys)
   - UploadThing (production keys)
   - Google OAuth (update for `ladderfox.com`)

2. **Create Production Database** (Neon.tech - same as UAT):
   - Go to https://neon.tech
   - Create new project: `ladderfox-production`
   - Copy connection string (includes `?sslmode=require`)
   - Enable connection pooling (recommended for serverless/Vercel)
   - Run migrations: `DATABASE_URL="neon-prod-url" npx prisma db push`
   - Test connection locally

3. **Generate Secrets**:
   - `NEXTAUTH_SECRET`: `openssl rand -base64 32`

**Why first?** You need these before configuring Vercel.

---

## 📌 **Step 2: Create New Vercel Project (Separate from UAT)**

**Important**: Create a **NEW** Vercel project, don't modify the UAT one.

1. **Go to Vercel Dashboard** → "Add New..." → "Project"
2. **Import your Git repository** (the one with "PROD LadderFox")
3. **Name it**: `ladderfox` or `ladderfox-production`
4. **Configure build settings** (usually auto-detected):
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Why separate project?** 
- Keeps UAT and Production completely isolated
- Different environment variables
- Independent deployments
- Easier to manage

---

## 📌 **Step 3: Configure Environment Variables in Vercel**

**In your NEW Vercel project** → Settings → Environment Variables:

1. **Add ALL production environment variables** (see `PRODUCTION_MIGRATION_GUIDE.md` for complete list)
2. **Set environment scope**: Select **"Production"** only (not Preview/Development)
3. **Double-check**:
   - Using **production** keys (not test keys)
   - `NEXTAUTH_URL` = `https://ladderfox.com`
   - `NODE_ENV` = `production`

**Why before deployment?** Vercel needs these to build and run the app.

---

## 📌 **Step 4: Configure Domain**

**In Vercel project** → Settings → Domains:

1. **Add domain**: `ladderfox.com`
2. **Add domain**: `www.ladderfox.com` (optional)
3. **Follow DNS instructions**:
   - Add A record or CNAME as shown
   - Wait for DNS propagation (usually < 1 hour)

**Why now?** Domain needs to be configured before first deployment to avoid redirect issues.

---

## 📌 **Step 5: Update Stripe for Production**

**In Stripe Dashboard**:

1. **Switch to Live Mode** (toggle in top right)
2. **Create production products/prices**:
   - Basic Plan (Monthly, Quarterly, Yearly)
   - Note the Price IDs
3. **Set up webhook**:
   - Endpoint: `https://ladderfox.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, etc.
   - Copy webhook secret
4. **Add Price IDs to Vercel** environment variables

**Why before deployment?** Payments won't work without this.

---

## 📌 **Step 6: Update Google OAuth**

**In Google Cloud Console**:

1. **Add authorized domain**: `ladderfox.com`
2. **Update redirect URIs**:
   - Add: `https://ladderfox.com/api/auth/callback/google`
   - Add: `https://www.ladderfox.com/api/auth/callback/google` (if using www)
3. **Update OAuth consent screen** if needed

**Why before deployment?** Authentication will fail without correct redirect URIs.

---

## 📌 **Step 7: Deploy to Production**

**In Vercel Dashboard**:

1. **Push code to Git** (if not already):
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Vercel will auto-deploy** (or manually trigger deployment)

3. **Monitor build logs**:
   - Check for errors
   - Ensure build succeeds

**Why last?** Everything needs to be configured first.

---

## 📌 **Step 8: Verify & Test**

After deployment:

1. **Basic checks**:
   - [ ] Site loads at `ladderfox.com`
   - [ ] No console errors
   - [ ] HTTPS active

2. **Functional tests**:
   - [ ] Login works
   - [ ] CV creation works
   - [ ] Payments work (test with test card first!)
   - [ ] AI features work

3. **Monitor for 24-48 hours**:
   - Watch for errors
   - Check analytics
   - Monitor API usage

---

## 🔄 **Ongoing: Keep UAT Separate**

**Best Practice**: 
- **UAT Project**: `uat-ladderfox` → `uat.ladderfox.com` (for testing)
- **Production Project**: `ladderfox` → `ladderfox.com` (for live users)

**Never mix**:
- ❌ Don't use production keys in UAT
- ❌ Don't use UAT database in production
- ❌ Don't deploy UAT changes directly to production

---

## ⚡ **Quick Reference: Order of Operations**

```
1. Get Production API Keys
   ↓
2. Create Production Database
   ↓
3. Create NEW Vercel Project
   ↓
4. Add Environment Variables to Vercel
   ↓
5. Configure Domain in Vercel
   ↓
6. Update Stripe (Live Mode)
   ↓
7. Update Google OAuth
   ↓
8. Deploy to Production
   ↓
9. Test Everything
   ↓
10. Monitor & Maintain
```

---

## 🚨 **Common Mistakes to Avoid**

1. **Using test keys in production** → Payments won't work
2. **Using UAT database in production** → Data mixing
3. **Forgetting to update OAuth redirect URIs** → Login fails
4. **Not setting environment scope in Vercel** → Wrong keys used
5. **Deploying before configuring domain** → SSL issues

---

## 📚 **Related Documents**

- **`PRODUCTION_MIGRATION_GUIDE.md`** - Complete detailed guide
- **`PRODUCTION_CHECKLIST.md`** - Quick checklist to track progress

---

**Ready to start?** Begin with Step 1: Prepare Production Resources! 🚀

