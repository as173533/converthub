<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversion_files', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('conversion_job_id')->constrained()->cascadeOnDelete();
            $table->string('role');
            $table->string('disk')->default('private');
            $table->string('path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversion_files');
    }
};

