<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'features',
        'image_path',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scopes para búsqueda y ordenamiento
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('features', 'like', "%{$search}%");
        });
    }

    public function scopeSort($query, $sortBy = 'id', $order = 'asc')
    {
        return $query->orderBy($sortBy, $order);
    }

    // Accessor para obtener la URL completa de la imagen
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset($this->image_path);
        }
        return null;
    }

    // Scope para proyectos con imagen
    public function scopeWithImage($query)
    {
        return $query->whereNotNull('image_path');
    }

    // Scope para proyectos sin imagen
    public function scopeWithoutImage($query)
    {
        return $query->whereNull('image_path');
    }
}
