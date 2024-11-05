import type { Meta, StoryObj } from "@storybook/react";

import Button from ".";

const meta = {
  title: "Web Components/Button",
  component: Button,
  tags: ["autodocs"],
} as Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// Primary Button
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary", // primary variant 사용
    disabled: false, // 기본적으로 활성화 상태
    width: "w-200", // 너비 200px로 설정
    height: "h-50", // 높이 50px로 설정
  },
};

// Modal Primary Button
export const ModalPrimary: Story = {
  args: {
    children: "이동하기",
    variant: "primary", // primary variant 사용
    disabled: false, // 기본적으로 활성화 상태
    width: "w-86", // 너비 86px 설정
    size: "modal", // 모달 내부의 버튼 패딩 및 폰트 사이즈
  },
};

// Secondary Button
export const Secondary: Story = {
  args: {
    children: "+ 멤버 추가",
    variant: "secondary", // secondary variant 사용
    disabled: false, // 기본적으로 활성화 상태
    width: "w-200", // 너비 200px로 설정
    height: "h-50", // 높이 50px로 설정
  },
};

// Small Secondary Button
export const SmallSecondary: Story = {
  args: {
    children: "사진 업로드",
    variant: "secondary", // secondary variant 사용
    disabled: false, // 기본적으로 활성화 상태
    width: "w-86", // 너비 86px 설정
    height: "h-32", // 높이 32px로 설정
    size: "small", // 특정 작은 버튼의 패딩 및 폰트 사이즈
  },
};

// Disabled Primary Button
export const DisabledPrimary: Story = {
  args: {
    children: "비활성화된 버튼",
    variant: "primary", // primary variant 사용
    disabled: true, // 비활성화 상태
    width: "w-200", // 너비 200px로 설정
    height: "h-50", // 높이 50px로 설정
  },
};

// Disabled Secondary Button
export const DisabledSecondary: Story = {
  args: {
    children: "비활성화된 버튼",
    variant: "secondary", // secondary variant 사용
    disabled: true, // 비활성화 상태
    width: "w-200", // 너비 200px로 설정
    height: "h-50", // 높이 50px로 설정
  },
};
