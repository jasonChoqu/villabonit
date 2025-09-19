<?php

namespace App\Http\Resources\Gallery;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'description2' => $this->description2,
            'area' => $this->area,
            'photo' => $this->photo,
            'created_at' => $this->created_at,
        ];
    }
}
