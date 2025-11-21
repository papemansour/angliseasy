import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, FileText, Headphones, Video } from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    title: "Livres & Ebooks",
    description: "Une bibliothèque complète de livres et ebooks pour tous les niveaux",
    count: "200+"
  },
  {
    icon: FileText,
    title: "Fiches de révision",
    description: "Des fiches pratiques pour réviser grammaire et vocabulaire",
    count: "150+"
  },
  {
    icon: Headphones,
    title: "Podcasts & Audio",
    description: "Entraînez votre compréhension orale avec nos podcasts",
    count: "100+"
  },
  {
    icon: Video,
    title: "Vidéos pédagogiques",
    description: "Des vidéos explicatives pour approfondir vos connaissances",
    count: "80+"
  }
];

const Kalamathèque = () => {
  return (
    <section className="py-20 px-4 bg-white" id="kalamatheque">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">KALAMATHÈQUE</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez à notre bibliothèque numérique complète avec des milliers de ressources pour accompagner votre apprentissage
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-xl transition-all border-teal-100 hover:border-teal-300">
              <CardHeader>
                <div className="p-4 bg-teal-50 rounded-lg inline-block mb-3">
                  <resource.icon className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{resource.description}</p>
                <div className="text-3xl font-bold text-teal-600">{resource.count}</div>
                <p className="text-sm text-gray-500">ressources disponibles</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-6">
            Explorer la KALAMATHÈQUE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Kalamathèque;
