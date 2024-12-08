import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = {
    en: 'English',
    fr: 'Français'
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-white hover:text-blue-200">
        <Globe size={20} />
        <span>{languages[i18n.language as keyof typeof languages] || languages.en}</span>
      </button>
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        {Object.entries(languages).map(([code, name]) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              i18n.language === code ? 'text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}