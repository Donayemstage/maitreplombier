import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from "@/layouts/AppLayout";
import { 
  MapPin, Clock, Calendar, 
  FileText, Sparkles, CalendarDays, ShieldCheck,
  Wrench, Zap, Home, ChevronLeft, ChevronRight, 
  MessageSquare, Eye, X
} from 'lucide-react';

export interface ProjetItem {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  lieu?: string | null;
  duree_travaux?: string | null;
  photo_avant?: string | null;
  photo_apres: string;
  video_url?: string | null;
  date_realisation?: string | null;
  is_featured: boolean;
}

interface ProjetsProps {
  projetsList?: ProjetItem[];
  selectedCategory?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Toutes les réalisations' },
  { id: 'salle_de_bain', label: 'Salles de bain' },
  { id: 'fuite', label: 'Recherche de fuite' },
  { id: 'chauffe_eau', label: 'Chauffe-eau' },
  { id: 'debouchage', label: 'Débouchage' },
  { id: 'sanitaire', label: 'Sanitaires' },
];

const DEFAULT_PROJETS: ProjetItem[] = [
  {
    id: 1,
    titre: "Rénovation Complète Salle de Bain Moderne",
    categorie: "salle_de_bain",
    description: "Transformation intégrale d'une ancienne salle d'eau en suite moderne avec douche à l'italienne, meuble double vasque et colonne thermostatique suspendue.",
    lieu: "Douala (Bonapriso)",
    duree_travaux: "4 jours",
    photo_avant: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600",
    photo_apres: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600",
    date_realisation: "2026-08-10",
    is_featured: true,
  },
  {
    id: 2,
    titre: "Réparation Urgence Fuite Encastrée & Reprise Raccords",
    categorie: "fuite",
    description: "Localisation acoustique d'une fuite sous chape dans un salon, découpe minimale du carrelage, remplacement des tuyaux cuivre par du multicouche et remise en eau.",
    lieu: "Douala (Akwa)",
    duree_travaux: "3 heures",
    photo_avant: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600",
    photo_apres: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600",
    date_realisation: "2026-08-15",
    is_featured: true,
  },
];

