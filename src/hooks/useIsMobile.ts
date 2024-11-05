import isMobileAtom from "@/store/mobileAtom";
import { useAtomValue } from "jotai";

const useIsMobile = (): boolean => {
  const isMobile = useAtomValue(isMobileAtom);

  return isMobile;
};

export default useIsMobile;
