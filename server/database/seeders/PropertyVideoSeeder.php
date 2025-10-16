<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyVideo;
use Illuminate\Database\Seeder;

class PropertyVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear una propiedad de ejemplo si no existe
        $property = Property::firstOrCreate([
            'title' => 'Casa Moderna con Vista al Mar',
            'slug' => 'casa-moderna-vista-mar'
        ], [
            'description' => 'Hermosa casa moderna con vista panorámica al mar, ubicada en una zona exclusiva.',
            'property_type' => 'house',
            'status' => 'available',
            'price' => 350000.00,
            'currency' => 'USD',
            'area_m2' => 250.00,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'parking' => 2,
            'address' => 'Av. Costanera 123',
            'city' => 'Villa Bonita',
            'state' => 'Estado',
            'zipcode' => '12345',
            'lat' => -34.6037,
            'lng' => -58.3816,
            'built_year' => 2020,
            'amenities' => ['piscina', 'jardin', 'balcon', 'terraza'],
            'agent_name' => 'Juan Pérez',
            'agent_phone' => '+1234567890',
            'agent_email' => 'juan@villabonitrealestate.com',
            'is_featured' => true
        ]);

        // Agregar videos de ejemplo
        $videos = [
            [
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'title' => 'Tour Virtual Completo - Casa Moderna',
                'description' => 'Recorrido completo por toda la propiedad mostrando cada habitación y espacio.',
                'video_type' => 'tour_virtual',
                'sort_order' => 1,
                'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                'is_featured' => true,
                'is_active' => true,
                'allow_autoplay' => false,
                'show_controls' => true,
                'show_info' => true
            ],
            [
                'youtube_url' => 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                'youtube_video_id' => '9bZkp7q19f0',
                'title' => 'Vista Exterior y Jardín',
                'description' => 'Vista panorámica del exterior de la casa, jardín y área de piscina.',
                'video_type' => 'exterior',
                'sort_order' => 2,
                'thumbnail_url' => 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
                'is_featured' => false,
                'is_active' => true,
                'allow_autoplay' => false,
                'show_controls' => true,
                'show_info' => true
            ],
            [
                'youtube_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                'youtube_video_id' => 'ScMzIvxBSi4',
                'title' => 'Cocina y Áreas Sociales',
                'description' => 'Recorrido por la cocina moderna, sala de estar y comedor.',
                'video_type' => 'interior',
                'sort_order' => 3,
                'thumbnail_url' => 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
                'is_featured' => false,
                'is_active' => true,
                'allow_autoplay' => false,
                'show_controls' => true,
                'show_info' => true
            ],
            [
                'youtube_url' => 'https://www.youtube.com/watch?v=astISOttCQ0',
                'youtube_video_id' => 'astISOttCQ0',
                'title' => 'Zona y Vecindario',
                'description' => 'Vista del barrio, servicios cercanos y ubicación privilegiada.',
                'video_type' => 'neighborhood',
                'sort_order' => 4,
                'thumbnail_url' => 'https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg',
                'is_featured' => false,
                'is_active' => true,
                'allow_autoplay' => false,
                'show_controls' => true,
                'show_info' => true
            ]
        ];

        foreach ($videos as $videoData) {
            PropertyVideo::create(array_merge($videoData, [
                'property_id' => $property->id
            ]));
        }

        $this->command->info('✅ Propiedad creada con 4 videos de ejemplo');
        $this->command->info("📍 ID de la propiedad: {$property->id}");
        $this->command->info("🏠 Título: {$property->title}");
    }
}
