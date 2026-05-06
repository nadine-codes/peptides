import { notFound } from "next/navigation";
import { isCategorySlug, CATEGORY_BY_SLUG } from "@/lib/peptides";
import { PeptideDetailClient } from "./PeptideDetailClient";

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ category: string; peptide: string }>;
}) {
  const { category, peptide } = await params;
  if (!isCategorySlug(category)) notFound();
  const cat = CATEGORY_BY_SLUG[category];
  return (
    <PeptideDetailClient
      category={category}
      categoryLabel={cat.label}
      peptideSlug={peptide}
    />
  );
}
