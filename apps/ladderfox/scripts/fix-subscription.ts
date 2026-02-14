// Script to manually fix subscription for a user
// Usage: npx tsx scripts/fix-subscription.ts tom@ladderfox.com

import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Price IDs from environment
const BASIC_PRICE_IDS = {
  monthly: {
    EUR: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_EUR,
    USD: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_USD,
  },
  yearly: {
    EUR: process.env.STRIPE_BASIC_YEARLY_PRICE_ID_EUR,
    USD: process.env.STRIPE_BASIC_YEARLY_PRICE_ID_USD,
  },
}

async function fixSubscription(email: string) {
  console.log(`\n🔍 Looking for user: ${email}\n`)

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true }
  })

  if (!user) {
    console.error('❌ User not found:', email)
    return
  }

  console.log('✅ Found user:', {
    id: user.id,
    email: user.email,
    name: user.name,
    hasSubscription: !!user.subscription
  })

  // 2. Find customer in Stripe
  console.log('\n🔍 Looking for Stripe customer...\n')
  const customers = await stripe.customers.list({
    email: email,
    limit: 10
  })

  if (customers.data.length === 0) {
    console.error('❌ Customer not found in Stripe')
    return
  }

  // Use the most recent customer
  const customer = customers.data[0]
  console.log('✅ Found customer:', {
    id: customer.id,
    email: customer.email,
    created: new Date(customer.created * 1000).toISOString()
  })

  // 3. Find subscription
  console.log('\n🔍 Looking for subscriptions...\n')
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    limit: 10,
    status: 'all'
  })

  if (subscriptions.data.length === 0) {
    console.error('❌ No subscriptions found in Stripe')
    return
  }

  // Use the most recent active subscription
  const subscription = subscriptions.data.sort((a, b) => b.created - a.created)[0]
  const priceId = subscription.items.data[0]?.price.id
  const price = subscription.items.data[0]?.price

  console.log('✅ Found subscription:', {
    id: subscription.id,
    status: subscription.status,
    priceId: priceId,
    amount: price ? `${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}` : 'N/A',
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
  })

  // 4. Determine plan and billing cycle
  let plan = 'free'
  let billingCycle = 'monthly'
  
  // Check all basic price IDs
  const allBasicPrices = [
    ...Object.values(BASIC_PRICE_IDS.monthly).filter(Boolean),
    ...Object.values(BASIC_PRICE_IDS.yearly).filter(Boolean),
  ]

  if (allBasicPrices.includes(priceId!)) {
    plan = 'basic'
    if (Object.values(BASIC_PRICE_IDS.monthly).includes(priceId!)) {
      billingCycle = 'monthly'
    } else if (Object.values(BASIC_PRICE_IDS.yearly).includes(priceId!)) {
      billingCycle = 'yearly'
    }
  }

  const status = subscription.status

  console.log('\n📝 Updating subscription in database...\n')
  console.log('Plan:', plan)
  console.log('Billing Cycle:', billingCycle)
  console.log('Status:', status)

  // 5. Update database
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId!,
      plan: plan,
      status: status,
      billingCycle: billingCycle,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: {
      userId: user.id,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId!,
      plan: plan,
      status: status,
      billingCycle: billingCycle,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  })

  console.log('\n✅ Subscription updated successfully!\n')
  
  // 6. Verify
  const updated = await prisma.subscription.findUnique({
    where: { userId: user.id }
  })

  console.log('📊 Updated subscription:', {
    plan: updated?.plan,
    status: updated?.status,
    billingCycle: updated?.billingCycle,
    stripeCustomerId: updated?.stripeCustomerId,
    stripeSubscriptionId: updated?.stripeSubscriptionId,
  })
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.log('Usage: npx tsx scripts/fix-subscription.ts <email>')
  process.exit(1)
}

fixSubscription(email)
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    prisma.$disconnect()
    process.exit(1)
  })
