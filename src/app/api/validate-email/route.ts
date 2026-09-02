import { NextResponse } from 'next/server';
import dns from 'dns/promises';
import { checkRateLimit } from '@/lib/rateLimit';

// Lista de dominios de correos temporales/desechables conocidos
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'yopmail.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'trashmail.com',
  'dispostable.com',
  'getairmail.com',
  'throwawaymail.com',
  'mytemp.email',
  'fakeinbox.com',
  'temp-mail.org',
  'mohmal.com',
]);

// Errores tipograficos comunes en dominios populares
const TYPO_MAP: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'otmail.com': 'hotmail.com',
  'oulook.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'iclod.com': 'icloud.com',
  'icloud.co': 'icloud.com',
};

// Cache en memoria para resultados DNS
const domainMxCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const rateCheck = checkRateLimit('email-val-' + ip, 40, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ valid: true, rateLimited: true });
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ valid: false, error: 'Email requerido' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Validacion de formato estandar (RFC 5322 simplificado)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({
        valid: false,
        error: 'El formato del correo electrónico no es válido',
      });
    }

    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      return NextResponse.json({ valid: false, error: 'Correo no válido' });
    }

    const [user, domain] = parts;

    // 2. Verificar si es un dominio desechable
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return NextResponse.json({
        valid: false,
        error: 'No se permiten correos electrónicos temporales o desechables',
      });
    }

    // 3. Verificar si hay un error tipografico evidente
    let suggestion = '';
    if (TYPO_MAP[domain]) {
      suggestion = user + '@' + TYPO_MAP[domain];
    }

    // 4. Verificacion de existencia del dominio mediante registros MX
    const cached = domainMxCache.get(domain);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      if (!cached.valid) {
        return NextResponse.json({
          valid: false,
          error: 'El dominio "@' + domain + '" no existe o no puede recibir correos',
          suggestion,
        });
      }
      return NextResponse.json({ valid: true, suggestion });
    }

    try {
      const mxRecords = await dns.resolveMx(domain);
      const hasMx = Boolean(mxRecords && mxRecords.length > 0);

      domainMxCache.set(domain, { valid: hasMx, timestamp: Date.now() });

      if (!hasMx) {
        return NextResponse.json({
          valid: false,
          error: 'El dominio "@' + domain + '" no está configurado para recibir correos',
          suggestion,
        });
      }

      return NextResponse.json({ valid: true, suggestion });
    } catch (dnsErr: any) {
      if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA' || dnsErr.code === 'SERVFAIL') {
        domainMxCache.set(domain, { valid: false, timestamp: Date.now() });
        return NextResponse.json({
          valid: false,
          error: 'El dominio "@' + domain + '" no existe en internet',
          suggestion,
        });
      }

      return NextResponse.json({ valid: true, suggestion });
    }
  } catch (err: any) {
    console.error('Email validation error:', err);
    return NextResponse.json({ valid: true });
  }
}
