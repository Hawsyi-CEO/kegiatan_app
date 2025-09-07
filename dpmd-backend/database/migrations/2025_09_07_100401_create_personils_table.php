<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('personil', function (Blueprint $table) {
            $table->increments('id_personil');
            $table->integer('id_bidang')->unsigned();
            $table->string('nama_personil');
            $table->timestamps();
            $table->foreign('id_bidang')->references('id_bidang')->on('bidang')->onDelete('cascade');
        });
    }
};