<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DevisController;

Route::inertia('/', 'accueil')->name('home');
Route::inertia('/contact', 'contact')->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::inertia('/a-propos', 'a_propos')->name('a-propos');
Route::inertia('/a-propos', 'a_propos')->name('a-propos');

// 1. Route d'accès privé pour la connexion administrateur
Route::inertia('/espace-prive-admin', 'auth/login')->middleware('guest')->name('admin.login');

// 2. Dashboard protégé uniquement par le middleware admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
Route::middleware(['auth'])->group(function () {
    // Le ->name('admin.devis.index') est la clé pour la liaison
    Route::get('/admin/devis', [DevisController::class, 'index'])->name('admin.devis.index');
});

/*Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});*/

require __DIR__.'/settings.php';
