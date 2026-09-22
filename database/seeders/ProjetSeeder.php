<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Projet;
class ProjetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projets = [
            [
                'titre' => 'Rénovation Complète Salle de Bain Moderne',
                'categorie' => 'salle_de_bain',
                'description' => 'Transformation intégrale d\'une ancienne salle d\'eau en suite moderne avec douche à l\'italienne, meuble double vasque et robinetterie encastrée.',
                'lieu' => 'Douala (Bonapriso)',
                'duree_travaux' => '4 jours',
                'photo_avant' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
                'photo_apres' => 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800',
                'video_url' => null,
                'date_realisation' => '2026-07-15',
                'is_featured' => true,
            ],
            [
                'titre' => 'Réparation Urgence Fuite Encastrée & Reprise réseau',
                'categorie' => 'fuite',
                'description' => 'Localisation acoustique d\'une fuite sous chape dans un salon, découpe minimale du carrelage, remplacement des tuyaux cuivre défectueux.',
                'lieu' => 'Douala (Akwa)',
                'duree_travaux' => '3 heures',
                'photo_avant' => 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800',
                'photo_apres' => 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800',
                'video_url' => null,
                'date_realisation' => '2026-08-02',
                'is_featured' => true,
            ],
        ];

        foreach ($projets as $projet) {
            Projet::updateOrCreate(
                ['titre' => $projet['titre']],
                $projet
            );
        }
    }
        //
    
}
