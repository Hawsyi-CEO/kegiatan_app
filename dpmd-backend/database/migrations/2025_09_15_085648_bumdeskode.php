<?php

// database/migrations/xxxx_xx_xx_add_kode_desa_to_bumdes_table.php

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
        Schema::table('bumdes', function (Blueprint $table) {
            // Tambahkan kolom kode_desa setelah id
            $table->string('kode_desa')->after('id')->nullable()->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bumdes', function (Blueprint $table) {
            $table->dropColumn('kode_desa');
        });
    }
};
