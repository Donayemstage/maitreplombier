<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ServiceSeeder::class,
            ProjetSeeder::class, //  Ajout du ProjetSeeder
        ]);
            

        // Création de votre compte Super Admin (déjà vérifié)
        /*User::updateOrCreate([
            'name' => 'Foaleng Neumann',
            'email' => 'foalengfranck6@gmail.com',
            'password' => Hash::make('MaitrePlombier2026@'),
            'is_admin' => true,
            'email_verified_at' => now(), // Empêche le blocage 403
        ]);*/

        User::updateOrCreate(
                ['email' => 'foalengfranck6@gmail.com'], // Condition pour chercher si l'utilisateur existe
                [
                    'name' => 'Foaleng Neumann',
                    'password' => Hash::make('MaitrePlombier2026@'),
                    'is_admin' => true,
                    'email_verified_at' => now(),
                ]
  );
    }


}
