import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Plus, Edit, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const NewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    event_date: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await apiClient.get('/news');
      setNewsList(res.data);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Titre et contenu requis');
      return;
    }

    try {
      if (editingNews) {
        await apiClient.put(`/news/${editingNews.id}`, formData);
        toast.success('Actualité mise à jour');
      } else {
        await apiClient.post('/news', formData);
        toast.success('Actualité créée');
      }
      
      setShowDialog(false);
      setFormData({ title: '', content: '', image_url: '', event_date: '' });
      setEditingNews(null);
      loadNews();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      image_url: news.image_url || '',
      event_date: news.event_date ? news.event_date.split('T')[0] : ''
    });
    setShowDialog(true);
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Supprimer cette actualité ?')) return;

    try {
      await apiClient.delete(`/news/${newsId}`);
      toast.success('Actualité supprimée');
      loadNews();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-teal-800">Gestion des actualités</h2>
          <p className="text-gray-600">Publiez des articles et planifiez des événements</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingNews(null);
                setFormData({ title: '', content: '', image_url: '', event_date: '' });
              }}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle actualité
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Modifier l\'actualité' : 'Nouvelle actualité'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Titre *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de l'actualité"
                  required
                />
              </div>

              <div>
                <Label>Contenu *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu de l'actualité"
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label>URL de l'image (optionnel)</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div>
                <Label>Date de l'événement (optionnel)</Label>
                <Input
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  type="date"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                  {editingNews ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* News List */}
      {newsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Aucune actualité publiée
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {newsList.map((news) => (
            <Card key={news.id} className="hover:shadow-lg transition-shadow">
              {news.image_url && (
                <img 
                  src={news.image_url} 
                  alt={news.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-teal-800">{news.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(news.published_date).toLocaleDateString('fr-FR')}
                      {news.event_date && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          Événement: {new Date(news.event_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(news)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(news.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{news.content}</p>
                <p className="text-xs text-gray-500 mt-2">Par {news.author_name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsManager;
