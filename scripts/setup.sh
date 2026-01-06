#!/bin/bash

echo "🚀 LadderFox - Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from env.example..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual values:"
    echo "   - DATABASE_URL (from Supabase)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    echo "   - OPENAI_API_KEY"
    echo "   - STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY"
else
    echo "✅ .env.local already exists"
fi

# Initialize Prisma
echo "🗄️  Initializing Prisma..."
npx prisma generate

# Check if database is connected
echo "🔗 Testing database connection..."
if npx prisma db push --accept-data-loss &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL in .env.local"
    echo "💡 You can get a free PostgreSQL database from Supabase: https://supabase.com"
fi

# Create initial data
echo "📊 Creating initial data..."
npx prisma db seed &> /dev/null || echo "⚠️  No seed script found (optional)"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual values"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "📚 For detailed setup instructions, see SETUP_GUIDE.md" 