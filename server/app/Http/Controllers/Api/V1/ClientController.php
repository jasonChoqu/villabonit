<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ClientController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('cliente_listar');

        $query = Client::query()
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

        return (new ClientCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        Gate::authorize('cliente_ver');

        $client = Client::findOrFail($id);

        return (new ClientResource($client))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        Gate::authorize('cliente_crear');

        $client = Client::create($request->validated());

        return (new ClientResource($client))
            ->additional([
                'success' => true,
                'message' => 'Cliente creado satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateClientRequest $request, $id): JsonResponse
    {
        Gate::authorize('cliente_editar');

        $client = Client::findOrFail($id);
        $client->update($request->validated());

        return (new ClientResource($client))
            ->additional([
                'success' => true,
                'message' => 'Cliente actualizado satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('cliente_eliminar');

        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(Request $request): JsonResponse
    {
        $query = Client::query();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        $result = $query->get();

        return (ClientResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
