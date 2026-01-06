#!/bin/bash

echo "🚀 Deploying LadderFox to UAT environment..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --env UAT --prod

if [ $? -eq 0 ]; then
    echo "✅ UAT deployment successful!"
    echo "🌐 UAT URL: https://uat.ladderfox.com"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the application at https://uat.ladderfox.com"
    echo "2. Verify all features work correctly"
    echo "3. Check database connections"
    echo "4. Test payment flows (using test cards)"
else
    echo "❌ UAT deployment failed"
    exit 1
fi 