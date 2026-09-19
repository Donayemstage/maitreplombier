import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { 
    ShieldCheck, 
    Zap, 
    CheckCircle2, 
    BadgeCheck, 
    ClipboardList, 
    Clock, 
    Shield, 
    MailCheck, 
    Mail, 
    Cookie, 
    Headset, 
    Phone, 
    MessageSquare 
} from 'lucide-react';

interface Props {
    appName?: string;
    contactEmail?: string;
    contactPhone?: string;
    whatsappNumber?: string;
    location?: string;
}

export default function Confidentialite({
    appName = "Maître Plombier",
    contactEmail = "donayemtech@gmail.com",
    contactPhone = "+237 79 47 36 91",
    whatsappNumber = "23779473691",
    location = "Douala, Cameroun"
}: Props) {
    const { url } = usePage();
    const isConfidentialiteActive = url.startsWith('/confidentialite');

    const formattedPhone = contactPhone.replace(/\s+/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Bonjour%20Ma%C3%AEtre%20Plombier,%20j'ai%20une%20question%20concernant%20mes%20donn%C3%A9es%20personnelles.`;

    return (
        <AppLayout>
            <Head title={`Politique de Confidentialité - ${appName}`} />

            {/* Fond principal Sombre (#0f172a - Slate 900) */}
            <main className="w-full bg-[#0f172a] text-[#f8fafc] py-6 min-h-screen">
                <div className="flex flex-col w-full">
                    
                    {/* Première Section (En-tête sombre sans ombre ni grand cadre) */}
                    <section className="w-full border-b border-[#334155] pb-8">
                        <div className="container-fluid px-4 md:px-8 mx-auto">
                            {/* Breadcrumb avec fil d'ariane clair et état actif distinct */}
                            <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[#94a3b8] text-sm mb-4">
                                <Link href="/" className="hover:text-white transition-colors">
                                    Accueil
                                </Link>
                                <span>&gt;</span>
                                <span className="text-[#64748b]">Mentions &amp; Droits</span>
                                <span>&gt;</span>
                                <Link 
                                    href="/confidentialite" 
                                    className={`font-medium transition-colors ${
                                        isConfidentialiteActive 
                                            ? 'text-[#38bdf8] font-semibold border-b-2 border-[#38bdf8] pb-0.5' 
                                            : 'text-[#f8fafc] hover:text-[#38bdf8]'
                                    }`}
                                >
                                    Politique de Confidentialité
                                </Link>
                            </nav>

                            <div className="max-w-4xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30 rounded mb-4 text-xs font-semibold">
                                    <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                                    <span>Transparence &amp; Rigueur Artisanale</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
                                    Politique de Confidentialité Simple &amp; Transparente
                                </h1>
                                <p className="text-base sm:text-lg text-[#cbd5e1] mb-6">
                                    Vos données personnelles sont protégées avec le même soin que vos installations sanitaires à {location}. Voici l'essentiel en toute clarté.
                                </p>

                                {/* En résumé (Encadré sombre contrasté) */}
                                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                                    <div className="flex items-center gap-2 text-base font-semibold text-white mb-2">
                                        <Zap className="w-5 h-5 text-[#38bdf8]" />
                                        <span>En résumé (30 secondes de lecture) :</span>
                                    </div>
                                    <ul className="space-y-2 text-sm text-[#cbd5e1]">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] mt-1 shrink-0" />
                                            <span><strong className="text-white">Données utiles uniquement :</strong> Nous ne recueillons que ce qui sert directement à préparer votre devis et mener à bien vos interventions techniques.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] mt-1 shrink-0" />
                                            <span><strong className="text-white">Jamais vendues ni cédées :</strong> Vos informations ne sont jamais partagées à des fins de prospection commerciale.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] mt-1 shrink-0" />
                                            <span><strong className="text-white">Hébergées en toute sécurité :</strong> Vos dossiers sont stockés en sécurité sur des serveurs protégés et chiffrés.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Suite du contenu avec container-fluid, sans cadres rigides mais parfaitement lisible */}
                    <div className="container-fluid px-4 md:px-8 mx-auto py-8 space-y-8">

                        {/* Section 1 */}
                        <section className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-[#0284c7]/30">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">1. Qui sommes-nous ?</h2>
                            </div>
                            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                                Le responsable du traitement de vos données est l'entreprise artisanale <strong className="text-white">{appName}</strong>, basée à <strong className="text-white">{location}</strong>.
                            </p>
                            <p className="text-xs sm:text-sm text-[#94a3b8]">
                                Pour toute question relative à votre vie privée, vous pouvez nous joindre directement à l'adresse e-mail :{" "}
                                <a className="text-[#38bdf8] underline font-medium hover:text-[#7dd3fc]" href={`mailto:${contactEmail}`}>
                                    {contactEmail}
                                </a>.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-[#0284c7]/30">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">2. Quelles données collectons-nous et pourquoi ?</h2>
                            </div>
                            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                                Nous appliquons le principe de stricte utilité technique. Nous ne demandons que ce qui permet de réparer vos fuites, poser vos équipements ou effectuer le suivi de nos interventions :
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-[#1e293b] rounded border border-[#334155]">
                                    <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                                        Devis &amp; Dépannages d'Urgence
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1]">
                                        Votre nom, quartier/adresse d'intervention, numéro de téléphone et détails sur le problème de plomberie pour mobiliser l'équipe rapidement.
                                    </p>
                                </div>
                                <div className="p-4 bg-[#1e293b] rounded border border-[#334155]">
                                    <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-1.5">
                                        <BadgeCheck className="w-4 h-4 text-[#38bdf8]" />
                                        Facturation &amp; Suivi Client
                                    </h3>
                                    <p className="text-xs text-[#cbd5e1]">
                                        Vos informations de contact et d'intervention pour établir les devis, factures et garantir le suivi de la prestation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-[#0284c7]/30">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">3. Combien de temps les gardons-nous ?</h2>
                            </div>
                            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                                Vos données ne sont pas conservées au-delà de la durée nécessaire :
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-[#1e293b] rounded border-l-4 border-[#38bdf8] border-y border-r border-[#334155]">
                                    <span className="text-xl font-bold font-mono text-[#38bdf8] block">1 An</span>
                                    <span className="font-semibold text-sm text-white block mt-1">Devis sans suite</span>
                                    <p className="text-xs text-[#cbd5e1] mt-1">
                                        Vos coordonnées sont supprimées au bout de 12 mois si aucune prestation n'a été réalisée.
                                    </p>
                                </div>
                                <div className="p-4 bg-[#1e293b] rounded border-l-4 border-[#38bdf8] border-y border-r border-[#334155]">
                                    <span className="text-xl font-bold font-mono text-[#38bdf8] block">3 Ans</span>
                                    <span className="font-semibold text-sm text-white block mt-1">Chantiers &amp; Clients</span>
                                    <p className="text-xs text-[#cbd5e1] mt-1">
                                        Durée nécessaire pour le suivi de garantie des travaux et la gestion comptable.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-[#0284c7]/30">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">4. Vos droits sur vos données</h2>
                            </div>
                            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                                Vous disposez à tout moment de droits d'accès et de contrôle sur vos informations personnelles :
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#cbd5e1] pt-1">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                                    <span>Accéder à l'ensemble de vos données</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                                    <span>Rectifier un numéro ou un quartier</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                                    <span>Demander la suppression de votre dossier</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                                    <span>Vous opposer à tout appel ou message</span>
                                </div>
                            </div>

                            <div className="bg-[#1e293b] p-4 rounded border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                                <div className="flex items-center gap-3">
                                    <MailCheck className="w-6 h-6 text-[#38bdf8] shrink-0" />
                                    <div>
                                        <span className="font-semibold text-sm text-white block">Exercer un droit facilement</span>
                                        <span className="text-xs text-[#94a3b8]">Réponse directe par notre équipe</span>
                                    </div>
                                </div>
                                <a 
                                    className="inline-flex items-center justify-center gap-2 bg-[#38bdf8] text-[#0f172a] hover:bg-white px-4 py-2 rounded text-xs font-bold transition-colors shrink-0" 
                                    href={`mailto:${contactEmail}?subject=Demande%20de%20Confidentialite`}
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>Nous contacter</span>
                                </a>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-[#0284c7]/30">
                                    <Cookie className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">5. Sécurité &amp; Cookies</h2>
                            </div>
                            <div className="space-y-2 text-sm text-[#cbd5e1] leading-relaxed">
                                <p>
                                    <strong className="text-white">Sécurité des échanges :</strong> Notre site utilise le protocole HTTPS sécurisé (chiffrement TLS) pour garantir la sécurité de vos informations transmises via nos formulaires.
                                </p>
                                <p>
                                    <strong className="text-white">Cookies strictement essentiels :</strong> Nous n'utilisons que des cookies techniques indispensables au bon fonctionnement de l'application (gestion des sessions, sécurité des formulaires). Aucun cookie de traçage publicitaire intrusif n'est déposé.
                                </p>
                            </div>
                        </section>

                        {/* Section Contact / Assistance */}
                        <section className="bg-[#1e293b] border border-[#334155] text-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                            <div className="flex items-start gap-3">
                                <Headset className="w-7 h-7 text-[#38bdf8] mt-0.5 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-base text-white">Une question sur vos données ?</h3>
                                    <p className="text-xs text-[#94a3b8] mt-1">Notre équipe est joignable directement par téléphone ou sur WhatsApp.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <a 
                                    className="inline-flex items-center gap-2 bg-[#38bdf8] text-[#0f172a] hover:bg-white px-4 py-2 rounded text-xs font-bold transition-colors" 
                                    href={`tel:${formattedPhone}`}
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>{contactPhone}</span>
                                </a>
                                <a 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] px-4 py-2 rounded text-xs font-bold transition-colors" 
                                    href={whatsappLink}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </AppLayout>
    );
}