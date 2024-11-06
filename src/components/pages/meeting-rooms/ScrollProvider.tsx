import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import {
  containerRefAtom,
  mobileContainerRefAtom,
  targetRefAtom,
} from "./context/scroll";

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

  return <div>{children}</div>;
}

export default ScrollProvider;
