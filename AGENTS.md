# Fluvoo — Agent Instructions

> Next.js 16.2.1 (Turbopack) · Tailwind v4 · shadcn/radix · GSAP + Three.js · pnpm

## Commands

```
pnpm dev       # dev server (Turbopack)
pnpm build     # production build
pnpm start     # start production server
pnpm lint      # eslint
```

No test framework configured yet.

## Architecture

```
app/                    ← Next.js App Router (routes + layouts)
  (auth)/               ← auth route group (empty, WIP)
  (dashboard)/          ← dashboard route group (empty, WIP)
  page.tsx              ← landing entry → delegates to modules/
modules/
  homePage/             ← landing page feature
    components/         ← React components
    config/             ← static data (menus, FAQs, profiles, etc.)
    hooks/              ← GSAP animation hooks
    types/              ← shared types
    HomePage.tsx        ← page-level layout + metadata
  shared/               ← cross-feature components (cookies, etc.)
  dashboard/            ← dashboard feature (WIP)
lib/
  utils.ts              ← cn() utility (clsx + tailwind-merge)
app/globals.css         ← Tailwind v4 + theme vars + @utility defs
```

## Critical Rules

### 1. Imports: ALWAYS use `@/` aliases inside `modules/`

Turbopack fails to resolve relative imports (`../ui/button`) across module boundaries. Always use absolute paths:

```tsx
// ✅ Correct
import { Button } from "@/modules/homePage/components/ui/button";

// ❌ Breaks Turbopack
import { Button } from "../ui/button";
```

This applies even for sibling directories within the same module.

### 2. Tailwind v4 — no dynamic class names

Tailwind v4 scans source files at build time. String interpolation like `bg-${color}` will be purged. Use a mapping object:

```tsx
const badgeMap: Record<string, string> = {
  primary: "bg-primary",
  black: "bg-black",
};
// Then: badgeMap[color] ?? "bg-neutral-500"
```

### 3. Repeated gradient → use `@utility`

The highlight gradient `text-highlight` is defined in `app/globals.css` as:
```css
@utility text-highlight {
  background-image: linear-gradient(180deg, transparent 55%, rgba(52, 168, 100, 0.22) 55%);
}
```
Use `text-highlight` — never inline the gradient again.

### 4. Metadata lives in root `layout.tsx`

`app/layout.tsx` defines full OpenGraph, Twitter cards, and Schema.org JSON-LD. Child pages (`HomePage.tsx`) should only set `title` and `description`. Do not duplicate `openGraph`, `twitter`, `icons`, etc.

### 5. GSAP animation hooks

- Always use `gsap.context()` with cleanup via `ctx.revert()`
- `useSectionRevealHome` has an intentional empty `[]` deps array — selectors are static, cleanup is handled by context
- GSAP SplitText requires `gsap.registerPlugin(SplitText)` inside the effect

### 6. Image optimization

Do NOT use `unoptimized` on `<Image />` unless there's a documented reason (external CDN, etc.). Next.js optimization should be enabled by default.

### 7. `cn()` for className merging

Always use `cn()` from `@/lib/utils` — never template strings or manual concatenation.

```tsx
className={cn("base-class", condition && "active-class", props.className)}
```

## Tech Notes

- **shadcn style**: `radix-nova` (newer shadcn convention)
- **Components dir**: `modules/homePage/components/ui/` (not root `components/`)
- **Three.js / postprocessing**: `PixelBlast.tsx` depends on both — known to cause Turbopack resolution issues with relative imports
- **Fonts**: Manrope (body), Syne (headings), Space Grotesk (labels) — loaded via `next/font/google`
- **Dark mode**: supported via `.dark` class on parent
- **Target locale**: Spanish (Dominican Republic) — `es_DO`
