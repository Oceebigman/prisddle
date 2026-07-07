import { Suspense } from 'react';
import { JoinForm } from './join-form';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
