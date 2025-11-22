import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { 
  LogOut, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  GraduationCap, 
  DollarSign, 
  UserX, 
  MessageSquare, 
  ClipboardList, 
  Gamepad2, 
  Library, 
  Download, 
  Upload, 
  HelpCircle, 
  Trash2, 
  Settings,
  Bell,
  Home,
  Search,
  Lock,
  Unlock,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
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
} from '../components/ui/dialog';

const NewAdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestrictDialog, setShowRestrictDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, usersRes, pendingRes] = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/admin/all-users'),
        apiClient.get('/admin/pending-registrations')
      ]);
      
      setUser(userRes.data);
      setAllUsers(usersRes.data);
      setPendingCount(pendingRes.data.length);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  const handleDeleteStudent = async () => {
    try {
      await apiClient.delete(`/admin/delete-student/${selectedStudent.id}`);
      toast.success('Étudiant supprimé avec succès');
      setShowDeleteDialog(false);
      setSelectedStudent(null);
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRestrictStudent = async () => {
    try {
      await apiClient.post(`/admin/restrict-student/${selectedStudent.id}`);
      toast.success(`Accès ${selectedStudent.is_restricted ? 'rétabli' : 'restreint'} avec succès`);
      setShowRestrictDialog(false);
      setSelectedStudent(null);
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la restriction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const students = allUsers.filter(u => u.role === 'student' && u.is_active);
  const restrictedStudents = students.filter(s => s.is_restricted);
  const activeStudents = students.filter(s => !s.is_restricted);

  const filteredStudents = students
    .filter(s => selectedLevel === 'all' || s.level === selectedLevel)
    .filter(s => 
      searchQuery === '' || 
      s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const studentsByLevel = {
    beginner: filteredStudents.filter(s => s.level === 'beginner'),
    intermediate: filteredStudents.filter(s => s.level === 'intermediate'),
    advanced: filteredStudents.filter(s => s.level === 'advanced')
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'students' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Étudiants</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'crm' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'teachers' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Enseignants</span>
          </button>

          <button
            onClick={() => setActiveTab('planning')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'planning' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Planning</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'documents' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'courses' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Cours</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'pricing' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Prix</span>
          </button>

          <button
            onClick={() => setActiveTab('absences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'absences' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserX className="w-5 h-5" />
            <span>Absences</span>
          </button>

          <button
            onClick={() => setActiveTab('conversations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'conversations' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Conversations</span>
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'homework' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Devoirs</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'games' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Games</span>
          </button>

          <button
            onClick={() => setActiveTab('encolib')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'encolib' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>ENCOLIB</span>
          </button>

          <button
            onClick={() => setActiveTab('import-export')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'import-export' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>Import/Export</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'guide' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('trash')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'trash' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <span>Corbeille</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'settings' 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-teal-600 transition" />
              <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-teal-600 transition" />
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des étudiants</h1>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold">
                    {students.length}/10 étudiants
                  </span>
                  {pendingCount > 0 && (
                    <span className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {pendingCount} notifications en attente
                    </span>
                  )}
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="border-none shadow-md hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">{students.length}</div>
                        <div className="text-sm text-gray-600">Total étudiants</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Unlock className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">{activeStudents.length}</div>
                        <div className="text-sm text-gray-600">Étudiants actifs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Lock className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">{restrictedStudents.length}</div>
                        <div className="text-sm text-gray-600">Accès restreints</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <GraduationCap className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">0</div>
                        <div className="text-sm text-gray-600">Ont déjà accédé</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6 border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Filtres et options</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Niveau</label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les niveaux</SelectItem>
                          <SelectItem value="beginner">Débutant</SelectItem>
                          <SelectItem value="intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Recherche</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Nom, email ou code étudiant..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Affichage</label>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Afficher codes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List by Level */}
              <div className="space-y-8">
                {/* Débutant */}
                {studentsByLevel.beginner.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Niveau DÉBUTANT</h2>
                      <span className="text-teal-600 font-semibold">{studentsByLevel.beginner.length} étudiants</span>
                    </div>
                    <div className="grid gap-4">
                      {studentsByLevel.beginner.map((student) => (
                        <Card key={student.id} className="border-none shadow-md hover:shadow-lg transition">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${getAvatarColor(student.first_name)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                  {getInitials(student.first_name, student.last_name)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {student.first_name} {student.last_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">Inscrit le {new Date(student.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div>
                                  <div className="text-sm text-gray-600">Email</div>
                                  <div className="font-medium">{student.email}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Téléphone</div>
                                  <div className="font-medium">{student.phone || 'N/A'}</div>
                                </div>
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    student.is_restricted 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {student.is_restricted ? 'Restreint' : 'Actif'}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    Cours
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className={student.is_restricted ? 'text-green-600 border-green-600 hover:bg-green-50' : 'text-orange-600 border-orange-600 hover:bg-orange-50'}
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowRestrictDialog(true);
                                    }}
                                  >
                                    {student.is_restricted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intermédiaire */}
                {studentsByLevel.intermediate.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Niveau INTERMÉDIAIRE</h2>
                      <span className="text-teal-600 font-semibold">{studentsByLevel.intermediate.length} étudiants</span>
                    </div>
                    <div className="grid gap-4">
                      {studentsByLevel.intermediate.map((student) => (
                        <Card key={student.id} className="border-none shadow-md hover:shadow-lg transition">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${getAvatarColor(student.first_name)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                  {getInitials(student.first_name, student.last_name)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {student.first_name} {student.last_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">Inscrit le {new Date(student.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div>
                                  <div className="text-sm text-gray-600">Email</div>
                                  <div className="font-medium">{student.email}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Téléphone</div>
                                  <div className="font-medium">{student.phone || 'N/A'}</div>
                                </div>
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    student.is_restricted 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {student.is_restricted ? 'Restreint' : 'Actif'}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    Cours
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className={student.is_restricted ? 'text-green-600 border-green-600 hover:bg-green-50' : 'text-orange-600 border-orange-600 hover:bg-orange-50'}
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowRestrictDialog(true);
                                    }}
                                  >
                                    {student.is_restricted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avancé */}
                {studentsByLevel.advanced.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">Niveau AVANCÉ</h2>
                      <span className="text-teal-600 font-semibold">{studentsByLevel.advanced.length} étudiants</span>
                    </div>
                    <div className="grid gap-4">
                      {studentsByLevel.advanced.map((student) => (
                        <Card key={student.id} className="border-none shadow-md hover:shadow-lg transition">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${getAvatarColor(student.first_name)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                  {getInitials(student.first_name, student.last_name)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">
                                    {student.first_name} {student.last_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">Inscrit le {new Date(student.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div>
                                  <div className="text-sm text-gray-600">Email</div>
                                  <div className="font-medium">{student.email}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Téléphone</div>
                                  <div className="font-medium">{student.phone || 'N/A'}</div>
                                </div>
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    student.is_restricted 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {student.is_restricted ? 'Restreint' : 'Actif'}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    Cours
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className={student.is_restricted ? 'text-green-600 border-green-600 hover:bg-green-50' : 'text-orange-600 border-orange-600 hover:bg-orange-50'}
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowRestrictDialog(true);
                                    }}
                                  >
                                    {student.is_restricted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {filteredStudents.length === 0 && (
                  <Card className="border-none shadow-md">
                    <CardContent className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun étudiant trouvé</h3>
                      <p className="text-gray-600">Modifiez vos filtres ou recherchez un autre étudiant</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'students' && (
            <Card className="border-none shadow-md">
              <CardContent className="p-12 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Section en développement</h3>
                <p className="text-gray-600 mb-6">Cette fonctionnalité sera bientôt disponible</p>
                <Button 
                  onClick={() => setActiveTab('students')}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Retour aux étudiants
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'étudiant <strong>{selectedStudent?.first_name} {selectedStudent?.last_name}</strong> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleDeleteStudent}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restrict Dialog */}
      <Dialog open={showRestrictDialog} onOpenChange={setShowRestrictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.is_restricted ? 'Rétablir l\'accès' : 'Restreindre l\'accès'}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent?.is_restricted 
                ? `Êtes-vous sûr de vouloir rétablir l'accès de ${selectedStudent?.first_name} ${selectedStudent?.last_name} ?`
                : `Êtes-vous sûr de vouloir restreindre l'accès de ${selectedStudent?.first_name} ${selectedStudent?.last_name} ?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowRestrictDialog(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleRestrictStudent}
              className={`flex-1 ${selectedStudent?.is_restricted ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              {selectedStudent?.is_restricted ? 'Rétablir' : 'Restreindre'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewAdminDashboard;
