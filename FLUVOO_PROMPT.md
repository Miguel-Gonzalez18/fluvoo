# Fluvoo — Prompt de correcciones para Windsurf / Google Antigravity

## Contexto del proyecto

Next.js App Router · Tailwind CSS v4 · TypeScript · shadcn/ui · pnpm  
Ruta base de componentes: `src/components/`

---

## 1 · BUG CRÍTICO — MorphingText aparece por encima del `<p>` y el `<Button>` en el CTA

### Causa raíz

El `<div aria-hidden>` dentro de `MorphingText` tiene aplicada la clase Tailwind
`[filter:url(#threshold)_blur(0.6px)]`. En CSS, `filter` (cualquier valor distinto de
`none`) **crea automáticamente un nuevo stacking context** para ese elemento. Esto hace
que el div animado se pinte **por encima** de sus elementos hermanos (`<p>`, `<Button>`)
aunque aparezca antes en el DOM, porque los stacking contexts con z-index implícito
`auto` se resuelven en orden de pintado compuesto, no en orden DOM.

### Archivos a modificar

#### `src/components/ui/liquid-text.tsx`

**Cambio 1 — Dar al contenedor visual un `z-index` explícito bajo:**

```tsx
// ANTES
const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => (
    <h2 className="relative w-full isolate">
        <span className="sr-only">{texts.join(" ")}</span>
        <div
            aria-hidden="true"
            className={cn(
                "relative block w-full h-16 md:h-24 text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] lg:text-[6rem]",
                className,
            )}
        >
            <Texts texts={texts} />
            <SvgFilters />
        </div>
    </h2>
);

// DESPUÉS
const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => (
    <h2 className="relative z-0 w-full isolate">
        <span className="sr-only">{texts.join(" ")}</span>
        <div
            aria-hidden="true"
            className={cn(
                "relative block w-full h-16 md:h-24 text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] lg:text-[6rem]",
                className,
            )}
        >
            <Texts texts={texts} />
            <SvgFilters />
        </div>
    </h2>
);
```

#### `src/components/HomePage/CTA.tsx`

**Cambio 2 — Convertir `#CTA-header` en un stacking context explícito y elevar `<p>` y `<Button>`:**

```tsx
// ANTES
<div id="CTA-header" className="text-center relative space-y-4">
    <MorphingText
        texts={["Empieza", "a entender", "tu dinero"]}
        className="font-heading leading-inherit h-auto md:h-auto lg:h-auto text-white"
    />
    <p id="CTA-description" className="relative text-neutral-200 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
        Sin hojas de cálculo, sin configuraciones complejas.
    </p>
    <Button id="hero-button-1" variant="ghost" className="relative cursor-pointer p-4 text-white border border-white/20 bg-white/10 backdrop-blur-lg">
        Comenzar ahora
        <ArrowUpRight className="ml-2 h-4 w-4" />
    </Button>
</div>

// DESPUÉS
<div id="CTA-header" className="text-center relative isolate space-y-4">
    <MorphingText
        texts={["Empieza", "a entender", "tu dinero"]}
        className="font-heading leading-inherit h-auto md:h-auto lg:h-auto text-white"
    />
    <p id="CTA-description" className="relative z-10 text-neutral-200 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
        Sin hojas de cálculo, sin configuraciones complejas.
    </p>
    <Button id="hero-button-1" variant="ghost" className="relative z-10 cursor-pointer p-4 text-white border border-white/20 bg-white/10 backdrop-blur-lg">
        Comenzar ahora
        <ArrowUpRight className="ml-2 h-4 w-4" />
    </Button>
</div>
```

**Explicación del mecanismo corregido:**
- `isolate` en `#CTA-header` establece un nuevo stacking context raíz para esta sección.
- `z-0` en `<h2>` ancla el MorphingText al nivel base de ese contexto.
- `z-10` en `<p>` y `<Button>` los eleva por encima del h2 dentro del mismo stacking
  context, sin importar el efecto `filter` del hijo animado.

---

## 2 · AUDITORÍA SEO — Hallazgos y correcciones requeridas

### 2.1 · `app/layout.tsx` — og:image y touch icons con formato incorrecto

**Problema:** `og:image` apunta a `/logo.svg`. Facebook, LinkedIn y Twitter/X no
renderizan SVG como og:image. El resultado es que al compartir el link no aparece
ninguna imagen de preview. Lo mismo aplica al `apple-touch-icon` (SVG no soportado por
iOS).

**Acción:** Crear un archivo `public/og-image.png` (1200×630 px, PNG) con el diseño de
la landing y un archivo `public/apple-touch-icon.png` (180×180 px, PNG) con el ícono de
la app.

```tsx
// app/layout.tsx — sección openGraph.images
images: [
  {
    url: '/og-image.png',   // PNG 1200×630 — CAMBIAR
    width: 1200,
    height: 630,
    alt: 'Fluvoo - Claridad financiera para cada Dominicano',
  },
],

// twitter.images
images: ['/og-image.png'],  // CAMBIAR

// icons — agregar apple touch icon PNG
icons: {
  icon: '/favicon.svg',
  shortcut: '/favicon.svg',
  apple: '/apple-touch-icon.png',  // PNG 180×180 — CAMBIAR
},
```

### 2.2 · `app/layout.tsx` — Web Manifest no existe

**Problema:** `manifest: '/site.webmanifest'` está declarado en metadata pero el archivo
no existe en `public/`. Google y los navegadores reportarán 404 al intentar cargarlo.

**Acción:** Crear `public/site.webmanifest`:

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
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

### 2.3 · `app/sitemap.ts` — URLs con fragmentos y rutas bloqueadas en robots.txt

