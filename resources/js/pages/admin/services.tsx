import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  Plus, Search, Edit2, Trash2, X, Check, Eye,
  Wrench, Droplets, Droplet, Flame, ShieldCheck, 
  Hammer, ShowerHead, Bath, Thermometer, Sparkles, 
  Zap, Upload, Image as ImageIcon, DollarSign,
  Info, ExternalLink, Layers
} from 'lucide-react';
import { toast } from 'sonner';

export interface ServiceItem {
  id: number;
  nom_service: string;
  description_service: string;
  description_detail_service: string;
  icone_service: string;
  prix_service: string | number;
  image_service: string;
  created_at: string;
}

interface PageProps {
  servicesList: {
    data: ServiceItem[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters?: {
    search?: string;
  };
  [key: string]: any;
}

// Dictionnaire des icônes disponibles
const AVAILABLE_ICONS = [
  { id: 'wrench', label: 'Clé anglaise', icon: Wrench },
  { id: 'droplets', label: 'Fuites / Eau', icon: Droplets },
  { id: 'droplet', label: 'Gouttelette', icon: Droplet },
  { id: 'flame', label: 'Chauffe-eau / Chauffage', icon: Flame },
  { id: 'shower-head', label: 'Douche & Sanitaire', icon: ShowerHead },
  { id: 'bath', label: 'Baignoire / Salle de bain', icon: Bath },
  { id: 'hammer', label: 'Travaux / Rénovation', icon: Hammer },
  { id: 'shield-check', label: 'Normes & Sécurité', icon: ShieldCheck },
  { id: 'thermometer', label: 'Thermique / Chaudière', icon: Thermometer },
  { id: 'sparkles', label: 'Finition & Entretien', icon: Sparkles },
  { id: 'zap', label: 'Dépannage Express', icon: Zap },
];

export default function AdminServices({ servicesList, filters }: PageProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Formulaire pour Création / Modification
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    nom_service: '',
    description_service: '',
    description_detail_service: '',
    icone_service: 'wrench',
    prix_service: '',
    image_service: null as File | null,
  });

