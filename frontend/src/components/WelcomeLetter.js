import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import apiClient from '../utils/api';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

const WelcomeLetter = () => {
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLetter();
  }, []);

  const loadLetter = async () => {
    try {
      const res = await apiClient.get('/welcome-letter');
      setLetter(res.data);
    } catch (error) {
      console.error('Error loading welcome letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await apiClient.put('/welcome-letter/mark-read');
      setLetter({ ...letter, is_read: true });
      toast.success('Lettre marquée comme lue');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  // If no letter or already read, don't display anything
  if (!letter || letter.is_read) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!letter.is_read && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-teal-600" />
            <span className="text-teal-800 font-semibold">Nouvelle lettre de bienvenue</span>
          </div>
          <Button
            size="sm"
            onClick={markAsRead}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Marquer comme lu
          </Button>
        </div>
      )}

      <Card className="border-teal-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-white border-b border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-teal-800">
                Lettre de Bienvenue
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Reçue le {new Date(letter.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div 
              className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-800"
              style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.8' }}
            >
              {letter.content}
            </div>
          </div>
          
          {!letter.is_read && (
            <div className="mt-6 text-center">
              <Button
                onClick={markAsRead}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Check className="w-4 h-4 mr-2" />
                J'ai lu cette lettre
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeLetter;
