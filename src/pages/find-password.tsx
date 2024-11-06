import FindPasswordForm from "@/components/pages/find-password/components/FindPasswordForm";
import { authAtom } from "@/store/authUserAtom";
import CodeitLogo from "@public/images/codeit.svg";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

function FindPasswordPage() {
  const isAuthenticated = useAtomValue(authAtom);

  const router = useRouter();

  useEffect(() => {
    // 인증된 경우 dashboard 페이지로 리다이렉트
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-24 px-8">
      <CodeitLogo width={78} height={78} aria-label="Codeit 로고" />
      <h1 className="mb-16 text-28-700">비밀번호 찾기</h1>
      <FindPasswordForm />
    </div>
  );
}

export default FindPasswordPage;
