import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import useToast from "@/hooks/useToast";
import { emailSchema } from "@/lib/zod-schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { resetPassword } from "aws-amplify/auth";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import StepTwo from "./StepTwo";

type EmailFormData = {
  email: string;
};

function FindPasswordForm() {
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(
      z.object({
        email: emailSchema,
      }),
    ),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    setIsPending(true);
    try {
      await resetPassword({ username: data.email });
      setEmail(data.email);
      success("인증코드가 발송되었습니다");
      setStep(2);
    } catch (err) {
      error("인증코드 발송이 실패하였습니다.");
    } finally {
      setIsPending(false);
    }
  };

  if (step === 1) {
    return (
      <>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-372 flex-col gap-16"
        >
          <Input
            type="email"
            id="email"
            label="회사 메일"
            register={register("email")}
            errorMessage={errors.email?.message}
          />
          <Button type="submit" height="h-46" disabled={!isValid || isPending}>
            {isPending ? (
              <LoadingSpinner height={27} width="100%" />
            ) : (
              "인증코드 보내기"
            )}
          </Button>
        </form>
        <Link
          href="/sign-in"
          className="cursor-pointer text-14-400 text-gray-80 hover:text-gray-100"
        >
          로그인 하러가기
        </Link>
      </>
    );
  }

  if (step === 2) {
    return <StepTwo email={email} setStep={setStep} />;
  }
}

export default FindPasswordForm;
