<?php

namespace App\Mail;

use App\Models\Contact;
use App\Models\Devis;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DevisRejeteMail extends Mailable
{
    use Queueable, SerializesModels;

    public Contact $contact;
    public ?Devis $devis;
    public string $motif;
    public string $whatsappUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Contact $contact, ?Devis $devis, string $motif)
    {
        $this->contact = $contact;
        $this->devis = $devis;
        $this->motif = $motif;

        $waText = "Bonjour Maître Plombier, je fais suite au message concernant ma demande #{$contact->id} ({$contact->type_intervention}).";
        $this->whatsappUrl = "https://wa.me/237678953071?text=" . urlencode($waText);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('doe@gmail.com', 'Maître Plombier'),
            subject: "Information relative à votre demande de plomberie N° #{$this->contact->id} - Maître Plombier",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.devis_rejete',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
