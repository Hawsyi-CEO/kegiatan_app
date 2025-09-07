<?php

// dpmd-backend/app/Services/KegiatanService.php
namespace App\Services;
use App\Models\Kegiatan;
use App\Models\KegiatanBidang;
use Carbon\Carbon;

class KegiatanService
{
    public function checkPersonilConflict(array $personilBidangList, $tanggalMulai, $tanggalSelesai, $excludeId = null)
    {
        $personilNames = collect($personilBidangList)
            ->flatMap(fn ($item) => $item['personil'])
            ->filter()
            ->unique()
            ->toArray();
        
        if (empty($personilNames)) {
            return false;
        }

        foreach ($personilNames as $personilName) {
            $query = KegiatanBidang::query()
                ->where('personil', 'like', "%{$personilName}%")
                ->whereHas('kegiatan', function ($q) use ($tanggalMulai, $tanggalSelesai) {
                    $q->where(function ($subQuery) use ($tanggalMulai, $tanggalSelesai) {
                        $subQuery->whereBetween('tanggal_mulai', [$tanggalMulai, $tanggalSelesai])
                                 ->orWhereBetween('tanggal_selesai', [$tanggalMulai, $tanggalSelesai])
                                 ->orWhere(function ($q2) use ($tanggalMulai, $tanggalSelesai) {
                                     $q2->where('tanggal_mulai', '<', $tanggalMulai)
                                        ->where('tanggal_selesai', '>', $tanggalSelesai);
                                 });
                    });
                });
            
            if ($excludeId) {
                $query->where('id_kegiatan', '!=', $excludeId);
            }

            $conflict = $query->with('kegiatan')->first();
            
            if ($conflict) {
                return "Personil '{$personilName}' sudah ditugaskan untuk kegiatan '{$conflict->kegiatan->nama_kegiatan}' pada tanggal tersebut.";
            }
        }
        return false;
    }
}