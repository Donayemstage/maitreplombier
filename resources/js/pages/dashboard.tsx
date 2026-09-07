/*import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};*/
import { Head, Link } from '@inertiajs/react';
import { 
    FileText, 
    Wrench, 
    TrendingUp, 
    Star, 
    Plus, 
    AlertTriangle, 
    Clock, 
    BellRing, 
    Calendar, 
    Phone, 
    MapPin, 
    CheckCircle2 
} from 'lucide-react';

interface ServiceStat {
    service_name: string;
    percentage: number;
}

interface RecentDevis {
    id: number;
    nom: string;
    telephone?: string;
    ville?: string;
    statut: string;
    statut_client?: string;
    urgence?: string;
    total_devis?: string | null;
    has_devis?: boolean;
    motif_refus?: string | null;
    created_at?: string;
    service?: {
        name: string;
    };
}

interface Intervention {
    id: number;
    nom: string;
    telephone: string;
    ville: string;
    adresse: string;
    date_intervention: string;
    heure_intervention: string;
    type_intervention: string;
}

interface DashboardProps {
    totalDevis: number;
    totalInterventions: number;
    caEstime: string | number;
    noteMoyenne: number;
    servicesStats: ServiceStat[];
    recentDevis: RecentDevis[];
    actionsRequises: {
        aChiffrer: number;
        urgences: number;
        aRelancer: number;
    };
    tauxAcceptation: number;
    prochaineInterventions: Intervention[];
}

