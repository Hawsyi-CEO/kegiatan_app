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
        Schema::create('bumdes', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan')->nullable();
            $table->string('desa')->unique();
            $table->string('namabumdesa')->nullable();
            $table->string('status')->nullable();
            $table->string('keterangan_tidak_aktif')->nullable();
            $table->string('NIB')->nullable();
            $table->string('LKPP')->nullable();
            $table->string('NPWP')->nullable();
            $table->string('badanhukum')->nullable();
            $table->string('NamaPenasihat')->nullable();
            $table->string('JenisKelaminPenasihat')->nullable();
            $table->string('HPPenasihat')->nullable();
            $table->string('NamaPengawas')->nullable();
            $table->string('JenisKelaminPengawas')->nullable();
            $table->string('HPPengawas')->nullable();
            $table->string('NamaDirektur')->nullable();
            $table->string('JenisKelaminDirektur')->nullable();
            $table->string('HPDirektur')->nullable();
            $table->string('NamaSekretaris')->nullable();
            $table->string('JenisKelaminSekretaris')->nullable();
            $table->string('HPSekretaris')->nullable();
            $table->string('NamaBendahara')->nullable();
            $table->string('JenisKelaminBendahara')->nullable();
            $table->string('HPBendahara')->nullable();
            $table->integer('TahunPendirian')->nullable();
            $table->string('AlamatBumdesa')->nullable();
            $table->string('Alamatemail')->nullable();
            $table->integer('TotalTenagaKerja')->nullable();
            $table->string('TelfonBumdes')->nullable();
            $table->string('JenisUsaha')->nullable();
            $table->string('JenisUsahaUtama')->nullable();
            $table->string('JenisUsahaLainnya')->nullable();
            $table->bigInteger('Omset2023')->nullable();
            $table->bigInteger('Laba2023')->nullable();
            $table->bigInteger('Omset2024')->nullable();
            $table->bigInteger('Laba2024')->nullable();
            $table->bigInteger('PenyertaanModal2019')->nullable();
            $table->bigInteger('PenyertaanModal2020')->nullable();
            $table->bigInteger('PenyertaanModal2021')->nullable();
            $table->bigInteger('PenyertaanModal2022')->nullable();
            $table->bigInteger('PenyertaanModal2023')->nullable();
            $table->bigInteger('PenyertaanModal2024')->nullable();
            $table->bigInteger('SumberLain')->nullable();
            $table->string('JenisAset')->nullable();
            $table->bigInteger('NilaiAset')->nullable();
            $table->string('KerjasamaPihakKetiga')->nullable();
            $table->string('TahunMulai-TahunBerakhir')->nullable();
            $table->bigInteger('KontribusiTerhadapPADes2021')->nullable();
            $table->bigInteger('KontribusiTerhadapPADes2022')->nullable();
            $table->bigInteger('KontribusiTerhadapPADes2023')->nullable();
            $table->bigInteger('KontribusiTerhadapPADes2024')->nullable();
            $table->string('Ketapang2024')->nullable();
            $table->string('Ketapang2025')->nullable();
            $table->string('BantuanKementrian')->nullable();
            $table->string('BantuanLaptopShopee')->nullable();
            $table->string('NomorPerdes')->nullable();
            
            // Kolom untuk path file
            $table->string('LaporanKeuangan2021')->nullable();
            $table->string('LaporanKeuangan2022')->nullable();
            $table->string('LaporanKeuangan2023')->nullable();
            $table->string('LaporanKeuangan2024')->nullable();
            $table->string('Perdes')->nullable();
            $table->string('ProfilBUMDesa')->nullable();
            $table->string('BeritaAcara')->nullable();
            $table->string('AnggaranDasar')->nullable();
            $table->string('AnggaranRumahTangga')->nullable();
            $table->string('ProgramKerja')->nullable();
            $table->string('SK_BUM_Desa')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bumdes');
    }
};