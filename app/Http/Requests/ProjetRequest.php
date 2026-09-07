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
        $isUpdating = $this->isMethod('PUT') || $this->isMethod('PATCH') || $this->route('projet');

        return [
            'titre' => ['required', 'string', 'max:255', 'min:3'],
            'categorie' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'duree_travaux' => ['nullable', 'string', 'max:100'],
            'photo_avant' => [
                'nullable',
                File::image()->min('1kb')->max('5mb'),
            ],
            'photo_apres' => [
                $isUpdating ? 'nullable' : 'required',
                File::image()->min('1kb')->max('5mb'),
            ],
            'video_url' => ['nullable', 'string', 'max:500'],
            'date_realisation' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre du projet / chantier est obligatoire.',
            'categorie.required' => 'La catégorie est obligatoire.',
            'description.required' => 'La description des travaux réalisés est obligatoire.',
            'photo_apres.required' => 'La photo après travaux (résultat final) est obligatoire.',
        ];
    }
}
