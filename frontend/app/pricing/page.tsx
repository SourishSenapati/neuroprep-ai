'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out NeuroPrep AI',
    features: [
      '10 interviews per month',
      'All 47 engineering roles',
      '224M+ questions access',
      'Basic analytics',
      'Email support'
    ],
    limitations: [
      'Limited to 10 interviews/month',
      'Standard priority'
    ],
    cta: 'Get Started Free',
    href: '/interview/setup',
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Unlimited interviews for serious preparation',
    features: [
      'Unlimited interviews',
      'All 47 engineering roles',
      '224M+ questions access',
      'Advanced analytics & insights',
      'Priority email support',
      'Custom difficulty levels',
      'Progress tracking',
      'Interview history export'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    href: '/pricing/checkout?plan=pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For universities and companies',
    features: [
      'Unlimited interviews for all users',
      'Custom question banks',
      'White-label solution',
      'SSO & SAML integration',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced reporting & analytics',
      'API access with high limits'
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/pricing/enterprise',
    popular: false
  }
];

const apiPricing = {
  free: {
    calls: '100 calls/month',
    price: '$0',
    rateLimit: '10 requests/minute'
  },
  pro: {
    calls: '10,000 calls/month',
    price: '$0.01 per call after limit',
    rateLimit: '100 requests/minute'
  },
  enterprise: {
    calls: 'Unlimited',
    price: 'Custom pricing',
    rateLimit: 'Custom limits'
  }
};

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="apple-bg">
      <div className="apple-container min-h-screen py-20">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="body-lg max-w-2xl mx-auto mb-8">
            Choose the plan that fits your interview preparation needs
          </p>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={billingPeriod === 'monthly' ? 'font-semibold' : 'text-white/60'}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-colors"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                animate={{ x: billingPeriod === 'annual' ? 28 : 0 }}
              />
            </button>
            <span className={billingPeriod === 'annual' ? 'font-semibold' : 'text-white/60'}>
              Annual <span className="glass-badge-blue ml-2">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`glass-card relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {plan.popular && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 glass-badge-blue px-4 py-1"
                >
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="heading-md text-2xl mb-2">{plan.name}</h3>
                <p className="caption mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span 
                    className="text-5xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
                <p className="caption">{plan.period}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <motion.button
                  className={`w-full py-3 rounded-full font-semibold ${
                    plan.popular
                      ? 'glass-button-primary'
                      : 'glass-button'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* API Pricing */}
        <motion.div
          className="glass-card max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="heading-md mb-6 text-center">API Access Pricing</h2>
          <p className="body-md text-center mb-8">
            Integrate NeuroPrep AI questions into your own applications
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(apiPricing).map(([tier, info]) => (
              <div key={tier} className="glass-card bg-opacity-50 p-4">
                <h3 className="font-semibold text-lg mb-3 capitalize">{tier}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-white/60">Included:</span> {info.calls}</p>
                  <p><span className="text-white/60">Pricing:</span> {info.price}</p>
                  <p><span className="text-white/60">Rate Limit:</span> {info.rateLimit}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/api/docs">
              <motion.button
                className="glass-button px-8 py-3"
                whileHover={{ scale: 1.05 }}
              >
                View API Documentation
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="heading-lg text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What happens when I hit my free interview limit?',
                a: 'You\'ll be prompted to upgrade to Pro for unlimited interviews. Your progress is saved and you can continue anytime.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee for Pro subscriptions. No questions asked.'
              },
              {
                q: 'How does enterprise pricing work?',
                a: 'Enterprise pricing is customized based on your team size and needs. Contact our sales team for a quote.'
              },
              {
                q: 'Can I use the API with a free account?',
                a: 'Yes! Free accounts get 100 API calls per month. Pro and Enterprise tiers get higher limits.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="heading-md mb-4">Ready to master your interviews?</h2>
          <div className="flex gap-4 justify-center">
            <Link href="/interview/setup">
              <motion.button
                className="glass-button-primary px-8 py-4"
                whileHover={{ scale: 1.05 }}
              >
                Start Free
              </motion.button>
            </Link>
            <Link href="/pricing/enterprise">
              <motion.button
                className="glass-button px-8 py-4"
                whileHover={{ scale: 1.05 }}
              >
                Talk to Sales
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
