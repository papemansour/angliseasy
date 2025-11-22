import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { LogOut, Users, BookOpen, Calendar, MessageCircle, Send, Video, FileText, Upload, Play, Pause, Square, Clock } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [pauseStart, setPauseStart] = useState(null);
  const [pausedDuration, setPausedDuration] = useState(0);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    level: '',
    schedule: '',
    student_id: '',
    student_email: '',
    meet_link: ''
  });

  const [documentData, setDocumentData] = useState({
    title: '',
    description: '',
    recipient_type: 'student',
    recipient_id: '',
    file_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStart - pausedDuration) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, sessionStart, pausedDuration]);

  const fetchData = async () => {
    try {
      const [userRes, studentsRes, coursesRes, conversationsRes, documentsRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/teacher/my-students'),
        apiClient.get('/teacher/my-courses'),
        apiClient.get('/messages/my-conversations'),
        apiClient.get('/teacher/my-documents')
      ]);
      
      setUser(userRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setConversations(conversationsRes.data);
      setDocuments(documentsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const generateGoogleMeetLink = () => {
    const meetId = Math.random().toString(36).substring(2, 15);
    const meetLink = `https://meet.google.com/${meetId}`;
    setCourseData({ ...courseData, meet_link: meetLink });
    toast.success('Lien Google Meet généré!');
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/create-course', courseData);
      toast.success('Cours créé avec succès!');
      setCourseData({ title: '', description: '', level: '', schedule: '', student_id: '', meet_link: '' });
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la création du cours');
    }
  };

  const handleSendDocument = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/send-document', documentData);
      toast.success('Document envoyé avec succès!');
      setDocumentData({ title: '', description: '', recipient_type: 'student', recipient_id: '', file_url: '' });
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du document');
    }
  };

  const handleStartSession = async () => {
    setIsTimerRunning(true);
    setIsPaused(false);
    setSessionStart(Date.now());
    setPausedDuration(0);
    setElapsedTime(0);
    
    try {
      await apiClient.post('/teacher/session/start');
      toast.success('Session démarrée!');
    } catch (error) {
      toast.error('Erreur lors du démarrage');
    }
  };

  const handlePauseSession = async () => {
    if (isPaused) {
      // Reprise
      setPausedDuration(pausedDuration + (Date.now() - pauseStart));
      setIsPaused(false);
      try {
        await apiClient.post('/teacher/session/resume');
        toast.info('Session reprise');
      } catch (error) {
        toast.error('Erreur');
      }
    } else {
      // Pause
      setPauseStart(Date.now());
      setIsPaused(true);
      try {
        await apiClient.post('/teacher/session/pause', { elapsed_time: elapsedTime });
        toast.info('Session en pause');
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  const handleEndSession = async () => {
    try {
      await apiClient.post('/teacher/session/end', {
        total_time: elapsedTime,
        paused_duration: Math.floor(pausedDuration / 1000)
      });
      toast.success('Session terminée et envoyée à l\'admin!');
      setIsTimerRunning(false);
      setIsPaused(false);
      setElapsedTime(0);
      setSessionStart(null);
      setPauseStart(null);
      setPausedDuration(0);
    } catch (error) {
      toast.error('Erreur lors de la fin de session');
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedRecipient || !messageContent.trim()) return;
    
    try {
      await apiClient.post('/messages/send', {
        to_user_id: selectedRecipient.id,
        content: messageContent
      });
      setMessageContent('');
      handleSelectRecipient(selectedRecipient);
      toast.success('Message envoyé!');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const adminUser = conversations.find(u => u.role === 'admin');
  const availableRecipients = [adminUser, ...students].filter(Boolean);

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
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Espace Professeur</h2>
          <p className="text-gray-600">Bienvenue {user?.first_name}!</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes étudiants</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes cours</CardTitle>
              <BookOpen className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{courses.length}</div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{documents.length}</div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{availableRecipients.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-teal-50">
            <TabsTrigger value="students" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Étudiants</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Cours</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Documents</TabsTrigger>
            <TabsTrigger value="timer" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Pointage</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Liste de mes étudiants</CardTitle>
                <CardDescription>Étudiants que vous encadrez</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-gray-500">Aucun étudiant assigné</p>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 border border-teal-100 rounded-lg flex justify-between items-center hover:bg-teal-50 transition">
                        <div>
                          <h3 className="font-semibold text-teal-800">{student.first_name} {student.last_name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-500">Niveau: {student.level}</p>
                        </div>
                        <div className="text-sm text-gray-400">
                          {student.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Créer un cours avec Google Meet</CardTitle>
                  <CardDescription>Ajoutez un nouveau cours et générez un lien Meet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        required
                        value={courseData.title}
                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        required
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Niveau</Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) => setCourseData({ ...courseData, level: value })}
                        required
                      >
                        <SelectTrigger className="border-teal-200">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Débutant</SelectItem>
                          <SelectItem value="intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="student">Étudiant assigné</Label>
                      <Select
                        value={courseData.student_id}
                        onValueChange={(value) => setCourseData({ ...courseData, student_id: value })}
                        required
                      >
                        <SelectTrigger className="border-teal-200">
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
                    <div>
                      <Label htmlFor="schedule">Horaire</Label>
                      <Input
                        id="schedule"
                        required
                        value={courseData.schedule}
                        onChange={(e) => setCourseData({ ...courseData, schedule: e.target.value })}
                        placeholder="Ex: Lundi 18h-20h"
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meet_link">Lien Google Meet</Label>
                      <div className="flex gap-2">
                        <Input
                          id="meet_link"
                          value={courseData.meet_link}
                          onChange={(e) => setCourseData({ ...courseData, meet_link: e.target.value })}
                          placeholder="Générer ou coller un lien"
                          className="border-teal-200 focus:border-teal-500"
                        />
                        <Button type="button" onClick={generateGoogleMeetLink} className="bg-teal-600 hover:bg-teal-700">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email: mykalamaenglish@gmail.com</p>
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                      Créer le cours
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Mes cours</CardTitle>
                  <CardDescription>Liste de vos cours avec liens Meet</CardDescription>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <p className="text-gray-500">Aucun cours créé</p>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {courses.map((course) => (
                        <div key={course.id} className="p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                          <h3 className="font-semibold text-teal-800">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          {course.meet_link && (
                            <a href={course.meet_link} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-2">
                              <Video className="w-4 h-4" />
                              Rejoindre le cours
                            </a>
                          )}
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                              {course.level}
                            </span>
                            <span className="text-xs text-gray-500">{course.schedule}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Envoyer un document</CardTitle>
                  <CardDescription>Partagez des documents avec admin ou étudiants</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendDocument} className="space-y-4">
                    <div>
                      <Label htmlFor="doc_title">Titre du document</Label>
                      <Input
                        id="doc_title"
                        required
                        value={documentData.title}
                        onChange={(e) => setDocumentData({ ...documentData, title: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="doc_description">Description</Label>
                      <Textarea
                        id="doc_description"
                        required
                        value={documentData.description}
                        onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
                        className="border-teal-200 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipient_type">Destinataire</Label>
                      <Select
                        value={documentData.recipient_type}
                        onValueChange={(value) => setDocumentData({ ...documentData, recipient_type: value, recipient_id: '' })}
                        required
                      >
                        <SelectTrigger className="border-teal-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="student">Étudiant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {documentData.recipient_type === 'student' && (
                      <div>
                        <Label htmlFor="recipient_student">Étudiant</Label>
                        <Select
                          value={documentData.recipient_id}
                          onValueChange={(value) => setDocumentData({ ...documentData, recipient_id: value })}
                          required
                        >
                          <SelectTrigger className="border-teal-200">
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
                    )}
                    <div>
                      <Label htmlFor="file_url">Lien du document (URL)</Label>
                      <Input
                        id="file_url"
                        required
                        value={documentData.file_url}
                        onChange={(e) => setDocumentData({ ...documentData, file_url: e.target.value })}
                        placeholder="https://..."
                        className="border-teal-200 focus:border-teal-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Google Drive, Dropbox, etc.</p>
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Envoyer le document
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Documents envoyés</CardTitle>
                  <CardDescription>Vos documents partagés</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <p className="text-gray-500">Aucun document envoyé</p>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-4 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-teal-600 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-teal-800">{doc.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline mt-2 inline-block">
                                Ouvrir le document
                              </a>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                                  {doc.recipient_type === 'admin' ? 'Admin' : 'Étudiant'}
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
            </div>
          </TabsContent>

          <TabsContent value="timer">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Pointage de session</CardTitle>
                <CardDescription>Chronométrez vos cours et envoyez les données à l'admin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 space-y-8">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-full border-8 border-teal-100 flex items-center justify-center bg-gradient-to-br from-teal-50 to-white shadow-xl">
                      <div className="text-center">
                        <Clock className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                        <div className="text-5xl font-bold text-teal-600 font-mono">
                          {formatTime(elapsedTime)}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {isPaused ? 'En pause' : isTimerRunning ? 'En cours...' : 'Prêt'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {!isTimerRunning ? (
                      <Button
                        onClick={handleStartSession}
                        className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg"
                      >
                        <Play className="w-6 h-6 mr-2" />
                        Commencer le cours
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handlePauseSession}
                          className="bg-yellow-600 hover:bg-yellow-700 px-8 py-6 text-lg"
                        >
                          {isPaused ? (
                            <>
                              <Play className="w-6 h-6 mr-2" />
                              Reprendre
                            </>
                          ) : (
                            <>
                              <Pause className="w-6 h-6 mr-2" />
                              Pause
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleEndSession}
                          className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg"
                        >
                          <Square className="w-6 h-6 mr-2" />
                          Terminer
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="text-center max-w-md">
                    <p className="text-sm text-gray-600">
                      Les données de temps seront automatiquement envoyées à l'administrateur lorsque vous terminerez la session.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">Conversations</CardTitle>
                  <CardDescription>Admin et étudiants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {availableRecipients.map((recipient) => (
                      <button
                        key={recipient.id}
                        onClick={() => handleSelectRecipient(recipient)}
                        className={`w-full p-3 rounded-lg text-left transition ${
                          selectedRecipient?.id === recipient.id
                            ? 'bg-teal-100 border-2 border-teal-600'
                            : 'bg-gray-50 hover:bg-teal-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                            {recipient.first_name?.charAt(0)}{recipient.last_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{recipient.first_name} {recipient.last_name}</p>
                            <p className="text-xs text-gray-500">{recipient.role === 'admin' ? 'Administrateur' : 'Étudiant'}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-800">
                    {selectedRecipient ? `${selectedRecipient.first_name} ${selectedRecipient.last_name}` : 'Sélectionnez une conversation'}
                  </CardTitle>
                  <CardDescription>
                    {selectedRecipient ? (selectedRecipient.role === 'admin' ? 'Administrateur' : 'Étudiant') : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedRecipient ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Sélectionnez un contact pour commencer la conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-teal-100 rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-3 bg-gray-50">
                        {messages.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">Aucun message</p>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.from_user_id === user.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  msg.from_user_id === user.id
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white border border-teal-100'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {new Date(msg.created_at).toLocaleString('fr-FR')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Écrivez votre message..."
                          className="flex-1 border-teal-200 focus:border-teal-500"
                        />
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
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

export default TeacherDashboard;
