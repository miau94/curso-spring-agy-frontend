import { z } from 'zod';

/**
 * Esquema Zod sincronizado con las anotaciones Jakarta Validation de CustomerDto.java:
 * - firstName: @NotBlank, @Size(min = 2, max = 50)
 * - lastName: @NotBlank, @Size(min = 2, max = 50)
 * - email: @NotBlank, @Email
 * - phone, address: opcionales
 */
export const customerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener entre 2 y 50 caracteres')
    .max(50, 'El nombre debe tener entre 2 y 50 caracteres'),
  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener entre 2 y 50 caracteres')
    .max(50, 'El apellido debe tener entre 2 y 50 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El formato del correo electrónico no es válido'),
  phone: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
