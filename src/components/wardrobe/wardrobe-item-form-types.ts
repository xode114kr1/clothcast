export type ClothingCategory = "TOP" | "BOTTOM" | "OUTER" | "SHOES";

export type ClothingFit = "oversized" | "regular" | "slim";

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

export const clothingCategoryOptions = [
  { label: "상의", value: "TOP" },
  { label: "하의", value: "BOTTOM" },
  { label: "아우터", value: "OUTER" },
  { label: "신발", value: "SHOES" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ClothingCategory;
}>;

export const clothingFitOptions = [
  { label: "오버사이즈", value: "oversized" },
  { label: "레귤러", value: "regular" },
  { label: "슬림", value: "slim" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ClothingFit;
}>;
