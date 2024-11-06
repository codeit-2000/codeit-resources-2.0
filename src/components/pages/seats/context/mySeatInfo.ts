import { atom } from "jotai";

interface FixedSeatInfo {
  status: "fixed";
  reservationId?: never;
  seatName: string;
}

interface ConfirmedSeatInfo {
  status: "confirmed";
  reservationId: string;
  seatName: string;
}

type MySeatInfo = FixedSeatInfo | ConfirmedSeatInfo;

const mySeatInfoAtom = atom<MySeatInfo | null>(null);

export default mySeatInfoAtom;
