<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BidangController;
use App\Http\Controllers\PersonilController;
use App\Http\Controllers\Api\BumdesController; // Tambahkan ini

// Rute spesifik untuk 'export-excel' harus didefinisikan terlebih dahulu.
Route::get('kegiatan/export-excel', [KegiatanController::class, 'exportExcel']);

// Rute 'apiResource' yang bersifat umum harus berada di bawahnya.
Route::apiResource('kegiatan', KegiatanController::class);

Route::get('dashboard', [DashboardController::class, 'index']);
Route::get('dashboard/weekly-schedule', [DashboardController::class, 'weeklySchedule']);
Route::get('bidang', [BidangController::class, 'index']);
Route::get('personil', [PersonilController::class, 'index']);
Route::get('personil-by-bidang/{id_bidang}', [PersonilController::class, 'getPersonilByBidang']);

// =========================================================
//         PENTING: Letakkan Rute Spesifik di Atas
// =========================================================
Route::get('bumdes/search', [BumdesController::class, 'search']);

// Rute 'apiResource' yang bersifat umum harus berada di bawahnya
Route::apiResource('bumdes', BumdesController::class);