import { z } from "zod";

import { isEndTimeAfterStartTime } from "../utils/timeUtils";

const reservationSchema = z
  .object({
    title: z.string().min(1, "미팅 제목을 입력해주세요"),
    resourceId: z.string().min(1, "선택해주세요"),
    startTime: z
      .string()
      .min(1, "필수 입력란")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "유효하지 않은 형식"),

    endTime: z
      .string()
      .min(1, "필수 입력란")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "유효하지 않은 형식"),

    participants: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          departments: z.array(z.string()),
          profileImage: z.string(),
        }),
      )
      .min(1, "참여자를 등록해주세요")
      .max(30, "참여자는 최대 30명까지 가능합니다"),
  })
  .refine(
    (data) => {
      const { startTime, endTime } = data;

      if (startTime && endTime) {
        return isEndTimeAfterStartTime(startTime, endTime);
      }
      return true;
    },
    {
      message: "유효한 시간대를 입력해주세요",
      path: ["startTime", "endTime"],
    },
  );

export { reservationSchema };
