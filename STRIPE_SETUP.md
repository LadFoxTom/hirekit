# Stripe & Pricing Setup Guide

## Overview

This guide covers the setup of the new pricing structure for the CV Builder application:

- **Free Plan**: 1 CV, basic templates, no exports
- **Basic Plan**: Unlimited CVs, all templates, PDF export, AI assistance (with 7-day trial)
- **Pro Plan**: For teams/agencies (coming soon)

## Pricing Structure

### Basic Plan Pricing

| Billing Interval | EUR Price | USD Price | Monthly Equivalent | Savings |
|------------------|-----------|-----------|-------------------|---------|
| Monthly | €3.99 | $4.99 | €3.99/month | - |
| Quarterly | €9.99 | $12.99 | €3.33/month | 17% |
| Yearly | €39.99 | $49.99 | €3.33/month | 17% |

## Stripe Dashboard Setup

### 1. Create Basic Plan Product

1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. Product Name: "Basic Plan"
4. Description: "Unlimited CVs, all templates, PDF export, AI assistance"

### 2. Create Price Points

For each billing interval and currency, create a separate price:

#### Monthly Prices
- **EUR Monthly**: €3.99/month (recurring)
- **USD Monthly**: $4.99/month (recurring)

#### Quarterly Prices
- **EUR Quarterly**: €9.99 every 3 months (recurring)
- **USD Quarterly**: $12.99 every 3 months (recurring)

#### Yearly Prices
- **EUR Yearly**: €39.99/year (recurring)
- **USD Yearly**: $49.99/year (recurring)

### 3. Copy Price IDs

After creating each price, copy the Price ID (starts with `price_`) and add it to your `.env.local` file:

```env
# Basic Plan Prices - EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR="price_1ABC123..."
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR="price_1DEF456..."
STRIPE_BASIC_YEARLY_PRICE_ID_EUR="price_1GHI789..."

# Basic Plan Prices - USD
STRIPE_BASIC_MONTHLY_PRICE_ID_USD="price_1JKL012..."
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD="price_1MNO345..."
STRIPE_BASIC_YEARLY_PRICE_ID_USD="price_1PQR678..."
```

## Trial Configuration

### 1. Enable Trial Period

The Basic plan includes a 7-day free trial. This is configured in the code and will be applied automatically for new customers.

### 2. Trial Tracking (Future Enhancement)

To prevent trial abuse, implement trial tracking in the database:

```sql
-- Add to user table or create separate trial_tracking table
ALTER TABLE users ADD COLUMN has_used_trial BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN trial_started_at TIMESTAMP;
ALTER TABLE users ADD COLUMN trial_ended_at TIMESTAMP;
```

## Webhook Configuration

### Required Webhook Events

Set up webhooks in Stripe Dashboard → Developers → Webhooks:

```
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.trial_will_end
invoice.payment_succeeded
invoice.payment_failed
invoice.payment_action_required
```

### Webhook Endpoint

```
https://yourdomain.com/api/stripe/webhook
```

## Feature Gating Implementation

### Plan Limits

```typescript
// Feature access check
const canExportPDF = user.plan === 'basic' && user.subscriptionStatus === 'active';
const canUseAI = user.plan === 'basic' || user.trialActive;
const cvLimit = user.plan === 'free' ? 1 : Infinity;
```

### Upgrade Prompts

Show upgrade modals when users try to access premium features:

```typescript
if (!canExportPDF && action === 'export') {
  showUpgradeModal({
    feature: 'PDF Export',
    message: 'Upgrade to Basic to export unlimited CVs as PDF',
    showTrial: !user.hasUsedTrial
  });
}
```

## Testing

### Test Cards

Use these Stripe test cards:

- **Successful Payment**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`

### Test Scenarios

1. **Free Trial**: Subscribe to Basic plan with trial
2. **Billing Intervals**: Test monthly, quarterly, yearly
3. **Currency**: Test EUR and USD pricing
4. **Trial End**: Test what happens when trial expires
5. **Payment Failure**: Test failed payment scenarios

## Pro Plan Setup (Future)

### Product Configuration

1. Create "Pro Plan" product in Stripe
2. Set pricing: €19.99/month or €179/year
3. Add price IDs to environment variables
4. Set status to "coming_soon" in code

### Features

- Everything in Basic
- Team collaboration
- Bulk operations
- Priority support
- API access
- Advanced analytics

## Environment Variables

Complete `.env.local` setup:

```env
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Basic Plan Prices - EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR="price_..."
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR="price_..."
STRIPE_BASIC_YEARLY_PRICE_ID_EUR="price_..."

# Basic Plan Prices - USD
STRIPE_BASIC_MONTHLY_PRICE_ID_USD="price_..."
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD="price_..."
STRIPE_BASIC_YEARLY_PRICE_ID_USD="price_..."

# Trial Settings
STRIPE_TRIAL_PERIOD_DAYS="7"

# Pro Plan Prices (Future)
STRIPE_PRO_MONTHLY_PRICE_ID_EUR="price_..."
STRIPE_PRO_YEARLY_PRICE_ID_EUR="price_..."
STRIPE_PRO_MONTHLY_PRICE_ID_USD="price_..."
STRIPE_PRO_YEARLY_PRICE_ID_USD="price_..."
```

## Success Metrics

Track these key metrics:

- Free → Trial conversion rate (target: 20%+)
- Trial → Paid conversion rate (target: 40%+)
- Monthly vs Quarterly vs Yearly distribution
- Churn rate by billing interval
- Feature usage by plan type

## Troubleshooting

### Common Issues

1. **Price ID Not Found**: Ensure all price IDs are correctly copied from Stripe
2. **Trial Not Applied**: Check webhook configuration and trial logic
3. **Currency Mismatch**: Verify price IDs match the correct currency
4. **Webhook Failures**: Check webhook endpoint and event configuration

### Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Testing Guide](https://stripe.com/docs/testing) 