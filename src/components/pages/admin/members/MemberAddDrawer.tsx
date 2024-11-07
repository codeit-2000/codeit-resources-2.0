import { ADD_MEMBER_ERROR_MESSAGE } from "@/constants/error-message/user";
import useToast from "@/hooks/useToast";
import { Team } from "@/lib/api/amplify/helper";
import { CreateUserParams, createUserData } from "@/lib/api/amplify/user";
import { autoAuthUser } from "@/lib/utils/autoAuthUser";
import { TeamInput, memberSchema } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthError } from "aws-amplify/auth";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import MemberForm from "./MemberForm";
import useUploadImage from "./hooks/useUploadImage";

interface MemberAddDrawerProps {
  setOpenKey: (value: string | null) => void;
  teamList: Team[];
}

function MemberAddDrawer({ setOpenKey, teamList }: MemberAddDrawerProps) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<TeamInput>({
    resolver: zodResolver(memberSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      role: "MEMBER",
      username: "",
      email: "",
      teams: [],
      image: null,
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: CreateUserParams) => createUserData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: () => {
      error("추가를 완료하지 못했습니다.");
    },
  });

  const { mutateAsync: uploadImage } = useUploadImage();

  const onSubmit: SubmitHandler<TeamInput> = async (data) => {
    const imageFile = methods.watch("image") as File;

    setIsLoading(true);
    const teams = selectedTeams.map((t) => t.id);

    try {
      const result = await autoAuthUser(data.role, data.email);

      if (result) {
        let profileImage;
        if (imageFile) {
          const imagePath = await uploadImage({
            userId: result,
            imageFile,
          });
          profileImage = imagePath;
        }
        mutate({ ...data, teams, id: result, profileImage });
        success(`${data.username} 님을 추가했습니다.`);
      } else {
        error(`${data.username} 님을 추가하지 못했습니다.`);
      }
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        const errorMessage =
          ADD_MEMBER_ERROR_MESSAGE[err.name] ||
          ADD_MEMBER_ERROR_MESSAGE.UnknownError;

        error(errorMessage);
      } else if (err instanceof Error) {
        error(err.message);
      } else {
        error(`${data.username} 님을 추가하지 못했습니다.`);
      }
    } finally {
      setOpenKey(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-32 flex w-full flex-col">
      <h2 className="text-24-700">멤버 추가</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <MemberForm
            teamList={teamList}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            isLoading={isLoading}
            mode="add"
          />
        </form>
      </FormProvider>
    </div>
  );
}

export default MemberAddDrawer;
