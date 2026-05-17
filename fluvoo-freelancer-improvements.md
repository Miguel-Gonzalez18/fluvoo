# Fluvoo — Mejoras al perfil Freelancer/Independiente

## Contexto del problema

El onboarding y los cálculos del perfil freelancer tienen tres problemas
que deben corregirse antes de agregar funcionalidades nuevas:

### Problema 1 — Confusión conceptual en el cálculo de ISR

El código actual usa `EXENCION_GASTO_SIMPLIFICADO = 416220` como si fuera
la deducción por gastos del freelancer, pero ese número es el **umbral de
exención del tramo 1 del ISR** — son conceptos distintos.

La DGII permite al freelancer dos rutas de deducción:
- **Gastos simplificados**: deducir el **40% de los honorarios brutos**
  como gastos de la actividad (sin justificar con facturas)
- **Gastos comprobados**: deducir los gastos reales documentados con NCF

Después de esa deducción se obtiene la **renta neta**, y sobre ESA renta
neta se aplica la tabla ISR (donde el primer tramo hasta RD$416,220 es 0%).

**Flujo correcto:**
```
Honorarios brutos anuales:     RD$360,000
- Gastos simplificados (40%):  -RD$144,000
= Renta neta sujeta:           RD$216,000
→ Renta neta < RD$416,220 → ISR = RD$0
```

Lo que muestra la app actualmente:
```
Honorarios anuales:              RD$360,000
- Gasto simplificado (exención): -RD$416,220  ← INCORRECTO
= Base imponible:                RD$0
```

El resultado final es coincidentalmente correcto para ingresos bajos, pero
la lógica es incorrecta y fallará para ingresos medios/altos.

### Problema 2 — La nota de TSS voluntaria no afecta el ingreso neto

La nota amarilla "Como freelancer debes pagar tu TSS de forma voluntaria
(aprox. 5.91%)" es solo informativa y no modifica el cálculo. El usuario
no puede activar/desactivar este toggle en el `TaxSummaryCard`.

### Problema 3 — El ingreso neto mostrado no es el dinero real disponible

Se muestra el ingreso bruto menos el ISR, pero no incluye:
- La reserva mensual recomendada para ISR (ahorro fiscal)
- La TSS voluntaria si el usuario decide cotizar
- El anticipo trimestral de ISR (en la vista anual)

---

## PARTE 1 — SQL: Tablas de parámetros ITBIS y gastos simplificados

Ejecuta este SQL en el Editor SQL de Supabase antes de tocar el código:

