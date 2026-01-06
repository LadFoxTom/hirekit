'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Toaster, toast } from 'react-hot-toast'
import { FaCrown, FaCreditCard, FaUser, FaCog, FaSignOutAlt, FaCalendar, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { STRIPE_PLANS } from '@/lib/stripe'

export default function SubscriptionPage() {
  const { user, subscription, logout, isLoading, refreshUser } = useAuth()
  const { t } = useLocale()
  const [isManagingSubscription, setIsManagingSubscription] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)

  // Refresh user data when component mounts to ensure we have the latest data
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const handleManageSubscription = async () => {
    if (!subscription || subscription.plan === 'free') {
      toast.error('No active subscription to manage')
      return
    }

    setIsManagingSubscription(true)
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.origin + '/subscription' }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to open customer portal')
      }
      
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening customer portal:', error)
      toast.error('Failed to open customer portal. Please try again.')
    } finally {
      setIsManagingSubscription(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription || subscription.plan === 'free') {
      toast.error('No active subscription to cancel')
      return
    }

    setIsCanceling(true)
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          returnUrl: window.location.origin + '/subscription',
          action: 'cancel'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to open cancellation portal')
      }
      
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening cancellation portal:', error)
      toast.error('Failed to open cancellation portal. Please try again.')
    } finally {
      setIsCanceling(false)
    }
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free Plan'
      case 'basic': return 'Basic Plan'
      case 'pro': return 'Pro Plan'
      case 'team': return 'Team Plan'
      default: return plan
    }
  }

  const getPlanFeatures = (plan: string) => {
    return STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]?.features || []
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'past_due': return 'text-yellow-600 bg-yellow-100'
      case 'canceled': return 'text-red-600 bg-red-100'
      case 'incomplete': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaCheck className="w-4 h-4" />
      case 'past_due': return <FaExclamationTriangle className="w-4 h-4" />
      case 'canceled': return <FaTimes className="w-4 h-4" />
      default: return <FaExclamationTriangle className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your subscription, billing information, and account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Subscription */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription?.status || 'inactive')}`}>
                  {getStatusIcon(subscription?.status || 'inactive')}
                  <span className="ml-2 capitalize">{subscription?.status || 'inactive'}</span>
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{getPlanDisplayName(subscription?.plan || 'free')}</h3>
                    <p className="text-sm text-gray-600">
                      {subscription?.plan === 'free' ? 'No active paid subscription' : 'Active subscription'}
                    </p>
                  </div>
                  <div className="text-right">
                    {subscription?.plan !== 'free' && (
                      <>
                        <p className="text-sm text-gray-600">Next billing</p>
                        <p className="font-semibold text-gray-900">
                          {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {subscription?.cancelAtPeriodEnd && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        Your subscription will be canceled at the end of the current billing period.
                      </span>
                    </div>
                  </div>
                )}

                {/* Plan Features */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
                  <ul className="space-y-2">
                    {getPlanFeatures(subscription?.plan || 'free').map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Billing History */}
            {subscription?.plan !== 'free' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing History</h2>
                <div className="text-center py-8 text-gray-500">
                  <FaCreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>View your complete billing history in the customer portal.</p>
                  <button
                    onClick={handleManageSubscription}
                    disabled={isManagingSubscription}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCreditCard className="mr-2" />
                    {isManagingSubscription ? 'Opening...' : 'View Billing History'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {subscription && subscription.plan !== 'free' ? (
                  <>
                    <button
                      onClick={handleManageSubscription}
                      disabled={isManagingSubscription}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCreditCard className="mr-3" />
                      {isManagingSubscription ? 'Opening...' : 'Manage Billing'}
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTimes className="mr-3" />
                      {isCanceling ? 'Opening...' : 'Cancel Subscription'}
                    </button>
                  </>
                ) : (
                  <a
                    href="/pricing"
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <FaCrown className="mr-3" />
                    Upgrade to Pro
                  </a>
                )}
                <a
                  href="/settings"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <FaCog className="mr-3" />
                  Account Settings
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <FaUser className="mr-3" />
                  Dashboard
                </a>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName 
                        ? user.firstName
                        : user?.lastName
                          ? user.lastName
                          : user?.name || 'Not provided'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium text-gray-900">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <a
                  href="/faq"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <FaCog className="mr-3" />
                  FAQ
                </a>
                <a
                  href="/contact"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <FaUser className="mr-3" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 