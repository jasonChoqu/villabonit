<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'youtube_url',
        'youtube_video_id',
        'title',
        'description',
        'video_type',
        'sort_order',
        'thumbnail_url',
        'duration_seconds',
        'is_featured',
        'is_active',
        'allow_autoplay',
        'show_controls',
        'show_info'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'allow_autoplay' => 'boolean',
        'show_controls' => 'boolean',
        'show_info' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relación con Property
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    // Accessor para obtener el embed URL
    public function getEmbedUrlAttribute()
    {
        if ($this->youtube_video_id) {
            $params = [];
            if (!$this->show_controls) $params[] = 'controls=0';
            if (!$this->show_info) $params[] = 'showinfo=0';
            if ($this->allow_autoplay) $params[] = 'autoplay=1';
            
            $queryString = !empty($params) ? '?' . implode('&', $params) : '';
            
            return "https://www.youtube.com/embed/{$this->youtube_video_id}{$queryString}";
        }
        
        return null;
    }

    // Método para extraer video ID de URL de YouTube
    public static function extractVideoId($url)
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }

    // Scope para videos activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope para videos destacados
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope ordenados
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    // Accessor para obtener thumbnail por defecto de YouTube
    public function getYoutubeThumbnailAttribute()
    {
        if ($this->youtube_video_id) {
            return "https://img.youtube.com/vi/{$this->youtube_video_id}/maxresdefault.jpg";
        }
        return null;
    }
}
