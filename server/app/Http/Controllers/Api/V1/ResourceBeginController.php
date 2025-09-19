<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ResourceBegin;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\ResourceBegin\StoreResourceBeginRequest;
use App\Http\Requests\ResourceBegin\UpdateResourceBeginRequest;
use App\Http\Resources\ResourceBegin\ResourceBeginCollection;
use App\Http\Resources\ResourceBegin\ResourceBeginResource;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ResourceBeginController extends Controller
{
    // Carpetas (web relativas) y absolutas
    private string $videoDirWeb = 'assets/resources';
    private string $logoDirWeb  = 'assets/resources/logos';

    public function index(PaginationRequest $request): JsonResponse
    {
        $query = ResourceBegin::query()
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

        return (new ResourceBeginCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $items = ResourceBegin::query()->get(['id', 'url', 'text', 'logo_url']);

        return ResourceBeginResource::collection($items)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        $item = ResourceBegin::findOrFail($id);

        return (new ResourceBeginResource($item))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreResourceBeginRequest $request): JsonResponse
    {
        // (opcional) por si subes archivos grandes
        ini_set('upload_max_filesize', '1024M');
        ini_set('post_max_size', '1024M');
        ini_set('max_execution_time', '300');
        ini_set('max_input_time', '300');
        ini_set('memory_limit', '1024M');

        // Asegurar carpetas
        File::ensureDirectoryExists(public_path($this->videoDirWeb));
        File::ensureDirectoryExists(public_path($this->logoDirWeb));

        $data = $request->validated();

        // --- VIDEO (campo 'url') ---
        $videoPath = null;
        if ($request->hasFile('url')) {
            $videoFile = $request->file('url');
            $videoName = Str::uuid()->toString().'.'.$videoFile->getClientOriginalExtension();
            $videoFile->move(public_path($this->videoDirWeb), $videoName);
            $videoPath = $this->videoDirWeb.'/'.$videoName;
        } elseif ($this->isDataUrl($request->input('url'))) {
            $videoPath = $this->saveDataUrlToPublic($request->input('url'), $this->videoDirWeb);
        }

        // --- LOGO (campo 'logo_url') (opcional) ---
        $logoPath = null;
        if ($request->hasFile('logo_url')) {
            $logoFile = $request->file('logo_url');
            $logoName = Str::uuid()->toString().'.'.$logoFile->getClientOriginalExtension();
            $logoFile->move(public_path($this->logoDirWeb), $logoName);
            $logoPath = $this->logoDirWeb.'/'.$logoName;
        } elseif ($this->isDataUrl($request->input('logo_url'))) {
            $logoPath = $this->saveDataUrlToPublic($request->input('logo_url'), $this->logoDirWeb);
        }

        // Persistir rutas (sin UploadedFile)
        if ($videoPath !== null) $data['url'] = $videoPath;
        if ($logoPath  !== null) $data['logo_url'] = $logoPath;

        $item = ResourceBegin::create([
            'url'      => $data['url']      ?? null,
            'text'     => $data['text']     ?? null,
            'logo_url' => $data['logo_url'] ?? null,
        ]);

        return (new ResourceBeginResource($item))
            ->additional([
                'success' => true,
                'message' => 'Recurso creado correctamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateResourceBeginRequest $request, $id): JsonResponse
    {
        $item = ResourceBegin::findOrFail($id);

        File::ensureDirectoryExists(public_path($this->videoDirWeb));
        File::ensureDirectoryExists(public_path($this->logoDirWeb));

        // --- VIDEO (reemplazo si llega) ---
        if ($request->hasFile('url')) {
            if (!empty($item->url)) @File::delete(public_path($item->url));
            $videoFile = $request->file('url');
            $videoName = Str::uuid()->toString().'.'.$videoFile->getClientOriginalExtension();
            $videoFile->move(public_path($this->videoDirWeb), $videoName);
            $item->url = $this->videoDirWeb.'/'.$videoName;
        } elseif ($this->isDataUrl($request->input('url'))) {
            if (!empty($item->url)) @File::delete(public_path($item->url));
            $item->url = $this->saveDataUrlToPublic($request->input('url'), $this->videoDirWeb);
        }
        // si no llega 'url', no tocar $item->url

        // --- LOGO (reemplazo si llega) ---
        if ($request->hasFile('logo_url')) {
            if (!empty($item->logo_url)) @File::delete(public_path($item->logo_url));
            $logoFile = $request->file('logo_url');
            $logoName = Str::uuid()->toString().'.'.$logoFile->getClientOriginalExtension();
            $logoFile->move(public_path($this->logoDirWeb), $logoName);
            $item->logo_url = $this->logoDirWeb.'/'.$logoName;
        } elseif ($this->isDataUrl($request->input('logo_url'))) {
            if (!empty($item->logo_url)) @File::delete(public_path($item->logo_url));
            $item->logo_url = $this->saveDataUrlToPublic($request->input('logo_url'), $this->logoDirWeb);
        }
        // si no llega 'logo_url', no tocar $item->logo_url

        // Texto (permite null/empty explícito)
        if ($request->filled('text') || $request->has('text')) {
            $item->text = $request->input('text');
        }

        $item->save();

        return (new ResourceBeginResource($item))
            ->additional([
                'success' => true,
                'message' => 'Recurso actualizado correctamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        $item = ResourceBegin::findOrFail($id);

        // eliminar archivos físicos
        if (!empty($item->url)) {
            @File::delete(public_path($item->url));
        }
        if (!empty($item->logo_url)) {
            @File::delete(public_path($item->logo_url));
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Recurso eliminado correctamente',
        ])->setStatusCode(Response::HTTP_OK);
    }

    /* ===================== helpers privados ===================== */

    private function isDataUrl($value): bool
    {
        return is_string($value) && preg_match('/^data:.*;base64,/', $value) === 1;
    }

    private function saveDataUrlToPublic(string $dataUrl, string $webDir): string
    {
        // extraer mime y contenido
        if (!preg_match('/^data:(.*?);base64,(.*)$/', $dataUrl, $m)) {
            abort(422, 'Data URL inválida');
        }
        $mime = $m[1];
        $bin  = base64_decode($m[2], true);
        if ($bin === false) {
            abort(422, 'Base64 inválido');
        }

        // mapear extensión
        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/jpg'  => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'video/mp4'  => 'mp4',
            'video/webm' => 'webm',
            default      => 'bin',
        };

        // asegurar carpeta y escribir
        File::ensureDirectoryExists(public_path($webDir));
        $name = Str::uuid()->toString().'.'.$ext;
        $abs  = public_path($webDir.DIRECTORY_SEPARATOR.$name);
        File::put($abs, $bin);

        // devolver ruta web relativa
        return $webDir.'/'.$name;
    }
}
