import { Bot, Calculator, PiggyBank, Sparkles } from "lucide-react";
import type { WhyFluvooCard } from "../types/typesHome";

export const cardData: WhyFluvooCard[] = [
    {
        icon: Sparkles,
        title: "Hecho para RD",
        description: "Diseñado desde cero para la realidad dominicana: pesos, bancos locales, TSS, DGII y ARS.",
    },
    {
        icon: Bot,
        title: "IA que te habla claro",
        description: "Sin jerga financiera. Recibes análisis y recomendaciones en español que puedes entender y aplicar.",
    },
    {
        icon: Calculator,
        title: "Cálculos que confías",
        description: "Nómina, ISR, préstamos y más todos alineados con la normativa actual de la DGII y la TSS.",
    },
    {
        icon: PiggyBank,
        title: "Tu plan, no uno genérico",
        description: "El asistente construye un plan de ahorro basado en tus números reales, no en promedios globales.",
    },
];
