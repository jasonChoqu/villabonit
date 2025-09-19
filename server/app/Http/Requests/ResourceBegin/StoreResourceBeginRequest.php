<?php

namespace App\Http\Requests\ResourceBegin;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceBeginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Acepta IMAGEN o VIDEO
            'url' => [
                'required',
                'file',
                'mimetypes:image/*,video/*',
                'max:204800', // 200 MB (KB)
            ],
            'text' => ['nullable', 'string', 'max:1000'],
            // Solo IMAGEN para el logo (opcional)
            'logo_url' => [
                'nullable',
                'file',
                'mimes:png,jpg,jpeg,webp,svg',
                'max:10240', // 10 MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'url.required'   => 'Debes subir un archivo (imagen o video).',
            'url.file'       => 'El campo url debe ser un archivo válido.',
            'url.mimetypes'  => 'El archivo debe ser una imagen o un video.',
            'url.max'        => 'El archivo excede el tamaño máximo permitido.',
            'logo_url.file'  => 'El logo debe ser un archivo válido.',
            'logo_url.mimes' => 'El logo debe ser una imagen (png, jpg, jpeg, webp o svg).',
            'logo_url.max'   => 'El logo excede el tamaño máximo permitido.',
        ];
    }
}
