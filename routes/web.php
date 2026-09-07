<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\AdminSettingsController;

// Routes publiques
Route::get('/', [ServiceController::class, 'homeIndex'])->name('home');
Route::get('/services', [ServiceController::class, 'publicIndex'])->name('services');
Route::get('/projets', [ProjetController::class, 'publicIndex'])->name('projets');
Route::get('/galerie', [ProjetController::class, 'publicIndex'])->name('galerie');
Route::inertia('/contact', 'contact')->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::inertia('/a-propos', 'a_propos')->name('a-propos');

// Dépôt d'avis public par les clients
Route::post('/avis', [AvisController::class, 'publicStore'])->name('avis.store');
Route::post('/avis/verify-client', [AvisController::class, 'verifyClient']);

// Consultation et validation de devis par le client
Route::get('/devis/consulter/{token}', [DevisController::class, 'clientShow'])->name('devis.consulter');
Route::post('/devis/consulter/{token}/repondre', [DevisController::class, 'clientRespond'])->name('devis.repondre');

// Connexion Administrateur (Lien privé)
Route::get('/espace-prive-admin', function (Request $request) {
    if (Auth::check()) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
    return Inertia::render('auth/login');
})->name('admin.login');

// Route explicite de Déconnexion qui redirige vers le lien privé
Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/espace-prive-admin')->with('success', 'Vous avez été déconnecté avec succès.');
})->name('logout');

// Espace d'administration protégé
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Gestion des Devis et Demandes
    Route::get('/admin/devis', [DevisController::class, 'index'])->name('admin.devis.index');
    Route::get('/admin/devis/{contact}', [DevisController::class, 'show'])->name('admin.devis.show');
    Route::post('/admin/devis/{contact}', [DevisController::class, 'storeOrUpdate'])->name('admin.devis.save');
    Route::post('/admin/devis/{contact}/send-email', [DevisController::class, 'sendEmail'])->name('admin.devis.send_email');
    Route::post('/admin/devis/{contact}/update-status-reason', [DevisController::class, 'updateStatusWithReason'])->name('admin.devis.update_status_reason');
    Route::patch('/admin/devis/{contact}/status', [DevisController::class, 'updateStatus'])->name('admin.devis.status');
    Route::delete('/admin/devis/{contact}', [DevisController::class, 'destroy'])->name('admin.devis.destroy');

    // Gestion des Services
    Route::get('/admin/services', [ServiceController::class, 'index'])->name('admin.services.index');
    Route::post('/admin/services', [ServiceController::class, 'store'])->name('admin.services.store');
    Route::post('/admin/services/{service}', [ServiceController::class, 'update'])->name('admin.services.update');
    Route::delete('/admin/services/{service}', [ServiceController::class, 'destroy'])->name('admin.services.destroy');

    // Gestion des Projets & Réalisations (Galerie Avant/Après)
    Route::get('/admin/projets', [ProjetController::class, 'index'])->name('admin.projets.index');
    Route::post('/admin/projets', [ProjetController::class, 'store'])->name('admin.projets.store');
    Route::post('/admin/projets/{projet}', [ProjetController::class, 'update'])->name('admin.projets.update');
    Route::delete('/admin/projets/{projet}', [ProjetController::class, 'destroy'])->name('admin.projets.destroy');

    // Gestion des Avis et Témoignages Clients
    Route::get('/admin/avis', [AvisController::class, 'index'])->name('admin.avis.index');
    Route::post('/admin/avis', [AvisController::class, 'store'])->name('admin.avis.store');
    Route::post('/admin/avis/{avi}', [AvisController::class, 'update'])->name('admin.avis.update');
    Route::patch('/admin/avis/{avi}/status', [AvisController::class, 'toggleStatus'])->name('admin.avis.status');
    Route::delete('/admin/avis/{avi}', [AvisController::class, 'destroy'])->name('admin.avis.destroy');

    // Paramètres & Configuration Administrateur
    Route::get('/admin/settings', [AdminSettingsController::class, 'index'])->name('admin.settings');
    Route::patch('/admin/settings/profile', [AdminSettingsController::class, 'updateProfile'])->name('admin.settings.profile');
    Route::put('/admin/settings/password', [AdminSettingsController::class, 'updatePassword'])->name('admin.settings.password');
});

// Redirection globale /settings vers /admin/settings
Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/admin/settings');
    Route::redirect('settings/profile', '/admin/settings');
    Route::redirect('settings/security', '/admin/settings');
    Route::redirect('settings/appearance', '/admin/settings');
});

require __DIR__.'/settings.php';
