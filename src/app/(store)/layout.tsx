import BarraNavegacion from '@/components/BarraNavegacion';
import PieDePagina from '@/components/PieDePagina';
import BotonFlotanteWhatsApp from '@/components/common/BotonFlotanteWhatsApp';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BarraNavegacion />
      <main className="flex-grow">{children}</main>
      <PieDePagina />
      <BotonFlotanteWhatsApp />
    </div>
  );
}
