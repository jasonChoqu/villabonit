<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function template(): BelongsTo
    {
        return $this->belongsTo(CertificationTemplate::class, 'template_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}