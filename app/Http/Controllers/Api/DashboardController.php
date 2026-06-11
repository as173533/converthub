<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConversionJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ConversionJob::query()->whereBelongsTo($request->user());

        return response()->json([
            'total_conversions' => (clone $query)->count(),
            'failed_conversions' => (clone $query)->where('status', ConversionJob::STATUS_FAILED)->count(),
            'storage_used' => (clone $query)->sum(DB::raw('file_size + converted_size')),
            'recent_conversions' => (clone $query)->latest()->limit(6)->get(),
            'tool_usage' => (clone $query)->selectRaw('tool, count(*) as total')->groupBy('tool')->pluck('total', 'tool'),
        ]);
    }
}
