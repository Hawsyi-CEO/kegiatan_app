<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BidangController;
use App\Http\Controllers\PersonilController;
use App\Http\Controllers\Api\BumdesController;
use App\Http\Controllers\Api\IdentitasBumdesController;

Route::get('kegiatan/export-excel', [KegiatanController::class, 'exportExcel']);
Route::apiResource('kegiatan', KegiatanController::class);

Route::get('dashboard', [DashboardController::class, 'index']);
Route::get('dashboard/weekly-schedule', [DashboardController::class, 'weeklySchedule']);
Route::get('bidang', [BidangController::class, 'index']);
Route::get('personil', [PersonilController::class, 'index']);
Route::get('personil-by-bidang/{id_bidang}', [PersonilController::class, 'getPersonilByBidang']);

// =========================================================
// RUTE BUMDES YANG TELAH DIPERBAIKI
// =========================================================

// Rute login disesuaikan dengan frontend.
Route::post('login/desa', [BumdesController::class, 'loginByDesa']); 

Route::get('bumdes/search', [BumdesController::class, 'search']);
Route::get('bumdes', [BumdesController::class, 'index']);
Route::post('bumdes', [BumdesController::class, 'store']);
Route::get('bumdes/{bumdes}', [BumdesController::class, 'show']);

// PERBAIKAN: Gunakan Route::put untuk pembaruan data
Route::put('bumdes/{bumdes}', [BumdesController::class, 'update']);
Route::delete('bumdes/{bumdes}', [BumdesController::class, 'destroy']);
Route::get('/identitas-bumdes', [IdentitasBumdesController::class, 'index']);