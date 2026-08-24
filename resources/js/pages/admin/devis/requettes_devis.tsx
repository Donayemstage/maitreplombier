import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { 
  Search, Download, Eye, Phone, Mail, 
  Calendar, CheckCircle, Clock, XCircle 
} from 'lucide-react';

interface Devis {
  id: number;
  statut_client: string;
  total_devis: number;
}

interface DemandeContact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  type_intervention: string;
  message: string;
  created_at: string;
  devis?: Devis;
}

interface PageProps {
  demandesList: {
    data: DemandeContact[];
    links: any[];
  };
  [key: string]: any;
}

export default function RequettesDevis() {
  const { demandesList } = usePage().props as unknown as PageProps;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Badge de statut stylisé
  const renderStatusBadge = (demande: DemandeContact) => {
    if (!demande.devis) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900">
          <Clock className="w-3.5 h-3.5" /> Nouveau
        </span>
      );
    }

    const statusMap: Record<string, { label: string; style: string; icon: React.ElementType }> = {
      en_attente: { label: 'En cours', style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900', icon: Clock },
      accepte: { label: 'Traité', style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900', icon: CheckCircle },
      refuse: { label: 'Annulé', style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900', icon: XCircle },
    };

    const current = statusMap[demande.devis.statut_client] || statusMap['en_attente'];
    const IconComponent = current.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.style}`}>
        <IconComponent className="w-3.5 h-3.5" /> {current.label}
      </span>
    );
  };

  return (
    <>
      <Head title="Demandes de Devis" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Demandes de Devis
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gérez et suivez toutes les requêtes de vos clients en temps réel.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm w-full md:w-auto">
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>

        {/* Barre de Filtres et Recherche */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_attente">En cours</option>
              <option value="accepte">Traité</option>
            </select>
          </div>
        </div>

        {/* 1. AFFICHAGE MOBILE (Cartes verticales) */}
        <div className="flex flex-col gap-4 md:hidden">
          {demandesList.data.length > 0 ? (
            demandesList.data.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</span>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{item.nom}</h3>
                  </div>
                  <div>
                    {renderStatusBadge(item)}
                  </div>
                </div>

                {/* Champs clés en grille */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Service :</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{item.type_intervention}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Date :</span>
                    <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Contact</span>
                  <div className="flex flex-col gap-1 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {item.telephone}</span>
                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {item.email}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Description :</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {item.message || 'Aucun détail fourni.'}
                  </p>
                </div>

                {/* Pied de carte avec action */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end">
                  <button 
                    className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Voir les détails
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              Aucune demande de devis enregistrée pour le moment.
            </div>
          )}
        </div>

        {/* 2. AFFICHAGE DESKTOP (Tableau standard) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {demandesList.data.length > 0 ? (
                  demandesList.data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.nom}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {item.telephone}</span>
                          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {item.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {item.type_intervention}
                      </td>

                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {item.message || 'Aucun détail fourni.'}
                      </td>

                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderStatusBadge(item)}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button 
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                      Aucune demande de devis enregistrée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}