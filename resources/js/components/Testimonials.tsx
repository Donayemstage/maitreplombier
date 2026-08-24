import React from 'react';

// Interface TypeScript pour la structure d'un avis client
interface Testimonial {
  id: number;
  author: string;
  initials: string;
  location: string;
  content: string;
  rating: number;
}

// Données fictives ancrées au Cameroun
const testimonialsData: Testimonial[] = [
  {
    id: 1,
    author: 'Jean-Emmanuel N.',
    initials: 'JE',
    location: 'Douala (Akwa)',
    content:
      'Intervention un dimanche matin à Akwa pour une grosse fuite dans la cuisine. Le plombier est arrivé très rapidement, travail propre et professionnel. Je recommande vivement !',
    rating: 5,
  },
  {
    id: 2,
    author: 'Marie-Claire B.',
    initials: 'MB',
    location: 'Yaoundé (Bastos)',
    content:
      "Artisan sérieux et très ponctuel. J'ai fait appel à eux pour le remplacement de mon chauffe-eau à Bastos. Excellent conseil sur le choix du matériel et devis totalement respecté.",
    rating: 5,
  },
  {
    id: 3,
    author: 'Patrick K.',
    initials: 'PK',
    location: 'Kribi',
    content:
      "Très bon contact. Le technicien a pris le temps d'expliquer le problème de canalisation bouchée avant de démarrer. Transparence totale sur les tarifs du dépannage.",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Ils nous font confiance</h2>
          <p className="mt-3 text-slate-600">
            La satisfaction de nos clients est notre meilleure publicité. Découvrez leurs retours sur nos interventions partout au Cameroun.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex text-amber-400 gap-1 text-lg">
                    {'★'.repeat(item.rating)}
                  </div>
                  <span className="text-4xl text-blue-100 font-serif leading-none">“</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.author}</h4>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;