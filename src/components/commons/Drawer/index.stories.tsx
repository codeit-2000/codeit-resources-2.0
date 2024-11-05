// import Button from "@/components/commons/Button";
import Drawer from "@/components/commons/Drawer";
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

const meta = {
  title: "Components/Common/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "슬라이딩 효과가 있는 드로워 컴포넌트입니다. 오른쪽에서 왼쪽으로 열립니다.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

interface DrawerStoryProps {
  children: ReactNode;
}

function DrawerStory({ children }: DrawerStoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-500 px-16 py-8 text-white"
      >
        드로워 열기
      </button>
      <AnimatePresence>
        {isOpen && (
          <Drawer onClose={() => setIsOpen(false)}>
            {children}
            <div className="fixed bottom-40 w-[90%]">
              {/* <Button>버튼입니다</Button> */}
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DefaultDrawer: Story = {
  args: {
    onClose: () => {},
    children: null,
  },
  render: (args) => (
    <DrawerStory>
      <div className="items-start">
        <p className="mb-8">드로워에 들어갈 요소들</p>
      </div>
    </DrawerStory>
  ),
};
