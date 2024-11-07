import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import pickedReservationAtom from "@/components/pages/meeting-rooms/context/pickedReservation";
import { Resource } from "@/lib/api/amplify/helper";
import {
  add30Minutes,
  convertTimeToMinutes,
  getCurrentTime,
  isTimeOverlap,
} from "@/lib/utils/timeUtils";
import { userAtom } from "@/store/authUserAtom";
import { isOpenDrawerAtom } from "@/store/isOpenDrawerAtom";
import { todayDateAtom } from "@/store/todayDateAtom";
import dayjs from "dayjs";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";

import { TimeSlot } from "../components/TimeLine/TimeLineType";

export interface UseTimeSlotProps {
  slot: TimeSlot;
  room: Resource;
}

const useTimeSlot = ({ slot, room }: UseTimeSlotProps) => {
  // 1. 예약이 있을 경우
  //    - 지난 내 예약 (클릭/x, 호버/팝오버)
  //    - 내 예약 (클릭/드로어, 호버/삭제버튼)
  //    - 다른 사람 예약(클릭/x, 호버/팝오버)
  //
  // 2. 예약이 없을 경우
  //    - 예약 생성 드로어 (생성 시에만! 기존 예약이랑 겹치면 에러 표시)

  const { time, reservation } = slot;
  const pickedDate = useAtomValue(pickedDateAtom);

  const currentUser = useAtomValue(userAtom);
  const currentTime = getCurrentTime();

  const currentDate = useAtomValue(todayDateAtom).format("YYYY-MM-DD");

  const setIsOpenDrawer = useSetAtom(isOpenDrawerAtom);

  const [pickedReservation, setPickedReservation] = useAtom(
    pickedReservationAtom,
  );

  const isMyReservation = () => {
    if (!currentUser?.id || !reservation?.participants) return false;
    if (reservation.id === pickedReservation?.id) return false;
    return reservation.participants.includes(currentUser.id);
  };

  const isMyReservationNotExpired = () => {
    if (isMyReservation() && pickedDate !== currentDate) return true;
    if (!reservation?.endTime) return false;

    const timeCurrent = convertTimeToMinutes(currentTime) || 0;
    const timeEnd = convertTimeToMinutes(reservation.endTime) || 0;
    const isExpired = timeEnd <= timeCurrent;
    return isMyReservation() && !isExpired;
  };

  const isConflictReservation = () => {
    if (!reservation || !pickedReservation) return false;
    if (reservation.resourceId !== pickedReservation.resourceId) return false;
    if (reservation.id === pickedReservation.id) return false; // 자기 자신과의 비교 방지

    // 시간 겹침 여부 확인
    const start1 = reservation.startTime;
    const end1 = reservation.endTime;
    const start2 = pickedReservation.startTime as string;
    const end2 = pickedReservation.endTime as string;

    return isTimeOverlap(start1, end1, start2, end2);
  };

  const isPastTime = useMemo(() => {
    if (!time || !pickedDate || pickedDate !== currentDate) return false;
    const now = dayjs();
    const [hours, minutes] = time.split(":").map(Number);

    // 선택된 날짜와 시간을 합쳐서 비교
    const slotDateTime = dayjs(pickedDate).hour(hours).minute(minutes);
    const today = dayjs().startOf("day");

    // 오늘 날짜인 경우만 현재 시간과 비교
    if (slotDateTime.isSame(today, "day")) {
      return slotDateTime.isBefore(now);
    }

    // 다른 날짜는 모두 클릭 가능
    return false;
  }, [time, pickedDate]);

  function handleClick() {
    if (isPastTime) {
      return;
    }

    setPickedReservation(null);

    if (reservation) {
      // 1. 예약이 있을 경우
      if (isMyReservationNotExpired()) {
        // 1-1. 내 예약 && 지나지 않은 예약
        // setSelectedReservation(reservation);
        // setActiveRoom(room.name);
        setIsOpenDrawer(true);
        setPickedReservation(reservation);
      } else {
        // 1-2. 다른 사람 예약 || 지난 내 예약
        setIsOpenDrawer(false);
      }
    } else {
      // 2. 예약이 없을 경우
      setIsOpenDrawer(true);

      setPickedReservation({
        startTime: time,
        endTime: add30Minutes(time || ""),
        resourceSubtype: room.resourceSubtype,
        resourceName: room.name,
        resourceId: room.id,
      });
    }
  }

  return {
    isMyReservation: isMyReservation(),
    isMyReservationNotExpired: isMyReservationNotExpired(),
    isConflictReservation: isConflictReservation(),
    handleClick,
    isPastTime,
  };
};

export default useTimeSlot;
