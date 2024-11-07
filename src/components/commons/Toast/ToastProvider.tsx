import Toast from "@/components/commons/Toast";
import { toastAtom } from "@/store/toastAtom";
import { useAtomValue } from "jotai";
import { createPortal } from "react-dom";

function ToastProvider() {
  const toast = useAtomValue(toastAtom);

  return createPortal(
    <div className="pointer-events-none fixed bottom-128 left-[50vw] z-[100] -translate-x-1/2 md:top-24">
      {toast && <Toast {...toast} />}
    </div>,
    document.body,
  );
}

export default ToastProvider;
