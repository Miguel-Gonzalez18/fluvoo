import Link from "next/link";
import { Lock, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { LegalPageHero } from "@/modules/legal/components/LegalPageHero";
import { privacyDataRows, privacyLastUpdated } from "@/modules/legal/config/privacyData";

export function PrivacyPolicyPage() {
  return (
    <main className="min-h-dvh bg-neutral-50">
      <LegalPageHero
        badgeIcon={ShieldCheck}
        badgeLabel="Política de privacidad"
        title="Cómo Fluvoo protege y gestiona tu información personal"
        description="Tu privacidad no es negociable. Esta política explica qué datos recopilamos, cómo los usamos, con quién los compartimos y cuáles son tus derechos sobre tu información en todo momento."
        lastUpdated={privacyLastUpdated}
      />

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
            <div className="flex flex-col gap-3 md:hidden">
              {privacyDataRows.map((row) => {
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
                  {privacyDataRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <tr key={row.category} className="align-top">
                        <td className="px-4 py-4">
                          <p className="inline-flex items-center gap-2 font-semibold text-neutral-900">
                            <Icon className="h-4 w-4 text-primary" />
                            {row.category}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">{row.examples}</p>
                        </td>
                        <td className="px-4 py-4 text-neutral-700">{row.purpose}</td>
                        <td className="px-4 py-4 text-neutral-700">{row.retention}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">3. Base legal del tratamiento</h2>
            <p className="text-sm leading-relaxed text-neutral-600">Tratamos tus datos con base en:</p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Ejecución del contrato:</strong>{" "}
                  para prestarte el servicio de asistente financiero que solicitas al registrarte.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Consentimiento:</strong>{" "}
                  para el uso de cookies no esenciales, comunicaciones de marketing y análisis de comportamiento.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-neutral-800">Interés legítimo:</strong>{" "}
                  para la seguridad de la plataforma, prevención de fraude y mejora del producto.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">4. Seguridad de tus datos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Toda la información se transmite cifrada mediante HTTPS/TLS. Tus datos financieros se almacenan
              en servidores seguros gestionados por Supabase con cifrado en reposo. Las contraseñas se almacenan
              con hashing seguro y nunca en texto plano. Aplicamos controles de acceso estrictos: solo el equipo
              autorizado puede acceder a datos de producción bajo auditoría.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">5. ¿Con quién compartimos tus datos?</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              No vendemos tu información. Solo la compartimos con proveedores de servicios que nos ayudan a
              operar la plataforma, bajo acuerdos de confidencialidad:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-neutral-800">Supabase</strong> — Infraestructura de base de datos y autenticación (Estados Unidos)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-neutral-800">Vercel</strong> — Hosting y despliegue de la aplicación (Estados Unidos)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-neutral-800">Google (Analytics/GTM)</strong> — Análisis de uso anónimo, solo si das tu consentimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-neutral-800">Anthropic (Claude AI)</strong> — Procesamiento de análisis financiero con inteligencia artificial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><strong className="text-neutral-800">Google (Gemini AI)</strong> — Procesamiento de análisis financiero con inteligencia artificial</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">6. Tus derechos sobre tus datos</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Tienes derecho a acceder a tus datos, corregirlos, solicitar su eliminación, oponerte a ciertos
              usos y portarlos a otro servicio. Para ejercer cualquiera de estos derechos escríbenos a{" "}
              <a href="mailto:hola@fluvoo.com" className="text-primary hover:underline">hola@fluvoo.com</a>{" "}
              con asunto &ldquo;Derechos de privacidad&rdquo;. Respondemos en un plazo máximo de 30 días hábiles.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">7. Cambios en esta política</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Podemos actualizar esta política periódicamente. Cuando lo hagamos, actualizaremos la fecha al
              inicio de la página y, si los cambios son significativos, te notificaremos por correo electrónico
              con al menos 15 días de anticipación.
            </p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-neutral-900">Tu información, tu control</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              Nunca vendemos tus datos financieros. La información que ingresas en Fluvoo se usa exclusivamente
              para darte análisis y recomendaciones personalizadas. Eres el único dueño de tus datos.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Eliminar tu cuenta</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Puedes solicitar la eliminación completa de tu cuenta y todos tus datos en cualquier momento.
              Procesamos las solicitudes en un plazo de 30 días y te confirmamos por correo cuando se completa.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Páginas relacionadas</h3>
            <div className="mt-3 space-y-2">
              <Link href="/cookies" className="flex items-center gap-2 text-sm text-primary hover:underline">
                → Política de Cookies
              </Link>
              <Link href="/terminos" className="flex items-center gap-2 text-sm text-primary hover:underline">
                → Términos y Condiciones
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Contacto</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Para cualquier consulta sobre privacidad o el tratamiento de tus datos, escríbenos directamente.
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
