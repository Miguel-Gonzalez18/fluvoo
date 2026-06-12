import type { ObligationType } from "@/modules/onboarding/types/onboarding";

export type ExpenseCategoryIconKey =
  | "arrow-left-right"
  | "tv"
  | "utensils-crossed"
  | "shopping-cart"
  | "car"
  | "wallet"
  | "graduation-cap"
  | "home"
  | "smartphone"
  | "wine"
  | "shopping-bag"
  | "plane"
  | "credit-card"
  | "briefcase"
  | "hammer"
  | "paw-print"
  | "piggy-bank"
  | "help-circle";

export const EXPENSE_CATEGORY_CATALOG = [
  {
    slug: "transferencias",
    label: "Transferencias y Pagos Entre Personas",
    shortLabel: "Transferencias",
    sortOrder: 1,
    active: true,
    icon: "arrow-left-right",
    keywords: [
      "transferencia a",
      "transferencia hacia",
      "envio a",
      "envío a",
      "pago a",
      "enviado a",
      "recibido de",
    ],
    obligationTypes: [],
  },
  {
    slug: "entretenimiento",
    label: "Entretenimiento",
    shortLabel: "Entretenimiento",
    sortOrder: 2,
    active: true,
    icon: "tv",
    keywords: [
      "netflix",
      "spotify",
      "disney",
      "hbo",
      "max",
      "cursor",
      "apple.com",
      "apple inc",
      "google",
      "youtube premium",
      "amazon prime",
      "cine",
      "cinemark",
      "caribbean cinemas",
      "streaming",
      "microsoft",
      "adobe",
      "playstation",
      "xbox",
      "steam",
    ],
    obligationTypes: [],
  },
  {
    slug: "restaurantes",
    label: "Restaurantes y Comida Rápida",
    shortLabel: "Restaurantes",
    sortOrder: 3,
    active: true,
    icon: "utensils-crossed",
    keywords: [
      "uber eats",
      "uber*eats",
      "help.uber.com",
      "pedidos ya",
      "rappi",
      "restaurante",
      "mcdonald",
      "burger king",
      "kfc",
      "pizza",
      "pizza hut",
      "dominos",
      "subway",
      "wendy",
      "pollo",
      "comida rapida",
      "comida rápida",
      "cafeteria",
      "cafetería",
      "starbucks",
    ],
    obligationTypes: [],
  },
  {
    slug: "supermercados",
    label: "Supermercados y Alimentación",
    shortLabel: "Supermercados",
    sortOrder: 4,
    active: true,
    icon: "shopping-cart",
    keywords: [
      "sirena",
      "bravo",
      "nacional",
      "jumbo",
      "price smart",
      "supermercado",
      "aprezio",
      "colmado",
      "la sirena",
      "plaza lama",
      "carrefour",
      "walmart",
    ],
    obligationTypes: [],
  },
  {
    slug: "transporte",
    label: "Gasolina y Transporte",
    shortLabel: "Transporte",
    sortOrder: 5,
    active: true,
    icon: "car",
    keywords: [
      "shell",
      "texaco",
      "esso",
      "gasolina",
      "combustible",
      "estacion de gas",
      "estación de gas",
      "uber",
      "indrive",
      "didi",
      "metro",
      "autobus",
      "autobús",
      "omnibus",
      "ómnibus",
      "parada",
      "peaje",
    ],
    obligationTypes: ["transport"],
  },
  {
    slug: "salud",
    label: "Salud y Farmacia",
    shortLabel: "Salud",
    sortOrder: 6,
    active: true,
    icon: "wallet",
    keywords: [
      "farmacia",
      "carol",
      "popular",
      "clinica",
      "clínica",
      "hospital",
      "laboratorio",
      "medico",
      "médico",
      "odontolog",
      "odontólog",
      "salud",
      "ars",
      "eps",
    ],
    obligationTypes: ["insurance", "gym"],
  },
  {
    slug: "educacion",
    label: "Educación",
    shortLabel: "Educación",
    sortOrder: 7,
    active: true,
    icon: "graduation-cap",
    keywords: [
      "universidad",
      "colegio",
      "escuela",
      "udoy",
      "intec",
      "pucmm",
      "uasd",
      "unibe",
      "unphu",
      "curso",
      "matricula",
      "matrícula",
      "tuicion",
      "tuición",
    ],
    obligationTypes: ["university"],
  },
  {
    slug: "servicios",
    label: "Servicios del Hogar",
    shortLabel: "Servicios",
    sortOrder: 8,
    active: true,
    icon: "home",
    keywords: [
      "edeeste",
      "edenorte",
      "edesur",
      "caasd",
      "agua",
      "luz",
      "electricidad",
      "gas propano",
      "propano",
    ],
    obligationTypes: ["rent", "electricity", "water", "gas"],
  },
  {
    slug: "telecom",
    label: "Telecomunicaciones",
    shortLabel: "Telecom",
    sortOrder: 9,
    active: true,
    icon: "smartphone",
    keywords: [
      "claro",
      "altice",
      "viva",
      "tricom",
      "wind",
      "internet",
      "celular",
      "telefono",
      "teléfono",
      "datos moviles",
      "datos móviles",
    ],
    obligationTypes: ["internet"],
  },
  {
    slug: "ocio",
    label: "Ocio y Salidas",
    shortLabel: "Ocio",
    sortOrder: 10,
    active: true,
    icon: "wine",
    keywords: [
      "bar",
      "discoteca",
      "club",
      "bowling",
      "karaoke",
      "salida",
      "recreacion",
      "recreación",
    ],
    obligationTypes: [],
  },
  {
    slug: "compras",
    label: "Compras y Retail",
    shortLabel: "Compras",
    sortOrder: 11,
    active: true,
    icon: "shopping-bag",
    keywords: [
      "amazon",
      "tienda",
      "plaza",
      "ikea",
      "home depot",
      "multicentro",
      "acropolis",
      "retail",
      "shein",
      "aliexpress",
    ],
    obligationTypes: [],
  },
  {
    slug: "viajes",
    label: "Viajes y Turismo",
    shortLabel: "Viajes",
    sortOrder: 12,
    active: true,
    icon: "plane",
    keywords: [
      "airbnb",
      "booking",
      "avianca",
      "copa",
      "jetblue",
      "hotel",
      "resort",
      "aerolinea",
      "aerolínea",
      "vuelo",
      "turismo",
    ],
    obligationTypes: [],
  },
  {
    slug: "deudas",
    label: "Deudas y Préstamos",
    shortLabel: "Deudas",
    sortOrder: 13,
    active: true,
    icon: "credit-card",
    keywords: [
      "prestamo",
      "préstamo",
      "cuota",
      "financiera",
      "tarjeta de credito",
      "tarjeta de crédito",
      "credito",
      "crédito",
      "interes",
      "interés",
      "amortizacion",
      "amortización",
    ],
    obligationTypes: [],
  },
  {
    slug: "negocios",
    label: "Servicios Profesionales y Negocios",
    shortLabel: "Negocios",
    sortOrder: 14,
    active: true,
    icon: "briefcase",
    keywords: [
      "contador",
      "abogado",
      "notario",
      "consultoria",
      "consultoría",
      "oficina",
      "saas",
      "software",
      "hosting",
      "dominio",
      "github",
      "openai",
    ],
    obligationTypes: [],
  },
  {
    slug: "hogar",
    label: "Hogar y Reparaciones",
    shortLabel: "Hogar",
    sortOrder: 15,
    active: true,
    icon: "hammer",
    keywords: [
      "ferreteria",
      "ferretería",
      "corripio",
      "construccion",
      "construcción",
      "reparacion",
      "reparación",
      "pintura",
      "plomeria",
      "plomería",
    ],
    obligationTypes: [],
  },
  {
    slug: "mascotas",
    label: "Mascotas",
    shortLabel: "Mascotas",
    sortOrder: 16,
    active: true,
    icon: "paw-print",
    keywords: [
      "veterinaria",
      "pet shop",
      "superpet",
      "mascota",
      "perro",
      "gato",
    ],
    obligationTypes: [],
  },
  {
    slug: "ahorros",
    label: "Ahorros e Inversiones",
    shortLabel: "Ahorros",
    sortOrder: 17,
    active: true,
    icon: "piggy-bank",
    keywords: [
      "ahorro",
      "inversion",
      "inversión",
      "broker",
      "acciones",
      "fondo mutuo",
      "certificado",
    ],
    obligationTypes: [],
  },
  {
    slug: "otros",
    label: "Otros",
    shortLabel: "Otros",
    sortOrder: 99,
    active: true,
    icon: "help-circle",
    keywords: [],
    obligationTypes: ["other"],
  },
] as const;

