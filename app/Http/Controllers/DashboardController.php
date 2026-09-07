<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use App\Models\Projet;
use App\Models\Avis;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. KPI Principaux
        $totalDevis = Contact::count();
        $totalInterventions = Projet::count();
        $caEstimeRaw = Devis::sum('total_devis') ?? 0;
        $caEstime = number_format($caEstimeRaw, 0, ',', ' ') . ' FCFA';
        $noteMoyenneRaw = Avis::where('statut', 'publie')->avg('note');
        $noteMoyenne = round($noteMoyenneRaw ?: 0, 1);

        // 2. Bloc Urgences & Actions Requises
        // Demandes reçues sans aucun devis rattaché
        $devisAChiffrerCount = Contact::doesntHave('devis')->count();
        
        // Demandes urgentes non traitées
        $urgencesCount = Contact::where('urgence', 'tres_urgent')
            ->whereIn('statut', ['Nouveau', 'en_attente'])
            ->count();

        // Devis envoyés il y a plus de 48h sans confirmation (statut_client en attente)
        $relancesCount = Devis::where('statut_client', 'en_attente')
            ->where('created_at', '<=', Carbon::now()->subHours(48))
            ->count();

        // 3. Métrique d'efficacité : Taux de conversion
        $totalDevisEnvoyes = Devis::count();
        $devisAcceptes = Devis::where('statut_client', 'accepte')->count();
        $tauxAcceptation = $totalDevisEnvoyes > 0 
            ? round(($devisAcceptes / $totalDevisEnvoyes) * 100, 1) 
            : 0;

        // 4. Mini-Planning / Prochaines interventions (cette semaine & aujourd'hui)
        $prochaineInterventions = Contact::whereNotNull('date_intervention')
            ->whereDate('date_intervention', '>=', Carbon::today())
            ->orderBy('date_intervention', 'asc')
            ->take(5)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'nom' => $c->nom ?? 'Client',
                    'telephone' => $c->telephone ?? 'N/A',
                    'ville' => $c->ville ?? '',
                    'adresse' => $c->adresse ?? '',
                    'date_intervention' => $c->date_intervention,
                    'heure_intervention' => $c->heure_intervention ?? '',
                    'type_intervention' => $c->type_intervention ?? 'Intervention',
                ];
            });

        // 5. Demandes de Devis Récentes
        $recentDevis = Contact::with('devis')->orderBy('id', 'desc')
            ->take(5)
            ->get()
            ->map(function ($contact) {
                $serviceName = $contact->type_intervention 
                    ?? $contact->equipement 
                    ?? 'Non spécifié';

                $statutLabel = 'Nouveau';
                if ($contact->devis) {
                    if ($contact->devis->statut_client === 'accepte') {
                        $statutLabel = 'Accepté';
                    } elseif ($contact->devis->statut_client === 'refuse') {
                        $statutLabel = 'Refusé';
                    } else {
                        $statutLabel = 'En attente';
                    }
                } elseif ($contact->statut === 'annule') {
                    $statutLabel = 'Refusé';
                } elseif ($contact->statut === 'traite') {
                    $statutLabel = 'Accepté';
                }

                $montant = null;
                if ($contact->devis && $contact->devis->total_devis) {
                    $montant = number_format((float)$contact->devis->total_devis, 0, ',', ' ') . ' FCFA';
                }

                return [
                    'id' => $contact->id,
                    'nom' => $contact->nom ?? 'Client',
                    'telephone' => $contact->telephone ?? '',
                    'ville' => $contact->ville ?? '',
                    'service' => ['name' => $serviceName],
                    'statut' => $statutLabel,
                    'statut_client' => $contact->devis?->statut_client ?? 'nouveau',
                    'urgence' => $contact->urgence ?? 'normale',
                    'total_devis' => $montant,
                    'has_devis' => (bool)$contact->devis,
                    'motif_refus' => $contact->devis?->motif_refus ?? $contact->motif_refus,
                    'created_at' => $contact->created_at ? $contact->created_at->format('d/m/Y') : '',
                ];
            })
            ->all();

        // 6. Répartition des Services Demandés
        $totalDevisForStats = $totalDevis > 0 ? $totalDevis : 1;
        $servicesStats = Contact::get()
            ->groupBy(function ($contact) {
                return $contact->type_intervention ?? 'Autre';
            })
            ->map(function ($items, $serviceName) use ($totalDevisForStats) {
                $count = $items->count();
                return [
                    'service_name' => $serviceName,
                    'count' => $count,
                    'percentage' => round(($count / $totalDevisForStats) * 100, 1),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('dashboard', [
            'totalDevis' => $totalDevis,
            'totalInterventions' => $totalInterventions,
            'caEstime' => $caEstime,
            'noteMoyenne' => $noteMoyenne,
            'servicesStats' => $servicesStats,
            'recentDevis' => $recentDevis,
            'actionsRequises' => [
                'aChiffrer' => $devisAChiffrerCount,
                'urgences' => $urgencesCount,
                'aRelancer' => $relancesCount,
            ],
            'tauxAcceptation' => $tauxAcceptation,
            'prochaineInterventions' => $prochaineInterventions,
        ]);
    }

    /**
     * Recherche globale dynamique pour la barre d'en-tête du Dashboard
     */
    public function globalSearch(Request $request)
    {
        $q = trim((string)$request->get('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json([
                'devis' => [],
                'services' => [],
                'projets' => [],
                'pages' => [],
                'total' => 0,
            ]);
        }

        // 1. Recherche dans les Demandes et Devis
        $devis = Contact::where(function ($query) use ($q) {
            $query->where('nom', 'like', "%{$q}%")
                  ->orWhere('telephone', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%")
                  ->orWhere('type_intervention', 'like', "%{$q}%")
                  ->orWhere('ville', 'like', "%{$q}%");
        })
        ->with('devis')
        ->latest()
        ->take(6)
        ->get()
        ->map(function ($c) {
            $total = $c->devis && $c->devis->total_devis 
                ? number_format((float)$c->devis->total_devis, 0, ',', ' ') . ' FCFA' 
                : 'À chiffrer';
            return [
                'id' => $c->id,
                'title' => $c->nom,
                'subtitle' => ($c->type_intervention ?? 'Intervention') . ' • ' . ($c->ville ?? ''),
                'badge' => $total,
                'url' => route('admin.devis.show', $c->id),
                'type' => 'devis',
            ];
        });

        // 2. Recherche dans les Services
        $services = \App\Models\Service::where('nom', 'like', "%{$q}%")
            ->orWhere('categorie', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->take(4)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'title' => $s->nom,
                    'subtitle' => ($s->categorie ?? 'Service') . ($s->prix_estime ? ' • ' . number_format((float)$s->prix_estime, 0, ',', ' ') . ' FCFA' : ''),
                    'badge' => 'Service',
                    'url' => route('admin.services.index'),
                    'type' => 'service',
                ];
            });

        // 3. Recherche dans les Projets & Réalisations
        $projets = Projet::where('titre', 'like', "%{$q}%")
            ->orWhere('categorie', 'like', "%{$q}%")
            ->take(4)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->titre,
                    'subtitle' => $p->categorie ?? 'Réalisation',
                    'badge' => 'Chantier',
                    'url' => route('admin.projets.index'),
                    'type' => 'projet',
                ];
            });

        // 4. Pages rapides
        $pagesList = [
            ['title' => 'Tableau de bord (Dashboard)', 'subtitle' => 'Pilotage global & KPIs', 'url' => route('dashboard'), 'badge' => 'Page', 'type' => 'page'],
            ['title' => 'Gestion des Devis & Demandes', 'subtitle' => 'Consulter les demandes clients et chiffrer', 'url' => route('admin.devis.index'), 'badge' => 'Page', 'type' => 'page'],
            ['title' => 'Services & Tarifs de plomberie', 'subtitle' => 'Catalogue des prestations sanitaires', 'url' => route('admin.services.index'), 'badge' => 'Page', 'type' => 'page'],
            ['title' => 'Galerie Projets & Chantiers', 'subtitle' => 'Gestion des photos Avant / Après', 'url' => route('admin.projets.index'), 'badge' => 'Page', 'type' => 'page'],
            ['title' => 'Avis & Témoignages Clients', 'subtitle' => 'Modération et publication des avis', 'url' => route('admin.avis.index'), 'badge' => 'Page', 'type' => 'page'],
            ['title' => 'Paramètres Administrateur', 'subtitle' => 'Profil Doe et sécurité mot de passe', 'url' => route('admin.settings'), 'badge' => 'Page', 'type' => 'page'],
        ];

        $pages = collect($pagesList)->filter(function ($p) use ($q) {
            return mb_stripos($p['title'], $q) !== false || mb_stripos($p['subtitle'], $q) !== false;
        })->values();

        $totalCount = $devis->count() + $services->count() + $projets->count() + $pages->count();

        return response()->json([
            'devis' => $devis,
            'services' => $services,
            'projets' => $projets,
            'pages' => $pages,
            'total' => $totalCount,
        ]);
    }
}