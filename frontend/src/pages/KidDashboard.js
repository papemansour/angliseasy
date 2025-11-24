import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import StudentGamesAdvanced from '../components/StudentGamesAdvanced';
import { LogOut, Star, Trophy, Sparkles, Play, Heart } from 'lucide-react';

const KidDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, videosRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/student/my-videos')
      ]);
      
      setUser(userRes.data);
      setVideos(videosRes.data);
      setStars(userRes.data.stars || 0);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('À bientôt ! 👋');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">🎈</div>
          <p className="text-2xl font-bold text-purple-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                fontSize: '2rem'
              }}
            >
              {['🎉', '⭐', '🎈', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg animate-bounce">
              🦄
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Salut {user?.first_name} ! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="text-white font-bold text-lg">{stars} étoiles</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white text-purple-600 hover:bg-purple-50 border-2 border-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Quitter
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="games" className="space-y-6">
          {/* Navigation Cards */}
          <TabsList className="grid grid-cols-3 gap-4 h-auto bg-transparent p-0">
            <TabsTrigger 
              value="games" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-white hover:bg-yellow-50 border-4 border-yellow-300 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span className="text-5xl animate-wiggle">🎮</span>
              <span className="text-base font-bold">Jeux</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="videos" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-white hover:bg-pink-50 border-4 border-pink-300 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span className="text-5xl animate-wiggle">📹</span>
              <span className="text-base font-bold">Vidéos</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="profile" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-white hover:bg-blue-50 border-4 border-blue-300 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span className="text-5xl animate-wiggle">👤</span>
              <span className="text-base font-bold">Profil</span>
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            <div className="space-y-4">
              <Card className="border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-t-xl">
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    <Trophy className="w-8 h-8" />
                    Mes Jeux Super Fun ! 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <StudentGamesAdvanced />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card className="border-4 border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-t-xl">
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <Play className="w-8 h-8" />
                  Mes Vidéos Magiques ! ✨
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {videos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 animate-bounce">📺</div>
                    <p className="text-2xl text-purple-600 font-bold">
                      Pas encore de vidéos !
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                      Ton professeur va bientôt t'envoyer des vidéos super cool ! 🎬
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="border-4 border-pink-300 hover:border-pink-500 transition-all transform hover:scale-105 cursor-pointer bg-white shadow-lg"
                        onClick={() => {
                          if (video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')) {
                            window.open(video.video_url, '_blank');
                          }
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                              🎬
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-purple-700 mb-2">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-gray-600 mb-3">{video.description}</p>
                              )}
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(video.video_url, '_blank');
                                  triggerConfetti();
                                }}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Regarder !
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t-xl">
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <Sparkles className="w-8 h-8" />
                  Mon Profil Super Cool ! 🌟
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center gap-8 mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-6xl shadow-2xl animate-bounce">
                    {['🦄', '🌈', '🎨', '🚀', '⭐', '🎈'][Math.floor(Math.random() * 6)]}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-purple-700 mb-2">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <div className="flex items-center gap-2 text-xl">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-yellow-600">{stars} étoiles</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border-4 border-purple-300 shadow-lg">
                    <div className="text-4xl mb-2">📧</div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-purple-700">{user?.email}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border-4 border-pink-300 shadow-lg">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-sm text-gray-600">Niveau</p>
                    <p className="text-lg font-semibold text-pink-700">K-Kid (Enfant)</p>
                  </div>
                </div>

                {/* Rewards Section */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-4 border-yellow-400 shadow-lg">
                  <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    Mes Super Badges ! 🏆
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { emoji: '⭐', name: 'Première étoile', earned: stars >= 1 },
                      { emoji: '🎮', name: 'Joueur', earned: stars >= 5 },
                      { emoji: '📚', name: 'Apprenant', earned: stars >= 10 },
                      { emoji: '🏆', name: 'Champion', earned: stars >= 20 },
                      { emoji: '🚀', name: 'Super Star', earned: stars >= 30 },
                      { emoji: '👑', name: 'Légende', earned: stars >= 50 },
                      { emoji: '💎', name: 'Expert', earned: stars >= 75 },
                      { emoji: '🌟', name: 'Maître', earned: stars >= 100 },
                    ].map((badge, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl text-center transition-all transform hover:scale-110 ${
                          badge.earned 
                            ? 'bg-white border-4 border-yellow-400 shadow-lg' 
                            : 'bg-gray-200 border-4 border-gray-300 opacity-50'
                        }`}
                      >
                        <div className={`text-4xl mb-2 ${badge.earned ? 'animate-bounce' : 'grayscale'}`}>
                          {badge.emoji}
                        </div>
                        <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-fall {
          animation: fall 3s linear infinite;
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      </style>
    </div>
  );
};

export default KidDashboard;
