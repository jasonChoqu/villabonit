<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleLargeFileUploads
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Configurar parámetros de PHP para archivos grandes
        @ini_set('upload_max_filesize', '2048M');
        @ini_set('post_max_size', '2048M');
        @ini_set('max_execution_time', '900');
        @ini_set('max_input_time', '900');
        @ini_set('memory_limit', '1024M');
        @ini_set('max_file_uploads', '20');
        
        // Aumentar el límite de variables de entrada
        @ini_set('max_input_vars', '10000');
        @ini_set('max_input_nesting_level', '64');
        
        // Configuración adicional para archivos temporales
        @ini_set('upload_tmp_dir', storage_path('app/temp'));
        
        // Crear directorio temporal si no existe
        $tempDir = storage_path('app/temp');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        return $next($request);
    }
}