<?php

namespace App\Http\Requests\Timeline;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimelineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'required|string|max:10',
            'photo' => 'required|image|mimes:jpeg,jpg,png,webp|max:4096',
        ];
    }
}
