<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PropertyImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'image_path',
        'image_name',
        'alt_text',
        'description',
        'image_type',
        'sort_order',
        'is_featured',
        'mime_type',
        'file_size',
        'width',
        'height',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con la propiedad
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Obtener la URL completa de la imagen
     */
    public function getImageUrlAttribute(): string
    {
        // Como ahora guardamos en public_path, la ruta es directamente accesible
        if (file_exists(public_path($this->image_path))) {
            return asset($this->image_path);
        }
        
        // Fallback a imagen por defecto
        return asset('images/default-property.jpg');
    }

    /**
     * Obtener la URL de thumbnail (si existe)
     */
    public function getThumbnailUrlAttribute(): string
    {
        $thumbnailPath = $this->getThumbnailPath();
        
        if (file_exists(public_path($thumbnailPath))) {
            return asset($thumbnailPath);
        }
        
        // Si no hay thumbnail, devolver imagen original
        return $this->image_url;
    }

    /**
     * Generar ruta de thumbnail
     */
    public function getThumbnailPath(): string
    {
        $pathInfo = pathinfo($this->image_path);
        return $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];
    }

    /**
     * Obtener el tamaño formateado del archivo
     */
    public function getFormattedFileSizeAttribute(): string
    {
        if (!$this->file_size) {
            return 'N/A';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Obtener dimensiones como string
     */
    public function getDimensionsAttribute(): string
    {
        if ($this->width && $this->height) {
            return $this->width . ' x ' . $this->height . ' px';
        }
        return 'N/A';
    }

    /**
     * Scopes para consultas comunes
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('image_type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    /**
     * Boot method para eventos del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Al eliminar una imagen, eliminar el archivo físico usando File::delete como en GalleryController
        static::deleting(function ($image) {
            if (file_exists(public_path($image->image_path))) {
                File::delete(public_path($image->image_path));
            }
            
            // También eliminar thumbnail si existe
            $thumbnailPath = $image->getThumbnailPath();
            if (file_exists(public_path($thumbnailPath))) {
                File::delete(public_path($thumbnailPath));
            }
        });

        // Asegurar que solo haya una imagen destacada por propiedad
        static::saving(function ($image) {
            if ($image->is_featured) {
                // Remover featured de otras imágenes de la misma propiedad
                static::where('property_id', $image->property_id)
                    ->where('id', '!=', $image->id)
                    ->update(['is_featured' => false]);
            }
        });
    }
}