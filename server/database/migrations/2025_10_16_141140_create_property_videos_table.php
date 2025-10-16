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
        Schema::create('property_videos', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            // Relación con la propiedad
            $table->unsignedBigInteger('property_id');
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            
            // Información del video de YouTube
            $table->string('youtube_url', 500); // URL completa del video
            $table->string('youtube_video_id', 50); // ID extraído del video (ej: dQw4w9WgXcQ)
            $table->string('title', 255)->nullable(); // Título del video
            $table->text('description')->nullable(); // Descripción del video
            
            // Tipos de video para categorización
            $table->enum('video_type', [
                'tour_virtual',      // Tour virtual
                'exterior',          // Vista exterior
                'interior',          // Vista interior
                'neighborhood',      // Barrio/zona
                'amenities',         // Comodidades
                'promotional',       // Video promocional
                'construction',      // Proceso de construcción
                'testimonial',       // Testimonial
                'other'             // Otro
            ])->default('tour_virtual');
            
            // Orden para mostrar múltiples videos
            $table->integer('sort_order')->default(0);
            
            // Metadatos adicionales
            $table->string('thumbnail_url', 500)->nullable(); // URL del thumbnail de YouTube
            $table->integer('duration_seconds')->nullable(); // Duración en segundos
            $table->boolean('is_featured')->default(false); // Video destacado
            $table->boolean('is_active')->default(true); // Video activo/visible
            
            // Configuración de privacidad/embed
            $table->boolean('allow_autoplay')->default(false);
            $table->boolean('show_controls')->default(true);
            $table->boolean('show_info')->default(true);
            
            $table->timestampsTz();
            
            // Índices
            $table->index(['property_id', 'sort_order']);
            $table->index(['property_id', 'video_type']);
            $table->index(['property_id', 'is_featured']);
            $table->index('youtube_video_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_videos');
    }
};
