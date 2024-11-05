import { getImageUrl } from "@/lib/api/storage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
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

  const dimensions = {
    sm: 32,
    md: 40,
    lg: 72,
    xl: 120,
  }[size];

  useEffect(() => {
    if (imageUrl) setImageSrc(imageUrl);
  }, [imageUrl]);

  return (
    <div
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: "50%",
        overflow: "hidden",
      }}
      className="flex items-center justify-center"
    >
      <Image
        src={imageSrc}
        alt={userName ? `${userName}의 profile` : "profile"}
        width={dimensions}
        height={dimensions}
        onError={() => setImageSrc(DEFAULT_IMAGE)}
      />
    </div>
  );
}
