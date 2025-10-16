<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoContent extends Model
{
    use HasFactory;

    protected $table = 'video_content';

    protected $fillable = [
        'title',
        'description',
        'video_url',
        'video_id',
        'is_active',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Mutator para extraer el ID del video de YouTube automáticamente
     */
    public function setVideoUrlAttribute($value)
    {
        $this->attributes['video_url'] = $value;
        
        // Extraer el ID del video de YouTube
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $value, $matches)) {
            $this->attributes['video_id'] = $matches[1];
        }
    }

    /**
     * Accessor para obtener la URL de embed de YouTube
     */
    public function getEmbedUrlAttribute()
    {
        if ($this->video_id) {
            return "https://www.youtube.com/embed/{$this->video_id}?autoplay=0&controls=1&rel=0";
        }
        return null;
    }

    /**
     * Accessor para obtener la URL de thumbnail de YouTube
     */
    public function getThumbnailUrlAttribute()
    {
        if ($this->video_id) {
            return "https://img.youtube.com/vi/{$this->video_id}/maxresdefault.jpg";
        }
        return null;
    }

    /**
     * Scope para obtener solo contenido activo
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para ordenar por orden ascendente
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}