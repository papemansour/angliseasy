import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Folder, Lock } from 'lucide-react';
import { levels } from '../data/courses';
import { LevelAccess } from './dashboard/LevelAccess';

export function StudentSpace() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && /[A-Z]/.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && !validatePassword(password)) {
      toast.error('Password must be at least 8 characters with 1 uppercase letter');
      return;
    }

    const success = isRegistering
      ? await register(email, password)
      : await login(email, password);

    if (success) {
      toast.success(isRegistering ? 'Registration successful!' : 'Login successful!');
    } else {
      toast.error(isRegistering ? 'Email already exists' : 'Invalid credentials');
    }
  };

  const handleLevelAccess = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    const accessCodes = {
      'Beginner': 'prima',
      'Intermediate': 'beta',
      'Advanced': 'gamma'
    };

    if (accessCode === accessCodes[level.name as keyof typeof accessCodes]) {
      setSelectedLevel(levelId);
      toast.success(`Access granted to ${level.name} folder`);
      setAccessCode('');
    } else {
      toast.error('Invalid access code');
    }
  };

  if (!isAuthenticated) {
    return (
      <section id="student-space" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Student Safe Space</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {isRegistering && (
                  <p className="mt-1 text-sm text-gray-500">
                    Must be at least 8 characters with 1 uppercase letter
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                {isRegistering ? 'Register' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Your Learning Space</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level) => (
            <div key={level.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedLevel === level.id ? (
                <LevelAccess level={level} />
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Folder className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold">{level.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter folder access code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        onClick={() => handleLevelAccess(level.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Access
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}