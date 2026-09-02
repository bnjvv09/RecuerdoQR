'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrders, Order } from '@/lib/db';
import { toast } from 'sonner';

export function useFetchOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
      return data;
    } catch (err: any) {
      const msg = err?.message || 'Error al obtener los pedidos';
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    setOrders,
    loading,
    error,
    refreshOrders: fetchOrders,
  };
}
