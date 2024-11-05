import { getCloseAnimation } from "@/components/commons/BottomSheet/animations";
import { AnimationControls, PanInfo, useAnimation } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useBottomSheet = ({ isOpen, onClose }: UseBottomSheetProps) => {
  const controls: AnimationControls = useAnimation();
  const [position, setPosition] = useState("closed");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const mediaQueryListener = useMemo(
    () => (e: MediaQueryListEvent) => {
      setPosition(e.matches ? "half" : "full");
    },
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setPosition(mediaQuery.matches ? "half" : "full");

    mediaQuery.addEventListener("change", mediaQueryListener);
    return () => mediaQuery.removeEventListener("change", mediaQueryListener);
  }, [mediaQueryListener]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      controls.start(position);
    } else {
      controls.start("closed");
    }
  }, [isOpen, position, controls]);

  const handleClose = useCallback(async () => {
    setIsClosing(true);
    await controls.start(getCloseAnimation());
    setPosition("closed");
    onClose();
  }, [controls, onClose]);

  const handleDragEnd = useCallback(
    async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      if (position === "full") {
        if (offset > threshold || velocity > 500) {
          await controls.start("half");
          setPosition("half");
        } else {
          controls.start("full");
        }
      } else if (position === "half") {
        if (offset < -threshold || velocity < -500) {
          await controls.start("full");
          setPosition("full");
        } else if (offset > threshold || velocity > 500) {
          setIsClosing(true);
          await controls.start("closed");
          setPosition("closed");
          onClose();
        } else {
          controls.start("half");
        }
      }
    },
    [position, controls, onClose],
  );

  const handleAnimationComplete = useCallback(() => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }, [isClosing, onClose]);

  return {
    controls,
    position,
    isClosing,
    handleClose,
    handleDragEnd,
    handleAnimationComplete,
  };
};
