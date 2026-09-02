import { z } from 'zod';

export const orderStatusEnum = z.enum(['pending', 'paid', 'shipped', 'completed', 'cancelled']);

export const orderStatusUpdateSchema = z.object({
  status: orderStatusEnum,
});

export const orderCreateSchema = z.object({
  product_id: z.string().min(1, 'El producto es requerido'),
  customer_name: z.string().min(2, 'El nombre del cliente debe tener al menos 2 caracteres'),
  customer_email: z.string().email('Email inválido'),
  customer_phone: z.string().optional().default(''),
  delivery_address: z.string().optional().default(''),
  total: z.number().nonnegative('El total no puede ser negativo'),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
