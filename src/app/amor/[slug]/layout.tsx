import type { Metadata } from 'next';
import { getExperienceBySlug } from '@/lib/db';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exp = await getExperienceBySlug(params.slug);
  const partnerName = exp?.partner_name || 'Mi Amor';
  const userName = exp?.user_name || 'Tu Pareja';

  const title = `Nuestra Historia de Amor ❤️ | ${partnerName} & ${userName}`;
  const description = 'Un regalo especial preparado con todo mi amor para ti... Toca para abrir nuestro recuerdo digital interactivo 🎁✨';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://recuerdo-qr.vercel.app/amor/${params.slug}`,
      siteName: 'RecuerdoQR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function AmorSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
