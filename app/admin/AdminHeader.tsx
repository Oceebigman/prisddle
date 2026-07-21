'use client';

import Link from 'next/link';
import { useAdmin } from './admin-context';

export default function AdminHeader() {
  const { logout } = useAdmin();

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard">
          <h1 className="text-xl font-bold text-white hover:text-[#DFD8D0] transition-colors cursor-pointer">
            Prisddle Admin
          </h1>
        </Link>
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
