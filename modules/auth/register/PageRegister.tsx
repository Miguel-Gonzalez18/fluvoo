import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./components/RegisterForm";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TrendingUp, ShieldCheck } from "lucide-react";
import { Separator } from "@/modules/shared/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "./components/ui/avatar";
import { FluvooLogo } from "@/modules/shared/components/FluvooLogo";

export const metadata: Metadata = {
  title: "Crear cuenta | Fluvoo",
  description: "Regístrate en Fluvoo y comienza a gestionar tus finanzas personales.",
};

export default function PageRegister() {
  return (
    <main className="flex min-h-dvh">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-3/5 flex-col p-8 relative overflow-hidden bg-neutral-900">
        <AnimatedBackground />
        <div className="absolute inset-0 z-10 bg-black/70"></div>

        <div className="w-full h-full flex flex-col justify-between relative z-10">
          {/* Logo */}
          <div className="space-y-2">
            <Link href="/">
                <span className="font-heading text-3xl font-bold text-primary">Fluvoo</span>
            </Link>
            <p className="text-xs font-medium text-white/90 leading-relaxed">
                Claridad financiera para cada dominicano.
            </p>
          </div>

          {/* Premium Branding */}
          <div className="space-y-6">
            <div>
            <span className="text-sm text-white/90">
                Fluvoo Premium
              </span>
              <h2 className="font-heading text-4xl font-bold text-white mb-2">
                Domina tu flujo de caja.
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 rounded-lg p-3 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Control Absoluto</h3>
                  <p className="text-white/80 text-sm">
                    Monitorea cada centavo con precisión bancaria y obtén insights en tiempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 rounded-lg p-3 shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Crecimiento Inteligente</h3>
                  <p className="text-white/80 text-sm">
                    Algoritmos de IA que analizan tus patrones y sugieren optimizaciones financieras.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

          {/* Social Proof */}
            <div className="flex items-center gap-4">
              <AvatarGroup className="grayscale">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/maxleiter.png"
                    alt="@maxleiter"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+3</AvatarGroupCount>
              </AvatarGroup>
              <p className="text-white/80 text-sm font-medium">
                Únete a más de 5,000 asalariados dominicanos.
              </p>
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Link href="/">
              <FluvooLogo />
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white px-6 py-12">
        <RegisterForm />
      </div>
    </main>
  );
}

