import { StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import ProfileImage from ".";

const queryClient = new QueryClient();

const meta = {
  title: "Web Components/ProfileImage",
  component: ProfileImage,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    imageUrl: {
      control: { type: "text" },
    },
  },
  decorators: [
    (Story: () => ReactNode) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Default profile image story
export const Default: Story = {
  args: {
    size: "md",
  },
};

// Small size story
export const SmallSize: Story = {
  args: {
    size: "sm",
  },
};

// Large size story
export const LargeSize: Story = {
  args: {
    size: "lg",
  },
};
