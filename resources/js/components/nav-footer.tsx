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
    <footer className={`bg-slate-900 border-t border-slate-800 text-slate-300 text-xs ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grille compacte à 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 : Marque & Présentation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Wrench className="w-5 h-5 text-blue-500" />
              <span>Maître Plombier</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Votre partenaire de confiance pour tous vos travaux de plomberie et chauffage. Intervention rapide, expertise garantie.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">Accueil</a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-400 transition-colors">Nos services</a>
              </li>
              <li>
                <a href="/projets" className="hover:text-blue-400 transition-colors">Réalisations (Avant/Après)</a>
              </li>
              <li>
                <a href="/a-propos" className="hover:text-blue-400 transition-colors">À propos</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-400 transition-colors">Contact & Devis</a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Légal */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Légal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/confidentialite" className="hover:text-blue-400 transition-colors">Politique de confidentialité</a>
              </li>
              <li>
                <a href="/termes" className="hover:text-blue-400 transition-colors">Conditions d'utilisation</a>
              </li>
              <li>
                <a href="/mentions-legales" className="hover:text-blue-400 transition-colors">Mentions légales</a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contactez-nous */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contactez-nous</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:237678953071" className="hover:text-blue-400 transition-colors">{contactInfo.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-400 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne inférieure de Copyright avec lien Donayem Tech */}
        <div className="border-t border-slate-800 mt-8 pt-5 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Maître Plombier. Tous droits réservés.</span>
          <span>
            Propulsé avec passion par{' '}
            <a 
              href="https://donayem.tech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 font-bold hover:underline"
            >
              Donayem Tech
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}