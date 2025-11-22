import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import apiClient from '../utils/api';
import { Calendar, Newspaper, BookOpen } from 'lucide-react';
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
            Aucune actualité pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <Card 
              key={news.id} 
              className="hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {news.image_url && (
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={news.image_url} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {news.event_date && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Événement
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="bg-gradient-to-r from-teal-50 to-white">
                <CardTitle className="text-teal-800 line-clamp-2">{news.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(news.published_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 line-clamp-4">{news.content}</p>
                {news.event_date && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800 font-semibold">
                      📅 Date de l'événement :
                    </p>
                    <p className="text-sm text-orange-700">
                      {new Date(news.event_date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-4 italic">
                  Publié par {news.author_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsDisplay;
