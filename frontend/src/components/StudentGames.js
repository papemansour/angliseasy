import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Trophy, ExternalLink, PlayCircle, CheckCircle } from 'lucide-react';

const StudentGames = () => {
  const [games, setGames] = useState([]);
  const [activeFlashcard, setActiveFlashcard] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await apiClient.get('/student/my-games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const startFlashcardGame = (game) => {
    setActiveFlashcard(game);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setScore(0);
    setGameFinished(false);
  };

  const handleCorrect = () => {
    setScore(score + 1);
    nextCard();
  };

  const handleIncorrect = () => {
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < activeFlashcard.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setGameFinished(true);
    try {
      await apiClient.post('/student/submit-game-score', {
        assignment_id: activeFlashcard.id,
        score: score,
        total: activeFlashcard.flashcards.length
      });
      toast.success('Score enregistré !');
      fetchGames();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du score');
    }
  };

  const exitGame = () => {
    setActiveFlashcard(null);
    setGameFinished(false);
  };

  if (activeFlashcard && !gameFinished) {
    const card = activeFlashcard.flashcards[currentCardIndex];
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-yellow-400">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
            <CardTitle className="text-center">
              {activeFlashcard.title}
            </CardTitle>
            <CardDescription className="text-center">
              Carte {currentCardIndex + 1} / {activeFlashcard.flashcards.length}
            </CardDescription>
            <div className="flex justify-center gap-1 mt-2">
              {activeFlashcard.flashcards.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-8 rounded ${
                    idx < currentCardIndex ? 'bg-green-500' :
                    idx === currentCardIndex ? 'bg-yellow-500' :
                    'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="min-h-[200px] flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {card.question}
                </p>
                {showAnswer && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <p className="text-xl text-teal-600 font-semibold bg-teal-50 p-4 rounded-lg">
                      {card.answer}
                    </p>
                  </div>
                )}
              </div>

              {!showAnswer ? (
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg px-8 py-6"
                >
                  Voir la réponse
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={handleIncorrect}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 px-8 py-6"
                  >
                    ❌ Je ne savais pas
                  </Button>
                  <Button
                    onClick={handleCorrect}
                    className="bg-green-600 hover:bg-green-700 px-8 py-6"
                  >
                    ✅ Je savais !
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Score actuel : <span className="font-bold text-teal-600">{score}</span> / {activeFlashcard.flashcards.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button
            onClick={exitGame}
            variant="ghost"
            className="text-gray-600"
          >
            Quitter le jeu
          </Button>
        </div>
      </div>
    );
  }

  if (activeFlashcard && gameFinished) {
    const percentage = Math.round((score / activeFlashcard.flashcards.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-yellow-400">
          <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100">
            <CardTitle className="text-center text-3xl">
              🎉 Bravo !
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-4xl font-bold text-teal-600 mb-4">
              {score} / {activeFlashcard.flashcards.length}
            </h3>
            <p className="text-2xl text-gray-700 mb-6">
              Score : {percentage}%
            </p>
            <p className="text-gray-600 mb-8">
              Votre score a été envoyé à votre professeur !
            </p>
            <Button
              onClick={exitGame}
              className="bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              Retour aux jeux
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            Mes Jeux
          </CardTitle>
          <CardDescription>
            Révisez avec les flashcards et quiz de votre professeur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucun jeu n'a encore été assigné par votre professeur
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className={`border-2 ${
                    game.completed ? 'border-green-300 bg-green-50' : 'border-yellow-300'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{game.title}</h3>
                        <p className="text-sm text-gray-600">
                          {game.game_type === 'flashcard' ? '🎴 Flashcards' : '🎯 Kahoot'}
                        </p>
                      </div>
                      {game.completed && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>

                    {game.completed && (
                      <div className="mb-4 p-3 bg-white rounded-lg">
                        <p className="text-sm text-gray-600">Score obtenu :</p>
                        <p className="text-2xl font-bold text-green-600">
                          {game.score}/{game.total}
                        </p>
                      </div>
                    )}

                    {game.game_type === 'flashcard' ? (
                      <Button
                        onClick={() => startFlashcardGame(game)}
                        disabled={game.completed}
                        className="w-full"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {game.completed ? 'Déjà complété' : 'Commencer'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => window.open(game.game_url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir Kahoot
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

export default StudentGames;
