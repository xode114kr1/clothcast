import type {
  ClothingCategory as PrismaClothingCategory,
  ClothingFit as PrismaClothingFit,
} from "@/generated/prisma/enums";

export type ClothingCategory = PrismaClothingCategory;

export type ClothingFit = PrismaClothingFit;

export type ClothesItem = {
  id: number;
  name: string;
  category: ClothingCategory;
  color: string;
  fit: ClothingFit;
  formality: number;
  material: string | null;
  pattern: string | null;
  imageUrl: string;
};

export type ClothesFormValues = {
  name: string;
  category: ClothingCategory;
  color: string;
  fit: ClothingFit;
  formality: number;
  material: string;
  pattern: string;
};

export type ClothesPayload = ClothesFormValues & {
  imageUrl: string;
};

export const clothingCategoryLabels: Record<ClothingCategory, string> = {
  TOP: "상의",
  BOTTOM: "하의",
  OUTER: "아우터",
  SHOES: "신발",
};

export const clothingFitLabels: Record<ClothingFit, string> = {
  oversized: "오버사이즈",
  regular: "레귤러",
  slim: "슬림",
};

export const clothingCategoryOptions = [
  { label: clothingCategoryLabels.TOP, value: "TOP" },
  { label: clothingCategoryLabels.BOTTOM, value: "BOTTOM" },
  { label: clothingCategoryLabels.OUTER, value: "OUTER" },
  { label: clothingCategoryLabels.SHOES, value: "SHOES" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ClothingCategory;
}>;

export const clothingFitOptions = [
  { label: clothingFitLabels.oversized, value: "oversized" },
  { label: clothingFitLabels.regular, value: "regular" },
  { label: clothingFitLabels.slim, value: "slim" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ClothingFit;
}>;

export function getClothingCategoryLabel(category: string) {
  return clothingCategoryLabels[category as ClothingCategory] ?? category;
}

export function getClothingFitLabel(fit: string) {
  return clothingFitLabels[fit as ClothingFit] ?? fit;
}
