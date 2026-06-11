<?php

return [
    'max_upload_size_kb' => (int) env('MAX_UPLOAD_SIZE_KB', 51200),
    'storage_disk' => env('FILESYSTEM_DISK', 'private'),
];

