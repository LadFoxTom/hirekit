const fs = require('fs');
const path = require('path');

// UAT Environment Configuration
const uatEnvContent = `# UAT Environment Configuration
NODE_ENV=uat
NEXTAUTH_URL=https://uat.ladderfox.com
NEXTAUTH_SECRET=your-uat-secret-key-change-this

# Database (UAT Supabase)
DATABASE_URL="postgresql://postgres:Zonnebril136!~@db.bnxwpsyiahnrmfudsrxv.supabase.co:5432/postgres"

# Stripe (Use test keys for UAT)
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# OpenAI (Same key, different usage tracking)
OPENAI_API_KEY=sk-your-openai-api-key

# UploadThing
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Google OAuth (Use test credentials for UAT)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Optional for UAT)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@uat.ladderfox.com

# Analytics (Optional for UAT)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
`;

// Write the environment file
const envPath = path.join(__dirname, '..', '.env.uat');
fs.writeFileSync(envPath, uatEnvContent);

console.log('✅ UAT environment file created: .env.uat');
console.log('📝 Please update the following variables with your actual values:');
console.log('   - NEXTAUTH_SECRET (generate a secure random string)');
console.log('   - STRIPE_SECRET_KEY (your Stripe test secret key)');
console.log('   - STRIPE_PUBLISHABLE_KEY (your Stripe test publishable key)');
console.log('   - OPENAI_API_KEY (your OpenAI API key)');
console.log('   - UPLOADTHING_SECRET (your UploadThing secret)');
console.log('   - UPLOADTHING_APP_ID (your UploadThing app ID)');
console.log('   - GOOGLE_CLIENT_ID (your Google OAuth client ID)');
console.log('   - GOOGLE_CLIENT_SECRET (your Google OAuth client secret)');
console.log('');
console.log('🔗 Database connection is already configured with your Supabase credentials!'); 