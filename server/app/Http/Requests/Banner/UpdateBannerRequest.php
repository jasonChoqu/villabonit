<?php

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:100',
            'subtitle' => 'nullable|string|max:2000',
            'image' => 'nullable|file|mimes:png|max:4096',
        ];
    }
}
