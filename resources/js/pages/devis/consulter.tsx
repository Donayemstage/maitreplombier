import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
  Printer, MessageSquare, Phone, Mail, MapPin, 
  Calendar, CheckCircle, XCircle, Clock, ShieldCheck, 
  Wrench, Download, AlertTriangle, ArrowRight, X, Check
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
  token: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  adresse?: string | null;
  type_intervention: string;
  equipement?: string | null;
  urgence: string;
  message: string;
  date_intervention: string;
  heure_intervention?: string | null;
  materiel_fourni: boolean;
  statut: string;
  created_at: string;
  devis?: Devis | null;
  service?: any;
}

interface Props {
  contact: DemandeContact;
}

export default function DevisConsulter({ contact }: Props) {
  const [showRefusalModal, setShowRefusalModal] = useState(false);

  const { data: responseData, setData: setResponseData, post: postResponse, processing: responseProcessing } = useForm({
    decision: 'accepte',
    motif_refus: '',
  });

  const devis = contact.devis;
  const totalFCFA = devis ? Number(devis.total_devis).toLocaleString('fr-FR') : '0';
  const moFCFA = devis ? Number(devis.montant_main_oeuvre).toLocaleString('fr-FR') : '0';
  const matFCFA = devis ? Number(devis.montant_materiel).toLocaleString('fr-FR') : '0';
  const depFCFA = devis ? Number(devis.frais_deplacement).toLocaleString('fr-FR') : '0';

  const validiteDate = devis?.date_validite 
    ? new Date(devis.date_validite).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '15 jours à compter de l’émission';

  // WhatsApp redirection URL
  const generateWhatsAppUrl = (intention: 'confirmer' | 'refuser' | 'general' = 'general') => {
    let msg = `Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie.\n\n`;
    msg += `Bonjour Maître Plombier, je fais suite au devis N° DEVIS-${String(devis?.id || contact.id).padStart(4, '0')} d'un montant de ${totalFCFA} FCFA pour mon intervention (${contact.type_intervention}).\n\n`;

    if (intention === 'confirmer') {
      msg += `✅ Je souhaite CONFIRMER et accepter ce devis pour planifier l'intervention.`;
    } else if (intention === 'refuser') {
      msg += `❌ Je souhaite REFUSER ce devis pour le motif suivant : [Précisez votre raison ici].`;
    } else {
      msg += `Je souhaite échanger avec vous concernant cette proposition.`;
    }

    const cleanPhone = '237678953071';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleAcceptDevis = () => {
    postResponse(`/devis/consulter/${contact.token}/repondre`, {
      data: { decision: 'accepte' },
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Votre devis a bien été accepté ! Merci pour votre confiance.');
      },
    });
  };

  const handleRefuseDevis = (e: React.FormEvent) => {
    e.preventDefault();
    postResponse(`/devis/consulter/${contact.token}/repondre`, {
      data: { decision: 'refuse', motif_refus: responseData.motif_refus },
      preserveScroll: true,
      onSuccess: () => {
        toast.info('Votre retour a bien été enregistré. Merci.');
        setShowRefusalModal(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <Head title={`Devis Officiel #${contact.id} - Maître Plombier`} />

      {/* BARRE D'ACTIONS FLOTTANTE EN HAUT (MASQUÉE À L'IMPRESSION) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              MP
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Maître Plombier - Devis Officiel</h2>
              <p className="text-xs text-slate-500">Document téléchargeable et imprimable</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimer / Enregistrer PDF
            </button>

            <a
              href={generateWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* FEUILLE OFFICIELLE DU DEVIS (CENTRÉE, FINE & PROPRE) */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* EN-TÊTE DEVIS */}
        <div className="p-8 sm:p-10 border-b border-slate-200 bg-slate-50/50 print:bg-white">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-2xl tracking-tight">
                <Wrench className="w-7 h-7" />
                <span>MAÎTRE PLOMBIER</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Entreprise de plomberie sanitaire, dépannage rapide & rénovation
              </p>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p>📍 Douala, Cameroun</p>
                <p>📞 +237 678 95 30 71</p>
                <p>✉️ contact@maitreplombier.cm</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposition de Devis</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                DEVIS N° {String(devis?.id || contact.id).padStart(4, '0')}
              </h1>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p>Date d'émission : <strong>{new Date(contact.created_at).toLocaleDateString('fr-FR')}</strong></p>
                <p>Validité de l'offre : <strong>{validiteDate}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE D'ACCUEIL OFFICIEL (EXIGENCE DU CLIENT) */}
        <div className="mx-8 sm:mx-10 mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>
            Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie.
          </span>
        </div>

        {/* COORDONNÉES CLIENT & DÉTAILS DE L'INTERVENTION */}
        <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Destinataire (Client)</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{contact.nom}</h3>
            <div className="text-xs text-slate-600 mt-2 space-y-1">
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {contact.telephone}</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {contact.email}</p>
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {contact.ville} {contact.adresse ? `(${contact.adresse})` : ''}</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Objet de l'intervention</span>
            <h3 className="text-lg font-bold text-blue-600 mt-1">{contact.type_intervention}</h3>
            <div className="text-xs text-slate-600 mt-2 space-y-1">
              {contact.equipement && <p>Équipement concerné : <strong>{contact.equipement}</strong></p>}
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Intervention souhaitée : {new Date(contact.date_intervention).toLocaleDateString('fr-FR')}
                {contact.heure_intervention && ` à ${contact.heure_intervention.substring(0, 5)}`}
              </p>
              <p>Fourniture matériel : <strong>{contact.materiel_fourni ? 'Fourni par vos soins' : 'Inclus par Maître Plombier'}</strong></p>
            </div>
          </div>
        </div>

        {/* TABLEAU DU CHIFFRAGE */}
        <div className="p-8 sm:p-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3">Désignation de la prestation</th>
                <th className="py-3 text-right">Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-4">
                  <span className="font-bold text-slate-900 block">Main d'œuvre & Exécution technique</span>
                  <span className="text-xs text-slate-500">Déplacement de l'artisan plombier qualifié, diagnostic et réalisation complète des travaux.</span>
                </td>
                <td className="py-4 text-right font-bold text-slate-900">{moFCFA} FCFA</td>
              </tr>

              {Number(devis?.montant_materiel || 0) > 0 && (
                <tr>
                  <td className="py-4">
                    <span className="font-bold text-slate-900 block">Fournitures & Pièces de plomberie</span>
                    <span className="text-xs text-slate-500">Raccords, tuyauteries, joints et accessoires sanitaires de qualité certifiée.</span>
                  </td>
                  <td className="py-4 text-right font-bold text-slate-900">{matFCFA} FCFA</td>
                </tr>
              )}

              {Number(devis?.frais_deplacement || 0) > 0 && (
                <tr>
                  <td className="py-4">
                    <span className="font-bold text-slate-900 block">Frais de déplacement sur site</span>
                    <span className="text-xs text-slate-500">Acheminement de l'équipe et des outillages sur le lieu d'intervention ({contact.ville}).</span>
                  </td>
                  <td className="py-4 text-right font-bold text-slate-900">{depFCFA} FCFA</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Montant Total Net à Payer</span>
              <p className="text-xs text-slate-400">Aucun frais caché • Paiement à la fin des travaux</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400">{totalFCFA}</span>
              <span className="text-sm font-normal text-white ml-1">FCFA</span>
            </div>
          </div>

          {/* CONDITIONS & REMARQUES */}
          {devis?.conditions_execution && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 font-bold block">Conditions d'intervention & Garantie :</strong>
              <p className="leading-relaxed">{devis.conditions_execution}</p>
            </div>
          )}

          {/* STATUT DU DEVIS ET ACTIONS DU CLIENT (MASQUÉES À L'IMPRESSION) */}
          <div className="mt-8 border-t border-slate-200 pt-6 print:hidden space-y-4">
            
            {/* Si devis en attente */}
            {(!devis?.statut_client || devis.statut_client === 'en_attente') && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Votre devis est prêt et en attente de votre confirmation</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Vous pouvez valider ce devis pour lancer la programmation de l'intervention, ou continuer directement la conversation avec nous sur WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleAcceptDevis}
                    disabled={responseProcessing}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow transition cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accepter ce Devis
                  </button>

                  <a
                    href={generateWhatsAppUrl('confirmer')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Confirmer sur WhatsApp
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Télécharger / Imprimer en PDF
                  </button>

                  <button
                    onClick={() => setShowRefusalModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Refuser le devis
                  </button>
                </div>
              </div>
            )}

            {/* Si devis accepté */}
            {devis?.statut_client === 'accepte' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span>Devis Officiellement Accepté</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Nous vous remercions pour votre confiance ! Notre maître artisan se prépare pour votre intervention.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer / Enregistrer le Devis en PDF
                  </button>

                  <a
                    href={generateWhatsAppUrl('confirmer')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow hover:bg-emerald-700 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contacter l'artisan sur WhatsApp pour planifier l'heure exacte
                  </a>
                </div>
              </div>
            )}

            {/* Si devis refusé */}
            {devis?.statut_client === 'refuse' && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Devis Refusé ou Non retenu</span>
                </div>
                {devis.motif_refus && (
                  <p className="text-xs text-rose-700 italic">
                    Motif : {devis.motif_refus}
                  </p>
                )}
                <p className="text-xs text-rose-600">
                  Nous restons à votre entière disposition pour vos futurs projets ou travaux sanitaires.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* PIED DE PAGE DU DEVIS */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p><strong>Maître Plombier</strong> • SARL Artisanale Sanitaire & Tuyauterie • Douala, Cameroun</p>
          <p>Document généré électroniquement, valable comme bon pour accord après confirmation.</p>
        </div>

      </div>

      {/* MODALE DE REFUS DU DEVIS PAR LE CLIENT */}
      {showRefusalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Indiquer le motif du refus</h3>
              <button
                onClick={() => setShowRefusalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRefuseDevis} className="space-y-4">
              <p className="text-xs text-slate-500">
                Afin de nous aider à nous améliorer, pourriez-vous préciser brièvement la raison pour laquelle vous ne donnez pas suite à ce devis ?
              </p>

              <textarea
                rows={3}
                required
                value={responseData.motif_refus}
                onChange={(e) => setResponseData('motif_refus', e.target.value)}
                placeholder="Ex : Tarif supérieur au budget, report des travaux, autre solution trouvée..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none resize-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center gap-2 justify-end">
                <a
                  href={generateWhatsAppUrl('refuser')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Préciser sur WhatsApp
                </a>

                <button
                  type="submit"
                  disabled={responseProcessing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Confirmer le refus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
