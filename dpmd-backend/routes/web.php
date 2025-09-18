<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Rute fallback untuk melayani aplikasi React.
// Rute ini akan menangkap semua permintaan GET yang tidak cocok dengan rute lain
// dan mengarahkannya ke file index.html yang telah Anda tempatkan di folder public.
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');