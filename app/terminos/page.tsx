import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  CreditCard,
  Mail,
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

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">

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

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              7. Limitación de responsabilidad
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo no es responsable de decisiones financieras tomadas con
              base en los análisis o recomendaciones de la plataforma. El
              servicio se ofrece &ldquo;tal cual&rdquo; y, aunque trabajamos para mantenerlo
              disponible 24/7, no garantizamos que esté libre de errores o
              interrupciones. En ningún caso nuestra responsabilidad excederá
              el valor del plan pagado en los últimos 3 meses.
            </p>
          </div>

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
