'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../components/Dashboard';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Try to load user from localStorage or fetch from API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Mock user if not found
      setUser({ id: 'temp_user', name: 'Guest User', email: 'guest@example.com' });
    }
  }, [router]);

  const handleStartInterview = () => {
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <Dashboard user={user} onStartInterview={handleStartInterview} />;
}
