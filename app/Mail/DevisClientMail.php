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

class DevisClientMail extends Mailable
{
    use Queueable, SerializesModels;

    public Contact $contact;

    public Devis $devis;

    public string $consultUrl;

    public string $whatsappUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Contact $contact, Devis $devis)
    {
        $this->contact = $contact;
        $this->devis = $devis;

        $this->consultUrl = route(
            'devis.consulter',
            ['token' => $contact->token]
        );

        $totalFormatted = number_format(
            (float) $devis->total_devis,
            0,
            ',',
            ' '
        );

        $prestation = $contact->type_intervention;

        $waText = "Bonjour Donayem Plomberie, je fais suite au devis #{$devis->id} d'un montant de {$totalFormatted} FCFA pour mon intervention ({$prestation}). Je souhaite donner suite à ce devis.";

        $this->whatsappUrl =
            'https://wa.me/237696580487?text=' . urlencode($waText);


        /*$this->contact = $contact;
        $this->devis = $devis;
        $this->consultUrl = route('devis.consulter', ['token' => $contact->token]);

        $totalFormatted = number_format((float) $devis->total_devis, 0, ',', ' ');
        $prestation = $contact->type_intervention;
        $waText = "Bonjour Donayem Plomberie, je fais suite au devis #{$devis->id} d'un montant de {$totalFormatted} FCFA pour mon intervention ({$prestation}). Je souhaite donner suite à ce devis.";

        $this->whatsappUrl = 'https://wa.me/237696580487?text='.urlencode($waText);*/
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),

            replyTo: [
                new Address(
                    config('mail.from.address'),
                    config('mail.from.name')
                )
            ],

            subject: 'Votre Devis Officiel N° DEVIS-'
                . str_pad(
                    (string) $this->devis->id,
                    4,
                    '0',
                    STR_PAD_LEFT
                )
                . ' - Donayem Plomberie',
        );
        /*$fromAddress = config('mail.from.address', 'foalengfranck6@gmail.com');
        $fromName = config('mail.from.name', 'Donayem Plomberie');

        return new Envelope(
            from: new Address($fromAddress, $fromName),
            replyTo: [new Address($fromAddress, $fromName)],
            subject: 'Votre Devis Officiel N° DEVIS-'.str_pad((string) $this->devis->id, 4, '0', STR_PAD_LEFT).' - Donayem Plomberie',
        );*/
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.devis_client',
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
