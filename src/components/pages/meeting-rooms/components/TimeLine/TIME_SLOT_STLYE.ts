import clsx from "clsx";

const TimeSlotStyle = {
  grayBorder: (isFirst: boolean = false, isLast: boolean = false) =>
    clsx(
      `bg-[#3332361A]`, // 배경색 지정
      {
        // 단일 박스 (모든 보더)
        "shadow-[inset_0px_0px_0px_1px_#413B541A]": isFirst && isLast,

        // 시작 박스 (왼쪽 보더 포함)
        "shadow-[inset_1px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
          isFirst && !isLast,

        // 끝 박스 (오른쪽 보더 포함)
        "shadow-[inset_-1px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
          isLast && !isFirst,

        // 중간 박스 (가로 보더만)
        "shadow-[inset_0px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
          !isFirst && !isLast,
      },
    ),

  purpleBorder: (isFirst: boolean = false, isLast: boolean = false) =>
    // TODO 컬러수정
    clsx(`bg-[#9933FF1A]`, {
      "shadow-[inset_0px_0px_0px_1px_#D4A4F9]": isFirst && isLast,
      "shadow-[inset_1px_1px_0px_0px_#D4A4F9, inset_0px_-1px_0px_0px_#D4A4F9]":
        isFirst && !isLast,
      "shadow-[inset_-1px_1px_0px_0px_#D4A4F9, inset_0px_-1px_0px_0px_#D4A4F9]":
        isLast && !isFirst,
      "shadow-[inset_0px_1px_0px_0px_#D4A4F9, inset_0px_-1px_0px_0px_#D4A4F9]":
        !isFirst && !isLast,
    }),

  redBorder: (isFirst: boolean = false, isLast: boolean = false) =>
    clsx(`bg-[#FBDBE366]`, {
      "shadow-[inset_0px_0px_0px_1px_#D6173A66]": isFirst && isLast,
      "shadow-[inset_1px_1px_0px_0px_#D6173A66, inset_0px_-1px_0px_0px_#D6173A66]":
        isFirst && !isLast,
      "shadow-[inset_-1px_1px_0px_0px_#D6173A66, inset_0px_-1px_0px_0px_#D6173A66]":
        isLast && !isFirst,
      "shadow-[inset_0px_1px_0px_0px_#D6173A66, inset_0px_-1px_0px_0px_#D6173A66]":
        !isFirst && !isLast,
    }),
};

export default TimeSlotStyle;
