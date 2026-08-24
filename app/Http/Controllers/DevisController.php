<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Inertia\Inertia;


class DevisController extends Controller
{
   // Affichage des demandes clients (Onglet Devis / Demandes)
public function index()
{
    // Récupère les demandes de contact avec leur devis associé, triées par date
    $demandes = Contact::with('devis')
        ->latest()
        ->paginate(10);

    // Envoie la liste à la page React requettes_devis.tsx
    return Inertia::render('admin/devis/requettes_devis', [
        'demandesList' => $demandes,
    ]);
}
}
