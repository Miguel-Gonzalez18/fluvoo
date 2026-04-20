# Fluvoo — Tres tareas independientes

Trabaja cada tarea en orden. Son independientes entre sí.

---

# TAREA 1 — Reemplazar el favicon (el ícono de Vercel)

## Problema

El archivo `app/favicon.ico` y `public/favicon.ico` son el favicon por defecto
de Next.js (el triángulo de Vercel). Google y los navegadores muestran ese ícono
porque `app/favicon.ico` tiene prioridad sobre cualquier configuración en metadata.

## Lo que debes hacer

### Paso 1 — Generar el favicon correcto desde el SVG del logo

El logo de Fluvoo ya existe en `public/favicon.svg`. Úsalo para generar los
archivos de ícono correctos. Ejecuta este script para generarlos:

```bash
# Instalar dependencias si no están
npm install sharp --save-dev
# o con pnpm
pnpm add sharp --save-dev
```

Crea el script `scripts/generate-favicons.mjs` y ejecútalo:

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = './public/favicon.svg';
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Generar PNG en múltiples tamaños
const sizes = [16, 32, 48, 96, 192, 512];

for (const size of sizes) {
  await sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png()
    .toFile(`./public/icon-${size}.png`);
  console.log(`✓ icon-${size}.png`);
}

// icon.png para Next.js App Router (32x32 es el estándar)
await sharp(Buffer.from(svgContent))
  .resize(32, 32)
  .png()
  .toFile('./app/icon.png');
console.log('✓ app/icon.png');

// apple-touch-icon
await sharp(Buffer.from(svgContent))
  .resize(180, 180)
  .png()
  .toFile('./public/apple-touch-icon.png');
console.log('✓ apple-touch-icon.png');

console.log('\n✅ Todos los íconos generados.');
```

```bash
node scripts/generate-favicons.mjs
```

### Paso 2 — Reemplazar favicon.ico en ambas ubicaciones

Genera el `favicon.ico` con múltiples resoluciones embebidas. Añade este
bloque al script anterior:

```javascript
import { execSync } from 'child_process';

