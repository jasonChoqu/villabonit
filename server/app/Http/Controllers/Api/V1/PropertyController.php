<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    public function __construct()
    {
        // Aplicar middleware de CORS a todas las rutas
    }

    /**
     * Listar todas las propiedades con filtros opcionales
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Relaciones base
            $with = ['featuredImage', 'images'];
            
            // Incluir videos si se solicita
            if ($request->has('include_videos') && $request->boolean('include_videos')) {
                $with[] = 'activeVideos';
            }
            
            $query = Property::with($with);

            // Filtros
            if ($request->has('type') && $request->type) {
                $query->byType($request->type);
            }

            if ($request->has('city') && $request->city) {
                $query->byCity($request->city);
            }

            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            if ($request->has('featured') && $request->boolean('featured')) {
                $query->featured();
            }

            // Filtro de precio
            if ($request->has('min_price') || $request->has('max_price')) {
                $query->priceRange($request->min_price, $request->max_price);
            }

            // Filtro de habitaciones
            if ($request->has('bedrooms') && $request->bedrooms) {
                $query->where('bedrooms', '>=', $request->bedrooms);
            }

            // Búsqueda por texto
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%")
                      ->orWhere('address', 'LIKE', "%{$search}%")
                      ->orWhere('city', 'LIKE', "%{$search}%");
                });
            }

            // Ordenamiento - manejar el formato que envía useResource
            $sortBy = 'created_at';
            $sortOrder = 'desc';
            
            // Si viene sortBy como array desde useResource
            if ($request->has('sortBy') && is_array($request->sortBy)) {
                $sortBy = $request->sortBy['sort'] ?? 'created_at';
                $sortOrder = $request->sortBy['order'] ?? 'desc';
            } else {
                // Si viene como parámetros individuales
                $sortBy = $request->get('sort_by', 'created_at');
                $sortOrder = $request->get('sort_order', 'desc');
            }
            
            $query->orderBy($sortBy, $sortOrder);

            // Paginación - manejar limit como per_page
            $perPage = $request->get('limit', $request->get('per_page', 15));
            $properties = $query->paginate($perPage);

            // Agregar URLs de embed a los videos si están incluidos
            if ($request->has('include_videos') && $request->boolean('include_videos')) {
                $properties->getCollection()->transform(function ($property) {
                    if ($property->activeVideos) {
                        $property->activeVideos->transform(function ($video) {
                            $video->embed_url = $video->embed_url;
                            $video->youtube_thumbnail = $video->youtube_thumbnail;
                            return $video;
                        });
                    }
                    return $property;
                });
            }

            return response()->json($properties);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener propiedades: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nueva propiedad
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:180',
                'description' => 'nullable|string',
                'property_type' => 'required|in:house,apartment,penthouse,townhouse,duplex,triplex,studio,loft,villa,bungalow,cottage,farmhouse,condo,cabins,ranch,chalet,mansion,retirement_home,studio_apartment,garden_house,attic,basement_flat,mixed_use,mobile_home,tiny_house,terreno,other',
                'price' => 'required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'area_m2' => 'nullable|numeric|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'parking' => 'nullable|integer|min:0',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'zipcode' => 'nullable|string|max:20',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'built_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
                'floor' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'amenities' => 'nullable|array',
                'agent_name' => 'nullable|string|max:120',
                'agent_phone' => 'nullable|string|max:50',
                'agent_email' => 'nullable|email|max:150',
                'is_featured' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $propertyData = $validator->validated();
            $propertyData['slug'] = Str::slug($propertyData['title']);
            
            // Asegurar que el slug sea único
            $originalSlug = $propertyData['slug'];
            $counter = 1;
            while (Property::where('slug', $propertyData['slug'])->exists()) {
                $propertyData['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            $property = Property::create($propertyData);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $property->load(['featuredImage', 'images']),
                'message' => 'Propiedad creada exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear propiedad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar propiedad específica
     */
    public function show($id): JsonResponse
    {
        try {
            $property = Property::with([
                'images' => function ($query) {
                    $query->ordered();
                },
                'activeVideos' => function ($query) {
                    $query->ordered();
                }
            ])->findOrFail($id);

            // Incrementar contador de vistas
            $property->incrementViews();

            // Agregar URLs de embed a los videos
            $property->activeVideos->transform(function ($video) {
                $video->embed_url = $video->embed_url;
                $video->youtube_thumbnail = $video->youtube_thumbnail;
                return $video;
            });

            return response()->json([
                'success' => true,
                'data' => $property,
                'message' => 'Propiedad obtenida exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Propiedad no encontrada'
            ], 404);
        }
    }

    /**
     * Actualizar propiedad
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $property = Property::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:180',
                'description' => 'nullable|string',
                'property_type' => 'sometimes|required|in:house,apartment,penthouse,townhouse,duplex,triplex,studio,loft,villa,bungalow,cottage,farmhouse,condo,cabins,ranch,chalet,mansion,retirement_home,studio_apartment,garden_house,attic,basement_flat,mixed_use,mobile_home,tiny_house,terreno,other',
                'price' => 'sometimes|required|numeric|min:0',
                'currency' => 'nullable|string|size:3',
                'area_m2' => 'nullable|numeric|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'parking' => 'nullable|integer|min:0',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'zipcode' => 'nullable|string|max:20',
                'lat' => 'nullable|numeric|between:-90,90',
                'lng' => 'nullable|numeric|between:-180,180',
                'built_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
                'floor' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'amenities' => 'nullable|array',
                'agent_name' => 'nullable|string|max:120',
                'agent_phone' => 'nullable|string|max:50',
                'agent_email' => 'nullable|email|max:150',
                'is_featured' => 'nullable|boolean',
                'status' => 'nullable|in:available,sold,reserved,rented,off_market',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $propertyData = $validator->validated();

            // Si se actualiza el título, regenerar slug
            if (isset($propertyData['title']) && $propertyData['title'] !== $property->title) {
                $propertyData['slug'] = Str::slug($propertyData['title']);
                
                // Asegurar que el slug sea único
                $originalSlug = $propertyData['slug'];
                $counter = 1;
                while (Property::where('slug', $propertyData['slug'])->where('id', '!=', $property->id)->exists()) {
                    $propertyData['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $property->update($propertyData);

            return response()->json([
                'success' => true,
                'data' => $property->load(['featuredImage', 'images']),
                'message' => 'Propiedad actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar propiedad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar propiedad
     */
    public function destroy($id): JsonResponse
    {
        try {
            $property = Property::findOrFail($id);
            
            DB::beginTransaction();
            
            // Las imágenes se eliminan automáticamente por el cascade
            $property->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Propiedad eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar propiedad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Subir imágenes para una propiedad
     */
    public function uploadImages(Request $request, $id): JsonResponse
    {
        try {
            // Configuración de entorno para subida de archivos grandes
            @ini_set('upload_max_filesize', '1024M');
            @ini_set('post_max_size', '1024M');
            @ini_set('max_execution_time', '300');
            @ini_set('max_input_time', '300');
            @ini_set('memory_limit', '1024M');

            $property = Property::findOrFail($id);

            // Debug: verificar que los archivos llegaron correctamente
            \Log::info('Archivos recibidos:', [
                'files_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
                'all_data' => $request->all()
            ]);

            $validator = Validator::make($request->all(), [
                'images' => 'required|array|max:20',
                'images.*' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
                'image_types' => 'nullable|array',
                'image_types.*' => 'nullable|in:main,exterior,interior,kitchen,bedroom,bathroom,living_room,dining_room,garage,garden,pool,amenities,floor_plan,virtual_tour,other',
                'alt_texts' => 'nullable|array',
                'alt_texts.*' => 'nullable|string|max:255',
                'descriptions' => 'nullable|array',
                'descriptions.*' => 'nullable|string',
                'set_featured' => 'nullable|integer', // Índice de la imagen que será destacada
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que realmente tenemos archivos
            if (!$request->hasFile('images')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se recibieron archivos de imagen'
                ], 400);
            }

            DB::beginTransaction();

            // Crear directorio si no existe (usando File::ensureDirectoryExists como en GalleryController)
            $propertyDir = public_path('assets/properties/' . $property->id);
            \Illuminate\Support\Facades\File::ensureDirectoryExists($propertyDir);

            $uploadedImages = [];
            $images = $request->file('images');
            $imageTypes = $request->get('image_types', []);
            $altTexts = $request->get('alt_texts', []);
            $descriptions = $request->get('descriptions', []);
            $setFeaturedIndex = $request->get('set_featured');

            // Obtener el siguiente sort_order
            $maxSortOrder = $property->images()->max('sort_order') ?? -1;

            foreach ($images as $index => $image) {
                // Verificar que el archivo es válido
                if (!$image->isValid()) {
                    \Log::error('Archivo inválido:', [
                        'index' => $index,
                        'error' => $image->getError(),
                        'error_message' => $image->getErrorMessage()
                    ]);
                    throw new \Exception("Archivo inválido en posición $index: " . $image->getErrorMessage());
                }

                // Verificar que el archivo temporal existe
                $tempPath = $image->getRealPath();
                if (!file_exists($tempPath)) {
                    \Log::error('Archivo temporal no existe:', [
                        'temp_path' => $tempPath,
                        'original_name' => $image->getClientOriginalName()
                    ]);
                    throw new \Exception("El archivo temporal no existe o no es accesible");
                }

                // Generar nombre único usando UUID como en GalleryController
                $fileName = Str::uuid()->toString() . '.' . $image->getClientOriginalExtension();

                // Mover archivo usando move() del UploadedFile
                $destinationPath = $propertyDir . '/' . $fileName;
                
                // Usar copy primero para preservar el archivo temporal
                if (!copy($tempPath, $destinationPath)) {
                    throw new \Exception("No se pudo copiar el archivo a la ubicación final");
                }

                // Verificar que el archivo se copió correctamente
                if (!file_exists($destinationPath)) {
                    throw new \Exception("El archivo no se guardó correctamente en la ubicación final");
                }

                // Obtener dimensiones
                $imageInfo = getimagesize($destinationPath);

                // Determinar si esta imagen será destacada
                $isFeatured = false;
                if ($setFeaturedIndex !== null && $setFeaturedIndex == $index) {
                    $isFeatured = true;
                } elseif ($property->images()->count() === 0 && $index === 0) {
                    // Primera imagen destacada si no hay otras imágenes
                    $isFeatured = true;
                }

                // Crear registro en base de datos
                $relativePath = 'assets/properties/' . $property->id . '/' . $fileName;
                $propertyImage = PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $relativePath, // Guardar la ruta relativa como en GalleryController
                    'image_name' => $image->getClientOriginalName(),
                    'alt_text' => $altTexts[$index] ?? null,
                    'description' => $descriptions[$index] ?? null,
                    'image_type' => $imageTypes[$index] ?? 'main',
                    'sort_order' => $maxSortOrder + $index + 1,
                    'is_featured' => $isFeatured,
                    'mime_type' => $image->getMimeType(),
                    'file_size' => $image->getSize(),
                    'width' => $imageInfo[0] ?? null,
                    'height' => $imageInfo[1] ?? null,
                ]);

                // Agregar URLs a la respuesta
                $propertyImage->load(['property']);
                $uploadedImages[] = array_merge($propertyImage->toArray(), [
                    'image_url' => $propertyImage->image_url,
                    'thumbnail_url' => $propertyImage->thumbnail_url,
                    'formatted_file_size' => $propertyImage->formatted_file_size,
                ]);

                \Log::info('Imagen procesada exitosamente:', [
                    'index' => $index,
                    'original_name' => $image->getClientOriginalName(),
                    'final_path' => $relativePath
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $uploadedImages,
                'message' => count($uploadedImages) . ' imágenes subidas exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error en uploadImages:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al subir imágenes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una imagen específica
     */
    public function deleteImage(Request $request, $propertyId, $imageId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);
            $image = PropertyImage::where('property_id', $property->id)
                                  ->findOrFail($imageId);

            DB::beginTransaction();

            // Eliminar archivo físico usando File::delete como en GalleryController
            if (!empty($image->image_path)) {
                \Illuminate\Support\Facades\File::delete(public_path($image->image_path));
            }

            // Eliminar registro de base de datos
            $image->delete();

            // Si era la imagen destacada, hacer destacada la primera imagen restante
            if ($image->is_featured) {
                $firstImage = $property->images()->first();
                if ($firstImage) {
                    $firstImage->update(['is_featured' => true]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Imagen eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Establecer imagen destacada
     */
    public function setFeaturedImage(Request $request, $propertyId, $imageId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);
            $image = PropertyImage::where('property_id', $property->id)
                                  ->findOrFail($imageId);

            DB::beginTransaction();

            // Quitar destacado de todas las imágenes de la propiedad
            PropertyImage::where('property_id', $property->id)
                         ->update(['is_featured' => false]);

            // Establecer nueva imagen destacada
            $image->update(['is_featured' => true]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $image->load(['property']),
                'message' => 'Imagen destacada establecida exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al establecer imagen destacada: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reordenar imágenes
     */
    public function reorderImages(Request $request, $propertyId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);

            $validator = Validator::make($request->all(), [
                'image_orders' => 'required|array',
                'image_orders.*.image_id' => 'required|integer|exists:property_images,id',
                'image_orders.*.sort_order' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            foreach ($request->image_orders as $order) {
                PropertyImage::where('id', $order['image_id'])
                            ->where('property_id', $property->id)
                            ->update(['sort_order' => $order['sort_order']]);
            }

            DB::commit();

            // Obtener imágenes reordenadas
            $reorderedImages = $property->images()->ordered()->get();

            return response()->json([
                'success' => true,
                'data' => $reorderedImages,
                'message' => 'Imágenes reordenadas exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar imágenes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener todas las imágenes de una propiedad
     */
    public function getPropertyImages($propertyId): JsonResponse
    {
        try {
            $property = Property::findOrFail($propertyId);
            $images = $property->images()->ordered()->get();

            // Agregar URLs y información adicional
            $imagesWithUrls = $images->map(function ($image) {
                return array_merge($image->toArray(), [
                    'image_url' => $image->image_url,
                    'thumbnail_url' => $image->thumbnail_url,
                    'formatted_file_size' => $image->formatted_file_size,
                    'dimensions' => $image->dimensions,
                ]);
            });

            return response()->json([
                'success' => true,
                'data' => $imagesWithUrls,
                'message' => 'Imágenes obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener imágenes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle preflight OPTIONS requests
     */


    public function options()
    {
        return response()->json(null, 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}