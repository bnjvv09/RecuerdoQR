import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuerdoqr.cl';
  const now = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/personalizar`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ejemplos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/amor/ejemplo-digital`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/amor/ejemplo-premium`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // 12 ejemplos de temáticas
    ...[
      'ejemplo-aniversario',
      'ejemplo-cumpleanos',
      'ejemplo-propuesta-noviazgo',
      'ejemplo-propuesta-matrimonio',
      'ejemplo-confesion-amor',
      'ejemplo-carta-amor',
      'ejemplo-sorpresa',
      'ejemplo-san-valentin',
      'ejemplo-embarazo',
      'ejemplo-especial',
      'ejemplo-gratitud',
      'ejemplo-reconciliacion',
    ].map(slug => ({
      url: `${baseUrl}/amor/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
