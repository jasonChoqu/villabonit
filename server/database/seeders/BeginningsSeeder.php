<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BeginningsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('beginnings')->insert([
            [
                'id' => 1,
                'mission' => 'Diseñar, construir y comercializar proyectos propios y de terceros con eficiencia en tiempo, costos y calidad; buscando el beneficio común y el mejoramiento continuo.',
                'vision' => 'Somos una empresa sólida, respetable, versátil y confiable. Tenemos clientes satisfechos. Trabajamos en proyectos creativos e innovadores con altos estándares de calidad, perfeccionando de forma continua nuestros procesos, en base a la experiencia adquirida y las mejores prácticas del mercado.',
                'our_father' => 'asdsadasd',
                'created_at' => Carbon::parse('2025-09-06 23:24:46'),
                'updated_at' => Carbon::parse('2025-09-08 18:22:34'),
            ],
        ]);
    }
}
