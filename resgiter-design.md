Eres un desarrollador full-stack especializado en Next.js con experiencia en arquitectura modular y componentes de autenticación. Tu tarea es crear una página de registro que replica exactamente el diseño de la imagen de referencia `Pantalla 2_ Registro.png`, siguiendo las mejores prácticas del proyecto y la estructura modular establecida.

## Contexto del Proyecto

El proyecto utiliza:
- **Stack:** Next.js 16.2.1, React 19.2.4, TypeScript, Tailwind CSS v4
- **UI Library:** shadcn/ui con convención `radix-nova`
- **Formularios:** react-hook-form + zod para validación
- **Animaciones:** GSAP (con `gsap.context()` y `ctx.revert()`)
- **Fuentes:** Manrope (body), Syne (headings), Space Grotesk (labels)
- **Localización:** es_DO
- **Ruta:** El módulo debe ubicarse en `app/lib/modules/register/` dentro del grupo de rutas `(auth)/`

La estructura modular del proyecto está documentada en `image.png` (estructura de `login`) y en `AGENTS.md`. Debes replicar este patrón para `register`.

## Requisitos Técnicos

**Estructura de Archivos:**
Organiza el módulo `register` con esta estructura modular:
- `components/ui/` - Componentes reutilizables (formulario, inputs, botones)
- `config/` - Configuración y constantes
- `hooks/` - Custom hooks para lógica del formulario
- `lib/` - Esquemas de validación (zod)
- `types/` - Definiciones de tipos TypeScript
- `page.tsx` - Página principal
- `layout.tsx` - Layout del módulo (si aplica)

**Convenciones de Código:**
- Usa PascalCase para archivos de componentes (`.tsx`)
- Usa camelCase para carpetas, hooks, config y types
- Importa siempre usando alias `@/` dentro de módulos (ej: `@/lib/modules/register/...`)
- Usa `cn()` de `@/lib/utils` para fusionar clases Tailwind
- **Nunca** uses clases dinámicas de Tailwind; usa objetos de mapeo en su lugar
- Usa `@utility text-highlight` para gradientes predefinidos

**Validación e Integración:**
- Define esquemas de validación con zod (archivo `registerSchemas.ts`)
- Utiliza react-hook-form para manejar el formulario
- Implementa validación de contraseña con indicador de fortaleza ("Nivel de seguridad")
- Integra validación en tiempo real con feedback visual

**Estilos y Componentes UI:**
- Sigue la convención de estilo de shadcn/ui (`radix-nova`)
- Usa Tailwind v4 con `class-variance-authority` para variantes
- Implementa dark mode compatible (clase `.dark`)
- Los inputs deben tener iconos internos, placeholders claros y bordes redondeados
- El botón principal debe ser de estilo "black" (contrasta con el fondo)

**Animaciones:**
- Si implementas animaciones, usa GSAP con `gsap.context()` y asegúrate de llamar `ctx.revert()` en cleanup
- Las animaciones deben ser sutiles y mejorar la experiencia sin ser intrusivas

## Diseño a Replicar

Analiza `Pantalla 2_ Registro.png` para replicar exactamente:

**Layout:**
- Dos columnas: izquierda (fondo verde oscuro) y derecha (fondo blanco)
- Izquierda: contenido promocional con logo, heading "FLUVOO PREMIUM", descripción "Domina tu flujo de caja.", dos características con iconos, avatares de prueba social y frase "Únete a más de 5,000 asalariados dominicanos."
- Derecha: formulario de registro con heading "Crea tu cuenta" y subtitle "Empieza gratis. Sin tarjeta de crédito."

**Formulario (columna derecha):**
- Botones de login social (Google, Facebook) con separador "o"
- Campos: Nombre Completo, Email, Contraseña (con indicador de fortaleza), Confirmar Contraseña
- Cada input tiene etiqueta, icono interno, placeholder y bordes redondeados
- Checkbox para aceptar términos de uso y política de privacidad (ambos como links clickeables)
- Botón "Crear cuenta" (negro, grande)
- Link "¿Ya tienes cuenta? Inicia sesión" debajo del botón
- Footer: "ENCRIPTACIÓN BANCARIA 256-BIT" con icono de escudo

**Tipografía y Colores:**
- Font principal: sans-serif limpia (Manrope para body, Syne para headings)
- Verde oscuro para la columna izquierda (extraer del diseño)
- Blanco para la columna derecha
- Negro para textos principales
- Gris para textos secundarios

## Instrucciones de Entrega

1. Crea todos los archivos necesarios dentro de la estructura modular `app/lib/modules/register/`
2. El componente principal debe exportarse desde `page.tsx`
3. Asegúrate de que todos los imports usen alias `@/`
4. Implementa validación de zod con reglas claras (email válido, contraseña fuerte, confirmación de contraseña coincide)
5. Proporciona componentes reutilizables que puedan integrarse con el flujo de autenticación del proyecto
6. El código debe ser production-ready: bien tipado, sin errores, con manejo de errores y estados de carga
7. Incluye comentarios donde sea necesario para explicar lógica compleja

## Archivos de Referencia

- `Pantalla 2_ Registro.png` - Diseño exacto a replicar
- `image.png` - Estructura modular de referencia (carpeta `login`)
- `AGENTS.md` - Reglas del proyecto y convenciones
- `package.json` - Dependencias disponibles

Comienza generando la estructura de carpetas y archivos, luego implementa cada componente asegurando que siga las mejores prácticas y sea exacto al diseño proporcionado.