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

        if ($request->hasFile('photo_avant')) {
            /*if ($projet->photo_avant && Storage::disk('public')->exists('projets/' . $projet->photo_avant)) {
                Storage::disk('public')->delete('projets/' . $projet->photo_avant);
            }
            $file = $request->file('photo_avant');
            $photoAvantName = time() . '_avant_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('projets', $photoAvantName, 'public');*/
            if (
                $projet->photo_avant &&
                Storage::disk('s3')->exists('projets/' . $projet->photo_avant)
            ) {
                Storage::disk('s3')->delete(
                    'projets/' . $projet->photo_avant
                );
            }

            $file = $request->file('photo_avant');

            $photoAvantName = time() . '_avant_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrer la nouvelle photo dans Supabase
            $file->storeAs('projets', $photoAvantName, 's3');

            $dataToUpdate['photo_avant'] = $photoAvantName;

        }

        if ($request->hasFile('photo_apres')) {
            /*if ($projet->photo_apres && Storage::disk('public')->exists('projets/' . $projet->photo_apres)) {
                Storage::disk('public')->delete('projets/' . $projet->photo_apres);
            }
            $file = $request->file('photo_apres');
            $photoApresName = time() . '_apres_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('projets', $photoApresName, 'public');*/
            if (
                $projet->photo_apres &&
                $projet->photo_apres !== 'default_after.jpg' &&
                Storage::disk('s3')->exists('projets/' . $projet->photo_apres)
            ) {
                Storage::disk('s3')->delete(
                    'projets/' . $projet->photo_apres
                );
            }

            $file = $request->file('photo_apres');

            $photoApresName = time() . '_apres_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrer la nouvelle photo dans Supabase
            $file->storeAs('projets', $photoApresName, 's3');


            $dataToUpdate['photo_apres'] = $photoApresName;
        }

        $projet->update($dataToUpdate);

        return redirect()->back()->with('success', 'Le projet a été mis à jour avec succès !');
    }

    /**
     * Supprimer un chantier
     */
    public function destroy(Projet $projet)
    {
        // Supprimer la photo AVANT de Supabase
        if (
            $projet->photo_avant &&
            Storage::disk('s3')->exists('projets/' . $projet->photo_avant)
        ) {
            Storage::disk('s3')->delete(
                'projets/' . $projet->photo_avant
            );
        }

        // Supprimer la photo APRÈS de Supabase
        if (
            $projet->photo_apres &&
            $projet->photo_apres !== 'default_after.jpg' &&
            Storage::disk('s3')->exists('projets/' . $projet->photo_apres)
        ) {
            Storage::disk('s3')->delete(
                'projets/' . $projet->photo_apres
            );
        }

        $projet->delete();

        return redirect()->back()->with(
            'success',
            'Le chantier a été supprimé de la galerie.'
        );
        /*if ($projet->photo_avant && Storage::disk('public')->exists('projets/' . $projet->photo_avant)) {
            Storage::disk('public')->delete('projets/' . $projet->photo_avant);
        }
        if ($projet->photo_apres && Storage::disk('public')->exists('projets/' . $projet->photo_apres)) {
            Storage::disk('public')->delete('projets/' . $projet->photo_apres);
        }

        $projet->delete();

        return redirect()->back()->with('success', 'Le chantier a été supprimé de la galerie.');*/
    }

    private function getImageUrl(?string $filename): ?string
    {
        if (!$filename || $filename === 'default_after.jpg') {
            return null;
        }

        $filename = str_replace('projets/', '', $filename);

        return rtrim(config('filesystems.supabase_public_url'), '/')
            . '/projets/'
            . $filename;
    }
}
