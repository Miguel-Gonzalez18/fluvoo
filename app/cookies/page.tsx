import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, BarChart3, Megaphone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Conoce cómo Fluvoo utiliza cookies para mejorar tu experiencia, medir el uso del sitio y gestionar preferencias de privacidad.",
  alternates: {
    canonical: "/cookies",
  },
};

const cookieRows = [
  {
    type: "Esenciales",
    purpose: "Habilitan funciones básicas del sitio como navegación segura y gestión de sesión.",
    examples: "cookie_consent_given, cookie_preferences",
    duration: "6 meses",
    canDisable: "No",
    icon: ShieldCheck,
  },
  {
    type: "Analítica",
    purpose: "Nos ayudan a entender el uso del producto para mejorar el rendimiento y la experiencia.",
    examples: "Cookies de medición anónima (GTM/Analytics)",
    duration: "Hasta 13 meses",
    canDisable: "Sí",
    icon: BarChart3,
  },
  {
    type: "Marketing",
    purpose: "Permiten personalizar campañas y anuncios relevantes según interacción con el sitio.",
    examples: "Cookies publicitarias (si las autorizas)",
    duration: "Hasta 13 meses",
    canDisable: "Sí",
    icon: Megaphone,
  },
] as const;

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
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
              <Cookie className="h-3.5 w-3.5" />
              Política de cookies
            </p>
            <h1 className="text-balance text-3xl font-bold text-neutral-900 md:text-5xl">
              Transparencia total sobre el uso de cookies en Fluvoo
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
              En esta página te explicamos qué cookies utilizamos, para qué sirven y cómo puedes
              gestionar tu consentimiento en cualquier momento desde el aviso de preferencias.
            </p>
            <p className="text-xs font-medium text-neutral-500">Última actualización: 19 de abril de 2026</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">¿Qué son las cookies?</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Las cookies son pequeños archivos de texto que un sitio web guarda en tu navegador.
              Nos permiten recordar tus preferencias, mejorar la estabilidad del sitio y ofrecer una
              experiencia más útil para ti.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">¿Cómo usamos las cookies?</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Utilizamos cookies esenciales para operar la plataforma y, solo con tu autorización,
              cookies de analítica y marketing para entender mejor el comportamiento de navegación y
              optimizar la comunicación.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Tipos de cookies que utilizamos</h2>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead className="bg-neutral-100/80 text-xs uppercase tracking-wide text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Finalidad</th>
                    <th className="px-4 py-3 font-semibold">Duración</th>
                    <th className="px-4 py-3 font-semibold">Desactivable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {cookieRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <tr key={row.type} className="align-top">
                        <td className="px-4 py-4">
                          <p className="inline-flex items-center gap-2 font-semibold text-neutral-900">
                            <Icon className="h-4 w-4 text-primary" />
                            {row.type}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">{row.examples}</p>
                        </td>
                        <td className="px-4 py-4 text-neutral-700">{row.purpose}</td>
                        <td className="px-4 py-4 text-neutral-700">{row.duration}</td>
                        <td className="px-4 py-4 text-neutral-700">{row.canDisable}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Gestionar tus preferencias</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Puedes aceptar, rechazar o personalizar las cookies desde el recuadro de consentimiento
              que aparece en la web. Tus preferencias se guardan localmente para respetar tu elección.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Cookies de terceros</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Algunas herramientas externas, como plataformas de analítica o medición, pueden instalar
              cookies cuando nos das consentimiento para esas categorías.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Contacto</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Si tienes dudas sobre esta política de cookies o sobre el tratamiento de datos,
              escríbenos y te responderemos a la brevedad.
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
