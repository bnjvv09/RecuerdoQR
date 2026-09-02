import { supabase, isMockMode } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  subtitle?: string;
  badge?: string;
  features: string[];
}

export interface SiteSettings {
  id?: string;
  support_email: string;
  support_phone: string;
  support_address: string;
  faq_content?: string;
  terms_content?: string;
  privacy_content?: string;
  guarantee_content?: string;
  instagram_url?: string;
  tiktok_url?: string;
  whatsapp_url?: string;
}

export interface Order {
  id: string;
  product_id: string;
  status: 'pending' | 'paid' | 'in_preparation' | 'ready' | 'shipped' | 'completed';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address?: string;
  total: number;
  payment_id?: string;
  created_at: string;
  product?: Product;
}

export interface Photo {
  id: string;
  experience_id: string;
  url: string;
  caption?: string;
  order_index: number;
}

export interface Milestone {
  id: string;
  experience_id: string;
  title: string;
  date: string;
  description: string;
  image_url?: string;
  order_index: number;
}

export interface ExperienceSection {
  id: string;
  type: 'portada' | 'carta' | 'galeria' | 'timeline' | 'musica' | 'video' | 'audio' | 'tematica' | 'pregunta' | 'contador' | 'secreto' | 'sorpresa' | 'lugar' | 'corazones';
  title?: string;
  content: any;
}

export interface Experience {
  id: string;
  order_id?: string;
  slug: string;
  title: string;
  partner_name: string;
  user_name: string;
  special_date: string;
  message: string;
  history_text: string;
  song_url?: string;
  theme?: string;
  config?: any;
  created_at: string;
  photos?: Photo[];
  milestones?: Milestone[];
  sections?: ExperienceSection[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  config: any;
  created_at?: string;
}

// Default static products to seed or use in mock mode
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 4990,
    subtitle: 'Página web personalizada con hasta 10 fotos, contador de tiempo y tarjeta digital temática.',
    description: 'Página web personalizada con hasta 10 fotos, contador de tiempo y tarjeta digital temática.',
    features: [
      'Página web interactiva',
      'Hasta 10 Fotos en HD',
      'Contador de tiempo en vivo',
      'Dedicatoria final con corazón',
      'Tarjeta de Regalo Digital Temática',
      'Código QR Digital HD'
    ]
  },
  {
    id: 'medium',
    name: 'Plan Medio',
    price: 5990,
    badge: 'Más Popular',
    subtitle: 'Nuestra opción más popular. Desbloquea el catálogo de 145 personajes temáticos para tu tarjeta, añade hasta 20 fotos, música de fondo (YouTube) y carta interactiva.',
    description: 'Nuestra opción más popular. Desbloquea el catálogo de 145 personajes temáticos para tu tarjeta, añade hasta 20 fotos, música de fondo (YouTube) y carta interactiva.',
    features: [
      'Todo lo del Plan Básico',
      '✨ Tarjeta con 145 Personajes Temáticos',
      'Hasta 20 Fotos en HD',
      'Música de fondo personalizada (YouTube)',
      '6 Estilos de galería (Polaroid, Carrete)',
      'Carta de amor interactiva'
    ]
  },
  {
    id: 'premium',
    name: 'Plan Máximo',
    price: 7990,
    subtitle: 'La experiencia completa sin límites: hasta 30 fotos, video dedicado, línea de tiempo de hitos y todos los widgets.',
    description: 'La experiencia completa sin límites: hasta 30 fotos, video dedicado, línea de tiempo de hitos y todos los widgets.',
    features: [
      'Todo lo del Plan Medio (incluye 145 personajes)',
      'Hasta 30 Fotos en HD',
      'Video de YouTube dedicado',
      'Línea de tiempo con fotos de hitos',
      'Rincón secreto con PIN, Propuesta y Mapa'
    ]
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  support_email: 'soporte@recuerdoqr.cl',
  support_phone: '+56 9 1234 5678',
  support_address: 'Santiago, Región Metropolitana, Chile',
  faq_content: `### ¿Cómo funciona el código QR?
Al realizar tu pedido recibirás inmediatamente tu código QR en alta calidad y una tarjeta digital lista para imprimir o regalar. Al escanearlo con cualquier celular, se abrirá al instante tu experiencia interactiva personalizada sin necesidad de instalar ninguna aplicación.

### ¿Cuánto tiempo dura la página web?
El acceso es permanente de por vida. Tu página estará alojada en servidores de alta disponibilidad y protegida para siempre.

### ¿Puedo editar las fotos o mensajes después de pagar?
¡Sí! Puedes contactar a nuestro equipo de soporte con tu número de orden y te ayudaremos a actualizar cualquier detalle.`,
  terms_content: `### Términos del Servicio
Al adquirir una experiencia en RecuerdoQR, adquieres una licencia de uso permanente para tu experiencia digital interactiva personalizada. 
Nos comprometemos a mantener el servicio activo 24/7 con disponibilidad garantizada.`,
  privacy_content: `### Políticas de Privacidad
Tus fotos, audios, videos y dedicatorias son 100% privadas y seguras. No compartimos tus recuerdos con terceros. Puedes proteger tu experiencia con contraseña o PIN secreto.`,
  guarantee_content: `### Garantía de Amor 100%
Si por alguna razón tu experiencia digital no te enamora al 100% o tienes cualquier inconveniente técnico, nuestro equipo de soporte te atenderá de inmediato para resolverlo o reembolsarte.`,
  whatsapp_url: 'https://wa.me/56912345678',
  instagram_url: 'https://instagram.com',
  tiktok_url: 'https://tiktok.com',
};

