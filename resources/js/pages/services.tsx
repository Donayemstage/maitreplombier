import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from "@/layouts/AppLayout";
import { 
  Wrench, Droplets, Droplet, Flame, ShieldCheck, 
  Hammer, ShowerHead, Bath, Thermometer, Sparkles, 
  Zap, Check, ArrowRight, Phone, MessageSquare, 
  FileText, Clock, HelpCircle, X, Shield, Star,
  PhoneCall, Copy, Asterisk
} from 'lucide-react';

export interface ServiceItem {
  id: number;
  nom_service: string;
  description_service: string;
  description_detail_service: string;
  icone_service: string;
  prix_service: string | number;
  image_service: string;
}

interface ServicesProps {
  servicesList?: ServiceItem[];
  phoneNumber?: string;
  whatsappNumber?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 1,
    nom_service: "Dépannage & Recherche de Fuite",
    description_service: "Détection rapide et réparation immédiate de fuites d'eau visibles ou encastrées sans dégât inutile.",
    description_detail_service: "Notre service de détection et réparation de fuites comprend : inspection par caméra thermique, détection acoustique, remplacement des joints et raccords défectueux, mise sous pression des canalisations et remise en service garantie.",
    icone_service: "droplets",
    prix_service: 15000,
    image_service: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600",
  },
  {
    id: 2,
    nom_service: "Débouchage & Curage Canalisation",
    description_service: "Désobstruction haute pression de vos éviers, WC, douches et colonnes d'évacuation générales.",
    description_detail_service: "Intervention d'urgence avec matériel professionnel : furet électrique, hydrocurage haute pression, élimination des bouchons de calcaire, graisse ou racines, et vérification complète de l'écoulement.",
    icone_service: "wrench",
    prix_service: 20000,
    image_service: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600",
  },
  {
    id: 3,
    nom_service: "Chauffe-eau & Système Thermique",
    description_service: "Installation, entretien, détartrage et remplacement de chauffe-eau électriques et solaires.",
    description_detail_service: "Installation selon les normes de sécurité en vigueur, remplacement de résistances, thermostats, groupes de sécurité, détartrage complet de la cuve et diagnostic de consommation électrique.",
    icone_service: "flame",
    prix_service: 25000,
    image_service: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600",
  },
  {
    id: 4,
    nom_service: "Installation & Rénovation Sanitaire",
    description_service: "Pose de robinetterie haut de gamme, lavabos, WC suspendus, colonnes de douche et baignoires.",
    description_detail_service: "Conception sur-mesure et pose soignée de tous vos équipements sanitaires pour maisons, appartements et bureaux. Raccordement sécurisé, finitions soignées et garantie décennale.",
    icone_service: "shower-head",
    prix_service: 35000,
    image_service: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600",
  },
  {
    id: 5,
    nom_service: "Rénovation Complète Salle de Bain",
    description_service: "Transformation clé en main de votre salle de bain : plomberie, carrelage, étanchéité et sanitaires.",
    description_detail_service: "Prise en charge de A à Z de votre projet : réagencement de l'espace, création de douche à l'italienne, pose de meubles vasques modernes, étanchéité sous carrelage et ventilation.",
    icone_service: "bath",
    prix_service: 75000,
    image_service: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600",
  },
  {
    id: 6,
    nom_service: "Contrat d'Entretien & Maintenance",
    description_service: "Maintenance préventive pour particuliers, entreprises, copropriétés et résidences hôtelières.",
    description_detail_service: "Visites périodiques de contrôle, vérification des pressions, nettoyage des filtres, détection précoce des micro-fuites et intervention prioritaire 7j/7 sans supplément.",
    icone_service: "shield-check",
    prix_service: 30000,
    image_service: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600",
  },
];

const ICONS_MAP: Record<string, React.ElementType> = {
  wrench: Wrench,
  droplets: Droplets,
  droplet: Droplet,
  flame: Flame,
  'shower-head': ShowerHead,
  bath: Bath,
  hammer: Hammer,
  'shield-check': ShieldCheck,
  thermometer: Thermometer,
  sparkles: Sparkles,
  zap: Zap,
};

