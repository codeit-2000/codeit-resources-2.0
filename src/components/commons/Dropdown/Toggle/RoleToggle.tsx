import ArrowDown from "@public/icons/icon-arrow-down.svg";
import clsx from "clsx";

// 권한 드랍다운 토글
export default function RoleToggle({
  isOpen,
  toggleDropdown,
  renderText,
}: {
  isOpen: boolean;
  toggleDropdown: () => void;
  renderText: () => string;
}) {
  return (
    <button
      type="button"
      onClick={toggleDropdown}
      className={clsx(
        "flex h-40 w-96 items-center justify-between rounded-8 border border-gray-100-opacity-20 px-16 py-7 text-16-400 hover:border-purple-70 hover:text-gray-100",
        {
          "border-purple-70 text-gray-100": isOpen,
          "text-gray-100-opacity-60": !isOpen,
        },
      )}
    >
      <span>{renderText()}</span>
      <ArrowDown
        className={clsx({
          "rotate-180": isOpen,
        })}
      />
    </button>
  );
}
