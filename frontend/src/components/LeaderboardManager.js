import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Trophy, Crown, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../utils/api';

const LeaderboardManager = ({ onClose, onUpdate }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRank, setSelectedRank] = useState(1);
  const [studentOfMonth, setStudentOfMonth] = useState(null);
  const [badgeDuration, setBadgeDuration] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all users
      const usersRes = await apiClient.get('/admin/all-users');
      const filteredUsers = usersRes.data.filter(u => u.role === 'teacher' || u.role === 'student');
      setAllUsers(filteredUsers);

      // Load current leaderboard
      const leaderboardRes = await apiClient.get('/club/leaderboard');
      setLeaderboard(leaderboardRes.data);

      // Load student of month
      const somRes = await apiClient.get('/club/student-of-month');
      setStudentOfMonth(somRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddToLeaderboard = async () => {
    if (!selectedUser || !selectedRank) {
      toast.error('Sélectionnez un utilisateur et un rang');
      return;
    }

    try {
      await apiClient.post(`/club/leaderboard?user_id=${selectedUser.id}&rank=${selectedRank}`);
      toast.success(`${selectedUser.first_name} ajouté au rang ${selectedRank}`);
      loadData();
      setSelectedUser(null);
      onUpdate && onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleRemove = async (userId) => {
    try {
      await apiClient.delete(`/club/leaderboard/${userId}`);
      toast.success('Retiré du classement');
      loadData();
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleSetStudentOfMonth = async () => {
    const firstPlace = leaderboard.find(l => l.rank === 1);
    if (!firstPlace) {
      toast.error('Aucun étudiant en 1ère place');
      return;
    }

    try {
      await apiClient.post(`/club/student-of-month?user_id=${firstPlace.user_id}&duration_days=${badgeDuration}`);
      toast.success(`🏅 ${firstPlace.user_name} est maintenant Étudiant du Mois pour ${badgeDuration} jours !`);
      loadData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const availableRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(
    rank => !leaderboard.find(l => l.rank === rank)
  );

  const availableUsers = allUsers.filter(
    user => !leaderboard.find(l => l.user_id === user.id)
  );

  return (
    <div className="space-y-6">
      {/* Student of the Month Section */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-400">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-600 animate-pulse" />
            <h3 className="text-lg font-bold text-yellow-900">Badge Étudiant du Mois</h3>
          </div>

          {studentOfMonth ? (
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">{studentOfMonth.user_name}</p>
                  <Badge className="bg-yellow-500">Actif</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Expire le {new Date(studentOfMonth.expires_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-4">Aucun badge actif</p>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="badge-duration">Durée du badge (jours)</Label>
              <Input
                id="badge-duration"
                type="number"
                value={badgeDuration}
                onChange={(e) => setBadgeDuration(parseInt(e.target.value))}
                min="1"
                max="365"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSetStudentOfMonth}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={!leaderboard.find(l => l.rank === 1)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Attribuer badge à la 1ère place
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Leaderboard */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-teal-600" />
          Classement Actuel
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aucun membre classé</p>
          ) : (
            leaderboard.sort((a, b) => a.rank - b.rank).map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  member.rank === 1 ? 'bg-yellow-100 border-2 border-yellow-400' :
                  member.rank === 2 ? 'bg-gray-100 border-2 border-gray-400' :
                  member.rank === 3 ? 'bg-orange-100 border-2 border-orange-400' :
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    member.rank === 1 ? 'bg-yellow-500 text-white' :
                    member.rank === 2 ? 'bg-gray-400 text-white' :
                    member.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : member.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{member.user_name}</p>
                    <p className="text-xs text-gray-600">
                      {member.user_role === 'teacher' ? 'Professeur' : 'Étudiant'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleRemove(member.user_id)}
                >
                  Retirer
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add to Leaderboard */}
      <div>
        <h3 className="text-lg font-bold mb-3">Ajouter au Classement</h3>
        <div className="space-y-3">
          <div>
            <Label>Sélectionner un membre</Label>
            <select
              className="w-full mt-1 p-2 border rounded-lg"
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const user = availableUsers.find(u => u.id === e.target.value);
                setSelectedUser(user);
              }}
            >
              <option value="">-- Choisir --</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.role === 'teacher' ? 'Prof' : 'Étudiant'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Rang (1-10)</Label>
            <select
              className="w-full mt-1 p-2 border rounded-lg"
              value={selectedRank}
              onChange={(e) => setSelectedRank(parseInt(e.target.value))}
            >
              {availableRanks.map((rank) => (
                <option key={rank} value={rank}>
                  {rank === 1 ? '🥇 1ère place' :
                   rank === 2 ? '🥈 2ème place' :
                   rank === 3 ? '🥉 3ème place' :
                   `${rank}ème place`}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleAddToLeaderboard}
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={!selectedUser || availableRanks.length === 0}
          >
            <Star className="w-4 h-4 mr-2" />
            Ajouter au rang {selectedRank}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardManager;
