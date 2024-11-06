/* eslint-disable no-param-reassign */
import Button from "@/components/commons/Button";
import ProfileImage from "@/components/commons/ProfileImage";
import { TeamInput } from "@/lib/zod-schema/user";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

function MemberProfileImage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { setValue, watch, resetField } = useFormContext<TeamInput>();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
        resetField("image");
        setPreviewUrl(null);
        event.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("이미지는 10MB 이하여야 합니다.");
        resetField("image");
        setPreviewUrl(null);
        event.target.value = "";
        return;
      }

      setValue("image", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setErrorMessage("");
      event.target.value = "";
    }
  };

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const watchedImage = watch("image");
  const imagePath = typeof watchedImage === "string" ? watchedImage : undefined;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-24">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="미리보기 이미지"
            loading="lazy"
            className="h-120 w-120 rounded-full object-cover"
          />
        ) : (
          <ProfileImage imagePath={imagePath} size="xl" />
        )}
        <div className="relative">
          <Button variant="secondary" size="small" width="w-90" height="h-32">
            사진 업로드
          </Button>
          <label
            htmlFor="upload-input"
            className="absolute inset-0 cursor-pointer"
            style={{ display: "block" }}
          />
          <input
            type="file"
            id="upload-input"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
      {errorMessage && (
        <p className="text-13-500 text-status-negative">※{errorMessage}</p>
      )}
    </div>
  );
}

export default MemberProfileImage;
