import ArrowDown from "@public/icons/icon-arrow-down.svg";
import clsx from "clsx";
import { useEffect, useRef } from "react";

// 시작 시간, 종료 시간 토글 드랍다운
export default function TimeToggle({
  label,
  isOpen,
  toggleDropdown,
  value,
  handleChange,
  isInput,
  isError = false,
  errorMessage = "",
}: {
  label: string;
  isOpen: boolean;
  toggleDropdown: () => void;
  value: string;
  handleChange: (value: string) => void;
  isInput: boolean;
  isError?: boolean;
  errorMessage?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // isInput이 true일 때 input에 focus
    if (isInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInput]);

  return (
    <div>
      <button
        type="button"
        onClick={toggleDropdown}
        className={clsx(
          "group relative flex w-full items-center justify-between rounded-8 px-20 py-14 text-left text-16",
          "border",
          isError ? "border-status-negative" : "border-gray-100-opacity-20",
          {
            "hover:border-purple-70": !isError,
          },
        )}
      >
        <span
          className={clsx(
            "absolute left-15 top-[-9px] bg-white px-4 text-13",
            isError
              ? "text-status-negative"
              : "text-gray-100-opacity-80 group-hover:text-purple-70",
            {
              "text-purple-70": isOpen && !isError,
            },
          )}
        >
          {label}
        </span>
        <span
          className={clsx("text-16-400", {
            "text-gray-100-opacity-80 group-hover:text-gray-100": !isOpen,
            "text-gray-100": isOpen,
          })}
        >
          {isInput ? (
            <input
              ref={inputRef}
              className="h-full w-full focus:outline-none"
              type="text"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value)
              }
            />
          ) : (
            value || "HH:MM"
          )}
        </span>
        <ArrowDown
          className={clsx("ml-8", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      {isError && errorMessage && (
        <p className="mt-2 text-13 text-[#D6173A]">{errorMessage}</p>
      )}
    </div>
  );
}
