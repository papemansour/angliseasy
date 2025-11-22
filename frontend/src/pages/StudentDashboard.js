import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { LogOut, BookOpen, FileText, Link as LinkIcon, Upload, Send, User, Mail, MessageCircle } from 'lucide-react';
import ConversationChat from '../components/ConversationChat';
import NewsDisplay from '../components/NewsDisplay';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [links, setLinks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeworkData, setHomeworkData] = useState({
    title: '',
    description: '',
    file_url: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, linksRes, documentsRes, homeworksRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/student/my-links'),
        apiClient.get('/student/my-documents'),
        apiClient.get('/student/my-homeworks')
      ]);
      
      setUser(userRes.data);
      setLinks(linksRes.data);
      setDocuments(documentsRes.data);
      setHomeworks(homeworksRes.data);
      
      // Get teacher info if assigned
      if (userRes.data.assigned_teacher) {
        const teacherRes = await apiClient.get(`/student/my-teacher/${userRes.data.assigned_teacher}`);
        setTeacher(teacherRes.data);
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 10MB)');
      return;
    }
    
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/student/upload-homework', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setHomeworkData({ ...homeworkData, file_url: response.data.file_url });
      toast.success('Fichier téléchargé avec succès!');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    if (!homeworkData.file_url) {
      toast.error('Veuillez télécharger un fichier ou entrer une URL');
      return;
    }
    
    try {
      await apiClient.post('/student/submit-homework', homeworkData);
      toast.success('Devoir envoyé avec succès!');
      setHomeworkData({ title: '', description: '', file_url: '' });
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du devoir');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-teal-600">My KALAMA</h1>
            <span className="text-sm text-gray-600 font-semibold uppercase tracking-wide">English</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.first_name} {user?.last_name}</span>
            <Button variant="outline" onClick={handleLogout} className="border-teal-600 text-teal-600 hover:bg-teal-50">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header avec info prof */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Espace Étudiant</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Votre professeur</p>
                    {teacher ? (
                      <p className="text-lg font-bold text-teal-800">
                        {teacher.first_name} {teacher.last_name}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun professeur assigné</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact général</p>
                    <p className="text-lg font-bold text-blue-800">
                      mykalamaenglish@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liens reçus</CardTitle>
              <LinkIcon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{links.length}</div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents reçus</CardTitle>
              <FileText className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{documents.length}</div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devoirs rendus</CardTitle>
              <BookOpen className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{homeworks.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-teal-50">
            <TabsTrigger value="links" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Liens</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Documents</TabsTrigger>
            <TabsTrigger value="conversations" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Conversations</TabsTrigger>
            <TabsTrigger value="kalamatheque" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Kalamathèque</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Profil</TabsTrigger>
          </TabsList>

          {/* Liens Tab */}
          <TabsContent value="links">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Liens reçus de votre professeur</CardTitle>
                <CardDescription>Google Meet, ressources en ligne, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <p className="text-gray-500">Aucun lien reçu</p>
                ) : (
                  <div className="space-y-4">
                    {links.map((link) => (
                      <div key={link.id} className="p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                        <div className="flex items-start gap-3">
                          <LinkIcon className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-teal-800">{link.title}</h3>
                            {link.description && (
                              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                            )}
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline mt-2"
                            >
                              <LinkIcon className="w-4 h-4" />
                              Ouvrir le lien
                            </a>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                                De: {link.from_teacher_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(link.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Documents reçus</CardTitle>
                <CardDescription>Documents partagés par votre professeur</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-gray-500">Aucun document reçu</p>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-teal-800">{doc.title}</h3>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  De: {doc.from_teacher_name || doc.from_admin_name || 'Admin'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => window.open(doc.file_url, '_blank')}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              📄 Ouvrir
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.file_url;
                                link.download = doc.title;
                                link.click();
                              }}
                              className="border-blue-500 text-blue-600"
                            >
                              💾 Télécharger
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                if (window.confirm('Supprimer ce document ?')) {
                                  try {
                                    await apiClient.delete(`/documents/${doc.id}`);
                                    toast.success('Document supprimé');
                                    fetchData();
                                  } catch (error) {
                                    toast.error('Erreur de suppression');
                                  }
                                }
                              }}
                              className="border-red-500 text-red-600"
                            >
                              🗑️ Supprimer
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

          {/* Conversations Tab */}
          <TabsContent value="conversations">
            <Card className="border-teal-100">
              <CardHeader className="bg-teal-50">
                <CardTitle className="text-teal-800">💬 Conversations avec mon professeur</CardTitle>
                <CardDescription>
                  {teacher ? `Échangez avec ${teacher.first_name} ${teacher.last_name}` : 'Aucun professeur assigné'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!teacher ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Vous n'avez pas encore de professeur assigné</p>
                  </div>
                ) : (
                  <ConversationChat
                    recipientId={teacher.id}
                    recipientName={`${teacher.first_name} ${teacher.last_name}`}
                    currentUserId={user?.id}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kalamathèque Tab */}
          <TabsContent value="kalamatheque">
            <Card className="border-teal-100">
              <CardHeader className="bg-teal-50">
                <CardTitle className="text-teal-800">📚 Kalamathèque</CardTitle>
                <CardDescription>Accédez à notre bibliothèque numérique</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Bibliothèque numérique</h3>
                    <p className="text-gray-600 mb-6">
                      Enrichissez votre apprentissage avec notre collection de ressources pédagogiques
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.open('/kalamatheque-access', '_blank')}
                    className="bg-teal-600 hover:bg-teal-700"
                    size="lg"
                  >
                    🔓 Accéder à Kalamathèque
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab - Changement de mot de passe */}
          <TabsContent value="profile">
            <Card className="border-teal-100">
              <CardHeader className="bg-teal-50">
                <CardTitle className="text-teal-800">Mon Profil</CardTitle>
                <CardDescription>Gérez vos informations personnelles et votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="border-b pb-6">
                    <h3 className="font-semibold text-lg mb-4 text-teal-700">Informations personnelles</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom complet:</span>
                        <span className="font-semibold">{user?.first_name} {user?.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Niveau:</span>
                        <span className="font-semibold uppercase">{user?.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Changement de mot de passe */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-teal-700">Changer mon mot de passe</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const oldPassword = formData.get('old_password');
                      const newPassword = formData.get('new_password');
                      const confirmPassword = formData.get('confirm_password');

                      if (newPassword !== confirmPassword) {
                        toast.error('Les mots de passe ne correspondent pas');
                        return;
                      }

                      if (newPassword.length < 6) {
                        toast.error('Le mot de passe doit contenir au moins 6 caractères');
                        return;
                      }

                      try {
                        await apiClient.post('/auth/change-password', {
                          old_password: oldPassword,
                          new_password: newPassword
                        });
                        toast.success('Mot de passe modifié avec succès!');
                        e.target.reset();
                      } catch (error) {
                        toast.error(error.response?.data?.detail || 'Erreur lors du changement de mot de passe');
                      }
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="old_password">Ancien mot de passe</Label>
                        <Input
                          id="old_password"
                          name="old_password"
                          type="password"
                          required
                          className="border-teal-200 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new_password">Nouveau mot de passe</Label>
                        <Input
                          id="new_password"
                          name="new_password"
                          type="password"
                          required
                          minLength={6}
                          className="border-teal-200 focus:border-teal-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
                      </div>
                      <div>
                        <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                        <Input
                          id="confirm_password"
                          name="confirm_password"
                          type="password"
                          required
                          minLength={6}
                          className="border-teal-200 focus:border-teal-500"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                        🔐 Changer mon mot de passe
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
