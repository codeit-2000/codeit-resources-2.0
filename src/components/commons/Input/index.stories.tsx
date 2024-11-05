import type { Meta, StoryObj } from "@storybook/react";

import Input from ".";

const meta = {
  title: "Web Components/Input",
  component: Input,
  tags: ["autodocs"],
} as Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: "username",
    label: "이름",
    errorMessage: "",
    type: "text",
  },
};

export const Error: Story = {
  args: {
    id: "email",
    label: "이메일",
    errorMessage: "이메일을 입력해주세요",
    type: "email",
  },
};

export const Password: Story = {
  args: {
    id: "password",
    label: "비밀번호",
    type: "password",
  },
};
