import { Reservation, ResourceType } from "@/lib/api/amplify/helper";

const RESOURCE_EMPTY_INFO: Record<ResourceType, Record<string, string>> = {
  ROOM: {
    desc: "오늘 예정된 미팅이 없어요.",
    buttonText: "미팅 잡기",
    to: "/meeting-rooms",
  },
  SEAT: {
    desc: "오늘 예약된 좌석이 없어요.",
    buttonText: "좌석 예약하기",
    to: "/seats",
  },
  EQUIPMENT: {
    desc: "대여 예정인 장비가 없어요.",
    buttonText: "장비 대여 신청하기",
    to: "/equipments",
  },
};

export const getResourceDetails = (reservation: Reservation) => {
  const { title, resourceType, resourceName, date, startTime, endTime } =
    reservation;

  const resourceDetails = {
    ROOM: {
      title: title || "예약 정보",
      desc: `${startTime} ~ ${endTime}`,
      badgeText: "진행 중",
      buttonText: "회의 종료",
    },
    SEAT: {
      title: resourceName,
      desc: date,
      badgeText: "사용 중",
      buttonText: "좌석 반납",
    },
    EQUIPMENT: {
      title: resourceName,
      desc: `${startTime} ~ ${endTime}`,
      badgeText: "사용 중",
      buttonText: "장비 반납",
    },
  };

  return resourceDetails[resourceType];
};

export default RESOURCE_EMPTY_INFO;
