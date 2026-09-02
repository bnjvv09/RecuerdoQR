import { z } from 'zod';

export const orderStatusEnum = z.enum(['pending', 'paid', 'shipped', 'completed', 'cancelled']);

export const orderStatusUpdateSchema = z.object({
  status: orderStatusEnum,
});

// Regex para teléfono chileno móvil (+569XXXXXXXX o 9XXXXXXXX)
const chileanPhoneRegex = /^(\+?56\s?)?9\d{8}$/;

export const orderCreateSchema = z.object({
  product_id: z.string().min(1, 'El producto es requerido'),
  customer_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'Nombre demasiado largo'),
  customer_email: z.string().email('Ingresa un correo electrónico válido'),
  customer_phone: z
    .string()
    .min(8, 'El teléfono es requerido')
    .refine((val) => {
      const clean = val.replace(/\s+/g, '');
      return chileanPhoneRegex.test(clean);
    }, 'Ingresa un número chileno válido (+56 9 XXXX XXXX)'),
  delivery_address: z.string().optional().default(''),
  total: z.number().nonnegative('El total no puede ser negativo'),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
