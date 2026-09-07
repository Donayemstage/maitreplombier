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
        $services = Service::latest()->get();

        return Inertia::render('services', [
            'servicesList' => $services,
        ]);
    }

    /**
     * Page d'accueil publique avec les services mis en avant et les avis clients
     */
    public function homeIndex()
    {
        $services = Service::latest()->take(6)->get();

        // Récupère les avis publiés paginés par 3 (ou 6 selon vos préférences)
        $avis = \App\Models\Avis::where('statut', 'publie')
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->paginate(3); // On envoie 3 avis par page à React via Inertia

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

        return Inertia::render('admin/services', [
            'servicesList' => $services,
            'filters' => $request->only(['search']),
        ]);
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
            $imageName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('services', $imageName, 'public');
        }

        Service::create([
            'nom_service' => $validated['nom_service'],
            'description_service' => $validated['description_service'],
            'description_detail_service' => $validated['description_detail_service'],
            'icone_service' => $validated['icone_service'],
            'prix_service' => $validated['prix_service'],
            'image_service' => $imageName,
        ]);

        return redirect()->back()->with('success', 'Nouveau service créé avec succès !');
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
            // Supprimer l'ancienne image si elle existe et n'est pas l'image par défaut
            if ($service->image_service && Storage::disk('public')->exists('services/' . $service->image_service)) {
                Storage::disk('public')->delete('services/' . $service->image_service);
            }

            $file = $request->file('image_service');
            $imageName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $file->storeAs('services', $imageName, 'public');
            $dataToUpdate['image_service'] = $imageName;
        }

        $service->update($dataToUpdate);

        return redirect()->back()->with('success', 'Le service a été mis à jour avec succès !');
    }

    /**
     * Supprimer un service
     */
    public function destroy(Service $service)
    {
        if ($service->image_service && Storage::disk('public')->exists('services/' . $service->image_service)) {
            Storage::disk('public')->delete('services/' . $service->image_service);
        }

        $service->delete();

        return redirect()->back()->with('success', 'Le service a été supprimé.');
    }
}
