import { updateToastAtom } from "@/store/toastAtom";
import { useSetAtom } from "jotai";

const useToast = () => {
  const submitToast = useSetAtom(updateToastAtom);

  return {
    success: (message: string) => submitToast({ type: "success", message }),
    error: (message: string) => submitToast({ type: "error", message }),
  };
};

export default useToast;
