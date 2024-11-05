import Arrow from "@/../public/icons/icon-double-right-arrow.svg";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DrawerProps {
  onClose: () => void;
  children: ReactNode; // 드로워 안에 내용들 children으로 채워주기
}

function Drawer({ onClose, children }: DrawerProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="fixed right-0 top-0 z-30 flex h-full w-full flex-col border border-l-gray-40 bg-white p-32 shadow-lg md:w-1/2 lg:w-1/3"
    >
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="absolute left-16 top-16"
          onClick={onClose}
        >
          <Arrow />
        </button>
        {children}
      </div>
    </motion.div>
  );
}

export default Drawer;
