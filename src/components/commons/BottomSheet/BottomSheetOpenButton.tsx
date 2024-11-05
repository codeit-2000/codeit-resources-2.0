interface BottomSheetOpenButtonProps {
  handleBottomSheetOpen: () => void;
}

function BottomSheetOpenButton({
  handleBottomSheetOpen,
}: BottomSheetOpenButtonProps) {
  return (
    <button
      type="button"
      onClick={handleBottomSheetOpen}
      className="rounded bg-purple-500 p-2 text-white"
    >
      바텀시트 열기
    </button>
  );
}

export default BottomSheetOpenButton;