// Helper to interact with Mock Data in LocalStorage (client-side only)
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(`amor_qr_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`amor_qr_${key}`, JSON.stringify(data));
};

// Global in-memory storage for server-side mock state (since localStorage is client-only)
const serverMemoryStore: {
  products: Product[];
  orders: Order[];
  experiences: Experience[];
  settings: SiteSettings;
} = {
  products: [...DEFAULT_PRODUCTS],
  orders: [],
  experiences: [],
  settings: { ...DEFAULT_SETTINGS }
};

// --- DATA ACCESS METHODS ---

// 1. PRODUCTS
export async function getProducts(): Promise<Product[]> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const stored = getLocalData<Product[]>('products', []);
      if (stored.length === 0) {
        setLocalData('products', DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
      }
      return stored;
    }
    return serverMemoryStore.products;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data || DEFAULT_PRODUCTS;
  } catch (err) {
    console.error('Error fetching products from Supabase, using mock products:', err);
    return DEFAULT_PRODUCTS;
  }
}

export async function updateProduct(product: Product): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const products = await getProducts();
      const updated = products.map(p => p.id === product.id ? product : p);
      setLocalData('products', updated);
    }
    const idx = serverMemoryStore.products.findIndex(p => p.id === product.id);
    if (idx >= 0) serverMemoryStore.products[idx] = product;
    return true;
  }

  const { error } = await supabase
    .from('products')
    .upsert({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      features: product.features,
    });

  if (error) {
    console.error(`Error updating product ${product.id} in Supabase:`, error);
    return false;
  }
  return true;
}

export async function updateProductPrice(id: string, price: number): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const products = await getProducts();
      const updated = products.map(p => p.id === id ? { ...p, price } : p);
      setLocalData('products', updated);
    }
    const serverP = serverMemoryStore.products.find(p => p.id === id);
    if (serverP) serverP.price = price;
    return true;
  }

  const { error } = await supabase
    .from('products')
    .update({ price })
    .eq('id', id);

  if (error) {
    console.error(`Error updating product price ${id} in Supabase:`, error);
    return false;
  }
  return true;
}

// 1.1 SITE SETTINGS
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const stored = getLocalData<SiteSettings>('site_settings', DEFAULT_SETTINGS);
      return stored;
    }
    return serverMemoryStore.settings;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (err) {
    console.error('Error fetching site_settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const merged = { ...current, ...settings };

  if (isMockMode) {
    if (typeof window !== 'undefined') {
      setLocalData('site_settings', merged);
    }
    serverMemoryStore.settings = merged;
    return merged;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 'primary', ...merged })
      .select()
      .single();

    if (error) throw error;
    return data || merged;
  } catch (err) {
    console.error('Error updating site_settings:', err);
    return merged;
  }
}

// 2. ORDERS
export async function getOrders(): Promise<Order[]> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const orders = getLocalData<Order[]>('orders', []);
      const products = await getProducts();
      return orders.map(o => ({
        ...o,
        product: products.find(p => p.id === o.product_id)
      }));
    }
    return serverMemoryStore.orders.map(o => ({
      ...o,
      product: serverMemoryStore.products.find(p => p.id === o.product_id)
    }));
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, products(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return (data || []).map((o: any) => ({
    ...o,
    product: o.products
  }));
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const newOrder: Order = {
    ...orderData,
    id: newId,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const currentOrders = getLocalData<Order[]>('orders', []);
      currentOrders.push(newOrder);
      setLocalData('orders', currentOrders);
    }
    serverMemoryStore.orders.push(newOrder);
    return newOrder;
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      product_id: orderData.product_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      delivery_address: orderData.delivery_address,
      total: orderData.total,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating order in Supabase:', error);
    throw error;
  }
  return data;
}

export async function updateOrderStatus(
  id: string, 
  status: Order['status']
): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const orders = getLocalData<Order[]>('orders', []);
      const updated = orders.map(o => o.id === id ? { ...o, status } : o);
      setLocalData('orders', updated);
    }
    const idx = serverMemoryStore.orders.findIndex(o => o.id === id);
    if (idx !== -1) serverMemoryStore.orders[idx].status = status;
    return true;
  }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}

export async function updateOrderPayment(
  id: string, 
  paymentId: string, 
  status: Order['status']
): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const orders = getLocalData<Order[]>('orders', []);
      const updated = orders.map(o => o.id === id ? { ...o, payment_id: paymentId, status } : o);
      setLocalData('orders', updated);
    }
    const idx = serverMemoryStore.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      serverMemoryStore.orders[idx].payment_id = paymentId;
      serverMemoryStore.orders[idx].status = status;
    }
    return true;
  }

  const { error } = await supabase
    .from('orders')
    .update({ payment_id: paymentId, status })
    .eq('id', id);

  if (error) {
    console.error('Error updating order payment details:', error);
    return false;
  }
  return true;
}

// 3. EXPERIENCES
export function ensureExperienceSections(exp: Experience): Experience {
  if (exp.config && exp.config.sections && Array.isArray(exp.config.sections)) {
    return {
      ...exp,
      sections: exp.config.sections
    };
  }

  const sections: ExperienceSection[] = [];
  const themeId = exp.theme || 'anniversary';

  // 1. Portada interactiva is always first
  sections.push({
    id: 'sec-portada-default',
    type: 'portada',
    title: exp.title || 'Para ti ❤️',
    content: {
      message: exp.message || 'He preparado algo especial para ti'
    }
  });

  // 2. Carta (Our story)
  if (exp.history_text) {
    sections.push({
      id: 'sec-carta-default',
      type: 'carta',
      title: themeId === 'love-letter' ? 'Carta de Amor 💌' : 'Nuestra Historia',
      content: {
        text: exp.history_text
      }
    });
  }

  // 3. Special Date countdown timer
  if (exp.special_date) {
    sections.push({
      id: 'sec-contador-default',
      type: 'contador',
      title: themeId === 'birthday' ? 'Tiempo desde tu nacimiento' : 'Tiempo compartido juntos',
      content: {
        date: exp.special_date
      }
    });
  }

  // 4. Photos
  if (exp.photos && exp.photos.length > 0) {
    sections.push({
      id: 'sec-galeria-default',
      type: 'galeria',
      title: 'Nuestros recuerdos',
      content: {
        photos: exp.photos.map(p => ({ url: p.url, caption: p.caption || '' }))
      }
    });
  }

  // 5. Timeline Milestones
  if (exp.milestones && exp.milestones.length > 0) {
    sections.push({
      id: 'sec-timeline-default',
      type: 'timeline',
      title: 'Momentos Especiales',
      content: {
        milestones: exp.milestones.map(m => ({
          title: m.title,
          date: m.date,
          description: m.description,
          image_url: m.image_url || ''
        }))
      }
    });
  }

  // 6. Interactive Proposal Question (if proposal theme)
  if (['dating-proposal', 'marriage-proposal'].includes(themeId)) {
    sections.push({
      id: 'sec-pregunta-default',
      type: 'pregunta',
      title: themeId === 'marriage-proposal' ? '¿Te quieres casar conmigo? 💍' : '¿Quieres ser mi novia/o? ❤️',
      content: {
        question: exp.config?.proposalQuestion || (themeId === 'marriage-proposal' ? '¿Te quieres casar conmigo? 💍' : '¿Quieres ser mi novia/o? ❤️')
      }
    });
  }

  // 7. Surprise Gift Box (if surprise theme)
  if (themeId === 'surprise') {
    sections.push({
      id: 'sec-sorpresa-default',
      type: 'sorpresa',
      title: '¡Una sorpresa para ti!',
      content: {
        message: 'Haz clic para abrir tu regalo especial'
      }
    });
  }

  // 8. Background Music
  if (exp.song_url) {
    sections.push({
      id: 'sec-musica-default',
      type: 'musica',
      content: {
        url: exp.song_url
      }
    });
  }

  // 9. final hearts dedication (Mensaje final)
  sections.push({
    id: 'sec-corazones-default',
    type: 'corazones',
    title: 'Dedicatoria Final',
    content: {
      message: exp.message
    }
  });

  return {
    ...exp,
    sections
  };
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const experiences = getLocalData<Experience[]>('experiences', []);
      const found = experiences.find(e => e.slug.toLowerCase() === slug.toLowerCase());
      return found ? ensureExperienceSections(found) : null;
    }
    const found = serverMemoryStore.experiences.find(e => e.slug.toLowerCase() === slug.toLowerCase());
    return found ? ensureExperienceSections(found) : null;
  }

  const { data: experience, error: expError } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', slug)
    .single();

  if (expError || !experience) {
    console.error(`Experience with slug "${slug}" not found in Supabase:`, expError);
    return null;
  }

  const { data: photos, error: photoError } = await supabase
    .from('photos')
    .select('*')
    .eq('experience_id', experience.id)
    .order('order_index', { ascending: true });

  const { data: milestones, error: milestoneError } = await supabase
    .from('milestones')
    .select('*')
    .eq('experience_id', experience.id)
    .order('order_index', { ascending: true });

  if (photoError) console.error('Error fetching photos for experience:', photoError);
  if (milestoneError) console.error('Error fetching milestones for experience:', milestoneError);

  return ensureExperienceSections({
    ...experience,
    photos: photos || [],
    milestones: milestones || []
  });
}

export async function createExperience(
  expData: Omit<Experience, 'id' | 'created_at'>,
  photosList: Array<{ url: string; caption?: string }>,
  milestonesList: Array<{ title: string; date: string; description: string; image_url?: string }>
): Promise<Experience> {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  
  const formattedPhotos: Photo[] = photosList.map((p, idx) => ({
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    experience_id: newId,
    url: p.url,
    caption: p.caption || '',
    order_index: idx
  }));

  const formattedMilestones: Milestone[] = milestonesList.map((m, idx) => ({
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    experience_id: newId,
    title: m.title,
    date: m.date,
    description: m.description,
    image_url: m.image_url || '',
    order_index: idx
  }));

  const newExperience: Experience = {
    ...expData,
    id: newId,
    theme: expData.theme || 'anniversary',
    config: expData.config || {},
    created_at: new Date().toISOString(),
    photos: formattedPhotos,
    milestones: formattedMilestones
  };

  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const currentExps = getLocalData<Experience[]>('experiences', []);
      // Prevenir duplicados de slug
      const filtered = currentExps.filter(e => e.slug.toLowerCase() !== expData.slug.toLowerCase());
      filtered.push(newExperience);
      setLocalData('experiences', filtered);
    }
    serverMemoryStore.experiences.push(newExperience);
    return newExperience;
  }

  // 1. Insert experience
  const { data: expResult, error: expError } = await supabase
    .from('experiences')
    .insert([{
      order_id: expData.order_id || null,
      slug: expData.slug,
      title: expData.title,
      partner_name: expData.partner_name,
      user_name: expData.user_name,
      special_date: expData.special_date,
      message: expData.message,
      history_text: expData.history_text,
      song_url: expData.song_url || null,
      theme: expData.theme || 'anniversary',
      config: expData.config || {}
    }])
    .select()
    .single();

  if (expError) {
    console.error('Error inserting experience:', expError);
    throw expError;
  }

  // 2. Insert photos (if any)
  if (photosList.length > 0) {
    const { error: photoError } = await supabase
      .from('photos')
      .insert(photosList.map((p, idx) => ({
        experience_id: expResult.id,
        url: p.url,
        caption: p.caption || '',
        order_index: idx
      })));

    if (photoError) console.error('Error inserting photos to Supabase:', photoError);
  }

  // 3. Insert milestones (if any)
  if (milestonesList.length > 0) {
    const { error: milestoneError } = await supabase
      .from('milestones')
      .insert(milestonesList.map((m, idx) => ({
        experience_id: expResult.id,
        title: m.title,
        date: m.date,
        description: m.description,
        image_url: m.image_url || '',
        order_index: idx
      })));

    if (milestoneError) console.error('Error inserting milestones to Supabase:', milestoneError);
  }

  return {
    ...expResult,
    photos: formattedPhotos,
    milestones: formattedMilestones
  };
}

export async function getExperiences(): Promise<Experience[]> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      return getLocalData<Experience[]>('experiences', []);
    }
    return serverMemoryStore.experiences;
  }

  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  // Cargar fotos y hitos para cada una (para el admin)
  const fullExperiences = await Promise.all((experiences || []).map(async (exp) => {
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('experience_id', exp.id)
      .order('order_index', { ascending: true });

    const { data: milestones } = await supabase
      .from('milestones')
      .select('*')
      .eq('experience_id', exp.id)
      .order('order_index', { ascending: true });

    return ensureExperienceSections({
      ...exp,
      photos: photos || [],
      milestones: milestones || []
    });
  }));

  return fullExperiences;
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const currentExps = getLocalData<Experience[]>('experiences', []);
      const filtered = currentExps.filter(e => e.id !== id);
      setLocalData('experiences', filtered);
    }
    const idx = serverMemoryStore.experiences.findIndex(e => e.id === id);
    if (idx !== -1) serverMemoryStore.experiences.splice(idx, 1);
    return true;
  }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting experience:', error);
    return false;
  }
  return true;
}

const DEFAULT_THEMES: Theme[] = [
  { id: 'anniversary', name: 'Aniversario', description: 'Diseño elegante y romántico con tonos rosa/rojo, contador de tiempo de la relación, galería y línea de tiempo de hitos.', is_active: true, config: { colors: { primary: '#a21232', bg: '#fffcfd', text: '#111827' } } },
  { id: 'birthday', name: 'Cumpleaños', description: 'Diseño festivo con globos flotantes y confeti, contador regresivo o de edad, galería de recuerdos y deseos de cumpleaños.', is_active: true, config: { colors: { primary: '#e11d48', bg: '#fdf2f8', text: '#1f2937' } } },
  { id: 'dating-proposal', name: 'Pedir noviazgo', description: 'Flujo romántico y juguetón con una pregunta interactiva final "¿Quieres ser mi novio/a? ❤️" con botones interactivos.', is_active: true, config: { colors: { primary: '#ec4899', bg: '#fff5f7', text: '#1f2937' } } },
  { id: 'marriage-proposal', name: 'Pedir matrimonio', description: 'Diseño premium y solemne con tonos dorados y burdeos, música romántica de fondo y pregunta "¿Te quieres casar conmigo? 💍".', is_active: true, config: { colors: { primary: '#b45309', bg: '#fafaf9', text: '#1c1917' } } },
  { id: 'love-confession', name: 'Declaración de amor', description: 'Diseño emotivo de carta abierta para confesar sentimientos con música de fondo, mensaje inicial y galería de momentos compartidos.', is_active: true, config: { colors: { primary: '#db2777', bg: '#fff1f2', text: '#111827' } } },
  { id: 'love-letter', name: 'Carta de amor', description: 'Formato pergamino clásico elegante y minimalista con un mensaje largo, música acústica y galería íntima de fotos.', is_active: true, config: { colors: { primary: '#78350f', bg: '#fefcbf', text: '#451a03' } } },
  { id: 'surprise', name: 'Regalo sorpresa', description: 'Diseño misterioso con una caja de regalo interactiva que se abre al hacer clic, revelando las fotos y un cupón/mensaje especial.', is_active: true, config: { colors: { primary: '#4f46e5', bg: '#eef2ff', text: '#1e1b4b' } } },
  { id: 'valentines', name: 'San Valentín', description: 'Diseño super romántico de edición especial con corazones cayendo, contador de tiempo de amor y carta especial de San Valentín.', is_active: true, config: { colors: { primary: '#be123c', bg: '#fff1f2', text: '#111827' } } },
  { id: 'pregnancy', name: 'Anunciar embarazo', description: 'Diseño tierno y familiar con colores suaves (celeste/rosa), ecografía inicial interactiva y anuncio de la fecha estimada.', is_active: true, config: { colors: { primary: '#0891b2', bg: '#ecfeff', text: '#164e63' } } },
  { id: 'special', name: 'Felicitación especial', description: 'Diseño alegre y de celebración con fuegos artificiales digitales para desear éxito, felicitar por un logro o graduación.', is_active: true, config: { colors: { primary: '#d97706', bg: '#fffbeb', text: '#451a03' } } },
  { id: 'gratitude', name: 'Agradecimiento', description: 'Diseño cálido y sereno centrado en palabras de agradecimiento por el apoyo y momentos especiales de la relación.', is_active: true, config: { colors: { primary: '#0d9488', bg: '#f0fdfa', text: '#115e59' } } },
  { id: 'reconciliation', name: 'Reconciliación', description: 'Diseño conciliador y reconfortante con música suave, disculpas sinceras, fotos memorables y mensaje reconciliador.', is_active: true, config: { colors: { primary: '#4b5563', bg: '#f9fafb', text: '#111827' } } }
];

export async function getThemes(): Promise<Theme[]> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const stored = getLocalData<Theme[]>('themes', []);
      if (stored.length === 0) {
        setLocalData('themes', DEFAULT_THEMES);
        return DEFAULT_THEMES;
      }
      return stored;
    }
    return DEFAULT_THEMES;
  }

  try {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || DEFAULT_THEMES;
  } catch (err) {
    console.error('Error fetching themes from Supabase:', err);
    return DEFAULT_THEMES;
  }
}

export async function updateTheme(id: string, is_active: boolean, name?: string, description?: string): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const current = await getThemes();
      const updated = current.map(t => {
        if (t.id === id) {
          return {
            ...t,
            is_active,
            name: name || t.name,
            description: description || t.description
          };
        }
        return t;
      });
      setLocalData('themes', updated);
    }
    return true;
  }

  try {
    const { error } = await supabase
      .from('themes')
      .update({ 
        is_active, 
        ...(name ? { name } : {}), 
        ...(description ? { description } : {}) 
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating theme in Supabase:', err);
    return false;
  }
}

export async function updateExperienceTheme(id: string, theme: string): Promise<boolean> {
  if (isMockMode) {
    if (typeof window !== 'undefined') {
      const current = getLocalData<Experience[]>('experiences', []);
      const updated = current.map(e => e.id === id ? { ...e, theme } : e);
      setLocalData('experiences', updated);
    }
    const found = serverMemoryStore.experiences.find(e => e.id === id);
    if (found) found.theme = theme;
    return true;
  }

  try {
    const { error } = await supabase
      .from('experiences')
      .update({ theme })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating experience theme:', err);
    return false;
  }
}

export async function getCreatedExperiencesCount(): Promise<number> {
  const BASE_COUNT = 10;
  try {
    if (isMockMode) {
      if (typeof window !== 'undefined') {
        const local = getLocalData<Experience[]>('experiences', []);
        return BASE_COUNT + local.length;
      }
      return BASE_COUNT + (serverMemoryStore.experiences?.length || 0);
    }
    const { count, error } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true });

    if (error || count === null || count === undefined) {
      return BASE_COUNT;
    }
    return BASE_COUNT + count;
  } catch (err) {
    console.error('Error getting experiences count:', err);
    return BASE_COUNT;
  }
}

