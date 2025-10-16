import { z } from 'zod';

export const VideoContentStoreSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'El título es requerido' })
    .max(255, { message: 'El título no puede exceder 255 caracteres' }),
  description: z
    .string()
    .min(1, { message: 'La descripción es requerida' }),
  video_url: z
    .string()
    .min(1, { message: 'La URL del video es requerida' })
    .url({ message: 'Debe ser una URL válida' })
    .refine(
      (url) => {
        // Validar que sea una URL de YouTube
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
      },
      { message: 'Debe ser una URL válida de YouTube' }
    ),
  is_active: z.boolean().optional(),
  order: z
    .number()
    .min(1, { message: 'El orden debe ser mayor a 0' })
    .optional(),
});

export const VideoContentUpdateSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'El título es requerido' })
    .max(255, { message: 'El título no puede exceder 255 caracteres' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'La descripción es requerida' })
    .optional(),
  video_url: z
    .string()
    .min(1, { message: 'La URL del video es requerida' })
    .url({ message: 'Debe ser una URL válida' })
    .refine(
      (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
      },
      { message: 'Debe ser una URL válida de YouTube' }
    )
    .optional(),
  is_active: z.boolean().optional(),
  order: z
    .number()
    .min(1, { message: 'El orden debe ser mayor a 0' })
    .optional(),
});