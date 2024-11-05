import CheckIcon from "@/../public/icons/icon-check.svg";
import { ORDER_OPTIONS, ROLE_OPTIONS } from "@/constants/dropdownConstants";
import useDropdown from "@/hooks/useDropdown";
import clsx from "clsx";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import MeetingRoomToggle from "./Toggle/MeetingRoomToggle";
import OrderToggle from "./Toggle/OrderToggle";
import RoleToggle from "./Toggle/RoleToggle";
import TimeToggle from "./Toggle/TimeToggle";
import { DropdownProps } from "./dropdownType";

interface DropdownContextType {
  // 드랍다운의 open 여부를 나타내는 Boolean 상태
  isOpen: boolean;
  // 현재 값
  value: string;
  // 현재 선택된 label
  selectedLabel: string;
  // 드랍다운을 열고 닫는 토글 함수
  toggleDropdown: () => void;
  // 드랍다운을 닫는 함수
  closeDropdown: () => void;
  // 값을 변경하는 함수
  handleChange: (value: string, label?: string) => void;
  // 드랍다운의 종류를 나타내는 값 (role: 권한, order: 정렬, meetingRoom: 회의실 선택)
  variant: "role" | "order" | "meetingRoom" | "startTime" | "endTime";
  // 시간 입력 시 input으로 입력 받을 지를 나타내는 값
  isInput: boolean;
  // 시간 입력 시 input으로 입력 받을 지를 나타내는 값을 변경하는 함수
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  // 아이템 선택 시 Wrapper 내부 스크롤 이동을 위한 Ref
  selectedItemRef: React.RefObject<HTMLButtonElement>;
}

// 드롭다운 하위 컴포넌트들이 데이터를 전달 받기 위한 Context
const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "useDropdownContext must be used within a DropdownProvider",
    );
  }
  return context;
};

// 드랍다운 최상위 컴포넌트
export default function Dropdown({
  children,
  value,
  onChange,
  variant,
}: DropdownProps) {
  const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();
  const [isInput, setIsInput] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const handleChange = useCallback(
    (newValue: string, label?: string) => {
      onChange(newValue);
      if (label) setSelectedLabel(label); // label 저장
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  const contextProviderValue = useMemo(
    () => ({
      isOpen,
      value,
      selectedLabel,
      toggleDropdown,
      closeDropdown,
      handleChange,
      variant,
      isInput,
      setIsInput,
      selectedItemRef,
    }),
    [isOpen, value, variant, isInput],
  );

  return (
    // 하위 컴포넌트들이 데이터를 공급받기 위해 Provider로 감싸기
    <DropdownContext.Provider value={contextProviderValue}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// 드랍다운을 Open하는 Toggle
function Toggle({
  isError = false,
  errorMessage = "",
}: {
  isError?: boolean;
  errorMessage?: string;
}) {
  const {
    isOpen,
    toggleDropdown,
    value,
    handleChange,
    selectedLabel,
    variant,
    isInput,
  } = useDropdownContext();

  const renderText = () => {
    if (selectedLabel) {
      return selectedLabel; // selectedLabel이 있으면 우선 표시
    }

    if (variant === "role") {
      return ROLE_OPTIONS[value as keyof typeof ROLE_OPTIONS] || value;
    }

    if (variant === "order") {
      return ORDER_OPTIONS[value as keyof typeof ORDER_OPTIONS] || value;
    }

    return value;
  };

  // variant에 따른 Toggle 렌더링
  const renderButtonContent = () => {
    switch (variant) {
      case "role":
        return (
          <RoleToggle
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            renderText={renderText}
          />
        );
      case "order":
        return (
          <OrderToggle
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            renderText={value}
          />
        );
      case "meetingRoom":
        return (
          <MeetingRoomToggle
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            renderText={renderText}
          />
        );
      case "startTime":
        return (
          <TimeToggle
            label="시작 시간"
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            value={value}
            handleChange={handleChange}
            isInput={isInput}
            isError={isError}
            errorMessage={errorMessage}
          />
        );
      case "endTime":
        return (
          <TimeToggle
            label="종료 시간"
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            value={value}
            handleChange={handleChange}
            isInput={isInput}
            isError={isError}
            errorMessage={errorMessage}
          />
        );
      default:
        return null;
    }
  };

  return renderButtonContent();
}

// 드랍다운 Item들을 감싸는 Wrapper
function Wrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, variant, selectedItemRef } = useDropdownContext();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 드롭다운이 열릴 때 선택된 아이템으로 스크롤
  useEffect(() => {
    if (isOpen && selectedItemRef.current && wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const selectedItemRect = selectedItemRef.current.getBoundingClientRect();

      // 선택된 아이템이 wrapper의 뷰포트 밖에 있는 경우에만 스크롤
      if (
        selectedItemRect.top < wrapperRect.top ||
        selectedItemRect.bottom > wrapperRect.bottom
      ) {
        selectedItemRef.current.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      ref={wrapperRef}
      className={clsx(
        "absolute z-50 mt-3 flex max-h-168 flex-col gap-3 overflow-y-auto rounded-8 border border-gray-20 bg-gray-5 p-8 shadow-dropdown-wrapper",
        {
          "right-0 w-96": variant === "order",
          "w-full": variant !== "order",
        },
      )}
    >
      {children}
    </div>
  ) : null;
}

// 클릭 시 value가 변경되는 드랍다운 Item
function Item({ itemValue, label }: { itemValue: string; label?: string }) {
  const { handleChange, value, variant, setIsInput, selectedItemRef } =
    useDropdownContext();

  const isSelected = value === label || value === itemValue;

  const handleClick = () => {
    handleChange(itemValue, label); // label도 전달
    setIsInput(false);
  };

  return (
    <button
      ref={isSelected ? selectedItemRef : null}
      type="button"
      className={clsx("rounded-8 px-12 py-6 text-center text-15-500", {
        "bg-purple-opacity-10 text-purple-80": isSelected,
        "text-gray-100-opacity-80 hover:bg-purple-opacity-5 hover:text-purple-80":
          !isSelected,
        "flex items-center justify-between":
          variant === "meetingRoom" ||
          variant === "startTime" ||
          variant === "endTime",
      })}
      onClick={handleClick}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && handleChange(itemValue)
      }
    >
      {label || itemValue}
      {isSelected &&
      (variant === "meetingRoom" ||
        variant === "startTime" ||
        variant === "endTime") ? (
        <CheckIcon className="mb-2" />
      ) : null}
    </button>
  );
}

// 직접 입력 아이템: 클릭 시 토글이 input으로 바뀜
function ManualItem({ children }: { children: React.ReactNode }) {
  const { setIsInput, handleChange, value, isInput } = useDropdownContext();

  const handleClick = () => {
    handleChange("");
    setIsInput(true); // 직접 입력을 클릭하면 입력 모드로 전환
  };

  const isSelected = isInput && value === ""; // isInput이 true이고 value가 비어 있을 때 선택된 상태로 간주

  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-between rounded-8 px-12 py-6 text-left text-15-500 text-gray-100-opacity-80",
        {
          "bg-purple-opacity-10 text-purple-80": isSelected,
          "hover:bg-purple-opacity-5 hover:text-purple-80": !isSelected,
        },
      )}
      onClick={handleClick}
      tabIndex={0}
    >
      {children}
      {isSelected && <CheckIcon className="mb-2" />}
    </button>
  );
}

Dropdown.Toggle = Toggle;
Dropdown.Wrapper = Wrapper;
Dropdown.Item = Item;
Dropdown.ManualItem = ManualItem;
