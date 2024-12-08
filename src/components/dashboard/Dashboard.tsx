import React from 'react';
import { Calendar, BookOpen, Clock, Award, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { levels } from '../../data/courses';
import { LevelAccess } from './LevelAccess';
import { Toaster } from 'react-hot-toast';

export function Dashboard() {
  const { user } = useAuthStore();

  const totalCourses = levels.reduce((acc, level) => acc + level.courses.length, 0);
  const completedCourses = 0;
  const progress = (completedCourses / totalCourses) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Welcome back, {user?.email}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">Total Courses</h3>
                  <p className="text-2xl font-bold text-blue-600">{totalCourses}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="text-green-600" />
                <div>
                  <h3 className="font-semibold">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">{completedCourses}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" />
                <div>
                  <h3 className="font-semibold">Progress</h3>
                  <p className="text-2xl font-bold text-yellow-600">{progress.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-600" />
                <div>
                  <h3 className="font-semibold">Next Class</h3>
                  <p className="text-sm font-medium text-purple-600">Today at 15:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="space-y-6">
              {levels.map((level) => (
                <LevelAccess key={level.id} level={level} />
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 bg-gray-50 p-3 rounded hover:bg-gray-100 transition">
                  <Settings size={20} />
                  Account Settings
                </button>
                <a
                  href="#contact"
                  className="w-full flex items-center gap-2 bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}