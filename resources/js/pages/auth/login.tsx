import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

type LoginProps = {
  status?: string;
  canResetPassword?: boolean;
};

export default function Login({ status, canResetPassword = true }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head>
        <title>Connexion - Maître Plombier</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      {/* fixed inset-0 garantit que l'arrière-plan couvre 100% de la fenêtre d'affichage */}
      <div className="fixed inset-0 z-[9999] h-screen w-screen bg-amber-500 flex flex-col justify-center items-center p-4 overflow-hidden">
        
        {/* Bouton Retour */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="text-xs font-bold text-slate-900 bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
          >
            ← Retour au site
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center">
          {/* Logo / Favicon du site */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-950 shadow-xl mb-3 border border-slate-800">
              <img 
                src="/favicon.ico" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }}
              />
            </div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Espace d'Administration
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-900/80">
              Connectez-vous pour gérer les demandes de devis et interventions.
            </p>
          </div>

          {/* Formulaire de connexion */}
          <div className="w-full bg-slate-950 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800">
            {status && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{status}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    autoComplete="username"
                    placeholder="admin@maitreplombier.fr"
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Mot de Passe
                  </label>
                  {canResetPassword && (
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onChange={(e) => setData('password', e.target.value)}
                    required
                  />
                </div>
                {errors.password && (
                  <div className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Se souvenir de moi */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950"
                  />
                  <span>Se souvenir de moi</span>
                </label>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer text-xs shadow-lg shadow-amber-500/20"
              >
                <span>Se Connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Créer un compte */}
            <div className="mt-4 text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              Pas encore de compte ?{' '}
              <Link
                href="/register"
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-[11px] font-bold text-slate-950/80">
            © {new Date().getFullYear()} Maître Plombier. Tous droits réservés.
          </p>
        </div>
      </div>
    </>
  );
}

// Supprime tout layout hérité
Login.layout = (page: React.ReactNode) => page;