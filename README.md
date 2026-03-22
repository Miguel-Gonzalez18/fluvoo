# PesoFlujo 💰

> **Claridad financiera para cada dominicano.**

PesoFlujo is an AI-powered personal finance assistant built for the Dominican Republic. It helps salaried employees, freelancers, and small business owners understand where their money goes, plan their savings, and make smarter financial decisions — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## What is PesoFlujo?

Most personal finance apps are designed for the US or European markets. PesoFlujo is built from the ground up for the Dominican reality: peso-denominated accounts, TSS/SFS/SIPEN deductions, DGII tax obligations, ARS health insurance, and the mix of formal and informal income that's common across the country.

The app connects to your bank notifications through Gmail (read-only, with your explicit permission), automatically detects and categorizes your transactions, and uses AI to give you a plain-language summary of your financial health every month. It also includes a suite of local financial calculators and a savings assistant that builds personalized plans based on your actual income and expenses.

---

## Features

**Automatic transaction detection.** Connect your Gmail and PesoFlujo reads the notification emails your bank already sends you — without ever accessing your bank account or storing any credentials.

**AI financial analysis.** Get a monthly summary of your finances written in plain Spanish, with observations about your spending patterns and suggestions you can act on.

**Personalized savings plans.** Tell the AI assistant your savings goal and it builds a realistic, step-by-step plan based on your real numbers. The plan adapts as your situation changes.

**Dominican financial calculators.** Calculate your net salary with TSS/SFS/SIPEN, estimate your ISR tax, project your SIPEN pension, calculate loan payments, and more — all aligned with current Dominican regulations.

**Receipt scanning.** Take a photo of a receipt and the app reads it automatically, pulling the merchant name, amount, and date so you don't have to type anything.

**Three user profiles.** The app adapts its dashboard and tools depending on whether you're a salaried employee, an independent professional, or a business owner.

---

## Tech Stack

PesoFlujo is built with **Next.js 14** and **TypeScript** on the frontend and backend, **Supabase** for the database and authentication, **shadcn/ui** with **Tailwind CSS** for the interface, and the **Anthropic Claude API** for all AI features. Receipt scanning uses **Google Vision API**, and bank notification parsing uses the **Gmail API** via Google OAuth.

---

## Getting Started

### Prerequisites

You'll need Node.js 20+, a [Supabase](https://supabase.com) project, a [Google Cloud](https://console.cloud.google.com) project with the Gmail API and Vision API enabled, and an [Anthropic](https://console.anthropic.com) API key.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pesoflujo.git
cd pesoflujo

# Install dependencies
npm install

# Set up your environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Google (Gmail + Vision APIs)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=
```

---

## Roadmap

The current version covers the core personal finance experience for individual users. Planned features for future versions include a business module with cash flow tracking and payroll tools for business owners, PDF and CSV bank statement imports, a weekly financial summary delivered by email, multi-currency support for users with USD accounts, and a mobile-optimized progressive web app experience.

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the proposed change. Make sure your code follows the existing TypeScript and formatting conventions, and that any new calculator logic references the official Dominican regulatory source it's based on.

---

## License

MIT © PesoFlujo