import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { deleteTeamAndUpdateUsers } from "@/lib/api/amplify/team/utils";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import IconAlert from "@public/icons/icon-modal-alert.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DeleteTeamModalProps {
  teamId: string;
  teamName: string;
}

function DeleteTeamModal({ teamId, teamName }: DeleteTeamModalProps) {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTeamAndUpdateUsers(teamId),
    onSuccess: (res) => {
      if (res.data) {
        success(`${res.data.name} 팀이 삭제되었습니다.`);
      } else {
        error("팀을 삭제하는데 실패하였습니다.");
      }
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },
    onError: () => {
      error("팀을 삭제하는데 실패하였습니다.");
    },
    onSettled: () => {
      closeModal();
    },
  });

  const handleDeleteModal = () => {
    mutate();
  };

  return (
    <div className="flex h-300 w-370 flex-col items-center justify-between rounded-16 bg-white px-32 py-24">
      <IconAlert />
      <p className="text-17-500 text-gray-100">
        팀 &apos;
        <span className="text-purple-50">{teamName}</span>
        &apos; 를 삭제하시겠어요?
      </p>
      <p className="text-center text-15-400 text-gray-100-opacity-80">
        해당 팀에 대한 정보가 모두 사라집니다. <br /> 단, 해당 팀에 속한 멤버는
        삭제되지 않습니다.
      </p>
      <div className="my-14 w-full">
        <Input
          id="team"
          label="삭제할 팀 이름을 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
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
        <Button
          onClick={handleDeleteModal}
          size="modal"
          width="w-86"
          height="h-40"
          disabled={isPending || input !== teamName}
        >
          {isPending ? <LoadingSpinner height={27} width="100%" /> : "삭제하기"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteTeamModal;