export default function Dashboard({
    totalDevis = 0,
    totalInterventions = 0,
    caEstime = 0,
    noteMoyenne = 0,
    servicesStats = [],
    recentDevis = [],
    actionsRequises = { aChiffrer: 0, urgences: 0, aRelancer: 0 },
    tauxAcceptation = 0,
    prochaineInterventions = []
}: DashboardProps) {

    // Palette de couleurs partagée entre le graphique et la légende
    const colorPalette = [
        { bg: 'bg-blue-600', hex: '#2563eb' },
        { bg: 'bg-amber-500', hex: '#f59e0b' },
        { bg: 'bg-emerald-500', hex: '#10b981' },
        { bg: 'bg-purple-500', hex: '#a855f7' },
        { bg: 'bg-pink-500', hex: '#ec4899' },
        { bg: 'bg-slate-500', hex: '#64748b' }
    ];

    // Construction dynamique du conic-gradient CSS pour le donut chart
    const buildConicGradient = () => {
        if (!servicesStats || servicesStats.length === 0) {
            return '#e2e8f0';
        }

        let accumulatedDegree = 0;
        const gradientStops = servicesStats.map((stat, index) => {
            const colorHex = colorPalette[index % colorPalette.length].hex;
            const startDegree = accumulatedDegree;
            accumulatedDegree += (stat.percentage / 100) * 360;
            return `${colorHex} ${startDegree}deg ${accumulatedDegree}deg`;
        });

        return `conic-gradient(${gradientStops.join(', ')})`;
    };

    return (
        <>
            <Head title="Centre de Pilotage - Maître Plombier" />

            <div className="flex flex-col gap-6 p-6 bg-slate-50/50 min-h-full">

                {/* En-tête */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Centre de Pilotage</h1>
                        <p className="text-sm text-gray-500">Suivez les urgences et planifiez vos interventions au quotidien.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/services"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-2 shadow-sm transition"
                        >
                            <Wrench className="w-4 h-4 text-gray-500" />
                            Prix Services
                        </Link>
                        <Link
                            href="/admin/services?action=create"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau Service
                        </Link>
                    </div>
                </div>

                {/* 1. Urgences & Actions Requises */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-red-600">Dépannages Très Urgents</p>
                                <h4 className="text-xl font-bold text-red-900">{actionsRequises.urgences} non lues</h4>
                            </div>
                        </div>
                        <Link href="/admin/devis?urgence=tres_urgent" className="text-xs font-semibold text-red-700 hover:underline">
                            Traiter →
                        </Link>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-amber-600">Demandes à chiffrer</p>
                                <h4 className="text-xl font-bold text-amber-900">{actionsRequises.aChiffrer} devis en attente</h4>
                            </div>
                        </div>
                        <Link href="/admin/devis" className="text-xs font-semibold text-amber-700 hover:underline">
                            Chiffrer →
                        </Link>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <BellRing className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-blue-600">Relances Clients (&gt; 48h)</p>
                                <h4 className="text-xl font-bold text-blue-900">{actionsRequises.aRelancer} devis sans réponse</h4>
                            </div>
                        </div>
                        <Link href="/admin/devis" className="text-xs font-semibold text-blue-700 hover:underline">
                            Relancer →
                        </Link>
                    </div>
                </div>

                {/* 2. Cartes KPI Globaux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DEVIS (TOTAL)</span>
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalDevis}</h3>
                        <span className="text-xs text-emerald-600 font-semibold">Demandes enregistrées</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TAUX D'ACCEPTATION</span>
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{tauxAcceptation}%</h3>
                        <span className="text-xs text-emerald-600 font-semibold">Conversion des devis</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CA ESTIMÉ</span>
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{caEstime}</h3>
                        <span className="text-xs text-emerald-600 font-semibold">Turnover estimé</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NOTE MOYENNE</span>
                            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Star className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">
                            {noteMoyenne} <span className="text-sm font-normal text-gray-400">/ 5.0</span>
                        </h3>
                        <span className="text-xs text-gray-500">Sur les avis publiés</span>
                    </div>
                </div>

                {/* 3. Demandes & Devis Récents avec Statuts en direct */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Demandes & Devis Récents
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">Suivi des propositions transmises et des décisions clients</p>
                        </div>
                        <Link href="/admin/devis" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            Gérer tous les devis ({totalDevis}) →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    <th className="py-2.5 px-3">Client & Lieu</th>
                                    <th className="py-2.5 px-3">Prestation</th>
                                    <th className="py-2.5 px-3">Total Chiffré</th>
                                    <th className="py-2.5 px-3">Statut Devis</th>
                                    <th className="py-2.5 px-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs">
                                {recentDevis.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="py-3 px-3">
                                            <span className="font-semibold text-gray-900 block">{item.nom}</span>
                                            {item.ville && <span className="text-[11px] text-gray-400">{item.ville}</span>}
                                        </td>
                                        <td className="py-3 px-3 font-medium text-gray-700">
                                            {item.service?.name || 'Prestation'}
                                        </td>
                                        <td className="py-3 px-3">
                                            {item.total_devis ? (
                                                <span className="font-bold text-gray-900">{item.total_devis}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Non chiffré</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            {item.statut === 'Accepté' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Accepté
                                                </span>
                                            ) : item.statut === 'Refusé' ? (
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        Refusé
                                                    </span>
                                                    {item.motif_refus && (
                                                        <span className="text-[10px] text-rose-500 italic truncate max-w-[140px]" title={item.motif_refus}>
                                                            « {item.motif_refus} »
                                                        </span>
                                                    )}
                                                </div>
                                            ) : item.statut === 'En attente' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    En attente (envoyé)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    Nouveau
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <Link
                                                href={`/admin/devis/${item.id}`}
                                                className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer"
                                            >
                                                Ouvrir & Mettre à jour
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentDevis.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-gray-400 text-xs">
                                            Aucune demande enregistrée pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Planning & Diagramme Statistique */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Planning des Interventions */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Planning des Interventions
                            </h2>
                            <Link href="/admin/projets" className="text-sm text-blue-600 font-medium hover:underline">Voir l'agenda</Link>
                        </div>

                        <div className="space-y-3">
                            {prochaineInterventions.map((item) => (
                                <div key={item.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white hover:border-blue-200 transition">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{item.nom}</span>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                {item.type_intervention}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.ville} ({item.adresse})</span>
                                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {item.telephone}</span>
                                        </div>
                                    </div>
                                    <div className="text-right sm:text-right">
                                        <span className="text-xs font-bold text-blue-600 block">{item.date_intervention}</span>
                                        <span className="text-xs text-gray-400">{item.heure_intervention}</span>
                                    </div>
                                </div>
                            ))}
                            {prochaineInterventions.length === 0 && (
                                <div className="text-center text-gray-500 py-6">
                                    Aucune intervention programmée pour aujourd'hui ou cette semaine.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Services Demandés (Cercle Statistique Dynamique) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Services Demandés</h2>
                            <div className="flex items-center justify-center py-6">
                                <div 
                                    className="relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm"
                                    style={{ background: buildConicGradient() }}
                                >
                                    <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                                        <span className="text-2xl font-bold text-gray-900">{totalDevis}</span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            {servicesStats.map((stat, index) => {
                                const colorClass = colorPalette[index % colorPalette.length].bg;
                                return (
                                    <div key={index} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
                                            <span className="text-gray-600 font-medium capitalize">{stat.service_name}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{stat.percentage}%</span>
                                    </div>
                                );
                            })}
                            {servicesStats.length === 0 && (
                                <div className="text-center text-gray-500 py-4">
                                    Aucune donnée disponible
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}