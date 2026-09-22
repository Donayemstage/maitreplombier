<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Requests\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Page publique : Liste de tous les services de plomberie
     */
    public function publicIndex()
    {
            $services = Service::latest()->get()->map(function ($service) {
            if ($service->image_service && $service->image_service !== 'default_service.jpg') {
                // Si l'image est déjà une URL complète (ex: https://supabase.co/...)
                if (str_starts_with($service->image_service, 'http://') || str_starts_with($service->image_service, 'https://')) {
                    $service->image_url = $service->image_service;
                } else {
                    // Si c'est seulement le nom du fichier (ex: 1789934127_plombier.jpg)
                    $service->image_url = rtrim(config('filesystems.supabase_public_url'), '/')
                        . '/services/'
                        . $service->image_service;
                }
            } else {
                $service->image_url = null;
            }

            return $service;
        });

        return Inertia::render('services', [
            'servicesList' => $services,
        ]);
    

            /*$services = Service::latest()->get()->map(function ($service) {
            if (
                $service->image_service &&
                $service->image_service !== 'default_service.jpg'
            ) {
                $service->image_url =
                    rtrim(config('filesystems.supabase_public_url'), '/')
                    . '/services/'
                    . $service->image_service;
                
            } else {
                $service->image_url = null;
            }

            return $service;
        });

        return Inertia::render('services', [
            'servicesList' => $services,
        ]);*/
    }

    /**
     * Page d'accueil publique avec les services mis en avant et les avis clients
     */
    public function homeIndex()
    {
        /*$services = Service::latest()->take(6)->get();

        // Récupère les avis publiés paginés par 3
        $avis = \App\Models\Avis::where('statut', 'publie')
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->paginate(3);

        return Inertia::render('accueil', [
            'featuredServices' => $services,
            'testimonialsList' => $avis,
        ]);*/

                    $services = Service::latest()
            ->take(6)
            ->get()
            ->map(function ($service) {
                if (
                    $service->image_service &&
                    $service->image_service !== 'default_service.jpg'
                ) {
                    $service->image_url = Storage::disk('s3')->url(
                        'services/' . $service->image_service
                    );
                } else {
                    $service->image_url = null;
                }

                return $service;
            });

        // Récupère les avis publiés paginés par 3
        $avis = \App\Models\Avis::where('statut', 'publie')
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->paginate(3);

        return Inertia::render('accueil', [
            'featuredServices' => $services,
            'testimonialsList' => $avis,
        ]);

    }

    /**
     * Dashboard Admin : Gestion de tous les services (CRUD)
     */
    public function index(Request $request)
    {
            $query = Service::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('nom_service', 'like', "%{$search}%")
                ->orWhere('description_service', 'like', "%{$search}%");
        }

        $services = $query->paginate(12)->withQueryString();

        $services->getCollection()->transform(function ($service) {
            if (
                $service->image_service &&
                $service->image_service !== 'default_service.jpg'
            ) {
                /*$service->image_url = Storage::disk('s3')->url(
                    'services/' . $service->image_service
                );*/
                $service->image_url =
                    rtrim(config('filesystems.supabase_public_url'), '/')
                    . '/services/'
                    . $service->image_service;
            } else {
                $service->image_url = null;
            }

            return $service;
        });

        return Inertia::render('admin/services', [
            'servicesList' => $services,
            'filters' => $request->only(['search']),
        ]);

        /*$query = Service::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('nom_service', 'like', "%{$search}%")
                  ->orWhere('description_service', 'like', "%{$search}%");
        }

        $services = $query->paginate(12)->withQueryString();

        return Inertia::render('admin/services', [
            'servicesList' => $services,
            'filters' => $request->only(['search']),
        ]);*/

        /*$services = $query->paginate(12)->withQueryString();

        $services->getCollection()->transform(function ($service) {
            $service->image_url = $service->image_service
                ? \Storage::disk('s3')->url('services/' . $service->image_service)
                : null;

            return $service;
        });*/
    }

    /**
     * Enregistrer un nouveau service depuis le dashboard admin
     */
    public function store(ServiceRequest $request)
    {
        $validated = $request->validated();

        $imageName = 'default_service.jpg';

        if ($request->hasFile('image_service')) {
            $file = $request->file('image_service');

            $imageName = time() . '_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrement dans Supabase Storage
            $file->storeAs('services', $imageName, 's3');
        }

        Service::create([
            'nom_service' => $validated['nom_service'],
            'description_service' => $validated['description_service'],
            'description_detail_service' => $validated['description_detail_service'],
            'icone_service' => $validated['icone_service'],
            'prix_service' => $validated['prix_service'],
            'image_service' => $imageName,
        ]);

        return redirect()->back()->with(
            'success',
            'Nouveau service créé avec succès !'
        );
    }

    /**
     * Mettre à jour un service existant
     */
    public function update(ServiceRequest $request, Service $service)
    {
        $validated = $request->validated();

        $dataToUpdate = [
            'nom_service' => $validated['nom_service'],
            'description_service' => $validated['description_service'],
            'description_detail_service' => $validated['description_detail_service'],
            'icone_service' => $validated['icone_service'],
            'prix_service' => $validated['prix_service'],
        ];

        if ($request->hasFile('image_service')) {

            // Supprimer l'ancienne image de Supabase
            if (
                $service->image_service &&
                $service->image_service !== 'default_service.jpg' &&
                Storage::disk('s3')->exists(
                    'services/' . $service->image_service
                )
            ) {
                Storage::disk('s3')->delete(
                    'services/' . $service->image_service
                );
            }

            $file = $request->file('image_service');

            $imageName = time() . '_' .
                preg_replace(
                    '/[^a-zA-Z0-9._-]/',
                    '_',
                    $file->getClientOriginalName()
                );

            // Enregistrer la nouvelle image dans Supabase
            $file->storeAs('services', $imageName, 's3');

            $dataToUpdate['image_service'] = $imageName;
        }

        $service->update($dataToUpdate);

        return redirect()->back()->with(
            'success',
            'Le service a été mis à jour avec succès !'
        );
    }

    /**
     * Supprimer un service
     */
    public function destroy(Service $service)
    {
        // Supprimer l'image de Supabase
        if (
            $service->image_service &&
            $service->image_service !== 'default_service.jpg' &&
            Storage::disk('s3')->exists(
                'services/' . $service->image_service
            )
        ) {
            Storage::disk('s3')->delete(
                'services/' . $service->image_service
            );
        }

        $service->delete();

        return redirect()->back()->with(
            'success',
            'Le service a été supprimé.'
        );
    }
}