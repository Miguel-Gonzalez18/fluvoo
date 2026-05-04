-- Migration: Add mandatory contribution flags for employee profile
-- Created: 2025-05-04
-- Description: Add fields to track mandatory TSS contributions (AFP and ARS/SFS) for salaried employees

-- Add contribution flags to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS contributes_sipen boolean DEFAULT true,  -- Aporte ARS/SFS 3.04% (obligatorio)
  ADD COLUMN IF NOT EXISTS contributes_afp boolean DEFAULT true;    -- Aporte AFP 2.87% (obligatorio)

-- Add comments for documentation
COMMENT ON COLUMN public.users.contributes_sipen IS 'Indica si el usuario cotiza al Sistema de Seguridad Social (SFS/ARS) - obligatorio para empleados asalariados. Aporte del empleado: 3.04%';
COMMENT ON COLUMN public.users.contributes_afp IS 'Indica si el usuario cotiza a AFP (Fondo de Pensiones) - obligatorio para empleados asalariados. Aporte del empleado: 2.87%';

-- Update existing users who are employees to have these flags set
UPDATE public.users
SET 
  contributes_sipen = true,
  contributes_afp = true
WHERE profile_type = 'employee' 
  AND contributes_sipen IS NULL 
  AND contributes_afp IS NULL;
