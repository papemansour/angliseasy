import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { toast } from 'sonner';
import axios from 'axios';
import { ChevronRight, Users, BookOpen, Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Testimonials from '../components/Testimonials';
import HowItWorks from '../components/HowItWorks';
import Kalamathèque from '../components/Kalamathèque';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const HomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    level: '',
    preferred_slots: '',
    referral_source: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (selectedDates.find(d => d === dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
      const newSlots = { ...selectedTimeSlots };
      delete newSlots[dateStr];
      setSelectedTimeSlots(newSlots);
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleTimeSlotSelect = (dateStr, time) => {
    const currentSlots = selectedTimeSlots[dateStr] || [];
    if (currentSlots.includes(time)) {
      setSelectedTimeSlots({
        ...selectedTimeSlots,
        [dateStr]: currentSlots.filter(t => t !== time)
      });
    } else {
      setSelectedTimeSlots({
        ...selectedTimeSlots,
        [dateStr]: [...currentSlots, time]
      });
    }
  };

  const formatPreferredSlots = () => {
    const slots = [];
    Object.keys(selectedTimeSlots).forEach(dateStr => {
      const times = selectedTimeSlots[dateStr];
      if (times && times.length > 0) {
        const date = new Date(dateStr);
        const dayName = format(date, 'EEEE', { locale: fr });
        slots.push(`${dayName} ${times.join(', ')}`);
      }
    });
    return slots.join(' | ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.level) {
      toast.error('Veuillez sélectionner votre niveau');
      return;
    }

    setLoading(true);

    try {
      const preferredSlots = formatPreferredSlots();
      await axios.post(`${API}/auth/register`, {
        ...formData,
        preferred_slots: preferredSlots || formData.preferred_slots
      });
      toast.success('Inscription envoyée avec succès! Attendez l\'approbation de l\'administrateur.');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        level: '',
        preferred_slots: '',
        referral_source: ''
      });
      setSelectedDates([]);
      setSelectedTimeSlots({});
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">KALAMAENGLISH</h1>
          <Link to="/login">
            <Button variant="outline" data-testid="login-nav-button" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              Connexion
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Maîtrisez votre anglais"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">95%</div>
                <p className="text-gray-200 text-sm">Taux de réussite</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">+200</div>
                <p className="text-gray-200 text-sm">Heures de cours</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">24/7</div>
                <p className="text-gray-200 text-sm">Accès aux cours</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Apprenez l'anglais facilement avec des méthodes innovantes
            </h1>
            <p className="text-base lg:text-lg text-gray-200 mb-8 leading-relaxed">
              My KALAMA ENGLISH rend l'apprentissage de l'anglais accessible à tous ! Que vous soyez étudiant, professionnel, ou simplement désireux d'apprendre, nos cours sont conçus pour une progression rapide et efficace.
            </p>
            <button 
              onClick={() => document.getElementById('register').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition duration-300"
            >
              Commencer à apprendre
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-teal-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 bg-white rounded-lg inline-block mb-4">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-800">Apprentissage personnalisé</h3>
              <p className="text-gray-700">Des cours adaptés à votre niveau et à vos objectifs spécifiques</p>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 bg-white rounded-lg inline-block mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-800">Professeurs qualifiés</h3>
              <p className="text-gray-700">Une équipe d'experts passionnés par l'enseignement de l'anglais</p>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 bg-white rounded-lg inline-block mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-800">Flexibilité totale</h3>
              <p className="text-gray-700">Apprenez à votre rythme avec des horaires adaptés à votre emploi du temps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Tarifs & Niveaux</h2>
          <p className="text-center text-xl text-red-600 font-semibold mb-12">
            🎄 Promo Noël & Nouvel An - Valable jusqu'au 14 janvier 2025
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-2xl border-2 border-teal-200 bg-white/60 backdrop-blur-lg hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6">
                <h3 className="text-2xl font-bold text-teal-800">Pack Débutant</h3>
                <p className="text-teal-600">Parfait pour commencer</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">80€</div>
                  <div className="text-5xl font-bold text-teal-600">76€</div>
                  <div className="text-green-600 font-semibold">-5% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Cours adaptés débutants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Support pédagogique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Accès bibliothèque</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-teal-300 bg-white/60 backdrop-blur-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="absolute top-4 right-4">
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Populaire</span>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-6">
                <h3 className="text-2xl font-bold text-teal-800">Pack Intermédiaire</h3>
                <p className="text-teal-700">Le plus choisi</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">100€</div>
                  <div className="text-5xl font-bold text-teal-600">90€</div>
                  <div className="text-green-600 font-semibold">-10% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Cours intermédiaires</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Pratique conversationnelle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Exercices avancés</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-teal-200 bg-white/60 backdrop-blur-lg hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6">
                <h3 className="text-2xl font-bold text-teal-800">Pack Avancé</h3>
                <p className="text-teal-600">Pour les experts</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">120€</div>
                  <div className="text-5xl font-bold text-teal-600">102€</div>
                  <div className="text-green-600 font-semibold">-15% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Cours niveau avancé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Préparation examens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-teal-600" />
                    <span>Anglais professionnel</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Kalamathèque */}
      <Kalamathèque />

      {/* Test Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Évaluez votre niveau d'anglais</h2>
          <p className="text-center text-gray-600 mb-12">Passez un test gratuit pour connaître votre niveau</p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Test Débutant</CardTitle>
                <CardDescription>Parfait pour ceux qui débutent leur apprentissage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 15 minutes</p>
                <Link to="/test/beginner">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" data-testid="test-beginner-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Test Intermédiaire</CardTitle>
                <CardDescription>Pour ceux qui ont une bonne base</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 20 minutes</p>
                <Link to="/test/intermediate">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" data-testid="test-intermediate-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-teal-100">
              <CardHeader>
                <CardTitle className="text-teal-800">Test Avancé</CardTitle>
                <CardDescription>Pour les utilisateurs expérimentés</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 25 minutes</p>
                <Link to="/test/advanced">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" data-testid="test-advanced-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white" id="register">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-2xl border-teal-100">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-teal-800">Rejoignez KALAMAENGLISH</CardTitle>
              <CardDescription className="text-center">
                Inscrivez-vous maintenant et commencez votre parcours d'apprentissage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Prénom *</Label>
                    <Input
                      id="first_name"
                      data-testid="register-first-name"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Nom *</Label>
                    <Input
                      id="last_name"
                      data-testid="register-last-name"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    data-testid="register-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    data-testid="register-phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="level">Niveau d'anglais *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger data-testid="register-level" className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionnez votre niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-teal-600" />
                    Sélectionnez vos créneaux préférés
                  </Label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-200 hover:border-teal-500"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDates.length > 0 ? `${selectedDates.length} date(s) sélectionnée(s)` : 'Choisir des créneaux'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-4">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates.map(d => new Date(d))}
                          onSelect={(dates) => {
                            if (dates && dates.length > 0) {
                              const lastDate = dates[dates.length - 1];
                              handleDateSelect(lastDate);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                        
                        {selectedDates.length > 0 && (
                          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                            {selectedDates.map(dateStr => (
                              <div key={dateStr} className="p-3 bg-teal-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold text-teal-800">
                                    {format(new Date(dateStr), 'EEEE dd MMMM', { locale: fr })}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDateSelect(new Date(dateStr))}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {timeSlots.map(time => (
                                    <button
                                      key={time}
                                      type="button"
                                      onClick={() => handleTimeSlotSelect(dateStr, time)}
                                      className={`px-2 py-1 text-xs rounded ${
                                        selectedTimeSlots[dateStr]?.includes(time)
                                          ? 'bg-teal-600 text-white'
                                          : 'bg-white border border-teal-200 text-teal-600 hover:bg-teal-50'
                                      }`}
                                    >
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Button
                          type="button"
                          onClick={() => setShowCalendar(false)}
                          className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                        >
                          Confirmer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {formatPreferredSlots() && (
                    <p className="text-sm text-gray-600 mt-2">
                      Créneaux sélectionnés: {formatPreferredSlots()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="referral_source">Comment avez-vous connu KALAMAENGLISH ?</Label>
                  <Select
                    value={formData.referral_source}
                    onValueChange={(value) => setFormData({ ...formData, referral_source: value })}
                  >
                    <SelectTrigger data-testid="register-referral" className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionnez une option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="word_of_mouth">Bouche à oreille</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={loading}
                  data-testid="register-submit-button"
                >
                  {loading ? 'Envoi en cours...' : 'Confirmer mon inscription'}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-4">KALAMAENGLISH</h2>
          <p className="text-gray-400 mb-4">info.kalamaenglish@gmail.com</p>
          <p className="text-gray-400">PARIS / ONLINE</p>
          <p className="text-gray-500 mt-8">© 2025 KALAMAENGLISH. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
