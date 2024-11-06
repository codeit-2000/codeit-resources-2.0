import Button from "@/components/commons/Button";
import useToast from "@/hooks/useToast";
import { authAtom } from "@/store/authUserAtom";
import LoadingSpinner from "@public/gifs/loading-spinner.svg";
import { signOut } from "aws-amplify/auth";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AccountSection() {
  const { success, error } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const setIsAuthenticated = useSetAtom(authAtom);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await signOut();
      localStorage.clear();
      setIsAuthenticated(false);
      success("성공적으로 로그아웃되었습니다.");
      router.push("/sign-in");
    } catch (logoutError) {
      error(
        `로그아웃 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.: ${logoutError}`,
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section>
      <h2 className="text-24-700 text-gray-100">계정</h2>
      <hr className="mt-10" />
      <div className="mt-20 h-45 w-110">
        <Button variant="secondary" onClick={handleLogout}>
          {isPending ? <LoadingSpinner /> : "로그아웃"}
        </Button>
      </div>
    </section>
  );
}
