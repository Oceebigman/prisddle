'use client';

import Link from 'next/link';
import { useAdmin } from './admin-context';

interface AdminHeaderProps {
  backTo?: string;
  title: string;
}

export default function AdminHeader({ backTo, title }: AdminHeaderProps) {
  const { logout } = useAdmin();

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
