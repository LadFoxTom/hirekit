const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a secure random secret for NextAuth
const generateSecret = () => crypto.randomBytes(32).toString('hex');

console.log('🔧 UAT Environment Configuration Helper');
console.log('=====================================\n');

console.log('📝 Please update your .env.uat file with the following values:\n');

console.log('✅ DATABASE_URL (Already configured):');
console.log('   postgresql://postgres:Zonnebril136!~@db.bnxwpsyiahnrmfudsrxv.supabase.co:5432/postgres\n');

console.log('🔑 NEXTAUTH_SECRET (Generated for you):');
console.log(`   ${generateSecret()}\n`);

console.log('💰 Stripe Test Keys (Get from https://dashboard.stripe.com/test/apikeys):');
console.log('   STRIPE_SECRET_KEY=sk_test_...');
console.log('   STRIPE_PUBLISHABLE_KEY=pk_test_...');
console.log('   STRIPE_WEBHOOK_SECRET=whsec_...\n');

console.log('🤖 OpenAI API Key (Get from https://platform.openai.com/api-keys):');
console.log('   OPENAI_API_KEY=sk-...\n');

console.log('📤 UploadThing (Get from https://uploadthing.com/dashboard):');
console.log('   UPLOADTHING_SECRET=sk_live_...');
console.log('   UPLOADTHING_APP_ID=your_app_id\n');

console.log('🔐 Google OAuth (Get from https://console.cloud.google.com/apis/credentials):');
console.log('   GOOGLE_CLIENT_ID=your_client_id');
console.log('   GOOGLE_CLIENT_SECRET=your_client_secret\n');

console.log('📧 Email (Optional - for notifications):');
console.log('   EMAIL_SERVER_HOST=smtp.gmail.com');
console.log('   EMAIL_SERVER_PORT=587');
console.log('   EMAIL_SERVER_USER=your_email@gmail.com');
console.log('   EMAIL_SERVER_PASSWORD=your_app_password\n');

console.log('📊 Analytics (Optional):');
console.log('   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX');
console.log('   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key\n');

console.log('🚀 After updating .env.uat, run:');
console.log('   npm run deploy:uat\n');

console.log('🌐 Your UAT environment will be available at:');
console.log('   https://uat.ladderfox.com\n'); 