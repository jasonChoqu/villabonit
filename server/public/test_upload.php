<?php
// Script de prueba para verificar configuración de upload
echo "<h2>Configuración de Upload PHP</h2>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>Configuración</th><th>Valor</th></tr>";

$configs = [
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'max_execution_time' => ini_get('max_execution_time'),
    'max_input_time' => ini_get('max_input_time'),
    'memory_limit' => ini_get('memory_limit'),
    'file_uploads' => ini_get('file_uploads') ? 'Habilitado' : 'Deshabilitado',
    'max_file_uploads' => ini_get('max_file_uploads'),
];

foreach ($configs as $key => $value) {
    echo "<tr><td>{$key}</td><td>{$value}</td></tr>";
}
echo "</table>";

echo "<h3>Conversión a MB:</h3>";
function bytes_to_mb($bytes) {
    if (is_numeric($bytes)) {
        return round($bytes / (1024 * 1024), 2) . ' MB';
    }
    
    $value = (int) $bytes;
    $unit = strtoupper(substr($bytes, -1));
    
    switch ($unit) {
        case 'G': return ($value * 1024) . ' MB';
        case 'M': return $value . ' MB';
        case 'K': return round($value / 1024, 2) . ' MB';
        default: return round($value / (1024 * 1024), 2) . ' MB';
    }
}

echo "<p>upload_max_filesize: " . bytes_to_mb(ini_get('upload_max_filesize')) . "</p>";
echo "<p>post_max_size: " . bytes_to_mb(ini_get('post_max_size')) . "</p>";

echo "<h3>Directorio de trabajo actual:</h3>";
echo "<p>" . getcwd() . "</p>";

echo "<h3>Permisos de directorio public/assets/resources:</h3>";
$dir = __DIR__ . '/assets/resources';
if (is_dir($dir)) {
    echo "<p>✅ Directorio existe: {$dir}</p>";
    echo "<p>✅ Es escribible: " . (is_writable($dir) ? 'Sí' : 'No') . "</p>";
} else {
    echo "<p>❌ Directorio no existe: {$dir}</p>";
}
?>