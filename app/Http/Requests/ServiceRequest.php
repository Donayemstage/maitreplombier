<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isUpdating = $this->isMethod('PUT') || $this->isMethod('PATCH') || $this->route('service');

        return [
            'nom_service' => ['required', 'string', 'max:255', 'min:2'],
            'description_service' => ['required', 'string', 'max:500', 'min:5'],
            'description_detail_service' => ['required', 'string', 'max:5000', 'min:10'],
            'icone_service' => [
                'required',
                'string',
                Rule::in([
                    'wrench',       // Clé anglaise
                    'droplets',     // Goutte d'eau
                    'droplet',      // Gouttelette
                    'pipe',         // Tuyauterie
                    'flame',        // Chauffage / Chauffe-eau
                    'shield-check', // Garantie / Normes
                    'hammer',       // Travaux & Rénovation
                    'shower-head',  // Salle de bain / Douche
                    'bath',         // Baignoire
                    'thermometer',  // Thermique
                    'sparkles',     // Finition / Rénovation
                    'zap',          // Dépannage express
                ]),
            ],
            'prix_service' => ['required', 'numeric', 'min:0'],
            'image_service' => [
                $isUpdating ? 'nullable' : 'required',
                File::image()
                    ->min('1kb')
                    ->max('5mb'),
            ],
        ]; 
    }

    public function messages(): array
    {
        return [
            'nom_service.required' => 'Le nom du service est obligatoire.',
            'description_service.required' => 'La description courte est obligatoire.',
            'description_detail_service.required' => 'La description détaillée est obligatoire.',
            'icone_service.required' => 'Veuillez choisir une icône représentative.',
            'prix_service.required' => 'Le tarif indicatif est obligatoire.',
            'prix_service.numeric' => 'Le tarif indicatif doit être un montant valide en FCFA.',
            'image_service.required' => 'Une image d’illustration est obligatoire pour ce service.',
            'image_service.image' => 'Le fichier doit être une image valide (JPG, PNG, WEBP).',
            'image_service.max' => 'L’image ne doit pas dépasser 5 Mo.',
        ];
    }
}