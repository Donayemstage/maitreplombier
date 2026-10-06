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
            ProjetSeeder::class,
        ]);

        // Compte administrateur : identifiants lus depuis .env (ADMIN_EMAIL / ADMIN_PASSWORD)
        $email = config('app.admin_email');
        $password = config('app.admin_password');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD absents du .env : compte admin non créé.');

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => config('app.admin_name'),
                'password' => Hash::make($password),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
