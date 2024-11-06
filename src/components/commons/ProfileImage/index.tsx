/* eslint-disable @next/next/no-img-element */
import { getImageUrl } from "@/lib/api/storage";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface Props {
  /** imagePath를 지정합니다. */
  imagePath?: string;
  /** ProfileImage 컴포넌트의 사이즈를 지정합니다. */
  size?: "sm" | "md" | "lg" | "xl";
  /** 접근성 향상을 위해 user를 지정합니다. */
  userName?: string;
}

const DEFAULT_IMAGE = "/images/default-profile.png";

export default function ProfileImage({
  imagePath,
  size = "md",
  userName,
}: Props) {
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);

  const { data: imageUrl } = useQuery({
    queryKey: ["profile-image", imagePath],
    queryFn: () => imagePath && getImageUrl(imagePath),
    enabled: !!imagePath,
    staleTime: 10 * 60 * 1000, // 10분
  });

  const classnames = clsx("rounded-full object-cover", {
    "size-32": size === "sm",
    "size-40": size === "md",
    "size-72": size === "lg",
    "size-120": size === "xl",
  });

  useEffect(() => {
    if (imageUrl) setImageSrc(imageUrl);
  }, [imageUrl]);

  return (
    <img
      src={imageSrc}
      alt={userName ? `${userName}의 profile` : "profile"}
      className={classnames}
      onError={() => setImageSrc(DEFAULT_IMAGE)}
    />
  );
}
