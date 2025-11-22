import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import apiClient from '../utils/api';
import { Calendar, Newspaper, BookOpen, ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const NewsDisplay = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await apiClient.get('/news');
      setNewsList(res.data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (newsId) => {
    try {
      await apiClient.post(`/news/${newsId}/like`);
      toast.success('👍 Vous avez aimé cette actualité !');
      loadNews();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const loadComments = async (newsId) => {
    try {
      const res = await apiClient.get(`/news/${newsId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await apiClient.post(`/news/${selectedNews.id}/comments`, { content: newComment });
      setNewComment('');
      loadComments(selectedNews.id);
      toast.success('Commentaire ajouté !');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const openNewsDetail = (news) => {
    setSelectedNews(news);
    setShowDialog(true);
    loadComments(news.id);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Newspaper className="w-8 h-8 text-teal-600" />
        <div>
          <h2 className="text-2xl font-bold text-teal-800">Actualités & Événements</h2>
          <p className="text-gray-600">Restez informé des dernières nouvelles</p>
        </div>
      </div>

      {newsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune actualité pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {newsList.map((news) => (
            <Card key={news.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openNewsDetail(news)}>
              {news.image_url && (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{news.title}</CardTitle>
                  {news.category && (
                    <Badge className="bg-teal-500">{news.category}</Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(news.published_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{news.content}</p>
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(news.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{news.likes || 0}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{news.comments || 0}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* News Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedNews?.title}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {selectedNews && new Date(selectedNews.published_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </DialogHeader>

          {selectedNews?.image_url && (
            <img
              src={selectedNews.image_url}
              alt={selectedNews.title}
              className="w-full rounded-lg mb-4"
            />
          )}

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{selectedNews?.content}</p>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-b">
            <Button
              size="sm"
              onClick={() => handleLike(selectedNews?.id)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
            >
              <ThumbsUp className="w-4 h-4" />
              J'aime ({selectedNews?.likes || 0})
            </Button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} commentaire(s)</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Commentaires</h4>
            
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucun commentaire. Soyez le premier !</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.author_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.author_role === 'teacher' ? 'Prof' : comment.author_role === 'admin' ? 'Admin' : 'Étudiant'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} className="flex gap-2 mt-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsDisplay;
