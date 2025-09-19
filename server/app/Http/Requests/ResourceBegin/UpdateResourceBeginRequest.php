<?php

namespace App\Http\Requests\ResourceBegin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResourceBeginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Si llega, acepta IMAGEN o VIDEO (mismo límite que en Store)
            'url' => [
                'sometimes',
                'file',
                'mimetypes:image/*,video/*',
                'max:204800', // 200 MB (KB)
            ],

            // Texto opcional
            'text' => ['sometimes', 'nullable', 'string', 'max:1000'],

            // Si llega, debe ser IMAGEN
            'logo_url' => [
                'sometimes',
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
            'url.file'      => 'El archivo debe ser una imagen o un video válido.',
            'url.mimetypes' => 'El archivo debe ser de tipo imagen o video.',
            'url.max'       => 'El archivo excede el tamaño máximo permitido (200 MB).',

            'logo_url.file'  => 'El logo debe ser un archivo válido.',
            'logo_url.mimes' => 'El logo debe ser una imagen (png, jpg, jpeg, webp o svg).',
            'logo_url.max'   => 'El logo excede el tamaño máximo permitido (10 MB).',
        ];
    }
}
