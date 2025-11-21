import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
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
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Politique de Confidentialité</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">1. Introduction</h2>
            <p>
              mykalamaenglish.com s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique 
              comment nous collectons, utilisons et protégeons vos données personnelles conformément à la loi n°2008-12 du 25 janvier 2008 
              portant sur la protection des données à caractère personnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">2. Données collectées</h2>
            <p className="mb-2">Nous collectons les informations suivantes lors de votre inscription et utilisation de nos services :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Informations d'identification : nom, prénom, adresse email</li>
              <li>Coordonnées : numéro de téléphone</li>
              <li>Informations académiques : niveau d'anglais, résultats des tests</li>
              <li>Préférences : créneaux horaires souhaités, source de référencement</li>
              <li>Données de paiement : traitées de manière sécurisée via Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">3. Utilisation des données</h2>
            <p className="mb-2">Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Fournir et personnaliser nos services d'enseignement</li>
              <li>Traiter vos paiements et gérer votre abonnement</li>
              <li>Communiquer avec vous concernant vos cours et notre service</li>
              <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
              <li>Respecter nos obligations légales et réglementaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">4. Partage des données</h2>
            <p className="mb-2">
              Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Avec les professeurs assignés pour assurer le suivi pédagogique</li>
              <li>Avec nos prestataires de services (paiement, hébergement) dans le cadre strict de leurs fonctions</li>
              <li>En cas d'obligation légale ou de demande des autorités compétentes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">5. Sécurité des données</h2>
            <p>
              mykalamaenglish.com met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles 
              contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">6. Conservation des données</h2>
            <p>
              Vos données personnelles sont conservées pendant la durée nécessaire à la fourniture de nos services et au respect de nos 
              obligations légales. Après cette période, vos données seront supprimées ou anonymisées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">7. Vos droits</h2>
            <p className="mb-2">Conformément à la loi, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit de suppression :</strong> demander la suppression de vos données</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à : mykalamaenglish@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">8. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur pour 
              refuser les cookies, mais cela peut limiter certaines fonctionnalités du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">9. Modifications de la politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées 
              sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">10. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données personnelles, 
              contactez-nous à : mykalamaenglish@gmail.com
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Dernière mise à jour : Janvier 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
