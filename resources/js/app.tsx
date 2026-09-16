import { createInertiaApp, router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster, toast } from 'sonner';
import { initializeTheme } from '@/hooks/use-appearance';
import AppSidebarLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Écouteur global pour les messages flash de session Laravel via Sonner avec dédoublonnage intelligent
const recentToasts = new Map<string, number>();

export function showDeduplicatedToast(type: 'success' | 'error' | 'warning' | 'info', message: string, description?: string) {
    if (!message) return;
    const key = `${type}:${message}:${description || ''}`;
    const now = Date.now();
    const lastShown = recentToasts.get(key);
    if (lastShown && now - lastShown < 2500) {
        return;
    }
    recentToasts.set(key, now);

    const toastFn = toast[type] || toast;
    toastFn(message, {
        id: `toast-${key.slice(0, 40)}`,
        description,
    });
}

router.on('success', (event) => {
    const flash = (event.detail.page.props as any)?.flash;
    if (flash?.success) {
        showDeduplicatedToast('success', flash.success);
    }
    if (flash?.error) {
        showDeduplicatedToast('error', flash.error);
    }
    if (flash?.warning) {
        showDeduplicatedToast('warning', flash.warning);
    }
    if (flash?.info) {
        showDeduplicatedToast('info', flash.info);
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
