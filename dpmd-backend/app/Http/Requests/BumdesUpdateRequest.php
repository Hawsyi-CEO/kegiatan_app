<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BumdesUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $bumdesId = $this->route('bumdes');

        return [
            'kode_desa' => ['nullable', 'string', Rule::unique('bumdes')->ignore($bumdesId, 'id')],
            'kecamatan' => 'nullable|string',
            'desa' => 'nullable|string',
            'namabumdesa' => 'nullable|string',
            'status' => 'nullable|string',
            'keterangan_tidak_aktif' => 'nullable|string',
            'NIB' => 'nullable|string',
            'LKPP' => 'nullable|string',
            'NPWP' => 'nullable|string',
            'badanhukum' => 'nullable|string',
            'NamaPenasihat' => 'nullable|string',
            'JenisKelaminPenasihat' => 'nullable|string',
            'HPPenasihat' => 'nullable|string',
            'NamaPengawas' => 'nullable|string',
            'JenisKelaminPengawas' => 'nullable|string',
            'HPPengawas' => 'nullable|string',
            'NamaDirektur' => 'nullable|string',
            'JenisKelaminDirektur' => 'nullable|string',
            'HPDirektur' => 'nullable|string',
            'NamaSekretaris' => 'nullable|string',
            'JenisKelaminSekretaris' => 'nullable|string',
            'HPSekretaris' => 'nullable|string',
            'NamaBendahara' => 'nullable|string',
            'JenisKelaminBendahara' => 'nullable|string',
            'HPBendahara' => 'nullable|string',
            'TahunPendirian' => 'nullable|string',
            'AlamatBumdesa' => 'nullable|string',
            'Alamatemail' => 'nullable|string|email',
            'TotalTenagaKerja' => 'nullable|numeric',
            'TelfonBumdes' => 'nullable|string',
            'JenisUsaha' => 'nullable|string',
            'JenisUsahaUtama' => 'nullable|string',
            'JenisUsahaLainnya' => 'nullable|string',
            // Perhatikan penyesuaian untuk field Omset, Laba, Modal, dll.
            // Sesuai dengan nama key yang dikirim dari React frontend.
            'OmsetTahun2021' => 'nullable|numeric',
            'OmsetTahun2022' => 'nullable|numeric',
            'OmsetTahun2023' => 'nullable|numeric',
            'LabaTahun2021' => 'nullable|numeric',
            'LabaTahun2022' => 'nullable|numeric',
            'LabaTahun2023' => 'nullable|numeric',
            'ModalTahun2021' => 'nullable|numeric',
            'ModalTahun2022' => 'nullable|numeric',
            'ModalTahun2023' => 'nullable|numeric',
            'KontribusiPAD2021' => 'nullable|numeric',
            'KontribusiPAD2022' => 'nullable|numeric',
            'KontribusiPAD2023' => 'nullable|numeric',
            'NilaiAset' => 'nullable|numeric',
            'SumberLain' => 'nullable|numeric',
            'LaporanKeuangan2021' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'LaporanKeuangan2022' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'LaporanKeuangan2023' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'LaporanKeuangan2024' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'Perdes' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'ProfilBUMDesa' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'BeritaAcara' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'AnggaranDasar' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'AnggaranRumahTangga' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'ProgramKerja' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
            'SK_BUM_Desa' => 'nullable|file|mimes:pdf,docx,xlsx|max:2048',
        ];
    }
}