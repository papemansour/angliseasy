import React from 'react';
import { UserPlus, Calendar, Video, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Inscrivez-vous"
  },
  {
    icon: Calendar,
    title: "Choisissez vos créneaux"
  },
  {
    icon: Video,
    title: "Suivez vos cours"
  },
  {
    icon: Award,
    title: "Progressez rapidement"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">Comment ça marche ?</h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-16">Commencez votre apprentissage en 4 étapes simples</p>
        
        <div className="flex md:grid md:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {steps.map((step, index) => (
            <div key={index} className="relative min-w-[200px] sm:min-w-0 flex-shrink-0 snap-center">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
