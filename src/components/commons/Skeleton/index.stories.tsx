import type { Meta, StoryObj } from "@storybook/react";

import Skeleton from ".";

const meta = {
  title: "Web Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} as Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

// Primary
export const Primary: Story = {
  args: {
    className: "w-150 h-70 rounded",
  },
};
