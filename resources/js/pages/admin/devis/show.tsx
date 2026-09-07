import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, 
  CheckCircle, XCircle, AlertTriangle, Printer, Send, 
  MessageSquare, Calculator, Shield, FileText, Check, 
  X, Copy, ExternalLink, User, Wrench, ChevronRight
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
  urgence: 'normale' | 'urgente' | 'tres_urgente' | string;
  message: string;
  date_intervention: string;
  heure_intervention?: string | null;
  materiel_fourni: boolean;
  photo_probleme?: string | null;
  statut: string;
  motif_refus?: string | null;
  created_at: string;
  devis?: Devis | null;
  service?: any;
}

interface Props {
  contact: DemandeContact;
}

const COMMON_REASONS = [
  "Zone géographique non couverte par nos équipes",
  "Indisponibilité technique pour la date souhaitée (planning saturé)",
  "Travaux hors champ d'expertise sanitaire (nécessite gros œuvre)",
  "Délai de validité du devis expiré sans confirmation du client",
  "Désaccord client sur le montant de la prestation",
  "Informations incomplètes ou client injoignable après relances",
  "Autre motif spécifique",
];

export default function DevisShow({ contact }: Props) {
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Formulaire de chiffrage
  const { data: devisData, setData: setDevisData, post: postDevis, processing: devisProcessing, errors: devisErrors } = useForm({
    montant_main_oeuvre: String(contact.devis?.montant_main_oeuvre || ''),
    montant_materiel: String(contact.devis?.montant_materiel || '0'),
    frais_deplacement: String(contact.devis?.frais_deplacement || '0'),
    total_devis: String(contact.devis?.total_devis || '0'),
    conditions_execution: contact.devis?.conditions_execution || 'Travaux garantis. Prévoir accès aux canalisations et coupure générale d’eau si nécessaire.',
    date_validite: contact.devis?.date_validite 
      ? contact.devis.date_validite.split('T')[0] 
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    statut_client: contact.devis?.statut_client || 'en_attente',
    send_email: false,
  });

  // Formulaire de mise à jour de statut avec motif
  const { data: statusData, setData: setStatusData, post: postStatus, processing: statusProcessing, errors: statusErrors } = useForm({
    statut_client: contact.devis?.statut_client || 'en_attente',
    motif_refus: contact.devis?.motif_refus || contact.motif_refus || '',
    notifier_client: true,
  });

  // Calcul du total
  const calculateTotal = (mo: string, mat: string, dep: string) => {
    const vMo = parseFloat(mo) || 0;
    const vMat = parseFloat(mat) || 0;
    const vDep = parseFloat(dep) || 0;
    return (vMo + vMat + vDep).toString();
  };

  const handleMoChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      montant_main_oeuvre: val,
      total_devis: calculateTotal(val, prev.montant_materiel, prev.frais_deplacement),
    }));
  };

  const handleMatChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      montant_materiel: val,
      total_devis: calculateTotal(prev.montant_main_oeuvre, val, prev.frais_deplacement),
    }));
  };

  const handleDepChange = (val: string) => {
    setDevisData(prev => ({
      ...prev,
      frais_deplacement: val,
      total_devis: calculateTotal(prev.montant_main_oeuvre, prev.montant_materiel, val),
    }));
  };

  // Sauvegarde du chiffrage
  const handleSubmitDevis = (e: React.FormEvent) => {
    e.preventDefault();
    postDevis(`/admin/devis/${contact.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Votre devis a été enregistré avec succès !", {
          description: `Total : ${Number(devisData.total_devis).toLocaleString('fr-FR')} FCFA`,
        });
      },
      onError: (err) => {
        toast.error("Erreur lors de l’enregistrement du devis", {
          description: Object.values(err)[0] as string || 'Vérifiez les champs.',
        });
      },
    });
  };

  // Envoi direct par email
  const handleSendEmailDirect = () => {
    if (!contact.devis && Number(devisData.total_devis) <= 0) {
      toast.error("Veuillez d’abord chiffrer et enregistrer le devis.");
      return;
    }

    setSendingEmail(true);
    router.post(`/admin/devis/${contact.id}/send-email`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Votre devis a été envoyé par mail", {
          description: `Destinataire : ${contact.email}`,
        });
        setSendingEmail(false);
      },
      onError: (err) => {
        toast.error("Erreur lors de l'envoi de l'email", {
          description: Object.values(err)[0] as string || 'Vérifiez votre configuration mail.',
        });
        setSendingEmail(false);
      },
    });
  };

  // Mise à jour du statut avec motif
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    postStatus(`/admin/devis/${contact.id}/update-status-reason`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Statut du devis mis à jour avec succès');
      },
      onError: (err) => {
        toast.error('Erreur lors de la mise à jour', {
          description: Object.values(err)[0] as string || 'Veuillez renseigner le motif.',
        });
      },
    });
  };

  // Lien de consultation client
  const clientConsultUrl = contact.token 
    ? `${window.location.origin}/devis/consulter/${contact.token}` 
    : '';

  const copyClientLink = () => {
    if (!clientConsultUrl) return;
    navigator.clipboard.writeText(clientConsultUrl);
    setCopiedLink(true);
    toast.success('Lien du devis client copié dans le presse-papiers');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Message WhatsApp pré-rempli
  const generateWhatsAppUrl = () => {
    const total = Number(contact.devis?.total_devis || devisData.total_devis).toLocaleString('fr-FR');
    const mo = Number(contact.devis?.montant_main_oeuvre || devisData.montant_main_oeuvre).toLocaleString('fr-FR');
    const mat = Number(contact.devis?.montant_materiel || devisData.montant_materiel).toLocaleString('fr-FR');
    const dep = Number(contact.devis?.frais_deplacement || devisData.frais_deplacement).toLocaleString('fr-FR');
    const validite = (contact.devis?.date_validite || devisData.date_validite)
      ? new Date(contact.devis?.date_validite || devisData.date_validite!).toLocaleDateString('fr-FR')
      : '15 jours';

    const message = `Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie.\n\nBonjour *${contact.nom}* 👋,\n\nVoici votre proposition de devis officiel pour votre intervention (*${contact.type_intervention}*) :\n\n🛠️ *Détail du Chiffrage :*\n- Main d'œuvre : *${mo} FCFA*\n${Number(mat) > 0 ? `- Matériel / Pièces : *${mat} FCFA*\n` : ''}${Number(dep) > 0 ? `- Déplacement : *${dep} FCFA*\n` : ''}\n💰 *TOTAL : ${total} FCFA*\n📅 *Offre valable jusqu'au :* ${validite}\n\n📄 *Consultez & imprimez votre devis en ligne :*\n${clientConsultUrl}\n\n👉 Vous pouvez confirmer ou refuser ce devis en répondant directement à ce message WhatsApp.\n\n*Maître Plombier* - Douala\n📞 +237 678 95 30 71`;

    const cleanPhone = contact.telephone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Badge statut
  const renderStatusBadge = () => {
    const status = contact.devis?.statut_client || 'en_attente';
    if (status === 'accepte') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Devis Accepté
        </span>
      );
    }
    if (status === 'refuse') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <XCircle className="w-4 h-4 text-rose-600" /> Devis Refusé / Rejeté
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <Clock className="w-4 h-4 text-amber-600" /> {contact.devis ? 'Devis envoyé (En attente)' : 'En attente de chiffrage'}
      </span>
    );
  };

  return (
    <>
      <Head title={`Devis #${contact.id} - ${contact.nom} - Maître Plombier`} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* BARRE SUPÉRIEURE DE NAVIGATION ET ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/devis"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Retour à la liste des devis"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Devis N° DEVIS-{String(contact.devis?.id || contact.id).padStart(4, '0')}
                </h1>
                {renderStatusBadge()}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Client : <strong>{contact.nom}</strong> • Demande reçue le {new Date(contact.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {clientConsultUrl && (
              <a
                href={clientConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                title="Consulter la page officielle envoyée au client (avec téléchargement PDF)"
              >
                <ExternalLink className="w-4 h-4" />
                Voir Page Devis Client
              </a>
            )}
          </div>
        </div>

        {/* MESSAGE D'ACCUEIL OFFICIEL RAPPELÉ */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-xs sm:text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Message d'accueil officiel :</strong> « Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie. »
            </span>
          </div>
          {clientConsultUrl && (
            <button
              onClick={copyClientLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white dark:bg-blue-900 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm cursor-pointer flex-shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Lien copié !' : 'Copier lien client'}
            </button>
          )}
        </div>

        {/* CONTENU PRINCIPAL EN DEUX COLONNES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLONNE GAUCHE (7/12) : DÉTAILS DEMANDE & CHIFFRAGE DEVIS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. CARTE COORDONNÉES & DEMANDE CLIENT */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Informations Client & Intervention
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {contact.urgence === 'tres_urgente' ? '🚨 TRÈS URGENT' : contact.urgence === 'urgente' ? '⚡ URGENT' : 'Normale'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Nom complet :</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{contact.nom}</p>
                </div>
                <div>
                  <span className="text-slate-400">Téléphone :</span>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {contact.telephone}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Email :</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {contact.email}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Localisation :</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {contact.ville} {contact.adresse ? `(${contact.adresse})` : ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Prestation demandée :</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">{contact.type_intervention}</p>
                </div>
                <div>
                  <span className="text-slate-400">Date souhaitée :</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(contact.date_intervention).toLocaleDateString('fr-FR')}
                    {contact.heure_intervention && ` vers ${contact.heure_intervention.substring(0, 5)}`}
                  </p>
                </div>
              </div>

              {/* Message client */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-medium block mb-1">Description détaillée du client :</span>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {contact.message}
                </p>
              </div>

              {/* Photo du problème */}
              {contact.photo_probleme && (
                <div className="text-xs space-y-1.5">
                  <span className="text-slate-400 font-medium">Photo fournie par le client :</span>
                  <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={`/storage/photo_probleme/${contact.photo_probleme}`}
                      alt="Photo du problème"
                      className="h-28 w-auto object-cover cursor-pointer hover:opacity-95"
                      onClick={() => setPreviewPhoto(true)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. FORMULAIRE DE CHIFFRAGE DU DEVIS */}
            <form onSubmit={handleSubmitDevis} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  Chiffrage Financier du Devis (FCFA)
                </h2>
                {contact.devis && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Chiffré
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Main d'œuvre *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={devisData.montant_main_oeuvre}
                      onChange={(e) => handleMoChange(e.target.value)}
                      placeholder="Ex : 25000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">FCFA</span>
                  </div>
                  {devisErrors.montant_main_oeuvre && (
                    <p className="text-red-500 text-xs mt-1">{devisErrors.montant_main_oeuvre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Matériel / Fournitures
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={devisData.montant_materiel}
                      onChange={(e) => handleMatChange(e.target.value)}
                      placeholder="Ex : 10000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">FCFA</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Déplacement
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={devisData.frais_deplacement}
                      onChange={(e) => handleDepChange(e.target.value)}
                      placeholder="Ex : 3000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">FCFA</span>
                  </div>
                </div>
              </div>

              {/* TOTAL ESTIMÉ MISE EN VALEUR */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Montant Total du Devis</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-0.5">
                    {Number(devisData.total_devis || 0).toLocaleString('fr-FR')} <span className="text-sm font-normal text-white">FCFA</span>
                  </h3>
                </div>

                <div className="text-right text-xs text-slate-300 space-y-0.5">
                  <p>MO : {Number(devisData.montant_main_oeuvre || 0).toLocaleString('fr-FR')} FCFA</p>
                  <p>Matériel : {Number(devisData.montant_materiel || 0).toLocaleString('fr-FR')} FCFA</p>
                  <p>Déplacement : {Number(devisData.frais_deplacement || 0).toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date limite de validité
                  </label>
                  <input
                    type="date"
                    value={devisData.date_validite}
                    onChange={(e) => setDevisData('date_validite', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={devisData.send_email}
                      onChange={(e) => setDevisData('send_email', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    Envoyer directement par email au client à l'enregistrement
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Conditions d'exécution & Remarques techniques
                </label>
                <textarea
                  rows={2}
                  value={devisData.conditions_execution || ''}
                  onChange={(e) => setDevisData('conditions_execution', e.target.value)}
                  placeholder="Garantie, délais d'approvisionnement, prérequis..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={devisProcessing}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {devisProcessing ? 'Enregistrement en cours...' : 'Enregistrer le Chiffrage du Devis'}
                </button>
              </div>
            </form>

          </div>

          {/* COLONNE DROITE (5/12) : DEUX CANAUX D'ENVOI & GESTION DU STATUT */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. LES DEUX MOYENS D'ENVOI (WHATSAPP & EMAIL) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Send className="w-4 h-4 text-blue-600" />
                Transmission au Client (2 Canaux)
              </h2>

              <p className="text-xs text-slate-500">
                Transmettez le devis officiel chiffré au client avec le message de bienvenue officiel et le lien de confirmation :
              </p>

              {/* Canal 1 : WhatsApp */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Canal 1 : WhatsApp Client
                  </span>
                  <span className="text-[11px] text-slate-500">{contact.telephone}</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Ouvre WhatsApp avec le devis complet, le message d'accueil et le lien sécurisé pour réponse.
                </p>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Envoyer le devis sur WhatsApp
                </a>
              </div>

              {/* Canal 2 : Email */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Canal 2 : Email Client
                  </span>
                  <span className="text-[11px] text-slate-500">{contact.email}</span>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-400">
                  Envoie le devis par email via Laravel avec le tableau chiffré et le bouton de redirection WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={handleSendEmailDirect}
                  disabled={sendingEmail}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {sendingEmail ? 'Envoi en cours...' : 'Envoyer le devis par Email'}
                </button>
              </div>

              {/* Historique d'envoi */}
              {contact.devis?.date_envoi && (
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Dernier envoi le {new Date(contact.devis.date_envoi).toLocaleString('fr-FR')} (Canal : {contact.devis.canal_envoi || 'email'})
                </div>
              )}
            </div>

            {/* 2. GESTION DU STATUT AVEC MOTIF OBLIGATOIRE EN CAS DE REFUS */}
            <form onSubmit={handleUpdateStatus} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Mise à jour du Statut
                </h2>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Décision sur le devis :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusData('statut_client', 'en_attente')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      statusData.statut_client === 'en_attente'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    En attente
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusData('statut_client', 'accepte')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      statusData.statut_client === 'accepte'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Accepté
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusData('statut_client', 'refuse')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      statusData.statut_client === 'refuse'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Refusé / Rejeté
                  </button>
                </div>
              </div>

              {/* SI REFUSÉ : MOTIF OBLIGATOIRE ET NOTIFICATION */}
              {statusData.statut_client === 'refuse' && (
                <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-3">
                  <label className="block text-xs font-bold text-rose-900 dark:text-rose-300">
                    Motif du rejet ou refus (Obligatoire) *
                  </label>
                  
                  {/* Suggestions courantes */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Motifs fréquents en plomberie :</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) setStatusData('motif_refus', e.target.value);
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <option value="">-- Choisir un motif type --</option>
                      {COMMON_REASONS.map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    value={statusData.motif_refus}
                    onChange={(e) => setStatusData('motif_refus', e.target.value)}
                    placeholder="Précisez la raison détaillée qui sera communiquée au client..."
                    className="w-full p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  {statusErrors.motif_refus && (
                    <p className="text-rose-600 text-xs">{statusErrors.motif_refus}</p>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-900 dark:text-rose-200">
                    <input
                      type="checkbox"
                      checked={statusData.notifier_client}
                      onChange={(e) => setStatusData('notifier_client', e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
                    />
                    Envoyer un email d'explication au client avec ce motif
                  </label>
                </div>
              )}

              {/* MOTIF ACTUEL SI DÉJÀ REFUSÉ */}
              {contact.devis?.statut_client === 'refuse' && contact.devis.motif_refus && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-semibold">Motif enregistré :</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{contact.devis.motif_refus}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={statusProcessing}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {statusProcessing ? 'Mise à jour...' : 'Mettre à jour le statut'}
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* MODALE PHOTO AGRANDIE */}
      {previewPhoto && contact.photo_probleme && (
        <div
          onClick={() => setPreviewPhoto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-black">
            <img
              src={`/storage/photo_probleme/${contact.photo_probleme}`}
              alt="Photo problème"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewPhoto(false)}
              className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
