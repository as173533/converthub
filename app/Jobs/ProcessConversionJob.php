<?php

namespace App\Jobs;

use App\Models\ConversionJob;
use App\Models\ToolUsage;
use App\Services\ConversionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ProcessConversionJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $timeout = 3600;
    public int $tries = 3;

    public function __construct(public ConversionJob $conversionJob)
    {
    }

    public function handle(ConversionService $service): void
    {
        $service->process($this->conversionJob->fresh());
    }

    public function failed(Throwable $exception): void
    {
        $this->conversionJob->update([
            'status' => ConversionJob::STATUS_FAILED,
            'error_message' => $exception->getMessage(),
            'completed_at' => now(),
        ]);

        ToolUsage::query()
            ->where('user_id', $this->conversionJob->user_id)
            ->where('tool', $this->conversionJob->tool)
            ->latest()
            ->limit(1)
            ->update(['status' => ConversionJob::STATUS_FAILED]);
    }
}

