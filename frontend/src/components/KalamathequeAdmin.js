import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { BookOpen, Trash2, Upload } from 'lucide-react';

const KalamathequeAdmin = () => {
  const [books, setBooks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    level: 'beginner',
    file_url: '',
    file_type: 'pdf',
    cover_image: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await apiClient.get('/kalamatheque/books');
      setBooks(res.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 50MB)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    toast.info(`Upload de ${file.name} en cours...`);
    
    try {
      const res = await apiClient.post('/uploadfile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNewBook(prev => ({ ...prev, [fieldName]: res.data.file_url }));
      toast.success(`✅ ${file.name} uploadé avec succès!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Erreur d'upload: ${error.response?.data?.detail || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!newBook.title || !newBook.file_url) {
      toast.error('Titre et fichier requis');
      return;
    }

    try {
      await apiClient.post('/kalamatheque/books', newBook);
      toast.success('Livre ajouté!');
      setNewBook({
        title: '',
        author: '',
        description: '',
        level: 'beginner',
        file_url: '',
        file_type: 'pdf',
        cover_image: ''
      });
      fetchBooks();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      await apiClient.delete(`/kalamatheque/books/${bookId}`);
      toast.success('Livre supprimé');
      fetchBooks();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Book Form */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle>📚 Ajouter un livre à Kalamathèque</CardTitle>
          <CardDescription>Uploadez des livres au format PDF, EPUB, TXT, HTML, ou DOCX</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Titre du livre *</Label>
                <Input
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  placeholder="Ex: Introduction to English Grammar"
                  required
                />
              </div>
              <div>
                <Label>Auteur</Label>
                <Input
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  placeholder="Ex: John Smith"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newBook.description}
                onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                placeholder="Décrivez le contenu du livre..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Niveau</Label>
                <Select value={newBook.level} onValueChange={(val) => setNewBook({...newBook, level: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (Débutant)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Intermédiaire)</SelectItem>
                    <SelectItem value="advanced">Packs professionnels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type de fichier</Label>
                <Select value={newBook.file_type} onValueChange={(val) => setNewBook({...newBook, file_type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="epub">EPUB</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Fichier du livre *</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'file_url')}
                    accept=".pdf,.epub,.txt,.html,.docx,.doc"
                    disabled={uploading}
                  />
                </div>
                {newBook.file_url && (
                  <p className="text-xs text-green-600 mt-1">✓ Fichier uploadé</p>
                )}
              </div>
              <div>
                <Label>Image de couverture (optionnel)</Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'cover_image')}
                  accept="image/*"
                  disabled={uploading}
                />
                {newBook.cover_image && (
                  <p className="text-xs text-green-600 mt-1">✓ Image uploadée</p>
                )}
              </div>
            </div>

            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Upload en cours...' : 'Ajouter le livre'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Books List */}
      <Card>
        <CardHeader>
          <CardTitle>📖 Livres disponibles ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun livre ajouté</p>
          ) : (
            <div className="space-y-3">
              {books.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {book.cover_image && (
                      <img src={book.cover_image} alt={book.title} className="w-16 h-20 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      {book.author && <p className="text-sm text-gray-600">Par {book.author}</p>}
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">
                          {book.level}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded uppercase">
                          {book.file_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteBook(book.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KalamathequeAdmin;