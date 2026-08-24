<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom_service' => ['required', 'string', 'max:255', 'min:2'],
            'description_service' => ['required', 'string', 'trim', 'max:255', 'min:2'],
            'description_detail_service' => ['required', 'string', 'max:3000', 'trim', 'min:20'],
            

            'icone_service' => [
                'required',
                'string',
                Rule::in([
                    'wrench',       // Clé anglaise
                    'droplet',      // Goutte d'eau
                    'pipe',         // Tuyau
                    'flame',        // Flamme / Chauffage
                    'shield-check', // Garantie / Sécurité
                    'hammer',       // Travaux
                    'shower-head',  // Salle de bain
                    'thermometer',  // Chauffage
                ]),
],
            'prix_service' => ['required', 'numeric', 'gt:0', 'decimal:0,2', 'digits_between:1,8'],
            'image_service' => [
                'required',
                File::image()
                ->min('1kb')
                ->max('5mb')
            
            ],
        ]; 
    }
}