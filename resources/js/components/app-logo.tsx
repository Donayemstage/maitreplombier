/*import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}*/

import { Wrench } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left leading-tight">
                <span className="truncate font-bold text-white text-base">
                    Maître Plombier
                </span>
                <span className="truncate text-xs font-medium text-slate-400">
                    Admin Panel
                </span>
            </div>
        </div>
    );
}