<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class ProjetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdating = $this->isMethod('PUT') || $this->isMethod('PATCH') || $this->has('_method');

        return [
            'titre' => ['required', 'string', 'max:255', 'min:3'],
            'categorie' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'duree_travaux' => ['nullable', 'string', 'max:100'],

            // Photo Avant : Toujours optionnelle (si présent, doit être un fichier image < 5Mo)
            'photo_avant' => [
                'nullable',
                File::types(['jpg', 'jpeg', 'png', 'webp'])->max('5mb'),
            ],

            // Photo Après : Obligatoire en création, optionnelle en modification
            'photo_apres' => [
                $isUpdating ? 'nullable' : 'required',
                File::types(['jpg', 'jpeg', 'png', 'webp'])->max('5mb'),
            ],

            'video_url' => ['nullable', 'string', 'max:500'],
            'date_realisation' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'photo_apres.required' => 'La photo après travaux est obligatoire.',
            'photo_apres.max' => 'La photo après ne doit pas dépasser 5 Mo.',
            'photo_avant.max' => 'La photo avant ne doit pas dépasser 5 Mo.',
        ];
    }
}