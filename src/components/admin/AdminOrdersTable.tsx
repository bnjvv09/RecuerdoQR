'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdminStore } from '@/lib/store';
import { Order, Experience } from '@/lib/db';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  ExternalLink, 
  Truck, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit3,
  MessageCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface AdminOrdersTableProps {
  onOpenPrintableModal: (data: { partnerName: string; userName: string; message?: string; qrDataUrl: string; date?: string; slug?: string; theme?: string }) => void;
  onEditExperience?: (exp: Experience) => void;
}

export default function AdminOrdersTable({ onOpenPrintableModal, onEditExperience }: AdminOrdersTableProps) {
  const {
    orders,
    experiences,
    selectedOrder,
    setSelectedOrder,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    updateOrderStatusLocal,
  } = useAdminStore();

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Associated experience
  const selectedExp = selectedOrder
    ? experiences.find((e) => e.order_id === selectedOrder.id)
    : null;

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado del pedido a "${newStatus}"?`)) {
      return;
    }

    setUpdatingOrderId(orderId);
    const toastId = toast.loading('Actualizando estado del pedido...');

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al actualizar el estado');
      }

      updateOrderStatusLocal(orderId, newStatus);
      toast.dismiss(toastId);
      toast.success(`Pedido actualizado a "${newStatus}"`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || 'Error al actualizar pedido');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDownloadQr = async (slug: string) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://recuerdoqr.cl';
      const liveUrl = `${origin}/amor/${slug}`;
      const qrDataUrl = await QRCode.toDataURL(liveUrl, { width: 600, margin: 2 });
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-${slug}.png`;
      link.click();
      toast.success('QR descargado');
    } catch (err) {
      toast.error('Error al generar QR');
    }
  };

  const handleClearTestOrders = async () => {
    if (!window.confirm('¿Estás seguro de vaciar todos los pedidos de prueba? La tabla quedará en $0 CLP lista para tus clientes reales.')) {
      return;
    }

    const toastId = toast.loading('Limpiando pedidos de prueba...');
    try {
      await fetch('/api/admin/clear-test-orders', { method: 'POST' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('amor_qr_orders');
      }
      useAdminStore.getState().setOrders([]);
      setSelectedOrder(null);
      toast.dismiss(toastId);
      toast.success('¡Pedidos de prueba eliminados! Tu tienda está en 0.');
    } catch {
      toast.dismiss(toastId);
      toast.error('Error al limpiar pedidos de prueba');
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por cliente, correo o ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#a21232]"
          />
        </div>

        {/* Status Filters & Reset Button */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'pending', label: 'Pendientes' },
              { id: 'paid', label: 'Pagados' },
              { id: 'shipped', label: 'Enviados' },
              { id: 'completed', label: 'Completados' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setStatusFilter(f.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-[#a21232] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearTestOrders}
              className="px-3 py-1 rounded-xl text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              title="Borrar pedidos de prueba"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpiar Pruebas</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Table + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                      No se encontraron pedidos.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((o) => {
                    const isSelected = selectedOrder?.id === o.id;
                    return (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className={`cursor-pointer transition hover:bg-rose-50/20 ${
                          isSelected ? 'bg-rose-50/40 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <p className="font-bold text-gray-900">{o.customer_name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{o.customer_email}</p>
                        </td>
                        <td className="p-3.5 font-bold text-gray-900">
                          ${Number(o.total).toLocaleString('es-CL')} CLP
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              o.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : o.status === 'completed'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[10px] text-gray-400 font-mono">
                          {new Date(o.created_at).toLocaleDateString('es-CL')}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(o);
                            }}
                            className="p-1 text-gray-500 hover:text-[#a21232]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-500">
                Página {currentPage} de {totalPages} ({filteredOrders.length} pedidos)
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg border border-gray-250 bg-white text-gray-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg border border-gray-250 bg-white text-gray-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Sidebar */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
          {selectedOrder ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-sm text-gray-900">
                  Detalle del Pedido
                </h3>
                <span className="text-[9px] font-mono text-gray-400 truncate max-w-[120px]">
                  {selectedOrder.id}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Cliente</span>
                  <p className="font-bold text-gray-800">{selectedOrder.customer_name}</p>
                  <p className="text-gray-500 font-mono text-[11px]">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-gray-500 font-mono text-[11px]">{selectedOrder.customer_phone}</p>
                  )}
                </div>

                {selectedOrder.delivery_address && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Dirección de Despacho</span>
                    <p className="text-gray-700 italic text-[11px] bg-gray-50 p-2 rounded-lg border border-gray-150">
                      {selectedOrder.delivery_address}
                    </p>
                  </div>
                )}

                {selectedExp && (
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Pareja & Experiencia</span>
                      <p className="font-serif font-bold text-sm text-rose-700">
                        {selectedExp.partner_name} & {selectedExp.user_name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">/amor/{selectedExp.slug}</p>
                    </div>

                    {/* Photos Mini Strip */}
                    {selectedExp.photos && selectedExp.photos.length > 0 && (
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">
                          Fotos ({selectedExp.photos.length})
                        </span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {selectedExp.photos.map((p, pIdx) => (
                            <div key={pIdx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                              <Image
                                src={p.url}
                                alt="Foto"
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <a
                          href={`/amor/${selectedExp.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 bg-white border border-gray-250 hover:bg-rose-50 text-[#a21232] font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver Online</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDownloadQr(selectedExp.slug)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                          title="Descargar QR"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://recuerdoqr.cl';
                          const liveUrl = `${origin}/amor/${selectedExp.slug}`;
                          const qrDataUrl = await QRCode.toDataURL(liveUrl, { width: 600, margin: 2, color: { dark: '#a21232', light: '#ffffff' } });
                          onOpenPrintableModal({
                            partnerName: selectedExp.partner_name,
                            userName: selectedExp.user_name,
                            message: selectedExp.message,
                            qrDataUrl,
                            date: selectedExp.special_date,
                            slug: selectedExp.slug,
                            theme: selectedExp.theme,
                          });
                        }}
                        className="w-full py-2.5 bg-rose-50 border border-rose-200 text-[#a21232] font-bold rounded-xl text-xs hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
                      >
                        <span>🎁</span>
                        <span>Imprimir Tarjeta Postal de Regalo</span>
                      </button>

                      {/* Edit Experience Button */}
                      {onEditExperience && selectedExp && (
                        <button
                          type="button"
                          onClick={() => onEditExperience(selectedExp)}
                          className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Editar Contenido de esta Experiencia</span>
                        </button>
                      )}

                      {/* Send via WhatsApp Button */}
                      {selectedOrder.customer_phone && (
                        <a
                          href={`https://wa.me/${selectedOrder.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${selectedOrder.customer_name}! ❤️ Tu Recuerdo QR ya está listo. Puedes ver tu página en vivo aquí: https://recuerdoqr.cl/amor/${selectedExp.slug} ¡Esperamos que les encante!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Enviar Enlace por WhatsApp</span>
                        </a>
                      )}

                      {/* Status Change Controls */}
                      {selectedOrder.status !== 'shipped' && selectedOrder.status !== 'completed' && (
                        <button
                          type="button"
                          disabled={updatingOrderId === selectedOrder.id}
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                          className="w-full py-2.5 bg-[#a21232] hover:bg-[#880e28] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Marcar como Enviado</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 italic">
              Selecciona un pedido de la lista para ver sus detalles.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
