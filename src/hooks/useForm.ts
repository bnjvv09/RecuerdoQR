'use client';

import { useState } from 'react';
import { ZodSchema, ZodError } from 'zod';

export function useForm<T extends Record<string, any>>(initialValues: T, schema?: ZodSchema<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    if (!schema) return true;
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        err.issues.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0] as keyof T] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    validate,
    reset,
    isSubmitting,
    setIsSubmitting,
  };
}
