import { ToastProps, deleteToastAtom } from "@/store/toastAtom";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { PiExclamationMark } from "react-icons/pi";
import CheckIcon from "@/../public/icons/icon-check-bold.svg";

const DURATION_TIME = 2000;

function Toast({ id, type, message = "테스트 메시지 확인!" }: ToastProps) {
  const deleteToast = useSetAtom(deleteToastAtom);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);

    const fadeOutTimeout = setTimeout(() => {
      setIsVisible(false);

      const deleteTimeout = setTimeout(() => {
        deleteToast();
      }, 300);

      return () => clearTimeout(deleteTimeout);
    }, DURATION_TIME);

    return () => clearTimeout(fadeOutTimeout);
  }, [id, deleteToast]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`flex w-max items-center gap-8 rounded-16 py-8 pl-16 pr-20 shadow-[0_4px_24px_0_rgba(0,0,0,0.2)] ${
          type === "success" ? "bg-green-80" : "bg-red-500"
        }`}
      >
        {type === "success" ? (
          <CheckIcon width={20} height={20} color="white" />
        ) : (
          <PiExclamationMark width={20} height={20} color="white" />
        )}

        <span className="text-17-500 text-white">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
