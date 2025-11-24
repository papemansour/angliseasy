import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import apiClient from '../utils/api';
import { Trash2, Plus, Play, Video } from 'lucide-react';

const TeacherVideos = ({ students }) => {
  const [videos, setVideos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    video_url: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await apiClient.get('/teacher/my-assigned-videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/teacher/assign-video', formData);
      toast.success('Vidéo assignée à l\'enfant ! 🎬');
      setFormData({ student_id: '', title: '', description: '', video_url: '' });
      setShowDialog(false);
      fetchVideos();
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Supprimer cette vidéo ?')) return;
    try {
      await apiClient.delete(`/teacher/delete-video/${videoId}`);
      toast.success('Vidéo supprimée');
      fetchVideos();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filter only K-Kid students
  const kkidStudents = students.filter(s => s.level === 'kkid');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-pink-500" />
            Vidéos pour les enfants (K-Kid)
          </CardTitle>
          <CardDescription>
            Assignez des vidéos éducatives et amusantes à vos jeunes élèves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowDialog(true)} className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            Assigner une vidéo
          </Button>

          {kkidStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun étudiant K-Kid assigné</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune vidéo assignée pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center p-4 border-2 border-pink-200 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 hover:shadow-lg transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Play className="w-4 h-4 text-pink-500" />
                      <span className="font-semibold text-lg">{video.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{video.description}</p>
                    <p className="text-xs text-purple-600 font-semibold">
                      Pour : {video.student_name}
                    </p>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      {video.video_url}
                    </a>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(video.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Video Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner une vidéo à un enfant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Enfant (K-Kid) *</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enfant" />
                </SelectTrigger>
                <SelectContent>
                  {kkidStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Titre de la vidéo *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Ex: Les couleurs en anglais"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la vidéo..."
                rows={3}
              />
            </div>

            <div>
              <Label>Lien de la vidéo (YouTube) *</Label>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                required
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Astuce : Les vidéos YouTube fonctionnent le mieux !
              </p>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
              Assigner la vidéo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherVideos;
