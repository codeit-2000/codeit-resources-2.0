// import Badge from "@src/components/commons/Badge";
import { StoryObj } from "@storybook/react";
import clsx from "clsx";

import Tab from ".";

const meta = {
  title: "Web Components/Tab",
  component: Tab,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const DATE_DATA = [
  { id: 0, day: "1일", weekday: "월" },
  { id: 1, day: "2일", weekday: "화" },
  { id: 2, day: "3일", weekday: "수" },
  { id: 3, day: "4일", weekday: "목" },
  { id: 4, day: "5일", weekday: "금" },
  { id: 5, day: "6일", weekday: "토" },
  { id: 6, day: "7일", weekday: "일" },
  { id: 7, day: "8일", weekday: "월" },
  { id: 8, day: "9일", weekday: "화" },
  { id: 9, day: "10일", weekday: "수" },
  { id: 10, day: "11일", weekday: "목" },
  { id: 11, day: "12일", weekday: "금" },
  { id: 12, day: "13일", weekday: "토" },
  { id: 13, day: "14일", weekday: "일" },
  { id: 14, day: "15일", weekday: "월" },
  { id: 15, day: "16일", weekday: "화" },
  { id: 16, day: "17일", weekday: "수" },
  { id: 17, day: "18일", weekday: "목" },
  { id: 18, day: "19일", weekday: "금" },
  { id: 19, day: "20일", weekday: "토" },
  { id: 20, day: "21일", weekday: "일" },
  { id: 21, day: "22일", weekday: "월" },
  { id: 22, day: "23일", weekday: "화" },
  { id: 23, day: "24일", weekday: "수" },
  { id: 24, day: "25일", weekday: "목" },
  { id: 25, day: "26일", weekday: "금" },
  { id: 26, day: "27일", weekday: "토" },
  { id: 27, day: "28일", weekday: "일" },
  { id: 28, day: "29일", weekday: "월" },
  { id: 29, day: "30일", weekday: "화" },
  { id: 30, day: "31일", weekday: "수" },
];

export const DateTab: Story = {
  args: {
    defaultIndex: DATE_DATA[0].id,
    className: "border-gray-40 gap-24 border-b",
    children: ({ activeIndex, handleClick }) =>
      DATE_DATA.map(({ id, day, weekday }) => (
        <div key={id}>
          {/* {id === 0 && <Badge variant="primary">오늘</Badge>} */}
          <button
            type="button"
            className={clsx("block", {
              "border-b-2 border-violet-800 pb-6 font-semibold text-violet-800":
                id === activeIndex,
              "pb-8": id !== activeIndex,
            })}
            onClick={() => handleClick(id)}
          >
            {day}({weekday})
          </button>
        </div>
      )),
  },
  render: (args) => <Tab {...args} />,
};

const TAB_DATA = [
  { id: 0, label: "전체" },
  { id: 1, label: "멤버" },
  { id: 2, label: "어드민" },
  { id: 3, label: "Management" },
  { id: 4, label: "Finance" },
  { id: 5, label: "Strategy" },
  { id: 6, label: "Brand Experience" },
  { id: 7, label: "People & Culture" },
  { id: 8, label: "Sales & Operations" },
  { id: 9, label: "Brand Experience" },
  { id: 10, label: "People & Culture" },
  { id: 11, label: "Sales & Operations" },
];

export const TeamTab: Story = {
  args: {
    defaultIndex: TAB_DATA[0].id,
    className: "border-gray-40 gap-24 border-b",
    children: ({ activeIndex, handleClick }) =>
      TAB_DATA.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          className={clsx("text-gray-70", {
            "border-b-2 border-gray-80 pb-6 font-semibold text-gray-80":
              id === activeIndex,
            "pb-8": id !== activeIndex,
          })}
          onClick={() => handleClick(id)}
        >
          {label}
        </button>
      )),
  },
  render: (args) => (
    <div className="relative">
      <Tab {...args} />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-50 bg-gradient-to-l from-white to-transparent" />
    </div>
  ),
};
