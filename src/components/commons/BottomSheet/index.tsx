/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable react/prop-types */
import Scroll from "@/../public/icons/icon-drawer-bar.svg";
import { useBottomSheet } from "@/components/commons/BottomSheet/useBottomSheet";
import {
  AnimatePresence,
  AnimationControls,
  PanInfo,
  motion,
} from "framer-motion";
import React, { memo } from "react";
import { IoIosArrowDown } from "react-icons/io";

import BackgroundOverlay from "./BackgroundOverlay";
import { variants } from "./animations";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface SheetHeaderProps {
  position: string;
  onClose: () => void;
}

const sheetStyles = {
  wrapper: "fixed inset-0 z-50 transform-gpu",
  content: "relative flex flex-col h-full overflow-hidden",
  sheet:
    "rounded-t-16 border-gray-20 fixed bottom-0 left-0 right-0 z-50 flex origin-bottom flex-col bg-white shadow-lg will-change-transform",
  animatedElement: "will-change-transform transition-transform",
  closeIcon:
    "absolute top-4 right-4 p-3 cursor-pointer text-gray-600 hover:text-gray-800",
} as const;

const SheetHeader: React.FC<SheetHeaderProps> = memo(
  ({ position, onClose }) => (
    <div className="relative flex-none cursor-pointer pt-12">
      <Scroll className="mx-auto" />
      {position === "full" && (
        <div
          className={sheetStyles.closeIcon}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <IoIosArrowDown size={24} />
        </div>
      )}
    </div>
  ),
);

SheetHeader.displayName = "SheetHeader";

const SheetContent = memo(({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 overflow-y-auto px-16">{children}</div>
));

interface BottomSheetContentProps {
  children: React.ReactNode;
  controls: AnimationControls;
  onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  isClosing: boolean;
  onAnimationComplete: () => void;
  position: string;
}

const BottomSheetContent = memo(
  ({
    children,
    controls,
    onDragEnd,
    isClosing,
    onAnimationComplete,
    position,
  }: BottomSheetContentProps) => {
    const dragConstraints = React.useMemo(() => ({ top: 0, bottom: 0 }), []);

    return (
      <motion.div
        className={sheetStyles.sheet}
        style={{
          height: "50vh",
          contain: "layout paint size",
        }}
        drag="y"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
        animate={controls}
        initial="closed"
        exit="closed"
        variants={variants}
        transformTemplate={({ y, scaleY }) =>
          `translateY(${y}) scaleY(${scaleY})`
        }
        onAnimationComplete={() => {
          if (isClosing) {
            onAnimationComplete();
          }
        }}
        layoutId="bottomSheet"
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SheetHeader) {
            return React.cloneElement(
              child as React.ReactElement<SheetHeaderProps>,
              { position },
            );
          }
          return child;
        })}
      </motion.div>
    );
  },
);

function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const {
    controls,
    position,
    isClosing,
    handleClose,
    handleDragEnd,
    handleAnimationComplete,
  } = useBottomSheet({ isOpen, onClose });

  return (
    <>
      <AnimatePresence>
        {isOpen && !isClosing && <BackgroundOverlay />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {(isOpen || isClosing) && (
          <BottomSheetContent
            controls={controls}
            onDragEnd={handleDragEnd}
            isClosing={isClosing}
            onAnimationComplete={handleAnimationComplete}
            position={position}
          >
            <SheetHeader onClose={handleClose} position={position} />
            <SheetContent>{children}</SheetContent>
          </BottomSheetContent>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(BottomSheet);
