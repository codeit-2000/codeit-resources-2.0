import Toast from "@/components/commons/Toast";
import { toastAtom } from "@/store/toastAtom";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function ToastProvider() {
  const toast = useAtomValue(toastAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 서버 사이드 렌더링 시 또는 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-128 left-[50vw] z-[100] -translate-x-1/2 md:top-24">
      {toast && <Toast {...toast} />}
    </div>,
    document.body,
  );
}

export default ToastProvider;
