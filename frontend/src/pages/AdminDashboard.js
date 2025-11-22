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
import { LogOut, Users, UserCheck, UserPlus, Award, BookOpen, Clock, Send, FileText, DollarSign } from 'lucide-react';

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
  const [teacherSessions, setTeacherSessions] = useState([]);
  const [teacherAvailability, setTeacherAvailability] = useState([]);
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
  const [selectedRecipients, setSelectedRecipients] = useState([]);
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
      setSessions(sessionsRes.data || []);
      setConversations(conversationsRes.data || []);
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

  const handleResetPassword = async (userId, userEmail) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir réinitialiser le mot de passe de ${userEmail}?\n\nUn nouveau mot de passe temporaire sera généré et envoyé à l'utilisateur par email.`)) {
      return;
    }
    
    try {
      const response = await apiClient.post(`/admin/reset-user-password/${userId}`);
      toast.success(
        `Mot de passe réinitialisé avec succès!\n\nMot de passe temporaire: ${response.data.temporary_password}\n\n${response.data.email_sent ? '✅ Email envoyé à l\'utilisateur' : '⚠️ Email non envoyé (vérifier la configuration AWS SES)'}`,
        { duration: 8000 }
      );
      fetchData(); // Refresh data to show temporary password
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const handleUpdatePrices = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/update-prices', prices);
      toast.success('Prix mis à jour avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des prix');
    }
  };

  const handleSelectRecipient = async (recipient) => {
    setSelectedRecipient(recipient);
    try {
      const response = await apiClient.get(`/messages/conversation/${recipient.id}`);
      setMessages(response.data);
    } catch (error) {
      toast.error('Erreur de chargement des messages');
    }
  };

  const handleToggleRecipient = (recipient) => {
    const isSelected = selectedRecipients.find(r => r.id === recipient.id);
    if (isSelected) {
      setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipient.id));
    } else {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (selectedRecipients.length === 0 || !messageContent.trim()) {
      toast.error('Sélectionnez au moins un destinataire');
      return;
    }
    
    try {
      // Send message to all selected recipients
      await Promise.all(
        selectedRecipients.map(recipient => 
          apiClient.post('/messages/send', {
            to_user_id: recipient.id,
            content: messageContent
          })
        )
      );
      setMessageContent('');
      toast.success(`Message envoyé à ${selectedRecipients.length} personne(s)!`);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const handleSendDocument = async (e) => {
    e.preventDefault();
    if (selectedRecipients.length === 0) {
      toast.error('Sélectionnez au moins un destinataire');
      return;
    }
    
    try {
      // Send document to all selected recipients
      await Promise.all(
        selectedRecipients.map(recipient =>
          apiClient.post('/admin/send-document', {
            ...documentToSend,
            recipient_id: recipient.id,
            recipient_type: recipient.role
          })
        )
      );
      toast.success(`Document envoyé à ${selectedRecipients.length} personne(s)!`);
      setDocumentToSend({ title: '', description: '', file_url: '', recipient_id: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du document');
    }
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
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="pending" data-testid="admin-tab-pending">En attente</TabsTrigger>
            <TabsTrigger value="students" data-testid="admin-tab-students">Étudiants</TabsTrigger>
            <TabsTrigger value="teachers" data-testid="admin-tab-teachers">Professeurs</TabsTrigger>
            <TabsTrigger value="assign" data-testid="admin-tab-assign">Assigner</TabsTrigger>
            <TabsTrigger value="attendance" data-testid="admin-tab-attendance">Assiduité</TabsTrigger>
            <TabsTrigger value="results" data-testid="admin-tab-results">Résultats</TabsTrigger>
            <TabsTrigger value="pricing" data-testid="admin-tab-pricing">Prix</TabsTrigger>
            <TabsTrigger value="availability" data-testid="admin-tab-availability">Dispo profs</TabsTrigger>
            <TabsTrigger value="conversations" data-testid="admin-tab-conversations">Conversations</TabsTrigger>
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
                          <div className="flex-1">
                            <h3 className="font-semibold">{student.first_name} {student.last_name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-500">Niveau: {student.level}</p>
                            {student.temporary_password && (
                              <p className="text-xs text-orange-600 font-semibold mt-1">
                                Mot de passe provisoire: {student.temporary_password}
                              </p>
                            )}
                            {student.current_password_plain && (
                              <p className="text-xs text-blue-600 font-semibold mt-1">
                                Mot de passe actuel: {student.current_password_plain}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded text-sm ${
                              student.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {student.is_active ? 'Actif' : 'Inactif'}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResetPassword(student.id, student.email)}
                            >
                              🔐 Réinitialiser MDP
                            </Button>
                          </div>
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
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{teacher.first_name} {teacher.last_name}</h3>
                              <p className="text-sm text-gray-600">{teacher.email}</p>
                              {teacher.temporary_password && (
                                <p className="text-xs text-orange-600 font-semibold mt-1">
                                  Mot de passe provisoire: {teacher.temporary_password}
                                </p>
                              )}
                              {teacher.current_password_plain && (
                                <p className="text-xs text-blue-600 font-semibold mt-1">
                                  Mot de passe actuel: {teacher.current_password_plain}
                                </p>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResetPassword(teacher.id, teacher.email)}
                            >
                              🔐 Réinitialiser MDP
                            </Button>
                          </div>
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


          {/* Assiduité Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Assiduité des professeurs</CardTitle>
                <CardDescription>Pointages des cours terminés avec statistiques complètes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={async () => {
                    try {
                      const res = await apiClient.get('/admin/teacher-sessions');
                      setTeacherSessions(res.data);
                      toast.success('Statistiques actualisées');
                    } catch (error) {
                      toast.error('Erreur de chargement');
                    }
                  }}
                  className="mb-4"
                >
                  🔄 Actualiser les statistiques
                </Button>
                {teacherSessions.length === 0 ? (
                  <p className="text-gray-500">Aucune session enregistrée</p>
                ) : (
                  <div className="space-y-4">
                    {teacherSessions.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{session.teacher_name}</h3>
                            <p className="text-sm text-gray-600">{session.teacher_email}</p>
                            <p className="text-xs text-gray-500">Session ID: {session.id}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            ✓ Terminé
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Début</p>
                            <p className="font-medium">{new Date(session.start_time).toLocaleString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fin</p>
                            <p className="font-medium">{new Date(session.end_time).toLocaleString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Durée totale</p>
                            <p className="font-medium text-blue-600">
                              {Math.floor(session.total_time_seconds / 3600)}h {Math.floor((session.total_time_seconds % 3600) / 60)}m {session.total_time_seconds % 60}s
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Temps de pause</p>
                            <p className="font-medium text-orange-600">
                              {Math.floor(session.paused_duration_seconds / 3600)}h {Math.floor((session.paused_duration_seconds % 3600) / 60)}m {session.paused_duration_seconds % 60}s
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500">
                            Enregistré le {new Date(session.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prix Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des prix des packs</CardTitle>
                <CardDescription>Modifier les prix en EUR et FCFA</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePrices} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Pack Débutant */}
                    <div className="space-y-4 p-4 bg-teal-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-teal-800">Pack Débutant</h3>
                      <div>
                        <Label htmlFor="beginner_eur">Prix en EUR (€)</Label>
                        <Input
                          id="beginner_eur"
                          type="number"
                          value={prices.beginner_eur}
                          onChange={(e) => setPrices({ ...prices, beginner_eur: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="beginner_fcfa">Prix en FCFA (FCFA)</Label>
                        <Input
                          id="beginner_fcfa"
                          type="number"
                          value={prices.beginner_fcfa}
                          onChange={(e) => setPrices({ ...prices, beginner_fcfa: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Pack Intermédiaire */}
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800">Pack Intermédiaire</h3>
                      <div>
                        <Label htmlFor="intermediate_eur">Prix en EUR (€)</Label>
                        <Input
                          id="intermediate_eur"
                          type="number"
                          value={prices.intermediate_eur}
                          onChange={(e) => setPrices({ ...prices, intermediate_eur: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="intermediate_fcfa">Prix en FCFA (FCFA)</Label>
                        <Input
                          id="intermediate_fcfa"
                          type="number"
                          value={prices.intermediate_fcfa}
                          onChange={(e) => setPrices({ ...prices, intermediate_fcfa: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Pack Avancé */}
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg md:col-span-2">
                      <h3 className="text-lg font-semibold text-purple-800">Pack Avancé</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="advanced_eur">Prix en EUR (€)</Label>
                          <Input
                            id="advanced_eur"
                            type="number"
                            value={prices.advanced_eur}
                            onChange={(e) => setPrices({ ...prices, advanced_eur: parseInt(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="advanced_fcfa">Prix en FCFA (FCFA)</Label>
                          <Input
                            id="advanced_fcfa"
                            type="number"
                            value={prices.advanced_fcfa}
                            onChange={(e) => setPrices({ ...prices, advanced_fcfa: parseInt(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Enregistrer les modifications
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note :</strong> Les prix seront automatiquement mis à jour sur le site après enregistrement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teacher Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>📅 Disponibilités des professeurs</CardTitle>
                <CardDescription>Consultez les horaires disponibles de tous les professeurs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={async () => {
                    try {
                      const res = await apiClient.get('/admin/all-teacher-availability');
                      setTeacherAvailability(res.data);
                      toast.success('Disponibilités actualisées');
                    } catch (error) {
                      toast.error('Erreur de chargement');
                    }
                  }}
                  className="mb-4"
                >
                  🔄 Actualiser les disponibilités
                </Button>

                {teacherAvailability.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune disponibilité enregistrée</p>
                ) : (
                  <div className="space-y-6">
                    {teacherAvailability.map((item) => (
                      <div key={item.teacher.id} className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg">
                            {item.teacher.first_name} {item.teacher.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.teacher.email}</p>
                        </div>

                        {item.availability && Object.keys(item.availability).length > 0 ? (
                          <div className="grid grid-cols-7 gap-2">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => {
                              const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                              const daySlots = item.availability[dayKeys[idx]] || [];
                              
                              return (
                                <div key={idx} className="border rounded p-2">
                                  <p className="font-semibold text-center mb-2 text-sm">{day}</p>
                                  <div className="space-y-1">
                                    {daySlots.length > 0 ? (
                                      daySlots.map((slot, slotIdx) => (
                                        <div key={slotIdx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded text-center">
                                          {slot}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded text-center">
                                        Indispo
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Aucune disponibilité définie</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Liste des conversations */}
              <Card>
                <CardHeader>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>Sélection multiple possible</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRecipients.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-700">
                        {selectedRecipients.length} personne(s) sélectionnée(s)
                      </p>
                    </div>
                  )}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {conversations.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleToggleRecipient(contact)}
                        className={`w-full p-3 rounded-lg text-left transition relative ${
                          selectedRecipients.find(r => r.id === contact.id)
                            ? 'bg-blue-100 border-2 border-blue-600'
                            : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {contact.first_name?.charAt(0)}{contact.last_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{contact.first_name} {contact.last_name}</p>
                            <p className="text-xs text-gray-500">{contact.role === 'teacher' ? 'Professeur' : 'Étudiant'}</p>
                          </div>
                          {selectedRecipients.find(r => r.id === contact.id) && (
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Zone de conversation */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedRecipients.length > 0 
                      ? `${selectedRecipients.length} personne(s) sélectionnée(s)` 
                      : 'Envoi de messages groupés'}
                  </CardTitle>
                  <CardDescription>
                    {selectedRecipients.length > 0 
                      ? selectedRecipients.map(r => `${r.first_name} ${r.last_name}`).join(', ')
                      : 'Sélectionnez un ou plusieurs contacts'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRecipients.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Sélectionnez un ou plusieurs contacts pour envoyer un message</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Info sélection */}
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <p className="font-semibold mb-2">Destinataires:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecipients.map(r => (
                            <span key={r.id} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                              {r.first_name} {r.last_name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Formulaire message */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Écrivez votre message..."
                          className="flex-1"
                        />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Envoyer
                        </Button>
                      </form>

                      {/* Formulaire document */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-3">Envoyer un document</h4>
                        <form onSubmit={handleSendDocument} className="space-y-3">
                          <div>
                            <Label htmlFor="doc_title">Titre</Label>
                            <Input
                              id="doc_title"
                              value={documentToSend.title}
                              onChange={(e) => setDocumentToSend({ ...documentToSend, title: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="doc_description">Description</Label>
                            <Input
                              id="doc_description"
                              value={documentToSend.description}
                              onChange={(e) => setDocumentToSend({ ...documentToSend, description: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="doc_url">Lien du document</Label>
                            <Input
                              id="doc_url"
                              value={documentToSend.file_url}
                              onChange={(e) => setDocumentToSend({ ...documentToSend, file_url: e.target.value })}
                              placeholder="https://..."
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Envoyer le document
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
