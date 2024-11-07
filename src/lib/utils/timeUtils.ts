import dayjs from "dayjs";

/**
 * 현재 시간을 "HH:MM" 형식으로 반환합니다.
 *
 * @returns 현재 시간 문자열 (예: "14:30")
 */
export function getCurrentTime(): string {
  const now = dayjs().locale("ko");
  return now.format("HH:mm");
}

/**
 * 00:00부터 24:00까지 지정된 간격으로 시간 슬록을 생성합니다.
 *
 * @param intervalMinutes - 시간 간격 (분 단위). 기본값은 30분입니다.
 * @returns "HH:MM" 형식의 시간 문자열 배열
 */
export function generateTimeSlots(intervalMinutes: number = 30): string[] {
  const slots: string[] = [];

  // eslint-disable-next-line
  for (let hour = 0; hour <= 24; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      // 24:00 외의 24:30, 24:60 등은 제외
      // eslint-disable-next-line
      if (hour === 24 && min !== 0) continue;

      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMin = min.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMin}`);
    }
  }

  return slots;
}

/**
 * 현재 시간부터 24:00까지의 시간 슬록을 필터링합니다.
 *
 * @param timeSlots - 전체 시간 슬록 배열 ("HH:MM" 형식)
 * @param currentTime - 현재 시간 ("HH:MM" 형식)
 * @returns 현재 시간 이후의 시간 슬록 배열
 */
export function getAvailableTimeSlots(
  timeSlots: string[],
  currentTime: string,
): string[] {
  // 현재 시간을 분 단위로 변환
  const [currentHour, currentMin] = currentTime.split(":").map(Number);
  const currentTotalMinutes = currentHour * 60 + currentMin;

  return timeSlots.filter((slot) => {
    const [slotHour, slotMin] = slot.split(":").map(Number);
    const slotTotalMinutes = slotHour * 60 + slotMin;
    return slotTotalMinutes >= currentTotalMinutes;
  });
}

/**
 * "HH:MM" 형식의 시간을 분 단위의 숫자로 변환합니다.
 *
 * @param time - "HH:MM" 형식의 시간 문자열 (예: "14:30")
 * @returns 총 분 수 또는 유효하지 않은 형식일 경우 null
 */
export function convertTimeToMinutes(time: string): number {
  if (time === "00:00") return 0;

  const MINUTES_PER_HOUR = 60;
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(\.\d{1,3})?)?$/;
  const match = time.match(timePattern);

  if (!match) {
    // 24:00 특별 케이스 처리
    if (time === "12:00") return 12 * MINUTES_PER_HOUR;
    if (time === "24:00") return 24 * MINUTES_PER_HOUR;
    return 0; // 유효하지 않은 형식
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  return hours * MINUTES_PER_HOUR + minutes;
}

export function compareTimes(time1: string, time2: string) {
  const minutes1 = convertTimeToMinutes(time1);
  const minutes2 = convertTimeToMinutes(time2);

  return minutes1 < minutes2;
}

/**
 * 종료 시간이 시작 시간보다 늦은지 확인합니다.
 *
 * @param startTime - 시작 시간 문자열 ("HH:MM" 형식)
 * @param endTime - 종료 시간 문자열 ("HH:MM" 형식)
 * @returns 종료 시간이 시작 시간보다 늦으면 true, 그렇지 않으면 false
 */
export function isEndTimeAfterStartTime(
  startTime: string,
  endTime: string,
): boolean {
  // const result = compareTimes(startTime, endTime);
  // if (!result) throw new Error("종료 시간은 시작 시간보다 늦어야 합니다.");
  // return result;

  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) {
    return false; // 유효하지 않은 시간 형식
  }

  // "24:00" 처리 - 종료 시간이 정확히 24:00일 경우 다음날로 설정
  if (endTime === "24:00") {
    return true;
  }

  return endMinutes > startMinutes;
}

export function add30Minutes(time: string): string {
  // 시간을 ':'를 기준으로 분할하고, 숫자로 변환합니다.
  const [hourStr, minuteStr] = time.split(":");
  let hours = parseInt(hourStr, 10);
  let minutes = parseInt(minuteStr, 10);

  minutes += 30;

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  }

  if (hours >= 24) {
    hours -= 24;
  }

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
/**
 * 특정 시간이 주어진 시작 시간과 종료 시간 사이에 있는지 확인하는 함수
 * @param startTime - 시작 시간 문자열 ("HH:MM" 형식)
 * @param endTime - 종료 시간 문자열 ("HH:MM" 형식)
 * @param targetTime - 확인할 특정 시간 ("HH:MM" 형식)
 * @returns {boolean} - targetTime이 startTime과 endTime 사이에 있으면 true, 그렇지 않으면 false
 */

export function isTimeInRange(
  startTime: string,
  endTime: string,
  targetTime: string,
): boolean {
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);
  const targetMinutes = convertTimeToMinutes(targetTime);

  return targetMinutes >= startMinutes && targetMinutes < endMinutes;
}

/**
 * 현재 시간을 30분 단위로 반올림하여 "HH:MM" 형식으로 반환합니다.
 *
 * @returns 현재 시간 문자열 (예: "14:30" 또는 "14:00")
 */
export function getRoundedCurrentTime(): string {
  const currentTime = getCurrentTime();
  const [currentHour, currentMinute] = currentTime.split(":").map(Number);

  // 30분 단위로 반올림
  const currentPeriod = `${currentHour.toString().padStart(2, "0")}:${
    currentMinute >= 30 ? "30" : "00"
  }`;

  return currentPeriod;
}

export function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
) {
  const startMinutes1 = convertTimeToMinutes(start1) || 0;
  const endMinutes1 = convertTimeToMinutes(end1) || 0;
  const startMinutes2 = convertTimeToMinutes(start2) || 0;
  const endMinutes2 = convertTimeToMinutes(end2) || 0;

  return startMinutes1 < endMinutes2 && startMinutes2 < endMinutes1;
}

export function formatDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function getTodayAndTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return [formatDate(today), formatDate(tomorrow)];
}

export function formatDayToISO(day: string) {
  const year = new Date().getFullYear();
  const [month, date] = day.replace("일", "").split("월 ").map(Number);

  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}
