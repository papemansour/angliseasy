import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Trophy, Star } from 'lucide-react';
import apiClient from '../utils/api';

const StudentOfMonthBadge = ({ size = 'normal', showInProfile = false }) => {
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    loadBadge();
  }, []);

  const loadBadge = async () => {
    try {
      const res = await apiClient.get('/club/student-of-month');
      setBadge(res.data);
    } catch (error) {
      console.error('Error loading student of month:', error);
    }
  };

  if (!badge) return null;

  // Badge pour le profil de l'étudiant - ÉNORME et animé
  if (showInProfile) {
    return (
      <div className="relative">
        {/* Rayons lumineux animés */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 via-transparent to-transparent transform -translate-x-1/2 rotate-0"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 via-transparent to-transparent transform -translate-x-1/2 rotate-45"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 via-transparent to-transparent transform -translate-x-1/2 rotate-90"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 via-transparent to-transparent transform -translate-x-1/2 rotate-135"></div>
        </div>

        {/* Badge principal */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl p-8 shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
          {/* Effet brillant */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 rounded-2xl animate-pulse"></div>
          
          {/* Étoiles volantes */}
          <Sparkles className="absolute top-2 right-2 w-8 h-8 text-white animate-ping" />
          <Sparkles className="absolute bottom-2 left-2 w-6 h-6 text-white animate-pulse" />
          <Star className="absolute top-2 left-2 w-7 h-7 text-white fill-white animate-spin-slow" />
          <Star className="absolute bottom-2 right-2 w-5 h-5 text-white fill-white animate-bounce" />

          <div className="relative z-10 text-center">
            {/* Couronne animée */}
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-20 h-20 text-yellow-500 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Texte */}
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white drop-shadow-lg uppercase tracking-wide">
                {badge.badge_title || (badge.user_role === 'teacher' ? 'Meilleur Prof du Mois' : 'Étudiant du Mois')}
              </h3>
              <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-xl">
                <p className="text-2xl font-bold text-yellow-900">{badge.user_name}</p>
                <p className="text-sm text-yellow-700 mt-1">
                  🏆 Champion de la communauté KALAMA
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-pink-600 font-bold">❤️ {badge.likes || 0} likes</span>
                </div>
              </div>
              <p className="text-white text-sm font-semibold mt-3">
                ⏰ Valable jusqu'au {new Date(badge.expires_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Badge flottant dans KALAMA CLUB - Petit et discret mais visible
  if (size === 'small') {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-yellow-300 animate-pulse">
        <Crown className="w-5 h-5 animate-bounce" />
        <div className="text-sm">
          <p className="font-bold">{badge.user_name}</p>
          <p className="text-xs text-yellow-100">Étudiant du Mois</p>
        </div>
        <Sparkles className="w-4 h-4" />
      </div>
    );
  }

  // Badge normal - Pour header de KALAMA CLUB
  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-6 py-3 rounded-xl shadow-xl border-2 border-yellow-300 animate-pulse">
        <div className="relative">
          <Crown className="w-8 h-8 animate-bounce" />
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 animate-ping" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide font-bold text-yellow-100">Étudiant du Mois</p>
          <p className="text-lg font-black">{badge.user_name}</p>
        </div>
        <Trophy className="w-6 h-6 animate-bounce" />
      </div>
    </div>
  );
};

export default StudentOfMonthBadge;
