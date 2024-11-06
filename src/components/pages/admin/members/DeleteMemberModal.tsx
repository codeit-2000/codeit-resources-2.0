import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { User } from "@/lib/api/amplify/helper";
import { deleteUserData } from "@/lib/api/amplify/user";
import { removeUserFromCognito } from "@/lib/utils/autoAuthUser";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import IconAlert from "@public/icons/icon-modal-alert.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DeleteMemberModalProps {
  userData: User;
  setOpenKey: (value: null | string) => void;
}

function DeleteMemberModal({ userData, setOpenKey }: DeleteMemberModalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteUserData(userData.id),
    onSuccess: () => {
      success(`${userData.username} 님이 삭제되었습니다.`);
      queryClient.invalidateQueries({
        queryKey: ["memberList"],
      });
      setOpenKey(null);
    },
    onError: () => {
      error("멤버를 삭제하는데 실패하였습니다.");
    },
  });

  const handleDeleteModal = async () => {
    setIsLoading(true);
    try {
      await removeUserFromCognito(userData.email);
      mutate();
    } catch (err) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error(`${userData.username} 님을 삭제하지 못했습니다.`);
      }
    } finally {
      closeModal();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-300 w-380 flex-col items-center justify-between rounded-16 bg-white px-32 py-24">
      <IconAlert />
      <p className="text-17-500 text-gray-100">
        &apos;<span className="text-purple-50">{userData.username}</span>&apos;
        님을 탈퇴시킬까요?
      </p>
      <p className="text-center text-15-400 text-gray-100-opacity-80">
        탈퇴 시, 해당 멤버는 더 이상 목록에서 보이지 않으며, <br />
        해당 계정으로 로그인이 불가합니다.
      </p>
      <div className="my-14 w-full">
        <Input
          id="name"
          label="탈퇴할 멤버 이름을 입력해주세요"
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
          disabled={input !== userData.username || isLoading}
        >
          {isLoading ? <LoadingSpinner height={27} width="100%" /> : "탈퇴하기"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteMemberModal;
