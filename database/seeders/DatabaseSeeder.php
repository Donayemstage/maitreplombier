<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Création de votre compte Super Admin (déjà vérifié)
        User::create([
            'name' => 'Foaleng Neumann',
            'email' => 'foalengfranck6@gmail.com',
            'password' => Hash::make('pogba@21'),
            'is_admin' => true,
            'email_verified_at' => now(), // Empêche le blocage 403
        ]);
    }
}
