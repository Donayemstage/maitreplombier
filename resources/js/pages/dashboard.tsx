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
import { dashboard } from '@/routes';
import { FileText, Wrench, TrendingUp, Star, Plus } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Vue d'ensemble - Maître Plombier" />
            
            <div className="flex flex-col gap-6 p-6 bg-slate-50/50 min-h-full">
                
                {/* En-tête avec titre et boutons d'action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
                        <p className="text-sm text-gray-500">Gérez vos demandes et l'activité de votre entreprise.</p>
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
                            href="/admin/services/create" 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
                        >
                            <Plus className="w-4 h-4" /> 
                            Nouveau Service
                        </Link>
                    </div>
                </div>

                {/* 1. Cartes de Statistiques (KPI) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DEVIS (MOIS)</span>
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">148</h3>
                        <span className="text-xs text-emerald-600 font-semibold">+12% ce mois</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">INTERVENTIONS</span>
                            <span className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Wrench className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">12</h3>
                        <span className="text-xs text-orange-600 font-semibold">4 urgences aujourd'hui</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CA ESTIMÉ</span>
                            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">32,450 €</h3>
                        <span className="text-xs text-emerald-600 font-semibold">+5.4% de hausse</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NOTE MOYENNE</span>
                            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Star className="w-5 h-5"/></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">4.8 <span className="text-sm font-normal text-gray-400">/ 5.0</span></h3>
                        <span className="text-xs text-gray-500">Sur 124 avis récents</span>
                    </div>
                </div>

                {/* 2. Tableau et Graphique */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Demandes de Devis Récentes */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Demandes de Devis Récentes</h2>
                            <Link href="/admin/devis" className="text-sm text-blue-600 font-medium hover:underline">Voir tout</Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                                        <th className="py-3 px-2">Client</th>
                                        <th className="py-3 px-2">Service Demandé</th>
                                        <th className="py-3 px-2">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="py-3 px-2 font-medium text-gray-900">Mme Dupont</td>
                                        <td className="py-3 px-2 text-gray-600">Rénovation Salle de Bain</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                                                Nouveau
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="py-3 px-2 font-medium text-gray-900">SARL Immobilier</td>
                                        <td className="py-3 px-2 text-gray-600">Réparation Fuite (Urgence)</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                                En cours
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="py-3 px-2 font-medium text-gray-900">Jean Martin</td>
                                        <td className="py-3 px-2 text-gray-600">Installation Chauffe-eau</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                                                Terminé
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Répartition des Services Demandés */}
                    <div className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Services Demandés</h2>
                            
                            {/* Représentation visuelle Donut */}
                            <div className="flex items-center justify-center py-6">
                                <div className="relative w-36 h-36 rounded-full border-[12px] border-blue-600 border-t-amber-500 border-r-emerald-500 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-800">148</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                                    <span className="text-gray-600">Réparation Fuite</span>
                                </div>
                                <span className="font-bold text-gray-800">45%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    <span className="text-gray-600">Rénovation SdB</span>
                                </div>
                                <span className="font-bold text-gray-800">30%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-gray-600">Installation Chauffage</span>
                                </div>
                                <span className="font-bold text-gray-800">25%</span>
                            </div>
                        </div>
                    </div>

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
};