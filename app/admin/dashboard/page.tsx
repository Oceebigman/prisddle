'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../admin-context';
import AdminHeader from '../AdminHeader';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Nav Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/rooms/create">
            <div className="block bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-white mb-1">Create New Room</h2>
              <p className="text-slate-400 text-sm">Start a new riddle competition</p>
            </div>
          </Link>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-full">
            <h2 className="text-lg font-semibold text-white mb-1">Active Rooms</h2>
            <p className="text-slate-400 text-sm">Manage running games</p>
          </div>
        </div>

        {/* Quick Info Card - Separate Below Grid with Gap */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Quick Info</h2>
          <ul className="space-y-2">
            <li className="text-slate-300 text-sm">• Create new riddle competition rooms</li>
            <li className="text-slate-300 text-sm">• Start and end games</li>
            <li className="text-slate-300 text-sm">• View player submissions and scores</li>
            <li className="text-slate-300 text-sm">• Monitor live player counts</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
