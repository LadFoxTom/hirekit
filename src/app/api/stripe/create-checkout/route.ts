import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StripeService, STRIPE_PLANS } from '@/lib/stripe'

// Force dynamic rendering since this route uses Stripe API and authentication
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { plan, interval = 'yearly', currency = 'EUR', successUrl, cancelUrl } = await request.json()
    
    if (!plan || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Get the correct price ID based on plan, interval, and currency
    let priceId: string | undefined

    if (plan === 'free') {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      )
    }

    if (plan === 'basic') {
      const basicPlan = planConfig as typeof STRIPE_PLANS.basic
      const intervalPrices = basicPlan.stripePriceIds[interval as keyof typeof basicPlan.stripePriceIds]
      if (!intervalPrices) {
        return NextResponse.json(
          { error: 'Invalid billing interval' },
          { status: 400 }
        )
      }
      priceId = intervalPrices[currency as keyof typeof intervalPrices]
    } else if (plan === 'pro') {
      // Pro plan is coming soon, but handle for future
      const proPlan = planConfig as typeof STRIPE_PLANS.pro
      const intervalPrices = proPlan.stripePriceIds[interval as keyof typeof proPlan.stripePriceIds]
      if (!intervalPrices) {
        return NextResponse.json(
          { error: 'Invalid billing interval' },
          { status: 400 }
        )
      }
      priceId = intervalPrices[currency as keyof typeof intervalPrices]
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not found for the selected plan, interval, and currency' },
        { status: 400 }
      )
    }

    const checkoutSession = await StripeService.createCheckoutSession(
      session.user.id,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 