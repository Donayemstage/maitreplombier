<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'titre',
    'categorie',
    'description',
    'lieu',
    'duree_travaux',
    'photo_avant',
    'photo_apres',
    'video_url',
    'date_realisation',
    'is_featured',
])]
class Projet extends Model
{
    protected $casts = [
        'is_featured' => 'boolean',
        'date_realisation' => 'date',
    ];
}
