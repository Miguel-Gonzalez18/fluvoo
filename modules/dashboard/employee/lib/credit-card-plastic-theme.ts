const ISSUER_GRADIENT_MAP: Record<string, string> = {
  banco_popular: "from-emerald-700 via-emerald-600 to-teal-500",
  banco_reservas: "from-blue-800 via-blue-700 to-sky-500",
  banco_bhd: "from-slate-900 via-indigo-900 to-amber-900",
  banco_scotiabank: "from-red-800 via-red-700 to-rose-500",
  banco_santa_cruz: "from-violet-800 via-violet-700 to-purple-500",
  banco_promerica: "from-green-800 via-green-700 to-lime-500",
  banco_banesco: "from-cyan-800 via-cyan-700 to-teal-400",
  banco_qik: "from-fuchsia-700 via-pink-600 to-rose-500",
  apap: "from-orange-800 via-orange-700 to-amber-500",
};

const FALLBACK_GRADIENTS = [
  "from-slate-800 via-slate-700 to-slate-500",
  "from-indigo-800 via-indigo-700 to-violet-500",
  "from-teal-800 via-teal-700 to-cyan-500",
  "from-rose-800 via-rose-700 to-pink-500",
  "from-amber-800 via-amber-700 to-yellow-600",
] as const;

export const PLASTIC_PATTERN_CLASSES = [
  "cc-pattern-triangles",
  "cc-pattern-arcs",
  "cc-pattern-bars",
] as const;

function hashIssuer(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolveCreditCardPlasticTheme(
  issuerName: string,
  cardIndex: number
): { gradientClass: string; patternClass: string } {
  const knownGradient = ISSUER_GRADIENT_MAP[issuerName];
  const gradientClass =
    knownGradient ??
    FALLBACK_GRADIENTS[hashIssuer(issuerName) % FALLBACK_GRADIENTS.length];

  const patternIndex =
    (hashIssuer(issuerName) + cardIndex) % PLASTIC_PATTERN_CLASSES.length;

  return {
    gradientClass,
    patternClass: PLASTIC_PATTERN_CLASSES[patternIndex],
  };
}
