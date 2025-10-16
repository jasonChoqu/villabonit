<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3);
        $propertyTypes = [
            'house', 'apartment', 'penthouse', 'townhouse', 'duplex', 'triplex',
            'studio', 'loft', 'villa', 'bungalow', 'cottage', 'farmhouse',
            'condo', 'cabins', 'ranch', 'chalet', 'mansion'
        ];

        $cities = [
            'Lima', 'Miraflores', 'San Isidro', 'Surco', 'Barranco', 
            'Magdalena', 'Pueblo Libre', 'Jesús María', 'Lince'
        ];

        $amenitiesList = [
            'piscina', 'gimnasio', 'seguridad_24h', 'ascensor', 'aire_acondicionado',
            'calefaccion', 'terraza', 'balcon', 'jardin', 'cochera', 'lavanderia',
            'cuarto_servicio', 'walk_in_closet', 'jacuzzi', 'sauna', 'vista_mar',
            'vista_montaña', 'cerca_metro', 'cerca_colegios', 'zona_comercial'
        ];

        $selectedAmenities = $this->faker->randomElements(
            $amenitiesList, 
            $this->faker->numberBetween(3, 8)
        );

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->paragraphs(3, true),
            'property_type' => $this->faker->randomElement($propertyTypes),
            'status' => $this->faker->randomElement(['available', 'sold', 'reserved', 'rented']),
            'price' => $this->faker->randomFloat(2, 80000, 1200000),
            'currency' => $this->faker->randomElement(['USD', 'PEN']),
            'area_m2' => $this->faker->randomFloat(2, 45, 500),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'parking' => $this->faker->numberBetween(0, 4),
            'address' => $this->faker->streetAddress,
            'city' => $this->faker->randomElement($cities),
            'state' => 'Lima',
            'zipcode' => $this->faker->postcode,
            'lat' => $this->faker->latitude(-12.3, -11.8), // Coordenadas aproximadas de Lima
            'lng' => $this->faker->longitude(-77.2, -76.8),
            'built_year' => $this->faker->numberBetween(1990, 2024),
            'floor' => $this->faker->numberBetween(1, 25),
            'total_floors' => $this->faker->numberBetween(1, 30),
            'amenities' => $selectedAmenities,
            'agent_name' => $this->faker->name,
            'agent_phone' => '+51 ' . $this->faker->numerify('9## ### ###'),
            'agent_email' => $this->faker->unique()->safeEmail,
            'listing_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'views_count' => $this->faker->numberBetween(0, 1000),
            'is_featured' => $this->faker->boolean(20), // 20% de probabilidad de ser destacada
        ];
    }

    /**
     * Indicate that the property is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the property is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    /**
     * Indicate that the property is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }

    /**
     * Set specific property type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'property_type' => $type,
        ]);
    }

    /**
     * Set specific city.
     */
    public function inCity(string $city): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => $city,
        ]);
    }
}