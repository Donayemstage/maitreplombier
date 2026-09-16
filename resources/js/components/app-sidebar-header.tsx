/*import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}*/


import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search, Bell, Clock, AlertTriangle, ChevronRight, FileText, X } from 'lucide-react';

interface NotificationItem {
    id: number;
    nom: string;
    type_intervention: string;
    ville?: string;
    urgence?: string;
    heure?: string;
    date?: string;
    time_ago?: string;
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [urgentCount, setUrgentCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewAlert, setHasNewAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fonction de récupération du compte de notifications
    const fetchUnreadCount = async () => {
        try {
            const res = await fetch('/admin/notifications/unread-count', {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(prev => {
                    if (data.count > prev && prev > 0) {
                        setHasNewAlert(true);
                        setTimeout(() => setHasNewAlert(false), 3000);
                    }
                    return data.count;
                });
                setUrgentCount(data.urgent_count || 0);
            }
        } catch (e) {
            // Silencieux en cas d'interruption réseau momentanée
        }
    };

    // Récupération des dernières notifications pour le popover
    const fetchLatestNotifications = async () => {
        try {
            const res = await fetch('/admin/notifications/latest', {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (e) {
            console.error('Erreur notifications', e);
        }
    };

    useEffect(() => {
        fetchUnreadCount();

        // Polling dynamique automatique toutes les 12 secondes
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    // Fermer le dropdown au clic extérieur
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchLatestNotifications();
            fetchUnreadCount();
        }
        setIsOpen(!isOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // Redirection vers devis ou dashboard avec paramètre de recherche
        router.get('/admin/devis', { search: searchTerm.trim() }, { preserveState: true });
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30">
            {/* Côté Gauche : Toggle Sidebar + Titre Maître Plombier */}
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                        Maître Plombier
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Admin Panel
                    </span>
                </div>
            </div>

            {/* Côté Droit : Recherche Globale + Cloche de Notification Dynamique */}
            <div className="flex items-center gap-3">
                {/* Barre de recherche globale */}
                <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher client, devis, service..."
                        className="h-9 w-64 rounded-none border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-slate-700 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900"
                    />
                </form>

                {/* Bouton Cloche de Notification Dynamique avec Badge et Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        type="button" 
                        onClick={toggleDropdown}
                        className={`relative rounded-none p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer ${
                            hasNewAlert ? 'animate-bounce text-blue-600' : ''
                        }`}
                        title={unreadCount > 0 ? `${unreadCount} devis en attente` : 'Aucune nouvelle notification'}
                        aria-label="Notifications"
                    >
                        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        
                        {/* Badge dynamique avec nombre incrémenté */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Menu déroulant des notifications */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-none border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in-50 slide-in-from-top-2">
                            {/* En-tête Dropdown */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        Nouvelles Demandes de Devis
                                    </span>
                                </div>
                                <span className="rounded-none bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                    {unreadCount} en attente
                                </span>
                            </div>

                            {/* Liste des notifications */}
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.length > 0 ? (
                                    notifications.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/admin/devis/${item.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                                                        {item.nom}
                                                    </span>
                                                    {item.urgence === 'tres_urgente' && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-bold bg-red-100 text-red-700 rounded-none">
                                                            <AlertTriangle className="w-2.5 h-2.5 text-red-600" /> URGENT
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-slate-300" />
                                                    {item.heure}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 capitalize">
                                                Prestation : <span className="font-medium text-slate-800 dark:text-slate-200">{item.type_intervention}</span>
                                            </p>

                                            {item.ville && (
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    Lieu : {item.ville} • {item.time_ago}
                                                </p>
                                            )}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-400">
                                        Toutes les demandes de devis ont été chiffrées !
                                    </div>
                                )}
                            </div>

                            {/* Pied de page Dropdown */}
                            <div className="border-t border-slate-100 p-2.5 bg-slate-50/50 dark:border-slate-800 text-center">
                                <Link
                                    href="/admin/devis"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center justify-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    Voir toutes les demandes de devis
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}