<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ConversionToolCatalog;
use Illuminate\Http\JsonResponse;

class ToolController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['tools' => ConversionToolCatalog::list()]);
    }
}

