<?php

namespace App\Listeners;

use App\Events\ContactProcedEvent;
use App\Mail\AdminNewContactMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendListenerContact
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ContactProcedEvent $event): void
    {
        /*try {
            $adminEmail = config('mail.from.address', 'foalengfranck6@gmail.com');
            Mail::to($adminEmail)->send(new AdminNewContactMail($event->contact));
        } catch (\Throwable $e) {
            Log::error("Erreur d'envoi d'email admin pour nouvelle demande : ".$e->getMessage());
        }*/

            try {
            $adminEmail = config('app.admin_email');

            Mail::to($adminEmail)->send(
                new AdminNewContactMail($event->contact)
            );
        } catch (\Throwable $e) {
            Log::error(
                'Erreur d\'envoi d\'email admin pour nouvelle demande : '
                . $e->getMessage()
            );
        }
    }
}
