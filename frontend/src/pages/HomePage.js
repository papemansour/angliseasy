import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { toast } from 'sonner';
import axios from 'axios';
import { ChevronRight, Users, BookOpen, Clock, Star, MessageCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, formData);
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
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">KALAMAENGLISH</h1>
          <Link to="/login">
            <Button variant="outline" data-testid="login-nav-button">
              Connexion
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Apprenez l'anglais facilement avec des méthodes innovantes
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Cours adaptés à tous les niveaux. My KALAMA ENGLISH rend l'apprentissage de l'anglais accessible à tous!
              </p>
              <div className="flex gap-4 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Taux de réussite</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">200+</div>
                  <div className="text-sm text-gray-600">Heures de cours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Accès aux cours</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Learning English"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Apprentissage personnalisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Des cours adaptés à votre niveau et à vos objectifs spécifiques</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Professeurs qualifiés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Une équipe d'experts passionnés par l'enseignement de l'anglais</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Flexibilité totale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Apprenez à votre rythme avec des horaires adaptés à votre emploi du temps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Tarifs & Niveaux</h2>
          <p className="text-center text-xl text-red-600 font-semibold mb-12">
            🎄 Promo Noël & Nouvel An - Valable jusqu'au 14 janvier 2025
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardTitle className="text-2xl">Pack Débutant</CardTitle>
                <CardDescription>Parfait pour commencer</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">80€</div>
                  <div className="text-5xl font-bold text-blue-600">76€</div>
                  <div className="text-green-600 font-semibold">-5% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                    <span>Cours adaptés débutants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                    <span>Support pédagogique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                    <span>Accès bibliothèque</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-xl transform hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Populaire</span>
                </div>
                <CardTitle className="text-2xl">Pack Intermédiaire</CardTitle>
                <CardDescription>Le plus choisi</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">100€</div>
                  <div className="text-5xl font-bold text-purple-600">90€</div>
                  <div className="text-green-600 font-semibold">-10% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                    <span>Cours intermédiaires</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                    <span>Pratique conversationnelle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                    <span>Exercices avancés</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-xl">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardTitle className="text-2xl">Pack Avancé</CardTitle>
                <CardDescription>Pour les experts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through text-xl">120€</div>
                  <div className="text-5xl font-bold text-indigo-600">102€</div>
                  <div className="text-green-600 font-semibold">-15% de réduction</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                    <span>Cours niveau avancé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                    <span>Préparation examens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                    <span>Anglais professionnel</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Évaluez votre niveau d'anglais</h2>
          <p className="text-center text-gray-600 mb-12">Passez un test gratuit pour connaître votre niveau</p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Test Débutant</CardTitle>
                <CardDescription>Parfait pour ceux qui débutent leur apprentissage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 15 minutes</p>
                <Link to="/test/beginner">
                  <Button className="w-full" data-testid="test-beginner-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Test Intermédiaire</CardTitle>
                <CardDescription>Pour ceux qui ont une bonne base</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 20 minutes</p>
                <Link to="/test/intermediate">
                  <Button className="w-full" data-testid="test-intermediate-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Test Avancé</CardTitle>
                <CardDescription>Pour les utilisateurs expérimentés</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">20 questions - 25 minutes</p>
                <Link to="/test/advanced">
                  <Button className="w-full" data-testid="test-advanced-button">
                    Commencer le test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50" id="register">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Rejoignez KALAMAENGLISH</CardTitle>
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
                  />
                </div>

                <div>
                  <Label htmlFor="level">Niveau d'anglais *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    required
                  >
                    <SelectTrigger data-testid="register-level">
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
                  <Label htmlFor="preferred_slots">Créneaux préférés</Label>
                  <Input
                    id="preferred_slots"
                    data-testid="register-slots"
                    value={formData.preferred_slots}
                    onChange={(e) => setFormData({ ...formData, preferred_slots: e.target.value })}
                    placeholder="Ex: Lundi 18h-20h, Mercredi 18h-20h"
                  />
                </div>

                <div>
                  <Label htmlFor="referral_source">Comment avez-vous connu KALAMAENGLISH ?</Label>
                  <Select
                    value={formData.referral_source}
                    onValueChange={(value) => setFormData({ ...formData, referral_source: value })}
                  >
                    <SelectTrigger data-testid="register-referral">
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
                  className="w-full"
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
