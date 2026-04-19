import type { FAQItem } from "../types/typesHome";

export const faqItems: FAQItem[] = [
    {
        id: "item-1",
        question: "¿Fluvoo accede a mi cuenta bancaria?",
        answer:
            "No. Fluvoo nunca accede a tu cuenta bancaria ni guarda tus credenciales. Solo lee los correos de notificación que tu banco ya te envía. Los mismos que llegan a tu bandeja de entrada cuando haces una compra. El acceso al correo es de solo lectura y lo puedes revocar en cualquier momento.",
    },
    {
        id: "item-2",
        question: "¿Qué bancos dominicanos son compatibles?",
        answer:
            "Actualmente somos compatibles con Banreservas, Banco Popular, BHD, APAP, Scotiabank, Qik, Banco Santa Cruz y Asociación Cibao. Sumamos nuevos bancos continuamente. Si tu banco no aparece, puedes registrar gastos manualmente o subir fotos de facturas.",
    },
    {
        id: "item-3",
        question: "¿Las calculadoras están actualizadas con las regulaciones vigentes?",
        answer:
            "Sí. Mantenemos todas las calculadoras actualizadas con las tablas vigentes de la DGII para ISR, las tasas actuales de TSS, SFS y SIPEN de la DGSS, y las escalas de las principales ARSs del país. Cuando hay cambios regulatorios, actualizamos la plataforma antes de la fecha de entrada en vigor.",
    },
    {
        id: "item-4",
        question: "¿Puedo cancelar mi plan en cualquier momento?",
        answer:
            "Sí, puedes cancelar con un clic desde tu configuración. Sin contratos, sin penalidades. Si cancelas antes de que venza tu período pagado, sigues teniendo acceso hasta que termine. No hacemos cobros automáticos sin avisarte.",
    },
    {
        id: "item-5",
        question: "¿La IA me dice qué hacer con mi dinero?",
        answer:
            "No exactamente. La IA de Fluvoo analiza tu situación real y te presenta observaciones y opciones nunca órdenes. La decisión siempre es tuya. La diferencia es que tomas esas decisiones con información clara y completa, no a ciegas.",
    },
    {
        id: "item-6",
        question: "¿Mis datos financieros están seguros?",
        answer:
            "Toda tu información viaja cifrada y se almacena con estándares de seguridad bancaria en servidores de alta disponibilidad. Nunca vendemos ni compartimos tus datos financieros con terceros. Puedes solicitar la eliminación completa de tu cuenta y tus datos en cualquier momento.",
    },
];
