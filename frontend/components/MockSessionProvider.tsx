'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext<any>(null);

export function MockSessionProvider({ children, session }: { children: React.ReactNode, session?: any }) {
  const [data, setData] = useState(session || null);
  const [status, setStatus] = useState(session ? 'authenticated' : 'unauthenticated');

  useEffect(() => {
    if (!session) {
        // Simulate fetching session
        setStatus('loading');
        setTimeout(() => {
            setData({ user: { name: 'Mock User', email: 'mock@example.com' } });
            setStatus('authenticated');
        }, 500);
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ data, status }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function signIn() {
  console.log('Mock signIn');
}

export function signOut() {
  console.log('Mock signOut');
}
