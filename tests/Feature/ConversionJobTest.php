<?php

namespace Tests\Feature;

use App\Jobs\ProcessConversionJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ConversionJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_creates_pending_job_and_dispatches_queue_work(): void
    {
        Queue::fake();

        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->post('/api/conversions', [
                'tool' => 'jpg-to-png',
                'file' => UploadedFile::fake()->image('avatar.jpg'),
            ], ['Accept' => 'application/json']);

        $response->assertAccepted()->assertJsonPath('job.status', 'pending');
        Queue::assertPushed(ProcessConversionJob::class);
    }
}
