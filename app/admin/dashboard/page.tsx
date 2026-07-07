'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../admin-context';

interface Room {
  id: string;
  room_code: string;
  room_name: string;
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, adminKey, logout } = useAdmin();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    const loadRooms = async () => {
      // For now, we'll show a static view since we don't have a rooms list endpoint
      setLoading(false);
    };

    loadRooms();
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prisddle Admin</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin/rooms/create"
            className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-center transition"
          >
            <h2 className="text-xl font-bold mb-2">Create New Room</h2>
            <p className="text-blue-200">Start a new riddle competition</p>
          </Link>

          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Active Rooms</h2>
            <p className="text-slate-400">Manage running games</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Info</h2>
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
