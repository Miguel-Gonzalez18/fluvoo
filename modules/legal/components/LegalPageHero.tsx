import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface LegalPageHeroProps {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  title: string;
  description: string;
  lastUpdated: string;
}

export function LegalPageHero({
  badgeIcon: BadgeIcon,
  badgeLabel,
  title,
  description,
  lastUpdated,
}: LegalPageHeroProps) {
  return (
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
            <BadgeIcon className="h-3.5 w-3.5" />
            {badgeLabel}
          </p>
          <h1 className="text-balance text-3xl font-bold text-neutral-900 md:text-5xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
            {description}
          </p>
          <p className="text-xs font-medium text-neutral-500">
            Última actualización: {lastUpdated}
          </p>
        </div>
      </div>
    </section>
  );
}
