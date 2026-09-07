<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Http\Requests\AvisRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;

class AvisController extends Controller
{
    /**
     * Dashboard Admin : Gestion et modération des avis clients
     */
    public function index(Request $request)
    {
        $query = Avis::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom_client', 'like', "%{$search}%")
                  ->orWhere('commentaire', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%")
                  ->orWhere('service_concerne', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('statut', $request->status);
        }

        $avis = $query->paginate(15)->withQueryString();

        // Statistiques KPI
        $stats = [
            'total' => Avis::count(),
            'publie' => Avis::where('statut', 'publie')->count(),
            'en_attente' => Avis::where('statut', 'en_attente')->count(),
            'note_moyenne' => round(Avis::where('statut', 'publie')->avg('note') ?? 5.0, 1),
        ];

        return Inertia::render('admin/avis', [
            'avisList' => $avis,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Enregistrer un avis par l'administrateur
     */
    public function store(AvisRequest $request)
    {
        $validated = $request->validated();

        Avis::create([
            'nom_client' => $validated['nom_client'],
            'ville' => $validated['ville'] ?? null,
            'service_concerne' => $validated['service_concerne'] ?? null,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'],
            'statut' => $validated['statut'] ?? 'publie',
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return redirect()->back()->with('success', 'Avis client enregistré avec succès !');
    }

    /**
     * Dépôt d'un avis direct par un client depuis le site public
     */
    public function publicStore(AvisRequest $request)
    {
        $validated = $request->validated();

        Avis::create([
            'nom_client' => $validated['nom_client'],
            'ville' => $validated['ville'] ?? null,
            'service_concerne' => $validated['service_concerne'] ?? null,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'],
            'statut' => 'publie', // ou 'en_attente' selon modération
            'is_featured' => false,
        ]);

        return redirect()->back()->with('success', 'Merci pour votre retour ! Votre avis a bien été enregistré.');
    }

    /**
     * Mettre à jour un avis
     */
    public function update(AvisRequest $request, Avis $avi)
    {
        $validated = $request->validated();

        $avi->update([
            'nom_client' => $validated['nom_client'],
            'ville' => $validated['ville'] ?? null,
            'service_concerne' => $validated['service_concerne'] ?? null,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'],
            'statut' => $validated['statut'] ?? $avi->statut,
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return redirect()->back()->with('success', 'Avis client mis à jour !');
    }

    /**
     * Modifier rapidement le statut de publication (publie / en_attente / rejete)
     */
    public function toggleStatus(Request $request, Avis $avi)
    {
        $request->validate([
            'statut' => ['required', 'in:publie,en_attente,rejete'],
        ]);

        $avi->update([
            'statut' => $request->statut,
        ]);

        return redirect()->back()->with('success', 'Statut de l\'avis mis à jour.');
    }

    /**
     * Supprimer un avis
     */
    public function destroy(Avis $avi)
    {
        $avi->delete();

        return redirect()->back()->with('success', 'Avis supprimé.');
    }

    

    public function verifyClient(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = trim($request->identifier);

        // Extraction des chiffres si c'est un numéro de téléphone
        $cleanPhone = preg_replace('/[^0-9]/', '', $identifier);

        // Recherche dans la table contacts (par téléphone ou par email)
        $contact = Contact::where(function ($query) use ($identifier, $cleanPhone) {
            if (!empty($cleanPhone)) {
                $query->whereRaw("REPLACE(REPLACE(telephone, ' ', ''), '+', '') LIKE ?", ["%{$cleanPhone}%"]);
            }
            $query->orWhere('email', 'like', "%{$identifier}%");
        })
        ->latest()
        ->first();

        if (!$contact) {
            return response()->json([
                'verified' => false,
                'message' => 'Aucune intervention ou demande enregistrée avec cet identifiant.'
            ], 404);
        }

        return response()->json([
            'verified' => true,
            'client' => [
                'nom' => $contact->nom,
                'ville' => $contact->ville,
                'service' => $contact->type_intervention ?? $contact->equipement,
            ]
        ]);
    }
}
