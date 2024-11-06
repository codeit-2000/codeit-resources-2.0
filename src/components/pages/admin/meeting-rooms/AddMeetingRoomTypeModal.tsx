import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import { useGetReservations } from "@/components/pages/meeting-rooms/hooks/useGetReservations";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { createResource } from "@/lib/api/amplify/resource";
import { meetingRoomZodSchema } from "@/lib/zod-schema/meetingRooms";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

type AddMeetingRoomType = {
  resourceSubtype: string;
  name: string;
};

export default function AddMeetingRoomTypeModal() {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const { rooms } = useGetReservations();

  // 이미 존재하는 회의실 이름 목록을 추출
  const existingRoomNames = rooms?.data?.map((room) => room.name) || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<AddMeetingRoomType>({
    resolver: zodResolver(meetingRoomZodSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // 입력된 회의실 이름을 감지
  const watchName = useWatch({ control, name: "name" });

  // 중복 이름 여부에 따라 버튼 비활성화
  const isDuplicateName = existingRoomNames.includes(watchName || "");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddMeetingRoomType) =>
      createResource({
        resourceType: "ROOM",
        resourceSubtype: data.resourceSubtype,
        name: data.name,
      }),
    onSuccess: (res) => {
      if (res.data) {
        success(`${res.data.name} 회의실이 추가되었습니다.`);
      } else {
        error("회의실을 추가하는데 실패하였습니다.");
      }
      queryClient.invalidateQueries({ queryKey: ["roomList"] });
      closeModal();
    },
    onError: (err) => {
      error(err.message || "회의실을 추가하는데 실패하였습니다.");
    },
  });

  const onSubmit: SubmitHandler<AddMeetingRoomType> = async (data) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-370 flex-col items-center justify-between rounded-16 bg-white px-32 py-24"
    >
      <h2 className="text-17-500 text-gray-100">회의실 추가</h2>
      <p className="text-15-400 text-gray-100-opacity-80">
        추가할 회의실 분류와 이름을 입력해주세요.
      </p>
      <div className="my-20 flex w-full flex-col gap-8">
        <Input
          register={register("resourceSubtype")}
          label="회의실 분류"
          id="resourceSubtype"
          errorMessage={errors.resourceSubtype?.message}
        />
        <Input
          register={register("name")}
          label="회의실 이름"
          id="name"
          errorMessage={
            isDuplicateName ? "이미 존재하는 이름입니다." : errors.name?.message
          }
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
          disabled={!isValid || isPending || isDuplicateName} // 중복 이름이거나 입력 유효성 검사 실패 시 비활성화
        >
          {isPending ? <LoadingSpinner height={27} width="100%" /> : "추가하기"}
        </Button>
      </div>
    </form>
  );
}