```sql
-- ================================================================
-- TABLA: itbis_parameters
-- Parámetros del ITBIS para freelancers que superan el umbral
-- Fuente: DGII — Ley 253-12 y resoluciones vigentes
-- ================================================================

CREATE TABLE IF NOT EXISTS public.itbis_parameters (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year           INTEGER NOT NULL,
  effective_from DATE    NOT NULL,

  -- Umbral de ingresos anuales para obligación de registro en ITBIS
  -- Quien supere este monto debe registrarse como contribuyente
  annual_threshold    NUMERIC(14,2) NOT NULL DEFAULT 8695240.00,

  -- Tasa general del ITBIS
  standard_rate       NUMERIC(5,4)  NOT NULL DEFAULT 0.18,   -- 18%

  -- Tasa reducida (algunos bienes y servicios exentos o tasa diferente)
  reduced_rate        NUMERIC(5,4)  DEFAULT 0.16,             -- 16% algunos bienes

  -- Retención ITBIS cuando el cliente es una empresa (agente retenedor)
  retention_rate      NUMERIC(5,4)  NOT NULL DEFAULT 0.30,   -- 30% del ITBIS facturado

  -- Periodicidad de declaración una vez registrado
  declaration_period  TEXT DEFAULT 'monthly',                -- 'monthly' | 'quarterly'

  is_active      BOOLEAN DEFAULT TRUE,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.itbis_parameters IS
  'Parámetros del ITBIS para freelancers en República Dominicana.
   Un freelancer con ingresos anuales > annual_threshold debe registrarse
   como contribuyente ordinario del ITBIS en la DGII.';

COMMENT ON COLUMN public.itbis_parameters.annual_threshold IS
  'Umbral anual en RD$. Si los ingresos del freelancer superan este monto,
   debe inscribirse como contribuyente ordinario del ITBIS (18%).';

COMMENT ON COLUMN public.itbis_parameters.retention_rate IS
  'Cuando el cliente es empresa (agente retenedor), retiene este porcentaje
   del ITBIS facturado. Ej: si factura RD$100 + RD$18 ITBIS = RD$118,
   el cliente retiene RD$5.40 (30% de RD$18) y paga RD$112.60 al freelancer.';

-- Datos vigentes 2025-2026
INSERT INTO public.itbis_parameters (
  year,
  effective_from,
  annual_threshold,
  standard_rate,
  reduced_rate,
  retention_rate,
  declaration_period,
  is_active,
  notes
) VALUES (
  2025,
  '2025-01-01',
  8695240.00,   -- RD$8,695,240 umbral anual vigente
  0.18,          -- 18% tasa estándar ITBIS
  0.16,          -- 16% tasa reducida (algunos bienes)
  0.30,          -- 30% retención si cliente es empresa agente retenedor
  'monthly',
  TRUE,
  'Umbral ITBIS 2025 según DGII. Quien supere RD$8,695,240 en ingresos
   anuales debe inscribirse como contribuyente ordinario del ITBIS y cobrar
   18% adicional a sus clientes. La retención del 30% aplica cuando el
   cliente es empresa designada como agente retenedor por la DGII.'
);

-- ================================================================
-- TABLA: freelancer_deduction_parameters
-- Parámetros de deducción de gastos para persona física independiente
-- ================================================================

CREATE TABLE IF NOT EXISTS public.freelancer_deduction_parameters (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year                   INTEGER NOT NULL,
  effective_from         DATE    NOT NULL,

  -- Porcentaje de gastos simplificados permitido por la DGII
  -- sobre los honorarios brutos anuales (sin necesidad de justificar)
  simplified_expense_rate NUMERIC(5,4) NOT NULL DEFAULT 0.40, -- 40%

  -- Umbral mínimo de exención ISR (primer tramo de la tabla)
  -- = mismo valor que tax_parameters.isr_brackets tramo 1
  isr_exemption_threshold NUMERIC(12,2) NOT NULL DEFAULT 416220.00,

  -- Retención en la fuente cuando el cliente es empresa
  -- El cliente descuenta este % y lo paga directamente a la DGII
  source_retention_rate   NUMERIC(5,4) NOT NULL DEFAULT 0.10,  -- 10%

  -- Anticipo ISR trimestral (% sobre ingresos del trimestre)
  -- Aplica cuando el freelancer paga su propio ISR sin retenciones
  quarterly_advance_rate  NUMERIC(5,4) DEFAULT 0.10,           -- 10% estimado

  is_active  BOOLEAN DEFAULT TRUE,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.freelancer_deduction_parameters IS
  'Parámetros fiscales específicos para personas físicas independientes
   (freelancers) en República Dominicana. Complementa tax_parameters.';

COMMENT ON COLUMN public.freelancer_deduction_parameters.simplified_expense_rate IS
  '40% de los honorarios brutos que la DGII permite deducir como gastos
   sin necesidad de justificarlos con comprobantes fiscales (NCF).
   Alternativa a deducir gastos comprobados reales.';

COMMENT ON COLUMN public.freelancer_deduction_parameters.source_retention_rate IS
  'Cuando el cliente es empresa formal, retiene el 10% de los honorarios
   y lo paga directamente a la DGII. El freelancer lo descuenta de su ISR
   anual como crédito fiscal.';

INSERT INTO public.freelancer_deduction_parameters (
  year,
  effective_from,
  simplified_expense_rate,
  isr_exemption_threshold,
  source_retention_rate,
  quarterly_advance_rate,
  is_active,
  notes
) VALUES (
  2025,
  '2025-01-01',
  0.40,        -- 40% gastos simplificados
  416220.00,   -- RD$416,220 umbral exención ISR (sin cambios desde 2017)
  0.10,        -- 10% retención en la fuente por clientes-empresa
  0.10,
  TRUE,
  'Parámetros DGII 2025 para persona física independiente. El 40% de gastos
   simplificados aplica sobre honorarios brutos antes de calcular la renta
   neta sujeta a ISR. La retención del 10% es un crédito que descuenta del
   ISR total a pagar en la declaración anual (IR-1).'
);

-- RLS para las tablas nuevas (solo lectura para todos los autenticados)
ALTER TABLE public.itbis_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_deduction_parameters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "itbis_params_select"
  ON public.itbis_parameters FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "freelancer_params_select"
  ON public.freelancer_deduction_parameters FOR SELECT TO authenticated
  USING (true);
```

