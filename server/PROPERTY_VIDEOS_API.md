# 🎥 API de Videos de Propiedades - Villa Bonita

Esta documentación describe cómo usar las APIs para manejar videos de YouTube asociados a propiedades inmobiliarias.

## 📋 Endpoints Disponibles

### 1. 📄 **Obtener todos los videos de una propiedad**
```http
GET /api/v1/properties/{propertyId}/videos
```

**Parámetros de consulta opcionales:**
- `type`: Filtrar por tipo de video (tour_virtual, exterior, interior, etc.)
- `featured`: Solo videos destacados (true/false)

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 2,
      "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "youtube_video_id": "dQw4w9WgXcQ",
      "title": "Tour Virtual Completo - Casa Moderna",
      "description": "Recorrido completo por toda la propiedad...",
      "video_type": "tour_virtual",
      "sort_order": 1,
      "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "is_featured": true,
      "is_active": true,
      "embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "youtube_thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "created_at": "2025-10-16T14:11:40.000000Z",
      "updated_at": "2025-10-16T14:11:40.000000Z"
    }
  ]
}
```

### 2. ➕ **Agregar video a una propiedad**
```http
POST /api/v1/properties/{propertyId}/videos
```

**Headers requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body de ejemplo:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "title": "Tour de la Cocina",
  "description": "Vista detallada de la cocina moderna",
  "video_type": "interior",
  "sort_order": 5,
  "is_featured": false,
  "allow_autoplay": false,
  "show_controls": true,
  "show_info": true
}
```

### 3. 👁️ **Ver video específico**
```http
GET /api/v1/properties/{propertyId}/videos/{videoId}
```

### 4. ✏️ **Actualizar video**
```http
PUT /api/v1/properties/{propertyId}/videos/{videoId}
```

**Body de ejemplo:**
```json
{
  "title": "Nuevo título del video",
  "is_featured": true,
  "is_active": true
}
```

### 5. 🗑️ **Eliminar video**
```http
DELETE /api/v1/properties/{propertyId}/videos/{videoId}
```

### 6. 🔄 **Reordenar videos**
```http
PUT /api/v1/properties/{propertyId}/videos/reorder
```

**Body de ejemplo:**
```json
{
  "videos": [
    {"id": 1, "sort_order": 1},
    {"id": 2, "sort_order": 2},
    {"id": 3, "sort_order": 3}
  ]
}
```

## 🏠 **Obtener propiedad con videos incluidos**

### Endpoint mejorado para mostrar propiedad con videos:
```http
GET /api/v1/properties/{id}?include_videos=true
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Casa Moderna con Vista al Mar",
    "description": "Hermosa casa moderna con vista panorámica al mar...",
    "property_type": "house",
    "status": "available",
    "price": "350000.00",
    "currency": "USD",
    "area_m2": "250.00",
    "bedrooms": 4,
    "bathrooms": 3,
    "parking": 2,
    "address": "Av. Costanera 123",
    "city": "Villa Bonita",
    "views_count": 1,
    "is_featured": true,
    "images": [...],
    "active_videos": [
      {
        "id": 1,
        "title": "Tour Virtual Completo - Casa Moderna",
        "video_type": "tour_virtual",
        "youtube_video_id": "dQw4w9WgXcQ",
        "embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "youtube_thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "is_featured": true,
        "sort_order": 1
      },
      {
        "id": 2,
        "title": "Vista Exterior y Jardín",
        "video_type": "exterior",
        "youtube_video_id": "9bZkp7q19f0",
        "embed_url": "https://www.youtube.com/embed/9bZkp7q19f0",
        "youtube_thumbnail": "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
        "is_featured": false,
        "sort_order": 2
      }
    ]
  },
  "message": "Propiedad obtenida exitosamente"
}
```

### Listar propiedades con videos incluidos:
```http
GET /api/v1/properties?include_videos=true&per_page=10
```

## 🎯 **Tipos de Video Disponibles**

- `tour_virtual`: Tour virtual completo
- `exterior`: Vista exterior de la propiedad
- `interior`: Vista interior de habitaciones
- `neighborhood`: Zona y vecindario
- `amenities`: Comodidades y servicios
- `promotional`: Video promocional
- `construction`: Proceso de construcción
- `testimonial`: Testimoniales de clientes
- `other`: Otros tipos

## 💡 **Ejemplos de Uso con JavaScript**

### Obtener todos los videos de una propiedad:
```javascript
const response = await fetch('/api/v1/properties/2/videos', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});
const data = await response.json();
console.log('Videos:', data.data);
```

### Agregar un nuevo video:
```javascript
const videoData = {
  youtube_url: 'https://www.youtube.com/watch?v=VIDEO_ID',
  title: 'Nuevo Video',
  video_type: 'interior',
  is_featured: false
};

const response = await fetch('/api/v1/properties/2/videos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(videoData)
});

const result = await response.json();
console.log('Video agregado:', result.data);
```

### Mostrar video en iframe:
```html
<!-- Usar el embed_url del response -->
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

## 🚀 **Características Adicionales**

- ✅ **Extracción automática** del video ID de YouTube
- ✅ **Thumbnails automáticos** de YouTube
- ✅ **URLs de embed** generadas automáticamente
- ✅ **Sistema de ordenamiento** (sort_order)
- ✅ **Videos destacados** (is_featured)
- ✅ **Control de visibilidad** (is_active)
- ✅ **Configuración de embed** (autoplay, controls, etc.)
- ✅ **Validación de URLs** de YouTube
- ✅ **Relaciones optimizadas** con Eloquent

## 🔧 **Datos de Prueba**

Se ha creado una propiedad de ejemplo con ID `2` que incluye 4 videos:
1. Tour Virtual Completo (destacado)
2. Vista Exterior y Jardín
3. Cocina y Áreas Sociales
4. Zona y Vecindario

Puedes usar esta propiedad para probar todos los endpoints de la API.

## 📱 **Integración Frontend**

Para integrar en tu frontend, puedes:

1. **Cargar videos al mostrar una propiedad**
2. **Crear componente de reproductor de video**
3. **Implementar galería de videos**
4. **Agregar controles de administración**
5. **Validar URLs de YouTube antes de enviar**

¡Listo para usar! 🎉