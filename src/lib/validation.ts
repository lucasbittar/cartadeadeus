import { z } from 'zod';
import { roundCoordinate } from '@/lib/utils';

// Letter input validation schema
export const letterInputSchema = z.object({
  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(280, 'Conteúdo deve ter no máximo 280 caracteres')
    .transform((val) => val.trim()),
  author: z
    .string()
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .nullable()
    .optional()
    .transform((val) => val?.trim() || null),
  email: z
    .string()
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .email('Email inválido')
    .nullable()
    .optional()
    .transform((val) => val?.trim() || null),
  is_anonymous: z.boolean(),
  lat: z
    .number()
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida')
    .transform((v) => roundCoordinate(v)),
  lng: z
    .number()
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida')
    .transform((v) => roundCoordinate(v)),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(255, 'Nome da cidade muito longo')
    .transform((val) => val.trim()),
});

export type ValidatedLetterInput = z.infer<typeof letterInputSchema>;

// Tour date input validation schema (admin)
export const tourDateInputSchema = z.object({
  event_date: z.string().min(1, 'Data é obrigatória'),
  venue: z
    .string()
    .min(1, 'Casa de show é obrigatória')
    .max(255, 'Nome muito longo')
    .transform((v) => v.trim()),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(255, 'Nome da cidade muito longo')
    .transform((v) => v.trim()),
  ticket_url: z
    .union([z.string().url('Link de ingressos inválido'), z.literal(''), z.null()])
    .optional()
    .transform((v) => v || null),
  status: z.enum(['on_sale', 'sold_out', 'cancelled', 'free']),
});

export type ValidatedTourDateInput = z.infer<typeof tourDateInputSchema>;

// Video input validation schema (admin) — only the URL is user-supplied
export const videoInputSchema = z.object({
  youtube_url: z.string().url('Link do YouTube inválido'),
});

// Video update schema (admin) — title and/or ordering
export const videoUpdateSchema = z.object({
  title: z.string().max(255, 'Título muito longo').nullable().optional(),
  sort_order: z.number().int().optional(),
});

// Tweet input schema (admin) — only the URL is user-supplied
export const tweetInputSchema = z.object({
  tweet_url: z.string().url('Link do tweet inválido'),
});

// Tweet update schema (admin) — only ordering
export const tweetUpdateSchema = z.object({
  sort_order: z.number().int().optional(),
});

// Helper to format Zod errors into a user-friendly message
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(', ');
}
