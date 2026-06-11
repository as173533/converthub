<?php

namespace App\Services;

class ConversionToolCatalog
{
    public static function tools(): array
    {
        return [
            'image-to-pdf' => ['label' => 'Image to PDF', 'output' => 'pdf', 'group' => 'PDF'],
            'jpg-to-png' => ['label' => 'JPG to PNG', 'output' => 'png', 'group' => 'Image'],
            'png-to-jpg' => ['label' => 'PNG to JPG', 'output' => 'jpg', 'group' => 'Image'],
            'webp-to-jpg' => ['label' => 'WEBP to JPG', 'output' => 'jpg', 'group' => 'Image'],
            'webp-to-png' => ['label' => 'WEBP to PNG', 'output' => 'png', 'group' => 'Image'],
            'compress-image' => ['label' => 'Compress Image', 'output' => 'jpg', 'group' => 'Compression'],
            'compress-pdf' => ['label' => 'Compress PDF', 'output' => 'pdf', 'group' => 'Compression'],
            'merge-pdf' => ['label' => 'Merge PDF', 'output' => 'pdf', 'group' => 'PDF'],
            'split-pdf' => ['label' => 'Split PDF', 'output' => 'pdf', 'group' => 'PDF'],
            'rotate-pdf' => ['label' => 'Rotate PDF', 'output' => 'pdf', 'group' => 'PDF'],
            'pdf-to-image' => ['label' => 'PDF to Image', 'output' => 'jpg', 'group' => 'PDF'],
            'pdf-editor' => ['label' => 'PDF Editor', 'output' => 'pdf', 'group' => 'PDF'],
        ];
    }

    public static function outputExtension(string $tool): string
    {
        return self::tools()[$tool]['output'] ?? 'bin';
    }

    public static function list(): array
    {
        return collect(self::tools())
            ->map(fn (array $tool, string $id): array => ['id' => $id, ...$tool])
            ->values()
            ->all();
    }
}

