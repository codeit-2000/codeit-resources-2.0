import {
  RESERVATION_STATUS,
  RESOURCE_TYPE,
  ResourceType,
} from "@/lib/api/amplify/helper";

const RESOURCE_LABELS: Record<ResourceType, string> = {
  ROOM: "회의",
  SEAT: "좌석",
  EQUIPMENT: "장비",
} as const;

export { RESOURCE_TYPE, RESOURCE_LABELS, RESERVATION_STATUS };
