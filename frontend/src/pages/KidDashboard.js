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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 via-purple-100 via-blue-100 to-green-100 relative overflow-hidden">
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
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-green-500 p-4 shadow-lg animate-gradient">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-2xl animate-bounce border-4 border-white">
              🦄
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Salut {user?.first_name} ! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
                <span className="text-white font-bold text-lg bg-yellow-400 px-3 py-1 rounded-full text-purple-700">{stars} étoiles</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-gradient-to-r from-yellow-300 to-orange-400 text-purple-700 hover:from-orange-400 hover:to-red-400 border-2 border-white font-bold shadow-lg"
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 h-auto bg-transparent p-0">
            <TabsTrigger 
              value="games" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-300 data-[state=active]:via-orange-400 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-4 border-orange-400 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105 hover:rotate-3"
            >
              <span className="text-5xl animate-wiggle">🎮</span>
              <span className="text-base font-bold">Jeux</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="videos" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-400 data-[state=active]:via-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 border-4 border-purple-400 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105 hover:-rotate-3"
            >
              <span className="text-5xl animate-wiggle">📹</span>
              <span className="text-base font-bold">Vidéos</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="pack" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:via-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-gradient-to-br from-green-100 to-teal-100 hover:from-green-200 hover:to-teal-200 border-4 border-teal-400 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105 hover:rotate-3"
            >
              <span className="text-5xl animate-wiggle">🎁</span>
              <span className="text-base font-bold">Mon Pack</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="profile" 
              className="h-32 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:via-cyan-500 data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-4 border-cyan-400 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:scale-105 hover:-rotate-3"
            >
              <span className="text-5xl animate-wiggle">👤</span>
              <span className="text-base font-bold">Profil</span>
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            <div className="space-y-4">
              <Card className="border-4 border-orange-400 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-t-xl">
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
            <Card className="border-4 border-purple-400 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-t-xl">
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

          {/* Mon Pack Tab */}
          <TabsContent value="pack">
            <Card className="border-4 border-teal-400 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600 rounded-t-xl">
                <CardTitle className="text-3xl text-white flex items-center gap-2">
                  <span className="text-4xl">🎁</span>
                  Mon Super Pack !
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-white rounded-2xl p-6 border-4 border-green-300 shadow-lg mb-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4 animate-bounce">🎈</div>
                    <h3 className="text-3xl font-bold text-green-700 mb-2">Pack K-Kid</h3>
                    <p className="text-gray-600">Cours super fun pour les enfants !</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 rounded-xl p-6 mb-6 border-4 border-orange-300">
                    <div className="text-center">
                      <p className="text-sm font-bold text-purple-700 mb-2">Prix par mois</p>
                      <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">18€</div>
                      <p className="text-xs font-semibold text-purple-600">ou 10,000 FCFA</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-2xl">✨</span>
                      <span>Jeux et flashcards amusants</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-2xl">🎬</span>
                      <span>Vidéos éducatives</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-2xl">🏆</span>
                      <span>Badges et récompenses</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-2xl">👨‍🏫</span>
                      <span>Professeur dédié</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      window.open('https://buy.stripe.com/6oE4ho7nw0XT1X2288', '_blank');
                      triggerConfetti();
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl py-6 rounded-2xl font-bold shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Heart className="w-6 h-6 mr-2" />
                    Payer maintenant ! 💳
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500 mt-4">
                    🔒 Paiement sécurisé par Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-4 border-cyan-400 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-600 rounded-t-xl">
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
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fall {
          animation: fall 3s linear infinite;
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default KidDashboard;