**Problema 1:** Google ignora los fragmentos (`#`) en URLs del sitemap. Las entradas
`/#beneficios`, `/#como-funciona` y `/#faq` no aportan nada al crawling.

**Problema 2:** `/auth/login` y `/auth/register` están en `disallow` en `robots.txt` y
además en el sitemap — contradicción directa que puede confundir al crawler.

**Acción:** Reemplazar `app/sitemap.ts` por:

```ts
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
  ]
}
```

Agregar rutas reales de contenido (blog, páginas de precio, etc.) a medida que existan.

### 2.4 · `src/components/HomePage/Hero.tsx` — alt text genérico en imagen principal

**Problema:** `alt="Hero"` no describe el contenido de la imagen. Google usa el alt text
para indexar imágenes y como señal de relevancia.

**Acción:**

```tsx
// ANTES
<Image id="hero-image" src="/images/finance-img.svg" alt="Hero" ... />

// DESPUÉS
<Image
  id="hero-image"
  src="/images/finance-img.svg"
  alt="Dashboard de Fluvoo mostrando análisis de finanzas personales"
  ...
/>
```

### 2.5 · `src/components/HomePage/WhyFluvoo.tsx` — jerarquía de headings incorrecta

**Problema:** Los títulos de las feature cards usan `<h2>`, pero la sección ya tiene su
propio `<h2>` (`#why-fluvoo-title`). Esto crea múltiples `<h2>` hermanos sin jerarquía,
lo que rompe el outline del documento para crawlers y screen readers.

**Acción:** Cambiar todos los `<h2>` de las cards a `<h3>`:

```tsx
// ANTES
<h2 className="text-lg font-bold">{card.title}</h2>

// DESPUÉS
<h3 className="text-lg font-bold">{card.title}</h3>
```

### 2.6 · `src/components/HomePage/FAQ.tsx` — Sin JSON-LD FAQPage

**Problema:** La sección de FAQ es uno de los mejores candidatos para rich results de
Google ("People Also Ask" / acordeones en SERP). Sin el schema `FAQPage` en JSON-LD, se
pierde ese espacio en los resultados.

**Acción:** Agregar el script de JSON-LD dentro del componente `FAQ`:

```tsx
// Al inicio del return, ANTES de <section>
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer,
    },
  })),
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <section className="relative py-12 bg-white">
      {/* ... resto del JSX sin cambios ... */}
    </section>
  </>
);
```

### 2.7 · `app/layout.tsx` — Sin JSON-LD Organization / WebSite

**Problema:** Google usa el schema `Organization` para Knowledge Panel y `WebSite` para
activar el Sitelinks Searchbox. Ninguno de los dos está presente.

**Acción:** Agregar en `app/layout.tsx`, dentro del `<body>`:

```tsx
export default function RootLayout({ children }: ...) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fluvoo",
    "url": "https://fluvoo.com",
    "logo": "https://fluvoo.com/logo.svg",
    "sameAs": [
      "https://www.instagram.com/fluvoo",
      "https://www.linkedin.com/company/fluvoo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hola@fluvoo.com",
      "contactType": "customer support",
      "availableLanguage": "Spanish"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fluvoo",
    "url": "https://fluvoo.com"
  };

  return (
    <html lang="es" className={`...`}>
      <body className="bg-neutral-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
```

### 2.8 · `src/components/HomePage/Hero.tsx` — Rating sin markup accesible

**Problema:** Las estrellas de calificación se renderizan como íconos sin texto
alternativo agrupado. Los crawlers y screen readers no leen "4.8 estrellas".

**Acción:**

```tsx
// ANTES
<span className="hero-description flex items-center gap-1">
  {Array(5).fill(<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
</span>

// DESPUÉS
<span
  className="hero-description flex items-center gap-1"
  aria-label="Calificación: 4.8 de 5 estrellas"
  role="img"
>
  {Array(5).fill(null).map((_, i) => (
    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
  ))}
</span>
```

### 2.9 · `src/components/HomePage/Footer.tsx` — Links sociales sin `aria-label`

**Problema:** Los botones de redes sociales solo tienen el ícono SVG, sin texto ni
`aria-label`. Los crawlers y screen readers los reportan como "link sin texto".

**Acción:**

```tsx
// ANTES
<a href="#" className="...">
  <Facebook className="w-5 h-5" />
</a>

// DESPUÉS
<a href="https://facebook.com/fluvoo" aria-label="Fluvoo en Facebook" className="...">
  <Facebook className="w-5 h-5" aria-hidden="true" />
</a>
// Aplicar el mismo patrón a Instagram y LinkedIn con sus URLs reales
```

---

## Resumen de archivos a tocar

| Archivo | Tipo de cambio |
|---|---|
| `src/components/ui/liquid-text.tsx` | Bug fix — z-index en h2 |
| `src/components/HomePage/CTA.tsx` | Bug fix — isolate + z-10 en p y Button |
| `app/layout.tsx` | SEO — og:image PNG, apple icon PNG, JSON-LD schemas |
| `app/sitemap.ts` | SEO — eliminar fragmentos y rutas de auth |
| `public/site.webmanifest` | SEO — crear archivo que no existe |
| `public/og-image.png` | SEO — crear imagen 1200×630 px |
| `public/apple-touch-icon.png` | SEO — crear icono 180×180 px |
| `src/components/HomePage/Hero.tsx` | SEO — alt text imagen, aria en estrellas |
| `src/components/HomePage/WhyFluvoo.tsx` | SEO — h2 → h3 en cards |
| `src/components/HomePage/FAQ.tsx` | SEO — agregar JSON-LD FAQPage |
| `src/components/HomePage/Footer.tsx` | SEO — aria-label en links sociales |
