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
                'fullName'      => config('app.name', 'Maître Plombier'),
                'domain'        => 'maitreplombier.onrender.com',
                'phone'         => '+237 79 47 36 91',
                'whatsappPhone' => '+237 79 47 36 91',
                'updatedAt'     => '20/09/2026',
            ],
            'cguSummary'   => [],
            'contactEmail' => 'donayemtech@gmail.com',
            'contactPhone' => '+237 79 47 36 91',
            'location'     => 'Douala, Cameroun',
        ]);
    }
}