---

## PARTE 2 — Corregir `isr-calculator.ts`

Archivo: `modules/onboarding/config/isr-calculator.ts`

### 2A — Agregar constantes correctas y quitar la confusa

```typescript
// ANTES (incorrecto — confunde exención ISR con gasto simplificado):
export const EXENCION_GASTO_SIMPLIFICADO = 416220;

// DESPUÉS — separar claramente los dos conceptos:

/** Porcentaje de gastos simplificados que la DGII permite deducir
 *  sobre honorarios brutos (sin justificar con NCF).
 *  Fuente: DGII, Código Tributario Art. 287 */
export const GASTOS_SIMPLIFICADOS_RATE = 0.40; // 40%

/** Umbral de exención ISR — primer tramo de la tabla ISR
 *  Renta neta anual por debajo de este monto paga 0% de ISR.
 *  Sin cambios desde 2017 (DGII RES-DDG-AR1-2025-00001) */
export const ISR_EXEMPTION_THRESHOLD = 416220;

/** Retención en la fuente cuando el cliente es empresa formal */
export const RETENCION_FUENTE_FREELANCE = 0.10; // 10%

/** Umbral anual de ingresos a partir del cual el freelancer
 *  debe registrarse como contribuyente ordinario del ITBIS */
export const ITBIS_THRESHOLD_ANNUAL = 8_695_240;

/** Tasa estándar del ITBIS */
export const ITBIS_RATE = 0.18;
```

### 2B — Reescribir `calcularISRFreelance` con lógica correcta

Reemplaza la función completa:

