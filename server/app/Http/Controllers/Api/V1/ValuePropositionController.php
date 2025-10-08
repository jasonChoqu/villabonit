<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ValueProposition\ValuePropositionResource;
use App\Models\ValueProposition;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\ValueProposition\ValuePropositionCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\ValueProposition\StoreValuePropositionRequest;
use App\Http\Requests\ValueProposition\UpdateValuePropositionRequest;

class ValuePropositionController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        $query = ValueProposition::query()
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

        return (new ValuePropositionCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        $valueProposition = ValueProposition::findOrFail($id);

        return (new ValuePropositionResource($valueProposition))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreValuePropositionRequest $request): JsonResponse
    {

        $valueProposition = ValueProposition::create($request->validated());

        return (new ValuePropositionResource($valueProposition))
            ->additional([
                'success' => true,
                'message' => 'Propuesta de valor creada satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateValuePropositionRequest $request, $id): JsonResponse
    {
        $valueProposition = ValueProposition::findOrFail($id);
        $valueProposition->update($request->validated());

        return (new ValuePropositionResource($valueProposition))
            ->additional([
                'success' => true,
                'message' => 'Propuesta de valor actualizada satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $valueProposition = ValueProposition::findOrFail($id);
        $valueProposition->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Propuesta de valor eliminada satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = ValueProposition::all();

        return (ValuePropositionResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}