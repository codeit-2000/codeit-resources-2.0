import {
  containerRefAtom,
  mobileContainerRefAtom,
  targetRefAtom,
} from "@/store/scrollAtom";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

function ScrollProvider({ children }: { children: React.ReactNode }) {
  const setContainerRef = useSetAtom(containerRefAtom);
  const setMobileContainerRef = useSetAtom(mobileContainerRefAtom);
  const setTargetRef = useSetAtom(targetRefAtom);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainerRef(containerRef);
    setMobileContainerRef(mobileContainerRef);
    setTargetRef(targetRef);
  }, [setContainerRef, setTargetRef]);

  return <>{children}</>;
}

export default ScrollProvider;
