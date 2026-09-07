import React, { useState, useMemo } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
  Search, Download, Eye, Phone, Mail, 
  Calendar, CheckCircle, Clock, XCircle, 
  AlertTriangle, MapPin, Wrench, Shield, 
  FileText, MessageSquare, Trash2, X, Check,
  DollarSign, Calculator, Send, ExternalLink,
  ChevronRight, ArrowRight, User
} from 'lucide-react';
import { toast } from 'sonner';

interface Devis {
  id: number;
  contact_id: number;
  montant_main_oeuvre: string | number;
  montant_materiel: string | number;
  frais_deplacement: string | number;
  total_devis: string | number;
  conditions_execution?: string | null;
  date_validite?: string | null;
  statut_client: 'en_attente' | 'accepte' | 'refuse';
  canal_envoi?: string | null;
  date_envoi?: string | null;
  motif_refus?: string | null;
}

interface DemandeContact {
  id: number;
  token?: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  adresse?: string | null;
  type_intervention: string;
  equipement?: string | null;
  urgence: 'normale' | 'urgente' | 'tres_urgente';
  message: string;
  date_intervention: string;
  heure_intervention?: string | null;
  materiel_fourni: boolean;
  photo_probleme?: string | null;
  statut: 'en_attente' | 'en_cours' | 'traite' | 'annule';
  motif_refus?: string | null;
  created_at: string;
  devis?: Devis | null;
}

