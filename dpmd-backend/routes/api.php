<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BidangController;
use App\Http\Controllers\PersonilController;
use App\Http\Controllers\Api\BumdesController;
use App\Http\Controllers\Api\IdentitasBumdesController;
use App\Http\Controllers\Api\AuthController; // Asumsikan Anda memiliki AuthController

// =========================================================
// Rute Publik (akses tanpa login)
// =========================================================
Route::post('login', [AuthController::class, 'login']);
Route::get('bumdes', [BumdesController::class, 'index']);
Route::get('bumdes/search', [BumdesController::class, 'search']);

// =========================================================
// Rute Terlindungi (Membutuhkan Login)
// =========================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('bumdes', [BumdesController::class, 'store']);
    Route::get('bumdes/{bumdes}', [BumdesController::class, 'show']);
    Route::put('bumdes/{bumdes}', [BumdesController::class, 'update']);
    Route::delete('bumdes/{bumdes}', [BumdesController::class, 'destroy']);
    Route::post('logout', [AuthController::class, 'logout']); // Contoh logout
});

// ... (Rute lainnya yang sudah ada)
Route::apiResource('kegiatan', KegiatanController::class);
Route::get('dashboard', [DashboardController::class, 'index']);
Route::get('dashboard/weekly-schedule', [DashboardController::class, 'weeklySchedule']);
Route::get('bidang', [BidangController::class, 'index']);
Route::get('personil', [PersonilController::class, 'index']);
Route::get('personil-by-bidang/{id_bidang}', [PersonilController::class, 'getPersonilByBidang']);
Route::get('kegiatan/export-excel', [KegiatanController::class, 'exportExcel']);
Route::get('identitas-bumdes', [IdentitasBumdesController::class, 'index']);