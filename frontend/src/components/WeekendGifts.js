import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Gift, Volume2, Sparkles, Star } from 'lucide-react';

const WeekendGifts = ({ onConfetti }) => {
  const [weekendGift, setWeekendGift] = useState(null);
  const [collectedGifts, setCollectedGifts] = useState([]);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    fetchWeekendGift();
    fetchCollectedGifts();
  }, []);

  const fetchWeekendGift = async () => {
    try {
      const response = await apiClient.get('/student/weekend-gift');
      setWeekendGift(response.data);
      setIsRevealed(response.data.is_collected);
    } catch (error) {
      console.error('Error fetching gift:', error);
    }
  };

  const fetchCollectedGifts = async () => {
    try {
      const response = await apiClient.get('/student/my-collected-gifts');
      setCollectedGifts(response.data);
    } catch (error) {
      console.error('Error fetching collected gifts:', error);
    }
  };

  const handleUnwrap = async () => {
    if (isRevealed) return;
    
    setIsUnwrapping(true);
    
    // Animation de déballage
    setTimeout(async () => {
      setIsRevealed(true);
      setIsUnwrapping(false);
      setShowSparkles(true);
      onConfetti();
      
      // Marquer comme collecté
      try {
        await apiClient.post('/student/collect-gift', { gift_id: weekendGift.id });
        fetchCollectedGifts();
        toast.success('🎉 Cadeau déballé ! +10 étoiles !');
      } catch (error) {
        console.error('Error collecting gift:', error);
      }
      
      setTimeout(() => setShowSparkles(false), 3000);
    }, 1500);
  };

  const playPronunciation = () => {
    if (weekendGift && weekendGift.audio_url) {
      const audio = new Audio(weekendGift.audio_url);
      audio.play();
    } else if (weekendGift) {
      // Utiliser Web Speech API avec voix d'enfant
      const utterance = new SpeechSynthesisUtterance(weekendGift.word_english);
      utterance.lang = 'en-US';
      
      // Paramètres pour voix d'enfant de 6 ans
      utterance.pitch = 1.8; // Voix plus aiguë (enfant)
      utterance.rate = 0.75; // Plus lent (comme un enfant qui apprend)
      utterance.volume = 1.0;
      
      // Essayer de trouver une voix d'enfant ou féminine (plus proche)
      const voices = window.speechSynthesis.getVoices();
      const childVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('child') || 
         voice.name.includes('kid') || 
         voice.name.includes('junior') ||
         voice.name.includes('Google US English') ||
         voice.name.includes('female') ||
         voice.name.includes('Female'))
      );
      
      if (childVoice) {
        utterance.voice = childVoice;
      }
      
      // Répéter 2 fois pour mieux apprendre
      window.speechSynthesis.speak(utterance);
      setTimeout(() => {
        const repeat = new SpeechSynthesisUtterance(weekendGift.word_english);
        repeat.lang = 'en-US';
        repeat.pitch = 1.8;
        repeat.rate = 0.7; // Encore plus lent la 2ème fois
        repeat.volume = 1.0;
        if (childVoice) repeat.voice = childVoice;
        window.speechSynthesis.speak(repeat);
      }, 1500);
    }
  };

  if (!weekendGift) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-bounce">🎁</div>
        <p className="text-2xl font-bold text-purple-600">Chargement du cadeau...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekend Gift Card */}
      <Card className="border-4 border-pink-400 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 shadow-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              🎁 Cadeau du Weekend !
            </h2>
            <p className="text-lg text-gray-600">Clique pour déballer ton cadeau surprise !</p>
          </div>

          {/* Gift Box */}
          <div className="relative flex items-center justify-center min-h-[400px]">
            {!isRevealed ? (
              // Wrapped Gift
              <div
                onClick={handleUnwrap}
                className={`cursor-pointer transform transition-all duration-500 ${
                  isUnwrapping ? 'scale-110 rotate-12 opacity-0' : 'scale-100 hover:scale-110 hover:rotate-6'
                }`}
              >
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center border-8 border-yellow-300 animate-pulse">
                    <Gift className="w-32 h-32 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-64 bg-gradient-to-b from-yellow-300 to-yellow-500 opacity-80"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-64 h-16 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-80"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-16 bg-yellow-400 rounded-t-full border-4 border-yellow-500"></div>
                  </div>
                </div>
                <p className="text-center mt-6 text-xl font-bold text-purple-600 animate-bounce">
                  👆 Touche-moi !
                </p>
              </div>
            ) : (
              // Revealed Gift
              <div className="animate-in fade-in zoom-in duration-700">
                {showSparkles && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <Sparkles
                        key={i}
                        className="absolute text-yellow-400 animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl border-8 border-yellow-300">
                      <img
                        src={weekendGift.image_url}
                        alt={weekendGift.word_french}
                        className="w-64 h-64 object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-4 border-4 border-purple-300">
                    <p className="text-2xl font-bold text-gray-700 mb-2">
                      🇫🇷 {weekendGift.word_french}
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      🇬🇧 {weekendGift.word_english}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      playPronunciation();
                      toast.success('🔊 Écoute bien !');
                    }}
                    className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white text-xl py-6 px-8 rounded-2xl font-bold shadow-lg transform hover:scale-110 transition-all"
                  >
                    <Volume2 className="w-6 h-6 mr-2" />
                    Écouter la prononciation ! 🔊
                  </Button>

                  <div className="mt-6 p-4 bg-yellow-100 rounded-xl border-4 border-yellow-400">
                    <p className="text-lg font-bold text-yellow-700">
                      🎉 +10 étoiles gagnées !
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collection */}
      {collectedGifts.length > 0 && (
        <Card className="border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Ma Collection de Cadeaux
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {collectedGifts.map((gift, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer transform hover:scale-110 transition-all"
                  title={`${gift.word_french} = ${gift.word_english}`}
                >
                  <div className="w-full aspect-square bg-white rounded-xl border-4 border-purple-300 p-2 shadow-lg overflow-hidden">
                    <img
                      src={gift.image_url}
                      alt={gift.word_french}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-lg font-bold text-purple-600">
              🏆 {collectedGifts.length} cadeaux collectés !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeekendGifts;
