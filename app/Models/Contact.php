<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'token', 'nom', 'telephone', 'email', 'ville', 'adresse',
    'type_intervention', 'equipement', 'urgence',
    'date_intervention', 'heure_intervention', 'message', 'materiel_fourni',
    'photo_probleme', 'service_id', 'statut', 'motif_refus'
])]
class Contact extends Model
{
    protected static function booted(): void
    {
        static::creating(function ($contact) {
            if (empty($contact->token)) {
                $contact->token = \Illuminate\Support\Str::random(32);
            }
        });
    }

    public function devis()
    {
        return $this->hasOne(Devis::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
