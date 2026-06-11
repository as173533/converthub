<?php

namespace App\Services;

use App\Models\ConversionJob;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileStorageService
{
    public function storeOriginal(UploadedFile $file, int $userId): array
    {
        $name = Str::uuid()->toString().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $extension = $file->getClientOriginalExtension();
        $path = $file->storeAs("uploads/{$userId}", "{$name}.{$extension}", $this->disk());

        return [
            'disk' => $this->disk(),
            'path' => $path,
            'size' => $file->getSize() ?: 0,
            'mime_type' => $file->getMimeType(),
        ];
    }

    public function convertedPath(ConversionJob $job): string
    {
        $extension = ConversionToolCatalog::outputExtension($job->tool);

        return "conversions/{$job->user_id}/job_{$job->id}.{$extension}";
    }

    public function absolutePath(string $path, ?string $disk = null): string
    {
        return Storage::disk($disk ?: $this->disk())->path($path);
    }

    public function disk(): string
    {
        return config('converthub.storage_disk', 'private');
    }
}

