import {
  isClothingCategory,
  isClothingFit,
  isRecord,
  isValidUrl,
  normalizeOptionalString,
  normalizePatchOptionalString,
  normalizeRequiredString,
} from "@/lib/clothes/clothes-validation-shared";
import type {
  CreateClothesValidationResult,
  UpdateClothesInput,
  UpdateClothesValidationResult,
} from "@/lib/clothes/clothes-validation-types";

export function validateCreateClothesInput(
  body: unknown,
): CreateClothesValidationResult {
  const payload = isRecord(body) ? body : {};
  const name = normalizeRequiredString(payload.name);
  const color = normalizeRequiredString(payload.color);
  const imageUrl = normalizeRequiredString(payload.imageUrl);
  const material = normalizeOptionalString(payload.material);
  const pattern = normalizeOptionalString(payload.pattern);

  if (!name) {
    return {
      success: false,
      message: "옷 이름을 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (!isClothingCategory(payload.category)) {
    return {
      success: false,
      message: "올바른 카테고리를 선택해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (!color) {
    return {
      success: false,
      message: "색상을 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (!isClothingFit(payload.fit)) {
    return {
      success: false,
      message: "올바른 핏을 선택해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (
    typeof payload.formality !== "number" ||
    !Number.isInteger(payload.formality) ||
    payload.formality < 1 ||
    payload.formality > 5
  ) {
    return {
      success: false,
      message: "포멀함 점수는 1~5 사이의 정수여야 합니다.",
      code: "INVALID_REQUEST",
    };
  }

  if (!imageUrl || !isValidUrl(imageUrl)) {
    return {
      success: false,
      message: "업로드된 이미지 URL이 필요합니다.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      name,
      category: payload.category,
      color,
      fit: payload.fit,
      formality: payload.formality,
      material,
      pattern,
      imageUrl,
    },
  };
}

const UPDATABLE_CLOTHES_FIELDS = new Set([
  "name",
  "category",
  "color",
  "fit",
  "formality",
  "material",
  "pattern",
  "imageUrl",
]);

export function validateUpdateClothesInput(
  body: unknown,
): UpdateClothesValidationResult {
  if (!isRecord(body)) {
    return {
      success: false,
      message: "요청 본문이 올바르지 않습니다.",
      code: "INVALID_REQUEST",
    };
  }

  const keys = Object.keys(body);

  if (keys.length === 0) {
    return {
      success: false,
      message: "수정할 의류 정보가 필요합니다.",
      code: "INVALID_REQUEST",
    };
  }

  if (keys.some((key) => !UPDATABLE_CLOTHES_FIELDS.has(key))) {
    return {
      success: false,
      message: "수정할 수 없는 필드가 포함되어 있습니다.",
      code: "INVALID_REQUEST",
    };
  }

  const data: UpdateClothesInput = {};

  if ("name" in body) {
    const name = normalizeRequiredString(body.name);

    if (!name) {
      return {
        success: false,
        message: "옷 이름을 입력해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    data.name = name;
  }

  if ("category" in body) {
    if (!isClothingCategory(body.category)) {
      return {
        success: false,
        message: "올바른 카테고리를 선택해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    data.category = body.category;
  }

  if ("color" in body) {
    const color = normalizeRequiredString(body.color);

    if (!color) {
      return {
        success: false,
        message: "색상을 입력해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    data.color = color;
  }

  if ("fit" in body) {
    if (!isClothingFit(body.fit)) {
      return {
        success: false,
        message: "올바른 핏을 선택해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    data.fit = body.fit;
  }

  if ("formality" in body) {
    if (
      typeof body.formality !== "number" ||
      !Number.isInteger(body.formality) ||
      body.formality < 1 ||
      body.formality > 5
    ) {
      return {
        success: false,
        message: "포멀함 점수는 1~5 사이의 정수여야 합니다.",
        code: "INVALID_REQUEST",
      };
    }

    data.formality = body.formality;
  }

  if ("material" in body) {
    const material = normalizePatchOptionalString(body.material);

    if (!material.success) {
      return {
        success: false,
        message: "소재는 문자열 또는 null이어야 합니다.",
        code: "INVALID_REQUEST",
      };
    }

    data.material = material.data;
  }

  if ("pattern" in body) {
    const pattern = normalizePatchOptionalString(body.pattern);

    if (!pattern.success) {
      return {
        success: false,
        message: "패턴은 문자열 또는 null이어야 합니다.",
        code: "INVALID_REQUEST",
      };
    }

    data.pattern = pattern.data;
  }

  if ("imageUrl" in body) {
    const imageUrl = normalizeRequiredString(body.imageUrl);

    if (!imageUrl || !isValidUrl(imageUrl)) {
      return {
        success: false,
        message: "업로드된 이미지 URL이 필요합니다.",
        code: "INVALID_REQUEST",
      };
    }

    data.imageUrl = imageUrl;
  }

  return {
    success: true,
    data,
  };
}
