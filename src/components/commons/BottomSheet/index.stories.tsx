import BottomSheet from "@/components/commons/BottomSheet";
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

const meta = {
  title: "Components/Common/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile",
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
      },
    },
    docs: {
      description: {
        component:
          "하단에서 올라오는 바텀시트 컴포넌트입니다. 드래그로 반만 열리거나 전체 화면으로 조절할 수 있습니다.",
      },
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

interface BottomSheetStoryProps {
  children: ReactNode;
}

function BottomSheetStory({ children }: BottomSheetStoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-500 px-16 py-8 text-white"
      >
        바텀시트 열기
      </button>
      <AnimatePresence>
        {isOpen && (
          <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {children}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DefaultBottomSheet: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: "바텀시트에 들어갈 요소들 children",
  },
  render: (args) => (
    <BottomSheetStory>
      <div className="flex-1 p-16">
        <p>{args.children}</p>
      </div>
    </BottomSheetStory>
  ),
};
