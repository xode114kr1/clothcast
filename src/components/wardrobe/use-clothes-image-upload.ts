"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  type ApiResponse,
  getResponseMessage,
  getUploadedImageUrl,
} from "./clothes-form-utils";

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

    const response = await fetch("/api/v1/uploads/clothes-image", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || data?.status !== "success") {
      throw new Error(
        getResponseMessage(data, "이미지 업로드 중 오류가 발생했습니다."),
      );
    }

    const imageUrl = getUploadedImageUrl(data);

    if (!imageUrl) {
      throw new Error("이미지 업로드 응답이 올바르지 않습니다.");
    }

    return imageUrl;
  }

  return {
    handleFileChange,
    previewUrl,
    selectedFile,
    uploadSelectedImage,
  };
}
