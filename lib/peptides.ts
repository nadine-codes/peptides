import type { CategorySlug } from "./types";

export interface CategoryDef {
  slug: CategorySlug;
  label: string;
  short: string;
  blurb: string;
  peptides: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "fat-loss",
    label: "Fat Loss",
    short: "Metabolic / weight",
    blurb: "Compounds appearing in metabolic and weight-management discussions.",
    peptides: ["Semaglutide", "Tirzepatide", "Tesofensine", "Retatrutide", "AOD-9604"],
  },
  {
    slug: "recovery",
    label: "Recovery",
    short: "Tissue repair",
    blurb: "Compounds appearing in tissue-repair and recovery discussions.",
    peptides: ["BPC-157", "TB-500", "GHK-Cu", "Pentadeca Arginate"],
  },
  {
    slug: "longevity",
    label: "Longevity",
    short: "Aging research",
    blurb: "Compounds appearing in aging and longevity research discussions.",
    peptides: ["Epitalon", "Thymalin", "GHK-Cu", "Humanin"],
  },
  {
    slug: "sleep",
    label: "Sleep",
    short: "Sleep / circadian",
    blurb: "Compounds appearing in sleep and circadian research discussions.",
    peptides: ["DSIP", "Selank", "Epitalon"],
  },
  {
    slug: "muscle-retention",
    label: "Muscle Retention",
    short: "Lean mass",
    blurb: "Compounds appearing in lean-mass preservation discussions.",
    peptides: ["Ipamorelin", "CJC-1295", "Tesamorelin", "Sermorelin"],
  },
  {
    slug: "cognitive-performance",
    label: "Cognitive Performance",
    short: "Nootropic research",
    blurb: "Compounds appearing in nootropic and cognitive-research discussions.",
    peptides: ["Semax", "Selank", "Cerebrolysin", "Dihexa"],
  },
  {
    slug: "skin-health",
    label: "Skin Health",
    short: "Dermatology",
    blurb: "Compounds appearing in dermatological and skin-research discussions.",
    peptides: ["GHK-Cu", "Matrixyl", "Argireline", "BPC-157"],
  },
];

export const CATEGORY_BY_SLUG: Record<CategorySlug, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, CategoryDef>;

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORY_BY_SLUG, value);
}

export function peptideSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+\/\s+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
