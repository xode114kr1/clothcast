import { ClothingCategory, ClothingFit } from "@/generated/prisma/enums";
import type {
  ClothingCategory as ClothingCategoryValue,
  ClothingFit as ClothingFitValue,
} from "@/generated/prisma/enums";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOptionalString(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizePatchOptionalString(value: unknown) {
  if (value === null) {
    return {
      success: true,
      data: null,
    } as const;
  }

  if (typeof value !== "string") {
    return {
      success: false,
    } as const;
  }

  return {
    success: true,
    data: value.trim().length > 0 ? value.trim() : null,
  } as const;
}

export function isClothingCategory(
  value: unknown,
): value is ClothingCategoryValue {
  return (
    typeof value === "string" &&
    Object.values(ClothingCategory).includes(value as ClothingCategoryValue)
  );
}

export function isClothingFit(value: unknown): value is ClothingFitValue {
  return (
    typeof value === "string" &&
    Object.values(ClothingFit).includes(value as ClothingFitValue)
  );
}

export function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
