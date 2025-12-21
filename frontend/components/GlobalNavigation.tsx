'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  Award, 
  Activity, 
  Zap, 
  Building,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Interview', href: '/interview/setup', icon: Target },
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Training', href: '/training/focus', icon: Zap },
  { name: 'Pricing', href: '/pricing', icon: Award },
  { name: 'Enterprise', href: '/pricing/enterprise', icon: Building }
];

export default function GlobalNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show on homepage
  if (pathname === '/') return null;

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 hidden md:block">
        <div className="glass-card-luxury rounded-none border-0 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold text-white text-lg">
                  N
                </div>
                <span className="font-bold text-lg text-white">NeuroPrep AI</span>
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Back Button */}
            <motion.button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="md:hidden">
        {/* Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                className="fixed inset-y-0 right-0 w-80 glass-card-luxury rounded-l-3xl z-40 p-6 overflow-y-auto"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {/* Logo */}
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 mb-8 mt-16">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold text-white text-xl">
                      N
                    </div>
                    <span className="font-bold text-xl text-white">NeuroPrep AI</span>
                  </div>
                </Link>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <motion.div
                          className={`p-4 rounded-xl flex items-center gap-3 font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </motion.div>
                      </Link>
                    );
                  })}

                  {/* Back Button */}
                  <motion.button
                    onClick={() => {
                      window.history.back();
                      setIsOpen(false);
                    }}
                    className="w-full p-4 rounded-xl flex items-center gap-3 font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigationItems.length * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Go Back</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Padding for fixed nav */}
      <div className="h-20 hidden md:block" />
    </>
  );
}
