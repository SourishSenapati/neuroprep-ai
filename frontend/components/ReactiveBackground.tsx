'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Three.js
const ReactiveBackgroundClient = dynamic(
  () => import('./ReactiveBackgroundClient'),
  { ssr: false }
);

export default function ReactiveBackground(props: any) {
  return <ReactiveBackgroundClient {...props} />;
}
