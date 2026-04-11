import { ClothingCategory, ClothingFit } from "@/generated/prisma/enums";
import type {
  ClothingCategory as ClothingCategoryValue,
  ClothingFit as ClothingFitValue,
} from "@/generated/prisma/enums";

type ClothesValidationCode = "INVALID_REQUEST";

export type CreateClothesInput = {
  name: string;
  category: ClothingCategoryValue;
  color: string;
  fit: ClothingFitValue;
  formality: number;
  material: string | null;
  pattern: string | null;
  imageUrl: string;
};

export type CreateClothesValidationResult =
  | {
      success: true;
      data: CreateClothesInput;
    }
  | {
      success: false;
      message: string;
      code: ClothesValidationCode;
    };

export type ListClothesFilters = {
  category?: ClothingCategoryValue;
  fit?: ClothingFitValue;
  formality?: number;
};

export type ListClothesValidationResult =
  | {
      success: true;
      data: ListClothesFilters;
    }
  | {
      success: false;
      message: string;
      code: ClothesValidationCode;
    };

export type ClothesIdValidationResult =
  | {
      success: true;
      data: {
        id: number;
      };
    }
  | {
      success: false;
      message: string;
      code: ClothesValidationCode;
    };

// 알 수 없는 JSON 값이 객체 형태인지 확인한다.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 필수 문자열 입력값을 앞뒤 공백이 제거된 문자열로 정규화한다.
function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

// 선택 문자열 입력값을 공백 제거 후 null 또는 문자열로 정규화한다.
function normalizeOptionalString(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

// 요청 값이 DB에서 허용하는 의류 카테고리 enum인지 검사한다.
export function isClothingCategory(value: unknown): value is ClothingCategoryValue {
  return (
    typeof value === "string" &&
    Object.values(ClothingCategory).includes(value as ClothingCategoryValue)
  );
}

// 요청 값이 DB에서 허용하는 핏 enum인지 검사한다.
export function isClothingFit(value: unknown): value is ClothingFitValue {
  return (
    typeof value === "string" &&
    Object.values(ClothingFit).includes(value as ClothingFitValue)
  );
}

// imageUrl이 URL 형식으로 전달되었는지 검사한다.
function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// 옷 등록 요청 본문이 Clothes 생성 조건을 만족하는지 검사하고 저장 가능한 값으로 정규화한다.
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

// 옷 목록 조회 query string이 허용된 필터 값으로 구성되어 있는지 검사한다.
export function validateListClothesQuery(
  searchParams: URLSearchParams,
): ListClothesValidationResult {
  const category = searchParams.get("category");
  const fit = searchParams.get("fit");
  const formality = searchParams.get("formality");
  const filters: ListClothesFilters = {};

  if (category) {
    if (!isClothingCategory(category)) {
      return {
        success: false,
        message: "올바른 카테고리를 선택해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    filters.category = category;
  }

  if (fit) {
    if (!isClothingFit(fit)) {
      return {
        success: false,
        message: "올바른 핏을 선택해주세요.",
        code: "INVALID_REQUEST",
      };
    }

    filters.fit = fit;
  }

  if (formality) {
    const formalityNumber = Number(formality);

    if (
      !Number.isInteger(formalityNumber) ||
      formalityNumber < 1 ||
      formalityNumber > 5
    ) {
      return {
        success: false,
        message: "포멀함 점수는 1~5 사이의 정수여야 합니다.",
        code: "INVALID_REQUEST",
      };
    }

    filters.formality = formalityNumber;
  }

  return {
    success: true,
    data: filters,
  };
}

// route param으로 받은 의류 ID가 양의 정수인지 검사한다.
export function validateClothesIdParam(id: string): ClothesIdValidationResult {
  const clothesId = Number(id);

  if (!Number.isInteger(clothesId) || clothesId <= 0) {
    return {
      success: false,
      message: "올바른 의류 ID가 필요합니다.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      id: clothesId,
    },
  };
}
