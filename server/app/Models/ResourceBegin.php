<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class ResourceBegin extends Model
{
    use HasFactory;

    protected $table = 'resources_begin';

    protected $fillable = [
        'url',
        'text',
        'logo_url',
    ];

    // Usa el Builder de Eloquent en la firma y el return type
    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        // (Opcional) Sanitiza inputs para evitar orderBy inseguro
        $allowedSorts = ['id', 'url', 'text', 'logo_url', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'id';
        }

        $sortDir = strtolower($sortDir) === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($sortBy, $sortDir);
    }
}