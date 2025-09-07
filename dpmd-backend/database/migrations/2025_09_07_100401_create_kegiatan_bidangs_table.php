<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('kegiatan_bidang', function (Blueprint $table) {
            $table->increments('id_kegiatan_bidang');
            $table->integer('id_kegiatan')->unsigned();
            $table->integer('id_bidang')->unsigned();
            $table->string('personil');
            $table->timestamps();
            $table->foreign('id_kegiatan')->references('id_kegiatan')->on('kegiatan')->onDelete('cascade');
            $table->foreign('id_bidang')->references('id_bidang')->on('bidang')->onDelete('cascade');
        });
    }
};