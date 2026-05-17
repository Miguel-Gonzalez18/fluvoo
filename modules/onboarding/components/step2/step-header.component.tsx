export function StepHeader() {
  return (
    <div className="space-y-2">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
        Cuéntanos sobre tus finanzas
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
        Utilizamos esta información para calcular tus deducciones de ley y proyectar tu flujo de caja real.
      </p>
    </div>
  );
}
