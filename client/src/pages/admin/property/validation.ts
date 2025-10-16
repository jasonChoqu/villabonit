import { z } from "zod";

export const storeSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(180, "El título no debe exceder 180 caracteres"),
  
  description: z
    .string()
    .optional(),
  
  property_type: z
    .enum([
      'house', 'apartment', 'penthouse', 'townhouse', 'duplex', 'triplex',
      'studio', 'loft', 'villa', 'bungalow', 'cottage', 'farmhouse',
      'condo', 'cabins', 'ranch', 'chalet', 'mansion', 'retirement_home',
      'studio_apartment', 'garden_house', 'attic', 'basement_flat',
      'mixed_use', 'mobile_home', 'tiny_house', 'other'
    ]),
  
  status: z
    .enum(['available', 'sold', 'reserved', 'rented', 'off_market']),
  
  price: z
    .coerce
    .number()
    .min(0, "El precio debe ser mayor a 0")
    .max(99999999.99, "El precio es demasiado alto"),
  
  currency: z
    .string()
    .length(3, "La moneda debe tener 3 caracteres"),
  
  area_m2: z
    .coerce
    .number()
    .min(0, "El área debe ser mayor a 0")
    .max(99999.99, "El área es demasiado grande")
    .optional(),
  
  bedrooms: z
    .coerce
    .number()
    .int()
    .min(0, "Las habitaciones deben ser mayor o igual a 0")
    .max(20, "Máximo 20 habitaciones")
    .optional(),
  
  bathrooms: z
    .coerce
    .number()
    .int()
    .min(0, "Los baños deben ser mayor o igual a 0")
    .max(20, "Máximo 20 baños")
    .optional(),
  
  parking: z
    .coerce
    .number()
    .int()
    .min(0, "Los espacios de parking deben ser mayor o igual a 0")
    .max(20, "Máximo 20 espacios de parking")
    .optional(),
  
  address: z
    .string()
    .max(255, "La dirección no debe exceder 255 caracteres")
    .optional(),
  
  city: z
    .string()
    .max(100, "La ciudad no debe exceder 100 caracteres")
    .optional(),
  
  state: z
    .string()
    .max(100, "El estado no debe exceder 100 caracteres")
    .optional(),
  
  zipcode: z
    .string()
    .max(20, "El código postal no debe exceder 20 caracteres")
    .optional(),
  
  lat: z
    .coerce
    .number()
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida")
    .optional(),
  
  lng: z
    .coerce
    .number()
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida")
    .optional(),
  
  built_year: z
    .coerce
    .number()
    .int()
    .min(1800, "Año muy antiguo")
    .max(new Date().getFullYear() + 5, "Año muy futuro")
    .optional(),
  
  floor: z
    .coerce
    .number()
    .int()
    .min(0, "El piso debe ser mayor o igual a 0")
    .max(200, "Máximo 200 pisos")
    .optional(),
  
  total_floors: z
    .coerce
    .number()
    .int()
    .min(1, "Debe tener al menos 1 piso")
    .max(200, "Máximo 200 pisos")
    .optional(),
  
  amenities: z
    .array(z.string())
    .optional(),
  
  agent_name: z
    .string()
    .max(120, "El nombre del agente no debe exceder 120 caracteres")
    .optional(),
  
  agent_phone: z
    .string()
    .max(50, "El teléfono del agente no debe exceder 50 caracteres")
    .optional(),
  
  agent_email: z
    .string()
    .email("Email inválido")
    .max(150, "El email del agente no debe exceder 150 caracteres")
    .optional(),
  
  is_featured: z
    .boolean()
    .optional(),
});

export const updateSchema = storeSchema.partial().extend({
  id: z.number().optional(),
});

export type PropertyFormData = z.infer<typeof storeSchema>;
export type PropertyUpdateFormData = z.infer<typeof updateSchema>;