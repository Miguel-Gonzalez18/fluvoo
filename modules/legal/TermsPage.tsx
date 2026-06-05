import Link from "next/link";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Mail,
  Scale,
} from "lucide-react";
import { LegalPageHero } from "@/modules/legal/components/LegalPageHero";
import { termsLastUpdated } from "@/modules/legal/config/termsData";

export function TermsPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      <LegalPageHero
        badgeIcon={FileText}
        badgeLabel="Términos y condiciones"
        title="Términos y condiciones de uso de Fluvoo"
        description="Al registrarte y usar Fluvoo, aceptas estos términos. Te recomendamos leerlos completos — están escritos en lenguaje claro, sin letra pequeña."
        lastUpdated={termsLastUpdated}
      />

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">1. Aceptación de los términos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Al crear una cuenta o usar cualquier función de Fluvoo, confirmas que tienes al menos 18 años,
              que has leído y aceptas estos términos y nuestra Política de Privacidad. Si no los aceptas,
              no puedes usar la plataforma.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">2. Descripción del servicio</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo es un asistente financiero personal que te ayuda a visualizar tus ingresos, gastos y metas
              mediante inteligencia artificial. El servicio incluye:
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
              <strong className="text-neutral-800">Importante:</strong> Fluvoo es una herramienta de educación y
              organización financiera personal. Las recomendaciones generadas por IA son orientativas y no
              constituyen asesoría financiera profesional ni legal. Para decisiones financieras importantes,
              consulta a un profesional certificado.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">3. Tu cuenta y responsabilidades</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Eres responsable de mantener la confidencialidad de tus credenciales de acceso. Debes notificarnos
              de inmediato si detectas acceso no autorizado a tu cuenta en{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">hola@fluvoo.com</a>.
              La información financiera que ingresas en la plataforma es responsabilidad tuya — Fluvoo no verifica
              la veracidad de los datos que introduces.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">4. Uso aceptable</h2>
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
                Intentar acceder a cuentas de otros usuarios o a la infraestructura de la plataforma
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
            <h2 className="text-xl font-semibold text-neutral-900">5. Planes y pagos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo ofrece un plan gratuito con funciones básicas y planes de pago con funciones avanzadas.
              Los precios se muestran en la plataforma y pueden variar. Al suscribirte a un plan de pago:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                El cobro se realiza por adelantado en el ciclo seleccionado (mensual o anual)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Puedes cancelar en cualquier momento — el acceso se mantiene hasta el final del período pagado
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                No ofrecemos reembolsos proporcionales por cancelaciones a mitad de período, salvo error de facturación
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">6. Propiedad intelectual</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo y todos sus elementos — nombre, logo, diseño, código, funcionalidades y contenido editorial
              — son propiedad de Fluvoo. No puedes copiarlos, reproducirlos ni usarlos sin autorización escrita.
              Los datos que tú introduces en la plataforma son exclusivamente tuyos.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">7. Limitación de responsabilidad</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Fluvoo no es responsable de decisiones financieras tomadas con base en los análisis o recomendaciones
              de la plataforma. El servicio se ofrece &ldquo;tal cual&rdquo; y, aunque trabajamos para mantenerlo
              disponible 24/7, no garantizamos que esté libre de errores o interrupciones. En ningún caso nuestra
              responsabilidad excederá el valor del plan pagado en los últimos 3 meses.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">8. Terminación del servicio</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Puedes eliminar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o eliminar
              cuentas que incumplan estos términos, con notificación previa salvo en casos de fraude o actividad
              ilegal donde la suspensión puede ser inmediata.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">9. Ley aplicable y resolución de conflictos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Estos términos se rigen por las leyes vigentes de la República Dominicana. Ante cualquier disputa,
              priorizamos la resolución amistosa directa. Para iniciar ese proceso, escríbenos a{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">hola@fluvoo.com</a>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">10. Cambios en los términos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Podemos modificar estos términos en cualquier momento. Los cambios sustanciales se notifican por
              correo con 15 días de anticipación. El uso continuado de la plataforma después de la notificación
              implica aceptación de los nuevos términos.
            </p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-neutral-900">Resumen en lenguaje simple</h3>
            </div>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 font-bold text-primary">✓</span>
                Fluvoo es una herramienta de apoyo, no un asesor financiero certificado
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 font-bold text-primary">✓</span>
                Tus datos son tuyos — no los vendemos
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 font-bold text-primary">✓</span>
                Puedes cancelar cuando quieras, sin penalidades
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 font-bold text-primary">✓</span>
                Ante cualquier problema, escríbenos primero
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Nota importante</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              Las recomendaciones de Fluvoo son generadas por inteligencia artificial con base en la información
              que tú provees. No reemplazan la asesoría de un contador, planificador financiero o abogado
              certificado para decisiones complejas.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Planes disponibles</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Empieza gratis con el plan básico. Los planes de pago se detallan en la página de precios con
              todas las funciones incluidas.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Páginas relacionadas</h3>
            <div className="mt-3 space-y-2">
              <Link href="/privacidad" className="flex items-center gap-2 text-sm text-primary hover:underline">
                → Política de Privacidad
              </Link>
              <Link href="/cookies" className="flex items-center gap-2 text-sm text-primary hover:underline">
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
