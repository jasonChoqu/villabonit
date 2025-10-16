<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'property_type',
        'status',
        'price',
        'currency',
        'area_m2',
        'bedrooms',
        'bathrooms',
        'parking',
        'address',
        'city',
        'state',
        'zipcode',
        'lat',
        'lng',
        'built_year',
        'floor',
        'total_floors',
        'amenities',
        'agent_name',
        'agent_phone',
        'agent_email',
        'listing_date',
        'views_count',
        'is_featured',
    ];

    protected $casts = [
        'amenities' => 'array',
        'price' => 'decimal:2',
        'area_m2' => 'decimal:2',
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
        'listing_date' => 'datetime',
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con las imágenes de la propiedad
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    /**
     * Obtener la imagen principal/destacada
     */
    public function featuredImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_featured', true);
    }

    /**
     * Obtener todas las imágenes principales (tipo main)
     */
    public function mainImages(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('image_type', 'main');
    }

    /**
     * Obtener imágenes por tipo
     */
    public function imagesByType(string $type): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('image_type', $type);
    }

    /**
     * Relación con los videos de la propiedad
     */
    public function videos(): HasMany
    {
        return $this->hasMany(PropertyVideo::class)->orderBy('sort_order')->orderBy('created_at');
    }

    /**
     * Obtener solo videos activos
     */
    public function activeVideos(): HasMany
    {
        return $this->hasMany(PropertyVideo::class)->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Obtener el video destacado
     */
    public function featuredVideo()
    {
        return $this->hasOne(PropertyVideo::class)->where('is_featured', true)->where('is_active', true);
    }

    /**
     * Obtener videos por tipo
     */
    public function videosByType(string $type): HasMany
    {
        return $this->hasMany(PropertyVideo::class)->where('video_type', $type)->where('is_active', true);
    }

    /**
     * Incrementar contador de vistas
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Generar slug automáticamente al crear
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });

        static::updating(function ($property) {
            if ($property->isDirty('title') && empty($property->slug)) {
                $property->slug = Str::slug($property->title);
            }
        });
    }

    /**
     * Scopes para consultas comunes
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('property_type', $type);
    }

    public function scopeByCity($query, $city)
    {
        return $query->where('city', $city);
    }

    public function scopePriceRange($query, $min = null, $max = null)
    {
        if ($min) {
            $query->where('price', '>=', $min);
        }
        if ($max) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    /**
     * Obtener el precio formateado
     */
    public function getFormattedPriceAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->price, 2);
    }

    /**
     * Obtener URL amigable
     */
    public function getUrlAttribute(): string
    {
        return route('properties.show', $this->slug);
    }
}