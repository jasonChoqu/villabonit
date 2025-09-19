<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class CertificationTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'blade_view',
        'preview_image',
        'background_image',
    ];

    // Relación: Un template puede tener muchas certificaciones
    public function certifications(): HasMany
    {
        return $this->hasMany(Certification::class, 'template_id');
    }

    // Scope para búsqueda
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('blade_view', 'like', "%{$search}%");
        });
    }

    // Scope para ordenamiento
    public function scopeSort(Builder $query, string $column = 'id', string $direction = 'asc'): Builder
    {
        $allowedColumns = [
            'id', 'name', 'description', 'blade_view', 'created_at', 'updated_at'
        ];

        if (!in_array($column, $allowedColumns)) {
            $column = 'id';
        }

        if (!in_array(strtolower($direction), ['asc', 'desc'])) {
            $direction = 'asc';
        }

        return $query->orderBy($column, $direction);
    }
}