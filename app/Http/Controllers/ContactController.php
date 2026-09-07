<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Devrabiul\ToastMagic\Facades\ToastMagic;
use App\Http\Requests\ContactRequest;
use App\Models\Contact;

class ContactController extends Controller

    
{
    public function showFormCreate(){
        return view('pages.posts.create');
    }

    public function store(ContactRequest $request){
        $validated = $request->validated();

        //$file = $validated['photo_probleme'];

        //$name = time().$file->getClientOriginalName();

        /*$path = $file->storeAs(
            'photo_probleme',
            $name,
            'public'
        );*/

        $name = null;

        // Vérifier si un fichier a bien été envoyé
        if ($request->hasFile('photo_probleme')) {
            $file = $request->file('photo_probleme');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('photo_probleme', $name, 'public');
        }

        Contact::create([
            'nom' => $validated['nom'],
            'telephone' => $validated['telephone'],
            'email' => $validated['email'],
            'ville' => $validated['ville'],
            'adresse' => $validated['adresse'],
            'type_intervention' => $validated['type_intervention'],
            'equipement' => $validated['equipement'] ?? null,
            'urgence' => $validated['urgence'] ?? 'normale',
            'date_intervention' => $validated['date_intervention'],
            'heure_intervention' => $validated['heure_intervention'] ?? null,
            'message' => $validated['message'],
            'photo_probleme' => $name,
            'materiel_fourni' => $validated['materiel_fourni'] ?? false,

            
        ]);

        return redirect()->back()->with('success', 'Votre demande de devis a été enregistrée avec succès !');
    }

}
