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
        Schema::create('video_content', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Video Institucional');
            $table->text('description');
            $table->string('video_url'); // URL del video de YouTube
            $table->string('video_id')->nullable(); // ID del video extraído de la URL
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(1); // Para ordenar si hay múltiples videos
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_content');
    }
};