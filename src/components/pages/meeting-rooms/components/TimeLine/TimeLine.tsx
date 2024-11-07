import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import useIsMobile from "@/hooks/useIsMobile";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { compareTimes, getRoundedCurrentTime } from "@/lib/utils/timeUtils";
import { targetRefAtom } from "@/store/scrollAtom";
import { createTimeSlots } from "@/utils/createTime";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";

import useGroupManager from "../../hooks/useGroupManager";
import ThirtyMinutesTimeBox from "./ThirtyMinutesTimeBox";

interface TimeLineProps {
  isHeaderShow: boolean;
  room: Resource;
  reservations?: Reservation[];
}

function TimeLine({ isHeaderShow, room, reservations = [] }: TimeLineProps) {
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

  const hoverGroup = useGroupManager(timeSlots, "hover");
  const pickedGroup = useGroupManager(timeSlots, "picked");

  const targetRef = useAtomValue(targetRefAtom);

  return (
    <div className="no-scrollbar relative mb-[-1px] w-full overflow-x-auto pb-24 pl-30 pt-27 md:overflow-visible md:py-0">
      <ul className="flex h-full md:h-75" style={{ width: timelineWidth }}>
        {timeSlots.map((slot, index) => {
          const isHovered =
            (hoverGroup.reservationId &&
              slot.reservation?.id === hoverGroup.reservationId) ||
            false;
          const isFirstInHoverGroup =
            isHovered && index === hoverGroup.groupFirstIndex;
          const isLastInHoverGroup =
            isHovered && index === hoverGroup.groupLastIndex;

          const isPicked =
            (pickedGroup.reservationId &&
              slot.reservation?.id === pickedGroup.reservationId) ||
            false;
          const isFirstInPickedGroup =
            isPicked && index === pickedGroup.groupFirstIndex;
          const isLastInPickedGroup =
            isPicked && index === pickedGroup.groupLastIndex;

          return (
            <ThirtyMinutesTimeBox
              key={slot.time}
              slot={{
                ...slot,
                isHovered,
                isFirstInHoverGroup,
                isLastInHoverGroup,
                isFirstInPickedGroup,
                isLastInPickedGroup,
              }}
              onHoverGroup={hoverGroup.handleGroup}
              isHeaderShow={isHeaderShow}
              room={room}
              ref={slot.isCurrentTimePeriod && isToday ? targetRef : null}
              hoveredReservationId={hoverGroup.reservationId || "0"}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default TimeLine;
