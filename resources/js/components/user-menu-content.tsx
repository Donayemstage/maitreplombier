
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.post('/logout');
    };

    return (
        <>
            {/* Informations de l'administrateur */}
            <div className="px-3 py-3">
                <UserInfo user={user} showEmail />
            </div>

            <DropdownMenuSeparator />

            {/* Paramètres du compte */}
            <DropdownMenuGroup>
                <DropdownMenuItem
                    render={
                        <Link
                            href="/admin/settings"
                            onClick={cleanup}
                        />
                    }
                >
                    <Settings className="mr-2 size-4" />
                    Mon profil et paramètres
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Déconnexion */}
            <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
            >
                <LogOut className="mr-2 size-4" />
                Se déconnecter
            </DropdownMenuItem>
        </>
    );
}
