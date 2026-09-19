import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  FileText, 
  PhoneCall, 
  ChevronRight, 
  CheckCircle2, 
  Send, 
  Zap, 
  Lock, 
  BadgeCheck 
} from 'lucide-react';

interface CguSummaryItem {
  id: string;
  title: string;
}

interface CompanyInfo {
  fullName: string;
  domain: string;
  phone: string;
  whatsappPhone: string;
  updatedAt: string;
}

interface TermsOfServiceProps {
  company: CompanyInfo;
  cguSummary: CguSummaryItem[];
}

export default function TermsOfService({ company, cguSummary }: TermsOfServiceProps) {
  const whatsappUrl = `https://wa.me/${company.whatsappPhone}?text=${encodeURIComponent(
    "Bonjour, j'ai une urgence plomberie (fuite/panne). Voici les photos :"
  )}`;

  return (
    <AppLayout>
      <Head title="Conditions Générales d'Utilisation" />

      {/* Conteneur Pleine Largeur avec Fond Sombre */}
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-8 lg:px-12">
        
        {/* Fil d'Ariane & Badge */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">Conditions Générales d'Utilisation (CGU)</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-slate-300">
              Mise à jour : {company.updatedAt}
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-xs text-amber-500 font-semibold">Norme RGPD & RGE Valide</span>
          </div>
        </div>

        {/* Titre Principal */}
        <div className="w-full max-w-5xl mb-12">
          <div className="inline-flex items-center gap-2 text-amber-500 text-sm font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Cadre Juridique & Transparence Tarifaire</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Conditions Générales d'Utilisation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Une relation de confiance claire, transparente et sans mauvaise surprise pour vos dépannages et travaux de génie thermique. Découvrez nos engagements contractuels, notre protocole d’intervention d'urgence et le fonctionnement de vos devis gratuits.
          </p>
        </div>

        {/* Section Alertes & Actions d'Urgence */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Bloc Urgence WhatsApp */}
          <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs uppercase tracking-wider font-bold">Astreinte Directe WhatsApp 24h/7j</span>
                </div>
                <span className="text-xs text-slate-400">Dépannage express en 30 min</span>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Urgence Fuite, Dégât des Eaux ou Panne Chauffe-eau ?
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Envoyez directement une <strong className="text-white">photo ou vidéo de la panne</strong> sur notre WhatsApp certifié pour un pré-diagnostic immédiat et la mobilisation d’un artisan d'astreinte.
                  </p>
                </div>
              </div>

              {/* Indicateurs Métriques */}
              <div className="grid grid-cols-3 gap-4 my-6 py-4 bg-slate-950/80 rounded-xl px-4 border border-slate-800/50">
                <div>
                  <span className="block text-xl font-bold text-amber-500">5 min</span>
                  <span className="text-xs text-slate-400">Délai réponse</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-sky-400">100%</span>
                  <span className="text-xs text-slate-400">Devis annoncé avant</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-emerald-400">24h / 7j</span>
                  <span className="text-xs text-slate-400">Sans interruption</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Échanger en direct sur WhatsApp</span>
              </a>
              <span className="text-xs text-slate-400">
                Diagnostic immédiat • Envoi médias crypté
              </span>
            </div>
          </div>

          {/* Bloc Devis Contact */}
          <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-3">
                <FileText className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider font-bold">Devis Travaux & Rénovation</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Devis 100% Gratuit via notre Page Contact
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Pour vos projets de modernisation sanitaire, pose de pompe à chaleur ou rénovation complète de canalisation, formulez votre demande en 2 minutes.
              </p>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zéro frais d'établissement de devis</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chiffrage détaillé pièce par pièce & main-d'œuvre</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validité garantie 30 jours calendaires</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3.5 rounded-xl transition-colors"
              >
                <span>Demander un devis via la page Contact</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Cartes Principes Clés */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">1. Gratuité & Sans Engagement</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Toute élaboration d'estimation préalable est strictly gratuite. Vous demeurez libre de valider ou refuser sans la moindre pénalité.
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">2. Transparence Tarifaire Fixée</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Aucun coup de clé n'est donné avant votre signature du bon d'intervention ou l'acceptation numérique explicite du devis chiffré.
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-white">3. Conformité Artisanale</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Tous nos travaux de plomberie et de génie climatique sont couverts par l'assurance décennale SMABTP et nos qualifications RGE/Qualibat.
            </p>
          </div>
        </div>

        {/* Layout Déroulé des Articles */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sommaire / Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white font-bold border-b border-slate-800 pb-3">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Sommaire des CGU</span>
              </div>
              <nav className="flex flex-col gap-1 text-sm">
                {cguSummary.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-500" />
                  <span>Assistance : {company.phone}</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Contenu des Articles */}
          <main className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Article 1 */}
            <article id="art-1" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Article 01</span>
                <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">Champ d'Application</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Objet du Site & Prestations de Génie Plomberie
              </h2>
              <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
                <p>
                  Le présent site internet accessible à l’adresse <span className="text-white font-semibold">{company.domain}</span> a pour objet de présenter l’ensemble des prestations d'artisanat du bâtiment, de génie climatique et de plomberie sanitaire opérées par la société <strong className="text-white">{company.fullName}</strong>.
                </p>
                <p>Les services proposés englobent sans restriction :</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                  <li>Le dépannage urgent de plomberie générale (recherche non destructive de fuite d'eau, dégorgement de conduits par hydrocurage, réparation de tuyauterie cuivre et multicouche).</li>
                  <li>L’installation, le remplacement et le désembouage de systèmes de chauffage et chauffe-eaux thermodynamiques.</li>
                  <li>La rénovation d'installations sanitaires haut de gamme selon les normes DTU 60.1.</li>
                </ul>
                <p>
                  La consultation du site et l'utilisation de ses fonctionnalités de contact impliquent l'adhésion pleine et entière de l'Utilisateur aux présentes Conditions Générales d'Utilisation.
                </p>
              </div>
            </article>

            {/* Article 2 */}
            <article id="art-2" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Article 02</span>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">Procédure Formulaire Contact</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Modalités de Demande de Devis via la Page Contact
              </h2>
              <div className="text-sm text-slate-300 space-y-6 leading-relaxed">
                <p>
                  Conformément à notre charte d'excellence artisanale, tout projet de travaux planifiés ou de rénovation peut faire l’objet d’une demande d’évaluation budgétaire préalable via le formulaire dédié de notre page <strong>Contact</strong>.
                </p>

                <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/60 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                    Cycle de traitement de votre demande de devis :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <div>
                        <h5 className="font-semibold text-white text-sm">Renseignement en Ligne</h5>
                        <p className="text-xs text-slate-400 mt-1">Saisie des caractéristiques du chantier et localisation géographique.</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <div>
                        <h5 className="font-semibold text-white text-sm">Audit par un Maître Artisan</h5>
                        <p className="text-xs text-slate-400 mt-1">Examen technique sous 30 min à 2h par notre métreur spécialisé.</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <div>
                        <h5 className="font-semibold text-white text-sm">Transmission Chiffrée</h5>
                        <p className="text-xs text-slate-400 mt-1">Réception du devis normé par email avec le détail pièces et main-d'œuvre.</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800/80 flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">4</span>
                      <div>
                        <h5 className="font-semibold text-white text-sm">Validation Contractuelle</h5>
                        <p className="text-xs text-slate-400 mt-1">Aucune intervention n'est initiée sans votre signature expresse.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 3 */}
            <article id="art-3" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Article 03</span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Dépannage d'Urgence 24/7</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Interventions d'Urgence & Prise de Contact via WhatsApp
              </h2>
              <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
                <p>
                  En cas de sinistre avéré (dégât des eaux en cours, rupture de canalisation sous pression, engorgement total des évacuations ou coupure d’eau chaude critique), {company.fullName} maintient une permanence continue par messagerie instantanée certifiée <strong>WhatsApp</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <h5 className="font-semibold text-white mb-1 flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-500" />
                      Envoi de Médias (Photos / Vidéos)
                    </h5>
                    <p className="text-xs text-slate-400">
                      L'utilisateur est invité à transmettre des visuels de la fuite pour embarquer immédiatement les pièces adéquates.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <h5 className="font-semibold text-white mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Délai de Réponse Garanti
                    </h5>
                    <p className="text-xs text-slate-400">
                      Prise en compte en moins de 5 minutes avec confirmation de l'heure d'arrivée estimée (30 min en moyenne).
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Article 4 */}
            <article id="art-4" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Article 04</span>
                <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">Tarifs & Approbation</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Tarification & Approbation Préalable
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Les prix des prestations, déplacements et pièces sont communiqués en toute transparence avant le début des travaux. Aucune prestation supplémentaire non validée au préalable ne fera l'objet d'une facturation.
              </p>
            </article>

            {/* Article 5 */}
            <article id="art-5" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Article 05</span>
                <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">Assurance & Garanties</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Garanties Légales & Assurance Décennale
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Les travaux exécutés bénéficient des garanties légales en vigueur, notamment la garantie décennale couverte par notre contrat auprès de la SMABTP, couvrant les dommages susceptibles de compromettre la solidité ou la destination de l'ouvrage.
              </p>
            </article>

            {/* Article 6 */}
            <article id="art-6" className="scroll-mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Article 06</span>
                <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">Confidentialité</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Protections des Données Personnelles (RGPD)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Les données collectées via le formulaire de contact ou par WhatsApp sont exclusivement destinées au traitement de vos demandes de devis et d'intervention. Elles ne sont en aucun cas cédées ni revendues à des tiers.
              </p>
            </article>

          </main>
        </div>

      </div>
    </AppLayout>
  );
}