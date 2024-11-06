import Button from "@/components/commons/Button";
import useModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import { Team, User } from "@/lib/api/amplify/helper";
import { UpdateUserParams, updateUserData } from "@/lib/api/amplify/user";
import { editUserEmail, editUserGroup } from "@/lib/utils/autoAuthUser";
import { TeamInput, memberSchema } from "@/lib/zod-schema/user";
import { userAtom } from "@/store/authUserAtom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import MemberForm from "./MemberForm";
import useUploadImage from "./hooks/useUploadImage";

interface MemberEditDrawerProps {
  userData: User;
  setOpenKey: (value: string | null) => void;
  teamList: Team[];
}

function MemberEditDrawer({
  userData,
  setOpenKey,
  teamList,
}: MemberEditDrawerProps) {
  const { success, error } = useToast();
  const { openModal } = useModal();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>(
    userData.teams
      ? teamList.filter((team) => userData.teams!.includes(team.id))
      : [],
  );

  const methods = useForm<TeamInput>({
    resolver: zodResolver(memberSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      role: userData?.role ?? "MEMBER",
      username: userData?.username,
      email: userData?.email,
      teams: [],
      image: userData?.profileImage,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: UpdateUserParams) => updateUserData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: () => {
      error("수정을 완료하지 못했습니다.");
    },
  });

  const { mutateAsync: uploadImage } = useUploadImage();

  const onSubmit: SubmitHandler<TeamInput> = async (data) => {
    const imageFile = methods.watch("image");

    setIsLoading(true);
    const teams = selectedTeams.map((t) => t.id);

    try {
      if (data.email !== userData.email)
        await editUserEmail(userData.email, data.email);
      if (data.role !== userData.role)
        await editUserGroup(data.role, data.email);
      if (user) {
        let profileImage;
        if (userData.profileImage !== imageFile && imageFile instanceof File) {
          const imagePath = await uploadImage({
            userId: userData.id,
            imageFile,
          });
          profileImage = imagePath;
        }
        mutate({ ...data, teams, id: userData.id, profileImage });
        success(`${data.username} 님을 수정했습니다.`);
      } else {
        error(`${data.username} 님을 수정하지 못했습니다.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        error(err.message || `${data.username} 님을 수정하지 못했습니다.`);
      } else {
        error(`${data.username} 님을 수정하지 못했습니다.`);
      }
    } finally {
      setOpenKey(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-32 flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-24-700">멤버 수정</h2>
        <Button
          onClick={() => {
            openModal("deleteMemberModal", {
              userData,
              setOpenKey,
            });
          }}
          width="w-88"
          height="h-32"
          size="small"
          variant="secondary"
        >
          탈퇴하기
        </Button>
      </div>
      <FormProvider {...methods}>
        <form
          className="mt-32 flex flex-col gap-24"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <MemberForm
            teamList={teamList}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            isLoading={isLoading}
            mode="edit"
          />
        </form>
      </FormProvider>
    </div>
  );
}

export default MemberEditDrawer;
