# 🚀 UAT Deployment Guide

## Current Status
✅ **Database**: Connected to Supabase UAT database  
✅ **Test Users**: Created (3 test accounts)  
✅ **Build**: Successful  
⚠️ **Vercel**: Needs login  
⚠️ **Environment Variables**: Need configuration  

## 📋 **Step-by-Step Deployment**

### **Step 1: Complete Vercel Login**
In your terminal, complete the Vercel login process:
```bash
vercel login
```
Choose your preferred authentication method (GitHub recommended).

### **Step 2: Configure Environment Variables**
Update your `.env.uat` file with the following values:

#### **Required Variables:**
```bash
# Database (Already configured)
DATABASE_URL="postgresql://postgres:Zonnebril136!~@db.bnxwpsyiahnrmfudsrxv.supabase.co:5432/postgres"

# NextAuth (Use the generated secret)
NEXTAUTH_SECRET=68cdc8498c402c4cc9646468056dcf289f03186660cee1efacd6e1cb7bed6048

# Stripe Test Keys (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key

# UploadThing (Get from https://uploadthing.com/dashboard)
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Google OAuth (Get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### **Optional Variables:**
```bash
# Email (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@uat.ladderfox.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### **Step 3: Deploy to UAT**
Once you've configured the environment variables, run:
```bash
npm run deploy:uat
```

### **Step 4: Set Vercel Environment Variables**
After deployment, you'll need to set the environment variables in Vercel:
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add OPENAI_API_KEY
vercel env add UPLOADTHING_SECRET
vercel env add UPLOADTHING_APP_ID
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

### **Step 5: Configure Custom Domain**
Set up the custom domain `uat.ladderfox.com` in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add `uat.ladderfox.com`
4. Configure DNS records as instructed

## 🧪 **Test Accounts Available**
- **test1@uat.ladderfox.com** (Test User 1)
- **test2@uat.ladderfox.com** (Test User 2)
- **admin@uat.ladderfox.com** (UAT Admin)

All accounts can use any password for testing.

## 🔧 **Environment Features**
- **Environment Badge**: Orange "UAT" indicator in top-right corner
- **Test Mode**: All payments use Stripe test keys
- **Separate Database**: Isolated from production
- **Enhanced Logging**: Debug mode for testing

## 📊 **Testing Checklist**
After deployment, test:
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] CV builder functional
- [ ] Cover letter builder works
- [ ] PDF export working
- [ ] Payment flows (test mode)
- [ ] AI features operational
- [ ] File uploads working
- [ ] Environment badge visible
- [ ] All responsive designs

## 🆘 **Troubleshooting**

### **Build Issues**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### **Database Issues**
```bash
# Test database connection
$env:DATABASE_URL="postgresql://postgres:Zonnebril136!~@db.bnxwpsyiahnrmfudsrxv.supabase.co:5432/postgres"; node scripts/test-db-connection.js
```

### **Deployment Issues**
```bash
# Check Vercel logs
vercel logs

# Redeploy
npm run deploy:uat
```

## 🎯 **Next Steps**
1. Complete Vercel login
2. Configure environment variables
3. Deploy to UAT
4. Test all features
5. Set up custom domain
6. Gather feedback
7. Prepare for production

---

**UAT URL**: https://uat.ladderfox.com  
**Status**: Ready for deployment  
**Last Updated**: December 2024 