import { notFound } from "next/navigation";
import { isCategorySlug, CATEGORY_BY_SLUG } from "@/lib/peptides";
import { ReportClient } from "./ReportClient";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();

  const cat = CATEGORY_BY_SLUG[category];
  return <ReportClient category={category} categoryLabel={cat.label} blurb={cat.blurb} />;
}
