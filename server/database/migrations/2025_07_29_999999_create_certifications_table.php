<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')
                ->constrained('certification_templates')
                ->onDelete('cascade');
            $table->foreignId('course_id')
                ->nullable()
                ->constrained('courses')
                ->nullOnDelete();
            $table->string('title');
            $table->text('content')->nullable();
            $table->string('issue_city')->nullable();
            $table->string('verification_code')->unique();
            $table->string('pdf_file')->nullable();
            $table->string('qr_url')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};
