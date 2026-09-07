import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  Plus, Search, Edit2, Trash2, X, Check, Eye,
  FolderKanban, MapPin, Clock, Calendar, Star,
  Upload, Image as ImageIcon, Video, ArrowRight,
  Sparkles, CheckCircle, Split
} from 'lucide-react';
import { toast } from 'sonner';

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
  created_at: string;
}

interface PageProps {
  projetsList: {
    data: ProjetItem[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters?: {
    search?: string;
    category?: string;
  };
  [key: string]: any;
}

const CATEGORIES = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'salle_de_bain', label: 'Salle de bain' },
  { id: 'fuite', label: 'Recherche de fuite' },
  { id: 'chauffe_eau', label: 'Chauffe-eau' },
  { id: 'debouchage', label: 'Débouchage' },
  { id: 'sanitaire', label: 'Installation Sanitaire' },
  { id: 'autre', label: 'Autre chantier' },
];

export default function AdminProjets({ projetsList, filters }: PageProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProjet, setEditingProjet] = useState<ProjetItem | null>(null);
  const [projetToDelete, setProjetToDelete] = useState<ProjetItem | null>(null);
  
  const [previewAvant, setPreviewAvant] = useState<string | null>(null);
  const [previewApres, setPreviewApres] = useState<string | null>(null);

  // Formulaire Inertia
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    titre: '',
    categorie: 'salle_de_bain',
    description: '',
    lieu: '',
    duree_travaux: '',
    photo_avant: null as File | null,
    photo_apres: null as File | null,
    video_url: '',
    date_realisation: new Date().toISOString().split('T')[0],
    is_featured: false,
  });

  // Ouvrir modal de création
  const handleOpenCreate = () => {
    setEditingProjet(null);
    setPreviewAvant(null);
    setPreviewApres(null);
    clearErrors();
    reset();
    setData({
      titre: '',
      categorie: 'salle_de_bain',
      description: '',
      lieu: '',
      duree_travaux: '',
      photo_avant: null,
      photo_apres: null,
      video_url: '',
      date_realisation: new Date().toISOString().split('T')[0],
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal de modification
  const handleOpenEdit = (projet: ProjetItem) => {
    setEditingProjet(projet);
    clearErrors();
    setPreviewAvant(
      projet.photo_avant 
        ? (projet.photo_avant.startsWith('http') ? projet.photo_avant : `/storage/projets/${projet.photo_avant}`)
        : null
    );
    setPreviewApres(
      projet.photo_apres.startsWith('http') 
        ? projet.photo_apres 
        : `/storage/projets/${projet.photo_apres}`
    );
    setData({
      titre: projet.titre,
      categorie: projet.categorie,
      description: projet.description,
      lieu: projet.lieu || '',
      duree_travaux: projet.duree_travaux || '',
      photo_avant: null,
      photo_apres: null,
      video_url: projet.video_url || '',
      date_realisation: projet.date_realisation ? projet.date_realisation.split('T')[0] : '',
      is_featured: Boolean(projet.is_featured),
    });
    setIsModalOpen(true);
  };

  // Gestion upload photo avant
  const handlePhotoAvantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('photo_avant', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvant(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Gestion upload photo après
  const handlePhotoApresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('photo_apres', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewApres(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProjet) {
      post(`/admin/projets/${editingProjet.id}`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Réalisation mise à jour avec succès !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez vérifier les champs du formulaire');
        },
      });
    } else {
      post('/admin/projets', {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Nouveau chantier ajouté à la galerie !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez renseigner les champs obligatoires');
        },
      });
    }
  };

  // Suppression
  const handleDelete = () => {
    if (!projetToDelete) return;
    router.delete(`/admin/projets/${projetToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Chantier supprimé');
        setIsDeleteModalOpen(false);
        setProjetToDelete(null);
      },
    });
  };

  // Filtrage local
  const filteredProjets = useMemo(() => {
    return projetsList.data.filter(p => {
      const matchesSearch = searchTerm === '' ||
        p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.lieu && p.lieu.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory !== 'all' && p.categorie !== selectedCategory) return false;
      return true;
    });
  }, [projetsList.data, searchTerm, selectedCategory]);

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600";
    return path.startsWith('http') ? path : `/storage/projets/${path}`;
  };

  return (
    <>
      <Head title="Galerie & Chantiers - Admin Maître Plombier" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Galerie des Chantiers (Avant / Après)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gérez les photos et vidéos de vos réalisations pour valoriser le savoir-faire de l'entreprise.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm w-full md:w-auto cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Ajouter un nouveau chantier
          </button>
        </div>

        {/* Barre de recherche et filtre par catégorie */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un chantier, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille des réalisations */}
        {filteredProjets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjets.map((projet) => (
              <div 
                key={projet.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Visuel Avant / Après Split */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 grid grid-cols-2 gap-0.5">
                    
                    {/* Photo Avant */}
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={getImageUrl(projet.photo_avant)}
                        alt={`Avant - ${projet.titre}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                        AVANT
                      </span>
                    </div>

                    {/* Photo Après */}
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={getImageUrl(projet.photo_apres)}
                        alt={`Après - ${projet.titre}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                        APRÈS
                      </span>
                    </div>

                    {/* Badge Featured */}
                    {projet.is_featured && (
                      <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-white" /> En vedette
                      </span>
                    )}
                  </div>

                  {/* Détails */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">
                        {getCategoryLabel(projet.categorie)}
                      </span>
                      {projet.lieu && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {projet.lieu}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {projet.titre}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {projet.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      {projet.duree_travaux && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {projet.duree_travaux}
                        </span>
                      )}
                      {projet.date_realisation && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(projet.date_realisation).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Carte */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">ID #{projet.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(projet)}
                      className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        setProjetToDelete(projet);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun chantier dans la galerie</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ajoutez vos photos de chantiers Avant/Après pour inspirer confiance à vos clients.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter une réalisation
            </button>
          </div>
        )}

      </div>

      {/* MODALE CRÉATION / MODIFICATION CHANTIER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto">
            
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Split className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {editingProjet ? `Modifier le chantier : ${editingProjet.titre}` : 'Ajouter un chantier Avant / Après'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Présentez l'état initial et la transformation finale réalisée par vos équipes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Titre & Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Titre du projet / chantier *
                  </label>
                  <input
                    type="text"
                    value={data.titre}
                    onChange={(e) => setData('titre', e.target.value)}
                    placeholder="Ex : Rénovation Salle de Bain - Villa Bonapriso"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Catégorie de travaux *
                  </label>
                  <select
                    value={data.categorie}
                    onChange={(e) => setData('categorie', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lieu, Durée & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Lieu / Ville
                  </label>
                  <input
                    type="text"
                    value={data.lieu}
                    onChange={(e) => setData('lieu', e.target.value)}
                    placeholder="Ex : Douala (Akwa)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Durée d'intervention
                  </label>
                  <input
                    type="text"
                    value={data.duree_travaux}
                    onChange={(e) => setData('duree_travaux', e.target.value)}
                    placeholder="Ex : 2 jours, 4h"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Date de réalisation
                  </label>
                  <input
                    type="date"
                    value={data.date_realisation}
                    onChange={(e) => setData('date_realisation', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Photos Avant et Après */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                
                {/* Photo Avant */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Photo Avant Travaux <span className="text-slate-400 font-normal">(Facultatif)</span>
                  </label>
                  
                  {previewAvant && (
                    <div className="mb-2 h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={previewAvant} alt="Aperçu Avant" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoAvantChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {errors.photo_avant && <p className="text-red-500 text-xs mt-1">{errors.photo_avant}</p>}
                </div>

                {/* Photo Après */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Photo Après Travaux * <span className="text-blue-600 font-bold">(Résultat)</span>
                  </label>

                  {previewApres && (
                    <div className="mb-2 h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={previewApres} alt="Aperçu Après" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoApresChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {errors.photo_apres && <p className="text-red-500 text-xs mt-1">{errors.photo_apres}</p>}
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description des travaux réalisés *
                </label>
                <textarea
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Décrivez les problèmes initiaux et les solutions apportées (matériaux utilisés, tuyaux remplacés, sanitaires posés)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Lien Vidéo & Option En vedette */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Lien Vidéo YouTube / MP4 <span className="text-slate-400 font-normal">(Facultatif)</span>
                  </label>
                  <input
                    type="url"
                    value={data.video_url}
                    onChange={(e) => setData('video_url', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.is_featured}
                      onChange={(e) => setData('is_featured', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded-lg"
                    />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Mettre en avant sur la page d'accueil ⭐
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {processing ? 'Enregistrement...' : (editingProjet ? 'Mettre à jour' : 'Ajouter le chantier')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {isDeleteModalOpen && projetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supprimer ce chantier ?</h3>
              <p className="text-xs text-slate-500">
                Êtes-vous sûr de vouloir supprimer <strong>{projetToDelete.titre}</strong> ? Les photos associées seront supprimées.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
