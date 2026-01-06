# Subscription Management Guide

## Overview

LadderFox provides comprehensive subscription management features that allow users to easily manage their billing, upgrade/downgrade plans, and cancel subscriptions. This guide explains how users can manage their subscriptions.

## How Users Can Manage Their Subscription

### 1. Accessing Subscription Management

Users can access subscription management in several ways:

#### **Via Navigation Menu**
- Click on the user avatar in the top-right corner
- Select "Subscription" from the dropdown menu
- This takes them to the dedicated subscription management page

#### **Via Settings Page**
- Navigate to `/settings`
- Scroll to the "Subscription" section
- Click "Manage Subscription" button

#### **Via Pricing Page**
- Navigate to `/pricing`
- If user has an active subscription, they'll see a "Manage Subscription" button

### 2. Subscription Management Page Features

The subscription management page (`/subscription`) provides:

#### **Current Subscription Overview**
- Plan name and status
- Next billing date
- Current plan features
- Subscription status (active, past_due, canceled, etc.)

#### **Quick Actions**
- **Manage Billing**: Opens Stripe Customer Portal for detailed billing management
- **Cancel Subscription**: Direct access to cancellation options
- **Upgrade to Pro**: For free users, provides upgrade options
- **Account Settings**: Link to general account settings
- **Dashboard**: Return to main dashboard

#### **Account Information**
- User name and email
- Member since date
- Account status

#### **Help & Support**
- FAQ link
- Contact support link

### 3. Stripe Customer Portal Integration

When users click "Manage Billing" or "Cancel Subscription", they're redirected to Stripe's Customer Portal where they can:

#### **Manage Billing**
- View billing history
- Download invoices
- Update payment methods
- Change billing address
- View upcoming charges

#### **Cancel Subscription**
- Cancel immediately (loses access at end of current period)
- Cancel at period end (keeps access until next billing date)
- Reactivate canceled subscriptions

#### **Upgrade/Downgrade**
- Change to different plans
- Switch billing intervals (monthly/quarterly/yearly)
- Add or remove features

### 4. Subscription Status Indicators

The system provides clear visual indicators for subscription status:

- **🟢 Active**: Subscription is active and billing normally
- **🟡 Past Due**: Payment failed, needs attention
- **🔴 Canceled**: Subscription has been canceled
- **🟠 Incomplete**: Payment setup incomplete

### 5. Cancellation Process

#### **How Users Can Cancel**
1. Navigate to subscription management page
2. Click "Cancel Subscription" button
3. Choose cancellation option in Stripe portal:
   - **Cancel immediately**: Loses access right away
   - **Cancel at period end**: Keeps access until next billing date

#### **What Happens After Cancellation**
- User retains access until the end of their paid period
- Account reverts to free plan features
- All data is preserved
- User can reactivate anytime

### 6. Upgrade/Downgrade Process

#### **Upgrading**
1. Navigate to pricing page (`/pricing`)
2. Select desired plan
3. Complete checkout process
4. Immediate access to new features

#### **Downgrading**
1. Access subscription management
2. Click "Manage Billing"
3. Select new plan in Stripe portal
4. Changes take effect at next billing cycle

### 7. Billing Intervals

Users can choose from multiple billing intervals:

- **Monthly**: $6.99/month
- **Quarterly**: $16.49/3 months (save 21%)
- **Yearly**: $49.99/year (save 40%)

### 8. Trial Period

New Basic plan subscribers get a **7-day free trial**:
- No charge for first 7 days
- Full access to all Basic features
- Automatic billing starts after trial
- Can cancel anytime during trial

### 9. Payment Methods

Stripe supports multiple payment methods:
- Credit/Debit cards (Visa, Mastercard, American Express)
- Digital wallets (Apple Pay, Google Pay)
- Bank transfers (in supported regions)

### 10. Invoice and Receipt Access

Users can access all billing documents through:
- Stripe Customer Portal
- Email receipts (automatically sent)
- Account settings page

### 11. Refund Policy

- **30-day money-back guarantee** for all paid plans
- Prorated refunds for mid-cycle cancellations
- Contact support for refund requests

### 12. Support and Help

Users can get help with subscription issues through:

#### **Self-Service Options**
- FAQ page (`/faq`)
- Subscription management page
- Stripe Customer Portal

#### **Direct Support**
- Contact form (`/contact`)
- Email: support@ladderfox.com
- Live chat (if available)

### 13. Security and Privacy

#### **Data Protection**
- All payment data processed by Stripe (PCI compliant)
- No credit card data stored on our servers
- Encrypted data transmission
- GDPR compliant

#### **Account Security**
- Two-factor authentication available
- Secure login with email verification
- Session management and timeout

### 14. Troubleshooting Common Issues

#### **Payment Failed**
1. Check payment method in Stripe portal
2. Update expired cards
3. Ensure sufficient funds
4. Contact support if issues persist

#### **Can't Access Premium Features**
1. Verify subscription status
2. Check if trial has expired
3. Ensure payment was successful
4. Refresh page or log out/in

#### **Billing Questions**
1. Check billing history in Stripe portal
2. Review email receipts
3. Contact support for clarification

### 15. Best Practices for Users

#### **Before Subscribing**
- Review plan features and limits
- Understand billing intervals and costs
- Read terms of service and privacy policy

#### **Managing Subscription**
- Keep payment methods updated
- Monitor billing emails
- Use customer portal for changes
- Contact support for complex issues

#### **Canceling**
- Consider downgrading instead of canceling
- Export important data before canceling
- Understand refund policies
- Keep account for future reactivation

## Technical Implementation

### API Endpoints

- `POST /api/stripe/create-checkout`: Create new subscriptions
- `POST /api/stripe/customer-portal`: Access billing management
- `POST /api/stripe/webhook`: Handle subscription events

### Database Schema

```sql
-- Subscription table tracks user subscriptions
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  stripeCustomerId VARCHAR(255) UNIQUE,
  stripeSubscriptionId VARCHAR(255) UNIQUE,
  stripePriceId VARCHAR(255),
  status VARCHAR(50) DEFAULT 'inactive',
  plan VARCHAR(50) DEFAULT 'free',
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
  aiRequestsUsed INT DEFAULT 0,
  aiRequestsLimit INT DEFAULT 3,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Webhook Events Handled

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Feature Gating

```typescript
// Check if user can access premium features
const canExportPDF = user.subscription?.plan === 'basic' && 
                     user.subscription?.status === 'active';

const canUseAI = user.subscription?.plan === 'basic' || 
                 user.subscription?.plan === 'pro';

const cvLimit = user.subscription?.plan === 'free' ? 1 : Infinity;
```

## Conclusion

The subscription management system provides users with comprehensive control over their billing and subscription status. The integration with Stripe's Customer Portal ensures a professional, secure, and user-friendly experience for all subscription-related activities.

For technical support or questions about the implementation, contact the development team. 