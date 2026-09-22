<?php

namespace App\Http\Controllers;

use App\Models\Projet;
use App\Http\Requests\ProjetRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjetController extends Controller
{
    /**
     * Page publique : Galerie de Réalisations & Avant/Après
     */
    public function publicIndex(Request $request)
    {
        $query = Projet::query()->latest();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('categorie', $request->category);
        }

        /*$projets = $query->get();

        return Inertia::render('projets', [
            'projetsList' => $projets,
            'selectedCategory' => $request->get('category', 'all'),
        ]);*/
        $projets = $query->get();

        $projets->transform(function ($projet) {
            $projet->photo_avant = $this->getImageUrl($projet->photo_avant);
            $projet->photo_apres = $this->getImageUrl($projet->photo_apres);

            return $projet;
        });

        return Inertia::render('projets', [
            'projetsList' => $projets,
            'selectedCategory' => $request->get('category', 'all'),
        ]);
    }

    /**
     * Dashboard Admin : Gestion de la galerie et des chantiers
     */
    public function index(Request $request)
    {
        $query = Projet::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('lieu', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('categorie', $request->category);
        }

        $projets = $query->paginate(12)->withQueryString();

        $projets->getCollection()->transform(function ($projet) {
            $projet->photo_avant = $this->getImageUrl($projet->photo_avant);
            $projet->photo_apres = $this->getImageUrl($projet->photo_apres);

            return $projet;
        });

        return Inertia::render('admin/projets', [
            'projetsList' => $projets,
            'filters' => $request->only(['search', 'category']),
        ]);

        /*$projets = $query->paginate(12)->withQueryString();

        return Inertia::render('admin/projets', [
            'projetsList' => $projets,
            'filters' => $request->only(['search', 'category']),
        ]);*/
    }

    /**
     * Enregistrer un nouveau chantier (Avant/Après)
     */
    public function store(ProjetRequest $request)
    {
        $validated = $request->validated();

        $photoAvantName = null;
        $photoApresName = 'default_after.jpg';

        if ($request->hasFile('photo_avant')) {
            $file = $request->file('photo_avant');

            $photoAvantName = time() . '_avant_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrement dans Supabase Storage
            $file->storeAs('projets', $photoAvantName, 's3');
        }

        if ($request->hasFile('photo_apres')) {
            $file = $request->file('photo_apres');

            $photoApresName = time() . '_apres_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrement dans Supabase Storage
            $file->storeAs('projets', $photoApresName, 's3');
        }

        /*if ($request->hasFile('photo_avant')) {
            $file = $request->file('photo_avant');
            $photoAvantName = time() . '_avant_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('projets', $photoAvantName, 'public');
        }

        if ($request->hasFile('photo_apres')) {
            $file = $request->file('photo_apres');
            $photoApresName = time() . '_apres_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('projets', $photoApresName, 'public');
        }*/

        Projet::create([
            'titre' => $validated['titre'],
            'categorie' => $validated['categorie'],
            'description' => $validated['description'],
            'lieu' => $validated['lieu'] ?? null,
            'duree_travaux' => $validated['duree_travaux'] ?? null,
            'photo_avant' => $photoAvantName,
            'photo_apres' => $photoApresName,
            'video_url' => $validated['video_url'] ?? null,
            'date_realisation' => $validated['date_realisation'] ?? now()->toDateString(),
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return redirect()->back()->with('success', 'Chantier ajouté à la galerie avec succès !');
    }

    /**
     * Mettre à jour une réalisation existante
     */
    /**
     * Mettre à jour une réalisation existante
     */
    public function update(ProjetRequest $request, Projet $projet)
    {
        $validated = $request->validated();

        $dataToUpdate = [
            'titre' => $validated['titre'],
            'categorie' => $validated['categorie'],
            'description' => $validated['description'],
            'lieu' => $validated['lieu'] ?? null,
            'duree_travaux' => $validated['duree_travaux'] ?? null,
            'video_url' => $validated['video_url'] ?? null,
            'date_realisation' => $validated['date_realisation'] ?? $projet->date_realisation,
            'is_featured' => $request->boolean('is_featured'),
        ];

        // Gestion de la photo "Avant"
        if ($request->hasFile('photo_avant')) {
            if (
                $projet->photo_avant && 
                !str_starts_with($projet->photo_avant, 'http')
            ) {
                try {
                    Storage::disk('s3')->delete('projets/' . $projet->photo_avant);
                } catch (\Exception $e) {
                    // Ignore l'erreur si le fichier n'est pas trouvé sur le stockage
                }
            }

            $file = $request->file('photo_avant');
            $photoAvantName = time() . '_avant_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            
            // Enregistrement dans Supabase Storage
            $file->storeAs('projets', $photoAvantName, 's3');
            $dataToUpdate['photo_avant'] = $photoAvantName;
        }

        // Gestion de la photo "Après"
        if ($request->hasFile('photo_apres')) {
            if (
                $projet->photo_apres &&
                $projet->photo_apres !== 'default_after.jpg' &&
                !str_starts_with($projet->photo_apres, 'http')
            ) {
                try {
                    Storage::disk('s3')->delete('projets/' . $projet->photo_apres);
                } catch (\Exception $e) {
                    // Ignore l'erreur si le fichier n'est pas trouvé sur le stockage
                }
            }

            $file = $request->file('photo_apres');
            $photoApresName = time() . '_apres_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            
            // Enregistrement dans Supabase Storage
            $file->storeAs('projets', $photoApresName, 's3');
            $dataToUpdate['photo_apres'] = $photoApresName;
        }

        $projet->update($dataToUpdate);

        return redirect()->back()->with('success', 'Le projet a été mis à jour avec succès !');
    }
    /**
     * Supprimer un chantier
     */
    /**
     * Supprimer un chantier
     */
    public function destroy(Projet $projet)
    {
        // Supprimer la photo AVANT de Supabase si elle existe et n'est pas une URL externe
        if (
            $projet->photo_avant && 
            !str_starts_with($projet->photo_avant, 'http')
        ) {
            try {
                Storage::disk('s3')->delete('projets/' . $projet->photo_avant);
            } catch (\Exception $e) {
                // Ignore l'erreur si le fichier n'est pas trouvé sur le stockage
            }
        }

        // Supprimer la photo APRÈS de Supabase si elle existe, n'est pas par défaut et n'est pas une URL externe
        if (
            $projet->photo_apres &&
            $projet->photo_apres !== 'default_after.jpg' &&
            !str_starts_with($projet->photo_apres, 'http')
        ) {
            try {
                Storage::disk('s3')->delete('projets/' . $projet->photo_apres);
            } catch (\Exception $e) {
                // Ignore l'erreur si le fichier n'est pas trouvé sur le stockage
            }
        }

        $projet->delete();

        return redirect()->back()->with('success', 'Le chantier a été supprimé de la galerie.');
    }
        private function getImageUrl(?string $filename): ?string
        {
            if (!$filename || $filename === 'default_after.jpg') {
                return null;
            }

            // 👈 Si c'est déjà une URL HTTP/HTTPS (ex: Unsplash ou lien direct), on la renvoie directement
            if (str_starts_with($filename, 'http://') || str_starts_with($filename, 'https://')) {
                return $filename;
            }

            $filename = str_replace('projets/', '', $filename);

            return rtrim(config('filesystems.supabase_public_url'), '/')
                . '/projets/'
                . $filename;
        }
}
