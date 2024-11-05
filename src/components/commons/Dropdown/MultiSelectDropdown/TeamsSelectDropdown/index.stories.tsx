import TeamsSelectDropdown from "@/components/commons/Dropdown/MultiSelectDropdown/TeamsSelectDropdown";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Team } from "../../dropdownType";

const meta: Meta<typeof TeamsSelectDropdown> = {
  title: "Web Components/Dropdown/TeamsSelectDropdown",
  component: TeamsSelectDropdown,
  tags: ["autodocs"],
} as Meta<typeof TeamsSelectDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const departments = [
  {
    id: "7db1e478-125d-4d01-b839-01d6ad20911a",
    name: "ETC",
    createdAt: "2024-10-24T07:10:53.525Z",
    updatedAt: "2024-10-24T07:10:53.525Z",
  },
  {
    id: "b2ea95f4-1a44-4310-b90b-ce58db59d5b2",
    name: "HR",
    createdAt: "2024-10-24T06:45:12.913Z",
    updatedAt: "2024-10-24T06:45:12.913Z",
  },
  {
    id: "c689bb70-b8cc-4222-b830-4d8c3d5c8022",
    name: "Sales &  Operations",
    createdAt: "2024-10-24T06:18:38.851Z",
    updatedAt: "2024-10-24T06:18:38.851Z",
  },
  {
    id: "4d679a6e-b5b7-4c04-8732-cce2d2972dc8",
    name: "Brand Experience",
    createdAt: "2024-10-24T05:50:26.863Z",
    updatedAt: "2024-10-24T05:50:26.863Z",
  },
  {
    id: "bdcc039d-494e-4395-be7d-0253516131cd",
    name: "Products",
    createdAt: "2024-10-24T05:47:06.763Z",
    updatedAt: "2024-10-24T05:47:10.293Z",
  },
  {
    id: "4d65ca9e-c73f-4426-8865-26ec68ed7d6d",
    name: "DevOps",
    createdAt: "2024-10-24T05:46:44.746Z",
    updatedAt: "2024-10-24T05:46:44.746Z",
  },
  {
    id: "6b3b257b-8d3f-4237-99d0-81eaec78d3a4",
    name: "Contents",
    createdAt: "2024-10-24T05:46:27.273Z",
    updatedAt: "2024-10-24T05:46:27.273Z",
  },
  {
    id: "cbd08b11-6caa-4a24-8a87-24319804ee4b",
    name: "Develop",
    createdAt: "2024-10-24T05:46:14.712Z",
    updatedAt: "2024-10-24T05:46:14.712Z",
  },
];

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

    const handleSelect = (team: Team) => {
      setSelectedTeams((prev) => [...prev, team]);
    };

    const handleRemove = (team: Team) => {
      setSelectedTeams((prev) => prev.filter((t) => t !== team));
    };
    return (
      <div className="w-340">
        <TeamsSelectDropdown
          selectedTeams={selectedTeams}
          onSelect={handleSelect}
          onRemove={handleRemove}
          departmentList={departments}
        />
      </div>
    );
  },
};
