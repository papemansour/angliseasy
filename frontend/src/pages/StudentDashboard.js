import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { LogOut, BookOpen, Award, Lock, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchTestResults();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await apiClient.get('/tests/results/my');
      setTestResults(response.data);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/auth/change-password', passwordData);
      toast.success('Mot de passe modifié avec succès!');
      setPasswordData({ old_password: '', new_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors du changement de mot de passe');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">KALAMAENGLISH</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.first_name} {user?.last_name}</span>
            <Button variant="outline" onClick={handleLogout} data-testid="student-logout-button">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Espace Étudiant</h2>
          <p className="text-gray-600">Bienvenue {user?.first_name}!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {user?.level === 'beginner' ? 'Débutant' : user?.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests passés</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Statut</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Actif</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Mes résultats de tests</CardTitle>
              <CardDescription>Historique de vos tests de niveau</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-gray-500">Aucun test passé pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold capitalize">
                          {result.level === 'beginner' ? 'Débutant' : result.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.round((result.score / result.total_questions) * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.score} / {result.total_questions} réponses correctes
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(result.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <Button
                className="w-full mt-4"
                onClick={() => navigate('/')}
                data-testid="student-new-test-button"
              >
                Passer un nouveau test
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Modifiez votre mot de passe provisoire</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="old_password">Ancien mot de passe</Label>
                  <Input
                    id="old_password"
                    type="password"
                    data-testid="student-old-password"
                    required
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input
                    id="new_password"
                    type="password"
                    data-testid="student-new-password"
                    required
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="student-change-password-button">
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
