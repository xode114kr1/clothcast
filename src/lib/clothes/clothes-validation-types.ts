import type {
  ClothingCategory as ClothingCategoryValue,
  ClothingFit as ClothingFitValue,
} from "@/generated/prisma/enums";

export type ClothesValidationCode = "INVALID_REQUEST";

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

export type UpdateClothesInput = {
  name?: string;
  category?: ClothingCategoryValue;
  color?: string;
  fit?: ClothingFitValue;
  formality?: number;
  material?: string | null;
  pattern?: string | null;
  imageUrl?: string;
};

export type UpdateClothesValidationResult =
  | {
      success: true;
      data: UpdateClothesInput;
    }
  | {
      success: false;
      message: string;
      code: ClothesValidationCode;
    };
