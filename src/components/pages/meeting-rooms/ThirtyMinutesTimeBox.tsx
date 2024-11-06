/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import pickedReservationAtom from "@/components/pages/meeting-rooms/context/pickedReservation";
import useReservationAction from "@/components/pages/meeting-rooms/hooks/useReservationAction";
import { TimeSlot } from "@/components/pages/meeting-rooms/types/TimeLinetypes";
import { Reservation, Resource } from "@/lib/api/amplify/helper";
import { isTimeInRange } from "@/lib/utils/timeUtils";
import { userAtom } from "@/store/authUserAtom";
import { tempSelectedTimeAtom } from "@/store/tempSelectedTimeAtom";
import XButton from "@public/icons/icon-x-button.svg";
import clsx from "clsx";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { LegacyRef, forwardRef } from "react";

import { TimeText } from "./TimeText";
import { Tooltip } from "./Tooltip";
import useTimeSlot from "./useTimeSlot";

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
        "absolute z-10 w-1",
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
            className="absolute -right-8 -top-8"
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

  const {
    isMyReservation,
    isMyReservationNotExpired,
    handleClick,
    isPastTime,
  } = useTimeSlot({
    slot,
    onHoverGroup,
    room,
  });

  const pickedReservation = useAtomValue(pickedReservationAtom);

  const tempSelectedTime = useAtomValue(tempSelectedTimeAtom);

  const handleMouseEnter = () => {
    // 기본: 호버 그룹에 추가
    if (reservation?.id) onHoverGroup(reservation.id);
    // 예약이 존재하고, 다른 사람 예약 || 지난 내 예약일 경우 툴팁 표시
  };

  const handleMouseLeave = () => {
    onHoverGroup(undefined);
  };

  const isPickedTimeSlot =
    (tempSelectedTime?.resourceId === room.id &&
      isTimeInRange(
        tempSelectedTime?.startTime || "",
        tempSelectedTime?.endTime || "",
        time || "",
      )) ||
    (pickedReservation?.resourceId === room.id &&
      isTimeInRange(
        pickedReservation?.startTime || "",
        pickedReservation?.endTime || "",
        time || "",
      ));

  /** 스타일 코드 */
  const MyReservationClass = {
    TIME_SLOT_BAR:
      ((hasReservation && isMyReservation) || isPickedTimeSlot) &&
      "bg-purple-70",
    TIME_SLOT_HOVER_GROUP:
      ((hasReservation && isMyReservation) || isPickedTimeSlot) &&
      clsx("bg-[#ede2f9]", {
        // 단일 박스 (모든 보더)
        "shadow-[inset_0px_0px_0px_1px_#D4A4F9]":
          slot.isFirstInHoverGroup && slot.isLastInHoverGroup,
        // 시작 박스 (왼쪽 보더 포함)
        "shadow-[inset_1px_1px_0px_0px_#D4A4F9,inset_0px_-1px_0px_0px_#D4A4F9]":
          slot.isFirstInHoverGroup && !slot.isLastInHoverGroup,

        // 끝 박스 (오른쪽 보더 포함)
        "shadow-[inset_-1px_1px_0px_0px_#D4A4F9,inset_0px_-1px_0px_0px_#D4A4F9]":
          slot.isLastInHoverGroup && !slot.isFirstInHoverGroup,

        // 중간 박스 (가로 보더만)
        "shadow-[inset_0px_1px_0px_0px_#D4A4F9,inset_0px_-1px_0px_0px_#D4A4F9]":
          !slot.isFirstInHoverGroup && !slot.isLastInHoverGroup,
      }),
  };

  const PickedReservationClass = {
    TIME_SLOT_BAR:
      isPickedTimeSlot &&
      ((hasReservation &&
        (!isMyReservation || (isMyReservation && !pickedReservation?.id)) &&
        "bg-red-600") ||
        "bg-purple-70"),
    TIME_SLOT_HOVER_GROUP:
      isPickedTimeSlot &&
      ((hasReservation &&
        (!isMyReservation || (isMyReservation && !pickedReservation?.id)) &&
        "bg-[#FBDBE366] shadow-[inset_0_0_0_1px_#D6173A66]") ||
        "bg-[#ede2f9] shadow-[inset_0_0_0_1px_#D4A4F9]"),

    TIME_SLOT_GROUP:
      isPickedTimeSlot &&
      ((hasReservation &&
        (!isMyReservation || (isMyReservation && !pickedReservation?.id)) &&
        "bg-[#FBDBE366] shadow-[inset_0_0_0_1px_#D6173A66]") ||
        "bg-[#ede2f9] shadow-[inset_0_0_0_1px_#D4A4F9]"),
  };

  const otherReservationClass = {
    TIME_SLOT_BAR: hasReservation && !isMyReservation && "bg-gray-40",
    TIME_SLOT_HOVER_GROUP:
      hasReservation &&
      !isMyReservation &&
      "bg-gray-100-opacity-10 shadow-[inset_0_0_0_1px_#413B541A] [&_.time-slot-bar]:bg-gray-80",
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
              (!isMyReservationNotExpired || !isMyReservation) && (
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
