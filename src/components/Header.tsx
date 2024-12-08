import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap size={32} />
            <h1 className="text-2xl font-bold">{t('site.name')}</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:text-blue-200">{t('nav.about')}</a></li>
              <li><a href="#contact" className="hover:text-blue-200">{t('nav.contact')}</a></li>
              {isAuthenticated ? (
                <li>
                  <button onClick={logout} className="hover:text-blue-200">{t('nav.logout')}</button>
                </li>
              ) : (
                <li>
                  <a href="#student-space" className="hover:text-blue-200">{t('nav.proSpace')}</a>
                </li>
              )}
            </ul>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
}