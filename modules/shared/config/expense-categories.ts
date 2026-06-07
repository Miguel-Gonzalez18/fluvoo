export type ExpenseCategorySlug =
  | "supermercados_alimentacion"
  | "restaurantes_comida_rapida"
  | "gasolina_transporte"
  | "salud_farmacia"
  | "educacion"
  | "servicios_hogar"
  | "telecomunicaciones"
  | "entretenimiento"
  | "ocio_salidas"
  | "compras_retail"
  | "viajes_turismo"
  | "deudas_prestamos"
  | "servicios_profesionales_negocios"
  | "transferencias_pagos_personas"
  | "hogar_reparaciones"
  | "mascotas"
  | "ahorros_inversiones"
  | "otros";

export type ExpenseCategoryColorIndex = 1 | 2 | 3 | 4 | 5;

export interface ExpenseCategoryDefinition {
  slug: ExpenseCategorySlug;
  label: string;
  shortLabel: string;
  colorIndex: ExpenseCategoryColorIndex;
  matchPriority: number;
  keywords: string[];
}

export const EXPENSE_CATEGORIES: ExpenseCategoryDefinition[] = [
  {
    slug: "transferencias_pagos_personas",
    label: "Transferencias y Pagos Entre Personas",
    shortLabel: "Transferencias",
    colorIndex: 2,
    matchPriority: 1,
    keywords: [
      "transferencia a",
      "transferencia hacia",
      "envio a",
      "envío a",
      "pago a",
      "enviado a",
      "recibido de",
    ],
  },
  {
    slug: "entretenimiento",
    label: "Entretenimiento",
    shortLabel: "Entretenimiento",
    colorIndex: 5,
    matchPriority: 2,
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
  },
  {
    slug: "restaurantes_comida_rapida",
    label: "Restaurantes y Comida Rápida",
    shortLabel: "Restaurantes",
    colorIndex: 4,
    matchPriority: 3,
    keywords: [
      "uber eats",
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
  },
  {
    slug: "supermercados_alimentacion",
    label: "Supermercados y Alimentación",
    shortLabel: "Supermercados",
    colorIndex: 1,
    matchPriority: 4,
    keywords: [
      "sirena",
      "bravo",
      "nacional",
      "jumbo",
      "price smart",
      "supermercado",
      "colmado",
      "la sirena",
      "plaza lama",
      "carrefour",
      "walmart",
    ],
  },
  {
    slug: "gasolina_transporte",
    label: "Gasolina y Transporte",
    shortLabel: "Transporte",
    colorIndex: 2,
    matchPriority: 5,
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
  },
  {
    slug: "salud_farmacia",
    label: "Salud y Farmacia",
    shortLabel: "Salud",
    colorIndex: 3,
    matchPriority: 6,
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
  },
  {
    slug: "educacion",
    label: "Educación",
    shortLabel: "Educación",
    colorIndex: 1,
    matchPriority: 7,
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
  },
  {
    slug: "servicios_hogar",
    label: "Servicios del Hogar",
    shortLabel: "Servicios",
    colorIndex: 2,
    matchPriority: 8,
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
  },
  {
    slug: "telecomunicaciones",
    label: "Telecomunicaciones",
    shortLabel: "Telecom",
    colorIndex: 5,
    matchPriority: 9,
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
  },
  {
    slug: "ocio_salidas",
    label: "Ocio y Salidas",
    shortLabel: "Ocio",
    colorIndex: 5,
    matchPriority: 10,
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
  },
  {
    slug: "compras_retail",
    label: "Compras y Retail",
    shortLabel: "Compras",
    colorIndex: 4,
    matchPriority: 11,
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
  },
  {
    slug: "viajes_turismo",
    label: "Viajes y Turismo",
    shortLabel: "Viajes",
    colorIndex: 1,
    matchPriority: 12,
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
  },
  {
    slug: "deudas_prestamos",
    label: "Deudas y Préstamos",
    shortLabel: "Deudas",
    colorIndex: 3,
    matchPriority: 13,
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
  },
  {
    slug: "servicios_profesionales_negocios",
    label: "Servicios Profesionales y Negocios",
    shortLabel: "Negocios",
    colorIndex: 2,
    matchPriority: 14,
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
  },
  {
    slug: "hogar_reparaciones",
    label: "Hogar y Reparaciones",
    shortLabel: "Hogar",
    colorIndex: 1,
    matchPriority: 15,
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
  },
  {
    slug: "mascotas",
    label: "Mascotas",
    shortLabel: "Mascotas",
    colorIndex: 4,
    matchPriority: 16,
    keywords: [
      "veterinaria",
      "pet shop",
      "superpet",
      "mascota",
      "perro",
      "gato",
    ],
  },
  {
    slug: "ahorros_inversiones",
    label: "Ahorros e Inversiones",
    shortLabel: "Ahorros",
    colorIndex: 1,
    matchPriority: 17,
    keywords: [
      "ahorro",
      "inversion",
      "inversión",
      "broker",
      "acciones",
      "fondo mutuo",
      "certificado",
    ],
  },
  {
    slug: "otros",
    label: "Otros",
    shortLabel: "Otros",
    colorIndex: 3,
    matchPriority: 99,
    keywords: [],
  },
];

const categoryBySlug = new Map(
  EXPENSE_CATEGORIES.map((category) => [category.slug, category])
);

export function getCategoryBySlug(slug: ExpenseCategorySlug): ExpenseCategoryDefinition {
  return categoryBySlug.get(slug) ?? categoryBySlug.get("otros")!;
}

export function getCategoryLabel(slug: ExpenseCategorySlug): string {
  return getCategoryBySlug(slug).label;
}

export const EXPENSE_TRANSACTION_TYPES = [
  "debit",
  "payment",
  "transfer",
  "unknown",
] as const;

export const INCOME_TRANSACTION_TYPES = ["credit", "deposit"] as const;
