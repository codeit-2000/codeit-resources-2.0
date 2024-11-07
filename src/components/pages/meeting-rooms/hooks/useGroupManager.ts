import pickedReservationAtom from "@/components/pages/meeting-rooms/context/pickedReservation";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { TimeSlot } from "../components/TimeLine/TimeLineType";

function useGroupManager(timeSlots: TimeSlot[], groupType: "hover" | "picked") {
  const [pickedReservation, setPickedReservationAtom] = useAtom(
    pickedReservationAtom,
  );
  const [reservationId, setReservationId] = useState<string | undefined>(
    undefined,
  );
  const [groupFirstIndex, setGroupFirstIndex] = useState<number | null>(null);
  const [groupLastIndex, setGroupLastIndex] = useState<number | null>(null);

  const handleGroup = (id: string | undefined) => {
    setReservationId(id);
  };

  useEffect(() => {
    if (!pickedReservation) return;
    setReservationId(pickedReservation.id);
  }, [pickedReservation]);

  useEffect(() => {
    if (reservationId) {
      const indices = timeSlots
        .map((slot, index) =>
          slot.reservation?.id === reservationId ? index : -1,
        )
        .filter((index) => index !== -1);

      if (indices.length > 0) {
        setGroupFirstIndex(indices[0]);
        setGroupLastIndex(indices[indices.length - 1]);
      } else {
        setGroupFirstIndex(null);
        setGroupLastIndex(null);
      }
    } else {
      setGroupFirstIndex(null);
      setGroupLastIndex(null);
    }
  }, [reservationId, timeSlots]);

  return {
    reservationId,
    groupFirstIndex,
    groupLastIndex,
    handleGroup,
    groupType, // 그룹 타입을 반환해 필요할 때 조건문으로 구분 가능
  };
}

export default useGroupManager;
