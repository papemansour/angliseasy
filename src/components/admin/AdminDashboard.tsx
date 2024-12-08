import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminStats } from './AdminStats';
import { AdminLevels } from './AdminLevels';

export function AdminDashboard() {
  const { logout } = useAdminStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={logout} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <AdminStats />
            <AdminLevels />
          </div>
        </main>
      </div>
    </div>
  );
}