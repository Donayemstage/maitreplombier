<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            if (!Schema::hasColumn('contacts', 'token')) {
                $table->string('token', 64)->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('contacts', 'motif_refus')) {
                $table->text('motif_refus')->nullable()->after('statut');
            }
        });

        Schema::table('devis', function (Blueprint $table) {
            if (!Schema::hasColumn('devis', 'canal_envoi')) {
                $table->string('canal_envoi')->nullable()->after('statut_client');
            }
            if (!Schema::hasColumn('devis', 'date_envoi')) {
                $table->timestamp('date_envoi')->nullable()->after('canal_envoi');
            }
            if (!Schema::hasColumn('devis', 'motif_refus')) {
                $table->text('motif_refus')->nullable()->after('date_envoi');
            }
        });

        // Générer des tokens uniques pour tous les contacts existants
        $contacts = DB::table('contacts')->whereNull('token')->get();
        foreach ($contacts as $contact) {
            DB::table('contacts')->where('id', $contact->id)->update([
                'token' => Str::random(32),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('devis', function (Blueprint $table) {
            if (Schema::hasColumn('devis', 'motif_refus')) {
                $table->dropColumn('motif_refus');
            }
            if (Schema::hasColumn('devis', 'date_envoi')) {
                $table->dropColumn('date_envoi');
            }
            if (Schema::hasColumn('devis', 'canal_envoi')) {
                $table->dropColumn('canal_envoi');
            }
        });

        Schema::table('contacts', function (Blueprint $table) {
            if (Schema::hasColumn('contacts', 'motif_refus')) {
                $table->dropColumn('motif_refus');
            }
            if (Schema::hasColumn('contacts', 'token')) {
                $table->dropColumn('token');
            }
        });
    }
};