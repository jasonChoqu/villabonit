<?php

namespace App\Http\Requests\Timeline;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimelineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'year' => 'sometimes|nullable|string|max:10',
            'photo' => 'sometimes|nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
        ];
    }
}
