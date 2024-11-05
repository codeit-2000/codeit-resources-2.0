import Button from "@/components/commons/Button";
import useModal from "@/hooks/useModal";
import type { Meta, StoryObj } from "@storybook/react";

import Modal from ".";

const meta = {
  title: "Web Components/Modal",
  components: Modal,
  tags: ["autodocs"],
} as Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MoveSeatConfirmModal: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { openModal } = useModal();

    return (
      <div>
        <Button
          width="w-200"
          onClick={() => {
            openModal("moveSeatConfirm", {
              onConfirm: () => {},
            });
          }}
        >
          모달 열기
        </Button>
        <Modal />
      </div>
    );
  },
};
