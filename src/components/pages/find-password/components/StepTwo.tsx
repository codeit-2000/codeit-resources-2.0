import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import { PASSWORD_ERROR_MESSAGE } from "@/constants/error-message/user";
import useToast from "@/hooks/useToast";
import { findPasswordSchema } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { AuthError, confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type PasswordFormData = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

interface StepTwoProps {
  email: string;
  setStep: (value: number) => void;
}

function StepTwo({ email, setStep }: StepTwoProps) {
  const { success, error } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(findPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmitPassword: SubmitHandler<PasswordFormData> = async (data) => {
    setIsLoading(true);
    try {
      await confirmResetPassword({
        confirmationCode: data.code,
        username: email,
        newPassword: data.newPassword,
      });
      success("비밀번호가 재설정 되었습니다");
      router.push("/sign-in");
    } catch (err) {
      if (err instanceof AuthError) {
        const errorMessage =
          PASSWORD_ERROR_MESSAGE[err.name] || "비밀번호 설정을 실패했습니다.";
        error(errorMessage);
      } else {
        error("비밀번호 설정을 실패하였습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitPassword)}
        className="flex w-full max-w-372 flex-col gap-16"
      >
        <Input
          type="text"
          id="code"
          label="인증코드"
          register={register("code")}
          errorMessage={errors.code?.message}
        />
        <Input
          type="password"
          id="newPassword"
          label="새로운 비밀번호"
          register={register("newPassword")}
          errorMessage={errors.newPassword?.message}
        />
        <Input
          type="password"
          id="confirmPassword"
          label="비밀번호 확인"
          register={register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />
        <Button type="submit" height="h-46" disabled={!isValid || isLoading}>
          {isLoading ? (
            <LoadingSpinner height={27} width="100%" />
          ) : (
            "비밀번호 재설정"
          )}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="cursor-pointer text-14-400 text-gray-80 hover:text-gray-100"
      >
        인증코드 재전송 하기
      </button>
    </>
  );
}

export default StepTwo;
