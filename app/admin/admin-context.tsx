'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminKey: string | null;
  login: (key: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin_key');
    if (saved) setAdminKey(saved);
  }, []);

  const login = (key: string) => {
    setAdminKey(key);
    localStorage.setItem('admin_key', key);
  };

  const logout = () => {
    setAdminKey(null);
    localStorage.removeItem('admin_key');
  };

  return (
    <AdminContext.Provider value={{ isAdmin: !!adminKey, adminKey, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
