import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Star, ShieldCheck, Check, X, ChevronLeft, ChevronRight, Search, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface TestimonialItem {
  id: number;
  nom_client: string;
  ville?: string | null;
  service_concerne?: string | null;
  note: number;
  commentaire: string;
  created_at?: string;
}

export interface PaginatedTestimonials {
  data: TestimonialItem[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface TestimonialsProps {
  testimonialsList?: PaginatedTestimonials | TestimonialItem[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonialsList }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Étape de la modale : 1 = Vérification client, 2 = Formulaire de dépôt d'avis
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState(''); // Téléphone ou Email
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Extraction des données en fonction du format (Paginator ou Tableau standard)
  const isPaginated = testimonialsList && 'data' in testimonialsList;
  const testimonialsData = isPaginated ? testimonialsList.data : (testimonialsList as TestimonialItem[]) || [];

  // Changement de page fluide via Inertia
  const handlePageChange = (url: string | null) => {
    if (url) {
      router.get(url, {}, {
        preserveScroll: true,
        preserveState: true,
      });
    }
  };

  // Formulaire Inertia
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    nom_client: '',
    ville: '',
    service_concerne: '',
    note: 5,
    commentaire: '',
  });

  // Ouverture de la modale (reprise à zéro)
  const handleOpenModal = () => {
    clearErrors();
    reset();
    setIdentifier('');
    setVerificationError('');
    setStep(1);
    setIsReviewModalOpen(true);
  };

  // ÉTAPE 1 : Vérification si le client a déjà effectué un contact/devis via Fetch API (Remplace Axios)
  const handleVerifyClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsVerifying(true);
    setVerificationError('');

    try {
      const response = await fetch('/avis/verify-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ identifier }),
      });

      const result = await response.json();

      if (response.ok && result.verified) {
        // Pré-remplissage dynamique des données trouvées
        setData({
          nom_client: result.client.nom || '',
          ville: result.client.ville || '',
          service_concerne: result.client.service || '',
          note: 5,
          commentaire: '',
        });
        toast.success('Client identifié avec succès !');
        setStep(2);
      } else {
        setVerificationError(
          result.message || 'Aucune intervention ou demande trouvée avec cet identifiant.'
        );
      }
    } catch (err) {
      setVerificationError(
        'Une erreur de connexion est survenue. Veuillez réinstaller ou vérifier votre réseau.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // ÉTAPE 2 : Soumission de l'avis
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    post('/avis', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Merci pour votre avis ! Votre témoignage sera publié après validation.');
        setIsReviewModalOpen(false);
        reset();
        setStep(1);
      },
      onError: () => {
        toast.error('Veuillez remplir correctement tous les champs obligatoires');
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Avis & Confiance Clients</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
              Ils nous font confiance à Douala & environs
            </h2>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              La satisfaction de nos clients est notre plus grande fierté. Découvrez les avis vérifiés de nos clients.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-xs cursor-pointer w-full md:w-auto"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Laisser un avis</span>
          </button>
        </div>

        {/* Grille des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex text-amber-400 gap-1 text-base">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= item.note ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-4xl text-blue-100 font-serif leading-none">“</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic line-clamp-4">
                  "{item.commentaire}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {getInitials(item.nom_client)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{item.nom_client}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" title="Client Vérifié" />
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    {item.ville && <span>{item.ville}</span>}
                    {item.service_concerne && <span className="text-blue-600 font-medium">• {item.service_concerne}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BARRE DE PAGINATION LARAVEL / INERTIA */}
        {isPaginated && testimonialsList.last_page > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-800">{testimonialsList.current_page}</span> sur <span className="font-bold text-slate-800">{testimonialsList.last_page}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(testimonialsList.prev_page_url)}
                disabled={!testimonialsList.prev_page_url}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Page précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {testimonialsList.links.slice(1, -1).map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(link.url)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      link.active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>

              <button
                onClick={() => handlePageChange(testimonialsList.next_page_url)}
                disabled={!testimonialsList.next_page_url}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 shadow-sm transition-all cursor-pointer"
                aria-label="Page suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODALE POUR LAISSER UN AVIS (2 ÉTAPES) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto animate-in fade-in zoom-in duration-200">

            {/* En-tête Modale */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-all"
                    title="Retour"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {step === 1 ? 'Vérification Client' : 'Donnez votre avis'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {step === 1 ? 'Étape 1 sur 2 : Authentification' : 'Étape 2 sur 2 : Votre expérience'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ÉTAPE 1 : Vérification client par Téléphone / Email */}
            {step === 1 && (
              <form onSubmit={handleVerifyClient} className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Afin de garantir l'authenticité de nos avis, veuillez saisir le <strong>numéro de téléphone</strong> ou l'<strong>e-mail</strong> utilisé lors de votre intervention ou demande de devis.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Téléphone ou E-mail d'intervention *
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ex : 691046405 ou alain.mballa@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                {verificationError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                    {verificationError}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || !identifier.trim()}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Vérifier mon dossier</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 2 : Rédaction de l'avis avec champs pré-remplis */}
            {step === 2 && (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Votre nom / Identité *
                  </label>
                  <input
                    type="text"
                    value={data.nom_client}
                    onChange={(e) => setData('nom_client', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.nom_client && <p className="text-red-500 text-xs mt-1">{errors.nom_client}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Ville / Quartier
                    </label>
                    <input
                      type="text"
                      value={data.ville}
                      onChange={(e) => setData('ville', e.target.value)}
                      placeholder="Ex : Douala (Akwa)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service reçu
                    </label>
                    <input
                      type="text"
                      value={data.service_concerne}
                      onChange={(e) => setData('service_concerne', e.target.value)}
                      placeholder="Ex : Dépannage fuite"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Note étoiles */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Note ({data.note} / 5 étoiles) *
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
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

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Votre commentaire *
                  </label>
                  <textarea
                    rows={3}
                    value={data.commentaire}
                    onChange={(e) => setData('commentaire', e.target.value)}
                    placeholder="Partagez votre expérience sur la ponctualité, le professionnalisme..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.commentaire && <p className="text-red-500 text-xs mt-1">{errors.commentaire}</p>}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {processing ? 'Envoi...' : 'Publier mon avis'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

export default Testimonials;