  // Ouvrir modal de création
  const handleOpenCreate = () => {
    setEditingService(null);
    setImagePreview(null);
    clearErrors();
    reset();
    setData({
      nom_service: '',
      description_service: '',
      description_detail_service: '',
      icone_service: 'wrench',
      prix_service: '',
      image_service: null,
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal de modification
  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    clearErrors();
    setImagePreview(
      service.image_service.startsWith('http') 
        ? service.image_service 
        : `/storage/services/${service.image_service}`
    );
    setData({
      nom_service: service.nom_service,
      description_service: service.description_service,
      description_detail_service: service.description_detail_service,
      icone_service: service.icone_service || 'wrench',
      prix_service: String(service.prix_service),
      image_service: null,
    });
    setIsModalOpen(true);
  };

  // Gestion du changement de fichier image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('image_service', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Soumission du formulaire (Ajout ou Modif)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      // Modification
      post(`/admin/services/${editingService.id}`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Service mis à jour avec succès !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez corriger les erreurs dans le formulaire');
        },
      });
    } else {
      // Création
      post('/admin/services', {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Nouveau service ajouté avec succès !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez renseigner tous les champs obligatoires');
        },
      });
    }
  };

  // Suppression
  const handleDelete = () => {
    if (!serviceToDelete) return;

    router.delete(`/admin/services/${serviceToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Service supprimé avec succès');
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
      },
    });
  };

  // Filtrage local en temps réel
  const filteredServices = useMemo(() => {
    return servicesList.data.filter(s => 
      searchTerm === '' ||
      s.nom_service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description_service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [servicesList.data, searchTerm]);

  // Helper pour afficher l'icône
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const found = AVAILABLE_ICONS.find(i => i.id === iconName);
    const IconComp = found ? found.icon : Wrench;
    return <IconComp className={className} />;
  };

  return (
    <>
      <Head title="Gestion des Services - Admin Maître Plombier" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* En-tête de page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Gestion des Services
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Créez, modifiez et configurez les prestations de plomberie affichées sur votre site.
            </p>
          </div>
          
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm w-full md:w-auto cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Ajouter un nouveau service
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filteredServices.length} prestation{filteredServices.length > 1 ? 's' : ''} enregistrée{filteredServices.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Grille des services */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image d'illustration */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        service.image_service.startsWith('http') 
                          ? service.image_service 
                          : `/storage/services/${service.image_service}`
                      }
                      alt={service.nom_service}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badge Icône et Prix */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-2 rounded-xl text-blue-600 shadow-sm border border-slate-200/50">
                      {renderIcon(service.icone_service, "w-5 h-5")}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm">
                      À partir de {Number(service.prix_service).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  {/* Contenu textuel */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {service.nom_service}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {service.description_service}
                    </p>
                  </div>
                </div>

                {/* Barre d'action */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    ID #{service.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        setServiceToDelete(service);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Supprimer"
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
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun service trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Commencez par ajouter une première prestation de plomberie pour qu'elle s'affiche sur votre site public.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter un service maintenant
            </button>
          </div>
        )}

      </div>

      {/* MODALE DE CRÉATION / MODIFICATION SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto">
            
            {/* Header modal */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  {renderIcon(data.icone_service, "w-5 h-5")}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {editingService ? `Modifier le service : ${editingService.nom_service}` : 'Ajouter un nouveau service'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ces informations seront directement visibles par vos clients sur la page Services.
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

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Nom & Prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom du service *
                  </label>
                  <input
                    type="text"
                    value={data.nom_service}
                    onChange={(e) => setData('nom_service', e.target.value)}
                    placeholder="Ex : Débouchage & Canalisation"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.nom_service && <p className="text-red-500 text-xs mt-1">{errors.nom_service}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Tarif indicatif de départ (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={data.prix_service}
                    onChange={(e) => setData('prix_service', e.target.value)}
                    placeholder="Ex : 15000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.prix_service && <p className="text-red-500 text-xs mt-1">{errors.prix_service}</p>}
                </div>
              </div>

              {/* Sélection d'icône */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Icône représentative *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((iconObj) => {
                    const IconComp = iconObj.icon;
                    const isSelected = data.icone_service === iconObj.id;
                    return (
                      <button
                        key={iconObj.id}
                        type="button"
                        onClick={() => setData('icone_service', iconObj.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{iconObj.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description courte */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description courte (affichée sur la carte) *
                </label>
                <textarea
                  rows={2}
                  value={data.description_service}
                  onChange={(e) => setData('description_service', e.target.value)}
                  placeholder="Ex : Débouchage rapide de WC, éviers et colonnes générales d'évacuation..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.description_service && <p className="text-red-500 text-xs mt-1">{errors.description_service}</p>}
              </div>

              {/* Description détaillée */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description détaillée & Prestations incluses *
                </label>
                <textarea
                  rows={4}
                  value={data.description_detail_service}
                  onChange={(e) => setData('description_detail_service', e.target.value)}
                  placeholder="Détaillez ici les étapes de l'intervention, les garanties et les équipements pris en charge..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.description_detail_service && <p className="text-red-500 text-xs mt-1">{errors.description_detail_service}</p>}
              </div>

              {/* Image d'illustration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Photo d'illustration {editingService ? '(Laisser vide pour conserver l’actuelle)' : '*'}
                </label>
                
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                {errors.image_service && <p className="text-red-500 text-xs mt-1">{errors.image_service}</p>}
              </div>

              {/* Actions Modal */}
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
                  {processing ? 'Enregistrement...' : (editingService ? 'Mettre à jour' : 'Créer le service')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODALE DE SUPPRESSION */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supprimer ce service ?</h3>
              <p className="text-xs text-slate-500">
                Êtes-vous sûr de vouloir supprimer <strong>{serviceToDelete.nom_service}</strong> ? Il ne sera plus visible sur le site.
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
