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

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              1. Responsable del tratamiento de datos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo (en adelante, &ldquo;nosotros&rdquo; o &ldquo;la plataforma&rdquo;) es responsable
              del tratamiento de tus datos personales. Operamos desde República
              Dominicana y atendemos cualquier solicitud relacionada con tus
              datos a través de{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">
                hola@fluvoo.com
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              2. Datos que recopilamos y para qué los usamos
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Solo recopilamos los datos necesarios para ofrecerte el servicio.
              Nunca vendemos ni cedemos tu información a terceros con fines
              comerciales propios.
            </p>
            {/* Mobile: cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {dataRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.category} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                    <p className="inline-flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      {row.category}
                    </p>
                    <p className="text-xs text-neutral-500">{row.examples}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Finalidad</p>
                      <p className="text-sm text-neutral-700">{row.purpose}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Retención</p>
                      <p className="text-sm text-neutral-700">{row.retention}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-200">
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
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Google (Gemini AI)</strong> —
                  Procesamiento de análisis financiero con inteligencia artificial
                </span>
              </li>
            </ul>
          </div>

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
              con asunto &ldquo;Derechos de privacidad&rdquo;. Respondemos en un plazo
              máximo de 30 días hábiles.
            </p>
          </div>

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
