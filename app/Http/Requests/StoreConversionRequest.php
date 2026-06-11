<?php

namespace App\Http\Requests;

use App\Services\ConversionToolCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConversionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tool' => ['required', Rule::in(array_keys(ConversionToolCatalog::tools()))],
            'file' => [
                'required',
                'file',
                'max:'.config('converthub.max_upload_size_kb', 51200),
                'mimes:pdf,jpg,jpeg,png,webp,docx',
            ],
            'options' => ['sometimes', 'array'],
        ];
    }
}
