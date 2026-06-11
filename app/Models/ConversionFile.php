<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversionFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversion_job_id',
        'role',
        'disk',
        'path',
        'mime_type',
        'size',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    public function conversionJob(): BelongsTo
    {
        return $this->belongsTo(ConversionJob::class);
    }
}

