'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Three.js
const InterviewSimulatorClient = dynamic(
  () => import('./InterviewSimulatorClient'),
  { ssr: false }
);

export default function InterviewSimulator(props: any) {
  return <InterviewSimulatorClient {...props} />;
}
