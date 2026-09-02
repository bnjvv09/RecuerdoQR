# RecuerdoQR 💝

Plataforma e-commerce para crear experiencias digitales personalizadas accesibles mediante códigos QR.

## 🎯 Características
- ✨ **Experiencias personalizadas** (fotos, dedicatorias, música, contador de tiempo en vivo).
- 🎨 **12 Temáticas Interactivas** (Aniversario, Cumpleaños, Embarazo, Propuesta de Matrimonio, Carta de Amor, Reconciliación, etc.).
- 🖼️ **150 Personajes Temáticos** para tarjetas de regalo personalizadas e imprimibles.
- 📸 **Sistema de Galerías Inteligente** (+40 Fotos en Plan Premium, Doble Galería simultánea, estilos Polaroid, Collage, Carrusel).
- 🔒 **Rincón Secreto con PIN y Pista** para mensajes ocultos.
- 💳 **Integración Mercado Pago & Webpay Plus** (Débito, Crédito, Redcompra, MACH).
- 📱 **Responsive Design 100% Mobile-First**.
- 📊 **Panel de Administración Completo** para gestionar pedidos y clientes.
- 🎁 **Generación de Códigos QR** en alta resolución.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **UI Components** | Lucide React, Framer Motion, Canvas Confetti |
| **Backend** | Next.js API Routes (Serverless) |
| **Database** | Supabase (PostgreSQL) + LocalStorage fallback |
| **Payments** | Mercado Pago Checkout Pro (Webpay, Tarjetas, MACH) |
| **Notifications** | Sonner |

## 📁 Estructura del Proyecto
```
src/
├── app/
│   ├── (store)/
│   │   ├── page.tsx               # Landing Page
│   │   ├── personalizar/page.tsx   # Constructor en 6 pasos
│   │   ├── planes/page.tsx        # Tabla de planes y precios
│   │   └── admin/page.tsx         # Panel de administración
│   ├── amor/[slug]/page.tsx       # Visor interactivo de la experiencia
│   └── api/                       # API routes (Mercado Pago, Webhooks, Admin)
├── components/
│   ├── gallery/                   # Componentes de fotos (Polaroid, Collage, etc.)
│   ├── admin/                     # Tablas y modales de administración
│   └── personalizar/              # Pasos del constructor de experiencias
├── data/
│   └── charactersData.ts          # Catálogo de 145+ personajes temáticos
├── lib/
│   └── db.ts                      # Capa de datos y modelos
└── types/
    └── gallery.ts                 # Tipos y contratos TypeScript
```

## 🚀 Guía de Inicio

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta en Mercado Pago

### Instalación Local
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/bnjvv09/RecuerdoQR.git
   cd RecuerdoQR
   ```
2. **Instala dependencias:**
   ```bash
   npm install
   ```
3. **Copia las variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```
4. **Llena `.env.local` con tus credenciales:**
   ```env
   MERCADO_PAGO_ACCESS_TOKEN=tu-access-token
   NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=tu-public-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
5. **Corre el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
6. **Abre en tu navegador:**
   [http://localhost:3000](http://localhost:3000)

## 💳 Planes de Precios
| Plan | Precio | Características |
|---|---|---|
| **Plan Básico** | $7.990 CLP | Hasta 10 Fotos, Interacción de Temática, Contador en vivo, Tarjeta Digital con Color Libre |
| **Plan Medio** | $12.990 CLP | Hasta 20 Fotos, Tarjeta con 150 Personajes, Música de Fondo YouTube, Carta de Amor |
| **Plan Máximo (Premium)** | $17.990 CLP | +40 Fotos en HD, Doble Galería simultánea, Línea de Tiempo con fotos, Rincón Secreto con PIN |

## 🚀 Deploy en Vercel
1. Importa este repositorio en [Vercel.com](https://vercel.com).
2. Configura las variables de entorno (`MERCADO_PAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`).
3. Haz clic en **Deploy**.

---
**Hecho con ❤️ para momentos inolvidables.**
