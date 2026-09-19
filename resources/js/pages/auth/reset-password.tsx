import { Form, Head, Link } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head>
                <title>Réinitialisation du mot de passe - Maître Plombier</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            {/* Plein écran statique ambré sans défilement */}
            <div className="fixed inset-0 z-[9999] h-screen w-screen bg-amber-500 flex flex-col justify-center items-center p-4 overflow-hidden">
                
                {/* Bouton Retour au site */}
                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href="/"
                        className="text-xs font-bold text-slate-900 bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                        ← Retour au site
                    </Link>
                </div>

                <div className="w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center">
                    
                    {/* En-tête avec Icone / Logo */}
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-950 shadow-xl mb-3 border border-slate-800">
                            <KeyRound className="w-8 h-8 text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                            Nouveau mot de passe
                        </h1>
                        <p className="mt-1 text-xs font-semibold text-slate-900/80">
                            Veuillez saisir votre nouveau mot de passe ci-dessous.
                        </p>
                    </div>

                    {/* Carte unique sombre du formulaire */}
                    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800">
                        <Form
                            {...update.form()}
                            transform={(data) => ({ ...data, token, email })}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-3">
                                        {/* Champ Email (Lectures seule) */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="email" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                                Adresse Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={email}
                                                readOnly
                                                className="bg-slate-900/50 border-slate-800 text-slate-400 text-xs rounded-xl py-2 cursor-not-allowed"
                                            />
                                            <InputError
                                                message={errors.email}
                                                className="mt-1 text-[11px] text-rose-500"
                                            />
                                        </div>

                                        {/* Champ Nouveau Mot de passe */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="password" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                                Nouveau mot de passe
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                autoComplete="new-password"
                                                autoFocus
                                                placeholder="••••••••"
                                                passwordrules={passwordRules}
                                                className="bg-slate-900 border-slate-800 text-white text-xs placeholder:text-slate-500 rounded-xl py-2 focus:border-amber-500 focus:ring-amber-500"
                                            />
                                            <InputError 
                                                message={errors.password} 
                                                className="mt-1 text-[11px] text-rose-500"
                                            />
                                        </div>

                                        {/* Champ Confirmation du mot de passe */}
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="password_confirmation" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                                Confirmer le mot de passe
                                            </Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                passwordrules={passwordRules}
                                                className="bg-slate-900 border-slate-800 text-white text-xs placeholder:text-slate-500 rounded-xl py-2 focus:border-amber-500 focus:ring-amber-500"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                                className="mt-1 text-[11px] text-rose-500"
                                            />
                                        </div>

                                        {/* Bouton de Soumission */}
                                        <Button
                                            type="submit"
                                            className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                                            disabled={processing}
                                            data-test="reset-password-button"
                                        >
                                            {processing && <Spinner className="mr-2 h-4 w-4" />}
                                            Réinitialiser le mot de passe
                                        </Button>
                                    </div>

                                    {/* Lien vers la connexion */}
                                    <div className="mt-3 text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                                        Ou, revenir à la{' '}
                                        <Link 
                                            href={login()} 
                                            className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                                        >
                                            page de connexion
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Pied de page */}
                    <p className="mt-4 text-center text-[11px] font-bold text-slate-950/80">
                        © {new Date().getFullYear()} Maître Plombier. Tous droits réservés.
                    </p>
                </div>
            </div>
        </>
    );
}

// Désactive le layout restreint par défaut
ResetPassword.layout = (page: React.ReactNode) => page;