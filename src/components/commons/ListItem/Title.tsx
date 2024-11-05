/* eslint-disable jsx-a11y/no-autofocus */
import { ReactNode } from "react";

interface TitleProps {
  /** 수정모드 여부 입니다. */
  isEditMode?: boolean;
  /** 수정한 내용 변경 함수입니다. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 수정한 내용 keydown 함수입니다. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** title에 들어갈 내용입니다. */
  children: ReactNode;
  /** input의 placeholder입니다. */
  placeholder?: string;
  /** text 스타일입니다. */
  text?: string;
}

function Title({
  isEditMode = false,
  onChange,
  onKeyDown,
  children,
  placeholder = "이름",
  text = "text-16-400",
}: TitleProps) {
  return (
    <div>
      {isEditMode ? (
        <input
          className={`mt-1 w-full border-b bg-transparent decoration-gray-70 outline-none ${text}`}
          placeholder={placeholder}
          value={children as string}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus
        />
      ) : (
        <span className={`cursor-default text-gray-100 ${text}`}>
          {children}
        </span>
      )}
    </div>
  );
}

export default Title;
