import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import apiClient from '../utils/api';
import { BookOpen, Download, FileText, Lock, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';

const Kalamatheque = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour accéder à la KALAMATHÈQUE');
        navigate('/login');
        return;
      }

      const response = await apiClient.get('/auth/me');
      const userData = response.data;
      
      if (!userData.is_active) {
        toast.error('Votre compte doit être validé par un administrateur pour accéder à la KALAMATHÈQUE');
        navigate('/');
        return;
      }

      setUser(userData);
      fetchBooks();
    } catch (error) {
      toast.error('Erreur de vérification d\'accès');
      navigate('/login');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get('/library/books');
      setBooks(response.data);
      setFilteredBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedLevel, books]);

  const filterBooks = () => {
    let filtered = books;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(book => book.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleDownload = (book) => {
    toast.success(`Téléchargement de "${book.title}" en cours...`);
    // TODO: Implement actual download
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-900">KALAMATHÈQUE</h1>
          <Link to={user?.role === 'student' ? '/student' : user?.role === 'teacher' ? '/teacher' : '/admin'}>
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Bibliothèque Numérique</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Accédez à notre collection complète de ressources pédagogiques adaptées à votre niveau
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un livre ou un auteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-teal-200 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Tabs by Level */}
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" data-testid="library-tab-all">Tous</TabsTrigger>
            <TabsTrigger value="beginner" data-testid="library-tab-beginner">Débutant</TabsTrigger>
            <TabsTrigger value="intermediate" data-testid="library-tab-intermediate">Intermédiaire</TabsTrigger>
            <TabsTrigger value="advanced" data-testid="library-tab-advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedLevel} className="mt-6">
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun livre disponible pour ce niveau</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-xl transition-all border-teal-100">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                          <p className="text-sm text-gray-600">Par {book.author}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          book.level === 'beginner' ? 'bg-blue-100 text-blue-700' :
                          book.level === 'intermediate' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {book.level === 'beginner' ? 'Débutant' : 
                           book.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{book.pages} pages</span>
                        <Button
                          onClick={() => handleDownload(book)}
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                          data-testid={`download-book-${book.id}`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Access Info */}
        <Card className="mt-12 border-teal-200 bg-teal-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-teal-900 mb-2">Accès Réservé aux Membres</h3>
                <p className="text-teal-800">
                  La KALAMATHÈQUE est accessible uniquement aux étudiants dont le compte a été validé par un administrateur.
                  Tous les documents sont protégés et réservés à un usage personnel dans le cadre de votre apprentissage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Kalamatheque;
