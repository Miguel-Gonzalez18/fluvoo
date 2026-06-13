"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { SUPPORTED_BANKS, GMAIL_FEATURES } from "../../config/gmail";
import { Step3GmailConnectProps } from "../../types/step3/gmail.types";

export function Step3GmailConnect({ onConnect, onSkip }: Step3GmailConnectProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8 text-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
            Detecta tus gastos automáticamente
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Conecta el correo donde llegan las notificaciones de tu banco para sincronizar tus transacciones en tiempo real sin esfuerzo manual.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-sm mx-auto space-y-4">
        {GMAIL_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground">
                <span className="font-medium">{feature.title}:</span>{" "}
                <span className="text-muted-foreground">{feature.description}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Banks */}
      <div className="text-center space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Bancos compatibles
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {SUPPORTED_BANKS.map((bank) => (
            <span
              key={bank}
              className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground"
            >
              {bank}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 max-w-sm mx-auto">
        <Button
          onClick={onConnect}
          className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Conectar Gmail
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="w-full"
        >
          Omitir por ahora
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs mx-auto">
        Puedes conectar tu correo más tarde desde los ajustes de la aplicación. Tus datos están cifrados de extremo a extremo.
      </p>

      <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto leading-relaxed">
        Conectar Gmail detecta transacciones generales. El seguimiento por tarjeta de crédito es opcional y requiere activarlo en Transacciones con los últimos 4 dígitos de tu plástico.
      </p>
    </div>
  );
}
