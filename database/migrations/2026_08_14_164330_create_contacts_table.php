<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('telephone');
            $table->string('email');
            $table->string('ville');
            $table->foreignId('service_id')
                    ->constrained('services')
                    ->onDelete('cascade');
                        

                // Intervention
            $table->string('type_intervention');
            $table->string('equipement')->nullable();
            $table->string('urgence')->default('normal');

                // Description
            $table->longText('message');

            // Rendez-vous souhaité
            $table->date('date_intervention');
            $table->time('heure_intervention')->nullable();

            // Matériel
            $table->boolean('materiel_fourni')->default(false);

            // Budget
            //$table->string('budget');
            // Photo
            $table->string('photo_probleme')->nullable();

            // Suivi de la demande
            $table->string('statut')->default('en_attente');

            
            $table->timestamps();

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
