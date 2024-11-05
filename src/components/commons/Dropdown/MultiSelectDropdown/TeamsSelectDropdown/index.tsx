import ArrowDown from "@public/icons/icon-arrow-down.svg";
import CheckedBox from "@public/icons/icon-checkbox-active.svg";
import UnCheckedBox from "@public/icons/icon-checkbox.svg";
import Badge from "@/components/commons/Badge";
import useDropdown from "@/hooks/useDropdown";
import clsx from "clsx";
import React, { createContext, useContext, useMemo } from "react";
import {
  Team,
  TeamsSelectDropdownContextType,
  TeamsSelectDropdownProps,
} from "../../dropdownType";

const TeamsSelectDropdownContext =
  createContext<TeamsSelectDropdownContextType | null>(null);

const useTeamsSelectDropdownContext = () => {
  const context = useContext(TeamsSelectDropdownContext);
  if (!context) {
    throw new Error(
      "useMultiSelectDropdownContext must be used within a Provider",
    );
  }

  return context;
};

export default function TeamsSelectDropdown({
  selectedTeams,
  onSelect,
  onRemove,
  departmentList,
}: TeamsSelectDropdownProps) {
  const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();

  const contextProviderValue = useMemo(
    () => ({
      isOpen,
      selectedTeams,
      toggleDropdown,
      closeDropdown,
      onSelect,
      onRemove,
    }),
    [isOpen, selectedTeams],
  );

  return (
    <TeamsSelectDropdownContext.Provider value={contextProviderValue}>
      <div ref={dropdownRef} className="relative">
        <Toggle />
        <Wrapper>
          {departmentList.map((department) => (
            <TeamItem key={department.id} team={department} />
          ))}
        </Wrapper>
      </div>
    </TeamsSelectDropdownContext.Provider>
  );
}

function Toggle() {
  const { isOpen, toggleDropdown, selectedTeams } =
    useTeamsSelectDropdownContext();

  return (
    <button
      type="button"
      onClick={toggleDropdown}
      className="group relative flex h-56 w-full items-center justify-between rounded-8 border border-gray-100-opacity-20 px-20 py-14 text-left text-16 hover:border-purple-70"
    >
      <span className="absolute left-15 top-[-9px] bg-white px-4 text-13 text-gray-100-opacity-80 group-hover:text-purple-70">
        팀
      </span>
      <span
        className={clsx("min-w-0 flex-grow text-16-400", {
          "text-gray-100-opacity-80 group-hover:text-gray-100": !isOpen,
          "text-gray-100": isOpen,
        })}
      >
        <div className="flex max-h-40 max-w-full gap-2 overflow-x-auto">
          {selectedTeams.length > 0 ? (
            selectedTeams.map((value) => (
              <Badge key={value.id} variant="secondarySmall">
                {value.name}
              </Badge>
            ))
          ) : (
            <span className="text-gray-100-opacity-50">
              팀을 선택해 주세요.
            </span>
          )}
        </div>
      </span>
      <ArrowDown
        className={clsx("ml-8 w-12 flex-shrink-0", {
          "rotate-180": isOpen,
        })}
      />
    </button>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useTeamsSelectDropdownContext();

  return isOpen ? (
    <div className="absolute z-50 mt-3 flex max-h-168 w-full flex-col gap-3 overflow-y-auto rounded-8 border border-gray-20 bg-gray-5 p-8 shadow-dropdown-wrapper">
      {children}
    </div>
  ) : null;
}

function TeamItem({ team }: { team: Team }) {
  const { onSelect, onRemove, selectedTeams } = useTeamsSelectDropdownContext();

  const isSelected = selectedTeams.includes(team);

  const handleClick = () => {
    if (isSelected) {
      onRemove(team); // 선택 해제
    } else {
      onSelect(team); // 선택
    }
  };

  return (
    <button
      type="button"
      className={clsx("flex items-center rounded-8 px-12 py-6 text-15-500", {
        "bg-purple-opacity-10 text-purple-80": isSelected,
        "text-gray-100-opacity-80 hover:bg-purple-opacity-5 hover:text-purple-80":
          !isSelected,
      })}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
    >
      {isSelected ? (
        <CheckedBox className="mr-5" />
      ) : (
        <UnCheckedBox className="mr-5" />
      )}
      {team.name}
    </button>
  );
}
