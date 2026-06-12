import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { OBLIGATION_TYPES } from "../modules/onboarding/config/financial";
import {
  EXPENSE_CATEGORY_CATALOG,
  getActiveCategorySlugs,
} from "../modules/shared/config/expense-categories";
import { Constants } from "../src/types/supabase";

const catalogSlugs = getActiveCategorySlugs().sort();
const enumSlugs = [...Constants.public.Enums.expense_category].sort();

const errors: string[] = [];

const onlyInCatalog = catalogSlugs.filter((slug) => !enumSlugs.includes(slug));
const onlyInEnum = enumSlugs.filter((slug) => !catalogSlugs.includes(slug));

if (onlyInCatalog.length) {
  errors.push(`Slugs in catalog but missing from DB enum: ${onlyInCatalog.join(", ")}`);
}

if (onlyInEnum.length) {
  errors.push(`Slugs in DB enum but missing from catalog: ${onlyInEnum.join(", ")}`);
}

const obligationTypes = OBLIGATION_TYPES.map((item) => item.value);
const mappedObligationTypes = new Set<string>();

for (const category of EXPENSE_CATEGORY_CATALOG) {
  if (!category.active) continue;
  for (const obligationType of category.obligationTypes) {
    if (mappedObligationTypes.has(obligationType)) {
      errors.push(`Obligation type "${obligationType}" mapped to multiple categories`);
    }
    mappedObligationTypes.add(obligationType);
  }
}

for (const obligationType of obligationTypes) {
  if (!mappedObligationTypes.has(obligationType)) {
    errors.push(`Obligation type "${obligationType}" is not mapped in the catalog`);
  }
}

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20250607_expense_categories.sql"
);
const migrationSql = readFileSync(migrationPath, "utf8");
const legacySlugs = [
  "transferencias_pagos_personas",
  "restaurantes_comida_rapida",
  "supermercados_alimentacion",
  "gasolina_transporte",
  "salud_farmacia",
  "servicios_hogar",
  "telecomunicaciones",
  "ocio_salidas",
  "compras_retail",
  "viajes_turismo",
  "deudas_prestamos",
  "servicios_profesionales_negocios",
  "hogar_reparaciones",
  "ahorros_inversiones",
];

for (const legacySlug of legacySlugs) {
  if (catalogSlugs.includes(legacySlug as (typeof catalogSlugs)[number])) {
    errors.push(`Legacy slug "${legacySlug}" still present in active catalog`);
  }
}

if (!migrationSql.includes("CREATE TYPE public.expense_category")) {
  errors.push("Original expense_category migration file is missing or changed");
}

const colorsMigrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20250614_expense_category_colors.sql"
);
const colorsMigrationSql = readFileSync(colorsMigrationPath, "utf8");

const seedColorRegex =
  /\('([a-z_]+)',\s*'(#[0-9A-Fa-f]{6})',\s*\d+\)/g;
const seededColors = new Map<string, string>();

for (const match of colorsMigrationSql.matchAll(seedColorRegex)) {
  const [, slug, colorHex] = match;
  seededColors.set(slug, colorHex.toUpperCase());
}

const missingColorSlugs = catalogSlugs.filter((slug) => !seededColors.has(slug));
if (missingColorSlugs.length) {
  errors.push(
    `Slugs missing from expense_categories seed: ${missingColorSlugs.join(", ")}`
  );
}

const extraColorSlugs = [...seededColors.keys()].filter(
  (slug) => !catalogSlugs.includes(slug as (typeof catalogSlugs)[number])
);
if (extraColorSlugs.length) {
  errors.push(
    `Slugs in expense_categories seed but not in active catalog: ${extraColorSlugs.join(", ")}`
  );
}

const colorValues = [...seededColors.values()];
const duplicateColors = colorValues.filter(
  (color, index) => colorValues.indexOf(color) !== index
);
if (duplicateColors.length) {
  errors.push(
    `Duplicate color_hex values in seed: ${[...new Set(duplicateColors)].join(", ")}`
  );
}

if (errors.length) {
  console.error("Expense category validation failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(
  `Expense categories OK (${catalogSlugs.length} slugs synced between catalog, DB enum, and color seed).`
);
