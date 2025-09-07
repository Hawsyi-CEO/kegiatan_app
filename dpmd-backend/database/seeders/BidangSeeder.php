<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BidangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('bidang')->insert([
            ['id_bidang' => 1, 'nama_bidang' => 'Sekretariat'],
            ['id_bidang' => 2, 'nama_bidang' => 'Sarana Prasarana Kewilayahan dan Ekonomi Desa'],
            ['id_bidang' => 3, 'nama_bidang' => 'Kekayaan dan Keuangan Desa'],
            ['id_bidang' => 4, 'nama_bidang' => 'Pemberdayaan Masyarakat Desa'],
            ['id_bidang' => 5, 'nama_bidang' => 'Pemerintahan Desa'],
            ['id_bidang' => 6, 'nama_bidang' => 'Program dan Laporan'],
            ['id_bidang' => 7, 'nama_bidang' => 'Tenaga Alih Daya'],
            ['id_bidang' => 8, 'nama_bidang' => 'Tenaga Keamanan'],
            ['id_bidang' => 9, 'nama_bidang' => 'Tenaga Kebersihan'],
        ]);
    }
}