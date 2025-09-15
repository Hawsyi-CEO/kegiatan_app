<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\IdentitasBumdes; // Baris ini yang ditambahkan

class IdentitasBumdesController extends Controller
{
    /**
     * Ambil data kecamatan, desa, dan kode desa dari database.
     */
    public function index()
    {
        try {
            // Ambil semua data dari tabel identitas_bumdes
            $data = IdentitasBumdes::select('kecamatan', 'desa', 'kode_desa')->get();

            // Kirim data dalam format JSON
            return response()->json($data);
        } catch (\Exception $e) {
            // Jika ada error, kirim respons error
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}