import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'RecuerdoQR | Experiencias Románticas Personalizadas',
  description: 'Convierte tus recuerdos en una experiencia que nunca olvidará. Crea una página personalizada con fotos, música, vuestra historia de amor y un contador de tiempo accesible mediante un código QR.',
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
