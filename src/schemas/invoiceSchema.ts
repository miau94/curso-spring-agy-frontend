import { z } from 'zod';

export const invoiceItemSchema = z.object({
  id: z.number().optional(),
  description: z
    .string()
    .trim()
    .min(1, 'La descripción del concepto es obligatoria')
    .max(255, 'Máximo 255 caracteres'),
  quantity: z
    .number({ message: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1'),
  unitPrice: z
    .number({ message: 'El precio unitario debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  subtotal: z.number().optional(),
});

export const invoiceSchema = z.object({
  customerId: z
    .number({ message: 'Debes seleccionar un cliente' })
    .int()
    .positive('Debes seleccionar un cliente válido'),
  description: z
    .string()
    .trim()
    .min(1, 'La descripción de la factura es obligatoria')
    .max(255, 'La descripción no puede superar los 255 caracteres'),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'OVERDUE']),
  items: z
    .array(invoiceItemSchema)
    .min(1, 'La factura debe incluir al menos una línea de detalle'),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
