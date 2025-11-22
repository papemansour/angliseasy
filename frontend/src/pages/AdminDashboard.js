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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { LogOut, Users, UserCheck, UserPlus, Award, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    first_name: '',
    last_name: ''
  });
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [sessions, setSessions] = useState([]);
  const [prices, setPrices] = useState({
    beginner_eur: 76,
    intermediate_eur: 90,
    advanced_eur: 102,
    beginner_fcfa: 50000,
    intermediate_fcfa: 59000,
    advanced_fcfa: 67000
  });
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [documentToSend, setDocumentToSend] = useState({
    title: '',
    description: '',
    file_url: '',
    recipient_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, pendingRes, usersRes, resultsRes, sessionsRes, conversationsRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/admin/pending-registrations'),
        apiClient.get('/admin/all-users'),
        apiClient.get('/tests/results/all'),
        apiClient.get('/admin/session-notifications'),
        apiClient.get('/messages/my-conversations')
      ]);
      
      setUser(userRes.data);
      setPendingRegistrations(pendingRes.data);
      setAllUsers(usersRes.data);
      setTestResults(resultsRes.data);
      setSessions(sessionsRes.data);
      setConversations(conversationsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await apiClient.post(`/admin/approve-registration/${userId}`);
      toast.success(`Inscription approuvée! Email: ${response.data.email}, Mot de passe: ${response.data.temporary_password}`);
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/admin/create-teacher', teacherData);
      toast.success(`Professeur créé! Email: ${response.data.email}, Mot de passe: ${response.data.temporary_password}`);
      setTeacherData({ first_name: '', last_name: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const handleAssignTeacher = async () => {
    if (!selectedStudent || !selectedTeacher) {
      toast.error('Veuillez sélectionner un étudiant et un professeur');
      return;
    }
    try {
      await apiClient.post(`/admin/assign-teacher/${selectedStudent}/${selectedTeacher}`);
      toast.success('Professeur assigné avec succès!');
      setSelectedStudent('');
      setSelectedTeacher('');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
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

  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">KALAMAENGLISH - Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.first_name} {user?.last_name}</span>
            <Button variant="outline" onClick={handleLogout} data-testid="admin-logout-button">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord Admin</h2>
          <p className="text-gray-600">Gérez votre plateforme KALAMAENGLISH</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingRegistrations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professeurs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teachers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests passés</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{testResults.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending" data-testid="admin-tab-pending">En attente</TabsTrigger>
            <TabsTrigger value="students" data-testid="admin-tab-students">Étudiants</TabsTrigger>
            <TabsTrigger value="teachers" data-testid="admin-tab-teachers">Professeurs</TabsTrigger>
            <TabsTrigger value="assign" data-testid="admin-tab-assign">Assigner</TabsTrigger>
            <TabsTrigger value="results" data-testid="admin-tab-results">Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Inscriptions en attente</CardTitle>
                <CardDescription>Approuvez les nouvelles inscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRegistrations.length === 0 ? (
                  <p className="text-gray-500">Aucune inscription en attente</p>
                ) : (
                  <div className="space-y-4">
                    {pendingRegistrations.map((registration) => (
                      <div key={registration.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{registration.first_name} {registration.last_name}</h3>
                          <p className="text-sm text-gray-600">{registration.email}</p>
                          <p className="text-sm text-gray-500">Téléphone: {registration.phone}</p>
                          <p className="text-sm text-gray-500">Niveau: {registration.level}</p>
                          {registration.preferred_slots && (
                            <p className="text-xs text-gray-400">Créneaux: {registration.preferred_slots}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleApprove(registration.id)}
                          data-testid={`admin-approve-${registration.id}`}
                        >
                          Approuver
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Liste des étudiants</CardTitle>
                <CardDescription>Tous les étudiants inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-gray-500">Aucun étudiant inscrit</p>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{student.first_name} {student.last_name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-500">Niveau: {student.level}</p>
                            {student.temporary_password && (
                              <p className="text-xs text-orange-600 font-semibold mt-1">
                                Mot de passe provisoire: {student.temporary_password}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded text-sm ${
                            student.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un professeur</CardTitle>
                  <CardDescription>Ajoutez un nouveau professeur</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTeacher} className="space-y-4">
                    <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        data-testid="admin-teacher-first-name"
                        required
                        value={teacherData.first_name}
                        onChange={(e) => setTeacherData({ ...teacherData, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        data-testid="admin-teacher-last-name"
                        required
                        value={teacherData.last_name}
                        onChange={(e) => setTeacherData({ ...teacherData, last_name: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="admin-create-teacher-button">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Créer le professeur
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des professeurs</CardTitle>
                  <CardDescription>Tous les professeurs</CardDescription>
                </CardHeader>
                <CardContent>
                  {teachers.length === 0 ? (
                    <p className="text-gray-500">Aucun professeur</p>
                  ) : (
                    <div className="space-y-4">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{teacher.first_name} {teacher.last_name}</h3>
                          <p className="text-sm text-gray-600">{teacher.email}</p>
                          {teacher.temporary_password && (
                            <p className="text-xs text-orange-600 font-semibold mt-1">
                              Mot de passe provisoire: {teacher.temporary_password}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assign">
            <Card>
              <CardHeader>
                <CardTitle>Assigner un professeur à un étudiant</CardTitle>
                <CardDescription>Gérez les affectations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="student">Sélectionner un étudiant</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger data-testid="admin-select-student">
                        <SelectValue placeholder="Choisir un étudiant" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.first_name} {student.last_name} - {student.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="teacher">Sélectionner un professeur</Label>
                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                      <SelectTrigger data-testid="admin-select-teacher">
                        <SelectValue placeholder="Choisir un professeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAssignTeacher} className="w-full" data-testid="admin-assign-button">
                    Assigner le professeur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Résultats des tests</CardTitle>
                <CardDescription>Tous les résultats des tests de niveau</CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <p className="text-gray-500">Aucun résultat de test</p>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold capitalize">
                            Niveau: {result.level === 'beginner' ? 'Débutant' : result.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Score: {result.score} / {result.total_questions}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(result.created_at).toLocaleDateString('fr-FR')} à {new Date(result.created_at).toLocaleTimeString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                          {Math.round((result.score / result.total_questions) * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
