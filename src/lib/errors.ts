import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export enum ErrorCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  public code: ErrorCodes;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code: ErrorCodes = ErrorCodes.INTERNAL_ERROR, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: ErrorCodes | string;
  details?: any;
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('[API Error]:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error de validación en los datos enviados',
        code: ErrorCodes.VALIDATION_ERROR,
        details: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  const errMessage = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado';
  return NextResponse.json(
    {
      success: false,
      error: errMessage,
      code: ErrorCodes.INTERNAL_ERROR,
    },
    { status: 500 }
  );
}
