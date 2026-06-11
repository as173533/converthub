<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PdfEditorRequest;
use App\Http\Requests\StoreConversionRequest;
use App\Models\ConversionJob;
use App\Services\ConversionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ConversionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'jobs' => ConversionJob::query()
                ->whereBelongsTo($request->user())
                ->with('files')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function store(StoreConversionRequest $request, ConversionService $service): JsonResponse
    {
        $job = $service->createJob(
            $request->user()->id,
            $request->file('file'),
            $request->string('tool')->toString(),
            $request->input('options', [])
        );

        return response()->json(['job' => $job], 202);
    }

    public function pdfEditor(PdfEditorRequest $request, ConversionService $service): JsonResponse
    {
        $job = $service->createJob(
            $request->user()->id,
            $request->file('file'),
            'pdf-editor',
            ['operations' => $request->input('operations', [])]
        );

        return response()->json(['job' => $job], 202);
    }

    public function show(Request $request, ConversionJob $conversionJob): JsonResponse
    {
        $this->authorize('view', $conversionJob);

        return response()->json(['job' => $conversionJob->load('files')]);
    }

    public function download(Request $request, ConversionJob $conversionJob): StreamedResponse
    {
        $this->authorize('view', $conversionJob);

        abort_unless($conversionJob->status === ConversionJob::STATUS_COMPLETED, 409, 'Conversion is not ready.');
        abort_unless($conversionJob->converted_path, 404, 'Converted file is missing.');

        return Storage::disk($conversionJob->converted_disk)->download(
            $conversionJob->converted_path,
            pathinfo($conversionJob->original_filename, PATHINFO_FILENAME).'-converted'
        );
    }

    public function destroy(Request $request, ConversionJob $conversionJob): JsonResponse
    {
        $this->authorize('delete', $conversionJob);

        foreach ($conversionJob->files as $file) {
            Storage::disk($file->disk)->delete($file->path);
        }

        $conversionJob->delete();

        return response()->json(['message' => 'Conversion deleted']);
    }
}

