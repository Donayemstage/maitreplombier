import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
  User, Lock, Palette, LogOut, ShieldCheck, 
  Check, Eye, EyeOff, Sun, Moon, Monitor,
  Mail, KeyRound, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppearance, Appearance } from '@/hooks/use-appearance';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at?: string | null;
}

interface PageProps {
  adminUser: AdminUser;
  [key: string]: any;
}

const ACCENT_COLORS = [
  { id: 'blue', label: 'Bleu Artisan (Défaut)', color: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-500' },
  { id: 'emerald', label: 'Émeraude / Pro', color: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500' },
  { id: 'indigo', label: 'Indigo Royal', color: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500' },
  { id: 'amber', label: 'Ambre / Cuivre', color: 'bg-amber-600', text: 'text-amber-600', ring: 'ring-amber-500' },
  { id: 'rose', label: 'Rubis / Express', color: 'bg-rose-600', text: 'text-rose-600', ring: 'ring-rose-500' },
];

export default function AdminSettings({ adminUser }: PageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'session'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hook d'apparence pour le thème sombre/clair
  const { appearance, updateAppearance } = useAppearance();

  // Couleur d'accentuation sélectionnée
  const [selectedAccent, setSelectedAccent] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard_accent') || 'blue';
    }
    return 'blue';
  });

  const handleAccentChange = (accentId: string) => {
    setSelectedAccent(accentId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_accent', accentId);
      toast.success('Couleur d’accentuation enregistrée !');
    }
  };

  // 1. Formulaire Profil
  const profileForm = useForm({
    name: adminUser.name || '',
    email: adminUser.email || '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.patch('/admin/settings/profile', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Votre profil administrateur a été mis à jour avec succès !');
      },
      onError: () => {
        toast.error('Veuillez vérifier les informations saisies');
      },
    });
  };

  // 2. Formulaire Mot de passe
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/admin/settings/password', {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Votre mot de passe a été modifié avec succès !');
        passwordForm.reset();
      },
      onError: () => {
        toast.error('Erreur lors du changement de mot de passe');
      },
    });
  };

  // 3. Déconnexion
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <Head title="Paramètres Administrateur - Maître Plombier" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Paramètres Administrateur
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gérez votre profil, sécurisez votre compte, personnalisez le thème et contrôlez votre session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Actif</span>
            </span>
          </div>
        </div>

        {/* Carte Récapitulative Profil & Navigation Onglets */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Bannière supérieure de profil */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                {adminUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{adminUser.name}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> {adminUser.email}
                </p>
                <span className="inline-block mt-2 text-[10px] font-extrabold tracking-wider uppercase bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                  Super Administrateur
                </span>
              </div>
            </div>

            {adminUser.created_at && (
              <div className="text-xs text-slate-400 text-right sm:self-center">
                Compte créé le <strong className="text-white">{adminUser.created_at}</strong>
              </div>
            )}
          </div>

          {/* Onglets de configuration */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/30">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Coordonnées</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Sécurité & Mot de Passe</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'appearance'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Thème & Dashboard (Couleur / Sombre)</span>
            </button>

            <button
              onClick={() => setActiveTab('session')}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'session'
                  ? 'border-red-600 text-red-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-red-600'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Session & Déconnexion</span>
            </button>
          </div>

          {/* CONTENU DE L'ONGLET SÉLECTIONNÉ */}
          <div className="p-6 sm:p-8">

            {/* 1. ONGLET PROFIL */}
            {activeTab === 'profile' && (
              <div className="max-w-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Informations du profil administrateur
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mettez à jour le nom et l'email associés à votre compte pour la connexion et les notifications.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Nom complet de l'administrateur *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.data.name}
                        onChange={(e) => profileForm.setData('name', e.target.value)}
                        placeholder="Ex : Doe Administrateur"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {profileForm.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Adresse Email de connexion *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={profileForm.data.email}
                        onChange={(e) => profileForm.setData('email', e.target.value)}
                        placeholder="Ex : contact@maitreplombier.cm"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {profileForm.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.email}</p>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={profileForm.processing}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {profileForm.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. ONGLET SÉCURITÉ & MOT DE PASSE */}
            {activeTab === 'security' && (
              <div className="max-w-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Modifier le mot de passe
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Mot de passe actuel *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.errors.current_password && (
                      <p className="text-red-500 text-xs mt-1">{passwordForm.errors.current_password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Nouveau mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        placeholder="•••••••• (Min 6 caractères)"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.errors.password_confirmation && (
                      <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password_confirmation}</p>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={passwordForm.processing}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {passwordForm.processing ? 'Modification...' : 'Mettre à jour le mot de passe'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. ONGLET PERSONNALISATION : SOMBRE / CLAIR & COULEURS */}
            {activeTab === 'appearance' && (
              <div className="max-w-2xl space-y-8 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Apparence du Dashboard & Thème
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Personnalisez le mode d'affichage (Clair, Sombre ou Système) et choisissez votre ambiance visuelle préférée.
                  </p>
                </div>

                {/* Sélecteur de Mode Clair / Sombre / Système */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Mode d'affichage (Thème)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Option 1 : Clair */}
                    <button
                      type="button"
                      onClick={() => updateAppearance('light')}
                      className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer ${
                        appearance === 'light'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block">Mode Clair</span>
                        <span className="text-[11px] text-slate-400 font-normal">Fond blanc lumineux</span>
                      </div>
                      {appearance === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>

                    {/* Option 2 : Sombre */}
                    <button
                      type="button"
                      onClick={() => updateAppearance('dark')}
                      className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer ${
                        appearance === 'dark'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-center shadow-xs">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block">Mode Sombre</span>
                        <span className="text-[11px] text-slate-400 font-normal">Confort nocturne</span>
                      </div>
                      {appearance === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>

                    {/* Option 3 : Système */}
                    <button
                      type="button"
                      onClick={() => updateAppearance('system')}
                      className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer ${
                        appearance === 'system'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-xs">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block">Système</span>
                        <span className="text-[11px] text-slate-400 font-normal">Selon votre appareil</span>
                      </div>
                      {appearance === 'system' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>

                  </div>
                </div>

                {/* Sélecteur de Couleur d'accentuation */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Couleur d'accentuation du Dashboard
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ACCENT_COLORS.map((accent) => {
                      const isSelected = selectedAccent === accent.id;
                      return (
                        <button
                          key={accent.id}
                          type="button"
                          onClick={() => handleAccentChange(accent.id)}
                          className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-400/30'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full ${accent.color} flex-shrink-0 shadow-xs flex items-center justify-center`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="truncate">{accent.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* 4. ONGLET SESSION & DÉCONNEXION */}
            {activeTab === 'session' && (
              <div className="max-w-xl space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Gestion de la session & Déconnexion
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Déconnectez-vous en toute sécurité lorsque vous avez terminé vos opérations administratives.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-red-600 text-white flex-shrink-0">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                        Terminer la session actuelle
                      </h4>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-0.5 leading-relaxed">
                        Pour des raisons de sécurité, déconnectez-vous toujours de votre tableau de bord après avoir géré vos devis, services et chantiers.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Me déconnecter maintenant</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">💡 Conseil Donayem Tech :</p>
                  <p>Vos identifiants administrateur sont strictement confidentiels. Ne les communiquez à aucun tiers.</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}