export type ExpenseCategorySlug =
  (typeof EXPENSE_CATEGORY_CATALOG)[number]["slug"];

export interface ExpenseCategoryDefinition {
  slug: ExpenseCategorySlug;
  label: string;
  shortLabel: string;
  sortOrder: number;
  active: boolean;
  icon: ExpenseCategoryIconKey;
  keywords: readonly string[];
  obligationTypes: readonly ObligationType[];
}

/** @deprecated Use EXPENSE_CATEGORY_CATALOG */
export const EXPENSE_CATEGORIES: ExpenseCategoryDefinition[] =
  EXPENSE_CATEGORY_CATALOG.map((category) => ({
    ...category,
    keywords: [...category.keywords],
    obligationTypes: [...category.obligationTypes],
  }));

const categoryBySlug = new Map(
  EXPENSE_CATEGORY_CATALOG.map((category) => [category.slug, category])
);

const obligationTypeToSlug = new Map<ObligationType, ExpenseCategorySlug>();

for (const category of EXPENSE_CATEGORY_CATALOG) {
  if (!category.active) continue;
  for (const obligationType of category.obligationTypes) {
    obligationTypeToSlug.set(obligationType, category.slug);
  }
}

export function getActiveCategorySlugs(): ExpenseCategorySlug[] {
  return EXPENSE_CATEGORY_CATALOG.filter((category) => category.active).map(
    (category) => category.slug
  );
}

export function getCategoryBySlug(slug: ExpenseCategorySlug): ExpenseCategoryDefinition {
  const category = categoryBySlug.get(slug);
  if (category) {
    return {
      ...category,
      keywords: [...category.keywords],
      obligationTypes: [...category.obligationTypes],
    };
  }
  return getCategoryBySlug("otros");
}

export function getCategoryLabel(slug: ExpenseCategorySlug): string {
  return getCategoryBySlug(slug).label;
}

export function resolveObligationCategorySlug(
  obligationType: ObligationType
): ExpenseCategorySlug {
  return obligationTypeToSlug.get(obligationType) ?? "otros";
}

export const EXPENSE_TRANSACTION_TYPES = [
  "debit",
  "payment",
  "transfer",
  "unknown",
] as const;

export const INCOME_TRANSACTION_TYPES = ["credit", "deposit"] as const;

export const DEBT_CATEGORY_SLUG = "deudas" as const satisfies ExpenseCategorySlug;