export default function Services({ 
  servicesList, 
  phoneNumber = '+237 678 95 30 71',
  whatsappNumber = '237678953071' 
}: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const prefilledMessage = "Bonjour Maître Plombier 🛠️, j'ai une urgence de plomberie à mon domicile. Merci de me prendre en charge rapidement !";

  const displayServices = (servicesList && servicesList.length > 0) ? servicesList : DEFAULT_SERVICES;

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    const IconComp = ICONS_MAP[iconName] || Wrench;
    return <IconComp className={className} />;
  };

  const handleEmergencyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      setIsEmergencyModalOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      <Head title="Nos Services de Plomberie - Maître Plombier" />

      {/* 1. EN-TÊTE / BANNIÈRE HERO (Style Stitch) */}
      <section className="bg-slate-50 py-12 md:py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* COLONNE GAUCHE : Textes & Boutons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>Prestations Professionnelles 24/7</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Des solutions complètes pour <span className="text-blue-600">toute votre plomberie</span>.
              </h1>

              <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
                Des maîtres artisans qualifiés à votre disposition à Douala et dans toute la région. Dépannage rapide, travaux soignés et devis sans engagement.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-blue-600/20 transition-all text-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Configurer mon devis en ligne
                </Link>

                <a
                  href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                  onClick={handleEmergencyClick}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Urgence 24/7 : {phoneNumber}
                </a>
              </div>
            </div>

            {/* COLONNE DROITE : Image Unsplash */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-blue-600/20 rounded-3xl blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"
                  alt="Travaux de plomberie et rénovation moderne"
                  className="relative rounded-2xl shadow-xl w-full h-[350px] md:h-[420px] object-cover border border-slate-200"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. GRILLE DYNAMIQUE DES SERVICES */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-7xl">

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">
            Une Solution pour Chaque Besoin
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Découvrez nos principales spécialités et demandez votre devis personnalisé en quelques clics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image d'illustration */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge Icône */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl text-blue-600 shadow-md">
                    {renderIcon(service.icone_service, "w-6 h-6")}
                  </div>

                  {/* Badge Tarif Indicatif */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
                    À partir de {Number(service.prix_service).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.nom_service}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {service.description_service}
                  </p>
                </div>
              </div>

              {/* Pied de carte avec boutons */}
              <div className="p-6 pt-0 space-y-3">
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Détails & prestations incluses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/contact"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                  >
                    <FileText className="w-3.5 h-3.5" /> Devis Express
                  </Link>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour Maître Plombier, je souhaite un renseignement ou un devis pour le service : ${service.nom_service}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center justify-center transition-colors"
                    title="Discuter sur WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 3. NOTRE MÉTHODOLOGIE D'INTERVENTION (4 ÉTAPES) */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Simplicité & Rigueur</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Comment se déroule votre intervention ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Étape 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base">Demande en ligne ou appel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Remplissez notre formulaire de devis ou contactez notre numéro d'urgence disponible 24h/24.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-base">Devis clair & détaillé</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nous analysons votre besoin et vous fournissons une estimation précise, transparente et sans mauvaise surprise.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-base">Intervention soignée</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nos artisans qualifiés interviennent à l'heure convenue avec l'outillage et les pièces certifiées nécessaires.
              </p>
            </div>

            {/* Étape 4 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 relative">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-base">Garantie & Suivi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contrôle de conformité après travaux, nettoyage du chantier et garantie sur toutes nos prestations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* MODALE URGENCE POUR DESKTOP */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsEmergencyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
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

              {/* Bloc Téléphone */}
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

              {/* Bouton d'action WhatsApp */}
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

              {/* Message de réassurance */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-left mt-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-tight">
                  <strong>Service Officiel Maître Plombier :</strong> Vous allez être redirigé vers l'application ou la version web de WhatsApp. Votre message d'urgence est déjà préparé !
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DÉTAIL D'UN SERVICE */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto animate-in fade-in zoom-in duration-200">

            {/* Header modal avec image */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-900">
              <img
                src={
                  selectedService.image_service.startsWith('http') 
                    ? selectedService.image_service 
                    : `/storage/services/${selectedService.image_service}`
                }
                alt={selectedService.nom_service}
                className="w-full h-full object-cover opacity-80"
              />

              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-blue-600 rounded-xl text-white">
                    {renderIcon(selectedService.icone_service, "w-5 h-5")}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    Prestation Maître Plombier
                  </span>
                </div>
                <h3 className="text-2xl font-black">{selectedService.nom_service}</h3>
              </div>
            </div>

            {/* Corps de la modale */}
            <div className="p-6 overflow-y-auto space-y-5">

              {/* Tarif indicatif */}
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase text-blue-900">Tarif de base indicatif :</span>
                  <p className="text-2xl font-black text-blue-600">
                    À partir de {Number(selectedService.prix_service).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 text-right">
                  Devis personnalisé<br />gratuit sous 24h
                </span>
              </div>

              {/* Description détaillée */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Détail de la prestation
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedService.description_detail_service}
                </p>
              </div>

              {/* Engagements */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Artisans qualifiés</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pièces et outillage certifiés</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Travaux garantis</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Intervention 7j/7</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/contact"
                  className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <FileText className="w-4 h-4" /> Demander un devis pour ce service
                </Link>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour Maître Plombier, je souhaite commander ou avoir un devis pour la prestation : ${selectedService.nom_service}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Layout Persistant Inertia
Services.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
