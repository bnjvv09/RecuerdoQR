import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://recuerdo-qr.vercel.app'),
  title: {
    default: 'RecuerdoQR ❤️ | El Regalo Más Romántico para tu Pareja',
    template: '%s | RecuerdoQR',
  },
  description: 'Transforma tus fotos, canción especial y carta en una experiencia digital inolvidable con contador de amor en vivo y código QR permanente. 🎁✨',
  keywords: [
    'recuerdo qr',
    'regalo de aniversario',
    'regalo para mi novia',
    'regalo para mi novio',
    'experiencia romantica digital',
    'tarjeta qr amor',
    'regalos personalizados chile'
  ],
  authors: [{ name: 'RecuerdoQR' }],
  creator: 'RecuerdoQR',
  publisher: 'RecuerdoQR',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://recuerdo-qr.vercel.app',
    siteName: 'RecuerdoQR',
    title: 'RecuerdoQR ❤️ | El Regalo Más Romántico para tu Pareja',
    description: 'Transforma tus fotos, canción especial y carta en una experiencia digital inolvidable con contador de amor en vivo y código QR permanente. 🎁✨',
    images: [
      {
        url: 'https://recuerdo-qr.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RecuerdoQR - Experiencias Románticas Personalizadas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RecuerdoQR ❤️ | El Regalo Más Romántico para tu Pareja',
    description: 'Transforma tus fotos, canción especial y carta en una experiencia digital inolvidable con contador de amor en vivo y código QR permanente. 🎁✨',
    images: ['https://recuerdo-qr.vercel.app/og-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#fffafb] text-gray-800">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
