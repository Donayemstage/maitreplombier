<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nom', 'telephone', 'email', 'ville',
 'type_intervention', 'equipement', 'urgence',
  'date_intervention', 'heure_intervention', 'message', 'materiel_fourni',
   'photo_probleme', 'service_id'])]

class Contact extends Model
{
    public function devis()
    {
        return $this->hasOne(Devis::class);
    }

    

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
