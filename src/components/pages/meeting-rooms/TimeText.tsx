import pickedDateAtom from "@/components/pages/meeting-rooms/context/pickedDate";
import { TimeSlot } from "@/components/pages/meeting-rooms/types/TimeLinetypes";
import clsx from "clsx";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";

type TimeTextProps = Pick<
  TimeSlot,
  "isHalfHour" | "time" | "isCurrentTimePeriod"
>;
/* 상단 시간 텍스트 */
export function TimeText({
  isHalfHour,
  time,
  isCurrentTimePeriod,
}: TimeTextProps) {
  const pickedDate = useAtomValue(pickedDateAtom);
  const currentDay = dayjs().format("YYYY-MM-DD");
  const isToday = pickedDate === currentDay;

  return (
    <div className="relative mb-7 md:absolute md:bottom-40 md:mb-[6rem] md:w-72">
      {!isHalfHour && time && (
        <span
          className={clsx(
            "-mt-32 ml-[-14px] text-12-700 md:ml-[-17px] md:text-14-700",
            {
              "text-[#979698]": !isToday || !isCurrentTimePeriod,
              "text-black": isToday && isCurrentTimePeriod,
            },
          )}
        >
          {time}
        </span>
      )}
    </div>
  );
}
