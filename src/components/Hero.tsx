import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://cdn.gamma.app/4m8s9cdkc8mh2bd/generated-images/dRT8qpTlLr8p7cLwRlgTH.png"
            alt={t('hero.imageAlt')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              {t('hero.description')}
            </p>
            <button
              onClick={() => setShowFullscreen(true)}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
            >
              <Play className="mr-2" size={24} />
              {t('hero.startButton')}
            </button>
          </div>
        </div>
      </section>

      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src="https://cdn.gamma.app/4m8s9cdkc8mh2bd/generated-images/dRT8qpTlLr8p7cLwRlgTH.png"
            alt={t('hero.imageAlt')}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </>
  );
}