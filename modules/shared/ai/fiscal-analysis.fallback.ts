import type {
  FiscalAnalysisContext,
  FiscalAnalysisResponse,
} from "@/modules/shared/ai/fiscal-analysis.schema";

function formatDop(amount: number): string {
  return `RD$${amount.toLocaleString("es-DO")}`;
}

function tipPriority(index: number): "1" | "2" | "3" {
  return String(Math.min(3, Math.max(1, index))) as "1" | "2" | "3";
}

export function buildFallbackFiscalAnalysis(
  context: FiscalAnalysisContext
): FiscalAnalysisResponse {
  if (!context.hasSalary) {
    return {
      diagnosis:
        "Todavía no tengo tu salario configurado, así que no puedo medir bien tu margen del mes. Completa tu perfil y registra tus obligaciones para darte un diagnóstico que valga la pena.",
      tips: [
        {
          id: "completar-salario",
          title: "Configura tu ingreso mensual",
          description:
            "Sin tu salario bruto y las deducciones TSS no podemos calcular margen ni estimar ISR. Hazlo en tu perfil hoy.",
          iconKey: "wallet",
          priority: "1",
        },
        {
          id: "registrar-obligaciones",
          title: "Registra tus pagos fijos",
          description:
            "Agrega alquiler, servicios, préstamos y tarjetas en onboarding para ver gastos reales, no solo compras sueltas.",
          iconKey: "home",
          priority: "2",
        },
      ],
    };
  }

  if (context.dataCompleteness === "low") {
    return {
      diagnosis: `Con un ingreso neto de ${formatDop(context.netIncomeMonthly)}, tus gastos del mes suman ${formatDop(context.expensesThisMonth)}, pero aún faltan datos (transacciones u obligaciones) para afinar el panorama.`,
      tips: [
        {
          id: "conectar-gmail",
          title: context.gmailConnected
            ? "Deja que Gmail sincronice"
            : "Conecta Gmail para ver gastos reales",
          description: context.gmailConnected
            ? "Espera la próxima sincronización o revisa que tus bancos estén conectados para capturar compras del mes."
            : "Con Gmail conectado Fluvoo detecta gastos del día a día y mejora este análisis automáticamente.",
          iconKey: "smartphone",
          priority: "1",
        },
        {
          id: "completar-obligaciones",
          title: "Carga préstamos y tarjetas",
          description:
            "Sin deudas registradas el margen se ve mejor de lo que realmente está. Pon TC, cuotas y préstamos en onboarding.",
          iconKey: "credit-card",
          priority: "2",
        },
      ],
    };
  }

  const marginLine =
    context.marginPercent !== null
      ? `Tu margen del mes es ${formatDop(context.marginMonthly)} (${context.marginPercent}% del ingreso).`
      : `Tu margen del mes es ${formatDop(context.marginMonthly)}.`;

  const diagnosis =
    context.marginMonthly <= 0
      ? `${marginLine} Estás en rojo este mes: los gastos y pagos igualan o superan lo que entra. Hay que ajustar ya, sin mañana.`
      : context.marginPercent !== null && context.marginPercent < 10
        ? `${marginLine} Vas ajustado; un imprevisto te complica el mes si no vigilas deudas y compras discrecionales.`
        : `${marginLine} Tienes espacio, pero conviene proteger ese colchón y no dejar que las deudas se coman el margen.`;

  const tips: FiscalAnalysisResponse["tips"] = [];

  if (context.debtPaymentsMonthly > 0) {
    const debtShare =
      context.expensesThisMonth > 0
        ? Math.round(
            (context.debtPaymentsMonthly / context.expensesThisMonth) * 100
          )
        : 0;
    tips.push({
      id: "vigilar-deudas",
      title: "Prioriza tus deudas del mes",
      description: `Tus préstamos y tarjetas suman ~${formatDop(context.debtPaymentsMonthly)} (${debtShare}% de gastos). Paga a tiempo para no pagar recargos ni intereses extra.`,
      iconKey: "credit-card",
      priority: "1",
    });
  }

  if (context.nextPayment && context.nextPayment.daysUntil !== null) {
    tips.push({
      id: "proximo-pago",
      title: `Prepárate para ${context.nextPayment.label}`,
      description: `En ${context.nextPayment.daysUntil} día${context.nextPayment.daysUntil === 1 ? "" : "s"} toca un pago de ~${formatDop(context.nextPayment.amount)}. Separa ese monto antes de gastarlo en otra cosa.`,
      iconKey: "calendar",
      priority: tips.length === 0 ? "1" : "2",
    });
  }

  const top = context.topCategories[0];
  if (top && tips.length < 3) {
    tips.push({
      id: "categoria-top",
      title: `Revisa ${top.name}`,
      description: `Es tu categoría más fuerte del mes (${formatDop(top.amount)}, ~${top.percent}%). Mira si hay recortes fáciles sin afectar lo esencial.`,
      iconKey: "trending-down",
      priority: tipPriority(tips.length + 1),
    });
  }

  if (context.isr && tips.length < 3) {
    tips.push({
      id: "planifica-isr",
      title: "Ten presente tu ISR estimado",
      description: `Tu retención mensual estimada ronda ${formatDop(context.isr.monthlyEstimate)} (tramo ${context.isr.bracket}). No lo mezcles con dinero de gastos diarios.`,
      iconKey: "shield-check",
      priority: tipPriority(tips.length + 1),
    });
  }

  while (tips.length < 2) {
    tips.push({
      id: "colchon-emergencia",
      title: "Arma un colchón mínimo",
      description:
        "Aunque el mes vaya bien, aparta algo fijo cada quincena para emergencias antes de subir gastos variables.",
      iconKey: "piggy-bank",
      priority: tipPriority(tips.length + 1),
    });
  }

  return {
    diagnosis,
    tips: tips
      .sort((a, b) => Number(a.priority) - Number(b.priority))
      .slice(0, 3)
      .map((tip, index) => ({
        ...tip,
        priority: String(index + 1) as "1" | "2" | "3",
      })),
  };
}
