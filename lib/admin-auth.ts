import { NextRequest } from 'next/server';

export function verifyAdminAuth(req: NextRequest): boolean {
  const adminKey = req.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_SECRET_KEY;
}
