import React from 'react';
import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie Wane",
    role: "Étudiante en commerce",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "Grâce à KALAMAENGLISH, j'ai pu améliorer mon anglais professionnel en seulement 6 mois. Les professeurs sont excellents et très à l'écoute.",
    rating: 4
  },
  {
    name: "Gabriel Da SILVA",
    role: "Ingénieur",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "La flexibilité des horaires et la qualité des cours m'ont permis de progresser rapidement. Je recommande vivement!",
    rating: 5
  },
  {
    name: "Kadia SY",
    role: "Chef d'entreprise",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "Un service exceptionnel! Les cours sont adaptés à mes besoins professionnels et l'équipe est très réactive.",
    rating: 5
  },
  {
    name: "Élodie LEROUX",
    role: "Responsable marketing",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "J'ai enfin pu atteindre mes objectifs en anglais grâce à un accompagnement personnalisé et des cours de qualité.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">Ce que disent nos étudiants</h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-12">Découvrez les témoignages de ceux qui ont réussi avec nous</p>
        
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow border-teal-100 min-w-[260px] w-[260px] sm:min-w-0 sm:w-auto flex-shrink-0 snap-center">
              <CardContent className="p-3 sm:p-6">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 italic line-clamp-4">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
