"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { fetchApiData } from "@/lib/api/client";

type UploadResponseData = {
  imageUrl: string;
};

function isUploadResponseData(value: unknown): value is UploadResponseData {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "imageUrl" in value &&
    typeof value.imageUrl === "string"
  );
}

export function useClothesImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    const nextPreviewUrl = file ? URL.createObjectURL(file) : "";

    previewUrlRef.current = nextPreviewUrl;
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
  }

  async function uploadSelectedImage() {
    if (!selectedFile) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const data = await fetchApiData<UploadResponseData>(
      "/api/v1/uploads/clothes-image",
      {
        method: "POST",
        body: formData,
      },
      {
        fallbackMessage: "이미지 업로드 중 오류가 발생했습니다.",
        invalidDataMessage: "이미지 업로드 응답이 올바르지 않습니다.",
        validateData: isUploadResponseData,
      },
    );

    return data.imageUrl;
  }

  return {
    handleFileChange,
    previewUrl,
    selectedFile,
    uploadSelectedImage,
  };
}
