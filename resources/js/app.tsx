import { createInertiaApp, router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster, toast } from 'sonner';
import { initializeTheme } from '@/hooks/use-appearance';
import AppSidebarLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Écouteur global pour les messages flash de session Laravel via Sonner
router.on('success', (event) => {
    const flash = (event.detail.page.props as any)?.flash;
    if (flash?.success) {
        toast.success(flash.success);
    }
    if (flash?.error) {
        toast.error(flash.error);
    }
    if (flash?.warning) {
        toast.warning(flash.warning);
    }
    if (flash?.info) {
        toast.info(flash.info);
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Maître Plombier';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppSidebarLayout, SettingsLayout];
            case name.startsWith('admin/') || name === 'dashboard':
                return AppSidebarLayout;
            default:
                // Les pages publiques gèrent leur propre layout persistant
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster position="bottom-right" richColors closeButton duration={4500} />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#2563eb',
    },
});

// Initialiser le thème au chargement
initializeTheme();
