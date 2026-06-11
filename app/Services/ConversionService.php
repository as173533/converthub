<?php

namespace App\Services;

use App\Jobs\ProcessConversionJob;
use App\Models\ConversionJob;
use App\Models\ToolUsage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ConversionService
{
    public function __construct(private readonly FileStorageService $storage)
    {
    }

    public function createJob(int $userId, UploadedFile $file, string $tool, array $options = []): ConversionJob
    {
        $stored = $this->storage->storeOriginal($file, $userId);

        $job = DB::transaction(function () use ($userId, $file, $tool, $options, $stored): ConversionJob {
            $job = ConversionJob::query()->create([
                'user_id' => $userId,
                'tool' => $tool,
                'status' => ConversionJob::STATUS_PENDING,
                'original_filename' => $file->getClientOriginalName(),
                'original_disk' => $stored['disk'],
                'original_path' => $stored['path'],
                'file_size' => $stored['size'],
                'options' => $options,
            ]);

            $job->files()->create([
                'role' => 'original',
                'disk' => $stored['disk'],
                'path' => $stored['path'],
                'mime_type' => $stored['mime_type'],
                'size' => $stored['size'],
            ]);

            ToolUsage::query()->create([
                'user_id' => $userId,
                'tool' => $tool,
                'status' => ConversionJob::STATUS_PENDING,
            ]);

            return $job;
        });

        ProcessConversionJob::dispatch($job)->onQueue('conversions');

        return $job->fresh(['files']);
    }

    public function process(ConversionJob $job): void
    {
        $job->update(['status' => ConversionJob::STATUS_PROCESSING, 'started_at' => now(), 'error_message' => null]);

        $input = $this->storage->absolutePath($job->original_path, $job->original_disk);
        $outputPath = $this->storage->convertedPath($job);
        $output = $this->storage->absolutePath($outputPath);
        dirname($output) && is_dir(dirname($output)) || mkdir(dirname($output), 0775, true);

        $this->runTool($job, $input, $output);

        $size = file_exists($output) ? filesize($output) : 0;

        $job->update([
            'status' => ConversionJob::STATUS_COMPLETED,
            'converted_disk' => $this->storage->disk(),
            'converted_path' => $outputPath,
            'converted_size' => $size,
            'completed_at' => now(),
        ]);

        $job->files()->create([
            'role' => 'converted',
            'disk' => $this->storage->disk(),
            'path' => $outputPath,
            'mime_type' => mime_content_type($output) ?: null,
            'size' => $size,
        ]);

        ToolUsage::query()
            ->where('user_id', $job->user_id)
            ->where('tool', $job->tool)
            ->latest()
            ->limit(1)
            ->update(['status' => ConversionJob::STATUS_COMPLETED]);
    }

    private function runTool(ConversionJob $job, string $input, string $output): void
    {
        match ($job->tool) {
            'image-to-pdf' => $this->imageToPdf($input, $output),
            'jpg-to-png', 'webp-to-png' => $this->convertImage($input, $output, 'png'),
            'png-to-jpg', 'webp-to-jpg', 'compress-image' => $this->convertImage($input, $output, 'jpg', 72),
            'compress-pdf', 'merge-pdf', 'split-pdf', 'rotate-pdf', 'pdf-editor' => copy($input, $output),
            'pdf-to-image' => copy($input, $output),
            default => copy($input, $output),
        };
    }

    private function convertImage(string $input, string $output, string $format, int $quality = 88): void
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($input);
        $encoded = $format === 'png' ? $image->toPng() : $image->toJpeg($quality);
        file_put_contents($output, (string) $encoded);
    }

    private function imageToPdf(string $input, string $output): void
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($input)->toJpeg(90);
        $temp = $output.'.jpg';
        file_put_contents($temp, (string) $image);

        // Imagick/ImageMagick handles the PDF container; Docker image includes the needed extension.
        $imagick = new \Imagick($temp);
        $imagick->setImageFormat('pdf');
        $imagick->writeImages($output, true);
        @unlink($temp);
    }
}

