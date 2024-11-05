import isMobileAtom from "@/store/mobileAtom";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export default function MobileSizeWatcher() {
  const setIsMobile = useSetAtom(isMobileAtom);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // 초기 렌더링 시 확인
    setIsMobile(mediaQuery.matches);

    // 미디어 쿼리 변경 시 이벤트 등록
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [setIsMobile]);

  return null;
}
