export interface ComparativoISR {
  perfil: "asalariado" | "freelance" | "empresa";
  ingreso: number;
  cargaTributaria: number;
  impuestoTotal: number;
  detalles: string[];
}