```typescript
export interface ISRFreelanceCalculation extends ISRCalculation {
  gastosSimplificados: number;       // 40% de los honorarios brutos
  rentaNeta: number;                  // honorarios - gastos = base real
  retenciones: number;                // retenciones 10% del cliente
  impuestoFinal: number;              // ISR calculado - retenciones
  reservaMensualRecomendada: number;  // cuánto apartar cada mes
  tssVoluntaria: number;              // TSS si el usuario decide cotizar
  ingresoNetoReal: number;            // lo que efectivamente queda
  superaUmbralITBIS: boolean;         // alerta si debe registrarse en ITBIS
  tipoDeduccion: 'simplificado' | 'comprobados';
  gastosDeducibles: number;
}

export function calcularISRFreelance(
  honorariosBrutosAnuales: number,
  gastosComprobadosAnuales: number = 0,
  usarGastoSimplificado: boolean = true,
  retenciones10Pct: number = 0,        // total de retenciones del año
  cotizaTSSVoluntaria: boolean = false,
  taxParams?: TaxParameters
): ISRFreelanceCalculation {

  // PASO 1: Calcular gastos deducibles
  let gastosDeducibles: number;
  let tipoDeduccion: 'simplificado' | 'comprobados';

  if (usarGastoSimplificado) {
    // Gastos simplificados: 40% de honorarios brutos (DGII Art. 287)
    gastosDeducibles = honorariosBrutosAnuales * GASTOS_SIMPLIFICADOS_RATE;
    tipoDeduccion = 'simplificado';
  } else {
    // Gastos comprobados: lo que el freelancer pueda documentar con NCF
    gastosDeducibles = gastosComprobadosAnuales;
    tipoDeduccion = 'comprobados';
  }

  // PASO 2: Renta neta = honorarios - gastos deducibles
  const rentaNeta = Math.max(0, honorariosBrutosAnuales - gastosDeducibles);

  // PASO 3: Aplicar tabla ISR a la renta neta
  // (aquí es donde el umbral de RD$416,220 funciona como tramo exento)
  const resultadoEscala = aplicarEscalaISR(rentaNeta, taxParams);
  const isrCalculado = resultadoEscala.impuesto;

  // PASO 4: Descontar retenciones en la fuente (crédito fiscal)
  const impuestoFinal = Math.max(0, isrCalculado - retenciones10Pct);

  // PASO 5: TSS voluntaria (si el freelancer decide cotizar)
  const tssVoluntaria = cotizaTSSVoluntaria
    ? honorariosBrutosAnuales * 0.0591  // 5.91% sobre honorarios brutos
    : 0;

  // PASO 6: Ingreso neto real anual
  const ingresoNetoReal = honorariosBrutosAnuales - impuestoFinal - tssVoluntaria;

  // PASO 7: Reserva mensual recomendada para ISR
  // Si el freelancer no recibe retenciones, debe apartar dinero cada mes
  const reservaMensualRecomendada = impuestoFinal > 0
    ? Math.ceil(impuestoFinal / 12)
    : 0;

  // PASO 8: Verificar si supera umbral de ITBIS
  const superaUmbralITBIS = honorariosBrutosAnuales > ITBIS_THRESHOLD_ANNUAL;

  return {
    ingresoBrutoAnual:           honorariosBrutosAnuales,
    deduccionesTSS:              tssVoluntaria,
    gastosSimplificados:         gastosDeducibles,
    rentaNeta,
    baseImponible:               rentaNeta,
    impuestoCalculado:           isrCalculado,
    impuestoMensual:             isrCalculado / 12,
    tramoAplicable:              resultadoEscala.tramo,
    retenciones:                 retenciones10Pct,
    impuestoFinal,
    reservaMensualRecomendada,
    tssVoluntaria,
    ingresoNetoReal,
    superaUmbralITBIS,
    tipoDeduccion,
    gastosDeducibles,
    detalles: [
      `Honorarios brutos anuales: RD$${honorariosBrutosAnuales.toLocaleString('es-DO')}`,
      `Gastos ${tipoDeduccion === 'simplificado' ? 'simplificados (40%)' : 'comprobados'}: -RD$${gastosDeducibles.toLocaleString('es-DO')}`,
      `Renta neta sujeta a ISR: RD$${rentaNeta.toLocaleString('es-DO')}`,
      resultadoEscala.detalle,
      `ISR calculado: RD$${isrCalculado.toLocaleString('es-DO')}`,
      retenciones10Pct > 0
        ? `Retenciones en fuente (10%): -RD$${retenciones10Pct.toLocaleString('es-DO')}`
        : 'Sin retenciones en fuente',
      `ISR final a pagar: RD$${impuestoFinal.toLocaleString('es-DO')}`,
      `Reserva mensual recomendada: RD$${reservaMensualRecomendada.toLocaleString('es-DO')}`,
      cotizaTSSVoluntaria
        ? `TSS voluntaria (5.91%): RD$${tssVoluntaria.toLocaleString('es-DO')}`
        : 'Sin TSS voluntaria',
      `Ingreso neto real anual: RD$${ingresoNetoReal.toLocaleString('es-DO')}`,
      superaUmbralITBIS
        ? '⚠️ Supera umbral ITBIS — debe inscribirse como contribuyente ordinario'
        : 'Bajo umbral ITBIS — no obligado a cobrar ITBIS',
    ],
  };
}
```

---

## PARTE 3 — Reescribir el bloque freelancer en `TaxSummaryCard.tsx`

Localiza el bloque que empieza con:
```tsx
if (profileType === "freelancer" && averageMonthlyIncome && averageMonthlyIncome > 0) {
```

Reemplaza todo ese bloque con:

```tsx
if (profileType === "freelancer" && averageMonthlyIncome && averageMonthlyIncome > 0) {
  const ingresoAnual = averageMonthlyIncome * 12;
  const calculation = calcularISRFreelance(
    ingresoAnual,
    0,
    true,         // gastos simplificados (40%)
    0,            // sin retenciones por defecto en onboarding
    tssVoluntaria // estado del toggle
  );

  const pagaraISR = calculation.impuestoFinal > 0;
  const bajoPisoPorGastos = calculation.rentaNeta < ISR_EXEMPTION_THRESHOLD;

  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4", className)}>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Resumen Fiscal Anual</h4>
          <p className="text-xs text-muted-foreground">Proyección ISR · Persona Física</p>
        </div>
      </div>

      <div className="space-y-3">

        {/* Honorarios brutos */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Honorarios estimados anuales</span>
          <span className="font-medium">
            RD${ingresoAnual.toLocaleString("es-DO")}
          </span>
        </div>

        {/* Gastos simplificados (40%) */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-primary" />
            <span>Gastos simplificados DGII (40%)</span>
          </div>
          <span className="text-primary">
            -RD${calculation.gastosSimplificados.toLocaleString("es-DO")}
          </span>
        </div>

        {/* Renta neta sujeta */}
        <div className="flex justify-between items-center text-sm border-t pt-2">
          <span className="text-muted-foreground">Renta neta sujeta a ISR</span>
          <span className="font-medium">
            RD${calculation.rentaNeta.toLocaleString("es-DO")}
          </span>
        </div>

        {/* Estado ISR — condicional */}
        {!pagaraISR ? (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>ISR</span>
            </div>
            <span className="text-xs text-muted-foreground italic">
              {bajoPisoPorGastos
                ? "Renta neta bajo umbral — exento"
                : "No aplica"}
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>ISR Anual (Tramo {calculation.tramoAplicable})</span>
              </div>
              <span className="text-destructive">
                -RD${calculation.impuestoFinal.toLocaleString("es-DO")}
              </span>
            </div>

            {/* Reserva mensual recomendada */}
            <div className="flex justify-between items-center text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-amber-700">
                <Info className="w-3 h-3" />
                <span className="font-medium">Reserva mensual recomendada</span>
              </div>
              <span className="font-semibold text-amber-700">
                RD${calculation.reservaMensualRecomendada.toLocaleString("es-DO")}
              </span>
            </div>
          </>
        )}

        {/* Tasa efectiva */}
        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
          <span>Tasa efectiva ISR</span>
          <span>
            {pagaraISR
              ? `${((calculation.impuestoFinal / ingresoAnual) * 100).toFixed(2)}%`
              : "0.00%"}
          </span>
        </div>

        {/* Toggle TSS voluntaria */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <div>
            <p className="text-xs font-medium">¿Cotizas TSS voluntaria? (5.91%)</p>
            <p className="text-xs text-muted-foreground">
              Cobertura de salud y pensiones
            </p>
          </div>
          {/* Pasa el estado del toggle desde el componente padre — ver PARTE 4 */}
          <button
            type="button"
            role="switch"
            aria-checked={tssVoluntaria}
            onClick={onToggleTSS}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none",
              tssVoluntaria ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                tssVoluntaria ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {tssVoluntaria && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              <span>TSS voluntaria (5.91%)</span>
            </div>
            <span className="text-destructive">
              -RD${Math.round(calculation.tssVoluntaria).toLocaleString("es-DO")}
            </span>
          </div>
        )}

        {/* Alerta ITBIS si supera el umbral */}
        {calculation.superaUmbralITBIS && (
          <div className="text-xs bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 space-y-1">
            <p className="font-semibold text-orange-700">⚠️ Umbral ITBIS superado</p>
            <p className="text-orange-600">
              Con ingresos superiores a RD$8,695,240 anuales debes inscribirte
              como contribuyente ordinario del ITBIS y cobrar 18% adicional
              a tus clientes.
            </p>
          </div>
        )}

        {/* Nota informativa sobre TSS — solo cuando NO la tienen activa */}
        {!tssVoluntaria && (
          <div className="text-xs text-muted-foreground bg-muted/80 rounded-lg px-3 py-2">
            <strong>Nota:</strong> La TSS es voluntaria para freelancers.
            Cotizarla (5.91%) garantiza acceso al SFS (salud) y acumulación
            para pensión. Puedes activarla arriba para verla en tu proyección.
          </div>
        )}

        {/* Ingreso neto real */}
        <div className="flex justify-between items-center text-sm bg-primary/5 rounded-lg p-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Ingreso neto anual estimado</span>
          </div>
          <span className="font-bold text-primary">
            RD${Math.round(calculation.ingresoNetoReal).toLocaleString("es-DO")}
          </span>
        </div>

        {/* Promedio mensual neto */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Promedio mensual disponible</span>
          <span className="font-medium">
            RD${Math.round(calculation.ingresoNetoReal / 12).toLocaleString("es-DO")}
          </span>
        </div>

      </div>
    </div>
  );
}
```