// Crear favicon.ico con imagemagick (si está disponible)
// Si no, usar el PNG de 48px como fallback renombrado a .ico
try {
  execSync('convert public/icon-16.png public/icon-32.png public/icon-48.png public/favicon.ico');
  fs.copyFileSync('./public/favicon.ico', './app/favicon.ico');
  console.log('✓ favicon.ico generado con imagemagick');
} catch {
  // Fallback: copiar el PNG de 48px como .ico (funciona en la mayoría de navegadores)
  fs.copyFileSync('./public/icon-48.png', './public/favicon.ico');
  fs.copyFileSync('./public/icon-48.png', './app/favicon.ico');
  console.log('✓ favicon.ico generado como PNG fallback');
}
```

Si no tienes imagemagick, la alternativa más simple es: copia el archivo
`public/icon-32.png` y renómbralo como `public/favicon.ico` y `app/favicon.ico`.
Los navegadores modernos aceptan PNGs con extensión .ico.

### Paso 3 — Agregar `app/icon.png` (convención Next.js App Router)

Next.js App Router tiene una convención especial: si colocas `app/icon.png`,
Next.js genera automáticamente las etiquetas `<link rel="icon">` correctas
sin necesidad de configuración en metadata. El archivo ya se generó en el paso 1.

### Paso 4 — Actualizar metadata icons en `app/layout.tsx`

Reemplaza el objeto `icons` en la metadata:

```typescript
icons: {
  icon: [
    { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  ],
  shortcut: '/favicon.ico',
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
},
```

### Paso 5 — Actualizar `public/site.webmanifest`

```json
{
  "name": "Fluvoo",
  "short_name": "Fluvoo",
  "description": "Claridad financiera para cada Dominicano",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#048059",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Verificación

Abre `https://fluvoo.com` en el navegador. El ícono en la pestaña debe mostrar
el logo de Fluvoo (cuatro cuadrantes verde oscuro y verde claro), no el triángulo
de Vercel. Google tardará 2-6 semanas en actualizar el favicon en los resultados
de búsqueda — es normal. Solicita re-indexación en Google Search Console.

---

# TAREA 2 — Página de Política de Privacidad

Crea el archivo `app/privacidad/page.tsx`.

El diseño debe ser **idéntico al de `app/cookies/page.tsx`** en estructura,
componentes y clases de Tailwind. Usa el mismo patrón: hero con gradiente,
grid de dos columnas (artículo principal + aside), mismas clases, misma paleta.

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Eye,
  UserCheck,
  Mail,
  Globe,
  Lock,
  Trash2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo Fluvoo recopila, usa y protege tu información personal. Tu privacidad es nuestra prioridad.",
  alternates: {
    canonical: "/privacidad",
  },
};

const dataRows = [
  {
    category: "Datos de cuenta",
    examples: "Nombre, correo electrónico, contraseña (cifrada)",
    purpose: "Crear y gestionar tu cuenta en la plataforma",
    retention: "Mientras la cuenta esté activa",
    icon: UserCheck,
  },
  {
    category: "Datos financieros",
    examples: "Ingresos, gastos, metas de ahorro ingresados por el usuario",
    purpose: "Generar análisis, proyecciones y recomendaciones personalizadas",
    retention: "Mientras la cuenta esté activa + 30 días tras eliminación",
    icon: Database,
  },
  {
    category: "Datos de uso",
    examples: "Páginas visitadas, funciones utilizadas, frecuencia de acceso",
    purpose: "Mejorar la experiencia y el rendimiento del producto",
    retention: "Hasta 13 meses (anonimizados)",
    icon: Eye,
  },
  {
    category: "Datos técnicos",
    examples: "Dirección IP, tipo de navegador, sistema operativo",
    purpose: "Seguridad, prevención de fraude y soporte técnico",
    retention: "90 días",
    icon: Globe,
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      {/* Hero — idéntico al de /cookies */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.2),transparent_65%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[42px_42px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 md:px-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>

          <div className="max-w-3xl space-y-4">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Política de privacidad
            </p>
            <h1 className="text-balance text-3xl font-bold text-neutral-900 md:text-5xl">
              Cómo Fluvoo protege y gestiona tu información personal
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
              Tu privacidad no es negociable. Esta política explica qué datos
              recopilamos, cómo los usamos, con quién los compartimos y cuáles
              son tus derechos sobre tu información en todo momento.
            </p>
            <p className="text-xs font-medium text-neutral-500">
              Última actualización: 19 de abril de 2026
            </p>
          </div>
        </div>
      </section>

      {/* Contenido principal — mismo grid que /cookies */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">

          {/* 1. Responsable del tratamiento */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              1. Responsable del tratamiento de datos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo (en adelante, "nosotros" o "la plataforma") es responsable
              del tratamiento de tus datos personales. Operamos desde República
              Dominicana y atendemos cualquier solicitud relacionada con tus
              datos a través de{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">
                hola@fluvoo.com
              </a>
              .
            </p>
          </div>

          {/* 2. Qué datos recopilamos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              2. Datos que recopilamos y para qué los usamos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Solo recopilamos los datos necesarios para ofrecerte el servicio.
              Nunca vendemos ni cedemos tu información a terceros con fines
              comerciales propios.
            </p>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead className="bg-neutral-100/80 text-xs uppercase tracking-wide text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold">Finalidad</th>
                    <th className="px-4 py-3 font-semibold">Retención</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {dataRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <tr key={row.category} className="align-top">
                        <td className="px-4 py-4">
                          <p className="inline-flex items-center gap-2 font-semibold text-neutral-900">
                            <Icon className="h-4 w-4 text-primary" />
                            {row.category}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {row.examples}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-neutral-700">
                          {row.purpose}
                        </td>
                        <td className="px-4 py-4 text-neutral-700">
                          {row.retention}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Base legal */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              3. Base legal del tratamiento
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Tratamos tus datos con base en:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Ejecución del contrato:</strong>{" "}
                  para prestarte el servicio de asistente financiero que solicitas
                  al registrarte.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Consentimiento:</strong>{" "}
                  para el uso de cookies no esenciales, comunicaciones de
                  marketing y análisis de comportamiento.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Interés legítimo:</strong>{" "}
                  para la seguridad de la plataforma, prevención de fraude y
                  mejora del producto.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Seguridad */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              4. Seguridad de tus datos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Toda la información se transmite cifrada mediante HTTPS/TLS.
              Tus datos financieros se almacenan en servidores seguros gestionados
              por Supabase con cifrado en reposo. Las contraseñas se almacenan
              con hashing seguro y nunca en texto plano. Aplicamos controles de
              acceso estrictos: solo el equipo autorizado puede acceder a datos
              de producción bajo auditoría.
            </p>
          </div>

          {/* 5. Compartir datos */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              5. ¿Con quién compartimos tus datos?
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              No vendemos tu información. Solo la compartimos con proveedores
              de servicios que nos ayudan a operar la plataforma, bajo acuerdos
              de confidencialidad:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Supabase</strong> —
                  Infraestructura de base de datos y autenticación (Estados Unidos)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Vercel</strong> —
                  Hosting y despliegue de la aplicación (Estados Unidos)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Google (Analytics/GTM)</strong> —
                  Análisis de uso anónimo, solo si das tu consentimiento
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Anthropic (Claude AI)</strong> —
                  Procesamiento de análisis financiero con inteligencia artificial
                </span>
              </li>
            </ul>
          </div>

          {/* 6. Tus derechos */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              6. Tus derechos sobre tus datos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Tienes derecho a acceder a tus datos, corregirlos, solicitar su
              eliminación, oponerte a ciertos usos y portarlos a otro servicio.
              Para ejercer cualquiera de estos derechos escríbenos a{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">
                hola@fluvoo.com
              </a>{" "}
              con asunto "Derechos de privacidad". Respondemos en un plazo
              máximo de 30 días hábiles.
            </p>
          </div>

          {/* 7. Cambios */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              7. Cambios en esta política
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Podemos actualizar esta política periódicamente. Cuando lo hagamos,
              actualizaremos la fecha al inicio de la página y, si los cambios son
              significativos, te notificaremos por correo electrónico con al
              menos 15 días de anticipación.
            </p>
          </div>
        </article>

        {/* Aside — mismo estilo que /cookies */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Tu información, tu control
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              Nunca vendemos tus datos financieros. La información que ingresas
              en Fluvoo se usa exclusivamente para darte análisis y
              recomendaciones personalizadas. Eres el único dueño de tus datos.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="h-5 w-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Eliminar tu cuenta
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Puedes solicitar la eliminación completa de tu cuenta y todos tus
              datos en cualquier momento. Procesamos las solicitudes en un plazo
              de 30 días y te confirmamos por correo cuando se completa.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">
              Páginas relacionadas
            </h3>
            <div className="mt-3 space-y-2">
              <Link
                href="/cookies"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                → Política de Cookies
              </Link>
              <Link
                href="/terminos"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                → Términos y Condiciones
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Contacto</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Para cualquier consulta sobre privacidad o el tratamiento de tus
              datos, escríbenos directamente.
            </p>
            <a
              href="mailto:hola@fluvoo.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              hola@fluvoo.com
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
```

---

# TAREA 3 — Página de Términos y Condiciones

Crea el archivo `app/terminos/page.tsx`.

Mismo patrón de diseño que `/cookies` y `/privacidad`.

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Ban,
  CreditCard,
  Mail,
  RefreshCw,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Lee los términos y condiciones de uso de Fluvoo. Define los derechos y obligaciones de usuarios y de la plataforma.",
  alternates: {
    canonical: "/terminos",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.2),transparent_65%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[42px_42px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 md:px-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>

          <div className="max-w-3xl space-y-4">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
              <FileText className="h-3.5 w-3.5" />
              Términos y condiciones
            </p>
            <h1 className="text-balance text-3xl font-bold text-neutral-900 md:text-5xl">
              Términos y condiciones de uso de Fluvoo
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
              Al registrarte y usar Fluvoo, aceptas estos términos. Te
              recomendamos leerlos completos — están escritos en lenguaje
              claro, sin letra pequeña.
            </p>
            <p className="text-xs font-medium text-neutral-500">
              Última actualización: 19 de abril de 2026
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">

          {/* 1. Aceptación */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              1. Aceptación de los términos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Al crear una cuenta o usar cualquier función de Fluvoo, confirmas
              que tienes al menos 18 años, que has leído y aceptas estos términos
              y nuestra Política de Privacidad. Si no los aceptas, no puedes
              usar la plataforma.
            </p>
          </div>

          {/* 2. El servicio */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              2. Descripción del servicio
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo es un asistente financiero personal que te ayuda a
              visualizar tus ingresos, gastos y metas mediante inteligencia
              artificial. El servicio incluye:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Dashboard financiero personalizado por perfil de usuario
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Detección automática de transacciones desde notificaciones bancarias
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Análisis y recomendaciones financieras generadas por IA
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Calculadoras financieras locales (nómina, ISR, SIPEN, ARS, préstamos)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Planes de ahorro personalizados con seguimiento
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-neutral-600">
              <strong className="text-neutral-800">Importante:</strong> Fluvoo
              es una herramienta de educación y organización financiera personal.
              Las recomendaciones generadas por IA son orientativas y no
              constituyen asesoría financiera profesional ni legal. Para
              decisiones financieras importantes, consulta a un profesional
              certificado.
            </p>
          </div>

          {/* 3. Tu cuenta */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              3. Tu cuenta y responsabilidades
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Eres responsable de mantener la confidencialidad de tus credenciales
              de acceso. Debes notificarnos de inmediato si detectas acceso no
              autorizado a tu cuenta en{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">
                hola@fluvoo.com
              </a>
              . La información financiera que ingresas en la plataforma es
              responsabilidad tuya — Fluvoo no verifica la veracidad de los
              datos que introduces.
            </p>
          </div>

          {/* 4. Uso aceptable */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              4. Uso aceptable
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Puedes usar Fluvoo para gestionar tus finanzas personales. No puedes:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Usar el servicio para actividades ilegales, fraude o lavado de dinero
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Intentar acceder a cuentas de otros usuarios o a la infraestructura
                de la plataforma
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Hacer scraping, reverse engineering o extracción masiva de datos
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Compartir tu cuenta con otras personas
              </li>
            </ul>
          </div>

          {/* 5. Planes y pagos */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              5. Planes y pagos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo ofrece un plan gratuito con funciones básicas y planes de
              pago con funciones avanzadas. Los precios se muestran en la
              plataforma y pueden variar. Al suscribirte a un plan de pago:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                El cobro se realiza por adelantado en el ciclo seleccionado (mensual o anual)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Puedes cancelar en cualquier momento — el acceso se mantiene
                hasta el final del período pagado
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                No ofrecemos reembolsos proporcionales por cancelaciones a mitad
                de período, salvo error de facturación
              </li>
            </ul>
          </div>

          {/* 6. Propiedad intelectual */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              6. Propiedad intelectual
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo y todos sus elementos — nombre, logo, diseño, código,
              funcionalidades y contenido editorial — son propiedad de Fluvoo.
              No puedes copiarlos, reproducirlos ni usarlos sin autorización
              escrita. Los datos que tú introduces en la plataforma son
              exclusivamente tuyos.
            </p>
          </div>

          {/* 7. Limitación de responsabilidad */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              7. Limitación de responsabilidad
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo no es responsable de decisiones financieras tomadas con
              base en los análisis o recomendaciones de la plataforma. El
              servicio se ofrece "tal cual" y, aunque trabajamos para mantenerlo
              disponible 24/7, no garantizamos que esté libre de errores o
              interrupciones. En ningún caso nuestra responsabilidad excederá
              el valor del plan pagado en los últimos 3 meses.
            </p>
          </div>

          {/* 8. Terminación */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              8. Terminación del servicio
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Puedes eliminar tu cuenta en cualquier momento. Nos reservamos el
              derecho de suspender o eliminar cuentas que incumplan estos
              términos, con notificación previa salvo en casos de fraude o
              actividad ilegal donde la suspensión puede ser inmediata.
            </p>
          </div>

          {/* 9. Ley aplicable */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              9. Ley aplicable y resolución de conflictos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Estos términos se rigen por las leyes vigentes de la República
              Dominicana. Ante cualquier disputa, priorizamos la resolución
              amistosa directa. Para iniciar ese proceso, escríbenos a{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">
                hola@fluvoo.com
              </a>
              .
            </p>
          </div>

          {/* 10. Cambios */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              10. Cambios en los términos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Podemos modificar estos términos en cualquier momento. Los cambios
              sustanciales se notifican por correo con 15 días de anticipación.
              El uso continuado de la plataforma después de la notificación
              implica aceptación de los nuevos términos.
            </p>
          </div>
        </article>

        {/* Aside */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Resumen en lenguaje simple
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary font-bold">✓</span>
                Fluvoo es una herramienta de apoyo, no un asesor financiero certificado
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary font-bold">✓</span>
                Tus datos son tuyos — no los vendemos
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary font-bold">✓</span>
                Puedes cancelar cuando quieras, sin penalidades
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary font-bold">✓</span>
                Ante cualquier problema, escríbenos primero
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Nota importante
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              Las recomendaciones de Fluvoo son generadas por inteligencia
              artificial con base en la información que tú provees. No reemplazan
              la asesoría de un contador, planificador financiero o abogado
              certificado para decisiones complejas.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Planes disponibles
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Empieza gratis con el plan básico. Los planes de pago se detallan
              en la página de precios con todas las funciones incluidas.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">
              Páginas relacionadas
            </h3>
            <div className="mt-3 space-y-2">
              <Link
                href="/privacidad"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                → Política de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                → Política de Cookies
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Contacto</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              ¿Tienes dudas sobre estos términos? Escríbenos.
            </p>
            <a
              href="mailto:hola@fluvoo.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              hola@fluvoo.com
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
```

---

# TAREA 4 — Actualizar links del footer y sitemap

## Footer config `modules/homePage/config/footerHome.ts`

Actualiza los links legales para que apunten a las páginas reales:

```typescript
export const footerLegalLinks: FooterLegalLink[] = [
  { id: "footer-link-privacidad", label: "Privacidad", href: "/privacidad" },
  { id: "footer-link-terminos", label: "Términos", href: "/terminos" },
  { id: "footer-link-cookies", label: "Cookies", href: "/cookies" },
];
```

## Sitemap `app/sitemap.ts`

Agrega las nuevas rutas:

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fluvoo.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
```

## También actualiza el consent banner

En `modules/shared/components/cookies-consent.tsx`, verifica que el link a
la política de cookies ya apunta a `/cookies`. Si hay algún link a "Política
de Privacidad" que apunte a `#`, cámbialo a `/privacidad`.