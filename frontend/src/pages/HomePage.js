import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CurrencyToggle, useCurrency } from '../components/CurrencySelector';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Testimonials from '../components/Testimonials';
import HowItWorks from '../components/HowItWorks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const HomePage = () => {
  const navigate = useNavigate();
  const { currency, formatPrice, EUR_TO_FCFA } = useCurrency();
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
      setShowRegistrationModal(false);
      
      // Redirect to Stripe payment if plan selected
      if (selectedPlan) {
        handleStripePayment(selectedPlan);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = (plan) => {
    toast.info('Redirection vers le paiement Stripe...');
    // TODO: Integrate with Stripe Checkout
    // For now, just show a message
    toast.success(`Paiement pour ${plan.name} - ${formatPrice(plan.price)}`);
  };

  const openRegistrationModal = (plan = null) => {
    setSelectedPlan(plan);
    if (plan) {
      setFormData({ ...formData, level: plan.level });
    }
    setShowRegistrationModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MyKalamaenglish</h1>
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
              onClick={() => openRegistrationModal()}
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
          
          <div className="flex justify-center mb-6">
            <CurrencyToggle />
          </div>
          
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
                  <div className="text-gray-400 line-through text-xl">{formatPrice(80)}</div>
                  <div className="text-5xl font-bold text-teal-600">{formatPrice(76)}</div>
                  <div className="text-green-600 font-semibold mt-2">-5% de réduction</div>
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
                <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700" data-testid="pay-beginner">
                  Payer maintenant
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  💳 Paiement sécurisé par Stripe (PCI Niveau 1)
                </p>
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
                  <div className="text-gray-400 line-through text-xl">{formatPrice(100)}</div>
                  <div className="text-5xl font-bold text-teal-600">{formatPrice(90)}</div>
                  <div className="text-green-600 font-semibold mt-2">-10% de réduction</div>
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
                <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700" data-testid="pay-intermediate">
                  Payer maintenant
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  💳 Paiement sécurisé par Stripe (PCI Niveau 1)
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-teal-200 bg-white/60 backdrop-blur-lg hover:shadow-xl transition-all">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6">
                <h3 className="text-2xl font-bold text-teal-800">Pack Avancé</h3>
                <p className="text-teal-600">Pour les experts</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">{formatPrice(120)}</div>
                  <div className="text-5xl font-bold text-teal-600">{formatPrice(102)}</div>
                  <div className="text-green-600 font-semibold mt-2">-15% de réduction</div>
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
                <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700" data-testid="pay-advanced">
                  Payer maintenant
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  💳 Paiement sécurisé par Stripe (PCI Niveau 1)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* CTA Button */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-7xl text-center">
          <button 
            onClick={() => document.getElementById('register').scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 animate-bounce shadow-lg hover:shadow-xl"
            data-testid="cta-start-learning"
          >
            Commencer à apprendre
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

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
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* À propos */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-teal-400">KALAMAENGLISH</h3>
              <p className="text-gray-400 mb-4">
                Plateforme d'apprentissage de l'anglais en ligne adaptée à tous les niveaux.
              </p>
            </div>
            
            {/* Liens rapides */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-teal-400">Liens rapides</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition">Accueil</a></li>
                <li><a href="#kalamatheque" className="text-gray-400 hover:text-teal-400 transition">Kalamathèque</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-teal-400 transition">Connexion</Link></li>
                <li><a href="#register" className="text-gray-400 hover:text-teal-400 transition">Inscription</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-teal-400">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info.kalamaenglish@gmail.com</li>
                <li>Localisation: PARIS / ONLINE</li>
              </ul>
            </div>
            
            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-teal-400">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500">© 2025 KALAMAENGLISH. Tous droits réservés.</p>
              <div className="flex gap-6">
                <Link to="/cgu" className="text-gray-400 hover:text-teal-400 transition">CGU</Link>
                <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition">Politique de confidentialité</Link>
                <Link to="/legal" className="text-gray-400 hover:text-teal-400 transition">Mentions légales</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
