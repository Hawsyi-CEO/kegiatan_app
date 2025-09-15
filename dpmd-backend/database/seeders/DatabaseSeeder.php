<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            BidangSeeder::class,
            PersonilSeeder::class,
            BumdesTableSeeder::class,
            InitialBumdesDataSeeder::class,
        ]);
    }
}