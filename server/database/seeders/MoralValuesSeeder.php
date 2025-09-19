<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MoralValuesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('moral_values')->insert([
            [
                'id' => 1,
                'title' => 'Confiabilidad',
                'description' => "Hacemos cada tarea y/o actividad en el momento y forma requerida.\nCreatividad e Innovación\nBuscamos de forma permanente nuevas soluciones estéticamente agradables y funcionales para nuestros proyectos.",
                'created_at' => Carbon::parse('2025-09-06 19:49:45'),
                'updated_at' => Carbon::parse('2025-09-06 23:36:53'),
            ],
            [
                'id' => 2,
                'title' => 'Calidad',
                'description' => 'Buscamos hacer las cosas bien en todo momento y lugar.',
                'created_at' => Carbon::parse('2025-09-06 23:37:14'),
                'updated_at' => Carbon::parse('2025-09-06 23:37:14'),
            ],
            [
                'id' => 3,
                'title' => 'Integridad',
                'description' => 'Cumplimos todo lo que decimos.',
                'created_at' => Carbon::parse('2025-09-06 23:37:36'),
                'updated_at' => Carbon::parse('2025-09-06 23:37:36'),
            ],
            [
                'id' => 4,
                'title' => 'Versatilidad',
                'description' => 'Tenemos la capacidad de adaptarnos a diferentes proyectos y coyunturas para cumplir nuestros compromisos.',
                'created_at' => Carbon::parse('2025-09-06 23:37:51'),
                'updated_at' => Carbon::parse('2025-09-06 23:37:51'),
            ],
            [
                'id' => 5,
                'title' => 'Pericia',
                'description' => 'Nos aseguramos de contar con la formación, habilidades y experiencia necesarias en todo momento para cada tarea y/o proyecto.',
                'created_at' => Carbon::parse('2025-09-06 23:38:16'),
                'updated_at' => Carbon::parse('2025-09-06 23:38:16'),
            ],
            [
                'id' => 6,
                'title' => 'Eficiencia',
                'description' => 'Buscamos hacer cada una de nuestras tareas, haciendo uso adecuado de los recursos.',
                'created_at' => Carbon::parse('2025-09-06 23:38:33'),
                'updated_at' => Carbon::parse('2025-09-06 23:38:33'),
            ],
            [
                'id' => 7,
                'title' => 'Eficiencia',
                'description' => 'Buscamos hacer cada una de nuestras tareas, haciendo uso adecuado de los recursos.',
                'created_at' => Carbon::parse('2025-09-06 23:39:00'),
                'updated_at' => Carbon::parse('2025-09-06 23:39:00'),
            ],
            [
                'id' => 8,
                'title' => 'Honestidad',
                'description' => 'Siempre vamos con la verdad a nuestros clientes y colaboradores.',
                'created_at' => Carbon::parse('2025-09-06 23:39:22'),
                'updated_at' => Carbon::parse('2025-09-06 23:39:22'),
            ],
            [
                'id' => 9,
                'title' => 'Transparencia',
                'description' => 'Claridad en todo lo que hacemos.',
                'created_at' => Carbon::parse('2025-09-06 23:39:42'),
                'updated_at' => Carbon::parse('2025-09-06 23:39:42'),
            ],
            [
                'id' => 10,
                'title' => 'Trabajo en equipo',
                'description' => 'Trabajamos en un entorno colaborativo donde obtenemos resultados positivos gracias a la colaboración y complementación de nuestra formación, habilidades y experiencias.',
                'created_at' => Carbon::parse('2025-09-06 23:39:59'),
                'updated_at' => Carbon::parse('2025-09-06 23:39:59'),
            ],
        ]);
    }
}
