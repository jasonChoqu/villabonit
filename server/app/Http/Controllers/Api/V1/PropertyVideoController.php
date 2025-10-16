<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyVideo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PropertyVideoController extends Controller
{
    /**
     * Obtener videos de una propiedad
     */
    public function index(Request $request, $propertyId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);
            
            $videos = $property->activeVideos()
                ->when($request->get('type'), function ($query, $type) {
                    return $query->where('video_type', $type);
                })
                ->when($request->get('featured'), function ($query) {
                    return $query->where('is_featured', true);
                })
                ->get();

            return response()->json([
                'success' => true,
                'data' => $videos->map(function ($video) {
                    return array_merge($video->toArray(), [
                        'embed_url' => $video->embed_url,
                        'youtube_thumbnail' => $video->youtube_thumbnail
                    ]);
                })
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener videos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar video a una propiedad
     */
    public function store(Request $request, $propertyId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);

            $validator = Validator::make($request->all(), [
                'youtube_url' => 'required|url',
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'video_type' => 'nullable|in:tour_virtual,exterior,interior,neighborhood,amenities,promotional,construction,testimonial,other',
                'sort_order' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|boolean',
                'allow_autoplay' => 'nullable|boolean',
                'show_controls' => 'nullable|boolean',
                'show_info' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Extraer video ID de YouTube
            $videoId = PropertyVideo::extractVideoId($request->youtube_url);
            if (!$videoId) {
                return response()->json([
                    'success' => false,
                    'message' => 'URL de YouTube no válida'
                ], 422);
            }

            DB::beginTransaction();

            // Si es destacado, quitar destacado de otros videos
            if ($request->get('is_featured', false)) {
                $property->videos()->update(['is_featured' => false]);
            }

            // Obtener siguiente sort_order si no se especifica
            $sortOrder = $request->get('sort_order', $property->videos()->max('sort_order') + 1);

            $video = PropertyVideo::create([
                'property_id' => $property->id,
                'youtube_url' => $request->youtube_url,
                'youtube_video_id' => $videoId,
                'title' => $request->title,
                'description' => $request->description,
                'video_type' => $request->get('video_type', 'tour_virtual'),
                'sort_order' => $sortOrder,
                'thumbnail_url' => "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg",
                'is_featured' => $request->get('is_featured', false),
                'allow_autoplay' => $request->get('allow_autoplay', false),
                'show_controls' => $request->get('show_controls', true),
                'show_info' => $request->get('show_info', true)
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => array_merge($video->toArray(), [
                    'embed_url' => $video->embed_url,
                    'youtube_thumbnail' => $video->youtube_thumbnail
                ]),
                'message' => 'Video agregado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar video específico
     */
    public function show($propertyId, $videoId): JsonResponse
    {
        try {
            $video = PropertyVideo::where('property_id', $propertyId)
                ->where('id', $videoId)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => array_merge($video->toArray(), [
                    'embed_url' => $video->embed_url,
                    'youtube_thumbnail' => $video->youtube_thumbnail
                ])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video no encontrado'
            ], 404);
        }
    }

    /**
     * Actualizar video
     */
    public function update(Request $request, $propertyId, $videoId): JsonResponse
    {
        try {
            $video = PropertyVideo::where('property_id', $propertyId)
                ->where('id', $videoId)
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'youtube_url' => 'sometimes|url',
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'video_type' => 'nullable|in:tour_virtual,exterior,interior,neighborhood,amenities,promotional,construction,testimonial,other',
                'sort_order' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|boolean',
                'is_active' => 'nullable|boolean',
                'allow_autoplay' => 'nullable|boolean',
                'show_controls' => 'nullable|boolean',
                'show_info' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Si cambia la URL, extraer nuevo video ID
            if ($request->has('youtube_url')) {
                $videoId = PropertyVideo::extractVideoId($request->youtube_url);
                if (!$videoId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'URL de YouTube no válida'
                    ], 422);
                }
                $video->youtube_video_id = $videoId;
                $video->thumbnail_url = "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg";
            }

            // Si se marca como destacado, quitar destacado de otros
            if ($request->get('is_featured', false)) {
                PropertyVideo::where('property_id', $propertyId)
                    ->where('id', '!=', $video->id)
                    ->update(['is_featured' => false]);
            }

            $video->update($request->only([
                'youtube_url', 'title', 'description', 'video_type', 
                'sort_order', 'is_featured', 'is_active', 'allow_autoplay', 
                'show_controls', 'show_info'
            ]));

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => array_merge($video->fresh()->toArray(), [
                    'embed_url' => $video->embed_url,
                    'youtube_thumbnail' => $video->youtube_thumbnail
                ]),
                'message' => 'Video actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar video
     */
    public function destroy($propertyId, $videoId): JsonResponse
    {
        try {
            $video = PropertyVideo::where('property_id', $propertyId)
                ->where('id', $videoId)
                ->firstOrFail();

            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'Video eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar video: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reordenar videos
     */
    public function reorder(Request $request, $propertyId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'videos' => 'required|array',
                'videos.*.id' => 'required|integer|exists:property_videos,id',
                'videos.*.sort_order' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            foreach ($request->videos as $videoData) {
                PropertyVideo::where('property_id', $propertyId)
                    ->where('id', $videoData['id'])
                    ->update(['sort_order' => $videoData['sort_order']]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Videos reordenados exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar videos: ' . $e->getMessage()
            ], 500);
        }
    }
}
