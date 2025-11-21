import React from 'react';
import { UserPlus, Calendar, Video, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Inscrivez-vous",
    description: "Créez votre compte en quelques minutes et passez notre test de niveau gratuit"
  },
  {
    icon: Calendar,
    title: "Choisissez vos créneaux",
    description: "Sélectionnez les horaires qui vous conviennent et réservez vos cours avec nos professeurs"
  },
  {
    icon: Video,
    title: "Suivez vos cours",
    description: "Participez à vos cours en ligne via Google Meet avec un suivi personnalisé"
  },
  {
    icon: Award,
    title: "Progressez rapidement",
    description: "Atteignez vos objectifs grâce à un accompagnement sur mesure et des ressources adaptées"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-4">Comment ça marche ?</h2>
        <p className="text-center text-gray-600 mb-16">Commencez votre apprentissage en 4 étapes simples</p>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-teal-200 -z-10" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-teal-600 text-white mb-4 relative z-10">
                  <step.icon className="w-12 h-12" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-teal-600 flex items-center justify-center font-bold text-teal-600">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
