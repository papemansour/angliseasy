import React from 'react';
import { BookOpen, Users, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('about.welcome')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              {t('about.description')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <BookOpen className="w-12 h-12 text-blue-600 mb-2" />
                <h3 className="font-semibold">{t('about.stats.courses')}</h3>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-blue-600 mb-2" />
                <h3 className="font-semibold">{t('about.stats.students')}</h3>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="w-12 h-12 text-blue-600 mb-2" />
                <h3 className="font-semibold">{t('about.stats.levels')}</h3>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
              alt="Students learning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}