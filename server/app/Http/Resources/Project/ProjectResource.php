<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'features' => $this->features,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url, // URL completa de la imagen
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
