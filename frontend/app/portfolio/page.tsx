'use client';

import React from 'react';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans relative overflow-hidden selection:bg-[#4ADE80] selection:text-[#050505]">
      
      {/* Ambient Green Glow Effect */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(5, 5, 5, 0) 70%)'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-8 md:px-16 text-sm text-[#A3A3A3]">
        <div className="font-serif text-2xl font-bold text-[#4ADE80]">S.</div>
        <div className="hidden md:flex gap-8">
          {['About', 'Skills', 'Ventures', 'Insights', 'Contact'].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className="hover:text-[#4ADE80] transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center text-center min-h-[60vh] px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-normal mb-6 tracking-tight">
          Sourish Senapati
        </h1>
        <p className="text-[#A3A3A3] text-lg md:text-xl max-w-2xl font-light leading-relaxed">
          Architecting Transformative Solutions at the Vanguard of Engineering and Technology.
        </p>
      </section>

      {/* Skills Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-center font-serif text-4xl mb-16">Domains of Mastery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 border-t border-[#1F1F1F] hover:border-[#4ADE80]/30 transition-colors duration-300 group">
            <span className="block text-[#4ADE80] text-2xl mb-6 font-mono group-hover:scale-110 transition-transform duration-300 origin-left">&lt;/&gt;</span>
            <h3 className="text-xl font-semibold mb-4">Technical Architecture</h3>
            <ul className="space-y-2 text-[#A3A3A3] text-sm md:text-base">
              {[
                'React & Next.js',
                'Python (Scientific Stack)',
                'JavaScript (ESNext)',
                'C / C++'
              ].map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="text-[#4ADE80]">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-8 border-t border-[#1F1F1F] hover:border-[#4ADE80]/30 transition-colors duration-300 group">
            <span className="block text-[#4ADE80] text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">⚗️</span>
            <h3 className="text-xl font-semibold mb-4">Engineering & Simulation</h3>
            <ul className="space-y-2 text-[#A3A3A3] text-sm md:text-base">
              {[
                'Aspen Plus & DWSIM',
                'SolidWorks & AutoCAD',
                'Power BI',
                'Process Control'
              ].map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="text-[#4ADE80]">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-8 border-t border-[#1F1F1F] hover:border-[#4ADE80]/30 transition-colors duration-300 group">
            <span className="block text-[#4ADE80] text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">👥</span>
            <h3 className="text-xl font-semibold mb-4">Strategic Leadership</h3>
            <ul className="space-y-2 text-[#A3A3A3] text-sm md:text-base">
              {[
                'Innovative Problem-Solving',
                'Agile Team Leadership',
                'Project Management',
                'Analytical Synthesis'
              ].map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="text-[#4ADE80]">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
