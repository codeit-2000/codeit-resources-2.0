/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import pickedReservationAtom from "@/components/pages/meeting-rooms/context/pickedReservation";
import useReservationAction from "@/components/pages/meeting-rooms/hooks/useReservationAction";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { isTimeInRange } from "@/lib/utils/timeUtils";
import { userAtom } from "@/store/authUserAtom";
import XButton from "@public/icons/icon-x-button.svg";
import clsx from "clsx";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { LegacyRef, forwardRef, useEffect } from "react";

import useTimeSlot from "../../hooks/useTimeSlot";
import TimeSlotStyle from "./TIME_SLOT_STLYE";
import { TimeSlot } from "./TimeLineType";
import { TimeText } from "./TimeText";
import { Tooltip } from "./Tooltip";

type TimeVerticalLineProps = Pick<
  TimeSlot,
  "isHalfHour" | "isCurrentTimePeriod"
>;

export function TimeVerticalLine({
  isHalfHour,
  isCurrentTimePeriod,
}: TimeVerticalLineProps) {
  const pickedDate = useAtomValue(pickedDateAtom);
  const currentDay = dayjs().format("YYYY-MM-DD");
  const isToday = pickedDate === currentDay;

  return (
    <div
      className={clsx(
        "absolute z-[11] w-1",
        isToday && isCurrentTimePeriod
          ? "z-[11] h-full bg-black md:bottom-[-17px] md:h-147"
          : clsx(
              {
                "h-12 md:bottom-24 md:h-16": isHalfHour,
                "h-full md:bottom-[-17px] md:h-147": !isHalfHour,
              },
              "bg-gray-200",
            ),
      )}
    />
  );
}

interface ReservationBarProps {
  slot: TimeSlot;
  reservation?: Reservation;
  className?: string;
  isPastTime: boolean;
}

export function ReservationBar({
  slot,
  reservation,
  className,
  isPastTime,
}: ReservationBarProps) {
  const currentUser = useAtomValue(userAtom);
  const handleMutation = useReservationAction(reservation as Reservation);

  const isMyReservation = () => {
    if (!reservation) return false;
    if (!currentUser?.id || !reservation.participants) return false;
    return reservation.participants.includes(currentUser.id);
  };

  return (
    <>
      {isMyReservation() &&
        !isPastTime &&
        slot.reservation?.id &&
        slot.isLastInHoverGroup && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMutation.deleteRoomMutation();
            }}
            className="absolute -right-8 -top-8 z-[12]"
          >
            <XButton />
          </button>
        )}
      <div
        className={clsx(
          "time-slot-bar absolute top-21 z-[10] h-12 w-48 md:top-16 md:w-[72px]",
          className,
        )}
      />
    </>
  );
}

export function BottomDottedBar() {
  return (
    <div className="relative bottom-6 w-full border-b border-dotted border-gray-15 md:bottom-32" />
  );
}

