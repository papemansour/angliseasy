import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Mentions Légales</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">1. Informations légales</h2>
            <p className="mb-2">mykalamaenglish.com est une plateforme d'apprentissage de l'anglais en ligne, créée et gérée par :</p>
            <ul className="list-none space-y-1 ml-4">
              <li><strong>DIAGNE Mouhamadou Mansour</strong></li>
              <li><strong>Email :</strong> mykalamaenglish@gmail.com</li>
              <li><strong>Site web :</strong> mykalamaenglish.com</li>
              <li><strong>Adresse :</strong> PARIS / ONLINE</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">2. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé par les lois relatives à la propriété intellectuelle. 
              Toute reproduction ou représentation, intégrale ou partielle, par quelque procédé que ce soit, faite sans le consentement de 
              mykalamaenglish.com est illicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">3. Protection des données personnelles</h2>
            <p className="mb-2">
              Conformément à la loi n°2008-12 du 25 janvier 2008 portant sur la protection des données à caractère personnel, vous disposez 
              d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
            <p>
              Les informations collectées sont destinées uniquement à l'amélioration de nos services et ne seront en aucun cas transmises à 
              des tiers sans votre consentement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">4. Services proposés</h2>
            <p className="mb-2">mykalamaenglish.com propose des cours d'anglais en ligne adaptés à tous les niveaux :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Cours particuliers et en groupe</li>
              <li>Supports pédagogiques personnalisés</li>
              <li>Suivi de progression</li>
              <li>Ressources d'apprentissage en ligne</li>
              <li>Tests de niveau et évaluations régulières</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">5. Conditions d'utilisation</h2>
            <p>
              L'utilisation de la plateforme mykalamaenglish.com implique l'acceptation pleine et entière des conditions générales d'utilisation 
              décrites ci-dessus. Ces conditions d'utilisation peuvent être modifiées à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">6. Responsabilité</h2>
            <p>
              mykalamaenglish.com met tout en œuvre pour offrir aux utilisateurs des informations et outils disponibles et vérifiés, mais ne 
              saurait être tenue pour responsable des erreurs, d'une absence de disponibilité des informations, ou de la présence de virus sur son site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">7. Contact</h2>
            <p className="mb-2">Pour toute question ou réclamation, vous pouvez nous contacter :</p>
            <ul className="list-none space-y-1 ml-4">
              <li><strong>Par email :</strong> mykalamaenglish@gmail.com</li>
              <li><strong>Site web :</strong> mykalamaenglish.com</li>
              <li><strong>Localisation :</strong> PARIS / ONLINE</li>
              <li><strong>Disponibilité :</strong> 24/7</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
