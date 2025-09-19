<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CertificationTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class CertificationTemplateController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('certification_template_listar');

        $query = CertificationTemplate::query()
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

        return response()->json($result, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        Gate::authorize('certification_template_crear');
        
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'blade_view' => 'required|string|max:255',
            'preview_image' => 'nullable|string|max:255',
            'background_image' => 'nullable|string|max:255',
        ]);

        $template = CertificationTemplate::create($data);
        return response()->json($template, Response::HTTP_CREATED);
    }

    public function show(CertificationTemplate $certificationTemplate)
    {
        Gate::authorize('certification_template_ver');
        
        return response()->json($certificationTemplate);
    }

    public function update(Request $request, CertificationTemplate $certificationTemplate)
    {
        Gate::authorize('certification_template_editar');
        
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'blade_view' => 'sometimes|required|string|max:255',
            'preview_image' => 'nullable|string|max:255',
            'background_image' => 'nullable|string|max:255',
        ]);

        $certificationTemplate->update($data);
        return response()->json($certificationTemplate);
    }

    public function destroy(CertificationTemplate $certificationTemplate)
    {
        Gate::authorize('certification_template_eliminar');
        
        $certificationTemplate->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
