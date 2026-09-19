<?php

namespace App\Http\Controllers;

use Inertia\Inertia; // S'assurer que cette ligne pointe bien sur la façade
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Affiche la page de politique de confidentialité.
     */
    public function confidentialite(): Response
    {
        return Inertia::render('legal/confidentialite', [
            'appName' => config('app.name', 'Maître Plombier'),
            'contactEmail' => 'donayemtech@gmail.com',
            'contactPhone' => '+237 79 47 36 91',
            'location' => 'Douala, Cameroun',
        ]);
    }
}