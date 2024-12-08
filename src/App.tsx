import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { StudentSpace } from './components/StudentSpace';
import { AdminSpace } from './components/AdminSpace';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <>
          <Hero />
          <About />
          <StudentSpace />
          <AdminSpace />
          <Contact />
        </>
      )}
    </div>
  );
}

export default App;