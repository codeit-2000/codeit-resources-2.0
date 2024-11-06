import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { updateTeamName } from "@/lib/api/amplify/team";
import { teamZodSchema } from "@/lib/zod-schema/team";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

type EditTeamInput = {
  name: string;
};

interface UpdateTeamModalProps {
  teamId: string;
  teamName: string;
}

function UpdateTeamModal({ teamId, teamName }: UpdateTeamModalProps) {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditTeamInput>({
    resolver: zodResolver(teamZodSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: teamName,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: EditTeamInput) => updateTeamName(teamId, data.name),
  });

  const onSubmit: SubmitHandler<EditTeamInput> = async (data) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          success(`${res.data.name} 팀으로 변경되었습니다.`);
        } else {
          error("팀을 수정하는데 실패하였습니다.");
        }
        queryClient.invalidateQueries({ queryKey: ["teamList"] });
      },
      onError: (err) => {
        error(err.message || "팀을 수정하는데 실패하였습니다.");
      },
      onSettled: closeModal,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-370 flex-col items-center justify-between rounded-16 bg-white px-32 py-24"
    >
      <h2 className="text-17-500 text-gray-100">팀 변경</h2>
      <p className="text-15-400 text-gray-100-opacity-80">
        수정할 팀 이름을 입력해주세요.
      </p>
      <div className="my-20 flex w-full flex-col gap-8">
        <Input
          register={register("name")}
          label="팀 이름"
          id="teamName"
          errorMessage={errors.name?.message}
        />
      </div>
      <div className="flex justify-between gap-20">
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
          type="submit"
          size="modal"
          width="w-86"
          height="h-40"
          disabled={!isValid || isPending}
        >
          {isPending ? <LoadingSpinner height={27} width="100%" /> : "수정하기"}
        </Button>
      </div>
    </form>
  );
}

export default UpdateTeamModal;
