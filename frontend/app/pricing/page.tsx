'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, X, Zap, Crown, Building2, Globe } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: { monthly: '₹0', annual: '₹0' },
    period: 'forever',
    description: 'Perfect for trying out NeuroPrep AI',
    features: [
      '10 interviews per month',
      'All 20+ engineering roles',
      'Basic Performance Analytics',
      'Community Support'
    ],
    limitations: [
      'Limited to 10 interviews/month',
      'Standard model speed'
    ],
    cta: 'Get Started Free',
    href: '/interview/setup',
    popular: false,
    icon: Globe
  },
  {
    name: 'Pro Athlete',
    price: { monthly: '₹2,499', annual: '₹23,990' },
    period: { monthly: '/mo', annual: '/yr' },
    description: 'Unlimited training for serious engineers.',
    features: [
      'Unlimited AI Interviews',
      'Advanced "Career Athlete" Analytics',
      'Resume & JD Analysis Tools',
      'Priority Neural Processing',
      'Verified Certificate',
      'Private Discord Access'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    href: '/pricing/checkout?plan=pro',
    popular: true,
    icon: Zap
  },
  {
    name: 'Campus / Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    period: 'contact us',
    description: 'For Universities and Recruitment Teams.',
    features: [
      'Bulk Student Management',
      'Custom Question Banks',
      'Placement Analytics Dashboard',
      'White-label Solution',
      'Dedicated Success Manager',
      'API Access'
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: 'mailto:sales@neuroprep.ai',
    popular: false,
    icon: Building2
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-white/10 mb-6"
          >
            <Crown className="w-4 h-4 text-[#EAB308]" />
            <span className="text-xs font-mono tracking-widest uppercase text-[#A3A3A3]">Invest in your future</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-light mb-6 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mastery Path</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#A3A3A3] text-lg max-w-2xl mx-auto mb-10"
          >
            Professional-grade interview preparation tools accessible to everyone.
          </motion.p>
          
          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 bg-[#121212] p-1.5 rounded-full inline-flex border border-white/5"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-[#262626] text-white shadow-lg' : 'text-[#737373] hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'annual' ? 'bg-[#262626] text-white shadow-lg' : 'text-[#737373] hover:text-white'}`}
            >
              Yearly
              <span className="text-[10px] bg-[#EAB308]/20 text-[#EAB308] px-1.5 py-0.5 rounded ml-1 font-mono">SAVE 20%</span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => {
            const isPro = plan.popular;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className={`
                  relative p-8 rounded-3xl border flex flex-col h-full
                  ${isPro 
                    ? 'bg-[#121212] border-[#3B82F6]/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' 
                    : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                  }
                `}
              >
                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/30">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={`p-3 rounded-2xl w-fit mb-6 ${isPro ? 'bg-blue-500/10' : 'bg-[#1A1A1A]'}`}>
                    <plan.icon className={`w-8 h-8 ${isPro ? 'text-[#3B82F6]' : 'text-white'}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-[#737373] text-sm h-10">{plan.description}</p>
                </div>

                <div className="mb-8">
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-light text-white">
                        {plan.price[billingPeriod]}
                      </span>
                      <span className="text-[#737373] text-sm">
                        {typeof plan.period === 'string' ? plan.period : plan.period[billingPeriod]}
                      </span>
                   </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                        <Check className={`w-5 h-5 ${isPro ? 'text-[#3B82F6]' : 'text-[#737373]'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((lim, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#525252]">
                         <X className="w-5 h-5" />
                         <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={plan.href} className="mt-auto">
                  <button className={`
                    w-full py-4 rounded-xl font-bold tracking-wide transition-all
                    ${isPro 
                      ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/20' 
                      : 'bg-[#1A1A1A] text-white border border-white/5 hover:bg-[#262626]'
                    }
                  `}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
           <h2 className="text-3xl font-light text-center mb-12">Common Questions</h2>
           <div className="grid gap-6">
              {[
                  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You will retain access until the end of your billing period." },
                  { q: "Is the AI customized for my domain?", a: "Absolutely. Our neural engine adapts specifically to all 47+ engineering disciplines listed." },
                  { q: "Do you offer student discounts?", a: "Yes! Use your university email (.edu or .ac.in) for an automatic 50% discount on Pro plans." }
              ].map((faq, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                      <h3 className="font-medium text-lg mb-2">{faq.q}</h3>
                      <p className="text-[#737373] text-sm leading-relaxed">{faq.a}</p>
                  </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
