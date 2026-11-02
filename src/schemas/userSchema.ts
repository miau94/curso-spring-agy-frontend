import { z } from 'zod';

/**
 * Esquema Zod sincronizado con UserRequestDto.java:
 * - email: @NotBlank, @Email
 * - password: @NotBlank, @Size(min = 6)
 * - role: 'USER' | 'ADMIN'
 */
export const userRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El formato del correo electrónico no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['USER', 'ADMIN']),
});

export type UserFormValues = z.infer<typeof userRequestSchema>;
