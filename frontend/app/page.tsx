'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/apple-glass.css';

export default function AppleHomePage() {
  return (
    <div className="apple-bg">
      <div className="apple-container min-h-screen">
        
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Icon - Tricolor Accent */}
          <motion.div
            className="mb-8"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div 
              className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)', // India Flag Gradient Inspiration
                boxShadow: '0 20px 60px rgba(255, 153, 51, 0.3)'
              }}
            >
              <div className="bg-black/20 w-full h-full rounded-3xl flex items-center justify-center backdrop-blur-sm">
                NP
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <div className="mb-4 flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-white/90">Placement Season Ready 2025</span>
          </div>

          <motion.h1
            className="heading-xl max-w-5xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Crack Your Dream
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #FF9933, #138808)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Engineering Package
            </span>
          </motion.h1>

          <motion.p
            className="body-lg max-w-2xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Better than LeetCode. Designed for Indian placements. 
            From <strong>TCS/Infosys</strong> to <strong>Google/Amazon</strong>.
            <br/>
            Works flawlessly on 4G/5G mobile data.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-4 flex-wrap justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/interview/setup">
              <motion.button
                className="glass-button-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Practicing (Free)
              </motion.button>
            </Link>
            
            <Link href="/pricing">
              <motion.button
                className="glass-button text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Plans (₹ Pricing)
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '45L+', label: 'Highest Package Cracked' },
              { value: 'IIT/NIT', label: 'Curriculum Aligned' },
              { value: 'Offline', label: 'Works without Net' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #FF9933, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.value}
                </div>
                <div className="caption">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg text-center mb-16">
            Engineered for Indian Success
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Data-Saver Mode',
                description: 'Optimized for Jio/Airtel 4G. Uses 50x less data than video tutorials.',
                color: 'linear-gradient(135deg, #138808 0%, #2ECC71 100%)'
              },
              {
                title: 'Company Specific',
                description: 'Banks for TCS NQT, Wipro Elite, Amazon SDE, and Google India.',
                color: 'linear-gradient(135deg, #FF9933 0%, #FF512F 100%)'
              },
              {
                title: 'All Branches',
                description: 'CS, IT, ECE, EEE, Mech, Civil - We cover core engineering subjects too.',
                color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              },
              {
                title: 'Campus Mode',
                description: 'Simulates high-pressure campus drive environments.',
                color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              },
              {
                title: 'Beat the Interviewer',
                description: 'AI trains you to handle trick questions common in Indian HR rounds.',
                color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              },
              {
                title: 'Placement Guarantee',
                description: 'Follow our roadmap to secure at least one offer letter.',
                color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4"
                  style={{
                    background: feature.color,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {feature.title.charAt(0)}
                </div>
                <h3 className="heading-md text-xl mb-3">{feature.title}</h3>
                <p className="body-md">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Engineering Roles Preview */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg text-center mb-6">
            Target Top Companies
          </h2>
          <p className="body-md text-center mb-12 max-w-2xl mx-auto">
            Prepare for specific company patterns and difficulty levels.
          </p>

          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {[
              'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Zoho',
              'Flipkart', 'Amazon India', 'Google India', 'Microsoft IDC',
              'Swiggy', 'Zomato', 'Paytm', 'Reliance', 'Tata Motors'
            ].map((role, i) => (
              <motion.div
                key={role}
                className="glass-badge-blue"
                style={{ padding: '10px 20px', fontSize: '15px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.1 }}
              >
                {role}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card max-w-4xl mx-auto p-12">
            <h2 className="heading-lg mb-6">
              Ready for Placement Season?
            </h2>
            <p className="body-lg mb-8">
              Join thousands of Indian engineering students securing 10LPA+ packages.
            </p>
            <Link href="/interview/setup">
              <motion.button
                className="glass-button-primary text-xl px-12 py-5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Preparation
              </motion.button>
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-12 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="caption mb-4">
            Made with ❤️ in India for the World.
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/dashboard" className="caption hover:text-white transition-colors">Dashboard</Link>
            <Link href="/interview/setup" className="caption hover:text-white transition-colors">Start Interview</Link>
          </div>
        </motion.footer>

      </div>
    </div>
  );
}
