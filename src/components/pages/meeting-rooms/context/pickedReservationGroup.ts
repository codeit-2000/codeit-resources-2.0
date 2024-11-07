import { atom } from "jotai";

import { TimeSlot } from "../components/TimeLine/TimeLineType";

export type PickedReservationSlot = TimeSlot;

export const pickedReservationGroupAtom = atom<PickedReservationSlot[]>([]);

export const addReservationSlotAtom = atom(
  null,
  (get, set, newSlot: TimeSlot) => {
    const currentSlots = get(pickedReservationGroupAtom);

    const updatedSlots = [
      ...currentSlots,
      { ...newSlot, isFirstInPickedGroup: false, isLastInPickedGroup: false },
    ].map((slot, index, arr) => ({
      ...slot,
      isFirstInPickedGroup: index === 0,
      isLastInPickedGroup: index === arr.length - 1,
    }));

    set(pickedReservationGroupAtom, updatedSlots);
  },
);

export const removeReservationSlotAtom = atom(
  null,
  (get, set, slotToRemove: TimeSlot) => {
    const currentSlots = get(pickedReservationGroupAtom);

    const updatedSlots = currentSlots
      .filter((slot) => slot.time !== slotToRemove.time)
      .map((slot, index, arr) => ({
        ...slot,
        isFirstInPickedGroup: index === 0,
        isLastInPickedGroup: index === arr.length - 1,
      }));

    set(pickedReservationGroupAtom, updatedSlots);
  },
);

export default pickedReservationGroupAtom;
