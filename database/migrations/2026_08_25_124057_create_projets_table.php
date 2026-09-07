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
        Schema::create('projets', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('categorie')->default('salle_de_bain');
            $table->text('description');
            $table->string('lieu')->nullable();
            $table->string('duree_travaux')->nullable();
            $table->string('photo_avant')->nullable();
            $table->string('photo_apres');
            $table->string('video_url')->nullable();
            $table->date('date_realisation')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projets');
    }
};
