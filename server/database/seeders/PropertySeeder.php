<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = [
            [
                'title' => 'Casa Moderna en Centro Histórico',
                'description' => 'Hermosa casa de 3 niveles ubicada en el corazón del centro histórico. Completamente renovada con acabados de lujo y tecnología moderna. Ideal para familias que buscan comodidad y ubicación privilegiada.',
                'property_type' => 'house',
                'status' => 'available',
                'price' => 450000.00,
                'currency' => 'USD',
                'area_m2' => 180.50,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'parking' => 2,
                'address' => 'Calle Principal 123',
                'city' => 'Lima',
                'state' => 'Lima',
                'zipcode' => '15001',
                'lat' => -12.0464,
                'lng' => -77.0428,
                'built_year' => 2020,
                'floor' => 1,
                'total_floors' => 3,
                'amenities' => [
                    'aire_acondicionado',
                    'sistema_seguridad',
                    'cocina_equipada',
                    'terraza',
                    'jardin',
                    'lavanderia'
                ],
                'agent_name' => 'María García',
                'agent_phone' => '+51 999 123 456',
                'agent_email' => 'maria.garcia@villabonita.com',
                'is_featured' => true,
            ],
            [
                'title' => 'Departamento Ejecutivo Vista al Mar',
                'description' => 'Espectacular departamento en el piso 15 con vista panorámica al océano. Completamente amoblado con muebles de diseñador. Building con amenities de lujo incluyendo piscina, gym y spa.',
                'property_type' => 'apartment',
                'status' => 'available',
                'price' => 320000.00,
                'currency' => 'USD',
                'area_m2' => 95.75,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'parking' => 1,
                'address' => 'Malecón de la Costa 456',
                'city' => 'Miraflores',
                'state' => 'Lima',
                'zipcode' => '15074',
                'lat' => -12.1269,
                'lng' => -77.0298,
                'built_year' => 2019,
                'floor' => 15,
                'total_floors' => 25,
                'amenities' => [
                    'vista_mar',
                    'piscina',
                    'gimnasio',
                    'spa',
                    'seguridad_24h',
                    'ascensor',
                    'balcon'
                ],
                'agent_name' => 'Carlos Rodriguez',
                'agent_phone' => '+51 999 789 123',
                'agent_email' => 'carlos.rodriguez@villabonita.com',
                'is_featured' => true,
            ],
            [
                'title' => 'Penthouse de Lujo San Isidro',
                'description' => 'Exclusivo penthouse de dos niveles en la zona más exclusiva de San Isidro. Cuenta con terraza privada, jacuzzi y una vista de 360° de la ciudad. Acabados de primera calidad.',
                'property_type' => 'penthouse',
                'status' => 'available',
                'price' => 850000.00,
                'currency' => 'USD',
                'area_m2' => 250.00,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'parking' => 3,
                'address' => 'Av. El Bosque 789',
                'city' => 'San Isidro',
                'state' => 'Lima',
                'zipcode' => '15073',
                'lat' => -12.0969,
                'lng' => -77.0347,
                'built_year' => 2021,
                'floor' => 20,
                'total_floors' => 22,
                'amenities' => [
                    'terraza_privada',
                    'jacuzzi',
                    'vista_panoramica',
                    'aire_acondicionado',
                    'domótica',
                    'cocina_gourmet',
                    'walk_in_closet',
                    'seguridad_24h'
                ],
                'agent_name' => 'Ana Mendoza',
                'agent_phone' => '+51 999 456 789',
                'agent_email' => 'ana.mendoza@villabonita.com',
                'is_featured' => true,
            ],
            [
                'title' => 'Casa Familiar Surco',
                'description' => 'Amplia casa familiar en condominio cerrado en Santiago de Surco. Perfecta para familias grandes con amplio jardín, piscina y áreas comunes. Zona tranquila y segura.',
                'property_type' => 'house',
                'status' => 'available',
                'price' => 380000.00,
                'currency' => 'USD',
                'area_m2' => 220.00,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'parking' => 2,
                'address' => 'Residencial Los Pinos 101',
                'city' => 'Santiago de Surco',
                'state' => 'Lima',
                'zipcode' => '15023',
                'lat' => -12.1348,
                'lng' => -76.9999,
                'built_year' => 2018,
                'floor' => 1,
                'total_floors' => 2,
                'amenities' => [
                    'piscina',
                    'jardin_amplio',
                    'areas_comunes',
                    'seguridad_privada',
                    'cochera_techada',
                    'cuarto_servicio',
                    'lavanderia'
                ],
                'agent_name' => 'Roberto Silva',
                'agent_phone' => '+51 999 321 654',
                'agent_email' => 'roberto.silva@villabonita.com',
                'is_featured' => false,
            ],
            [
                'title' => 'Loft Moderno Barranco',
                'description' => 'Loft de diseño contemporáneo en el bohemio distrito de Barranco. Espacios abiertos, techos altos y una ubicación inmejorable cerca de galerías de arte y restaurantes.',
                'property_type' => 'loft',
                'status' => 'available',
                'price' => 240000.00,
                'currency' => 'USD',
                'area_m2' => 85.00,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'parking' => 1,
                'address' => 'Calle Arte 234',
                'city' => 'Barranco',
                'state' => 'Lima',
                'zipcode' => '15063',
                'lat' => -12.1458,
                'lng' => -77.0208,
                'built_year' => 2022,
                'floor' => 3,
                'total_floors' => 4,
                'amenities' => [
                    'diseño_contemporaneo',
                    'techos_altos',
                    'espacios_abiertos',
                    'ubicacion_cultural',
                    'iluminacion_natural',
                    'balcon_pequeño'
                ],
                'agent_name' => 'Lucía Vargas',
                'agent_phone' => '+51 999 987 654',
                'agent_email' => 'lucia.vargas@villabonita.com',
                'is_featured' => false,
            ]
        ];

        foreach ($properties as $propertyData) {
            $propertyData['slug'] = Str::slug($propertyData['title']);
            
            // Asegurar que el slug sea único
            $originalSlug = $propertyData['slug'];
            $counter = 1;
            while (Property::where('slug', $propertyData['slug'])->exists()) {
                $propertyData['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            $property = Property::create($propertyData);

            // Crear imágenes de ejemplo para cada propiedad
            $this->createSampleImages($property);
        }
    }

    /**
     * Crear imágenes de ejemplo para una propiedad
     */
    private function createSampleImages(Property $property): void
    {
        $imageTypes = ['main', 'exterior', 'interior', 'kitchen', 'bedroom', 'bathroom'];
        
        foreach ($imageTypes as $index => $type) {
            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => "properties/samples/{$type}_sample.jpg",
                'image_name' => ucfirst($type) . ' Sample Image',
                'alt_text' => ucfirst($type) . ' de ' . $property->title,
                'description' => 'Imagen de ejemplo del ' . $type . ' de la propiedad',
                'image_type' => $type,
                'sort_order' => $index,
                'is_featured' => $index === 0, // Primera imagen como destacada
                'mime_type' => 'image/jpeg',
                'file_size' => rand(500000, 2000000), // Tamaño aleatorio entre 500KB y 2MB
                'width' => 1920,
                'height' => 1080,
            ]);
        }
    }
}