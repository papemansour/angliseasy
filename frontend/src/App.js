import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestPage from './pages/TestPage';
import LegalPage from './pages/LegalPage';
import CGUPage from './pages/CGUPage';
import PrivacyPage from './pages/PrivacyPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test/:level" element={<TestPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/cgu" element={<CGUPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/*" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
