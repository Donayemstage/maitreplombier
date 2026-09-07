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
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client');
            $table->string('ville')->nullable();
            $table->string('service_concerne')->nullable();
            $table->unsignedTinyInteger('note')->default(5);
            $table->text('commentaire');
            $table->string('avatar')->nullable();
            $table->enum('statut', ['publie', 'en_attente', 'rejete'])->default('publie');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};
