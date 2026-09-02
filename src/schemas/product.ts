import { z } from 'zod';

export const priceUpdateSchema = z.object({
  price: z.number().positive('El precio debe ser mayor a 0').int('El precio debe ser un número entero'),
});

export type PriceUpdateInput = z.infer<typeof priceUpdateSchema>;
