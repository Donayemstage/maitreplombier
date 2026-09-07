<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DevisRequestForm extends FormRequest
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
        return [
            'montant_main_oeuvre' => ['required', 'numeric', 'min:0'],
            'montant_materiel' => ['nullable', 'numeric', 'min:0'],
            'frais_deplacement' => ['nullable', 'numeric', 'min:0'],
            'total_devis' => ['required', 'numeric', 'min:0'],
            'conditions_execution' => ['nullable', 'string', 'max:2000'],
            'date_validite' => ['nullable', 'date'],
            'statut_client' => ['required', Rule::in(['en_attente', 'accepte', 'refuse'])],
            'statut_demande' => ['nullable', Rule::in(['en_attente', 'en_cours', 'traite', 'annule'])],
            'send_email' => ['nullable', 'boolean'],
            'canal_envoi' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'montant_main_oeuvre.required' => 'Le montant de la main d’œuvre est obligatoire.',
            'montant_main_oeuvre.numeric' => 'Le montant de la main d’œuvre doit être un nombre valide.',
            'total_devis.required' => 'Le total du devis est obligatoire.',
            'statut_client.required' => 'Le statut du devis est obligatoire.',
        ];
    }
}
