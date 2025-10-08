<?php

namespace App\Http\Requests\ValueProposition;

use Illuminate\Foundation\Http\FormRequest;

class StoreValuePropositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es requerido.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no puede exceder los 255 caracteres.',
            'description.required' => 'La descripción es requerida.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no puede exceder los 2000 caracteres.',
        ];
    }
}