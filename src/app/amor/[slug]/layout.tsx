import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: '❤️ Una sorpresa muy especial para ti | RecuerdoQR',
    description: 'Alguien que te ama te ha preparado un recuerdo inolvidable con música, fotos y mensajes. Toca para abrir ✨',
    openGraph: {
      title: '❤️ Una sorpresa muy especial para ti | RecuerdoQR',
      description: 'Alguien que te ama te ha preparado un recuerdo inolvidable con fotos y música ✨',
      url: 'https://recuerdoqr.cl/amor/' + slug,
      siteName: 'RecuerdoQR',
      locale: 'es_CL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '❤️ Una sorpresa muy especial para ti | RecuerdoQR',
      description: 'Alguien especial te ha preparado un recuerdo inolvidable ✨',
    },
  };
}

export default function AmorSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
