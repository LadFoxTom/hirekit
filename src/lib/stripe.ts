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
      '1 CV only',
      '3 basic templates', 
      'No PDF export (preview only)',
      'No AI assistance',
      'Watermark on preview',
      'Upgrade prompts on premium features'
    ],
    stripePriceId: null,
    cvLimit: 1,
    aiEnabled: false,
    exportEnabled: false
  },
  basic: {
    name: 'Basic Plan',
    price: 39.99,
    priceMonthly: 3.99,
    priceQuarterly: 9.99,
    priceYearly: 39.99,
    features: [
      'Unlimited CVs',
      'All premium templates (20+)',
      'PDF & DOCX export',
      'AI writing assistance',
      'No watermarks',
      'Cover letter builder',
      'Auto-save & version history'
    ],
    stripePriceIds: {
      monthly: {
        EUR: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID_USD
      },
      quarterly: {
        EUR: process.env.STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR,
        USD: process.env.STRIPE_BASIC_QUARTERLY_PRICE_ID_USD
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
  quarterly: { label: 'Quarterly', months: 3, savings: 17 },
  yearly: { label: 'Yearly', months: 12, savings: 17 }
}

export class StripeService {
  // Create a checkout session for subscription
  static async createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    try {
      // Get or create Stripe customer
      const user = await UserService.getUser(userId)
      let customerId = user?.subscription?.stripeCustomerId

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user?.email || undefined,
          name: user?.name || undefined,
          metadata: {
            userId: userId
          }
        })
        customerId = customer.id
        
        // Create subscription record
        await UserService.createSubscription(userId, customerId)
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',

        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId
        }
      })

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
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
      switch (event.type) {
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
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Error handling webhook:', error)
      throw error
    }
  }

  // Handle subscription changes
  private static async handleSubscriptionChange(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    const priceId = subscription.items.data[0]?.price.id
    
    // Find user by customer ID
    const user = await UserService.getUserByStripeCustomerId(customerId)
    if (!user) return

    // Determine plan from price ID
    let plan = 'free'
    
    // Check Basic plan prices
    const basicPrices = Object.values(STRIPE_PLANS.basic.stripePriceIds).flatMap(interval => Object.values(interval))
    if (basicPrices.includes(priceId)) {
      plan = 'basic'
    }
    
    // Check Pro plan prices
    const proPrices = Object.values(STRIPE_PLANS.pro.stripePriceIds).flatMap(interval => Object.values(interval))
    if (proPrices.includes(priceId)) {
      plan = 'pro'
    }

    // Update subscription
    await UserService.updateSubscription(user.id, {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      plan: plan,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cvLimit: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].cvLimit,
      aiEnabled: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].aiEnabled,
      exportEnabled: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].exportEnabled
    })
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