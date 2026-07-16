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
        {/* Nav Grid with GAP-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room - Primary Blue Button Card */}
          <Link href="/admin/rooms/create" className="block">
            <div className="w-full h-full bg-blue-600 hover:bg-blue-700 rounded-xl p-6 transition-colors cursor-pointer flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-white">Create New Room</h2>
              <p className="mt-1 text-blue-100 text-sm">Start a new riddle competition</p>
            </div>
          </Link>

          {/* Rooms - Secondary Outlined Card */}
          <Link href="/admin/rooms" className="block">
            <div className="w-full h-full bg-slate-800/50 border border-slate-600 rounded-xl p-6 transition-colors hover:bg-slate-700 cursor-pointer flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-white">Rooms</h2>
              <p className="mt-1 text-slate-400 text-sm">History, live games, and winners</p>
            </div>
          </Link>
        </div>

        {/* Quick Info Card - Separate Below Grid */}
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
