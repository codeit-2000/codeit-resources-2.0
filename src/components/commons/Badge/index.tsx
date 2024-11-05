import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";

interface BadgeProps extends ComponentProps<"span"> {
  /** 뱃지의 내용을 지정합니다. */
  children: ReactNode;
  /** 뱃지의 모양을 지정합니다. */
  variant: "primary" | "secondary" | "secondarySmall";
}

function Badge({ children, variant = "primary" }: BadgeProps) {
  const badgeStyle = clsx({
    "bg-pink-60 rounded-8 text-10-500 text-gray-0 px-4 pt-1 inline-block text-nowrap":
      variant === "primary",
    "rounded-32 border-gray-100-opacity-5 text-15-700 border bg-purple-5 px-12 py-6 text-purple-50 text-nowrap":
      variant === "secondary",
    "rounded-32 border-gray-100-opacity-5 text-11-500 border bg-purple-5 px-8 py-2 text-purple-50 text-nowrap":
      variant === "secondarySmall",
  });

  return <span className={badgeStyle}>{children}</span>;
}

export default Badge;