interface PageProps {
  demandesList: {
    data: DemandeContact[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  stats?: {
    total: number;
    nouveau: number;
    en_cours: number;
    traite: number;
  };
  filters?: {
    search?: string;
    status?: string;
  };
  [key: string]: any;
}

export default function RequettesDevis({ demandesList, stats, filters }: PageProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [selectedDemande, setSelectedDemande] = useState<DemandeContact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'devis'>('details');

  // Formulaire de Chiffrage Devis
  const { data: devisData, setData: setDevisData, post: postDevis, processing: devisProcessing, errors: devisErrors, reset: resetDevis } = useForm({
    montant_main_oeuvre: '',
    montant_materiel: '0',
    frais_deplacement: '0',
    total_devis: '0',
    conditions_execution: '',
    date_validite: '',
    statut_client: 'en_attente',
    statut_demande: 'en_cours',
  });

  // Calcul automatique du total
  const calculateTotal = (mainOeuvre: string, materiel: string, deplacement: string) => {
    const mo = parseFloat(mainOeuvre) || 0;
    const mat = parseFloat(materiel) || 0;
    const dep = parseFloat(deplacement) || 0;
    return (mo + mat + dep).toString();
  };

  const handleMainOeuvreChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      montant_main_oeuvre: val,
      total_devis: calculateTotal(val, prev.montant_materiel, prev.frais_deplacement),
    }));
  };

  const handleMaterielChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      montant_materiel: val,
      total_devis: calculateTotal(prev.montant_main_oeuvre, val, prev.frais_deplacement),
    }));
  };

  const handleDeplacementChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      frais_deplacement: val,
      total_devis: calculateTotal(prev.montant_main_oeuvre, prev.montant_materiel, val),
    }));
  };

  // Ouvrir les détails et pré-remplir le formulaire
  const handleOpenDetails = (demande: DemandeContact, defaultTab: 'details' | 'devis' = 'details') => {
    setSelectedDemande(demande);
    setActiveTab(defaultTab);
    
    if (demande.devis) {
      setDevisData({
        montant_main_oeuvre: String(demande.devis.montant_main_oeuvre || ''),
        montant_materiel: String(demande.devis.montant_materiel || '0'),
        frais_deplacement: String(demande.devis.frais_deplacement || '0'),
        total_devis: String(demande.devis.total_devis || '0'),
        conditions_execution: demande.devis.conditions_execution || '',
        date_validite: demande.devis.date_validite ? demande.devis.date_validite.split('T')[0] : '',
        statut_client: demande.devis.statut_client || 'en_attente',
        statut_demande: demande.statut || 'en_cours',
      });
    } else {
      setDevisData({
        montant_main_oeuvre: '',
        montant_materiel: '0',
        frais_deplacement: '0',
        total_devis: '0',
        conditions_execution: '',
        date_validite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valide 15j
        statut_client: 'en_attente',
        statut_demande: 'en_cours',
      });
    }
    
    setIsDetailModalOpen(true);
  };

  // Soumission du chiffrage de devis
  const handleSaveDevis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemande) return;

    postDevis(`/admin/devis/${selectedDemande.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Le devis a été enregistré avec succès !', {
          description: `Total : ${Number(devisData.total_devis).toLocaleString('fr-FR')} FCFA`,
        });
        setIsDetailModalOpen(false);
      },
      onError: (err) => {
        toast.error('Erreur lors de l’enregistrement du devis', {
          description: Object.values(err)[0] as string || 'Vérifiez les champs renseignés.',
        });
      },
    });
  };

  // Mise à jour rapide du statut
  const handleQuickStatusChange = (demandeId: number, newStatus: string) => {
    router.patch(`/admin/devis/${demandeId}/status`, { statut: newStatus }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Statut mis à jour');
      },
    });
  };

  // Suppression d'une demande
  const handleDeleteDemande = () => {
    if (!selectedDemande) return;
    router.delete(`/admin/devis/${selectedDemande.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Demande supprimée avec succès');
        setIsDeleteModalOpen(false);
        setIsDetailModalOpen(false);
      },
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!demandesList.data || demandesList.data.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const headers = ['ID', 'Nom', 'Téléphone', 'Email', 'Ville', 'Adresse', 'Intervention', 'Urgence', 'Date Souhaitée', 'Statut Demande', 'Statut Devis', 'Total Devis (FCFA)', 'Canal Envoi', 'Motif Refus', 'Date de création'];
    const rows = demandesList.data.map(d => [
      d.id,
      `"${d.nom.replace(/"/g, '""')}"`,
      `"${d.telephone}"`,
      `"${d.email}"`,
      `"${d.ville}"`,
      `"${(d.adresse || '').replace(/"/g, '""')}"`,
      `"${d.type_intervention}"`,
      `"${d.urgence}"`,
      `"${d.date_intervention}"`,
      `"${d.statut}"`,
      `"${d.devis?.statut_client || 'Non chiffré'}"`,
      d.devis?.total_devis || 0,
      `"${d.devis?.canal_envoi || 'Non envoyé'}"`,
      `"${(d.devis?.motif_refus || d.motif_refus || '').replace(/"/g, '""')}"`,
      `"${new Date(d.created_at).toLocaleDateString('fr-FR')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `demandes_devis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export CSV téléchargé');
  };

  // Filtrage local en temps réel
  const filteredDemandes = useMemo(() => {
    return demandesList.data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type_intervention.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'nouveau') return !item.devis && item.statut === 'en_attente';
      if (statusFilter === 'en_attente') return item.statut === 'en_cours' || item.devis?.statut_client === 'en_attente';
      if (statusFilter === 'accepte') return item.statut === 'traite' || item.devis?.statut_client === 'accepte';
      if (statusFilter === 'refuse') return item.statut === 'annule' || item.devis?.statut_client === 'refuse';

      return true;
    });
  }, [demandesList.data, searchTerm, statusFilter]);

  // Libellé propre pour type intervention
  const formatInterventionLabel = (type: string) => {
    const labels: Record<string, string> = {
      depannage: 'Dépannage / Réparation',
      installation: 'Installation sanitaire',
      fuite: 'Recherche & Réparation fuite',
      canalisation: 'Canalisation / Évacuation',
      chauffe_eau: 'Chauffe-eau / Cumulus',
      salle_bain: 'Rénovation salle de bain',
      wc: 'Installation / Réparation WC',
      autre: 'Autre intervention',
    };
    return labels[type] || type;
  };

  // Badge de statut stylisé
  const renderStatusBadge = (demande: DemandeContact) => {
    if (!demande.devis) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800">
          <Clock className="w-3.5 h-3.5 text-blue-500" /> Nouveau
        </span>
      );
    }

    const statusMap: Record<string, { label: string; style: string; icon: React.ElementType }> = {
      en_attente: { label: 'Devis envoyé', style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800', icon: Clock },
      accepte: { label: 'Devis accepté', style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800', icon: CheckCircle },
      refuse: { label: 'Refusé / Annulé', style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800', icon: XCircle },
    };

    const current = statusMap[demande.devis.statut_client] || statusMap['en_attente'];
    const IconComponent = current.icon;
    const motif = demande.devis.motif_refus || demande.motif_refus;

    return (
      <div className="flex flex-col items-start gap-1">
        <span 
          title={motif ? `Motif : ${motif}` : undefined}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.style}`}
        >
          <IconComponent className="w-3.5 h-3.5" /> {current.label}
        </span>
        {demande.devis.statut_client === 'refuse' && motif && (
          <span className="text-[10px] text-rose-600 dark:text-rose-400 italic max-w-[150px] truncate" title={motif}>
            « {motif} »
          </span>
        )}
      </div>
    );
  };

  // Badge d'urgence
  const renderUrgenceBadge = (urgence: string) => {
    switch (urgence) {
      case 'tres_urgente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-600" /> TRÈS URGENT
          </span>
        );
      case 'urgente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
            <Clock className="w-3 h-3 text-orange-600" /> Urgent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            Normale
          </span>
        );
    }
  };

  // Générateur de message WhatsApp pré-rempli pour le client
  const generateWhatsAppMessage = () => {
    if (!selectedDemande) return '';
    const nom = selectedDemande.nom;
    const intervention = formatInterventionLabel(selectedDemande.type_intervention);
    const total = Number(devisData.total_devis).toLocaleString('fr-FR');
    const mo = Number(devisData.montant_main_oeuvre).toLocaleString('fr-FR');
    const mat = Number(devisData.montant_materiel).toLocaleString('fr-FR');
    const dep = Number(devisData.frais_deplacement).toLocaleString('fr-FR');
    const validite = devisData.date_validite ? new Date(devisData.date_validite).toLocaleDateString('fr-FR') : '15 jours';

    return `Bonjour *${nom}* 👋,\n\nVoici votre proposition de devis officiel de la part de *Maître Plombier* pour votre demande (*${intervention}*) :\n\n🛠️ *Détail du Chiffrage :*\n- Main d'œuvre : *${mo} FCFA*\n- Fournitures / Matériel : *${mat} FCFA*\n- Déplacement : *${dep} FCFA*\n\n💰 *MONTANT TOTAL : ${total} FCFA*\n📅 *Offre valable jusqu'au :* ${validite}\n${devisData.conditions_execution ? `📝 *Remarques :* ${devisData.conditions_execution}\n` : ''}\nRestant à votre entière disposition pour convenir de l'intervention.\n\n*Maître Plombier*\n📞 +237 678 95 30 71`;
  };

  return (
    <>
      <Head title="Demandes de Devis - Admin Maître Plombier" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* En-tête & Bouton Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Demandes de Devis
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gérez, chiffrez et suivez toutes les requêtes de vos clients en temps réel.
            </p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm w-full md:w-auto cursor-pointer"
          >
            <Download className="w-4 h-4" /> Exporter en CSV
          </button>
        </div>

        {/* Cartes KPI Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reçu</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.total ?? demandesList.data.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">À Traiter</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats?.nouveau ?? 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">En Cours</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats?.en_cours ?? 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Traités</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats?.traite ?? 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barre de Filtres et Recherche */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, tel, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tous les statuts ({demandesList.data.length})</option>
              <option value="nouveau">Nouveaux (Non chiffrés)</option>
              <option value="en_attente">En cours / Devis transmis</option>
              <option value="accepte">Traités / Acceptés</option>
              <option value="refuse">Annulés / Refusés</option>
            </select>
          </div>
        </div>

        {/* 1. AFFICHAGE MOBILE (Cartes verticales) */}
        <div className="flex flex-col gap-4 md:hidden">
          {filteredDemandes.length > 0 ? (
            filteredDemandes.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</span>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{item.nom}</h3>
                    <p className="text-xs text-slate-500">{item.ville}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {renderStatusBadge(item)}
                    {renderUrgenceBadge(item.urgence)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Service :</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{formatInterventionLabel(item.type_intervention)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Date prévue :</span>
                    <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.date_intervention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      {item.heure_intervention && ` à ${item.heure_intervention.substring(0, 5)}`}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {item.telephone}</span>
                    {item.devis && (
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {Number(item.devis.total_devis).toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${item.telephone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                      title="Contacter sur WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${item.telephone.replace(/\s+/g, '')}`}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Appeler"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/devis/${item.id}`}
                      className="inline-flex items-center gap-1 bg-slate-900 dark:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                      title="Ouvrir la page dédiée du devis"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Fiche Devis
                    </Link>
                    <button 
                      onClick={() => handleOpenDetails(item, 'details')}
                      className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              Aucune demande de devis trouvée.
            </div>
          )}
        </div>

        {/* 2. AFFICHAGE DESKTOP (Tableau complet) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Client & Lieu</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Prestation</th>
                  <th className="py-3.5 px-6">Urgence / Date</th>
                  <th className="py-3.5 px-6">Devis (FCFA)</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredDemandes.length > 0 ? (
                  filteredDemandes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.nom}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.ville}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" /> {item.telephone}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" /> {item.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {formatInterventionLabel(item.type_intervention)}
                        </div>
                        {item.equipement && (
                          <span className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-0.5 inline-block">
                            {item.equipement}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="space-y-1">
                          {renderUrgenceBadge(item.urgence)}
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(item.date_intervention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {item.devis ? (
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {Number(item.devis.total_devis).toLocaleString('fr-FR')} FCFA
                            </span>
                            <p className="text-[11px] text-slate-500">Chiffré</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenDetails(item, 'devis')}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" /> Chiffrer
                          </button>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderStatusBadge(item)}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/devis/${item.id}`}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Ouvrir la page dédiée du devis"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>

                          <button 
                            onClick={() => handleOpenDetails(item, 'details')}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                            title="Voir les détails complets"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleOpenDetails(item, 'devis')}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                            title="Gérer le devis financier"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedDemande(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                            title="Supprimer la demande"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                      Aucune demande de devis enregistrée correspondant aux critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODALE DÉTAILS DE LA DEMANDE ET CHIFFRAGE DU DEVIS */}
      {isDetailModalOpen && selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto">
            
            {/* Header de la modale */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{selectedDemande.nom}</h2>
                  <p className="text-xs text-slate-500">
                    Demande #{selectedDemande.id} reçue le {new Date(selectedDemande.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedDemande)}
                <Link
                  href={`/admin/devis/${selectedDemande.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-blue-600 text-xs font-bold hover:opacity-90 transition shadow-sm"
                  title="Ouvrir la page dédiée"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Fiche complète
                </Link>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Onglets de navigation dans la modale */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                Détails de la demande
              </button>

              <button
                onClick={() => setActiveTab('devis')}
                className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'devis'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Chiffrage & Devis Financier
                {selectedDemande.devis && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded-full font-bold">
                    Prêt
                  </span>
                )}
              </button>
            </div>

            {/* Contenu de la modale */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {activeTab === 'details' && (
                <div className="space-y-6">
                  
                  {/* Actions Rapides de Contact */}
                  <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-blue-900 dark:text-blue-300 font-semibold">Téléphone client :</p>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{selectedDemande.telephone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedDemande.telephone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" /> Appeler
                      </a>
                      <a
                        href={`https://wa.me/${selectedDemande.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedDemande.nom}, Maître Plombier fait suite à votre demande de devis pour ${formatInterventionLabel(selectedDemande.type_intervention)}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <a
                        href={`mailto:${selectedDemande.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    </div>
                  </div>

                  {/* Grille d'informations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Bloc 1 : Coordonnées et localisation */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" /> Lieu de l'intervention
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400 text-xs">Ville / Quartier :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDemande.ville}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Adresse précise :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDemande.adresse || 'Non précisée'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Email client :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDemande.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bloc 2 : Nature des travaux */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-600" /> Paramètres d'intervention
                      </h3>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400 text-xs">Prestation :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{formatInterventionLabel(selectedDemande.type_intervention)}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Équipement :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDemande.equipement || 'Standard'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Niveau d'urgence :</span>
                          <div className="mt-1">{renderUrgenceBadge(selectedDemande.urgence)}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Matériel fourni :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {selectedDemande.materiel_fourni ? '✅ Fourni par le client' : '🔧 À fournir par le plombier'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 text-xs">Date et Heure souhaitée :</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {new Date(selectedDemande.date_intervention).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                            {selectedDemande.heure_intervention && ` vers ${selectedDemande.heure_intervention.substring(0, 5)}`}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bloc 3 : Description détaillée du problème */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Message & Description du problème par le client
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {selectedDemande.message}
                    </p>
                  </div>

                  {/* Bloc 4 : Photo du problème si fournie */}
                  {selectedDemande.photo_probleme && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Photo jointe par le client
                      </h3>
                      <div className="relative inline-block border rounded-2xl overflow-hidden shadow-sm group">
                        <img
                          src={`/storage/photo_probleme/${selectedDemande.photo_probleme}`}
                          alt="Photo du problème"
                          className="max-h-64 rounded-2xl object-cover cursor-pointer hover:opacity-90 transition"
                          onClick={() => setPreviewImage(`/storage/photo_probleme/${selectedDemande.photo_probleme}`)}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(`/storage/photo_probleme/${selectedDemande.photo_probleme}`)}
                          className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Agrandir
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bouton pour basculer vers le devis */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => setActiveTab('devis')}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      <Calculator className="w-4 h-4" />
                      {selectedDemande.devis ? 'Modifier le chiffrage' : 'Établir le devis financier'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {activeTab === 'devis' && (
                <form onSubmit={handleSaveDevis} className="space-y-6">
                  
                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                    <Calculator className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm">Chiffrage officiel du devis :</span>
                      <p className="mt-0.5">Renseignez les montants en FCFA. Le total est automatiquement calculé et prêt à être envoyé par WhatsApp ou validé dans le système.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Main d'œuvre (FCFA) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={devisData.montant_main_oeuvre}
                        onChange={(e) => handleMainOeuvreChange(e.target.value)}
                        placeholder="Ex : 15000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {devisErrors.montant_main_oeuvre && (
                        <p className="text-red-500 text-xs mt-1">{devisErrors.montant_main_oeuvre}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Matériel / Fournitures (FCFA)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={devisData.montant_materiel}
                        onChange={(e) => handleMaterielChange(e.target.value)}
                        placeholder="Ex : 5000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Frais de déplacement (FCFA)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={devisData.frais_deplacement}
                        onChange={(e) => handleDeplacementChange(e.target.value)}
                        placeholder="Ex : 2000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* TOTAL DEVIS MISE EN AVANT */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Général Devis</p>
                      <h4 className="text-3xl font-extrabold text-blue-400 mt-1">
                        {Number(devisData.total_devis || 0).toLocaleString('fr-FR')} <span className="text-sm font-normal text-white">FCFA</span>
                      </h4>
                    </div>

                    <div className="text-right text-xs text-slate-300 space-y-1">
                      <p>MO : {Number(devisData.montant_main_oeuvre || 0).toLocaleString('fr-FR')} FCFA</p>
                      <p>Mat : {Number(devisData.montant_materiel || 0).toLocaleString('fr-FR')} FCFA</p>
                      <p>Dép : {Number(devisData.frais_deplacement || 0).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Statut du Devis Client
                      </label>
                      <select
                        value={devisData.statut_client}
                        onChange={(e) => setDevisData('statut_client', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en_attente">En attente de réponse</option>
                        <option value="accepte">Accepté par le client</option>
                        <option value="refuse">Refusé / Annulé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Date de validité de l'offre
                      </label>
                      <input
                        type="date"
                        value={devisData.date_validite}
                        onChange={(e) => setDevisData('date_validite', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Conditions d'exécution & Remarques techniques
                    </label>
                    <textarea
                      rows={3}
                      value={devisData.conditions_execution}
                      onChange={(e) => setDevisData('conditions_execution', e.target.value)}
                      placeholder="Ex : Travaux garantis 6 mois. Prévoir coupure d'eau générale pendant l'intervention..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions Devis */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <a
                      href={`https://wa.me/${selectedDemande.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Envoyer le devis par WhatsApp
                    </a>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsDetailModalOpen(false)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={devisProcessing}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {devisProcessing ? 'Enregistrement...' : 'Enregistrer le Devis'}
                      </button>
                    </div>
                  </div>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* MODALE CONFIRMATION SUPPRESSION */}
      {isDeleteModalOpen && selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirmer la suppression</h3>
              <p className="text-xs text-slate-500">
                Êtes-vous sûr de vouloir supprimer la demande de <strong>{selectedDemande.nom}</strong> ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteDemande}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APERÇU AGRANDI PHOTO */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={previewImage} alt="Aperçu agrandi" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-full hover:bg-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </>
  );
}