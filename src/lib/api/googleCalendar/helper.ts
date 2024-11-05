import axios from "axios";

export const BASE_URL = "https://www.googleapis.com/calendar/v3";

/**
 * 각 엔드포인트에 동적으로 필요한 ID를 추가하는 함수
 */
export const END_POINTS = {
  calendarList: `/users/me/calendarList`,

  // 기본 유저 calenderID는 소셜 로그인 계정 메일입니다. 예) eprnf21@dev.resource.codeit.kr
  events: (calendarID: string) => `/calendars/${calendarID}/events`,

  event: (calendarID: string, eventID: string) =>
    `/calendars/${calendarID}/events/${eventID}`,
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
