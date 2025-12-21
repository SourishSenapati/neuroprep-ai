'use client';

import dynamic from 'next/dynamic';

// Dynamically import LandingPage to avoid SSR issues with Three.js
const LandingPageClient = dynamic(
  () => import('./LandingPageClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
);

export default function LandingPage(props: any) {
  return <LandingPageClient {...props} />;
}
