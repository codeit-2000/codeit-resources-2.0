/* eslint-disable no-plusplus */

/* eslint-disable @typescript-eslint/naming-convention */
import dayjs from "dayjs";

export interface getDaysUntilEndOfMonthReturnType {
  year: number;
  month: number;
  days: getDaysUntilEndOfMonthType[];
}
export interface getDaysUntilEndOfMonthType {
  id: string;
  day: string;
  weekday: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function getDaysUntilEndOfMonth(
  date: Date | string = new Date(),
): getDaysUntilEndOfMonthReturnType {
  // dayjs 객체로 변환하여 한국 시간 적용
  const current = dayjs(date).locale("ko");

  const year = current.year();
  const month = current.month() + 1; // 0부터 시작하므로 +1

  // 해당 월의 마지막 날 구하기
  const lastDay = current.endOf("month").date();

  const result: getDaysUntilEndOfMonthType[] = [];

  for (let day = current.date(); day <= lastDay; day++) {
    const currentDate = current.date(day);
    const weekday = WEEKDAYS[currentDate.day()];

    result.push({
      id: `${year}-${month}-${day}`,
      day: `${day}`,
      weekday: `${weekday}`,
    });
  }

  return {
    year,
    month,
    days: result,
  };
}