export default function Projets({ projetsList }: ProjetsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeViews, setActiveViews] = useState<Record<number, 'avant' | 'apres'>>({});
  const [selectedProjetModal, setSelectedProjetModal] = useState<ProjetItem | null>(null);
  const [position, setPosition] = useState(50);

  const displayProjets = (projetsList && projetsList.length > 0) ? projetsList : DEFAULT_PROJETS;

  const filteredProjets = displayProjets.filter(p => {
    if (activeCategory === 'all') return true;
    return p.categorie === activeCategory;
  });

  const toggleView = (projetId: number, view: 'avant' | 'apres') => {
    setActiveViews(prev => ({ ...prev, [projetId]: view }));
  };

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600";
    return path.startsWith('http') ? path : `/storage/projets/${path}`;
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800">
      <Head title="Galerie de Réalisations - Maître Plombier" />

      {/* 1. HERO BANNIÈRE */}
      <section className="relative w-full overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1768321916212-17ae334a3d63?auto=format&fit=crop&fm=jpg&q=80&w=2000')",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/90" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

            {/* GAUCHE */}
            <div className="w-full">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Nos réalisations</span>
              </div>

              <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Nos réalisations
                <span className="mt-1 block text-blue-400">
                  Avant. Après.
                </span>
              </h1>

              <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-base">
                Découvrez nos travaux de plomberie et de rénovation sanitaire.
                Chaque réalisation témoigne de notre exigence et de notre engagement.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">Soigné & durable</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">Rapide</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">Devis gratuit</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">Particuliers & Pro</span>
                </div>
              </div>
            </div>

            {/* DROITE - SLIDER AVANT/APRÈS SÉCURISÉ */}
            <div className="relative w-full overflow-hidden">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-xl">
                
                {/* Visualiseur avec clip-path (Ne déborde JAMAIS sur mobile) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl select-none">
                  
                  {/* Image APRÈS (Fond) */}
                  <img
                    src="https://images.unsplash.com/photo-1782805134528-9b4e58e20069?auto=format&fit=crop&fm=jpg&q=85&w=1000"
                    alt="Après"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Image AVANT (Découpée dynamiquement) */}
                  <img
                    src="https://images.unsplash.com/photo-1768321916212-17ae334a3d63?auto=format&fit=crop&fm=jpg&q=85&w=1000"
                    alt="Avant"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                  />

                  {/* Badges */}
                  <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-bold text-white">
                    Avant
                  </div>
                  <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                    Après
                  </div>

                  {/* Ligne de séparation */}
                  <div
                    className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-white shadow-md"
                    style={{ left: `${position}%` }}
                  >
                    <div className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow">
                      <ChevronLeft className="h-3 w-3" />
                      <ChevronRight className="-ml-1 h-3 w-3" />
                    </div>
                  </div>

                  {/* Input Range sur toute la surface */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize z-20"
                  />
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-400 shrink-0" />
                    <h3 className="text-xs font-bold text-white truncate">
                      Rénovation complète d'une salle de bain
                    </h3>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-blue-400" /> Douala</span>
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-blue-400" /> Juin 2026</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FILTRES */}
      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GRILLE DE RÉALISATIONS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {filteredProjets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjets.map((projet) => {
              const currentView = activeViews[projet.id] || 'apres';
              const hasBefore = Boolean(projet.photo_avant);

              return (
                <div
                  key={projet.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={getImageUrl(currentView === 'avant' && hasBefore ? projet.photo_avant : projet.photo_apres)}
                        alt={projet.titre}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute top-2 left-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white ${
                          currentView === 'avant' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {currentView === 'avant' ? 'AVANT' : 'APRÈS'}
                        </span>
                      </div>

                      {hasBefore && (
                        <div className="absolute bottom-2 left-2 right-2 flex rounded-lg bg-slate-900/80 p-1 backdrop-blur-xs">
                          <button
                            onClick={() => toggleView(projet.id, 'avant')}
                            className={`flex-1 rounded-md py-1 text-[11px] font-bold ${
                              currentView === 'avant' ? 'bg-white text-slate-900' : 'text-slate-300'
                            }`}
                          >
                            Avant
                          </button>
                          <button
                            onClick={() => toggleView(projet.id, 'apres')}
                            className={`flex-1 rounded-md py-1 text-[11px] font-bold ${
                              currentView === 'apres' ? 'bg-emerald-500 text-white' : 'text-slate-300'
                            }`}
                          >
                            Après
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {getCategoryLabel(projet.categorie)}
                        </span>
                        {projet.lieu && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3" /> {projet.lieu}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {projet.titre}
                      </h3>

                      <p className="line-clamp-2 text-xs text-slate-600">
                        {projet.description}
                      </p>

                      <div className="flex items-center gap-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        {projet.duree_travaux && (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {projet.duree_travaux}</span>
                        )}
                        {projet.date_realisation && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(projet.date_realisation).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 pt-0">
                    <button
                      onClick={() => setSelectedProjetModal(projet)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" /> Voir en grand
                    </button>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            Aucun projet trouvé dans cette catégorie.
          </div>
        )}
      </section>

      {/* MODALE */}
      {selectedProjetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{selectedProjetModal.titre}</h3>
              <button onClick={() => setSelectedProjetModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-4 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedProjetModal.photo_avant && (
                  <div>
                    <span className="mb-1 block font-bold text-amber-600">Avant</span>
                    <img src={getImageUrl(selectedProjetModal.photo_avant)} alt="Avant" className="h-40 w-full rounded-lg object-cover" />
                  </div>
                )}
                <div>
                  <span className="mb-1 block font-bold text-emerald-600">Après</span>
                  <img src={getImageUrl(selectedProjetModal.photo_apres)} alt="Après" className="h-40 w-full rounded-lg object-cover" />
                </div>
              </div>

              <p className="text-slate-600">{selectedProjetModal.description}</p>

              <div className="flex flex-col gap-2 pt-2 border-t sm:flex-row sm:justify-between">
                <a
                  href={`https://wa.me/237678953071?text=${encodeURIComponent(`Bonjour, je suis intéressé par le projet "${selectedProjetModal.titre}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 px-3 font-bold text-white"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 py-2 px-3 font-bold text-white"
                >
                  <FileText className="h-3.5 w-3.5" /> Devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Projets.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;