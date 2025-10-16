<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('title', 180);
            $table->string('slug', 200)->unique()->index();
            $table->text('description')->nullable();

            // ENUM con muchos tipos de propiedades
            $table->enum('property_type', [
                'house',        // casa unifamiliar
                'apartment',    // departamento
                'penthouse',
                'townhouse',
                'duplex',
                'triplex',
                'studio',
                'loft',
                'villa',
                'bungalow',
                'cottage',
                'farmhouse',
                'condo',        // condominio
                'cabins',
                'ranch',
                'chalet',
                'mansion',
                'retirement_home',
                'studio_apartment',
                'garden_house',
                'attic',
                'basement_flat',
                'mixed_use',
                'mobile_home',
                'tiny_house',
                'other',
                'terreno'
            ])->default('house');

            $table->string('status', 30)->default('available'); // available, sold, reserved, etc.

            $table->decimal('price', 14, 2);
            $table->string('currency', 3)->default('USD');

            $table->decimal('area_m2', 8, 2)->nullable();
            $table->smallInteger('bedrooms')->nullable();
            $table->smallInteger('bathrooms')->nullable();
            $table->smallInteger('parking')->nullable();

            $table->string('address')->nullable();
            $table->string('city', 100)->nullable()->index();
            $table->string('state', 100)->nullable();
            $table->string('zipcode', 20)->nullable();

            // coordenadas (usa DECIMAL para precisión)
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();

            $table->smallInteger('built_year')->nullable();
            $table->smallInteger('floor')->nullable();
            $table->smallInteger('total_floors')->nullable();

            $table->json('amenities')->nullable(); // json con comodidades

            $table->string('agent_name', 120)->nullable();
            $table->string('agent_phone', 50)->nullable();
            $table->string('agent_email', 150)->nullable();

            $table->timestampTz('listing_date')->useCurrent();
            $table->bigInteger('views_count')->default(0);
            $table->boolean('is_featured')->default(false);

            $table->timestampsTz(); // created_at, updated_at con timezone

            // Índices sugeridos
            $table->index(['city', 'price']);
            $table->index(['property_type', 'status']);
            // fulltext (disponible en MySQL 5.6+/MariaDB o con drivers que lo soporten);
            // En Laravel 9+ puedes usar $table->fullText([...]) si tu DB lo soporta:
            if (method_exists($table, 'fullText')) {
                $table->fullText(['title', 'description']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
