<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bumdes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BumdesController extends Controller
{
    private function uploadFile(Request $request, string $fileKey, ?string $currentFilePath = null): ?string
    {
        if ($request->hasFile($fileKey)) {
            if ($currentFilePath && Storage::disk('public')->exists($currentFilePath)) {
                Storage::disk('public')->delete($currentFilePath);
            }
            return $request->file($fileKey)->store('documents', 'public');
        }
        return $currentFilePath;
    }

    public function index()
    {
        return response()->json(Bumdes::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'kecamatan' => 'required|string',
            'desa' => ['required', 'string', 'unique:bumdes,desa'],
            'namabumdesa' => 'required|string',
            'status' => 'required|string',
            'SK_BUM_Desa' => 'required|file|mimes:pdf,docx,doc|max:5120',
            'LaporanKeuangan2021' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
        ]);
        
        $bumdesData = $request->except(array_keys($request->allFiles()));
        $bumdes = Bumdes::create($bumdesData);

        $fileFields = [
            'LaporanKeuangan2021', 'LaporanKeuangan2022', 'LaporanKeuangan2023', 'LaporanKeuangan2024',
            'Perdes', 'ProfilBUMDesa', 'BeritaAcara', 'AnggaranDasar', 'AnggaranRumahTangga',
            'ProgramKerja', 'SK_BUM_Desa'
        ];
        
        foreach ($fileFields as $field) {
            $bumdes->$field = $this->uploadFile($request, $field, $bumdes->$field);
        }
        $bumdes->save();

        return response()->json([
            'message' => 'Data BUMDes berhasil disimpan.',
            'data' => $bumdes
        ], 201);
    }

    public function show(Bumdes $bumdes)
    {
        return response()->json($bumdes);
    }

    public function update(Request $request, Bumdes $bumdes)
    {
        $request->validate([
            'namabumdesa' => 'string|nullable',
            'desa' => ['required', 'string', Rule::unique('bumdes')->ignore($bumdes->id)],
            'LaporanKeuangan2021' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'LaporanKeuangan2022' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'LaporanKeuangan2023' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'LaporanKeuangan2024' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'Perdes' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'ProfilBUMDesa' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'BeritaAcara' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'AnggaranDasar' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'AnggaranRumahTangga' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'ProgramKerja' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
            'SK_BUM_Desa' => 'nullable|file|mimes:pdf,docx,doc|max:5120',
        ]);
        
        $bumdes->fill($request->except(array_keys($request->allFiles())));

        $fileFields = [
            'LaporanKeuangan2021', 'LaporanKeuangan2022', 'LaporanKeuangan2023', 'LaporanKeuangan2024',
            'Perdes', 'ProfilBUMDesa', 'BeritaAcara', 'AnggaranDasar', 'AnggaranRumahTangga',
            'ProgramKerja', 'SK_BUM_Desa'
        ];
        
        foreach ($fileFields as $field) {
            $bumdes->$field = $this->uploadFile($request, $field, $bumdes->$field);
        }
        
        $bumdes->save();

        return response()->json([
            'message' => 'Data BUMDes berhasil diperbarui.',
            'data' => $bumdes
        ]);
    }

    public function destroy(Bumdes $bumdes)
    {
        $fileFields = [
            'LaporanKeuangan2021', 'LaporanKeuangan2022', 'LaporanKeuangan2023', 'LaporanKeuangan2024',
            'Perdes', 'ProfilBUMDesa', 'BeritaAcara', 'AnggaranDasar', 'AnggaranRumahTangga',
            'ProgramKerja', 'SK_BUM_Desa'
        ];
        foreach ($fileFields as $field) {
            if ($bumdes->$field && Storage::disk('public')->exists($bumdes->$field)) {
                Storage::disk('public')->delete($bumdes->$field);
            }
        }
        
        $bumdes->delete();

        return response()->json([
            'message' => 'Data BUMDes berhasil dihapus.'
        ], 200);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        $bumdes = Bumdes::where('namabumdesa', 'like', "%{$query}%")
                         ->orWhere('desa', 'like', "%{$query}%")
                         ->get();

        return response()->json($bumdes);
    }
}