<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Gallery extends Model
{
    protected $fillable = [
        'description',
        'description2',
        'area',
        'photo',
    ];

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) return $query;
        $s = strtolower($search);
        return $query->where(function ($q) use ($s) {
            $q->whereRaw('LOWER(description) LIKE ?', ['%'.$s.'%'])
              ->orWhereRaw('LOWER(description2) LIKE ?', ['%'.$s.'%'])
              ->orWhereRaw('LOWER(area) LIKE ?', ['%'.$s.'%']);
        });
    }

    public function scopeSort(Builder $query, string $by = 'id', string $dir = 'asc'): Builder
    {
        return $query->orderBy($by, $dir);
    }
}
