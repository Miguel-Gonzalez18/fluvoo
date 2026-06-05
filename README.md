# fluvoo 💰

> **Claridad financiera para cada dominicano.**

fluvoo is an AI-powered personal finance assistant built for the Dominican Republic. It helps salaried employees, freelancers, and small business owners understand where their money goes, plan their savings, and make smarter financial decisions — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

---

## What is fluvoo?

Most personal finance apps are designed for the US or European markets. fluvoo is built from the ground up for the Dominican reality: peso-denominated accounts, TSS/SFS/SIPEN deductions, DGII tax obligations, and the mix of formal and informal income that's common across the country.

The app connects to bank notifications through Gmail (read-only, with your explicit permission), automatically detects and categorizes transactions, and uses AI to deliver plain-language financial insights. It includes local financial calculators and a savings assistant tailored to your actual income and expenses.

---

## Features

**Landing & onboarding.** Marketing site with SEO, cookie consent (GTM), and a 3-step onboarding flow with profile selection and financial setup.

**Integrated ISR tax calculator.** Real-time tax calculation during onboarding following DGII regulations:
- **Asalariados:** TSS (5.91%) with salary caps, progressive ISR scale
- **Freelancers:** Simplified deduction or itemized expenses, withholding tracking
- **Empresas:** Corporate tax preview (PRO module coming soon)

**Auth & profiles.** Supabase authentication with employee and freelancer dashboards (WIP pages).

**Dominican financial calculators.** Net salary, ISR, SIPEN, AFP, loans — aligned with local regulations.

**Three user profiles.** Employee, freelancer, and business owner (PRO, coming soon).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4, shadcn/ui (radix-nova) |
| Backend / Auth | Supabase (PostgreSQL + SSR auth) |
| Forms | react-hook-form + Zod |
| Animation | GSAP, Framer Motion, Three.js |
| Package manager | pnpm |

Planned integrations: Anthropic Claude / Google Gemini (AI), Gmail API (bank notifications), Google Vision (receipt scanning).

---

## Project Structure

```
app/                 ← Thin routes (metadata + guards + delegate to modules)
modules/
  homePage/          ← Landing page
  onboarding/      ← Onboarding flow + tax summary
  auth/              ← Login & register
  dashboard/         ← Employee / freelancer / business layouts & pages
  legal/             ← Privacy, cookies, terms
  shared/            ← UI primitives, tax engine, auth actions
src/lib/             ← Supabase client/server + session proxy
lib/utils.ts         ← cn() helper
proxy.ts             ← Session middleware (Next.js 16)
supabase/migrations/ ← SQL migrations
```

Import convention: use `@/modules/...` when crossing module boundaries. Shared UI can be imported from `@/modules/shared/components/ui` (barrel) or individual files.

See `AGENTS.md` for full contributor guidelines.

---

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io)
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/your-username/fluvoo.git
cd fluvoo

pnpm install

cp .env.example .env.local
# Fill in Supabase URL and publishable key

pnpm dev
```

The app runs at `http://localhost:3000`.

### Database migrations

Apply SQL migrations from `supabase/migrations/` to your Supabase project (via Supabase CLI or Dashboard SQL editor).

### Environment Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### Scripts

```bash
pnpm dev      # Development server (Turbopack)
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # ESLint
```

---

## Roadmap

- Business module (cash flow, payroll, ITBIS)
- Gmail transaction detection
- AI monthly summaries and savings plans
- Receipt scanning
- PDF/CSV bank statement imports
- PWA mobile experience

---

## Contributing

Contributions are welcome. Open an issue before submitting a pull request. Follow the conventions in `AGENTS.md`. Calculator logic must reference official Dominican regulatory sources (DGII, TSS).

---

## License

MIT © fluvoo
