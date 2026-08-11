import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./components/LoginForm";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Iniciar sesión | Fluvoo",
  description: "Ingresa a tu cuenta de Fluvoo para gestionar tus finanzas personales.",
};

export default function PageLogin() {
  return (
    <main className="flex min-h-dvh">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-3/5 flex-col p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/20 to-neutral-black pointer-events-none"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/video/poster-video-login.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center -z-10"
        >
          <source src="/video/Video-Login.mp4" type="video/mp4" />
          <source src="/video/Video-Login.webm" type="video/webm" />
        </video>

        <div className="w-full h-full flex flex-col justify-between relative z-10">
            <div className="space-y-2">
                <Link href="/">
                    <span className="font-heading text-3xl font-bold text-white">Fluvoo</span>
                </Link>
                <p className="text-xs font-medium text-white/90 leading-relaxed">
                    Estamos construyendo algo nuevo.
                </p>
            </div>

          {/* Feature buttons */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs text-neutral-800 font-bold">Conecta tus bancos dominicanos</span>
            </div>
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs text-neutral-800 font-bold">Análisis financiero con IA</span>
            </div>
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs text-neutral-800 font-bold">Calculadoras para la RD</span>
            </div>
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs text-neutral-800 font-bold">Metas de ahorro personalizadas</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-neutral-50 px-6 py-12">
        <LoginForm />
      </div>
    </main>
  );
}