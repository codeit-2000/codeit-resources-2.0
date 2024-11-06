import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface FixedSeatInfo {
  resourceId: string;
  status: "fixed";
  participant: string;
  name: string;
}

interface EnableAndDisabledSeatInfo {
  resourceId: string;
  status: "enable" | "disabled";
  participant?: never;
  name: string;
}

type SeatInfo = FixedSeatInfo | EnableAndDisabledSeatInfo | null;

interface DrawerContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  seatInfo: SeatInfo;
  setSeatInfo: Dispatch<SetStateAction<SeatInfo>>;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("Drawer 컨텍스트를 호출할 수 없는 범위입니다.");
  }

  return context;
}

export default function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seatInfo, setSeatInfo] = useState<SeatInfo>(null);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, seatInfo, setSeatInfo }),
    [isOpen, seatInfo],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}
