<?php

namespace App\Http\Requests\Gallery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'description' => 'required|string|max:255',
            'description2' => 'nullable|string|max:255',
            'area' => 'required|string|max:100',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:4096',
        ];
    }
}
