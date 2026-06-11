<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdfEditorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:pdf', 'max:'.config('converthub.max_upload_size_kb', 51200)],
            'operations' => ['nullable', 'array'],
            'operations.*.type' => ['required_with:operations', 'string'],
            'operations.*.page' => ['required_with:operations', 'integer', 'min:1'],
            'operations.*.target' => ['nullable', 'integer', 'min:1'],
            'operations.*.degrees' => ['nullable', 'integer'],
        ];
    }
}
