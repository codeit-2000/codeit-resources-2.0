import Button from "@/components/commons/Button";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Error() {
  const router = useRouter();

  const refreshPage = () => {
    router.push(router.asPath);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <h1 className="text-18">Oops! 에러가 발생했습니다.</h1>

      <div className="mt-40 flex gap-12">
        <Link href="/">
          <Button variant="secondary" width="w-200">
            대시보드로 가기
          </Button>
        </Link>
        <Button width="w-200" onClick={refreshPage}>
          새로고침 하기
        </Button>
      </div>
    </div>
  );
}
