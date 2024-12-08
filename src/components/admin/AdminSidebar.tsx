import React from 'react';
import { Home, Users, BookOpen, FileText, Settings } from 'lucide-react';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        <a
          href="#dashboard"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Home className="h-5 w-5" />
          Dashboard
        </a>
        <a
          href="#students"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Users className="h-5 w-5" />
          Students
        </a>
        <a
          href="#courses"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <BookOpen className="h-5 w-5" />
          Courses
        </a>
        <a
          href="#documents"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FileText className="h-5 w-5" />
          Documents
        </a>
        <a
          href="#settings"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Settings className="h-5 w-5" />
          Settings
        </a>
      </nav>
    </aside>
  );
}