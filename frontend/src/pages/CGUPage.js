import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CGUPage = () => {
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
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Conditions Générales d'Utilisation</h1>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles 
              mykalamaenglish.com met à disposition des utilisateurs sa plateforme d'apprentissage de l'anglais en ligne.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">2. Acceptation des CGU</h2>
            <p>
              L'accès et l'utilisation de la plateforme mykalamaenglish.com impliquent l'acceptation sans réserve des présentes CGU. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">3. Inscription et compte utilisateur</h2>
            <p className="mb-2">Pour accéder aux services de mykalamaenglish.com, vous devez créer un compte en fournissant des informations exactes et à jour. Vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fournir des informations exactes lors de l'inscription</li>
              <li>Maintenir la confidentialité de vos identifiants de connexion</li>
              <li>Informer immédiatement mykalamaenglish.com de toute utilisation non autorisée de votre compte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">4. Services proposés</h2>
            <p className="mb-2">mykalamaenglish.com propose :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Des cours d'anglais en ligne adaptés à tous les niveaux (débutant, intermédiaire, avancé)</li>
              <li>Des tests de niveau personnalisés</li>
              <li>Un suivi pédagogique individualisé</li>
              <li>Des ressources d'apprentissage complémentaires</li>
              <li>Un système de réservation de créneaux horaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">5. Tarifs et paiements</h2>
            <p className="mb-2">
              Les tarifs des cours sont affichés en euros (EUR) et en francs CFA (FCFA) sur la plateforme. Les paiements sont sécurisés 
              via Stripe. Les prix peuvent être modifiés à tout moment, mais les cours déjà réservés conservent leur tarif initial.
            </p>
            <p>
              En cas de promotion ou de réduction, les conditions spécifiques seront clairement indiquées sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">6. Annulation et remboursement</h2>
            <p>
              Les conditions d'annulation et de remboursement seront communiquées lors de la réservation d'un cours. 
              En cas d'annulation par mykalamaenglish.com, un remboursement intégral ou un report du cours sera proposé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">7. Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur mykalamaenglish.com (textes, images, vidéos, supports pédagogiques) sont protégés par le droit d'auteur. 
              Toute reproduction, distribution ou utilisation commerciale sans autorisation expresse est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">8. Responsabilité</h2>
            <p>
              mykalamaenglish.com s'efforce de fournir des services de qualité, mais ne peut garantir l'absence d'interruptions ou d'erreurs. 
              La responsabilité de mykalamaenglish.com ne saurait être engagée en cas de force majeure ou de difficultés techniques indépendantes de sa volonté.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">9. Modification des CGU</h2>
            <p>
              mykalamaenglish.com se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification 
              substantielle par email ou via la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-teal-800">10. Contact</h2>
            <p>
              Pour toute question concernant les CGU, contactez-nous à : mykalamaenglish@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CGUPage;
