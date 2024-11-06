import dayjs from "dayjs";

export interface TimeSlot {
  time: string;
  isHalfHour: boolean;
  isCurrentTime?: boolean;
  isTestCurrentTime?: boolean;
  reservation?: {
    startTime: string;
    endTime: string;
  };
}

// utils/createTime.ts
export const formatDisplayTime = (hour: number, minute: number): string =>
  `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

export const createTimeSlots = (length: number = 48) => {
  // 00:00 ~ 23:30 슬롯 생성
  const slots = Array.from({ length }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = index % 2 === 0 ? 0 : 30;
    return {
      hour,
      minute,
      time: formatDisplayTime(hour, minute),
      isHalfHour: index % 2 !== 0,
    };
  });

  // 24:00 슬롯 추가
  slots.push({
    hour: 24,
    minute: 0,
    time: "24:00",
    isHalfHour: false,
  });

  return slots;
};

export const getCurrentTime = (): string => dayjs().format("HH:MM");
