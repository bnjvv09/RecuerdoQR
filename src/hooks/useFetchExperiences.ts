'use client';

import { useState, useEffect, useCallback } from 'react';
import { getExperiences, Experience } from '@/lib/db';
import { toast } from 'sonner';

export function useFetchExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExperiences();
      setExperiences(data);
      return data;
    } catch (err: any) {
      const msg = err?.message || 'Error al obtener las experiencias';
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    setExperiences,
    loading,
    error,
    refreshExperiences: fetchExperiences,
  };
}
