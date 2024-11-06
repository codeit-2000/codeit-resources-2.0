import Button from "@/components/commons/Button";
import useModal from "@/hooks/useModal";
import IconAlert from "@public/icons/icon-modal-alert.svg";

interface Props {
  onConfirm: () => void;
}

export default function DeleteResourceStatusModal({ onConfirm }: Props) {
  const { closeModal } = useModal();

  return (
    <div className="flex h-180 w-370 cursor-default flex-col items-center justify-between rounded-16 bg-white px-32 py-24">
      <IconAlert />
      <p className="text-17-500 text-gray-100">좌석 상태를 삭제하시겠습니까?</p>
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
          삭제하기
        </Button>
      </div>
    </div>
  );
}
