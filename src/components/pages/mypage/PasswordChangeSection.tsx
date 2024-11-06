import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import useToast from "@/hooks/useToast";
import { passwordChangeSchema } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "aws-amplify/auth";
import { SubmitHandler, useForm } from "react-hook-form";

type PasswordChangeInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordChangeSection() {
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function handleUpdatePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      await updatePassword({ oldPassword, newPassword });
    } catch (err) {
      error(`비밀번호 변경 중 오류: ${err}`);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleUpdatePassword,
    onSuccess: () => {
      success(
        "비밀번호가 성공적으로 변경되었습니다. 다음 로그인 시 새 비밀번호를 사용해주세요.",
      );
      reset();
    },
    onError: (mutateError) => {
      error(mutateError.message);
    },
  });

  const onSubmit: SubmitHandler<PasswordChangeInput> = (data) => {
    mutate({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <section>
      <h2 className="text-24-700 text-gray-100">비밀번호 변경</h2>
      <hr className="mt-10" />
      <div className="mt-20 max-w-372">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <Input
            register={register("currentPassword")}
            id="password"
            type="password"
            label="현재 비밀번호"
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck="false"
            autoCorrect="off"
            errorMessage={errors.currentPassword?.message}
          />
          <Input
            register={register("newPassword")}
            id="newPassword"
            type="password"
            label="새 비밀번호"
            autoComplete="new-password"
            autoCapitalize="none"
            spellCheck="false"
            autoCorrect="off"
            errorMessage={errors.newPassword?.message}
          />
          <Input
            register={register("confirmPassword")}
            id="newPasswordCheck"
            type="password"
            label="새 비밀번호 확인"
            autoComplete="new-password"
            autoCapitalize="none"
            spellCheck="false"
            autoCorrect="off"
            errorMessage={errors.confirmPassword?.message}
          />

          <div className="h-45 w-110">
            <Button
              type="submit"
              variant="secondary"
              disabled={!isValid || isPending}
            >
              {isPending ? <LoadingSpinner /> : "변경하기"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