---

## PARTE 4 — Agregar estado del toggle TSS a `TaxSummaryCard`

El toggle de TSS necesita estado propio dentro de `TaxSummaryCard`.
Actualiza la interfaz y el componente así:

### Actualizar `TaxSummaryCardProps`:

```typescript
interface TaxSummaryCardProps {
  profileType: ProfileType;
  monthlySalary?: number;
  averageMonthlyIncome?: number;
  businessMonthlyRevenue?: number;
  gastosEstimados?: number;
  className?: string;
}
```

### Agregar estado interno en el componente (antes del `useEffect`):

```typescript
// Estado del toggle TSS voluntaria — solo relevante para freelancer
const [tssVoluntaria, setTssVoluntaria] = useState(false);
const onToggleTSS = () => setTssVoluntaria(prev => !prev);
```

Asegúrate de pasar `tssVoluntaria` y `onToggleTSS` al bloque JSX del
freelancer que reescribiste en la PARTE 3.

---

## PARTE 5 — Actualizar imports en `TaxSummaryCard.tsx`

Reemplaza la línea de imports del calculador:

```typescript
// ANTES:
import {
  calcularISRAsalariado,
  calcularISRFreelance,
  calcularISREmpresa,
  EXENCION_GASTO_SIMPLIFICADO,
  ISR_RATE_PJ,
} from "../config/isr-calculator";

// DESPUÉS:
import {
  calcularISRAsalariado,
  calcularISRFreelance,
  calcularISREmpresa,
  ISR_EXEMPTION_THRESHOLD,
  ISR_RATE_PJ,
  GASTOS_SIMPLIFICADOS_RATE,
  ITBIS_THRESHOLD_ANNUAL,
} from "../config/isr-calculator";
```

---

## PARTE 6 — Verificación del resultado correcto

Prueba estos tres casos manualmente después de aplicar los cambios:

**Caso 1 — Ingreso bajo (RD$30,000/mes)**
```
Honorarios anuales:       RD$360,000
Gastos simplificados 40%: -RD$144,000
Renta neta:               RD$216,000
ISR (bajo umbral RD$416,220): RD$0
TSS voluntaria (off):     RD$0
Ingreso neto real:        RD$360,000
Reserva mensual ISR:      RD$0
```

**Caso 2 — Ingreso medio (RD$60,000/mes)**
```
Honorarios anuales:       RD$720,000
Gastos simplificados 40%: -RD$288,000
Renta neta:               RD$432,000
ISR tramo 2: (432,000 - 416,220) × 15% = RD$2,367
ISR mensual:              RD$197
Reserva mensual ISR:      RD$198
TSS voluntaria (on):      RD$42,552/año
Ingreso neto (con TSS):   RD$675,081
```

**Caso 3 — Ingreso alto (RD$150,000/mes)**
```
Honorarios anuales:       RD$1,800,000
Gastos simplificados 40%: -RD$720,000
Renta neta:               RD$1,080,000
ISR tramo 4: 79,776 + (1,080,000 - 867,123) × 25% = RD$132,965
ISR mensual:              RD$11,080
Reserva mensual ISR:      RD$11,081
Supera ITBIS:             NO (< RD$8,695,240)
```

---

## PARTE 7 — Agregar Server Action para consultar los nuevos parámetros

En `modules/onboarding/actions/tax-actions.ts`, agrega:

```typescript
export async function getItbisParameters() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itbis_parameters")
    .select("*")
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return { success: false, error: error.message, data: null };
  }
  return { success: true, data, error: null };
}

export async function getFreelancerDeductionParameters() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("freelancer_deduction_parameters")
    .select("*")
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return { success: false, error: error.message, data: null };
  }
  return { success: true, data, error: null };
}
```

---

## Resumen de archivos modificados

| Archivo | Cambio |
|---|---|
| SQL Editor Supabase | Crear tablas `itbis_parameters` y `freelancer_deduction_parameters` |
| `isr-calculator.ts` | Corregir lógica freelancer, renombrar constantes, agregar nuevas |
| `TaxSummaryCard.tsx` | Reescribir bloque freelancer con toggle TSS y alerta ITBIS |
| `tax-actions.ts` | Agregar queries para los dos nuevos parámetros |
