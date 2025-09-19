<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gallery\StoreGalleryRequest;
use App\Http\Requests\Gallery\UpdateGalleryRequest;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Gallery\GalleryCollection;
use App\Http\Resources\Gallery\GalleryResource;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class GalleryController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        $query = Gallery::query()
            ->search($request->input('search'))
            ->sort(
                $request->input('sortBy.sort', 'id'),
                $request->input('sortBy.order', 'asc')
            );

        $result = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return (new GalleryCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        $item = Gallery::findOrFail($id);
        return (new GalleryResource($item))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreGalleryRequest $request): JsonResponse
    {
        // sane upload env
        @ini_set('upload_max_filesize', '1024M');
        @ini_set('post_max_size', '1024M');
        @ini_set('max_execution_time', '300');
        @ini_set('max_input_time', '300');
        @ini_set('memory_limit', '1024M');

        File::ensureDirectoryExists(public_path('assets/gallery'));

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/gallery'), $name);
            $data['photo'] = 'assets/gallery/'.$name;
        }

        $item = Gallery::create($data);

        return (new GalleryResource($item))
            ->additional(['success' => true, 'message' => 'Imagen de galería creada'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateGalleryRequest $request, $id): JsonResponse
    {
        $item = Gallery::findOrFail($id);

        File::ensureDirectoryExists(public_path('assets/gallery'));
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if (!empty($item->photo)) {
                @File::delete(public_path($item->photo));
            }
            $file = $request->file('photo');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/gallery'), $name);
            $data['photo'] = 'assets/gallery/'.$name;
        } else {
            unset($data['photo']);
        }

        $item->update($data);

        return (new GalleryResource($item->fresh()))
            ->additional(['success' => true, 'message' => 'Imagen de galería actualizada'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $item = Gallery::findOrFail($id);
        $item->delete();
        return response()->json([
            'success' => true,
            'message' => 'Imagen de galería eliminada',
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Gallery::all();
        return (GalleryResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
