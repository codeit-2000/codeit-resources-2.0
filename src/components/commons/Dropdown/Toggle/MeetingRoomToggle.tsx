import ArrowDown from "@public/icons/icon-arrow-down.svg";
import clsx from "clsx";

// 회의실 예약 드랍다운
export default function MeetingRoomToggle({
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
        "group relative flex w-full items-center justify-between rounded-8 border border-gray-100-opacity-20 px-20 py-14 text-left text-16 hover:border-purple-70",
        {
          "border-purple-70": isOpen,
        },
      )}
    >
      <span
        className={clsx(
          "absolute left-15 top-[-9px] bg-white px-4 text-13 text-gray-100-opacity-80 group-hover:text-purple-70",
          {
            "text-purple-70": isOpen,
          },
        )}
      >
        회의실
      </span>
      <span
        className={clsx("text-16-400", {
          "text-gray-100-opacity-80 group-hover:text-gray-100": !isOpen,
          "text-gray-100": isOpen,
        })}
      >
        {renderText() === "" ? "회의실을 선택해 주세요." : renderText()}
      </span>
      <ArrowDown
        className={clsx("ml-8", {
          "rotate-180": isOpen,
        })}
      />
    </button>
  );
}
