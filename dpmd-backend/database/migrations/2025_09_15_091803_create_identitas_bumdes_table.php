<?php

// database/migrations/xxxx_xx_xx_create_identitas_bumdes_table.php

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
        Schema::create('identitas_bumdes', function (Blueprint $table) {
            $table->id();
            $table->string('kode_desa')->unique();
            $table->string('desa');
            $table->string('kecamatan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('identitas_bumdes');
    }
};