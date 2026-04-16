import {
  isClothingCategory,
  isClothingFit,
} from "@/lib/clothes/clothes-validation-shared";
import type {
  ClothesIdValidationResult,
  ListClothesFilters,
  ListClothesValidationResult,
} from "@/lib/clothes/clothes-validation-types";

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
