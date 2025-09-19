<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Banner\BannerResource;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Banner\BannerCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Banner\StoreBannerRequest;
use App\Http\Requests\Banner\UpdateBannerRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\File;   // ⬅️ AÑADIR
use Illuminate\Support\Str;            // ⬅️ AÑADIR

class BannerController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        // Gate::authorize('banner_listar');

        $query = Banner::query()
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

        return (new BannerCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        // Gate::authorize('banner_ver');

        $banner = Banner::findOrFail($id);

        return (new BannerResource($banner))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreBannerRequest $request): JsonResponse
    {
        // (Opcional) por si subes archivos grandes
        ini_set('upload_max_filesize', '1024M');
        ini_set('post_max_size', '1024M');
        ini_set('max_execution_time', '300');
        ini_set('max_input_time', '300');
        ini_set('memory_limit', '1024M');

        // 1) asegurar carpeta destino en public/
        File::ensureDirectoryExists(public_path('assets/banners'));

        // 2) preparar data validada (sin el archivo todavía)
        $data = $request->validated();

        // 3) guardar archivo 'image' si llega
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageName = Str::uuid()->toString().'.'.$imageFile->getClientOriginalExtension();
            $imageFile->move(public_path('assets/banners'), $imageName);
            $imagePath = 'assets/banners/'.$imageName; // ruta web relativa
        }

        // 4) persistir con la ruta (NO guardes UploadedFile)
        if ($imagePath !== null) {
            $data['image'] = $imagePath;
        }

        $banner = Banner::create($data);

        return (new BannerResource($banner))
            ->additional([
                'success' => true,
                'message' => 'Banner creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBannerRequest $request, $id): JsonResponse
    {
        // Gate::authorize('banner_editar');

        $banner = Banner::findOrFail($id);

        // asegurar carpeta
        File::ensureDirectoryExists(public_path('assets/banners'));

        // data validada (sin el file aún)
        $data = $request->validated();

        // si llega nueva imagen, borra la anterior y sube la nueva
        if ($request->hasFile('image')) {
        $imageFile = $request->file('image');

        if (!empty($banner->image)) {
            $imagePath = public_path($banner->image);

            $imageFile->move(dirname($imagePath), basename($imagePath));
            $data['image'] = $banner->image;
        } else {
            $imageName = $imageFile->getClientOriginalName();
            $imageFile->move(public_path('assets/banners'), $imageName);
            $data['image'] = 'assets/banners/'.$imageName;
        }
}


        $banner->update($data);

        return (new BannerResource($banner->fresh()))
            ->additional([
                'success' => true,
                'message' => 'Banner actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        // Gate::authorize('banner_eliminar');

        $banner = Banner::findOrFail($id);

        // (opcional) borrar archivo físico asociado
        if (!empty($banner->image)) {
            @File::delete(public_path($banner->image));
        }

        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Banner eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Banner::all();

        return (BannerResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
