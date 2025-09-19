<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Certification extends Model
{
    protected $fillable = [
        'template_id',
        'course_id',
        'title',
        'content',
        'issue_city',
        'verification_code',
        'pdf_file',
        'qr_url',
    ];

    // Relación con la plantilla de certificación
    public function template(): BelongsTo
    {
        return $this->belongsTo(CertificationTemplate::class, 'template_id');
    }

    // Relación con el curso
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    // Scope para búsqueda
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('issue_city', 'like', "%{$search}%")
              ->orWhere('verification_code', 'like', "%{$search}%");
        });
    }

    // Scope para ordenamiento
    public function scopeSort(Builder $query, string $column = 'id', string $direction = 'asc'): Builder
    {
        $allowedColumns = [
            'id', 'title', 'content', 'issue_city', 
            'verification_code', 'created_at', 'updated_at'
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