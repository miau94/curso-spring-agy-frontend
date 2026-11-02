import type { z } from 'zod';
import type { FieldErrors } from '../types/api';

/**
 * Convierte un ZodError en un mapa plano { campo: mensaje } compatible con FieldErrors
 * para mostrar tanto errores de Zod (frontend) como errores @Valid (backend) en los mismos inputs.
 */
export function extractZodFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName === 'string' && !fieldErrors[fieldName]) {
      fieldErrors[fieldName] = issue.message;
    }
  }
  return fieldErrors;
}
