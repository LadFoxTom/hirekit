#!/bin/bash

echo "🧪 Testing Stripe Integration"
echo "=============================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please create it from env.example"
    exit 1
fi

# Load environment variables
source .env.local

# Test Stripe API key
echo "🔑 Testing Stripe API key..."
if curl -s -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/account > /dev/null; then
    echo "✅ Stripe API key is valid"
else
    echo "❌ Stripe API key is invalid or missing"
    exit 1
fi

# Test webhook endpoint (if running locally)
echo "🌐 Testing webhook endpoint..."
if curl -s http://localhost:3000/api/stripe/webhook > /dev/null; then
    echo "✅ Webhook endpoint is accessible"
else
    echo "⚠️  Webhook endpoint not accessible (make sure dev server is running)"
fi

# Test checkout endpoint
echo "💳 Testing checkout endpoint..."
if curl -s -X POST http://localhost:3000/api/stripe/create-checkout \
    -H "Content-Type: application/json" \
    -d '{"plan":"pro","successUrl":"http://localhost:3000/success","cancelUrl":"http://localhost:3000/cancel"}' > /dev/null; then
    echo "✅ Checkout endpoint is working"
else
    echo "⚠️  Checkout endpoint not accessible (make sure dev server is running)"
fi

echo ""
echo "🎉 Stripe integration test completed!"
echo ""
echo "Next steps:"
echo "1. Start your dev server: npm run dev"
echo "2. Test the pricing page: http://localhost:3000/pricing"
echo "3. Try subscribing to a plan"
echo "4. Check Stripe Dashboard for test payments" 