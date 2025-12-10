'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import '@/styles/apple-glass.css';

export default function AppleHomePage() {
  const router = useRouter();

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
          {/* Floating Icon */}
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
              }}
            >
              NP
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="heading-xl max-w-5xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Master Engineering
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Interviews with AI
            </span>
          </motion.h1>

          <motion.p
            className="body-lg max-w-2xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            The world's most advanced interview platform with 224+ million unique questions.
            Adaptive AI that evolves with your performance. Zero repetition guaranteed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-4 flex-wrap justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              className="glass-button-primary text-lg px-8 py-4"
              onClick={() => router.push('/interview/setup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Interview
            </motion.button>
            
            <motion.button
              className="glass-button text-lg px-8 py-4"
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Dashboard
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '224M+', label: 'Questions' },
              { value: '99.9%', label: 'Unique' },
              { value: '<30ms', label: 'Response' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
            Designed for Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Adaptive Difficulty',
                description: 'AI analyzes your performance and adjusts question difficulty in real-time.',
                color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              {
                title: 'Infinite Questions',
                description: 'Quantum-inspired RNG generates 224+ million unique questions across 47 engineering roles.',
                color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              },
              {
                title: 'Performance Analytics',
                description: 'Track your progress with detailed insights and improvement recommendations.',
                color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              },
              {
                title: 'Instant Feedback',
                description: 'Get immediate technical evaluations with <30ms response time.',
                color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              },
              {
                title: 'Zero Repetition',
                description: '99.9% uniqueness guarantee with advanced collision detection.',
                color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              },
              {
                title: 'Universal Coverage',
                description: 'Software, civil, mechanical, electrical, and chemical engineering disciplines.',
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
            47 Engineering Roles
          </h2>
          <p className="body-md text-center mb-12 max-w-2xl mx-auto">
            From frontend development to chemical engineering, we cover every discipline with precision.
          </p>

          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {[
              'Frontend', 'Backend', 'Fullstack', 'DevOps', 'ML/AI', 'Mobile',
              'Security', 'Data', 'Cloud', 'Embedded', 'Civil', 'Mechanical',
              'Electrical', 'Chemical', 'Robotics', 'IoT', 'Blockchain', 'AR/VR'
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
              Ready to Excel?
            </h2>
            <p className="body-lg mb-8">
              Join thousands of engineers mastering their interview skills with AI-powered precision.
            </p>
            <motion.button
              className="glass-button-primary text-xl px-12 py-5"
              onClick={() => router.push('/interview/setup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Journey
            </motion.button>
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
            NeuroPrep AI - The Future of Engineering Interviews
          </p>
          <div className="flex gap-6 justify-center">
            <a href="/dashboard" className="caption hover:text-white transition-colors">Dashboard</a>
            <a href="/interview/setup" className="caption hover:text-white transition-colors">Start Interview</a>
          </div>
        </motion.footer>

      </div>
    </div>
  );
}
