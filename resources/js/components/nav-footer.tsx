import React from 'react';
import { Wrench, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function NavFooter({ className = '' }: FooterProps) {
  // Variables à mettre à jour plus tard avec les données réelles du client
  const contactInfo = {
    address: "Douala, Cameroun",
    phone: "+237 678 95 30 71",
    email: "contact@maitreplombier.cm",
  };

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 text-gray-600 text-xs ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Grille compacte à 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Colonne 1 : Marque & Présentation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Maître Plombier</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Votre partenaire de confiance pour tous vos travaux de plomberie et chauffage. Intervention rapide, expertise garantie.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="/" className="hover:text-blue-600 transition-colors">Accueil</a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-600 transition-colors">Nos services</a>
              </li>
              <li>
                <a href="/a-propos" className="hover:text-blue-600 transition-colors">À propos</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Légal */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Légal</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="/confidentialite" className="hover:text-blue-600 transition-colors">Politique de confidentialité</a>
              </li>
              <li>
                <a href="/termes" className="hover:text-blue-600 transition-colors">Conditions d'utilisation</a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contactez-nous */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Contactez-nous</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-600 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne inférieure de Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} Maître Plombier. Tous droits réservés. Créé par Donayem Tech.
        </div>
      </div>
    </footer>
  );
}
