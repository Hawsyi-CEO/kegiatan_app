<?php

// dpmd-backend/app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;
use App\Models\Kegiatan;
use App\Models\KegiatanBidang;
use App\Models\Bidang;
use App\Models\Personil;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $mingguan = Kegiatan::whereBetween('tanggal_mulai', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        $bulanan = Kegiatan::whereBetween('tanggal_mulai', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->count();
        $per_bidang = KegiatanBidang::select('bidang.id_bidang', 'bidang.nama_bidang', DB::raw('count(*) as total'))
            ->join('bidang', 'kegiatan_bidang.id_bidang', '=', 'bidang.id_bidang')
            ->groupBy('bidang.id_bidang', 'bidang.nama_bidang')
            ->get();
        return response()->json(compact('mingguan', 'bulanan', 'per_bidang'));
    }

    public function weeklySchedule()
    {
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::FRIDAY);
        
        $hari_indonesia = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        $weekly_schedule = [];
        
        for ($i = 0; $i < 5; $i++) {
            $date = $startOfWeek->copy()->addDays($i)->format('Y-m-d');
            $day_name = $hari_indonesia[$startOfWeek->copy()->addDays($i)->dayOfWeek];
            $weekly_schedule[] = [
                'tanggal' => $date,
                'hari' => $day_name,
                'kegiatan' => []
            ];
        }

        $kegiatan = Kegiatan::with(['details.bidang'])
            ->where(function ($query) use ($startOfWeek, $endOfWeek) {
                $query->whereBetween('tanggal_mulai', [$startOfWeek, $endOfWeek]);
            })
            ->orderBy('tanggal_mulai', 'asc')
            ->get();
            
        foreach ($kegiatan as $keg) {
            $tanggal_kegiatan = Carbon::parse($keg->tanggal_mulai);
            $index = $tanggal_kegiatan->dayOfWeek - 1;

            if ($index >= 0 && $index < 5) {
                $weekly_schedule[$index]['kegiatan'][] = $keg;
            }
        }
        return response()->json($weekly_schedule);
    }
}