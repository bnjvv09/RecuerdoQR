// src/lib/sanitize.ts
import crypto from 'crypto';

const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'login',
  'logout',
  'checkout',
  'planes',
  'gracias',
  'ejemplos',
  'personalizar',
  'dashboard',
  'system',
  'root',
  'test',
  'public',
  'static',
  'amor',
  'recuerdo'
]);

/**
 * Sanitizes arbitrary user string input to eliminate XSS, scripts, event handlers and dangerous tags.
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .trim();
}

/**
 * Recursively sanitizes any object containing text fields.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  const result: any = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Sanitizes and validates slugs, preventing path traversal and reserved system route collision.
 */
export function sanitizeSlug(rawSlug: string | undefined | null): string {
  if (!rawSlug) return `amor-${Math.floor(1000 + Math.random() * 9000)}`;
  
  let clean = rawSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  if (!clean || RESERVED_SLUGS.has(clean)) {
    clean = `amor-${clean || 'recuerdo'}-${Math.floor(100 + Math.random() * 900)}`;
  }

  return clean;
}

/**
 * Securely hashes a secret PIN code using SHA-256 with salt.
 */
export function hashPin(pin: string): string {
  if (!pin) return '';
  return crypto.createHash('sha256').update(`recuerdoqr_salt_${pin.trim()}`).digest('hex');
}
