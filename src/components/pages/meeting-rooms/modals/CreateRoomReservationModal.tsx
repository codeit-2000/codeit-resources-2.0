import IconAlert from "@repo/assets/icons/icon-modal-alert.svg?react";
import Button from "@src/components/commons/Button";
import useModal from "@src/hooks/useModal";

interface CreateRoomReservationModalProps {
  onConfirm: () => void;
}

function CreateRoomReservationModal({
  onConfirm,
}: CreateRoomReservationModalProps) {
  const { closeModal } = useModal();

  return (
    <div className="flex h-213 w-370 cursor-default flex-col items-center justify-between rounded-16 bg-white px-32 py-24">
      <IconAlert />
      <p className="text-17-500 text-gray-100">회의실을 예약하시겠어요?</p>
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

export default CreateRoomReservationModal;
