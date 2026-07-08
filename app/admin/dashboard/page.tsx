'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../admin-context';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, logout } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Prisddle Admin</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        {/* Nav Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/rooms/create">
            <div className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-700/50 cursor-pointer transition border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-2">Create New Room</h2>
              <p className="text-slate-400">Start a new riddle competition</p>
            </div>
          </Link>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-2">Active Rooms</h2>
            <p className="text-slate-400">Manage running games</p>
          </div>
        </div>

        {/* Quick Info Section - Separate Block */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Info</h2>
          <p className="text-slate-300 mb-4">
            Welcome to the Prisddle admin panel. You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>Create new riddle competition rooms</li>
            <li>Start and end games</li>
            <li>View player submissions and scores</li>
            <li>Monitor live player counts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
