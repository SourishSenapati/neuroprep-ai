'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Dashboard from '../../components/Dashboard';
import DojoEntry from '../../components/DojoEntry';
import RealTimeAnalytics from '../../components/RealTimeAnalytics';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Real-Time Analytics */}
        <div className="mb-8">
          <RealTimeAnalytics />
        </div>
        
        {/* Dojo Entry Portal */}
        <div className="mb-8">
          <DojoEntry />
        </div>
        
        {/* Main Dashboard */}
        <Dashboard 
          onStartInterview={() => window.location.href = '/interview/setup'}
        />
      </div>
    </div>
  );
}
