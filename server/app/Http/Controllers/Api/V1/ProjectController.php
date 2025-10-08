<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Project\ProjectCollection;
use App\Http\Resources\Project\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        $query = Project::query()
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

        return (new ProjectCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        $item = Project::findOrFail($id);
        return (new ProjectResource($item))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        // sane upload env
        @ini_set('upload_max_filesize', '1024M');
        @ini_set('post_max_size', '1024M');
        @ini_set('max_execution_time', '300');
        @ini_set('max_input_time', '300');
        @ini_set('memory_limit', '1024M');

        File::ensureDirectoryExists(public_path('assets/projects'));

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/projects'), $name);
            $data['image_path'] = 'assets/projects/'.$name;
        }

        $item = Project::create($data);

        return (new ProjectResource($item))
            ->additional(['success' => true, 'message' => 'Proyecto creado exitosamente'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateProjectRequest $request, $id): JsonResponse
    {
        $item = Project::findOrFail($id);

        File::ensureDirectoryExists(public_path('assets/projects'));
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if (!empty($item->image_path)) {
                @File::delete(public_path($item->image_path));
            }
            $file = $request->file('image');
            $name = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/projects'), $name);
            $data['image_path'] = 'assets/projects/'.$name;
        } else {
            unset($data['image_path']);
        }

        $item->update($data);

        return (new ProjectResource($item->fresh()))
            ->additional(['success' => true, 'message' => 'Proyecto actualizado exitosamente'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $item = Project::findOrFail($id);
        
        // Eliminar imagen asociada si existe
        if (!empty($item->image_path)) {
            @File::delete(public_path($item->image_path));
        }
        
        $item->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Proyecto eliminado exitosamente',
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Project::all();
        return (ProjectResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
