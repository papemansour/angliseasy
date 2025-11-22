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
import { LogOut, BookOpen, FileText, Link as LinkIcon, Upload, Send, User, Mail } from 'lucide-react';

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
            <TabsTrigger value="homeworks" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Devoirs</TabsTrigger>
            <TabsTrigger value="conversations" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Conversations</TabsTrigger>
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
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-teal-800">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline mt-2"
                            >
                              <FileText className="w-4 h-4" />
                              Ouvrir le document
                            </a>
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devoirs Tab */}
          <TabsContent value="homeworks">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formulaire de soumission */}
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Rendre un devoir</CardTitle>
                  <CardDescription>Envoyez votre travail à votre professeur</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitHomework} className="space-y-4">
                    <div>
                      <Label htmlFor="hw_title">Titre du devoir</Label>
                      <Input
                        id="hw_title"
                        required
                        value={homeworkData.title}
                        onChange={(e) => setHomeworkData({ ...homeworkData, title: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                        placeholder="Ex: Exercice page 45"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hw_description">Description (optionnel)</Label>
                      <Textarea
                        id="hw_description"
                        value={homeworkData.description}
                        onChange={(e) => setHomeworkData({ ...homeworkData, description: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                        placeholder="Notes ou commentaires..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="hw_file_upload">Télécharger votre fichier</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id="hw_file_upload"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, Word, Images (max 10MB)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500">OU</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                      <Label htmlFor="hw_url">Lien du document (URL)</Label>
                      <Input
                        id="hw_url"
                        value={homeworkData.file_url}
                        onChange={(e) => setHomeworkData({ ...homeworkData, file_url: e.target.value })}
                        placeholder="https://..."
                        className="border-teal-200 focus:border-teal-500"
                        disabled={uploadingFile}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={uploadingFile}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {uploadingFile ? 'Téléchargement...' : 'Rendre le devoir'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Historique des devoirs */}
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Devoirs rendus</CardTitle>
                  <CardDescription>Historique de vos travaux</CardDescription>
                </CardHeader>
                <CardContent>
                  {homeworks.length === 0 ? (
                    <p className="text-gray-500">Aucun devoir rendu</p>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {homeworks.map((hw) => (
                        <div key={hw.id} className="p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                          <div className="flex items-start gap-3">
                            <Upload className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-teal-800">{hw.title}</h3>
                              {hw.description && (
                                <p className="text-sm text-gray-600 mt-1">{hw.description}</p>
                              )}
                              <a 
                                href={hw.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline mt-2"
                              >
                                <FileText className="w-4 h-4" />
                                Voir le devoir
                              </a>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Rendu
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(hw.created_at).toLocaleDateString('fr-FR')}
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
            </div>
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
                  <p className="text-gray-500 text-center py-8">Vous n'avez pas encore de professeur assigné</p>
                ) : (
                  <div className="space-y-4">
                    {/* Messages container */}
                    <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
                      {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aucun message</p>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`p-3 rounded-lg ${
                                msg.from_user_id === user?.id 
                                  ? 'bg-teal-100 ml-auto max-w-[80%]' 
                                  : 'bg-white border max-w-[80%]'
                              }`}
                            >
                              <p className="text-sm font-semibold text-teal-700 mb-1">
                                {msg.from_user_id === user?.id ? 'Vous' : teacher.first_name}
                              </p>
                              <p className="text-gray-800">{msg.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(msg.sent_at).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Send message form */}
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newMessage.trim()) return;

                      try {
                        await apiClient.post('/messages/send', {
                          to_user_id: teacher.id,
                          content: newMessage
                        });
                        toast.success('Message envoyé!');
                        setNewMessage('');
                        
                        // Refresh messages
                        const res = await apiClient.get(`/messages/conversation/${teacher.id}`);
                        setMessages(res.data);
                      } catch (error) {
                        toast.error('Erreur lors de l\'envoi du message');
                      }
                    }} className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 border-teal-200"
                        rows={3}
                      />
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                        📤 Envoyer
                      </Button>
                    </form>

                    <Button 
                      onClick={async () => {
                        try {
                          const res = await apiClient.get(`/messages/conversation/${teacher.id}`);
                          setMessages(res.data);
                          toast.success('Messages actualisés');
                        } catch (error) {
                          toast.error('Erreur de chargement');
                        }
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      🔄 Actualiser les messages
                    </Button>
                  </div>
                )}
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
