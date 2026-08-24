import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from "@/layouts/AppLayout";
import { toast } from 'sonner';
import { 
  Phone, Mail, MapPin, ShieldCheck, Send, AlertTriangle, 
  X, Check, Copy, MessageSquare, PhoneCall, Clock, Navigation
} from 'lucide-react';

interface DevisForm {
  nom: string;
  telephone: string;
  email: string;
  //service: string;
  ville: string;
  message: string;
  adresse: string;
  type_intervention: string;
  equipement: string;
  urgence: string;
  date_intervention: string;
  heure_intervention: string;
  materiel_fourni: boolean;
  photo_probleme: File | null;
}

export default function Contact() {
  const { data, setData, post, processing, errors, reset } = useForm<DevisForm>({
    nom: '',
    telephone: '',
    email: '',
    //service: 'depannage',
    ville: '',
    message: '',
    adresse: '',
    type_intervention: '',
    equipement: '',
    urgence: 'normale',
    date_intervention: '',
    heure_intervention: '',
    materiel_fourni: false,
    photo_probleme: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const phoneNumber = '+237 678 95 30 71';
  const whatsappNumber = '237678953071';
  const prefilledMessage = "Bonjour Maître Plombier, j'ai une urgence de plomberie à mon domicile. Merci de me prendre en charge rapidement !";
  
  // Adresse pour la carte Google Maps
  const mapAddress = "Douala, Cameroun";
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const handleCallClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  post('/contact', {
    forceFormData: true,
    onSuccess: () => {
      toast.success('Votre demande a bien été enregistrée !', {
        description: 'Nous vous recontacterons sous 24h pour confirmer votre demande de devis.',
      });
      reset();
    },
    onError: () => {
      console.log('Erreurs de validation :', errors);
      toast.error("Erreur lors de l'envoi", {
        description: 'Veuillez vérifier les informations du formulaire.',
      });
    },
  });
};

  return (
    <div className="bg-slate-50 text-slate-800">
      <Head title="Contact & Devis - Maître Plombier" />

      {/* EN-TÊTE DE LA PAGE */}
      <section className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Contactez Maître Plombier</h1>
          <p className="text-slate-300 text-base md:text-lg">
            Une urgence, un projet de rénovation ou une question ? Nos équipes sont à votre écoute.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 container mx-auto px-4">
        
        {/* BANNIÈRE D'URGENCE */}
        <div className="mb-12 bg-red-600 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Urgence Plomberie / Fuite d'eau ?</h2>
              <p className="text-red-100 text-sm md:text-base">Intervention prioritaire 7j/7 - Équipe disponible rapidement.</p>
            </div>
          </div>

          <a
            href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
            onClick={handleCallClick}
            className="w-full md:w-auto px-8 py-4 bg-white text-red-600 font-extrabold rounded-xl hover:bg-red-50 transition-colors text-center text-lg flex items-center justify-center gap-3 shadow-md cursor-pointer"
          >
            <Phone className="w-6 h-6 animate-bounce" />
            <span>Appeler le 678 95 30 71</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLONNE GAUCHE : COORDONNÉES + GOOGLE MAPS (OPTIMISÉE) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:self-start">

            {/* BLOC COORDONNÉES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Nos Coordonnées</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Téléphone Service Client</h3>
                    <p className="text-slate-800 font-bold text-sm mt-0.5">+237 678 95 30 71</p>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Du Lundi au Samedi : 8h00 - 18h00
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Email</h3>
                    <p className="text-slate-700 text-sm mt-0.5">contact@maitreplombier.cm</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">Zone d'intervention</h3>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Douala et ses environs (Bonanjo, Akwa, Bonapriso, Ndogpassi...)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOC GOOGLE MAPS (HAUTEUR OPTIMISÉE H-80) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Localisation sur la carte</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Douala, CM</span>
              </div>
              <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <iframe
                  title="Localisation Maître Plombier"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={mapEmbedUrl}
                />
              </div>
            </div>

            {/* BLOC RASSURANCE */}
            <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Engagements Maître Plombier</span>
              </div>
              <ul className="text-slate-600 text-xs space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Devis clair et détaillé sans frais cachés</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Prise en charge rapide de vos demandes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Travail garanti et conforme aux normes</span>
                </li>
              </ul>
            </div>

          </div>

          {/* COLONNE DROITE : FORMULAIRE */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Demande de Devis / Message</h2>
            <p className="text-slate-600 mb-6 text-sm">Remplissez ce formulaire et nous vous recontacterons sous 24 heures.</p>

            <form onSubmit={handleSubmit} className="space-y-6" method="POST" encType="multipart/form-data">

              {/* INFORMATIONS CLIENT */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Vos informations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      value={data.nom}
                      onChange={(e) => setData('nom', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                        errors.nom ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Ex : Hugo Nguimfack"
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      value={data.telephone}
                      onChange={(e) => setData('telephone', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                        errors.telephone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Ex : 6XXXXXXXX"
                    />
                    {errors.telephone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.telephone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ville / Quartier *</label>
                    <input
                      type="text"
                      value={data.ville}
                      onChange={(e) => setData('ville', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                        errors.ville ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Ex : Akwa, Douala"
                    />
                    {errors.ville && <p className="text-red-500 text-xs mt-1 font-medium">{errors.ville}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse précise de l'intervention *</label>
                  <input
                    type="text"
                    value={data.adresse}
                    onChange={(e) => setData('adresse', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                      errors.adresse ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                    placeholder="Ex : Rue des écoles, près de la pharmacie..."
                  />
                  {errors.adresse && <p className="text-red-500 text-xs mt-1 font-medium">{errors.adresse}</p>}
                </div>
              </div>

              {/* BESOIN */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Votre besoin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type d'intervention *</label>
                    <select
                      value={data.type_intervention}
                      onChange={(e) => setData('type_intervention', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Sélectionnez une intervention</option>
                      <option value="depannage">Dépannage / Réparation</option>
                      <option value="installation">Installation sanitaire</option>
                      <option value="fuite">Recherche et réparation de fuite</option>
                      <option value="canalisation">Canalisation / Évacuation</option>
                      <option value="chauffe_eau">Installation / Réparation chauffe-eau</option>
                      <option value="salle_bain">Installation / Rénovation salle de bain</option>
                      <option value="wc">Installation / Réparation WC</option>
                      <option value="autre">Autre intervention</option>
                    </select>
                    {errors.type_intervention && <p className="text-red-500 text-xs mt-1 font-medium">{errors.type_intervention}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Équipement concerné</label>
                    <select
                      value={data.equipement}
                      onChange={(e) => setData('equipement', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">Sélectionnez un équipement</option>
                      <option value="robinet">Robinet</option>
                      <option value="evier">Évier</option>
                      <option value="lavabo">Lavabo</option>
                      <option value="douche">Douche</option>
                      <option value="baignoire">Baignoire</option>
                      <option value="wc">WC</option>
                      <option value="chauffe_eau">Chauffe-eau</option>
                      <option value="canalisation">Canalisation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* URGENCE */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quand souhaitez-vous notre intervention ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Niveau d'urgence *</label>
                    <select
                      value={data.urgence}
                      onChange={(e) => setData('urgence', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="normale">Intervention normale</option>
                      <option value="urgente">Intervention urgente</option>
                      <option value="tres_urgente">Très urgent - fuite importante</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date souhaitée</label>
                    <input
                      type="date"
                      value={data.date_intervention}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setData('date_intervention', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Heure souhaitée</label>
                    <input
                      type="time"
                      value={data.heure_intervention}
                      onChange={(e) => setData('heure_intervention', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Décrivez votre problème</h3>
                <label className="block text-sm font-medium text-slate-700 mb-1">Détails de l'intervention *</label>
                <textarea
                  rows={5}
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none resize-none transition-colors ${
                    errors.message ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                  placeholder="Décrivez votre problème le plus précisément possible..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Plus votre description est précise, plus nous pourrons préparer efficacement votre intervention.
                </p>
                {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
              </div>

              {/* MATERIEL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Avez-vous déjà acheté le matériel nécessaire ?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="materiel_fourni"
                      checked={data.materiel_fourni === true}
                      onChange={() => setData('materiel_fourni', true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Oui, j'ai déjà le matériel</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="materiel_fourni"
                      checked={data.materiel_fourni === false}
                      onChange={() => setData('materiel_fourni', false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Non, le plombier doit fournir le matériel</span>
                  </label>
                </div>
              </div>

              {/* PHOTO */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photo du problème <span className="text-slate-400 font-normal">(facultatif)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setData('photo_probleme', file);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Vous pouvez joindre une photo de la fuite, du robinet, du WC ou de l'équipement concerné.
                </p>
              </div>

              {/* BOUTON SOUMISSION */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="w-5 h-5" />
                {processing ? 'Envoi de votre demande...' : 'Envoyer ma demande de devis'}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* MODALE URGENCE DESKTOP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 pt-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <PhoneCall className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Contactez notre service d'urgence</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Composez ce numéro sur votre téléphone ou discutez directement via WhatsApp.
                </p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 mt-4">
                <span className="font-mono text-lg font-bold text-blue-900">{phoneNumber}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border shadow-sm hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter via WhatsApp</span>
                </a>
              </div>

              <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Service disponible 7j/7 pour les urgences à Douala et ses environs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Persistance du Layout Inertia
Contact.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;