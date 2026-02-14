// @ts-nocheck
import Stripe from 'stripe'
import { UserService } from './db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Unlimited CVs & letters',
      '3 basic templates', 
      'Preview only (no downloads)',
      '10 chat prompts per day',
      'Watermark on preview',
      'Upgrade prompts on premium features'
    ],
    stripePriceId: null,
    cvLimit: 1, // Note: cvLimit is still 1 in database, but users can create unlimited (just can't download)
    aiEnabled: false,
    exportEnabled: false
  },
  basic: {
    name: 'Basic Plan',
    price: 1.99, // Monthly price in EUR
    priceMonthly: 1.99, // EUR monthly
    priceMonthlyUSD: 2.49, // USD monthly
    priceYearly: 14.99, // EUR yearly
    priceYearlyUSD: 18.99, // USD yearly
    features: [
      'Unlimited CVs & letters',
      'All premium templates (20+)',
      'PDF & DOCX export',
      'AI writing assistance (unlimited prompts)',
      'No watermarks',
      'Cover letter builder',
      'Auto-save & version history'
    ],
    stripePriceIds: {
      monthly: {
        EUR: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_USD
      },
      yearly: {
        EUR: process.env.STRIPE_BASIC_YEARLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_BASIC_YEARLY_PRICE_ID_USD
      }
    },
    cvLimit: -1, // Unlimited
    aiEnabled: true,
    exportEnabled: true,
  },
  pro: {
    name: 'Pro Plan',
    price: 19.99,
    priceYearly: 179,
    features: [
      'Everything in Basic',
      'Team collaboration',
      'Bulk operations',
      'Priority support',
      'API access',
      'Advanced analytics'
    ],
    stripePriceIds: {
      monthly: {
        EUR: process.env.STRIPE_PRO_MONTHLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_PRO_MONTHLY_PRICE_ID_USD
      },
      yearly: {
        EUR: process.env.STRIPE_PRO_YEARLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_PRO_YEARLY_PRICE_ID_USD
      }
    },
    cvLimit: -1, // Unlimited
    aiEnabled: true,
    exportEnabled: true,
    teamEnabled: true,
    status: 'coming_soon' // Disabled until launch
  }
}

export const BILLING_INTERVALS = {
  monthly: { label: 'Monthly', months: 1 },
  yearly: { label: 'Yearly', months: 12, savings: 37 }
}

export class StripeService {
  // Create a checkout session for subscription
  static async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      console.log('[Stripe] Creating checkout session for user:', userId)
      console.log('[Stripe] Price ID:', priceId)

      // Get or create Stripe customer
      const user = await UserService.getUser(userId)
      console.log('[Stripe] User found:', !!user)

      let customerId = user?.subscription?.stripeCustomerId
      console.log('[Stripe] Existing customer ID:', customerId)

      if (!customerId) {
        console.log('[Stripe] Creating new Stripe customer...')
        const customer = await stripe.customers.create({
          email: user?.email || undefined,
          name: user?.name || undefined,
          metadata: {
            userId: userId
          }
        })
        customerId = customer.id
        console.log('[Stripe] New customer created:', customerId)

        // Create subscription record
        await UserService.createSubscription(userId, customerId)
        console.log('[Stripe] Subscription record created')
      }

