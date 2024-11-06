import { Reservation } from "@/lib/api/amplify/helper";
import { atom } from "jotai";

export type PickedReservationAtom = Partial<Reservation>;

const pickedReservationAtom = atom<PickedReservationAtom | null>({
  resourceSubtype: "",
  resourceName: "",
  startTime: "",
  endTime: "",
  participants: [],
});

export default pickedReservationAtom;
