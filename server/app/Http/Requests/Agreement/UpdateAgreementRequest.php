<?php

namespace App\Http\Requests\Agreement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
        'name' => ['sometimes','string','max:255'],
        'description' => ['sometimes','nullable','string','max:2000'],
        'photo' => ['sometimes','file','mimes:jpg,jpeg,png,webp,pdf','max:4096'],
        ];
    }
}
