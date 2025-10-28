<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Timeline extends Model
{
    protected $fillable = [
        'title',
        'description',
        'year',
        'photo',
    ];

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) return $query;
        $s = strtolower($search);
        return $query->where(function ($q) use ($s) {
            $q->whereRaw('LOWER(title) LIKE ?', ['%'.$s.'%'])
              ->orWhereRaw('LOWER(description) LIKE ?', ['%'.$s.'%'])
              ->orWhereRaw('LOWER(year) LIKE ?', ['%'.$s.'%']);
        });
    }

    public function scopeSort(Builder $query, string $by = 'id', string $dir = 'asc'): Builder
    {
        return $query->orderBy($by, $dir);
    }
}
