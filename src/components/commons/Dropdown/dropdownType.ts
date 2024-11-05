import { type Schema } from "../../../../amplify/data/resource";

export type Team = Schema["Team"]["type"];

export interface Member {
  /** 멤버의 고유 ID */
  id: string;
  /** 멤버의 이름 */
  name: string;
  /** 멤버가 속한 부서들의 목록 */
  departments: string[];
  /** 멤버의 프로필 이미지 (없을 경우 null) */
  profileImage: string | null;
}

export interface DropdownContextType {
  /** 드랍다운이 열려 있는지 여부 */
  isOpen: boolean;
  /** 현재 선택된 값 */
  value: string;
  /** 드랍다운을 열고 닫는 토글 함수 */
  toggleDropdown: () => void;
  /** 드랍다운을 닫는 함수 */
  closeDropdown: () => void;
  /** 선택된 값을 변경하는 함수 */
  handleChange: (value: string) => void;
  /** 드랍다운의 종류 ("role", "order", "meetingRoom", "startTime", "endTime" 중 하나) */
  variant: "role" | "order" | "meetingRoom" | "startTime" | "endTime";
  /** 시간 입력 시 input을 사용할지 여부 */
  isInput: boolean;
  /** 시간 입력 시 input 사용 여부를 변경하는 함수 */
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownProps {
  /** Dropdown 안에 들어가는 자식 컴포넌트들 */
  children: React.ReactNode;
  /** 현재 선택된 값 */
  value: string;
  /** 값이 변경될 때 호출되는 함수 */
  onChange: (value: string) => void;
  /** Dropdown의 타입 ("role", "order", "meetingRoom", "startTime", "endTime" 중 하나) */
  variant: "role" | "order" | "meetingRoom" | "startTime" | "endTime";
}

export interface TeamsSelectDropdownContextType {
  /** 드랍다운이 열려 있는지 여부 */
  isOpen: boolean;
  /** 선택된 팀들의 목록 */
  selectedTeams: Team[];
  /** 드랍다운을 열고 닫는 토글 함수 */
  toggleDropdown: () => void;
  /** 드랍다운을 닫는 함수 */
  closeDropdown: () => void;
  /** 팀을 선택하는 함수 */
  onSelect: (value: Team) => void;
  /** 선택된 팀을 제거하는 함수 */
  onRemove: (value: Team) => void;
}

export interface TeamsSelectDropdownProps {
  /** 선택된 팀들의 목록 */
  selectedTeams: Team[];
  /** 팀을 선택하는 함수 */
  onSelect: (value: Team) => void;
  /** 선택된 팀을 제거하는 함수 */
  onRemove: (value: Team) => void;
  /** 선택할 수 있는 부서 목록 */
  departmentList: Team[];
}

export interface MembersSelectDropdownContextType {
  /** 드랍다운이 열려 있는지 여부 */
  isOpen: boolean;
  /** 선택된 멤버들의 목록 */
  selectedMembers: Member[];
  /** 드랍다운을 열고 닫는 토글 함수 */
  toggleDropdown: () => void;
  /** 드랍다운을 닫는 함수 */
  closeDropdown: () => void;
  /** 멤버를 선택하는 함수 */
  onSelect: (value: Member) => void;
  /** 선택된 멤버를 제거하는 함수 */
  onRemove: (value: Member) => void;
}

export interface MembersSelectDropdownProps {
  /** 선택된 멤버들의 목록 */
  selectedMembers: Member[];
  /** 멤버를 선택하는 함수 */
  onSelect: (value: Member) => void;
  /** 선택된 멤버를 제거하는 함수 */
  onRemove: (value: Member) => void;
  /** 선택할 수 있는 모든 멤버 목록 */
  allMembers: Member[];
}

export interface MemberItemProps {
  /** 표시할 멤버 객체 */
  member: Member;
  /** 해당 멤버가 선택되었는지 여부 */
  isSelected: boolean;
  /** 멤버를 선택하는 함수 */
  onSelect: (member: Member) => void;
  /** 선택된 멤버를 제거하는 함수 */
  onRemove: (member: Member) => void;
}

export interface PopoverContextType {
  /** 팝오버가 열려 있는지 여부 */
  isOpen: boolean;
  /** 팝오버를 열고 닫는 토글 함수 */
  togglePopover: () => void;
  /** 팝오버를 닫는 함수 */
  closePopover: () => void;
}
