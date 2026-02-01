'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    useCase: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/enterprise/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="apple-bg">
        <div className="apple-container min-h-screen flex items-center justify-center">
          <motion.div
            className="glass-card max-w-2xl text-center p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl bg-gradient-to-br from-green-400 to-teal-300"
            >
              ✓
            </div>
            <h1 className="heading-lg mb-4">Thank You!</h1>
            <p className="body-lg mb-8">
              We've received your enterprise inquiry. Our sales team will contact you within 24 hours.
            </p>
            <Link href="/">
              <motion.button
                className="glass-button-primary px-8 py-3"
                whileHover={{ scale: 1.05 }}
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-bg h-screen overflow-y-auto">
      <div className="apple-container min-h-screen py-20">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-xl mb-4">
            Enterprise Solutions
          </h1>
          <p className="body-lg max-w-2xl mx-auto">
            Power your university or company with NeuroPrep AI's advanced interview platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="heading-md mb-8">Why Choose Enterprise?</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Unlimited Interviews',
                  description: 'No limits on interviews for your entire organization',
                  icon: '∞'
                },
                {
                  title: 'Custom Question Banks',
                  description: 'Add your own questions and customize difficulty',
                  icon: '📝'
                },
                {
                  title: 'White-Label Solution',
                  description: 'Brand the platform with your logo and colors',
                  icon: '🎨'
                },
                {
                  title: 'Advanced Analytics',
                  description: 'Track performance across your entire organization',
                  icon: '📊'
                },
                {
                  title: 'SSO Integration',
                  description: 'SAML, OAuth, and Active Directory support',
                  icon: '🔐'
                },
                {
                  title: 'Dedicated Support',
                  description: '24/7 support with dedicated account manager',
                  icon: '👥'
                }
              ].map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  className="glass-card"
                   initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-800"
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-white/70">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card p-8">
              <h2 className="heading-md mb-6">Get in Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Acme University"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Work Email *</label>
                  <input
                    type="email"
                    required
                    className="glass-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@acme.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    className="glass-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Company Size *</label>
                  <select
                    required
                    className="glass-select"
                    value={formData.companySize}
                    onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                    aria-label="Company Size"
                  >
                    <option value="">Select size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1,000 employees</option>
                    <option value="1001-5000">1,001-5,000 employees</option>
                    <option value="5000+">5,000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Use Case *</label>
                  <select
                    required
                    className="glass-select"
                    value={formData.useCase}
                    onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                    aria-label="Use Case"
                  >
                    <option value="">Select use case</option>
                    <option value="university">University / Education</option>
                    <option value="hiring">Company Hiring</option>
                    <option value="training">Employee Training</option>
                    <option value="bootcamp">Coding Bootcamp</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Message</label>
                  <textarea
                    className="glass-input"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary w-full py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Submitting...' : 'Request Demo'}
                </motion.button>
              </form>

              <p className="text-xs text-white/50 mt-4 text-center">
                We'll respond within 24 hours
              </p>
            </div>
          </motion.div>

        </div>

        {/* Pricing Estimate */}
        <motion.div
          className="glass-card max-w-4xl mx-auto text-center p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="heading-md mb-4">Enterprise Pricing</h2>
          <p className="body-lg mb-8">
            Starting at <span className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">₹400,000</span>/year
          </p>
          <p className="text-white/70">
            Custom pricing based on team size and features needed.
            Volume discounts available for large organizations.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
