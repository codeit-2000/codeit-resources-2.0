import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import { targetRefAtom } from "@/components/pages/meeting-rooms/context/scroll";
import useIsMobile from "@/hooks/useIsMobile";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { compareTimes, getRoundedCurrentTime } from "@/lib/utils/timeUtils";
import { createTimeSlots } from "@/utils/createTime";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import ThirtyMinutesTimeBox from "./ThirtyMinutesTimeBox";

interface TimeLineProps {
  isHeaderShow: boolean;
  room: Resource;
  reservations?: Reservation[];
}

function TimeLine({ isHeaderShow, room, reservations = [] }: TimeLineProps) {
  const [hoveredReservationId, setHoveredReservationId] = useState<
    string | undefined
  >(undefined);
  const [hoverGroupFirstIndex, setHoverGroupFirstIndex] = useState<
    number | null
  >(null);
  const [hoverGroupLastIndex, setHoverGroupLastIndex] = useState<number | null>(
    null,
  );

  const handleHoverGroup = (reservationId: string | undefined) => {
    setHoveredReservationId(reservationId);
  };

  const isMobile = useIsMobile();

  const currentPeriod = getRoundedCurrentTime();

  const pickedDate = useAtomValue(pickedDateAtom);
  const currentDay = dayjs().format("YYYY-MM-DD");
  const isToday = pickedDate === currentDay;

  const roomReservations = reservations.filter(
    (reservation) => reservation.resourceName === room.name,
  );

  const timeSlots = createTimeSlots().map((slot) => {
    const reservation = roomReservations?.find(
      (res) =>
        compareTimes(slot.time, res.endTime) &&
        compareTimes(res.startTime, slot.time, true),
    );

    const isCurrentTimePeriod = slot.time === currentPeriod;

    return {
      ...slot,
      reservation,
      hasReservation: !!reservation,
      isCurrentTimePeriod,
    };
  });

  const timelineWidth = isMobile
    ? `${timeSlots.length * 48}px`
    : `${timeSlots.length * 72}px`;

  // 호버된 예약의 첫 번째와 마지막 인덱스 계산
  useEffect(() => {
    if (hoveredReservationId) {
      const indices = timeSlots
        .map((slot, index) =>
          slot.reservation?.id === hoveredReservationId ? index : -1,
        )
        .filter((index) => index !== -1);
      if (indices.length > 0) {
        setHoverGroupFirstIndex(indices[0]);
        setHoverGroupLastIndex(indices[indices.length - 1]);
      } else {
        setHoverGroupFirstIndex(null);
        setHoverGroupLastIndex(null);
      }
    } else {
      setHoverGroupFirstIndex(null);
      setHoverGroupLastIndex(null);
    }
  }, [hoveredReservationId, timeSlots]);

  const targetRef = useAtomValue(targetRefAtom);

  return (
    <div className="no-scrollbar relative mb-[-1px] w-full overflow-x-auto pb-24 pl-30 pt-27 md:overflow-visible md:py-0">
      <ul className="flex h-full md:h-75" style={{ width: timelineWidth }}>
        {timeSlots.map((slot, index) => {
          const isHovered =
            (hoveredReservationId &&
              slot.reservation?.id === hoveredReservationId) ||
            false;
          const isFirstInHoverGroup =
            isHovered && index === hoverGroupFirstIndex;
          const isLastInHoverGroup = isHovered && index === hoverGroupLastIndex;

          return (
            <ThirtyMinutesTimeBox
              key={slot.time}
              slot={{
                ...slot,
                isHovered,
                isFirstInHoverGroup,
                isLastInHoverGroup,
              }}
              onHoverGroup={handleHoverGroup}
              isHeaderShow={isHeaderShow}
              room={room}
              ref={slot.isCurrentTimePeriod && isToday ? targetRef : null}
              hoveredReservationId={hoveredReservationId || "0"}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default TimeLine;
