import OrderIcon from "@public/icons/icon-order.svg";
import { ORDER_OPTIONS } from "@/constants/dropdownConstants";

// 멤버 정렬 드랍다운 토글
export default function OrderToggle({
  isOpen,
  toggleDropdown,
  renderText,
}: {
  isOpen: boolean;
  toggleDropdown: () => void;
  renderText: string;
}) {
  return (
    <button
      type="button"
      onClick={toggleDropdown}
      className={`flex items-center justify-center text-nowrap rounded-8 bg-gray-15 px-6 py-4 hover:bg-gray-30 ${isOpen && "bg-gray-15"}`}
    >
      <OrderIcon />
      <span className="ml-3 mt-1 text-12-500 text-gray-100-opacity-60">
        {ORDER_OPTIONS[renderText as keyof typeof ORDER_OPTIONS] || renderText}
      </span>
    </button>
  );
}
