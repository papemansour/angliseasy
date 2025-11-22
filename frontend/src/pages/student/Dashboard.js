import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import apiClient from '../../utils/api';
import { Calendar, Bell, CreditCard, Award, TrendingUp, Clock, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRes = await apiClient.get('/auth/me');
      setUser(userRes.data);
      // TODO: Fetch upcoming courses, notifications, payments
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateDaysUntilPayment = () => {
    if (!user?.next_payment_date) return null;
    const nextPayment = new Date(user.next_payment_date);
    const today = new Date();
    const diffTime = nextPayment - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const daysUntilPayment = calculateDaysUntilPayment();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour, {user?.first_name} !</h1>
        <p className="text-gray-600">Voici un aperçu de votre parcours d'apprentissage</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau Actuel</CardTitle>
            <Award className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600 capitalize">
              {user?.level === 'beginner' ? 'Débutant' : user?.level === 'intermediate' ? 'Intermédiaire' : 'Pack professionnel'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.progress_percentage || 0}%</div>
            <Progress value={user?.progress_percentage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Complétées</CardTitle>
            <Clock className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.hours_completed || 0}h</div>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnement</CardTitle>
            <CreditCard className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">
              {user?.subscription_status === 'active' ? 'Actif' : 'Inactif'}
            </div>
            {daysUntilPayment && (
              <p className="text-xs text-gray-500 mt-1">
                Prochain paiement dans {daysUntilPayment} jour{daysUntilPayment > 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Prochains Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun cours prévu</p>
                <Button 
                  className="mt-4 bg-teal-600 hover:bg-teal-700"
                  onClick={() => navigate('/student/book-course')}
                >
                  Réserver un cours
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingCourses.map((course, index) => (
                  <div key={index} className="p-3 border border-teal-100 rounded-lg hover:bg-teal-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.date} à {course.time}</p>
                      </div>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              Notifications Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="p-3 border-l-4 border-teal-500 bg-teal-50 rounded">
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              Paiements Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun paiement récent</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Montant</th>
                      <th className="text-left p-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">{payment.date}</td>
                        <td className="p-2">{payment.description}</td>
                        <td className="p-2 font-semibold">{payment.amount}€</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status === 'completed' ? 'Payé' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
