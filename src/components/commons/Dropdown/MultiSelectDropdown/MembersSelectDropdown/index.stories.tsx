import MembersSelectDropdown from "@/components/commons/Dropdown/MultiSelectDropdown/MembersSelectDropdown";
import { Member } from "@/components/commons/Dropdown/dropdownType";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const meta: Meta<typeof MembersSelectDropdown> = {
  title: "Web Components/Dropdown/MembersSelectDropdown",
  component: MembersSelectDropdown,
  tags: ["autodocs"],
} as Meta<typeof MembersSelectDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const members: Member[] = [
  {
    id: "1",
    name: "김효준",
    departments: ["Product", "Content", "Marketing"],
    profileImage: null,
  },
  {
    id: "2",
    name: "손동욱",
    departments: ["Sales & Operations", "Product", "Finance"],
    profileImage: null,
  },
  {
    id: "3",
    name: "이민호",
    departments: ["Learner Experience", "Product", "Customer Support"],
    profileImage: null,
  },
  {
    id: "4",
    name: "박지성",
    departments: ["Content", "Learner Experience", "HR"],
    profileImage: null,
  },
  {
    id: "5",
    name: "전지현",
    departments: ["Sales & Operations", "Legal", "Finance"],
    profileImage: null,
  },
  {
    id: "6",
    name: "유재석",
    departments: ["Marketing", "HR", "Customer Support"],
    profileImage: null,
  },
  {
    id: "7",
    name: "강호동",
    departments: ["Finance", "Legal", "Sales & Operations"],
    profileImage: null,
  },
  {
    id: "8",
    name: "이광수",
    departments: ["Product", "Learner Experience", "Customer Support"],
    profileImage: null,
  },
];

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

    const handleSelect = (member: Member) => {
      setSelectedMembers((prev) => [...prev, member]);
    };

    const handleRemove = (member: Member) => {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
    };

    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        <div className="mt-50 w-340">
          <MembersSelectDropdown
            selectedMembers={selectedMembers}
            onSelect={handleSelect}
            onRemove={handleRemove}
            allMembers={members}
          />
        </div>
      </QueryClientProvider>
    );
  },
};
