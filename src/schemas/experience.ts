import { z } from 'zod';

export const photoItemSchema = z.object({
  url: z.string().min(1, 'La URL de la foto es requerida'),
  caption: z.string().optional().default(''),
});

export const milestoneItemSchema = z.object({
  title: z.string().min(1, 'El título del hito es requerido'),
  date: z.string().min(1, 'La fecha del hito es requerida'),
  description: z.string().optional().default(''),
  image_url: z.string().optional().default(''),
});

export const experienceCreateSchema = z.object({
  customerName: z.string().optional().default(''),
  customerPhone: z.string().optional().default(''),
  customerEmail: z.string().optional().default(''),
  productId: z.string().optional().default('basic'),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  partnerName: z.string().min(1, 'El nombre de la pareja es requerido'),
  userName: z.string().min(1, 'El nombre de quien regala es requerido'),
  specialDate: z.string().min(1, 'La fecha especial es requerida'),
  message: z.string().optional().default(''),
  historyText: z.string().optional().default(''),
  songUrl: z.string().optional().default(''),
  themeId: z.string().optional().default('anniversary'),
  customFont: z.string().optional().default('great-vibes'),
  customColors: z.object({
    primary: z.string().optional().default('#a21232'),
    bg: z.string().optional().default('#fffcfd'),
    text: z.string().optional().default('#111827'),
  }).optional(),
  photoStyle: z.string().optional().default('polaroid'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres'),
  sections: z.array(z.any()).optional().default([]),
  photos: z.array(photoItemSchema).optional().default([]),
  milestones: z.array(milestoneItemSchema).optional().default([]),
  extraConfig: z.record(z.string(), z.any()).optional().default({}),
});

export type ExperienceCreateInput = z.infer<typeof experienceCreateSchema>;
