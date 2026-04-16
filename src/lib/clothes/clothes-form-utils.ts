import type {
  ClothesFormValues,
  ClothesItem,
  ClothesPayload,
  ClothingCategory,
  ClothingFit,
} from "@/lib/clothes/clothes-form-types";

export function isClothesItem(value: unknown): value is ClothesItem {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.imageUrl === "string"
  );
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function buildClothesFormValues(formData: FormData): ClothesFormValues {
  return {
    name: getRequiredString(formData, "name"),
    category: getRequiredString(formData, "category") as ClothingCategory,
    color: getRequiredString(formData, "color"),
    fit: getRequiredString(formData, "fit") as ClothingFit,
    formality: Number(formData.get("formality")),
    material: getRequiredString(formData, "material"),
    pattern: getRequiredString(formData, "pattern"),
  };
}

export function buildClothesPayload(
  formData: FormData,
  imageUrl: string,
): ClothesPayload {
  return {
    ...buildClothesFormValues(formData),
    imageUrl,
  };
}
