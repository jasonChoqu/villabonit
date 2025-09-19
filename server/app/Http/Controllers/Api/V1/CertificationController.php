<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class CertificationController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('certificacion_listar');

        $query = Certification::query()
            ->with(['template', 'course'])
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
        Gate::authorize('certificacion_crear');
        
        $data = $request->validate([
            'template_id' => 'required|exists:certification_templates,id',
            'course_id' => 'nullable|exists:courses,id',
            'title' => 'required|string',
            'content' => 'nullable|string',
            'issue_city' => 'required|string',
            'verification_code' => 'required|string|unique:certifications,verification_code',
            'pdf_file' => 'nullable|string',
            'qr_url' => 'nullable|string',
        ]);

        $certification = Certification::create($data);
        return response()->json($certification->load('template', 'course'), Response::HTTP_CREATED);
    }

    public function show(Certification $certification)
    {
        Gate::authorize('certificacion_ver');
        
        return response()->json($certification->load('template', 'course'));
    }

    public function update(Request $request, Certification $certification)
    {
        Gate::authorize('certificacion_editar');
        
        $data = $request->validate([
            'template_id' => 'sometimes|required|exists:certification_templates,id',
            'course_id' => 'nullable|exists:courses,id',
            'title' => 'sometimes|required|string',
            'content' => 'nullable|string',
            'issue_city' => 'sometimes|required|string',
            'verification_code' => 'sometimes|required|string|unique:certifications,verification_code,' . $certification->id,
            'pdf_file' => 'nullable|string',
            'qr_url' => 'nullable|string',
        ]);

        $certification->update($data);
        return response()->json($certification->load('template', 'course'));
    }

    public function destroy(Certification $certification)
    {
        Gate::authorize('certificacion_eliminar');
        
        $certification->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}