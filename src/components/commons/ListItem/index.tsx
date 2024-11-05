import HamBurger from "@public/icons/icon-hamburger.svg";
import clsx from "clsx";
import { ReactNode } from "react";

import Right from "./Right";
import Title from "./Title";

interface ListItemProps {
  children: ReactNode;
  /** 햄버거 아이콘과 글자 사이의 간격입니다 */
  gap?: string;
  /** 수정 모드 여부 입니다. */
  isEditMode?: boolean;
  /** 배경색 유무입니다. */
  isBackground?: boolean;
  /** 높이입니다. */
  height?: string;
}
/**
 * TODO: 테두리 색상 넣기
 */
function ListItem({
  children,
  gap = "gap-32",
  isEditMode = false,
  isBackground = false,
  height = "h-72",
}: ListItemProps) {
  return (
    <div
      className={clsx(
        "flex items-center rounded-12 border px-24 duration-300",
        gap,
        height,
        {
          "bg-gray-10": isBackground,
          "bg-gray-0": !isBackground,
        },
        {
          "border-gray-70 duration-300": isEditMode,
        },
      )}
    >
      <HamBurger />
      <div className="flex w-full items-center justify-between">{children}</div>
    </div>
  );
}

ListItem.Title = Title;
ListItem.Right = Right;

export default ListItem;
