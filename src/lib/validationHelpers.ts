// src/lib/validationHelpers.ts

// Lista negra de dominios de prueba, falsos y desechables
export const FAKE_EMAIL_DOMAINS = new Set([
  'test.com', 'testing.com', 'asdf.com', 'asdfgh.com', 'fake.com', 'prueba.com', 
  'pruebas.com', 'ejemplo.com', 'example.com', 'example.org', 'example.net',
  'correo.com', 'mail.com', 'demo.com', 'sample.com', 'temp.com', '123.com', 
  'abc.com', 'xyz.com', 'none.com', 'noemail.com', 'null.com', 'email.com', 
  'nada.com', 'asdasd.com', 'qwerty.com', 'foo.com', 'bar.com', 'baz.com',
  'a.com', 'b.com', 'c.com', 'd.com', 'e.com', 'f.com', 'g.com',
  'mailinator.com', 'yopmail.com', 'tempmail.com', '10minutemail.com', 
  'guerrillamail.com', 'sharklasers.com', 'trashmail.com', 'dispostable.com',
  'getairmail.com', 'throwawaymail.com', 'mytemp.email', 'fakeinbox.com', 
  'temp-mail.org', 'mohmal.com'
]);

// Nombres de usuario falsos o de prueba comunes
export const FAKE_EMAIL_USERS = new Set([
  'test', 'testing', 'asdf', 'asdfgh', 'asdfghjkl', 'prueba', 'pruebas', 
  'demo', 'fake', 'qwerty', '123', '1234', '12345', '123456', '12345678',
  'admin', 'user', 'usuario', 'ejemplo', 'aaa', 'aaaa', 'aaaaa', 'abc', 
  'xyz', 'hola', 'nadie', 'anonimo', 'correo', 'email', 'algo', 'alguien'
]);

// Números de teléfono falsos o secuencias obvias
export const FAKE_PHONE_PATTERNS = [
  '12345678', '87654321', '01234567', '76543210', '00000000', '11111111', 
  '22222222', '33333333', '44444444', '55555555', '66666666', '77777777', 
  '88888888', '99999999', '12121212', '12312312', '98765432', '23456789'
];

/**
 * Valida si un número de teléfono chileno (los 8 dígitos tras el +56 9) es real y válido
 */
export function validateChileanPhone(digitsStr: string): { valid: boolean; error?: string } {
  const clean = digitsStr.replace(/\D/g, '');

  if (!clean) {
    return { valid: false, error: 'El número de teléfono es obligatorio' };
  }

  if (clean.length < 8) {
    return { valid: false, error: 'Faltan ' + (8 - clean.length) + ' dígitos (deben ser 8 dígitos tras el +56 9)' };
  }

  if (clean.length > 8) {
    return { valid: false, error: 'El número no puede tener más de 8 dígitos' };
  }

  // Detectar números secuenciales o repetidos
  if (FAKE_PHONE_PATTERNS.includes(clean)) {
    return { valid: false, error: 'Ingresa un número de teléfono real (no se permiten números secuenciales o repetidos)' };
  }

  // Verificar que todos los dígitos no sean iguales (ej: 00000000)
  if (/^(\d)\1{7}$/.test(clean)) {
    return { valid: false, error: 'Ingresa un número de teléfono real' };
  }

  // En Chile los celulares tras el 9 no empiezan con 0 ni con 1
  const firstDigit = clean[0];
  if (firstDigit === '0' || firstDigit === '1') {
    return { valid: false, error: 'El número móvil chileno no puede comenzar con 0 o 1 tras el +56 9' };
  }

  return { valid: true };
}

/**
 * Valida si un correo electrónico tiene formato y dominio legítimo no falso
 */
export function validateEmailSyntaxAndDomain(emailStr: string): { valid: boolean; error?: string } {
  const email = emailStr.trim().toLowerCase();

  if (!email) {
    return { valid: false, error: 'El correo electrónico es obligatorio' };
  }

  if (!email.includes('@')) {
    return { valid: false, error: "Falta el símbolo '@' en el correo (ej. nombre@gmail.com)" };
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, error: 'El formato del correo es inválido. Debe ser usuario@proveedor.com' };
  }

  const [user, domain] = parts;

  if (user.length < 2) {
    return { valid: false, error: 'El nombre antes del @ es demasiado corto' };
  }

  if (FAKE_EMAIL_USERS.has(user) || /^([a-z])\1{4,}$/.test(user)) {
    return { valid: false, error: 'Ingresa un correo real con tu nombre (no se permiten correos de prueba o spam)' };
  }

  if (FAKE_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, error: 'El dominio "@' + domain + '" es de prueba. Usa un correo real (Gmail, Hotmail, Outlook, .cl, etc.).' };
  }

  if (!domain.includes('.')) {
    return { valid: false, error: 'Al dominio le falta la extensión .com o .cl (ej. @gmail.com, @hotmail.com, @outlook.com)' };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return { valid: false, error: 'El correo debe terminar en .com, .cl, .net, etc. (ej. @gmail.com)' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Formato de correo no válido. Usa un correo estándar (ej. nombre@gmail.com)' };
  }

  return { valid: true };
}
