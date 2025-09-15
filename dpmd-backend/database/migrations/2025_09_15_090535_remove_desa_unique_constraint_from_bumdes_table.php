<?php
// database/migrations/xxxx_xx_xx_remove_desa_unique_constraint_from_bumdes_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bumdes', function (Blueprint $table) {
            // Hapus constraint unique pada kolom 'desa'
            $table->dropUnique(['desa']);
        });
    }

    public function down(): void
    {
        Schema::table('bumdes', function (Blueprint $table) {
            // Tambahkan kembali constraint unique jika diperlukan
            $table->unique('desa');
        });
    }
};