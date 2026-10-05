<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UtilisationController extends Controller
{
    /**
     * Affiche la page des Conditions Générales d'Utilisation.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('utilisation', [
            'company' => [
                'name' => config('app.name', 'Donayem Plomberie'),
                'fullName' => 'Donayem Plomberie SAS',
                'phone' => '+237 6 96 58 04 87',
                'whatsappPhone' => '237696580487',
                'email' => 'donayemtech@gmail.com',
                'domain' => 'maitre-plombier.fr',
                'updatedAt' => 'Février 2025',
            ],
            'cguSummary' => [
                ['id' => 'art-1', 'title' => 'Article 1 : Objet du Service'],
                ['id' => 'art-2', 'title' => 'Article 2 : Devis via la Page Contact'],
                ['id' => 'art-3', 'title' => 'Article 3 : Urgences & Astreinte WhatsApp'],
                ['id' => 'art-4', 'title' => 'Article 4 : Tarifs & Approbation Préalable'],
                ['id' => 'art-5', 'title' => 'Article 5 : Garanties & Décennale'],
                ['id' => 'art-6', 'title' => 'Article 6 : Données Personnelles (RGPD)'],
            ],
        ]);
    }
}
