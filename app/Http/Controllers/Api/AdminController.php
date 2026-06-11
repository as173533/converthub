<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConversionJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users_count' => User::query()->count(),
            'jobs_count' => ConversionJob::query()->count(),
            'failed_jobs_count' => ConversionJob::query()->where('status', ConversionJob::STATUS_FAILED)->count(),
            'storage_used' => ConversionJob::query()->sum(DB::raw('file_size + converted_size')),
            'most_used_tools' => ConversionJob::query()
                ->selectRaw('tool, count(*) as total')
                ->groupBy('tool')
                ->orderByDesc('total')
                ->limit(8)
                ->get(),
        ]);
    }

    public function users(): JsonResponse
    {
        return response()->json(['users' => User::query()->latest()->paginate(25)]);
    }

    public function jobs(): JsonResponse
    {
        return response()->json(['jobs' => ConversionJob::query()->with('user')->latest()->paginate(50)]);
    }

    public function failedJobs(): JsonResponse
    {
        return response()->json([
            'jobs' => ConversionJob::query()
                ->with('user')
                ->where('status', ConversionJob::STATUS_FAILED)
                ->latest()
                ->paginate(50),
        ]);
    }
}
