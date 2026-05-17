Analiza el proyecto Fluvoo y ajusta el componente `TaxSummaryCard` con estas mejoras.

Contexto técnico:
- El componente principal está en `modules/onboarding/components/TaxSummaryCard.tsx`.
- La lógica de cálculo fiscal está actualmente en `modules/onboarding/config/isr-calculator.ts`.
- Las acciones/parámetros fiscales están en `modules/onboarding/actions/tax-actions.ts` y `modules/onboarding/supabase/tax-parameters.ts`.
- El proyecto tiene un módulo `modules/shared`, así que la lógica reutilizable no debe quedarse acoplada a onboarding.

Objetivos:

1. Mover la lógica fiscal reutilizable a `modules/shared`
- Mover o reorganizar la calculadora de ISR/TSS/deducciones desde `modules/onboarding/config/isr-calculator.ts` hacia un módulo compartido, por ejemplo:
  - `modules/shared/tax/isr-calculator.ts`
  - o `modules/shared/lib/tax/isr-calculator.ts`
- Actualizar imports en `TaxSummaryCard` y cualquier otro archivo que use esa lógica.
- La intención es que la calculadora de deducciones de empleado y freelancer pueda reutilizarse luego dentro del dashboard y otros módulos.
- Mantener compatibilidad con los tipos existentes de Supabase.
- Evitar duplicar lógica fiscal entre onboarding y dashboard.

2. Mejorar `TaxSummaryCard` para perfil empleado
- Actualmente el componente permite ver deducciones en tabs `Mensual` y `Anual`.
- Agregar un tercer tab: `Quincenal`.
- El cálculo quincenal debe basarse en el salario mensual actual:
  - bruto quincenal = salario mensual / 2
  - TSS quincenal = deducción mensual / 2
  - ISR quincenal = ISR mensual / 2
  - equivalente anual = valores anuales / 24
- Actualizar labels dinámicos:
  - `Salario bruto mensual/anual/quincenal`
  - `Ingreso neto mensual/anual/quincenal`
  - `ISR Mensual/Anual/Quincenal`
- Mantener el diseño compacto y consistente con el estilo actual.

3. Mejorar `TaxSummaryCard` para perfil freelancer
Agregar una comunicación más honesta y educativa sobre ISR en República Dominicana.

Contexto fiscal/UX:
- Técnicamente, una persona física freelancer que supere el umbral exento debe declarar y pagar ISR mediante IR-1.
- En la práctica, muchos freelancers no declaran porque no existe retención automática cuando trabajan con clientes individuales o informales.
- Cuando el freelancer trabaja con empresas formales, esas empresas suelen retener el 10% en la fuente y reportarlo a la DGII como crédito fiscal del freelancer.
- La app no debe ignorar la obligación legal, pero tampoco debe fingir que todos los freelancers ya están formalizados.

Requerimientos de UI/UX:
- Mostrar el ISR calculado siempre que aplique.
- Agregar una nota honesta cerca del resultado de ISR, con un texto similar a:

  “Si estás registrado en la DGII, esta es tu obligación estimada. Si aún no declaras, formalizarte puede ayudarte a acceder a créditos, historial financiero y clientes corporativos.”

- Agregar un toggle o control claro para el freelancer:
  - `Estoy registrado en la DGII`
  - Este toggle no debe eliminar el cálculo de ISR.
  - Debe cambiar el tono del resumen:
    - Si está activo: mostrarlo como obligación estimada a declarar.
    - Si está inactivo: mostrarlo como obligación estimada si decide formalizarse/declarar.
- Mantener la reserva mensual recomendada cuando exista ISR.
- Incluir una explicación breve de la retención del 10% cuando aplica:
  - Si el freelancer trabaja con empresas formales, el 10% retenido funciona como crédito contra el ISR anual.
- Si decides agregar un toggle adicional como `Mis clientes me retienen 10%`, úsalo para reflejar retenciones en el cálculo, pero mantén la UI simple.

4. Calidad de implementación
- No romper los perfiles existentes: `employee`, `freelancer`, `business_owner`.
- Mantener el componente client-side si sigue necesitando estado local.
- Preservar accesibilidad básica en tabs y toggles.
- Evitar textos largos dentro de la tarjeta; usar notas cortas y escaneables.
- No crear lógica fiscal duplicada dentro del componente.
- Si hay tests o lint disponibles, ejecutarlos y corregir errores relacionados.

Criterios de aceptación:
- `TaxSummaryCard` de empleado muestra `Mensual`, `Quincenal` y `Anual`.
- Los valores quincenales son consistentes con la proyección mensual/anual.
- La calculadora fiscal reutilizable vive en `modules/shared`.
- El perfil freelancer muestra ISR estimado de forma responsable, con contexto sobre DGII/formalización.
- El toggle de DGII cambia la presentación sin ocultar la obligación calculada.
- Los imports quedan limpios y no dependen de `modules/onboarding/config` para lógica fiscal compartida.