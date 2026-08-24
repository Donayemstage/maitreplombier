/*import { Link } from '@inertiajs/react';
//import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import { BookOpen, FolderGit2, LayoutGrid, FileText, Wrench, FolderKanban, Star, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    { title: 'Devis', href: '/admin/devis/', icon: FileText },
    { title: 'Services', href: '/admin/services', icon: Wrench },
    { title: 'Projets', href: '/admin/projets', icon: FolderKanban },
    { title: 'Avis', href: '/admin/avis', icon: Star },
    { title: 'Paramètres', href: '/admin/settings', icon: Settings },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar className="bg-slate-900 text-white border-r border-slate-800" collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}*/



import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, FileText, Wrench, FolderKanban, Star, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Devis', href: '/admin/devis', icon: FileText },
    { title: 'Services', href: '/admin/services', icon: Wrench },
    { title: 'Projets', href: '/admin/projets', icon: FolderKanban },
    { title: 'Avis', href: '/admin/avis', icon: Star },
    { title: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export function AppSidebar() {
    const { url } = usePage();

    // Normalisation de l'URL courante sans query params ni slash final
    const currentPath = url.split('?')[0].replace(/\/$/, '') || '/';

    return (
        <Sidebar className="!bg-[#1e293b] !text-slate-100 border-r border-slate-800 dark" collapsible="icon" variant="sidebar">
            <SidebarHeader className="!bg-[#1e293b] p-4 border-b border-slate-800/80">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-slate-800 text-slate-100 h-12">
                            <Link href="/dashboard" prefetch className="flex items-center gap-3">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="!bg-[#1e293b] px-3 py-6">
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Plateforme
                </div>
                <nav className="flex flex-col gap-1.5">
                    {mainNavItems.map((item) => {
                        const IconComponent = item.icon;
                        const targetPath = String(item.href).replace(/\/$/, '') || '/';
                        
                        // Détection automatique : exact match pour le dashboard, startsWith pour les sous-routes
                        const isActive = targetPath === '/dashboard' || targetPath === '/'
                            ? currentPath === targetPath
                            : currentPath.startsWith(targetPath);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`group flex items-center gap-3.5 rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {IconComponent && (
                                    <IconComponent
                                        className={`h-5 w-5 transition-colors ${
                                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                                        }`}
                                    />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </SidebarContent>

            <SidebarFooter className="!bg-[#1e293b] border-t border-slate-800/80 p-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}