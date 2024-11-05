import Button from "@/components/commons/Button";
import Input from "@/components/commons/Input";
import { LOGIN_ERROR_MESSAGES } from "@/constants/error-message/user";
import useToast from "@/hooks/useToast";
import { setUserPassword } from "@/lib/utils/autoAuthUser";
import { loginSchema } from "@/lib/zod-schema/user";
import { authAtom } from "@/store/authUserAtom";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { AuthError, signIn } from "aws-amplify/auth";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type SignInInput = {
  email: string;
  password: string;
};

function SignInForm() {
  const router = useRouter();
  const { success, error } = useToast();

  const setIsAuthenticated = useSetAtom(authAtom);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn({
        username: data.email,
        password: data.password,
      });

      if (
        result.nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        await setUserPassword(data.email, data.password);
      }
      success("로그인 되었습니다.");
      setIsAuthenticated(true);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        const errorMessage =
          LOGIN_ERROR_MESSAGES[err.name] || LOGIN_ERROR_MESSAGES.UnknownError;

        error(errorMessage);

        if (err.name === "UserAlreadyAuthenticatedException") {
          router.push("/");
        }
      } else {
        error(LOGIN_ERROR_MESSAGES.UnknownError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-372 flex-col gap-24"
    >
      <fieldset className="flex flex-col gap-16">
        <legend className="sr-only">로그인 정보</legend>
        <Input
          register={register("email")}
          id="email"
          type="email"
          label="회사 메일"
          errorMessage={errors.email?.message}
        />
        <Input
          register={register("password")}
          id="password"
          type="password"
          label="비밀번호"
          errorMessage={errors.password?.message}
          autoComplete="current-password"
        />
      </fieldset>
      <Button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? <LoadingSpinner height={27} width="100%" /> : "로그인"}
      </Button>
    </form>
  );
}

export default SignInForm;
