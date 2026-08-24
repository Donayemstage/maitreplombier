/*import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}*/


/*import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <div className="min-h-[calc(100vh-4rem)] w-full bg-slate-50/50 p-6 dark:bg-slate-900/50">
                <div className="mx-auto max-w-7xl space-y-6">
                    {children}
                </div>
            </div>
        </AppLayoutTemplate>
    );
}*/

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8fafc] p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-6">
                    {children}
                </div>
            </div>
        </AppLayoutTemplate>
    );
}