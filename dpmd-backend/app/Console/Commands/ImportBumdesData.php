<?php

namespace App\Console\Commands;

use App\Models\Bumdes;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportBumdesData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:bumdes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data BUMDes from a JSON file into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $jsonFilePath = storage_path('app/desk_bumdes2025.json');

        if (!File::exists($jsonFilePath)) {
            $this->error('File desk_bumdes2025.json tidak ditemukan!');
            return 1;
        }

        $jsonContent = File::get($jsonFilePath);
        $data = json_decode($jsonContent, true);

        if (is_null($data)) {
            $this->error('Gagal mem-parsing file JSON. Pastikan formatnya valid.');
            return 1;
        }
        
        if (!is_array($data) || (is_array($data) && array_keys($data) !== range(0, count($data) - 1))) {
            $data = [$data];
        }

        $this->info('Memulai impor data BUMDes...');

        $importedCount = 0;
        foreach ($data as $item) {
            try {
                // Periksa apakah 'desa' ada untuk mencegah kesalahan duplikasi data
                if (!isset($item['desa'])) {
                    $this->warn('Melewati item karena tidak ada nama desa.');
                    continue;
                }

                // Normalisasi data uang dari string rupiah ke integer
                $item['Omset2023'] = (int) preg_replace('/[^0-9]/', '', $item['Omset2023'] ?? 0);
                $item['Laba2023'] = (int) preg_replace('/[^0-9]/', '', $item['Laba2023'] ?? 0);
                $item['Omset2024'] = (int) preg_replace('/[^0-9]/', '', $item['Omset2024'] ?? 0);
                $item['Laba2024'] = (int) preg_replace('/[^0-9]/', '', $item['Laba2024'] ?? 0);
                $item['PenyertaanModal2019'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2019'] ?? 0);
                $item['PenyertaanModal2020'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2020'] ?? 0);
                $item['PenyertaanModal2021'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2021'] ?? 0);
                $item['PenyertaanModal2022'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2022'] ?? 0);
                $item['PenyertaanModal2023'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2023'] ?? 0);
                $item['PenyertaanModal2024'] = (int) preg_replace('/[^0-9]/', '', $item['PenyertaanModal2024'] ?? 0);
                $item['SumberLain'] = (int) preg_replace('/[^0-9]/', '', $item['SumberLain'] ?? 0);
                $item['NilaiAset'] = (int) preg_replace('/[^0-9]/', '', $item['NilaiAset'] ?? 0);
                $item['KontribusiTerhadapPADes2021'] = (int) preg_replace('/[^0-9]/', '', $item['KontribusiTerhadapPADes2021'] ?? 0);
                $item['KontribusiTerhadapPADes2022'] = (int) preg_replace('/[^0-9]/', '', $item['KontribusiTerhadapPADes2022'] ?? 0);
                $item['KontribusiTerhadapPADes2023'] = (int) preg_replace('/[^0-9]/', '', $item['KontribusiTerhadapPADes2023'] ?? 0);
                $item['KontribusiTerhadapPADes2024'] = (int) preg_replace('/[^0-9]/', '', $item['KontribusiTerhadapPADes2024'] ?? 0);
                
                // Hapus key yang tidak ada di model untuk menghindari error 'mass assignment'
                $dataToInsert = array_intersect_key($item, array_flip((new Bumdes())->getFillable()));
                
                Bumdes::updateOrCreate(
                    ['desa' => $item['desa']],
                    $dataToInsert
                );
                $importedCount++;
            } catch (\Exception $e) {
                $this->error("Gagal mengimpor data untuk desa: {$item['desa']}. Error: {$e->getMessage()}");
            }
        }

        $this->info("Impor selesai. {$importedCount} data BUMDes berhasil diimpor.");
        return 0;
    }
}