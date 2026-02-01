'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Auth from '@/components/Auth';
import '@/styles/apple-glass.css';

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Auth Component Handles the UI (Unified Sign In / Sign Up) */}
        <Auth onAuthSuccess={() => router.push('/dashboard')} />
    </div>
  );
}
