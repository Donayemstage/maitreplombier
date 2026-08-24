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
        Schema::create('devis', function (Blueprint $table) {
            $table->id();

            // Relation avec la demande client (table contacts)
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade');

            // Détails du chiffrage rédigé par l'admin
            $table->string('montant_main_oeuvre', 10, 2);
            $table->string('montant_materiel', 10, 2)->default(0);
            $table->string('frais_deplacement', 10, 2)->default(0);
            $table->string('total_devis', 10, 2);

            // Détails d'exécution / Remarques
            $table->text('conditions_execution')->nullable();
            $table->date('date_validite')->nullable();

            // Réponse ou décision du client sur ce devis
            $table->enum('statut_client', ['en_attente', 'accepte', 'refuse'])->default('en_attente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devis');
    }
};
