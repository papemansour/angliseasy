import React from 'react';
import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Étudiante en commerce",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "Grâce à KALAMAENGLISH, j'ai pu améliorer mon anglais professionnel en seulement 3 mois. Les professeurs sont excellents et très à l'écoute.",
    rating: 5
  },
  {
    name: "Thomas Dubois",
    role: "Ingénieur",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "La flexibilité des horaires et la qualité des cours m'ont permis de progresser rapidement. Je recommande vivement!",
    rating: 5
  },
  {
    name: "Marie Leroux",
    role: "Chef d'entreprise",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200",
    content: "Un service exceptionnel! Les cours sont adaptés à mes besoins professionnels et l'équipe est très réactive.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-4">Ce que disent nos étudiants</h2>
        <p className="text-center text-gray-600 mb-12">Découvrez les témoignages de ceux qui ont réussi avec nous</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow border-teal-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
