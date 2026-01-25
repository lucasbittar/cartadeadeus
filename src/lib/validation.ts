import { z } from 'zod';

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
  is_anonymous: z.boolean(),
  lat: z
    .number()
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida'),
  lng: z
    .number()
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida'),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(255, 'Nome da cidade muito longo')
    .transform((val) => val.trim()),
});

export type ValidatedLetterInput = z.infer<typeof letterInputSchema>;

// Helper to format Zod errors into a user-friendly message
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(', ');
}
