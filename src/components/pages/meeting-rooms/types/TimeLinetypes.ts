import { Reservation } from "@/lib/api/amplify/helper";

export interface TimeSlot {
  time: string; // 슬롯의 시간 (예: "09:00")
  reservation?: Reservation; // 슬롯에 연결된 예약 객체
  hasReservation: boolean; // 예약 여부
  isCurrentTimePeriod: boolean; // 현재 시간대와 일치하는지 여부
  isHalfHour: boolean; // 30분 간격인지 여부
  isHovered?: boolean; // 예약이 호버 중인지 여부
  isFirstInHoverGroup?: boolean;
  isLastInHoverGroup?: boolean;
}
