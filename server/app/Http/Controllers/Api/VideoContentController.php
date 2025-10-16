<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VideoContent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class VideoContentController extends Controller
{
    /**
     * Obtener todo el contenido de video con paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $search = $request->get('search');
            $sortBy = $request->get('sort_by', 'order');
            $sortOrder = $request->get('sort_order', 'asc');
            $isActive = $request->get('is_active');

            $query = VideoContent::query();

            // Aplicar búsqueda
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('video_url', 'like', "%{$search}%");
                });
            }

            // Filtrar por estado activo
            if ($isActive !== null) {
                $query->where('is_active', (bool) $isActive);
            }

            // Aplicar ordenamiento
            $query->orderBy($sortBy, $sortOrder);

            // Obtener resultados paginados
            $videos = $query->paginate($perPage);

            // Transformar los datos
            $transformedData = $videos->getCollection()->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'video_id' => $video->video_id,
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                    'is_active' => $video->is_active,
                    'order' => $video->order,
                    'created_at' => $video->created_at,
                    'updated_at' => $video->updated_at,
                ];
            });

            return response()->json([
                'data' => $transformedData,
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
                'per_page' => $videos->perPage(),
                'total' => $videos->total(),
                'from' => $videos->firstItem(),
                'to' => $videos->lastItem(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el contenido de video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener solo videos activos (para frontend público)
     */
    public function getActiveVideos(): JsonResponse
    {
        try {
            $videos = VideoContent::active()
                ->ordered()
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'video_url' => $video->video_url,
                        'embed_url' => $video->embed_url,
                        'thumbnail_url' => $video->thumbnail_url,
                        'order' => $video->order,
                        'created_at' => $video->created_at,
                        'updated_at' => $video->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $videos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el contenido de video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un video específico
     */
    public function show($id): JsonResponse
    {
        try {
            $video = VideoContent::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                    'is_active' => $video->is_active,
                    'order' => $video->order,
                    'created_at' => $video->created_at,
                    'updated_at' => $video->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear nuevo contenido de video
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'video_url' => 'required|url',
                'is_active' => 'boolean',
                'order' => 'integer|min:1'
            ]);

            $video = VideoContent::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Contenido de video creado exitosamente',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                    'is_active' => $video->is_active,
                    'order' => $video->order,
                ]
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el contenido de video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar contenido de video
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $video = VideoContent::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'video_url' => 'sometimes|url',
                'is_active' => 'sometimes|boolean',
                'order' => 'sometimes|integer|min:1'
            ]);

            $video->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Contenido de video actualizado exitosamente',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                    'is_active' => $video->is_active,
                    'order' => $video->order,
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el contenido de video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar contenido de video
     */
    public function destroy($id): JsonResponse
    {
        try {
            $video = VideoContent::findOrFail($id);
            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contenido de video eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el contenido de video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener el primer video activo (para el componente VideoInHome)
     */
    public function getMainVideo(): JsonResponse
    {
        try {
            $video = VideoContent::active()
                ->ordered()
                ->first();

            if (!$video) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay contenido de video disponible'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el video principal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}