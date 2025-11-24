import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const TestQuestionsManager = () => {
  const [questions, setQuestions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');

  const [formData, setFormData] = useState({
    level: 'beginner',
    question_type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await apiClient.get('/admin/all-test-questions');
      setQuestions(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await apiClient.put(`/admin/update-test-question/${editingQuestion.id}`, formData);
        toast.success('Question mise à jour');
      } else {
        await apiClient.post('/admin/create-test-question', formData);
        toast.success('Question créée');
      }
      resetForm();
      fetchQuestions();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    try {
      await apiClient.delete(`/admin/delete-test-question/${questionId}`);
      toast.success('Question supprimée');
      fetchQuestions();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      level: question.level,
      question_type: question.question_type,
      question: question.question,
      options: question.options || ['', '', '', ''],
      correct_answer: question.correct_answer
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      level: 'beginner',
      question_type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correct_answer: ''
    });
    setEditingQuestion(null);
    setShowDialog(false);
  };

  const filteredQuestions = filterLevel === 'all' 
    ? questions 
    : questions.filter(q => q.level === filterLevel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Gestion des Questions de Test
          </CardTitle>
          <CardDescription>
            Créez et gérez les questions pour les tests de niveau (QCM et Vrai/Faux)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle question
            </Button>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="beginner">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="advanced">Professionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <Card key={q.id} className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 rounded">
                          {q.level === 'beginner' ? 'Débutant' : q.level === 'intermediate' ? 'Intermédiaire' : 'Professionnel'}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 bg-purple-100 rounded">
                          {q.question_type === 'mcq' ? 'QCM' : 'Vrai/Faux'}
                        </span>
                      </div>
                      <p className="font-semibold mb-2">{q.question}</p>
                      {q.question_type === 'mcq' && (
                        <ul className="text-sm text-gray-600 ml-4">
                          {q.options.map((opt, i) => (
                            <li key={i} className={opt === q.correct_answer ? 'text-green-600 font-semibold' : ''}>
                              {String.fromCharCode(65 + i)}. {opt} {opt === q.correct_answer && '✓'}
                            </li>
                          ))}
                        </ul>
                      )}
                      {q.question_type === 'true_false' && (
                        <p className="text-sm">
                          Réponse correcte : <span className="font-semibold text-green-600">{q.correct_answer}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Modifier la question' : 'Nouvelle question'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Niveau *</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({...formData, level: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={formData.question_type} onValueChange={(v) => setFormData({...formData, question_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">QCM (4 choix)</SelectItem>
                    <SelectItem value="true_false">Vrai/Faux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Question *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                required
                placeholder="Ex: What is the capital of France?"
              />
            </div>

            {formData.question_type === 'mcq' ? (
              <>
                {formData.options.map((opt, i) => (
                  <div key={i}>
                    <Label>Option {String.fromCharCode(65 + i)} *</Label>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[i] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                      required
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                ))}
                <div>
                  <Label>Réponse correcte *</Label>
                  <Select value={formData.correct_answer} onValueChange={(v) => setFormData({...formData, correct_answer: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la bonne réponse" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.options.map((opt, i) => opt && (
                        <SelectItem key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div>
                <Label>Réponse correcte *</Label>
                <Select value={formData.correct_answer} onValueChange={(v) => setFormData({...formData, correct_answer: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="True">Vrai</SelectItem>
                    <SelectItem value="False">Faux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Enregistrer</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestQuestionsManager;