<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Timeline\StoreTimelineRequest;
use App\Http\Requests\Timeline\UpdateTimelineRequest;
use App\Http\Resources\Timeline\TimelineCollection;
use App\Http\Resources\Timeline\TimelineResource;
use App\Models\Timeline;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TimelineController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        $query = Timeline::query()
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

        return (new TimelineCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        $item = Timeline::findOrFail($id);
        return (new TimelineResource($item))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreTimelineRequest $request): JsonResponse
    {
        // allow bigger uploads just in case
        @ini_set('upload_max_filesize', '64M');
        @ini_set('post_max_size', '64M');
        @ini_set('max_execution_time', '120');
        @ini_set('max_input_time', '120');
        @ini_set('memory_limit', '256M');

        File::ensureDirectoryExists(public_path('assets/timeline'));

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/timeline'), $name);
            $data['photo'] = 'assets/timeline/'.$name;
        }

        $item = Timeline::create($data);

        return (new TimelineResource($item))
            ->additional(['success' => true, 'message' => 'Elemento de línea de tiempo creado'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateTimelineRequest $request, $id): JsonResponse
    {
        $item = Timeline::findOrFail($id);

        File::ensureDirectoryExists(public_path('assets/timeline'));
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if (!empty($item->photo)) {
                @File::delete(public_path($item->photo));
            }
            $file = $request->file('photo');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/timeline'), $name);
            $data['photo'] = 'assets/timeline/'.$name;
        } else {
            unset($data['photo']);
        }

        $item->update($data);

        return (new TimelineResource($item->fresh()))
            ->additional(['success' => true, 'message' => 'Elemento de línea de tiempo actualizado'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $item = Timeline::findOrFail($id);
        if (!empty($item->photo)) {
            @File::delete(public_path($item->photo));
        }
        $item->delete();
        return response()->json([
            'success' => true,
            'message' => 'Elemento de línea de tiempo eliminado',
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Timeline::all();
        return (TimelineResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
