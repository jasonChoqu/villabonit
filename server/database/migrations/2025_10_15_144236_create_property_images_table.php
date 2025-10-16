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
        Schema::create('property_images', function (Blueprint $table) {
            $table->bigIncrements('id');

            // FK a properties
            $table->unsignedBigInteger('property_id')->index();

            // Rutas y metadatos
            $table->string('image_path'); // ruta en storage (ej: properties/123/photo.jpg)
            $table->string('image_name')->nullable(); // nombre original del archivo
            $table->string('alt_text')->nullable();
            $table->text('description')->nullable();

            // Tipo/uso de la imagen (gallery, cover, floorplan, thumbnail, etc.)
            $table->string('image_type', 50)->nullable()->index();

            // Orden y destacado
            $table->integer('sort_order')->default(0)->index();
            $table->boolean('is_featured')->default(false)->index();

            // Info del archivo
            $table->string('mime_type', 100)->nullable();
            $table->bigInteger('file_size')->nullable(); // en bytes
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();

            $table->timestampsTz();

            // Foreign Key constraint
            $table->foreign('property_id')
                ->references('id')->on('properties')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Índices compuestos útiles
            $table->index(['property_id', 'is_featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_images', function (Blueprint $table) {
            // eliminar FK antes de dropear (por precaución)
            $table->dropForeign(['property_id']);
        });

        Schema::dropIfExists('property_images');
    }
};
