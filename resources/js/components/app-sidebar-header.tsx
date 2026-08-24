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


import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Search, Bell } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
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

            {/* Côté Droit : Recherche Globale + Bouton de Notification */}
            <div className="flex items-center gap-3">
                {/* Barre de recherche globale */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="h-9 w-60 rounded-lg bg-slate-100 pl-9 pr-4 text-xs font-medium text-slate-700 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900"
                    />
                </div>

                {/* Bouton de Notifications avec Badge */}
                <button 
                    type="button" 
                    className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {/* Badge rouge de notification non lue */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                </button>
            </div>
        </header>
    );
}