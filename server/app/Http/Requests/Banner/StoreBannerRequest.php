<?php

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:2000',
            'image' => 'required|file|mimes:png|max:4096',
        ];
    }
}
