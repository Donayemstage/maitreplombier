<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Affiche la page de politique de confidentialité.
     */
    public function confidentialite(): Response
    {
        return Inertia::render('legal/confidentialite', [
            'company' => [
                'fullName' => config('app.name', 'Donayem Plomberie'),
                'domain' => 'maitreplombier.onrender.com',
                'phone' => '+237 6 96 58 04 87',
                'whatsappPhone' => '237696580487',
                'updatedAt' => '20/09/2026',
            ],
            'cguSummary' => [],
            'contactEmail' => 'donayemtech@gmail.com',
            'contactPhone' => '+237 6 96 58 04 87',
            'location' => 'Douala, Cameroun',
        ]);
    }
}
