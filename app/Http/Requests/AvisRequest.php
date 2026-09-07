<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_client' => ['required', 'string', 'max:255', 'min:2'],
            'ville' => ['nullable', 'string', 'max:255'],
            'service_concerne' => ['nullable', 'string', 'max:255'],
            'note' => ['required', 'integer', 'min:1', 'max:5'],
            'commentaire' => ['required', 'string', 'min:5', 'max:2000'],
            'statut' => ['nullable', 'in:publie,en_attente,rejete'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom_client.required' => 'Le nom du client est obligatoire.',
            'note.required' => 'Veuillez attribuer une note entre 1 et 5 étoiles.',
            'note.min' => 'La note minimale est de 1 étoile.',
            'note.max' => 'La note maximale est de 5 étoiles.',
            'commentaire.required' => 'Le message ou commentaire de l’avis est obligatoire.',
        ];
    }
}
