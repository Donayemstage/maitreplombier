<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'montant_main_oeuvre' => ['required', 'numeric', 'decimal:0,2', 'digits_between:1,8'],
            'montant_materiel' => ['required', 'numeric', 'decimal:0,2', 'digits_between:1,8'],
            'frais_deplacement' => ['required', 'numeric', 'decimal:0', 'digits_between:1,8'],
            'total_devis' => ['required', 'numeric', 'decimal:0,2', 'digits_between:1,8'],
            'conditions_execution' => ['nullable', 'string', 'max:1000'],
            'date_validite' => ['nullable', 'date', 'after_or_equal:today'],
            'statut_client' => ['required', Rule::in(['en_attente', 'accepte', 'refuse'])],
            
        ];
    }
}
