<?php

namespace App\Mail;

use App\Models\Contact; // <-- 1. Importez le modèle Contact
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address; // <-- 2. Importez Address pour l'expéditeur et le replyTo
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNewContactMail extends Mailable
{
    use Queueable, SerializesModels;

    // 3. Déclarez la propriété publique pour qu'elle soit accessible dans la vue Blade
    public Contact $contact;

    /**
     * Create a new message instance.
     */
    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('foalengfranck6@gmail.com', 'Maître Plombier - Site'),
            replyTo: [new Address($this->contact->email, $this->contact->nom)],
            subject: "Nouvelle demande de devis de : " . $this->contact->nom,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin_new_contact',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}