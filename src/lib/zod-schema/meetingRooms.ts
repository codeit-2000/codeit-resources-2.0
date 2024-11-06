import { z } from "zod";

const meetingRoomZodSchema = z.object({
  resourceSubtype: z
    .string()
    .trim()
    .min(1, { message: "회의실 분류는 필수값 입니다." })
    .max(10, { message: "회의실 분류는 최대 10글자까지만 가능합니다." }),
  name: z
    .string()
    .trim()
    .min(1, { message: "회의실 이름은 필수값 입니다." })
    .max(10, { message: "회의실 이름은 최대 10글자까지만 가능합니다." }),
});

export { meetingRoomZodSchema };
