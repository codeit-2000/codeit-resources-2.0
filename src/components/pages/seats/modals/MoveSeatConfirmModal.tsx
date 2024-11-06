import Button from "@/components/commons/Button";
import useModal from "@/hooks/useModal";
import IconAlert from "@public/icons/icon-modal-alert.svg";

interface MoveSeatConfirmModalProps {
  onConfirm: () => void;
}

function MoveSeatConfirmModal({ onConfirm }: MoveSeatConfirmModalProps) {
  const { closeModal } = useModal();

  return (
    <div className="flex h-213 w-370 cursor-default flex-col items-center justify-between rounded-16 bg-white px-32 py-24">
      <IconAlert />
      <p className="text-17-500 text-gray-100">자리를 예약하시겠어요?</p>
      <p className="text-15-400 text-gray-100-opacity-80">
        기존의 자리는 취소되며, 선택한 자리가 예약됩니다.
      </p>
      <div className="flex gap-20">
        <Button
          onClick={closeModal}
          variant="secondary"
          size="modal"
          width="w-86"
          height="h-40"
        >
          취소하기
        </Button>
        <Button onClick={onConfirm} size="modal" width="w-86" height="h-40">
          예약하기
        </Button>
      </div>
    </div>
  );
}

export default MoveSeatConfirmModal;
