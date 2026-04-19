import { Bot, CircleCheckBig, SlidersHorizontal, Telescope } from "lucide-react";
import type { BenefitItem } from "../types/typesHome";

export const benefitsData: BenefitItem[] = [
    {
        icon: Telescope,
        label: "Ve a dónde va tu dinero",
        cardTitle: "Ve exactamente a dónde va tu dinero cada mes.",
        cardImage: "/images/visibilidad-total.webp",
        cardImageAlt: "Visibilidad total",
        cardDescription: "Fluvoo conecta con las notificaciones de tu banco, categoriza cada gasto automáticamente, y te muestra un panorama completo de tus finanzas sin que tengas que hacer nada. Sabes cuánto ganaste, cuánto gastaste, y cuánto te quedó en tiempo real.",
    },
    {
        icon: SlidersHorizontal,
        label: "Controla sin complicarte",
        cardTitle: "Automatiza tu control financiero sin fórmulas ni hojas de cálculo.",
        cardImage: "/images/sin-complicaciones.webp",
        cardImageAlt: "Sin complicaciones",
        cardDescription: "Fluvoo organiza tus movimientos por ti, detecta patrones en tus gastos y te entrega alertas claras para que tomes decisiones rápido. Menos tiempo interpretando datos, más tiempo avanzando tus metas.",
    },
    {
        icon: CircleCheckBig,
        label: "Calcula con precisión local",
        cardTitle: "Calcula con precisión dominicana: nómina, impuestos y proyecciones.",
        cardImage: "/images/precision-total.webp",
        cardImageAlt: "Precisión total",
        cardDescription: "Incluye reglas locales como TSS, SFS, SIPEN e ISR para darte resultados realistas en RD. Así planificas con cifras correctas, no con estimaciones genéricas que no aplican a tu realidad.",
    },
    {
        icon: Bot,
        label: "Recibe guía con IA",
        cardTitle: "Recibe asistencia financiera con IA en español claro y accionable.",
        cardImage: "/images/asistencia-ia.webp",
        cardImageAlt: "Asistencia con IA",
        cardDescription: "Cada mes, Fluvoo analiza tus ingresos y gastos para darte recomendaciones concretas sobre qué ajustar, qué mantener y cómo acercarte a tus metas con decisiones simples basadas en tu realidad dominicana.",
    },
];
