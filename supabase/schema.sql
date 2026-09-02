-- ==============================================================================
-- RECUERDO QR - ESQUEMA COMPLETO DE BASE DE DATOS (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. TABLA: PRODUCTS (Planes de la Tienda)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  features TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existe, agregar las columnas
ALTER TABLE products ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all access to products" ON products;
CREATE POLICY "Allow admin all access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 2. TABLA: ORDERS (Pedidos)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  total NUMERIC NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access to orders" ON orders;
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select orders" ON orders;
CREATE POLICY "Allow public select orders" ON orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all access to orders" ON orders;
CREATE POLICY "Allow admin all access to orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 3. TABLA: THEMES (Temáticas de Experiencias)
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  config JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to themes" ON themes;
CREATE POLICY "Allow public read access to themes" ON themes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all access to themes" ON themes;
CREATE POLICY "Allow admin all access to themes" ON themes
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 4. TABLA: EXPERIENCES (Experiencias Personalizadas QR)
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  special_date DATE NOT NULL,
  message TEXT NOT NULL,
  history_text TEXT NOT NULL,
  song_url TEXT,
  theme TEXT DEFAULT 'anniversary',
  config JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to experiences" ON experiences;
CREATE POLICY "Allow public read access to experiences" ON experiences
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to experiences" ON experiences;
CREATE POLICY "Allow public insert access to experiences" ON experiences
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin all access to experiences" ON experiences;
CREATE POLICY "Allow admin all access to experiences" ON experiences
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 5. TABLA: PHOTOS (Fotografías de Experiencias)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to photos" ON photos;
CREATE POLICY "Allow public read access to photos" ON photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to photos" ON photos;
CREATE POLICY "Allow public insert access to photos" ON photos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin all access to photos" ON photos;
CREATE POLICY "Allow admin all access to photos" ON photos
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- 6. TABLA: MILESTONES (Hitos de Línea de Tiempo)
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to milestones" ON milestones;
CREATE POLICY "Allow public read access to milestones" ON milestones
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to milestones" ON milestones;
CREATE POLICY "Allow public insert access to milestones" ON milestones
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin all access to milestones" ON milestones;
CREATE POLICY "Allow admin all access to milestones" ON milestones
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- ==============================================================================
-- 7. CONFIGURACIÓN DEL BUCKET DE STORAGE ('photos')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public read from photos bucket" ON storage.objects;
CREATE POLICY "Allow public read from photos bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow public upload to photos bucket" ON storage.objects;
CREATE POLICY "Allow public upload to photos bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow admin modify photos bucket" ON storage.objects;
CREATE POLICY "Allow admin modify photos bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'photos' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));


-- ==============================================================================
-- 8. DATOS INICIALES (SEEDS)
-- ==============================================================================

-- Productos y Precios Oficiales (100% Digitales por Capacidad)
INSERT INTO products (id, name, price, description, features) VALUES
('basic', 'Plan Básico', 7990, 'Página web personalizada para tu pareja con hasta 10 fotos, contador de tiempo y tarjeta digital temática.', ARRAY['Página web interactiva', 'Hasta 10 Fotos en HD', 'Contador de tiempo en vivo', 'Dedicatoria final con corazón', 'Tarjeta de Regalo Digital Temática', 'Código QR Digital HD']),
('medium', 'Plan Medio', 12990, 'Nuestra opción más popular. Añade hasta 20 fotos, música de fondo personalizada y carta de amor interactiva.', ARRAY['Todo lo del Plan Básico', 'Hasta 20 Fotos', 'Música de fondo personalizada (YouTube)', '6 Estilos de galería (Polaroid, Carrete)', 'Carta de amor interactiva']),
('premium', 'Plan Máximo', 17990, 'La experiencia completa sin límites: hasta 30 fotos, video dedicado, línea de tiempo de hitos y todos los widgets.', ARRAY['Todo lo del Plan Medio', 'Hasta 30 Fotos', 'Video de YouTube dedicado', 'Línea de tiempo con fotos de hitos', 'Rincón secreto con PIN, Propuesta y Mapa']),
('digital', 'Plan Básico (Digital)', 7990, 'Página web personalizada con hasta 10 fotos y tarjeta digital.', ARRAY['Hasta 10 Fotos', 'Contador de tiempo', 'Tarjeta digital']),
('card', 'Plan Medio', 12990, 'Hasta 20 fotos más música y carta.', ARRAY['Hasta 20 Fotos', 'Música de fondo', 'Tarjeta digital'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  features = EXCLUDED.features;

-- Temáticas Oficiales
INSERT INTO themes (id, name, description, is_active, config) VALUES
('anniversary', 'Aniversario', 'Diseño elegante y romántico con tonos rosa/rojo, contador de tiempo de la relación, galería y línea de tiempo de hitos.', true, '{"emoji": "❤️", "colors": {"primary": "#a21232", "bg": "#fffcfd", "text": "#111827"}}'::jsonb),
('birthday', 'Cumpleaños', 'Diseño festivo con confeti, contador regresivo o de edad, galería de recuerdos y deseos de cumpleaños.', true, '{"emoji": "🎂", "colors": {"primary": "#e11d48", "bg": "#fdf2f8", "text": "#1f2937"}}'::jsonb),
('dating-proposal', 'Pedir noviazgo', 'Flujo romántico y juguetón con una pregunta interactiva final "¿Quieres ser mi novia/o? ❤️".', true, '{"emoji": "💌", "colors": {"primary": "#ec4899", "bg": "#fff5f7", "text": "#1f2937"}}'::jsonb),
('marriage-proposal', 'Pedir matrimonio', 'Diseño premium y solemne con tonos dorados y burdeos, música romántica y pregunta "¿Te quieres casar conmigo? 💍".', true, '{"emoji": "💍", "colors": {"primary": "#b45309", "bg": "#fafaf9", "text": "#1c1917"}}'::jsonb),
('love-confession', 'Declaración de amor', 'Diseño emotivo de carta abierta para confesar sentimientos con música de fondo y galería íntima.', true, '{"emoji": "💖", "colors": {"primary": "#db2777", "bg": "#fff1f2", "text": "#111827"}}'::jsonb),
('love-letter', 'Carta de amor', 'Formato pergamino clásico elegante y minimalista con un mensaje largo y música acústica.', true, '{"emoji": "📜", "colors": {"primary": "#78350f", "bg": "#fefcbf", "text": "#451a03"}}'::jsonb),
('surprise', 'Regalo sorpresa', 'Diseño misterioso con una caja de regalo interactiva que se abre al hacer clic revelando un cupón.', true, '{"emoji": "🎁", "colors": {"primary": "#4f46e5", "bg": "#eef2ff", "text": "#1e1b4b"}}'::jsonb),
('valentines', 'San Valentín', 'Diseño super romántico de edición especial con corazones cayendo y contador de tiempo.', true, '{"emoji": "🌹", "colors": {"primary": "#be123c", "bg": "#fff1f2", "text": "#111827"}}'::jsonb),
('pregnancy', 'Anunciar embarazo', 'Diseño tierno y familiar con colores suaves (celeste/rosa) y anuncio de la fecha estimada.', true, '{"emoji": "👶", "colors": {"primary": "#0891b2", "bg": "#ecfeff", "text": "#164e63"}}'::jsonb),
('special', 'Felicitación especial', 'Diseño alegre y de celebración con fuegos artificiales digitales para desear éxito en un logro.', true, '{"emoji": "⭐", "colors": {"primary": "#d97706", "bg": "#fffbeb", "text": "#451a03"}}'::jsonb),
('gratitude', 'Agradecimiento', 'Diseño cálido y sereno centrado en palabras de agradecimiento por el apoyo en la relación.', true, '{"emoji": "🙏", "colors": {"primary": "#0d9488", "bg": "#f0fdfa", "text": "#115e59"}}'::jsonb),
('reconciliation', 'Reconciliación', 'Diseño conciliador y reconfortante con música suave, fotos memorables y mensaje sincero.', true, '{"emoji": "🕊️", "colors": {"primary": "#4b5563", "bg": "#f9fafb", "text": "#111827"}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  config = EXCLUDED.config;
