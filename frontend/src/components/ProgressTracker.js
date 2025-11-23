import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

const ProgressTracker = ({ user }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress calculation based on user activity
    // In real app, this would come from backend
    const calculateProgress = () => {
      let points = 0;
      // Add points for various activities
      if (user) points += 20; // Just being registered
      // Could add more based on: lessons completed, tests passed, etc.
      return Math.min(points, 100);
    };
    
    setProgress(calculateProgress());
  }, [user]);

  const badges = [
    {
      id: 1,
      name: '🚀 Débutant',
      description: 'Première connexion',
      unlocked: true,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 2,
      name: '📚 Étudiant Assidu',
      description: '5 cours complétés',
      unlocked: progress >= 40,
      color: 'from-green-400 to-teal-400'
    },
    {
      id: 3,
      name: '⭐ Expert',
      description: '10 cours complétés',
      unlocked: progress >= 70,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 4,
      name: '🏆 Champion',
      description: 'Niveau complété',
      unlocked: progress >= 100,
      color: 'from-purple-400 to-pink-400'
    }
  ];

  const weeklyStreak = 3; // Mock data
  const totalLessons = 2; // Mock data

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-900">
            <TrendingUp className="w-5 h-5" />
            Ma Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression globale</span>
              <span className="text-sm font-bold text-teal-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-teal-600">{weeklyStreak}</div>
              <div className="text-xs text-gray-600">Jours consécutifs</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">{totalLessons}</div>
              <div className="text-xs text-gray-600">Cours suivis</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{badges.filter(b => b.unlocked).length}</div>
              <div className="text-xs text-gray-600">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Award className="w-5 h-5" />
            Collection de Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-xl transition-all ${
                  badge.unlocked
                    ? `bg-gradient-to-br ${badge.color} shadow-lg transform hover:scale-105`
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.name.split(' ')[0]}</div>
                  <div className={`font-bold text-sm ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>
                    {badge.name.split(' ').slice(1).join(' ')}
                  </div>
                  <div className={`text-xs mt-1 ${badge.unlocked ? 'text-white/90' : 'text-gray-500'}`}>
                    {badge.description}
                  </div>
                </div>
                {badge.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenge (Bonus surprise) */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Zap className="w-5 h-5" />
            Défi du Jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Complète 1 leçon aujourd'hui</p>
              <p className="text-sm text-gray-600">+50 points XP</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
