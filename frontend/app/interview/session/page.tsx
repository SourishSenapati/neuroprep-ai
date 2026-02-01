'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuraSingularityChamber from '../../../components/AuraSingularityChamber';

function SessionContent() {
  const searchParams = useSearchParams();
  
  const role = searchParams.get('role') || 'Software Engineer';
  const difficulty = searchParams.get('difficulty') || 'Senior';
  const persona = searchParams.get('persona') || 'Professional';

  return (
    <AuraSingularityChamber
      role={role}
      difficulty={difficulty}
      persona={persona}
      mode={searchParams.get('mode') || 'standard'}
    />
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white bg-black">Loading Neural Link...</div>}>
      <SessionContent />
    </Suspense>
  );
}
