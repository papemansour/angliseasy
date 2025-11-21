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
import { LogOut, Users, BookOpen, Calendar, MessageCircle, Send } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    level: '',
    schedule: ''
  });
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, studentsRes, coursesRes, attendanceRes, conversationsRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/teacher/my-students'),
        apiClient.get('/teacher/my-courses'),
        apiClient.get('/teacher/attendance'),
        apiClient.get('/messages/my-conversations')
      ]);
      
      setUser(userRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setAttendance(attendanceRes.data);
      setConversations(conversationsRes.data.filter(u => u.role === 'admin'));
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/create-course', courseData);
      toast.success('Cours créé avec succès!');
      setCourseData({ title: '', description: '', level: '', schedule: '' });
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la création du cours');
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/attendance', attendanceData);
      toast.success('Pointage enregistré!');
      setAttendanceData({ date: new Date().toISOString().split('T')[0], status: '' });
      fetchData();
    } catch (error) {
      toast.error('Erreur lors du pointage');
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
            <Button variant="outline" onClick={handleLogout} data-testid="teacher-logout-button">
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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes étudiants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes cours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pointages</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students" data-testid="teacher-tab-students">Étudiants</TabsTrigger>
            <TabsTrigger value="courses" data-testid="teacher-tab-courses">Cours</TabsTrigger>
            <TabsTrigger value="attendance" data-testid="teacher-tab-attendance">Pointage</TabsTrigger>
            <TabsTrigger value="messages" data-testid="teacher-tab-messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Liste de mes étudiants</CardTitle>
                <CardDescription>Étudiants que vous encadrez</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-gray-500">Aucun étudiant assigné</p>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{student.first_name} {student.last_name}</h3>
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
              <Card>
                <CardHeader>
                  <CardTitle>Créer un cours</CardTitle>
                  <CardDescription>Ajoutez un nouveau cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        data-testid="teacher-course-title"
                        required
                        value={courseData.title}
                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        data-testid="teacher-course-description"
                        required
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Niveau</Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) => setCourseData({ ...courseData, level: value })}
                        required
                      >
                        <SelectTrigger data-testid="teacher-course-level">
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
                      <Label htmlFor="schedule">Horaire</Label>
                      <Input
                        id="schedule"
                        data-testid="teacher-course-schedule"
                        required
                        value={courseData.schedule}
                        onChange={(e) => setCourseData({ ...courseData, schedule: e.target.value })}
                        placeholder="Ex: Lundi 18h-20h"
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="teacher-create-course-button">
                      Créer le cours
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mes cours</CardTitle>
                  <CardDescription>Liste de vos cours</CardDescription>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <p className="text-gray-500">Aucun cours créé</p>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
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

          <TabsContent value="attendance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enregistrer pointage</CardTitle>
                  <CardDescription>Marquez votre présence</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMarkAttendance} className="space-y-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        data-testid="teacher-attendance-date"
                        required
                        value={attendanceData.date}
                        onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select
                        value={attendanceData.status}
                        onValueChange={(value) => setAttendanceData({ ...attendanceData, status: value })}
                        required
                      >
                        <SelectTrigger data-testid="teacher-attendance-status">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Présent</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">En retard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" data-testid="teacher-mark-attendance-button">
                      Enregistrer
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique de pointage</CardTitle>
                  <CardDescription>Vos derniers pointages</CardDescription>
                </CardHeader>
                <CardContent>
                  {attendance.length === 0 ? (
                    <p className="text-gray-500">Aucun pointage enregistré</p>
                  ) : (
                    <div className="space-y-4">
                      {attendance.slice(0, 10).map((record) => (
                        <div key={record.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{new Date(record.date).toLocaleDateString('fr-FR')}</p>
                            <p className="text-sm text-gray-600 capitalize">{record.status}</p>
                          </div>
                          <div className={`px-3 py-1 rounded text-sm ${
                            record.status === 'present' ? 'bg-green-100 text-green-700' :
                            record.status === 'absent' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {record.status === 'present' ? 'Présent' : record.status === 'absent' ? 'Absent' : 'En retard'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Discussion avec l'administrateur</CardTitle>
                <CardDescription>Communiquez avec l'équipe administrative</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Système de messagerie disponible bientôt</p>
                  <p className="text-sm text-gray-400">Contactez l'admin via email: info.kalamaenglish@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
