import { Briefcase, Building, Laptop } from "lucide-react";
import type { ProfileItem } from "../types/typesHome";

export const profilesData: ProfileItem[] = [
    {
        id: 'empleado',
        title: 'Empleado Asalariado',
        description: 'Para profesionales con sueldo fijo que quieren entender sus deducciones, optimizar sus gastos, y construir ahorro con propósito.',
        icon: Briefcase,
        image: '/images/empleado-asalariado.svg',
        imageAlt: 'Empleado Asalariado',
        imageSize: { width: 100, height: 100 },
        badge: { text: 'GRATIS', color: 'primary' },
        features: [
            'Calculadora de nómina con TSS, SFS y SIPEN',
            'Proyección de pensión SIPEN',
            'Detección automática de gastos',
            'Planes de ahorro con IA',
            'Presupuestos por categoría',
        ],
    },
    {
        id: 'freelance',
        title: 'Freelancer / Independiente',
        description: 'Para profesionales con ingresos variables que necesitan estabilizarse, reservar para impuestos, y saber exactamente cuánto cobrar.',
        icon: Laptop,
        image: '/images/freelance.svg',
        imageAlt: 'Freelancer',
        imageSize: { width: 100, height: 100 },
        badge: { text: 'GRATIS', color: 'primary' },
        features: [
            'ISR estimado por trimestre (DGII)',
            'Calculadora de tarifa sostenible',
            'Fondo de estabilización inteligente',
            'Registro de ingresos por proyecto',
            'Cuentas por cobrar',
        ],
    },
    {
        id: 'business',
        title: 'Dueño de Negocio',
        description: 'Para emprendedores y pequeños empresarios que necesitan separar sus finanzas personales de las del negocio y ver ambas con claridad.',
        icon: Building,
        image: '/images/business.svg',
        imageAlt: 'Business',
        imageSize: { width: 70, height: 70 },
        badges: [
            { text: 'PRO', color: 'black' },
            { text: 'Proximamente', color: 'black' },
        ],
        features: [
            'Módulo empresarial separado',
            'Flujo de caja proyectado',
            'ITBIS y retenciones automáticas',
            'Nómina básica de empleados',
            'Punto de equilibrio mensual',
        ],
    },
];
