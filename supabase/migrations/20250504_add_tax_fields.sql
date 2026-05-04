-- Migration: Add tax calculation fields for ISR tracking
-- Created: 2025-05-04
-- Description: Add fields to store calculated ISR, TSS contributions, and tax projections

-- Add tax calculation fields to users table
ALTER TABLE public.users
  -- Campos para aportes obligatorios TSS (empleados)
  ADD COLUMN IF NOT EXISTS contributes_sipen boolean DEFAULT true,  -- Aporte ARS/SFS 3.04%
  ADD COLUMN IF NOT EXISTS contributes_afp boolean DEFAULT true,    -- Aporte AFP 2.87%
  
  -- Campos para cálculos fiscales anuales
  ADD COLUMN IF NOT EXISTS projected_annual_tax numeric DEFAULT 0,      -- ISR proyectado anual
  ADD COLUMN IF NOT EXISTS projected_monthly_tax numeric DEFAULT 0,     -- ISR estimado mensual
  ADD COLUMN IF NOT EXISTS tax_bracket integer,                         -- Tramo ISR aplicable (1-4)
  ADD COLUMN IF NOT EXISTS effective_tax_rate numeric DEFAULT 0,        -- Tasa efectiva ISR
  
  -- Campos específicos por perfil
  -- Asalariado: deducciones TSS mensuales
  ADD COLUMN IF NOT EXISTS monthly_tss_deduction numeric DEFAULT 0,     -- Total TSS mensual (5.91%)
  ADD COLUMN IF NOT EXISTS monthly_sfs_deduction numeric DEFAULT 0,     -- SFS 3.04%
  ADD COLUMN IF NOT EXISTS monthly_afp_deduction numeric DEFAULT 0,     -- AFP 2.87%
  
  -- Freelance: retenciones y deducciones
  ADD COLUMN IF NOT EXISTS uses_simplified_deduction boolean DEFAULT true, -- Usa gasto simplificado
  ADD COLUMN IF NOT EXISTS annual_deductible_expenses numeric DEFAULT 0, -- Gastos deducibles anuales
  ADD COLUMN IF NOT EXISTS annual_retentions_10pct numeric DEFAULT 0,    -- Retenciones 10% ISR
  
  -- Empresa: datos fiscales adicionales
  ADD COLUMN IF NOT EXISTS annual_gross_revenue numeric DEFAULT 0,      -- Ingresos brutos anuales
  ADD COLUMN IF NOT EXISTS annual_deductible_costs numeric DEFAULT 0,  -- Costos deducibles anuales
  ADD COLUMN IF NOT EXISTS monthly_tax_advance numeric DEFAULT 0,        -- Anticipo mensual ISR
  ADD COLUMN IF NOT EXISTS uses_rst boolean DEFAULT false;              -- Usa Régimen Simplificado

-- Comments for documentation
COMMENT ON COLUMN public.users.contributes_sipen IS 'Indica si el usuario cotiza al Sistema de Seguridad Social (SFS/ARS) - obligatorio para empleados asalariados. Aporte del empleado: 3.04%';
COMMENT ON COLUMN public.users.contributes_afp IS 'Indica si el usuario cotiza a AFP (Fondo de Pensiones) - obligatorio para empleados asalariados. Aporte del empleado: 2.87%';
COMMENT ON COLUMN public.users.projected_annual_tax IS 'ISR anual proyectado basado en el ingreso declarado y la escala DGII';
COMMENT ON COLUMN public.users.projected_monthly_tax IS 'ISR mensual estimado (anual / 12) para planificación';
COMMENT ON COLUMN public.users.tax_bracket IS 'Tramo de la escala ISR aplicable: 1=Exento, 2=15%, 3=20%, 4=25%';
COMMENT ON COLUMN public.users.effective_tax_rate IS 'Tasa efectiva de ISR como porcentaje del ingreso bruto';
COMMENT ON COLUMN public.users.monthly_tss_deduction IS 'Total deducciones TSS mensual (SFS + AFP = 5.91%)';
COMMENT ON COLUMN public.users.monthly_sfs_deduction IS 'Deducción mensual SFS/Seguro Salud (3.04% con tope)';
COMMENT ON COLUMN public.users.monthly_afp_deduction IS 'Deducción mensual AFP/Pensiones (2.87% con tope)';
COMMENT ON COLUMN public.users.uses_simplified_deduction IS 'Freelance: usa gasto simplificado (RD$416,220 exención) en lugar de gastos comprobados';
COMMENT ON COLUMN public.users.annual_deductible_expenses IS 'Freelance/Empresa: total de gastos deducibles del año';
COMMENT ON COLUMN public.users.annual_retentions_10pct IS 'Freelance: retenciones del 10% realizadas por clientes empresas';
COMMENT ON COLUMN public.users.annual_gross_revenue IS 'Empresa: ingresos brutos anuales totales';
COMMENT ON COLUMN public.users.annual_deductible_costs IS 'Empresa: costos y gastos deducibles para ISR';
COMMENT ON COLUMN public.users.monthly_tax_advance IS 'Empresa: anticipo mensual de ISR basado en año anterior';
COMMENT ON COLUMN public.users.uses_rst IS 'Empresa/Freelance: indica si califica y usa Régimen Simplificado de Tributación';

-- Update existing employee users with default TSS contributions
UPDATE public.users
SET 
  contributes_sipen = COALESCE(contributes_sipen, true),
  contributes_afp = COALESCE(contributes_afp, true)
WHERE profile_type = 'employee';

-- Create function to automatically calculate TSS deductions when salary is updated
CREATE OR REPLACE FUNCTION calculate_tss_deductions()
RETURNS TRIGGER AS $$
DECLARE
  salary_sfs_cap NUMERIC := 193815;  -- Tope SFS 2024
  salary_afp_cap NUMERIC := 387630;  -- Tope AFP 2024
  sfs_rate NUMERIC := 0.0304;        -- 3.04%
  afp_rate NUMERIC := 0.0287;        -- 2.87%
  salary_for_sfs NUMERIC;
  salary_for_afp NUMERIC;
BEGIN
  -- Only calculate for employees with monthly salary
  IF NEW.profile_type = 'employee' AND NEW.monthly_salary IS NOT NULL AND NEW.monthly_salary > 0 THEN
    -- Apply caps
    salary_for_sfs := LEAST(NEW.monthly_salary, salary_sfs_cap);
    salary_for_afp := LEAST(NEW.monthly_salary, salary_afp_cap);
    
    -- Calculate deductions
    NEW.monthly_sfs_deduction := salary_for_sfs * sfs_rate;
    NEW.monthly_afp_deduction := salary_for_afp * afp_rate;
    NEW.monthly_tss_deduction := NEW.monthly_sfs_deduction + NEW.monthly_afp_deduction;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate TSS on insert/update
DROP TRIGGER IF EXISTS trg_calculate_tss ON public.users;
CREATE TRIGGER trg_calculate_tss
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION calculate_tss_deductions();

-- Create indexes for common tax queries
CREATE INDEX IF NOT EXISTS idx_users_tax_bracket ON public.users(tax_bracket) WHERE tax_bracket IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_uses_rst ON public.users(uses_rst) WHERE uses_rst = true;
