import React from 'react';
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import {
  ShieldCheck,
  Zap,
  Award,
  Eye,
  CheckCircle2,
  FileText,
  Wrench,
  Users,
  HelpCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function APropos() {
  return (
    <>
      <Head title="À Propos - Maître Plombier" />
      <div className="min-h-screen bg-white text-slate-800">
        <main>
          {/* HERO / BANNIÈRE EN-T       ÊTE */}
          <section className="bg-slate-900 text-white py-16 md:py-20">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">
                Notre Entreprise
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 leading-tight">
                À Propos de Maître Plombier
              </h1>
              <p className="text-slate-300 text-lg md:text-xl">
                Votre partenaire de confiance pour tous vos travaux de plomberie, chauffage et dépannage d'urgence.
              </p>
            </div>
          </section>

          {/* SECTION 1 : NOTRE HISTOIRE */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Texte Histoire */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Wrench className="w-4 h-4" />
                    <span>Savoir-faire & Passion</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
                    Une histoire d'expertise et d'engagement au service de votre confort
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    Fondée avec la volonté de moderniser les services de plomberie, <strong>Maître Plombier</strong> a su s'imposer grâce à la rigueur de ses interventions et la réactivité de ses équipes.
                  </p>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    Chaque fuite réparée, chaque installation sanitaire conçue et chaque système de chauffage optimisé repose sur une même ambition : offrir à nos clients des solutions durables, sécurisées et conformes aux normes les plus strictes.
                  </p>
                  <div className="pt-2 border-l-4 border-blue-600 pl-4 italic text-slate-700 bg-slate-50 py-3 rounded-r-lg">
                    « Notre priorité absolue : intervenir rapidement, vous conseiller en toute transparence et garantir un travail irréprochable. »
                  </div>
                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex-1 md:flex-none text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">10+</p>
                      <p className="text-slate-500 text-sm">Années d'expérience</p>
                    </div>
                    <div className="flex-1 md:flex-none text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">5k+</p>
                      <p className="text-slate-500 text-sm">Interventions réalisées</p>
                    </div>
                    <div className="flex-1 md:flex-none text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                      <p className="text-slate-500 text-sm">Taux de satisfaction</p>
                    </div>
                  </div>
                </div>

                {/* Image Unsplash d'illustration */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-600 rounded-2xl opacity-10 blur-xl"></div>
                  <img
                    src="/images/1.jpeg"
                    alt="Plombier africain en intervention"
                    className="relative rounded-2xl shadow-xl w-full h-[400px] md:h-[480px] object-cover"
                  />
                  {/* CTA button over image */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center space-x-4">
                    <button
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Demander un devis gratuit
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 : NOS VALEURS FONDAMENTALES */}
          <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Nos Valeurs Fondamentales
                </h2>
                <p className="text-slate-600 text-lg">
                  Les principes qui guident chacune de nos interventions au quotidien.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Carte 1 : Confiance */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Confiance</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Relation basée sur le respect des engagements, des délais et une écoute constante de vos besoins.
                  </p>
                </div>

                {/* Carte 2 : Rapidité */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Rapidité</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Dépannage express et prise en charge réactive pour minimiser les désagréments dans votre quotidien.
                  </p>
                </div>

                {/* Carte 3 : Qualité */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Qualité</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Utilisation de matériaux durables et respect strict des normes de sécurité de l'industrie.
                  </p>
                </div>

                {/* Carte 4 : Transparence */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transparence</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Aucune mauvaise surprise : des tarifs clairs et expliqués avant le démarrage des travaux.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 : POURQUOI NOUS CHOISIR ? */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image Unsplash 2 */}
                <div className="order-2 lg:order-1 relative">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
                    alt="Outillage et travail de plomberie soigné"
                    className="rounded-2xl shadow-lg w-full h-[380px] md:h-[450px] object-cover"
                  />
                </div>

                {/* Contenu Atouts */}
                <div className="order-1 lg:order-2 space-y-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Pourquoi Choisir Maître Plombier ?
                    </h2>
                    <p className="text-slate-600 text-lg">
                      Nous nous engageons à offrir une expérience client sans stress et des résultats impeccables.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Atout 1 : Certification */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Certifications Reconnues</h3>
                        <p className="text-slate-600 text-sm mt-1">
                          Nos artisans plombiers sont qualifiés et régulièrement formés aux nouvelles technologies sanitaires et thermiques.
                        </p>
                      </div>
                    </div>

                    {/* Atout 2 : Garantie Satisfaction */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Garantie Satisfaction</h3>
                        <p className="text-slate-600 text-sm mt-1">
                          Chaque intervention bénéficie d'un suivi après travaux et de garanties sur les pièces et la main-d'œuvre.
                        </p>
                      </div>
                    </div>

                    {/* Atout 3 : Devis Gratuit */}
                    <div className="flex gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-900">Devis 100% Gratuit & Sans Engagement</h3>
                        <p className="text-slate-700 text-sm mt-1">
                          Nous évaluons vos besoins avec précision et vous fournissons une estimation détaillée avant tout commencement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4 : NOTRE ÉQUIPE */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Notre Équipe d'Experts
                </h2>
                <p className="text-slate-600 text-lg max-w-xl mx-auto">
                  Derrière chaque intervention réussie, des artisans passionnés et certifiés, prêts à mettre leur expertise à votre service.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Membre 1 */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Jean Dupont"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Jean Dupont</h3>
                  <p className="text-slate-500 mt-1">Plombier Senior</p>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">
                    Avec plus de 15 ans d'expérience, Jean dirige nos équipes d'intervention sur les chantiers les plus complexes.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Membre 2 */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Marie Martin"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Marie Martin</h3>
                  <p className="text-slate-500 mt-1">Expert Chauffage</p>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">
                    Spécialiste des systèmes de chauffage écologique, Marie optimise vos installations pour réduire votre consommation énergétique.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Membre 3 */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Lucas Bernard"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Lucas Bernard</h3>
                  <p className="text-slate-500 mt-1">Dépanneur d'Urgence</p>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">
                    Disponible 24/7, Lucas intervient en moins de 30 minutes pour les urgences de plomberie partout dans la région.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 : TÉMOIGNAGES CLIENTS */}
          <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Ce que nos clients disent de nous
                </h2>
                <p className="text-slate-600 text-lg max-w-xl mx-auto">
                  La satisfaction de nos clients est notre meilleure récompense.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Témoignage 1 */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Sophie L."
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                  </div>
                  <p className="italic text-slate-700 mb-4">
                    « Intervention rapide et professionnelle. Ma fuite d'eau a été réparée en moins d'une heure, et le chauffagiste a vérifié l'ensemble de mon installation. Je recommande vivement ! »
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-900 font-semibold">Sophie L.</h3>
                      <p className="text-slate-500 text-sm">Propriétaire d'une maison individuelle</p>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                  </div>
                </div>

                {/* Témoignage 2 */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Marc D."
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                  </div>
                  <p className="italic text-slate-700 mb-4">
                    « Nous avons fait appel à Maître Plombier pour la rénovation complète de nos sanitaires. Le travail a été impeccable, les délais respectés et l'équipe très courtoise. »
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-900 font-semibold">Marc D.</h3>
                      <p className="text-slate-500 text-sm">Gérant d'un restaurant</p>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>★★★★★</span>
                    </div>
                  </div>
                </div>

                {/* Témoignage 3 */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop&face=faces"
                      alt="Claire F."
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                  </div>
                  <p className="italic text-slate-700 mb-4">
                    « Contrat de maintenance annuel souscrit. Toujours disponible, prix transparents, interventions de qualité. Un partenaire de confiance pour notre copropriété. »
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-900 font-semibold">Claire F.</h3>
                      <p className="text-slate-500 text-sm">Syndic d'immeuble</p>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>★★★★☆</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6 : QUESTIONS FRÉQUENTES */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Questions Fréquentes
                </h2>
                <p className="text-slate-600 text-lg max-w-xl mx-auto">
                  Vous avez des questions ? Nous avons les réponses.
                </p>
              </div>

              <div className="space-y-4">
                {/* Question 1 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex w-full items-center justify-between p-5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <h3 className="text-lg font-medium text-slate-900">Quelle est votre zone d'intervention ?</h3>
                    <span className="text-slate-400">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="px-5 py-4 text-slate-600">
                    Nous intervenons dans un rayon de 30 km autour de notre atelier, couvrant la ville et ses environs. Pour les urgences, nous pouvons parfois étendre notre périmètre selon disponibilité.
                  </div>
                </div>

                {/* Question 2 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex w-full items-center justify-between p-5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <h3 className="text-lg font-medium text-slate-900">Proposez-vous des devis gratuits ?</h3>
                    <span className="text-slate-400">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="px-5 py-4 text-slate-600">
                    Oui, tous nos devis sont gratuits et sans engagement. Un technicien se déplace pour évaluer précisément vos besoins avant de vous remettre une offre détaillée.
                  </div>
                </div>

                {/* Question 3 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex w-full items-center justify-between p-5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <h3 className="text-lg font-medium text-slate-900">Quel est votre délai d'intervention en cas d'urgence ?</h3>
                    <span className="text-slate-400">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="px-5 py-4 text-slate-600">
                    Nous nous engageons à intervenir en moins de 2 heures pour les urgences majeures (dégât des eaux, panne de chauffage en hiver) et dans la journée pour les autres cas.
                  </div>
                </div>

                {/* Question 4 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex w-full items-center justify-between p-5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <h3 className="text-lg font-medium text-slate-900">Travaillez-vous avec des marques spécifiques ?</h3>
                    <span className="text-slate-400">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="px-5 py-4 text-slate-600">
                    Nous travaillons avec toutes les grandes marques de plomberie et de chauffage (Grohe, Viessmann, Atlantic, etc.) afin de garantir la compatibilité et la durabilité de nos installations.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7 : APPEL À L'ACTION */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Prêt pour une intervention sans souci ?
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
                Contactez-nous dès maintenant pour obtenir un devis gratuit ou planifier une intervention rapide.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Obtenir un devis
                </button>
                <button
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Nous appeler
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER is handled by AppLayout or separate component, we do not modify */}
      </div>
    </>
  );
}

/* Layout wrapper - keep as is */
APropos.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;