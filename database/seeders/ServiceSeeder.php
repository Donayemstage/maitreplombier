<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'nom_service' => 'Dépannage & Recherche de Fuite',
                'description_service' => 'Détection rapide et réparation immédiate de fuites d\'eau visibles ou encastrées sans dégât inutile.',
                'description_detail_service' => 'Notre service de détection et réparation de fuites comprend : inspection par caméra thermique, détection acoustique, remplacement des joints et raccords défectueux, mise sous pression des canalisations et remise en service garantie.',
                'icone_service' => 'droplets',
                'prix_service' => 15000,
                'image_service' => 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600',
            ],
            [
                'nom_service' => 'Débouchage & Curage Canalisation',
                'description_service' => 'Désobstruction haute pression de vos éviers, WC, douches et colonnes d\'évacuation générales.',
                'description_detail_service' => 'Intervention d\'urgence avec matériel professionnel : furet électrique, hydrocurage haute pression, élimination des bouchons de calcaire, graisse ou racines, et vérification complète de l\'écoulement.',
                'icone_service' => 'wrench',
                'prix_service' => 20000,
                'image_service' => 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600',
            ],
            [
                'nom_service' => 'Chauffe-eau & Système Thermique',
                'description_service' => 'Installation, entretien, détartrage et remplacement de chauffe-eau électriques et solaires.',
                'description_detail_service' => 'Installation selon les normes de sécurité en vigueur, remplacement de résistances, thermostats, groupes de sécurité, détartrage complet de la cuve et diagnostic de consommation électrique.',
                'icone_service' => 'flame',
                'prix_service' => 25000,
                'image_service' => 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600',
            ],
            [
                'nom_service' => 'Installation & Rénovation Sanitaire',
                'description_service' => 'Pose de robinetterie haut de gamme, lavabos, WC suspendus, colonnes de douche et baignoires.',
                'description_detail_service' => 'Conception sur-mesure et pose soignée de tous vos équipements sanitaires pour maisons, appartements et bureaux. Raccordement sécurisé, finitions soignées et garantie décennale.',
                'icone_service' => 'shower-head',
                'prix_service' => 35000,
                'image_service' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600',
            ],
            [
                'nom_service' => 'Rénovation Complète Salle de Bain',
                'description_service' => 'Transformation clé en main de votre salle de bain : plomberie, carrelage, étanchéité et sanitaires.',
                'description_detail_service' => "Prise en charge de A à Z de votre projet : réagencement de l\'espace, création de douche à l'italienne, pose de meubles vasques modernes, étanchéité sous carrelage et ventilation.",
                'icone_service' => 'bath',
                'prix_service' => 75000,
                'image_service' => 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600',
            ],
            [
                'nom_service' => 'Contrat d\'Entretien & Maintenance',
                'description_service' => 'Maintenance préventive pour particuliers, entreprises, copropriétés et résidences hôtelières.',
                'description_detail_service' => 'Visites périodiques de contrôle, vérification des pressions, nettoyage des filtres, détection précoce des micro-fuites et intervention prioritaire 7j/7 sans supplément.',
                'icone_service' => 'shield-check',
                'prix_service' => 30000,
                'image_service' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}