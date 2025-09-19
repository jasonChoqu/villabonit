<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vaciar la tabla (equivalente a DELETE FROM banners;)
        DB::table('banners')->truncate();

        // Insertar registros
        DB::table('banners')->insert([
            [
                'id' => 1,
                'title' => 'Nosotros',
                'subtitle' => null,
                'image' => 'assets/banners/us_default.png',
            ],
            [
                'id' => 2,
                'title' => 'Proyectos',
                'subtitle' => null,
                'image' => 'assets/banners/proyects_default.png',
            ],
            [
                'id' => 3,
                'title' => 'Servicios',
                'subtitle' => null,
                'image' => 'assets/banners/services_default.png',
            ],
        ]);
    }
}
