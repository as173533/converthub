<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ToolController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/tools', [ToolController::class, 'index']);

    Route::apiResource('conversions', ConversionController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::get('/conversions/{conversionJob}/download', [ConversionController::class, 'download']);
    Route::post('/pdf-editor', [ConversionController::class, 'pdfEditor']);

    Route::prefix('admin')->middleware('can:viewAdmin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::get('/failed-jobs', [AdminController::class, 'failedJobs']);
    });
});

