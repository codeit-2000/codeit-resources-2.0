import { useAtomValue } from "jotai";

import pickedReservationAtom from "../context/pickedReservation";
import { useGetReservations } from "./useGetReservations";

function useReservationTimeValidation() {
  const { roomReservations } = useGetReservations();
  const pickedReservation = useAtomValue(pickedReservationAtom);

  const hasTimeConflict = (
    startTime: string,
    endTime: string,
    resourceId: string,
  ) => {
    // 데이터가 없는 경우 충돌이 없는 것으로 처리
    if (!roomReservations.data || roomReservations.data.length === 0) {
      return false;
    }

    return roomReservations.data.some((reservation) => {
      if (pickedReservation?.id && reservation.id === pickedReservation.id) {
        return false;
      }

      if (reservation.resourceId !== resourceId) {
        return false;
      }

      const isOverlapping =
        (startTime >= reservation.startTime &&
          startTime < reservation.endTime) ||
        (endTime > reservation.startTime && endTime <= reservation.endTime) ||
        (startTime <= reservation.startTime && endTime >= reservation.endTime);

      return isOverlapping;
    });
  };

  // roomReservations의 로딩 상태를 반환
  const isLoading = !roomReservations.data;

  return {
    hasTimeConflict,
    isLoading,
  };
}

export default useReservationTimeValidation;
