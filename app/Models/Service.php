<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nom_service', 'description_service', 'description_detail_service', 'icone_service', 'prix_service', 'image_service'])]

class Service extends Model
{
    public function contact()
    {
        return $this->hasMany(Contact::class, 'service_id');
    }
}
