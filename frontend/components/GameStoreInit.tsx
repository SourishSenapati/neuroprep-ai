'use client';

import { useEffect } from 'react';
import { initializeGameStore } from '../lib/store/gameStore';

/**
 * Client-side game store initializer
 * Runs on mount to initialize streak tracking
 */
export default function GameStoreInit() {
  useEffect(() => {
    initializeGameStore();
  }, []);

  return null; // This component doesn't render anything
}
