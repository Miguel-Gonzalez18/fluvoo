import { User, Link, ChartNoAxesColumn } from "lucide-react";
import type { HowItWorksStep } from "../types/typesHome";

export const cardsData: HowItWorksStep[] = [
    {
        id: 1,
        title: "Cuéntanos quién eres",
        description: "Selecciona tu perfil asalariado, freelancer, o dueño de negocio. Fluvoo adapta toda la experiencia a tu realidad financiera específica desde el primer minuto.",
        icon: User,
    },
    {
        id: 2,
        title: "Conecta tus notificaciones bancarias",
        description: "Autoriza el correo donde llegan las alertas de tu banco. Fluvoo lee solo esos mensajes, nada personal y empieza a detectar tus gastos automáticamente.",
        icon: Link,
    },
    {
        id: 3,
        title: "Recibe claridad financiera",
        description: "Tu dashboard se llena con datos reales. La IA analiza tus patrones, resume tu estado financiero, y te propone planes de acción concretos y personalizados.",
        icon: ChartNoAxesColumn,
    },
];
