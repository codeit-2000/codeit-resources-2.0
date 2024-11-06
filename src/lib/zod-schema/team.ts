import { z } from "zod";

const teamZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "팀 이름은 필수값 입니다." })
    .max(20, { message: "팀 이름은 최대 20글자까지만 가능합니다." }),
});

export { teamZodSchema };
