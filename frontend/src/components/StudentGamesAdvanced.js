import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Trophy, ExternalLink, Star, X, Check, Sparkles } from 'lucide-react';

const StudentGamesAdvanced = () => {
  const [games, setGames] = useState([]);
  const [activeFlashcard, setActiveFlashcard] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(0);
  const [unknownCards, setUnknownCards] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [surpriseMode, setSurpriseMode] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await apiClient.get('/student/my-games');
      setGames(response.data);
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const startFlashcardGame = (game) => {
    const cards = surpriseMode ? shuffleArray([...game.flashcards]) : game.flashcards;
    setActiveFlashcard({ ...game, flashcards: cards });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards(0);
    setUnknownCards(0);
    setFavorites([]);
    setGameFinished(false);
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleSwipeLeft = () => {
    setUnknownCards(unknownCards + 1);
    nextCard();
  };

  const handleSwipeRight = () => {
    setKnownCards(knownCards + 1);
    nextCard();
  };

  const handleFavorite = () => {
    const currentCard = activeFlashcard.flashcards[currentCardIndex];
    setFavorites([...favorites, currentCard]);
    toast.success('⭐ Favori');
  };

  const nextCard = () => {
    if (currentCardIndex < activeFlashcard.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setGameFinished(true);
    const totalScore = knownCards + unknownCards;
    try {
      await apiClient.post('/student/submit-game-score', {
        assignment_id: activeFlashcard.id,
        score: knownCards,
        total: totalScore
      });
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const exitGame = () => {
    setActiveFlashcard(null);
    setGameFinished(false);
    setSurpriseMode(false);
    fetchGames();
  };

  if (activeFlashcard && !gameFinished) {
    const card = activeFlashcard.flashcards[currentCardIndex];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{currentCardIndex + 1} / {activeFlashcard.flashcards.length}</span>
            <span className="flex gap-4">
              <span className="text-green-600">✓ {knownCards}</span>
              <span className="text-red-600">✗ {unknownCards}</span>
              <span className="text-yellow-600">⭐ {favorites.length}</span>
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-teal-500"
              style={{ width: `${((currentCardIndex + 1) / activeFlashcard.flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="relative h-[500px]" onClick={() => setIsFlipped(!isFlipped)}>
          <Card className="h-full border-4 border-yellow-400 cursor-pointer">
            <CardContent className="h-full flex flex-col items-center justify-center p-8">
              {!isFlipped ? (
                <>
                  <div className="text-sm text-gray-500 mb-4">FRANÇAIS</div>
                  {card.image_url && (
                    <img 
                      src={card.image_url} 
                      alt={card.question}
                      className="w-48 h-48 object-cover rounded-lg mb-6"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <p className="text-4xl font-bold">{card.question}</p>
                  <p className="text-sm text-gray-500 mt-6">👆 Cliquez</p>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-500 mb-4">ENGLISH</div>
                  <p className="text-4xl font-bold text-teal-600">{card.answer}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleSwipeLeft} variant="outline" className="w-20 h-20 rounded-full border-4 border-red-500">
            <X className="w-8 h-8 text-red-600" />
          </Button>
          <Button onClick={handleFavorite} variant="outline" className="w-16 h-16 rounded-full border-4 border-yellow-500">
            <Star className="w-6 h-6 text-yellow-600" />
          </Button>
          <Button onClick={handleSwipeRight} className="w-20 h-20 rounded-full bg-green-500">
            <Check className="w-8 h-8 text-white" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button onClick={exitGame} variant="ghost">Quitter</Button>
        </div>
      </div>
    );
  }

  if (activeFlashcard && gameFinished) {
    const total = knownCards + unknownCards;
    const percentage = Math.round((knownCards / total) * 100);
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-yellow-400">
          <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100">
            <CardTitle className="text-center text-3xl">🎉 Bravo !</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{knownCards}</div>
                <div className="text-sm">Connus</div>
              </div>
              <div className="p-4 bg-red-100 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{unknownCards}</div>
                <div className="text-sm">À réviser</div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{favorites.length}</div>
                <div className="text-sm">Favoris</div>
              </div>
            </div>
            <p className="text-4xl font-bold text-teal-600 mb-2">{percentage}%</p>
            
            {favorites.length > 0 && (
              <div className="text-left bg-yellow-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">⭐ Vos favoris</h3>
                {favorites.map((fav, idx) => (
                  <div key={idx} className="text-sm">{fav.question} → {fav.answer}</div>
                ))}
              </div>
            )}
            
            <Button onClick={exitGame} className="bg-teal-600">Retour</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎮 Mes Jeux</CardTitle>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Aucun jeu</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {games.map((game) => (
                <Card key={game.id} className={`border-2 ${game.completed ? 'border-green-300' : 'border-yellow-300'}`}>
                  <CardContent className="p-6">
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm mb-4">{game.game_type === 'flashcard' ? '🎴' : '🎯'}</p>
                    {game.completed && (
                      <div className="mb-4 p-3 bg-white rounded">
                        <p className="text-2xl font-bold text-green-600">{game.score}/{game.total}</p>
                      </div>
                    )}
                    {game.game_type === 'flashcard' ? (
                      <div className="space-y-2">
                        <Button onClick={() => { setSurpriseMode(false); startFlashcardGame(game); }} disabled={game.completed} className="w-full">
                          {game.completed ? 'Complété' : 'Jouer'}
                        </Button>
                        {!game.completed && (
                          <Button onClick={() => { setSurpriseMode(true); startFlashcardGame(game); }} variant="outline" className="w-full">
                            <Sparkles className="w-4 h-4 mr-2" />Surprise !
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => window.open(game.game_url, '_blank')} className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />Kahoot
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGamesAdvanced;
