const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type ClothesImageValidationResult =
  | {
      success: true;
      data: {
        extension: "jpg" | "png" | "webp";
      };
    }
  | {
      success: false;
      message: string;
      code: "INVALID_REQUEST";
    };

// MIME 타입을 S3 object key에 사용할 파일 확장자로 변환한다.
function getExtension(contentType: string) {
  if (contentType === "image/jpeg") {
    return "jpg";
  }

  if (contentType === "image/png") {
    return "png";
  }

  return "webp";
}

// 의류 이미지 파일의 형식과 용량이 업로드 정책을 만족하는지 검사한다.
export function validateClothesImageFile(file: File): ClothesImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      success: false,
      message: "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다.",
      code: "INVALID_REQUEST",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      success: false,
      message: "이미지 파일은 5MB 이하만 업로드할 수 있습니다.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      extension: getExtension(file.type),
    },
  };
}
