<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentitasBumdes extends Model
{
    use HasFactory;

    // Menunjukkan nama tabel secara eksplisit
    protected $table = 'identitas_bumdes';

    // Mendeklarasikan bahwa tabel tidak memiliki kolom created_at dan updated_at
    public $timestamps = false;
    
    // Mendeklarasikan kolom-kolom yang dapat diisi
    protected $fillable = [
        'kecamatan',
        'desa',
        'kode_desa'
    ];

    // Jika primary key Anda bukan 'id', Anda perlu mendeklarasikannya
    // protected $primaryKey = 'kode_desa';
}