      // Build line items
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price: priceId,
          quantity: 1,
        }
      ]

      // Create checkout session config
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId
        }
      }

      console.log('[Stripe] Creating checkout session with:', {
        customer: customerId,
        lineItems: lineItems.length
      })

      const session = await stripe.checkout.sessions.create(sessionConfig)

      console.log('[Stripe] Checkout session created successfully:', session.id)
      return session
    } catch (error) {
      console.error('[Stripe] Error creating checkout session:', error)
      if (error instanceof Error) {
        console.error('[Stripe] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      throw error
    }
  }

  // Create customer portal session
  static async createCustomerPortalSession(userId: string, returnUrl: string) {
    try {
      const user = await UserService.getUser(userId)
      const customerId = user?.subscription?.stripeCustomerId

      if (!customerId) {
        throw new Error('No Stripe customer found')
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })

      return session
    } catch (error) {
      console.error('Error creating customer portal session:', error)
      throw error
    }
  }

  // Handle webhook events
  static async handleWebhook(event: Stripe.Event) {
    try {
      console.log(`[Webhook] Received event: ${event.type}`, { id: event.id })
      
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
          break
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionChange(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
          break
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error(`[Webhook] Error handling event ${event.type}:`, error)
      if (error instanceof Error) {
        console.error('[Webhook] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      throw error
    }
  }

  // Handle checkout session completed
  private static async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('[Webhook] Checkout session completed:', {
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
      metadata: session.metadata
    })

    // Get user ID from metadata or customer
    let userId: string | null = null
    
    if (session.metadata?.userId) {
      userId = session.metadata.userId
    } else if (session.customer) {
      // Try to find user by customer ID
      const user = await UserService.getUserByStripeCustomerId(session.customer as string)
      userId = user?.id || null
    }

    if (!userId) {
      console.error('[Webhook] Could not find user for checkout session:', session.id)
      return
    }

    // If subscription was created, fetch it and update
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      await this.handleSubscriptionChange(subscription)
    }
  }

  // Handle subscription changes
  private static async handleSubscriptionChange(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    const priceId = subscription.items.data[0]?.price.id
    
    console.log('[Webhook] Handling subscription change:', {
      subscriptionId: subscription.id,
      customerId,
      priceId,
      status: subscription.status,
      trialEnd: subscription.trial_end
    })
    
    // Find user by customer ID
    let user = await UserService.getUserByStripeCustomerId(customerId)
    
    // If not found, try to find by customer metadata
    if (!user && customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId)
        if (customer && !customer.deleted && customer.metadata?.userId) {
          user = await UserService.getUser(customer.metadata.userId)
        }
      } catch (error) {
        console.error('[Webhook] Error retrieving customer:', error)
      }
    }
    
    if (!user) {
      console.error('[Webhook] Could not find user for subscription:', {
        subscriptionId: subscription.id,
        customerId
      })
      return
    }

    console.log('[Webhook] Found user:', { userId: user.id, email: user.email })

    // Determine plan from price ID
    let plan = 'free'
    let billingCycle = 'monthly'
    
    // Check Basic plan prices
    const basicMonthlyPrices = Object.values(STRIPE_PLANS.basic.stripePriceIds.monthly || {}).filter(Boolean)
    const basicYearlyPrices = Object.values(STRIPE_PLANS.basic.stripePriceIds.yearly || {}).filter(Boolean)
    const allBasicPrices = [...basicMonthlyPrices, ...basicYearlyPrices]

    if (allBasicPrices.includes(priceId)) {
      plan = 'basic'
      if (basicMonthlyPrices.includes(priceId)) {
        billingCycle = 'monthly'
      } else if (basicYearlyPrices.includes(priceId)) {
        billingCycle = 'yearly'
      }
    }
    
    // Check Pro plan prices
    const proPrices = Object.values(STRIPE_PLANS.pro.stripePriceIds).flatMap(interval => Object.values(interval)).filter(Boolean)
    if (proPrices.includes(priceId)) {
      plan = 'pro'
      // Determine billing cycle for pro
      if (STRIPE_PLANS.pro.stripePriceIds.monthly && Object.values(STRIPE_PLANS.pro.stripePriceIds.monthly).includes(priceId)) {
        billingCycle = 'monthly'
      } else if (STRIPE_PLANS.pro.stripePriceIds.yearly && Object.values(STRIPE_PLANS.pro.stripePriceIds.yearly).includes(priceId)) {
        billingCycle = 'yearly'
      }
    }

    // Determine subscription status
    const subscriptionStatus = subscription.status

    console.log('[Webhook] Updating subscription:', {
      userId: user.id,
      plan,
      billingCycle,
      status: subscriptionStatus,
      priceId
    })

    // Update subscription
    await UserService.updateSubscription(user.id, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscriptionStatus,
      plan: plan,
      billingCycle: billingCycle,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cvLimit: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].cvLimit,
      aiEnabled: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].aiEnabled,
      exportEnabled: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].exportEnabled
    })

    console.log('[Webhook] Subscription updated successfully for user:', user.id)
  }

  // Handle subscription cancellation
  private static async handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    const user = await UserService.getUserByStripeCustomerId(customerId)
    if (!user) return

    await UserService.updateSubscription(user.id, {
      status: 'canceled',
      cancelAtPeriodEnd: true
    })
  }

  // Handle successful payment
  private static async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    const user = await UserService.getUserByStripeCustomerId(customerId)
    if (!user) return

    // Reset AI usage for new billing period
    await UserService.updateSubscription(user.id, {
      aiRequestsUsed: 0
    })
  }

  // Handle failed payment
  private static async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    const user = await UserService.getUserByStripeCustomerId(customerId)
    if (!user) return

    await UserService.updateSubscription(user.id, {
      status: 'past_due'
    })
  }

  // Check if user can use AI (with rate limiting)
  static async canUseAI(userId: string): Promise<{ canUse: boolean; reason?: string }> {
    try {
      const user = await UserService.getUser(userId)
      if (!user?.subscription) {
        return { canUse: false, reason: 'No subscription found' }
      }

      const subscription = user.subscription
      
      // Check if subscription is active
      if (subscription.status !== 'active') {
        return { canUse: false, reason: 'Subscription not active' }
      }

      // Check usage limits
      if (subscription.aiRequestsLimit > 0 && subscription.aiRequestsUsed >= subscription.aiRequestsLimit) {
        return { canUse: false, reason: 'AI usage limit reached' }
      }

      return { canUse: true }
    } catch (error) {
      console.error('Error checking AI usage:', error)
      return { canUse: false, reason: 'Error checking usage' }
    }
  }

  // Track AI usage
  static async trackAIUsage(userId: string): Promise<boolean> {
    try {
      const canUse = await this.canUseAI(userId)
      if (!canUse.canUse) {
        return false
      }

      await UserService.incrementAIRequests(userId)
      return true
    } catch (error) {
      console.error('Error tracking AI usage:', error)
      return false
    }
  }
} 