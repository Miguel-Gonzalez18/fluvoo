"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function ComingSoonPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f3f6f2] text-zinc-900">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(5,150,105,0.18),transparent_45%),radial-gradient(ellipse_at_85%_75%,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,#f7faf6_0%,#eef4ee_55%,#e8f0e8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.55%22/%3E%3C/svg%3E')]"
      />

      {/* Soft floating shapes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[8%] size-72 rounded-full bg-primary/15 blur-3xl"
        animate={{ y: [0, 28, 0], x: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-6%] bottom-[8%] size-96 rounded-full bg-emerald-300/20 blur-3xl"
        animate={{ y: [0, -36, 0], x: [0, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-10 sm:py-14">
        <motion.header
          className="flex items-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <Image
            src="/logo.svg"
            alt="Fluvoo"
            width={120}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </motion.header>

        <section className="flex flex-1 flex-col justify-center py-16 sm:py-20">
          <motion.p
            className="font-label text-xs font-medium uppercase tracking-[0.28em] text-primary-700"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            En construcción
          </motion.p>

          <motion.h1
            className="mt-5 max-w-3xl font-heading text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-zinc-900"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease }}
          >
            Estamos
            <br />
            <span className="text-highlight">construyendo</span>
            <br />
            algo nuevo.
          </motion.h1>

          <motion.p
            className="mt-8 max-w-md font-sans text-base leading-relaxed text-zinc-600 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            La versión anterior de Fluvoo se queda atrás. Ahora estamos
            cocinando algo distinto — más útil, más claro, hecho con calma
            desde República Dominicana.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <span className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              En progreso
            </span>
            <a
              href="mailto:hola@fluvoo.com"
              className="font-label text-sm text-zinc-700 underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-700 hover:decoration-primary"
            >
              hola@fluvoo.com
            </a>
          </motion.div>
        </section>

        <motion.footer
          className="flex items-end justify-between gap-4 border-t border-zinc-900/8 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65, ease }}
        >
          <p className="font-label text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            Pronto · 2026
          </p>
          <p className="max-w-[14rem] text-right text-xs leading-snug text-zinc-500">
            Gracias por pasar. Vuelve pronto — vale la pena.
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
