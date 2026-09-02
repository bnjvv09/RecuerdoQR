'use client';

import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsyncData<T>(asyncFn: () => Promise<T>, immediate: boolean = true) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err: any) {
      const message = err?.message || 'Error al cargar los datos';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch: execute,
    setData: (data: T | null) => setState(prev => ({ ...prev, data })),
  };
}
