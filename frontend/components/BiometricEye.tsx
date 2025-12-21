'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import BiometricEye to avoid SSR issues with face-api.js
const BiometricEyeComponent = dynamic(
  () => import('./BiometricEyeClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 border-2 border-cyan-500 bg-cyan-900/20 animate-pulse flex items-center justify-center">
        <div className="text-cyan-400 text-sm">Initializing BiometricEye...</div>
      </div>
    )
  }
);

export default function BiometricEye(props: any) {
  return (
    <Suspense fallback={
      <div className="w-64 h-64 border-2 border-cyan-500 bg-cyan-900/20 animate-pulse flex items-center justify-center">
        <div className="text-cyan-400 text-sm">Loading...</div>
      </div>
    }>
      <BiometricEyeComponent {...props} />
    </Suspense>
  );
}
