import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  Plus, Search, Edit2, Trash2, X, Check, Eye,
  Star, MessageSquare, CheckCircle, Clock, AlertCircle,
  MapPin, Wrench, ThumbsUp, ShieldCheck, User
} from 'lucide-react';
import { toast } from 'sonner';

export interface AvisItem {
  id: number;
  nom_client: string;
  ville?: string | null;
  service_concerne?: string | null;
  note: number;
  commentaire: string;
  avatar?: string | null;
  statut: 'publie' | 'en_attente' | 'rejete';
  is_featured: boolean;
  created_at: string;
}

interface PageProps {
  avisList: {
    data: AvisItem[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  stats: {
    total: number;
    publie: number;
    en_attente: number;
    note_moyenne: number;
  };
  filters?: {
    search?: string;
    status?: string;
  };
  [key: string]: any;
}

export default function AdminAvis({ avisList, stats, filters }: PageProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAvis, setEditingAvis] = useState<AvisItem | null>(null);
  const [avisToDelete, setAvisToDelete] = useState<AvisItem | null>(null);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    nom_client: '',
    ville: '',
    service_concerne: '',
    note: 5,
    commentaire: '',
    statut: 'publie',
    is_featured: false,
  });

  // Ouvrir modal de création
  const handleOpenCreate = () => {
    setEditingAvis(null);
    clearErrors();
    reset();
    setData({
      nom_client: '',
      ville: 'Douala',
      service_concerne: 'Dépannage d\'urgence',
      note: 5,
      commentaire: '',
      statut: 'publie',
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  // Ouvrir modal d'édition
  const handleOpenEdit = (avis: AvisItem) => {
    setEditingAvis(avis);
    clearErrors();
    setData({
      nom_client: avis.nom_client,
      ville: avis.ville || '',
      service_concerne: avis.service_concerne || '',
      note: avis.note,
      commentaire: avis.commentaire,
      statut: avis.statut,
      is_featured: Boolean(avis.is_featured),
    });
    setIsModalOpen(true);
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAvis) {
      post(`/admin/avis/${editingAvis.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Avis client mis à jour avec succès !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez corriger les champs requis');
        },
      });
    } else {
      post('/admin/avis', {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Nouvel avis client enregistré !');
          setIsModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Veuillez renseigner tous les champs obligatoires');
        },
      });
    }
  };

  // Changement rapide de statut (Modération)
  const handleStatusChange = (avis: AvisItem, newStatus: 'publie' | 'en_attente' | 'rejete') => {
    router.patch(`/admin/avis/${avis.id}/status`, { statut: newStatus }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Statut modifié : ${newStatus === 'publie' ? 'Publié sur le site' : newStatus}`);
      },
    });
  };

  // Suppression
  const handleDelete = () => {
    if (!avisToDelete) return;
    router.delete(`/admin/avis/${avisToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Avis supprimé');
        setIsDeleteModalOpen(false);
        setAvisToDelete(null);
      },
    });
  };

  // Filtrage local
  const filteredAvis = useMemo(() => {
    return avisList.data.filter(a => {
      const matchesSearch = searchTerm === '' ||
        a.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.commentaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.ville && a.ville.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.service_concerne && a.service_concerne.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedStatus !== 'all' && a.statut !== selectedStatus) return false;
      return true;
    });
  }, [avisList.data, searchTerm, selectedStatus]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Head title="Avis & Témoignages Clients - Admin Maître Plombier" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Avis & Témoignages Clients
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Modérez les avis reçus et ajoutez les retours de vos clients pour renforcer votre réputation.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm w-full md:w-auto cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Ajouter un avis client
          </button>
        </div>

        {/* 4 Cartes d'indicateurs KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">Note Moyenne</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.note_moyenne} / 5</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Avis</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">Avis Publiés</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.publie}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">En Modération</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.en_attente}</p>
            </div>
          </div>

        </div>

        {/* Barre de filtre et recherche */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {['all', 'publie', 'en_attente', 'rejete'].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setSelectedStatus(statusKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === statusKey
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {statusKey === 'all' && 'Tous'}
                {statusKey === 'publie' && 'Publiés'}
                {statusKey === 'en_attente' && 'À modérer'}
                {statusKey === 'rejete' && 'Rejetés'}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des avis */}
        {filteredAvis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvis.map((avis) => (
              <div
                key={avis.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Header Avis : Note & Badge Statut */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {renderStars(avis.note)}

                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      avis.statut === 'publie'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : avis.statut === 'en_attente'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                    }`}>
                      {avis.statut === 'publie' ? 'En ligne' : avis.statut === 'en_attente' ? 'À valider' : 'Rejeté'}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{avis.commentaire}"
                  </p>
                </div>

                {/* Client Info & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {avis.nom_client.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {avis.nom_client}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          {avis.ville && <span>{avis.ville}</span>}
                          {avis.service_concerne && <span>• {avis.service_concerne}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons de modération */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {avis.statut !== 'publie' && (
                        <button
                          onClick={() => handleStatusChange(avis, 'publie')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold flex items-center gap-1"
                          title="Publier sur le site"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Publier
                        </button>
                      )}
                      {avis.statut === 'publie' && (
                        <button
                          onClick={() => handleStatusChange(avis, 'rejete')}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-medium"
                          title="Masquer"
                        >
                          Masquer
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(avis)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setAvisToDelete(avis);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun avis trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ajoutez les premiers retours de vos clients ou recueillez leurs avis en direct.
            </p>
          </div>
        )}

      </div>

      {/* MODALE CRÉATION / MODIFICATION AVIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingAvis ? 'Modifier l\'avis client' : 'Ajouter un témoignage client'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ces retours renforcent la confiance de vos prospects.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nom du client ou entreprise *
                </label>
                <input
                  type="text"
                  value={data.nom_client}
                  onChange={(e) => setData('nom_client', e.target.value)}
                  placeholder="Ex : Jean-Emmanuel N. ou Résidence Le Palmier"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.nom_client && <p className="text-red-500 text-xs mt-1">{errors.nom_client}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Ville / Quartier
                  </label>
                  <input
                    type="text"
                    value={data.ville}
                    onChange={(e) => setData('ville', e.target.value)}
                    placeholder="Ex : Douala (Akwa)"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Service concerné
                  </label>
                  <input
                    type="text"
                    value={data.service_concerne}
                    onChange={(e) => setData('service_concerne', e.target.value)}
                    placeholder="Ex : Réparation de fuite"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Note sur 5 étoiles */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Note attribuée * ({data.note} / 5 étoiles)
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setData('note', star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= data.note ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message de l'avis */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Commentaire / Témoignage *
                </label>
                <textarea
                  rows={3}
                  value={data.commentaire}
                  onChange={(e) => setData('commentaire', e.target.value)}
                  placeholder="Écrivez le retour du client..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.commentaire && <p className="text-red-500 text-xs mt-1">{errors.commentaire}</p>}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Statut de publication
                </label>
                <select
                  value={data.statut}
                  onChange={(e) => setData('statut', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="publie">Publié directement (Visible sur le site)</option>
                  <option value="en_attente">En attente de validation</option>
                  <option value="rejete">Rejeté (Masqué)</option>
                </select>
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
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {processing ? 'Enregistrement...' : (editingAvis ? 'Mettre à jour' : 'Enregistrer')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {isDeleteModalOpen && avisToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supprimer cet avis ?</h3>
              <p className="text-xs text-slate-500">
                Êtes-vous sûr de vouloir supprimer le témoignage de <strong>{avisToDelete.nom_client}</strong> ?
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
