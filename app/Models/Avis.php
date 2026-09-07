<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'nom_client',
    'ville',
    'service_concerne',
    'note',
    'commentaire',
    'avatar',
    'statut',
    'is_featured',
])]
class Avis extends Model
{
    protected $table = 'avis';

    protected $casts = [
        'note' => 'integer',
        'is_featured' => 'boolean',
    ];
}
