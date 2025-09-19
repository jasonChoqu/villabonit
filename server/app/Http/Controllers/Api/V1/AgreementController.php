<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agreement\AgreementResource;
use App\Models\Agreement;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Agreement\AgreementCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Agreement\StoreAgreementRequest;
use App\Http\Requests\Agreement\UpdateAgreementRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\File;   // ⬅️ AÑADIR
use Illuminate\Support\Str;            // ⬅️ AÑADIR

class AgreementController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        //Gate::authorize('acuerdo_listar');
        
        $query = Agreement::query()
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

        return (new AgreementCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
      //  Gate::authorize('acuerdo_ver');

        $agreement = Agreement::findOrFail($id);

        return (new AgreementResource($agreement))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreAgreementRequest $request): JsonResponse
    {
        // (Opcional, como en tu ResourceBegin)
        ini_set('upload_max_filesize', '1024M');
        ini_set('post_max_size', '1024M');
        ini_set('max_execution_time', '300');
        ini_set('max_input_time', '300');
        ini_set('memory_limit', '1024M');

        // 1) asegurar carpeta
        File::ensureDirectoryExists(public_path('assets/agreements'));

        // 2) preparar data validada
        $data = $request->validated();

        // 3) guardar archivo 'photo' (si llega)
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoFile = $request->file('photo');
            $photoName = Str::uuid()->toString().'.'.$photoFile->getClientOriginalExtension();
            $photoFile->move(public_path('assets/agreements'), $photoName);
            $photoPath = 'assets/agreements/'.$photoName;
        }

        // 4) persistir con ruta (NO guardes UploadedFile)
        if ($photoPath !== null) {
            $data['photo'] = $photoPath;
        }

        $agreement = Agreement::create($data);

        return (new AgreementResource($agreement))
            ->additional([
                'success' => true,
                'message' => 'Acuerdo creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

     public function update(UpdateAgreementRequest $request, $id): JsonResponse
    {
        $agreement = Agreement::findOrFail($id);

        // asegurar carpeta
        File::ensureDirectoryExists(public_path('assets/agreements'));

        // data validada (sin el file)
        $data = $request->validated();

        // si llega nueva foto, borra la anterior y sube la nueva
        if ($request->hasFile('photo')) {
            if (!empty($agreement->photo)) {
                // intenta eliminar archivo físico viejo
                @File::delete(public_path($agreement->photo));
            }

            $photoFile = $request->file('photo');
            $photoName = Str::uuid()->toString().'.'.$photoFile->getClientOriginalExtension();
            $photoFile->move(public_path('assets/agreements'), $photoName);
            $data['photo'] = 'assets/agreements/'.$photoName;
        } else {
            // si no enviaste 'photo' en update, evita sobrescribir a null accidentalmente
            unset($data['photo']);
        }

        $agreement->update($data);

        return (new AgreementResource($agreement->fresh()))
            ->additional([
                'success' => true,
                'message' => 'Acuerdo actualizado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        //Gate::authorize('acuerdo_eliminar');

        $agreement = Agreement::findOrFail($id);
        $agreement->delete();
        return response()->json([
            'success' => true,
            'message' => 'Acuerdo eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {   
        $result = Agreement::all();

        return (AgreementResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
