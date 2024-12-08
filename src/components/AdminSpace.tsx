import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminDashboard } from './admin/AdminDashboard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function AdminSpace() {
  const [code, setCode] = useState('');
  const { isAdmin, login } = useAdminStore();

  const handleLogin = () => {
    if (login(code)) {
      toast.success('Admin access granted');
      setCode('');
    } else {
      toast.error('Invalid admin code');
    }
  };

  if (!isAdmin) {
    return (
      <section id="admin" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Admin Access</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter admin code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Access Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}