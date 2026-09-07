<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class ContactRequest extends FormRequest
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
            'nom' => ['required', 'string', 'max:255', 'min:2'],
            'telephone' => ['required', 'string', 'regex:/^(?:\+237|00237)?6[25-9][0-9]{7}$/'],
            'email' => ['required', 'email'],
            'ville' => ['required', 'string', 'max:100'],
            'adresse' => ['required', 'string', 'max:255'],
            'type_intervention' => ['required', 'string', Rule::in([
                'depannage', 'installation', 'fuite', 'canalisation', 
                'chauffe_eau', 'salle_bain', 'wc', 'autre'
            ])],
            'equipement' => ['nullable', 'string', Rule::in([
                'robinet', 'evier', 'lavabo', 'douche', 'baignoire', 
                'wc', 'chauffe_eau', 'canalisation', 'autre'
            ])],
            'urgence' => ['required', Rule::in(['normale', 'urgente', 'tres_urgente'])],
            
            'date_intervention' => ['required', 'date', 'after_or_equal:today'],
            'heure_intervention' => ['nullable', 'date_format:H:i'],
            'message' => ['required', 'string', 'min:10'],
            'materiel_fourni' => ['required', 'boolean'],
            'photo_probleme' => [
                'nullable',
                 File::image()
                     ->min('1kb')
                     ->max('5mb')],
            
        ];
    }


    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom complet est obligatoire.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'email.required' => "L'adresse email est obligatoire.",
            'telephone.required' => 'Le numéro de téléphone est obligatoire.',
            'telephone.regex' => 'Veuillez entrer un numéro de téléphone valide.',
            'ville.required' => 'La ville ou le quartier est obligatoire.',
            'adresse.required' => "L'adresse précise est obligatoire.",
            'type_intervention.required' => "Veuillez sélectionner un type d'intervention.",
            'message.required' => 'Veuillez décrire votre problème.',
            'message.min' => 'La description doit faire au moins 10 caractères.',
            'date_intervention.after_or_equal' => 'La date ne peut pas être dans le passé.',
            'photo_probleme.image' => 'Le fichier doit être une image.',
            'photo_probleme.max' => "L'image ne doit pas dépasser 5 Mo.",
        ];
    }
}

