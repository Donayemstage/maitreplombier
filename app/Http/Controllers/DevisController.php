<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Devis;
use App\Http\Requests\DevisRequestForm;
use App\Mail\DevisClientMail;
use App\Mail\DevisRejeteMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DevisController extends Controller
{
    /**
     * Affichage de la liste des demandes clients (Onglet Devis / Demandes)
     */
    public function index(Request $request)
    {
        $query = Contact::with(['devis', 'service'])->latest();

        // Filtre par statut
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'nouveau') {
                $query->whereDoesntHave('devis')->where('statut', 'en_attente');
            } elseif ($request->status === 'en_attente') {
                $query->where(function ($q) {
                    $q->where('statut', 'en_cours')
                      ->orWhereHas('devis', fn($d) => $d->where('statut_client', 'en_attente'));
                });
            } elseif ($request->status === 'accepte') {
                $query->where(function ($q) {
                    $q->where('statut', 'traite')
                      ->orWhereHas('devis', fn($d) => $d->where('statut_client', 'accepte'));
                });
            } elseif ($request->status === 'refuse') {
                $query->where(function ($q) {
                    $q->where('statut', 'annule')
                      ->orWhereHas('devis', fn($d) => $d->where('statut_client', 'refuse'));
                });
            }
        }

        // Recherche textuelle
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%")
                  ->orWhere('type_intervention', 'like', "%{$search}%");
            });
        }

        $demandes = $query->paginate(12)->withQueryString();

        // Statistiques pour l'en-tête
        $stats = [
            'total' => Contact::count(),
            'nouveau' => Contact::where('statut', 'en_attente')->whereDoesntHave('devis')->count(),
            'en_cours' => Contact::where('statut', 'en_cours')->orWhereHas('devis', fn($q) => $q->where('statut_client', 'en_attente'))->count(),
            'traite' => Contact::where('statut', 'traite')->orWhereHas('devis', fn($q) => $q->where('statut_client', 'accepte'))->count(),
            'refuse' => Contact::where('statut', 'annule')->orWhereHas('devis', fn($q) => $q->where('statut_client', 'refuse'))->count(),
        ];

        return Inertia::render('admin/devis/requettes_devis', [
            'demandesList' => $demandes,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Page dédiée et centrée pour afficher, chiffrer et gérer un devis
     */
    public function show(Contact $contact)
    {
        $contact->load(['devis', 'service']);

        return Inertia::render('admin/devis/show', [
            'contact' => $contact,
        ]);
    }

    /**
     * Enregistrer ou mettre à jour le chiffrage d'un devis
     */
    public function storeOrUpdate(DevisRequestForm $request, Contact $contact)
    {
        $validated = $request->validated();

        $devis = $contact->devis()->updateOrCreate(
            ['contact_id' => $contact->id],
            [
                'montant_main_oeuvre' => $validated['montant_main_oeuvre'],
                'montant_materiel' => $validated['montant_materiel'] ?? 0,
                'frais_deplacement' => $validated['frais_deplacement'] ?? 0,
                'total_devis' => $validated['total_devis'],
                'conditions_execution' => $validated['conditions_execution'] ?? null,
                'date_validite' => $validated['date_validite'] ?? null,
                'statut_client' => $validated['statut_client'] ?? 'en_attente',
                'canal_envoi' => $validated['canal_envoi'] ?? ($request->boolean('send_email') ? 'email' : null),
                'date_envoi' => $request->boolean('send_email') ? now() : ($contact->devis?->date_envoi),
            ]
        );

        // Mettre à jour le statut de la demande
        if (!empty($validated['statut_demande'])) {
            $contact->update(['statut' => $validated['statut_demande']]);
        } elseif ($validated['statut_client'] === 'accepte') {
            $contact->update(['statut' => 'traite']);
        } elseif ($validated['statut_client'] === 'refuse') {
            $contact->update(['statut' => 'annule']);
        } else {
            $contact->update(['statut' => 'en_cours']);
        }

        // Si l'option d'envoi par email est cochée
        if ($request->boolean('send_email') && !empty($contact->email)) {
            try {
                Mail::to($contact->email)->send(new DevisClientMail($contact, $devis));
                $devis->update([
                    'canal_envoi' => $devis->canal_envoi === 'whatsapp' ? 'les_deux' : 'email',
                    'date_envoi' => now(),
                    'statut_client' => 'en_attente',
                ]);
                $contact->update(['statut' => 'en_cours']);
                return redirect()->back()->with('success', 'Votre devis a été envoyé par mail');
            } catch (\Exception $e) {
                Log::error("Erreur lors de l'envoi de l'email du devis : " . $e->getMessage());
                return redirect()->back()->with('warning', 'Votre devis a été enregistré avec succès ! Mais une erreur est survenue lors de l’envoi de l’email : ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Votre devis a été enregistré avec succès !');
    }

    /**
     * Envoi direct du devis par email au client
     */
    public function sendEmail(Request $request, Contact $contact)
    {
        $contact->load('devis');

        if (!$contact->devis) {
            return redirect()->back()->with('error', 'Veuillez chiffrer le devis avant de l’envoyer.');
        }

        if (empty($contact->email)) {
            return redirect()->back()->with('error', 'Le client ne possède pas d’adresse email valide.');
        }

        try {
            Mail::to($contact->email)->send(new DevisClientMail($contact, $contact->devis));

            $newCanal = $contact->devis->canal_envoi === 'whatsapp' ? 'les_deux' : 'email';
            $contact->devis->update([
                'canal_envoi' => $newCanal,
                'date_envoi' => now(),
                'statut_client' => 'en_attente',
            ]);
            $contact->update(['statut' => 'en_cours']);

            return redirect()->back()->with('success', 'Votre devis a été envoyé par mail');
        } catch (\Exception $e) {
            Log::error("Erreur d'envoi d'email : " . $e->getMessage());
            return redirect()->back()->with('error', 'Erreur lors de l’envoi de l’email : ' . $e->getMessage());
        }
    }

    /**
     * Mettre à jour le statut du devis avec motif obligatoire en cas de refus
     */
    public function updateStatusWithReason(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'statut_client' => ['required', 'string', 'in:en_attente,accepte,refuse'],
            'motif_refus' => ['nullable', 'string', 'max:1000'],
            'notifier_client' => ['nullable', 'boolean'],
        ]);

        $statut = $validated['statut_client'];
        $motif = $validated['motif_refus'] ?? null;

        if ($statut === 'refuse' && empty($motif)) {
            return redirect()->back()->withErrors(['motif_refus' => 'Veuillez préciser la raison du refus.']);
        }

        $contact->load('devis');

        if ($statut === 'accepte') {
            $contact->update(['statut' => 'traite']);
            $contact->devis?->update([
                'statut_client' => 'accepte',
                'motif_refus' => null,
            ]);
            $msg = 'Le devis a été marqué comme Accepté.';
        } elseif ($statut === 'refuse') {
            $contact->update([
                'statut' => 'annule',
                'motif_refus' => $motif,
            ]);
            $contact->devis?->update([
                'statut_client' => 'refuse',
                'motif_refus' => $motif,
            ]);

            // Notification du client par email si demandée
            if ($request->boolean('notifier_client') && !empty($contact->email)) {
                try {
                    Mail::to($contact->email)->send(new DevisRejeteMail($contact, $contact->devis, $motif));
                    $msg = 'Le devis a été marqué comme Refusé et le client a été notifié par email avec le motif.';
                } catch (\Exception $e) {
                    Log::error("Erreur lors de l'envoi de l'email de refus : " . $e->getMessage());
                    $msg = 'Statut mis à jour en Refusé, mais l’envoi de l’email a échoué.';
                }
            } else {
                $msg = 'Le devis a été marqué comme Refusé avec enregistrement du motif.';
            }
        } else {
            $contact->update(['statut' => 'en_cours']);
            $contact->devis?->update([
                'statut_client' => 'en_attente',
                'motif_refus' => null,
            ]);
            $msg = 'Le statut a été réinitialisé à En attente.';
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Mettre à jour rapidement le statut d'une demande
     */
    public function updateStatus(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'statut' => ['required', 'string', 'in:en_attente,en_cours,traite,annule'],
        ]);

        $contact->update(['statut' => $validated['statut']]);

        return redirect()->back()->with('success', 'Statut mis à jour avec succès.');
    }

    /**
     * Page publique de consultation et d'impression du devis pour le client
     */
    public function clientShow(string $token)
    {
        $contact = Contact::where('token', $token)->with(['devis', 'service'])->firstOrFail();

        return Inertia::render('devis/consulter', [
            'contact' => $contact,
        ]);
    }

    /**
     * Réponse directe du client sur sa page de devis (confirmation ou refus)
     */
    public function clientRespond(Request $request, string $token)
    {
        $contact = Contact::where('token', $token)->with('devis')->firstOrFail();

        $validated = $request->validate([
            'decision' => ['required', 'string', 'in:accepte,refuse'],
            'motif_refus' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validated['decision'] === 'accepte') {
            $contact->devis?->update(['statut_client' => 'accepte']);
            $contact->update(['statut' => 'traite']);
            return redirect()->back()->with('success', 'Merci ! Votre devis a bien été accepté. Notre équipe vous contacte sous peu.');
        } else {
            $motif = $validated['motif_refus'] ?? 'Refusé par le client depuis l’interface web.';
            $contact->devis?->update([
                'statut_client' => 'refuse',
                'motif_refus' => $motif,
            ]);
            $contact->update([
                'statut' => 'annule',
                'motif_refus' => $motif,
            ]);
            return redirect()->back()->with('info', 'Votre réponse a été enregistrée. Nous vous remercions pour votre retour.');
        }
    }

    /**
     * Supprimer une demande
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.devis.index')->with('success', 'La demande a été supprimée avec succès.');
    }
}
