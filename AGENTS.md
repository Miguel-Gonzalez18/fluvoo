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
app/                    ← Next.js App Router (thin routes + layouts only)
  (auth)/login|register ← delegates to modules/auth
  onboarding/           ← auth guard + delegates to modules/onboarding
  dashboard/            ← profile-based redirect
  employee/*            ← layout delegates to modules/dashboard/employee
  freelancer/*          ← layout delegates to modules/dashboard/freelancer
  privacidad|cookies|terminos ← delegates to modules/legal
  page.tsx              ← coming soon → modules/comingSoon
modules/
  comingSoon/           ← public coming-soon notice page
  onboarding/           ← 3-step onboarding + tax summary
  auth/                 ← login + register
  dashboard/            ← employee/freelancer layouts + sidebars + pages
  legal/                ← privacy, cookies, terms pages + config data
  shared/               ← cross-feature UI, tax engine, auth actions, cookies
src/lib/                ← Supabase SSR client/server + session proxy
lib/utils.ts            ← cn() utility (clsx + tailwind-merge)
app/globals.css         ← Tailwind v4 + theme vars + @utility defs
proxy.ts                ← session middleware (Next.js 16)
```

## Critical Rules

### 1. Imports: ALWAYS use `@/` aliases when crossing module boundaries

Turbopack fails to resolve relative imports (`../ui/button`) across module boundaries. Always use absolute paths:

```tsx
// ✅ Correct — shared UI (barrel or direct file)
import { Button } from "@/modules/shared/components/ui";
import { Input } from "@/modules/shared/components/ui/input";

// ✅ Correct — within same module (optional: relative is OK inside a feature)
import { useOnboarding } from "@/modules/onboarding/hooks/useOnboarding";

// ❌ Breaks Turbopack across modules
import { Button } from "../ui/button";
```

When importing from `app/` into modules, always use `@/modules/...` — never `../../../modules/...`.

### 2. UI component placement

- **Shared UI** (Button, Input, Switch, Accordion, Sidebar, etc.) → `modules/shared/components/ui/`
- **Public notice page** → `modules/comingSoon/`
- **Never** import from feature modules into unrelated features — prefer `shared`.

### 3. Route files stay thin

`app/**/page.tsx` should only contain: metadata, server guards (auth/redirect), and a single delegate to `modules/`:

```tsx
import { OnboardingPage } from "@/modules/onboarding/OnboardingPage";
export default function OnboardingRoute() { /* guards */ return <OnboardingPage />; }
```

### 4. Tailwind v4 — no dynamic class names

Tailwind v4 scans source files at build time. String interpolation like `bg-${color}` will be purged. Use a mapping object:

```tsx
const badgeMap: Record<string, string> = {
  primary: "bg-primary",
  black: "bg-black",
};
// Then: badgeMap[color] ?? "bg-neutral-500"
```

### 5. Repeated gradient → use `@utility`

The highlight gradient `text-highlight` is defined in `app/globals.css` as:
```css
@utility text-highlight {
  background-image: linear-gradient(180deg, transparent 55%, rgba(52, 168, 100, 0.22) 55%);
}
```
Use `text-highlight` — never inline the gradient again.

### 6. Metadata lives in root `layout.tsx`

`app/layout.tsx` defines full OpenGraph, Twitter cards, and Schema.org JSON-LD. Child pages (`HomePage.tsx`) should only set `title` and `description`. Do not duplicate `openGraph`, `twitter`, `icons`, etc.

### 7. GSAP animation hooks

- Always use `gsap.context()` with cleanup via `ctx.revert()`
- `useSectionRevealHome` has an intentional empty `[]` deps array — selectors are static, cleanup is handled by context
- GSAP SplitText requires `gsap.registerPlugin(SplitText)` inside the effect

### 8. Image optimization

Do NOT use `unoptimized` on `<Image />` unless there's a documented reason (external CDN, etc.). Next.js optimization should be enabled by default.

### 9. `cn()` for className merging

Always use `cn()` from `@/lib/utils` — never template strings or manual concatenation.

```tsx
className={cn("base-class", condition && "active-class", props.className)}
```

## Tech Notes

- **shadcn style**: `radix-nova` (newer shadcn convention)
- **Shared components dir**: `modules/shared/components/ui/` (barrel: `@/modules/shared/components/ui`)
- **Fonts**: Manrope (body), Syne (headings), Space Grotesk (labels) — loaded via `next/font/google`
- **Dark mode**: supported via `.dark` class on parent
- **Target locale**: Spanish (Dominican Republic) — `es_DO`
