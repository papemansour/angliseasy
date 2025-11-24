import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Trash2, Plus, Send, Eye, Trophy } from 'lucide-react';

const TeacherGames = ({ students }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const [showCreateFlashcard, setShowCreateFlashcard] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAssignGame, setShowAssignGame] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  const [newSetData, setNewSetData] = useState({
    title: '',
    description: ''
  });

  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    image_url: ''
  });

  const [assignData, setAssignData] = useState({
    game_type: 'flashcard',
    game_id: '',
    game_url: '',
    title: '',
    student_id: ''
  });

  useEffect(() => {
    fetchFlashcardSets();
    fetchGameScores();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      const response = await apiClient.get('/teacher/my-flashcard-sets');
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };

  const fetchGameScores = async () => {
    try {
      const response = await apiClient.get('/teacher/game-scores');
      setGameScores(response.data);
    } catch (error) {
      console.error('Error fetching game scores:', error);
    }
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/create-flashcard-set', newSetData);
      toast.success('Set de flashcards créé !');
      setNewSetData({ title: '', description: '' });
      setShowCreateFlashcard(false);
      fetchFlashcardSets();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/add-flashcard', {
        set_id: selectedSet.id,
        ...newCard
      });
      toast.success('Flashcard ajoutée !');
      setNewCard({ question: '', answer: '' });
      setShowAddCard(false);
      fetchFlashcardSets();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleDeleteSet = async (setId) => {
    if (!window.confirm('Supprimer ce set de flashcards ?')) return;
    try {
      await apiClient.delete(`/teacher/delete-flashcard-set/${setId}`);
      toast.success('Set supprimé');
      fetchFlashcardSets();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAssignGame = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/assign-game', assignData);
      toast.success('Jeu assigné à l\'étudiant !');
      setAssignData({
        game_type: 'flashcard',
        game_id: '',
        game_url: '',
        title: '',
        student_id: ''
      });
      setShowAssignGame(false);
      fetchGameScores();
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Flashcard Set */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎴</span>
            Mes Sets de Flashcards
          </CardTitle>
          <CardDescription>
            Créez des flashcards pour aider vos étudiants à réviser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowCreateFlashcard(true)} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Créer un nouveau set
          </Button>

          <div className="grid md:grid-cols-2 gap-4">
            {flashcardSets.map((set) => (
              <Card key={set.id} className="border-2 border-yellow-200">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{set.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{set.description}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {set.flashcards?.length || 0} carte(s)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSet(set);
                        setShowAddCard(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter carte
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAssignData({
                          ...assignData,
                          game_type: 'flashcard',
                          game_id: set.id,
                          title: set.title
                        });
                        setShowAssignGame(true);
                      }}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Assigner
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSet(set.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kahoot Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Liens Kahoot
          </CardTitle>
          <CardDescription>
            Assignez des quiz Kahoot à vos étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setAssignData({
                ...assignData,
                game_type: 'kahoot',
                game_id: null,
                game_url: '',
                title: ''
              });
              setShowAssignGame(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Assigner un Kahoot
          </Button>
        </CardContent>
      </Card>

      {/* Game Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Scores des étudiants
          </CardTitle>
          <CardDescription>
            Consultez les performances de vos étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gameScores.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun score pour le moment</p>
          ) : (
            <div className="space-y-3">
              {gameScores.map((score) => (
                <div
                  key={score.id}
                  className="flex justify-between items-center p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50"
                >
                  <div>
                    <p className="font-semibold">{score.student_name}</p>
                    <p className="text-sm text-gray-600">{score.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(score.completed_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">
                      {score.score}/{score.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round((score.score / score.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Flashcard Set Dialog */}
      <Dialog open={showCreateFlashcard} onOpenChange={setShowCreateFlashcard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau set de flashcards</DialogTitle>
            <DialogDescription>
              Donnez un titre et une description à votre set
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSet} className="space-y-4">
            <div>
              <Label>Titre *</Label>
              <Input
                value={newSetData.title}
                onChange={(e) => setNewSetData({ ...newSetData, title: e.target.value })}
                required
                placeholder="Ex: Vocabulaire - Famille"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newSetData.description}
                onChange={(e) => setNewSetData({ ...newSetData, description: e.target.value })}
                placeholder="Description du set"
              />
            </div>
            <Button type="submit" className="w-full">Créer le set</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Flashcard Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une flashcard</DialogTitle>
            <DialogDescription>
              {selectedSet?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Input
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                required
                placeholder="Ex: What is your name?"
              />
            </div>
            <div>
              <Label>Réponse *</Label>
              <Input
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                required
                placeholder="Ex: My name is..."
              />
            </div>
            <Button type="submit" className="w-full">Ajouter la carte</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Game Dialog */}
      <Dialog open={showAssignGame} onOpenChange={setShowAssignGame}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un jeu</DialogTitle>
            <DialogDescription>
              Sélectionnez un étudiant et le jeu à assigner
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignGame} className="space-y-4">
            <div>
              <Label>Type de jeu</Label>
              <Select
                value={assignData.game_type}
                onValueChange={(value) => setAssignData({ ...assignData, game_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flashcard">Flashcard</SelectItem>
                  <SelectItem value="kahoot">Kahoot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {assignData.game_type === 'kahoot' && (
              <>
                <div>
                  <Label>Titre *</Label>
                  <Input
                    value={assignData.title}
                    onChange={(e) => setAssignData({ ...assignData, title: e.target.value })}
                    required
                    placeholder="Titre du Kahoot"
                  />
                </div>
                <div>
                  <Label>Lien Kahoot *</Label>
                  <Input
                    value={assignData.game_url}
                    onChange={(e) => setAssignData({ ...assignData, game_url: e.target.value })}
                    required
                    placeholder="https://kahoot.it/..."
                  />
                </div>
              </>
            )}

            <div>
              <Label>Étudiant *</Label>
              <Select
                value={assignData.student_id}
                onValueChange={(value) => setAssignData({ ...assignData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">Assigner le jeu</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherGames;
