// Components
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, KeyRound, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head>
                <title>Mot de passe oublié - Maître Plombier</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            {/* Arrière-plan ambré fixe couvrant tout l'écran */}
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
                            Mot de passe oublié ?
                        </h1>
                        <p className="mt-1 text-xs font-semibold text-slate-900/80">
                            Saisissez votre adresse email pour recevoir un lien de réinitialisation.
                        </p>
                    </div>

                    {/* Carte unique sombre du formulaire */}
                    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800">
                        {status && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>{status}</span>
                            </div>
                        )}

                        <Form {...email.form()} className="flex flex-col gap-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                            Adresse Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@example.com"
                                            className="bg-slate-900 border-slate-800 text-white text-xs placeholder:text-slate-500 rounded-xl py-2.5 focus:border-amber-500 focus:ring-amber-500"
                                        />
                                        <InputError 
                                            message={errors.email} 
                                            className="mt-1 text-[11px] text-rose-500"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-slate-950" />
                                        )}
                                        Envoyer le lien de réinitialisation
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Lien vers la connexion */}
                        <div className="mt-4 text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                            Ou, revenir à la{' '}
                            <Link 
                                href={login()} 
                                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                            >
                                page de connexion
                            </Link>
                        </div>
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

// Outrepasse le layout de base restreint
ForgotPassword.layout = (page: React.ReactNode) => page;