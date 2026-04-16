import type {
  ClothesFormValues,
  ClothesItem,
  ClothesPayload,
  ClothingCategory,
  ClothingFit,
} from "./wardrobe-item-form-types";

export type ApiResponse = {
  status: "success" | "error";
  message: string;
  data?: unknown;
};

type UploadResponseData = {
  imageUrl: string;
};

export function getResponseMessage(
  data: unknown,
  fallbackMessage = "의류 정보를 처리하는 중 오류가 발생했습니다.",
) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallbackMessage;
}

export function getClothesItem(data: ApiResponse | null) {
  const item = data?.data as ClothesItem | undefined;

  if (
    typeof item?.id === "number" &&
    typeof item.name === "string" &&
    typeof item.imageUrl === "string"
  ) {
    return item;
  }

  return null;
}

export function getUploadedImageUrl(data: ApiResponse | null) {
  const payload = data?.data as UploadResponseData | undefined;

  if (typeof payload?.imageUrl === "string") {
    return payload.imageUrl;
  }

  return null;
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
