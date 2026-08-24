<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;


#[Fillable(['montant_main_oeuvre', 'montant_materiel', 'frais_deplacement',
 'total_devis', 'conditions_execution', 'date_validite', 'statut_client', 'contact_id'])]

class Devis extends Model
{
    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