export interface ThirtyMinutesTimeBoxProps {
  slot: TimeSlot;
  onHoverGroup: (id?: string) => void;
  isHeaderShow: boolean;
  room: Resource;
  hoveredReservationId: string;
}
function ThirtyMinutesTimeBox(
  {
    slot,
    onHoverGroup,
    isHeaderShow,
    room,
    hoveredReservationId,
  }: ThirtyMinutesTimeBoxProps,
  ref: LegacyRef<HTMLDivElement>,
) {
  const { time, reservation, isCurrentTimePeriod, hasReservation, isHalfHour } =
    slot;
  const is24Hour = time === "24:00";

  const pickedReservation = useAtomValue(pickedReservationAtom);

  const isPickedTimeSlot =
    pickedReservation?.resourceId === room.id &&
    isTimeInRange(
      pickedReservation?.startTime || "",
      pickedReservation?.endTime || "",
      time || "",
    );

  const {
    isMyReservation,
    isMyReservationNotExpired,
    isConflictReservation,
    handleClick,
    isPastTime,
  } = useTimeSlot({
    slot,
    room,
  });
  const isMyReservationOrPicked = isMyReservation || isPickedTimeSlot;

  const handleMouseEnter = () => {
    if (reservation?.id) onHoverGroup(reservation.id);
  };

  const handleMouseLeave = () => {
    onHoverGroup(undefined);
  };

  const {
    isFirstInHoverGroup,
    isLastInHoverGroup,
    isFirstInPickedGroup,
    isLastInPickedGroup,
  } = slot;

  // TODO 조건 변수로 분리
  // TODO 스타일  코드 분리
  // TODO picked 에 따른 분기 추가

  /** 스타일 코드 */
  const MyReservationClass = {
    TIME_SLOT_BAR: isMyReservationOrPicked && "bg-purple-70",
    TIME_SLOT_HOVER_GROUP:
      isMyReservationOrPicked &&
      TimeSlotStyle.purpleBorder(isFirstInHoverGroup, isLastInHoverGroup),
  };

  const PickedReservationClass = {
    TIME_SLOT_BAR:
      isPickedTimeSlot &&
      ((isConflictReservation && "bg-red-600") || "bg-purple-70"),
    TIME_SLOT_HOVER_GROUP:
      isPickedTimeSlot &&
      ((isConflictReservation &&
        TimeSlotStyle.redBorder(isFirstInHoverGroup, isLastInHoverGroup)) ||
        TimeSlotStyle.purpleBorder(isFirstInHoverGroup, isLastInHoverGroup)),
    TIME_SLOT_GROUP:
      isPickedTimeSlot &&
      ((isConflictReservation &&
        TimeSlotStyle.redBorder(isFirstInPickedGroup, isLastInPickedGroup)) ||
        TimeSlotStyle.purpleBorder(isFirstInPickedGroup, isLastInPickedGroup)),
  };

  const otherReservationClass = {
    TIME_SLOT_BAR: !isMyReservation && "bg-gray-40",
    TIME_SLOT_HOVER_GROUP:
      !isMyReservation &&
      clsx(
        `bg-[#3332361A] [&_.time-slot-bar]:bg-gray-80`, // 배경색 지정
        {
          // 단일 박스 (모든 보더)
          "shadow-[inset_0px_0px_0px_1px_#413B541A]":
            isFirstInHoverGroup && isLastInHoverGroup,

          // 시작 박스 (왼쪽 보더 포함)
          "shadow-[inset_1px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
            isFirstInHoverGroup && !isLastInHoverGroup,

          // 끝 박스 (오른쪽 보더 포함)
          "shadow-[inset_-1px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
            isLastInHoverGroup && !isFirstInHoverGroup,

          // 중간 박스 (가로 보더만)
          "shadow-[inset_0px_1px_0px_0px_#413B541A, inset_0px_-1px_0px_0px_#413B541A]":
            !isFirstInHoverGroup && !isLastInHoverGroup,
        },
      ),
  };

  const timeSlotBarClass = clsx(
    PickedReservationClass.TIME_SLOT_BAR,
    MyReservationClass.TIME_SLOT_BAR,
    otherReservationClass.TIME_SLOT_BAR,
  );

  const timeSlotHoverGroupClass = clsx(
    PickedReservationClass.TIME_SLOT_HOVER_GROUP,
    MyReservationClass.TIME_SLOT_HOVER_GROUP,
    otherReservationClass.TIME_SLOT_HOVER_GROUP,
  );

  const timeSlotClassBorder = clsx();

  return (
    <li
      className={clsx(
        "flex w-48 flex-col justify-end md:w-75",
        isPastTime && !hasReservation && "pointer-events-none",
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHeaderShow && (
        <TimeText
          isHalfHour={isHalfHour}
          isCurrentTimePeriod={isCurrentTimePeriod}
          time={time}
        />
      )}
      <div
        className="relative flex h-55 w-48 flex-col justify-end md:h-75 md:w-72"
        ref={ref}
      >
        {!is24Hour && (
          <>
            <div
              className={clsx(
                "absolute inset-0 left-1 z-20 -mx-1",
                PickedReservationClass.TIME_SLOT_GROUP,
                slot.isHovered && timeSlotHoverGroupClass,
                slot.isHovered && timeSlotClassBorder,
                !slot.isHovered &&
                  "hover:bg-gray-100-opacity-10 hover:shadow-[inset_0_0_0_1px_#413B541A]",
              )}
            >
              {(hasReservation || isPickedTimeSlot) && (
                <ReservationBar
                  reservation={reservation || undefined}
                  slot={slot}
                  className={timeSlotBarClass}
                  isPastTime={isPastTime}
                />
              )}
            </div>
            {slot.isFirstInHoverGroup &&
              slot.reservation?.id === hoveredReservationId &&
              reservation &&
              !isMyReservationNotExpired && (
                <span className="z-[21]">
                  <Tooltip
                    title={reservation?.title}
                    participants={reservation?.participants?.filter(
                      (p): p is string => p !== null,
                    )}
                  />
                </span>
              )}
          </>
        )}
        <TimeVerticalLine
          isHalfHour={isHalfHour}
          isCurrentTimePeriod={isCurrentTimePeriod}
        />
        {!is24Hour && <BottomDottedBar />}
      </div>
    </li>
  );
}

export default forwardRef(ThirtyMinutesTimeBox);
